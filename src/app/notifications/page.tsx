'use client'

import { useCallback, useEffect, useState } from 'react'
import { useUser } from '../contexts/UserContext'
import {
  deleteNotification,
  getNotificationsByUserId,
  markNotificationAsRead,
  markNotificationAsUnread,
} from '@/api/notifications'
import { type Notification } from '@/types/Notifications'
import { DataTable } from '@/components/ui/data-table'
import { getColumns } from '@/components/pages/notifications/columns'
import { toast } from '@/components/ui/use-toast'
import { REFRESH_INTERVALS } from '@/lib/constants/time'
import { clearNotificationsCookie } from '@/lib/cookies'

export default function ProfilePage() {
  const { user, loading } = useUser()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoadingNotifications, setIsLoadingNotifications] =
    useState<boolean>(true)

  // Fetch notifications only after the user is set
  useEffect(() => {
    const fetchNotifications = async () => {
      setIsLoadingNotifications(true)

      // Check if user id is defined before proceeding
      if (!user?.user) {
        console.warn('User ID is undefined.')
        return
      }

      try {
        const response = await getNotificationsByUserId(user.user) // Fetch projects for the user

        if (response.errorMessage) {
          console.error('Error fetching projects:', response.errorMessage)
          return
        }

        // Set the projects state with the fetched data
        setNotifications(response.data ?? [])
        setIsLoadingNotifications(false)
      } catch (error) {
        console.error('Error fetching projects:', error)
      }
    }

    void fetchNotifications()
  }, [user])

  const handleMarkNotificationAsRead = async (notification_id: string) => {
    try {
      if (loading) return

      if (!user?.user) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'You must be logged in to mark notification as read',
        })
        return
      }

      const response = await markNotificationAsRead(user?.user, notification_id)
      const { errorMessage, data } = response

      if (!errorMessage) {
        // optimistic update : change local state rather than full page reload
        setNotifications((prevNotifications) =>
          prevNotifications.map((notification) =>
            notification.notification_id === notification_id
              ? { ...notification, read: true }
              : notification
          )
        )
        toast({
          title: data?.message ?? 'Notification read!',
          description: 'You can mark this as unread if desired.',
        })

        clearNotificationsCookie()
      } else {
        // Show error toast if an error occurs
        toast({
          variant: 'destructive',
          title: 'Error',
          description: errorMessage,
        })
      }
    } catch (error) {
      console.error('Unexpected error:', error)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'There was an unexpected error reading your notification.',
      })
    }
  }

  const handleMarkNotificationAsUnread = async (notification_id: string) => {
    try {
      if (loading) return

      if (!user?.user) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'You must be logged in to mark notification as unread',
        })
        return
      }

      const response = await markNotificationAsUnread(user?.user, notification_id)
      const { errorMessage, data } = response

      if (!errorMessage) {
        // optimistic update : change local state rather than full page reload
        setNotifications((prevNotifications) =>
          prevNotifications.map((notification) =>
            notification.notification_id === notification_id
              ? { ...notification, read: false }
              : notification
          )
        )
        toast({
          title: data?.message ?? 'Notification marked as unread!',
          description: 'You can mark this as read if desired.',
        })

        clearNotificationsCookie()
      } else {
        // Show error toast if an error occurs
        toast({
          variant: 'destructive',
          title: 'Error',
          description: errorMessage,
        })
      }
    } catch (error) {
      console.error('Unexpected error:', error)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'There was an unexpected error unreading your notification.',
      })
    }
  }

  const handleDeleteNotification = async (notification_id: string) => {
    try {
      if (loading) return

      if (!user?.user) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'You must be logged in to delete a notification',
        })
        return
      }

      const response = await deleteNotification(user?.user, notification_id)
      const { errorMessage, data } = response

      if (!errorMessage) {
        // optimistic update : change local state rather than full page reload
        setNotifications((prevNotifications) =>
          prevNotifications.filter(
            (notification) => notification.notification_id !== notification_id
          )
        )
        toast({
          title: data?.message ?? 'Notification deleted!',
          description: 'Clean inbox, clean mind! 🧘‍♂️'
        })

        clearNotificationsCookie()
      } else {
        // Show error toast if an error occurs
        toast({
          variant: 'destructive',
          title: 'Error',
          description: errorMessage,
        })
      }
    } catch (error) {
      console.error('Unexpected error:', error)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'There was an unexpected error deleting your notification.',
      })
    }
  }

  const refreshNotifications = useCallback(async () => {
    if (!user?.user) return

    try {
      setIsLoadingNotifications(true)
      const response = await getNotificationsByUserId(user.user)

      if (response.errorMessage) {
        console.error('Error fetching notifications:', response.errorMessage)
        return
      }

      setNotifications(response.data ?? [])
    } catch (error) {
      console.error('Error refreshing notifications:', error)
    } finally {
      setIsLoadingNotifications(false)
    }
  }, [user?.user])

  useEffect(() => {
    const interval = setInterval(
      refreshNotifications,
      REFRESH_INTERVALS.CONSERVATIVE
    ) // refresh notifications every 3 minutes
    return () => clearInterval(interval)
  }, [refreshNotifications])

  const columns = getColumns({
    handleMarkNotificationAsRead,
    handleMarkNotificationAsUnread,
    handleDeleteNotification
  })

  return (
    <div className="max-w-7xl p-6">
      <h1 className="text-center font-subHeading text-h2 font-bold text-secondary-foreground">
        Notifications
      </h1>

      <DataTable
        columns={columns}
        data={notifications}
        loading={isLoadingNotifications}
      />
    </div>
  )
}
