'use client'

import { useEffect, useState } from "react"
import { useUser } from "../contexts/UserContext"
import { getNotificationsByUserId } from "@/api/notifications"
import { type Notification } from "@/types/Notifications"
import { DataTable } from "@/components/ui/data-table"
import { columns } from "@/components/pages/notifications/columns"

export default function ProfilePage() {
  const { user } = useUser()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoadingNotifications, setIsLoadingNotifications] = useState<boolean>(true)


  console.log(notifications);
  

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

  return (
    <div className="max-w-7xl p-6">
      <h1 className="text-center font-subHeading text-h2 font-bold text-secondary-foreground">
        Notifications
      </h1>

      <DataTable columns={columns} data={notifications} loading={isLoadingNotifications} />
    </div>
  )
}