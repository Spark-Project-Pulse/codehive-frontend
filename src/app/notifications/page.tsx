'use client'

import { useEffect, useState } from "react"
import { useUser } from "../contexts/UserContext"
import { getNotificationsByUserId } from "@/api/notifications"
import { type Notification } from "@/types/Notifications"

export default function ProfilePage() {
  const { user, loading } = useUser()
  const [notifications, setNotifications] = useState<Notification[]>([])

  console.log(notifications);
  

  // Fetch notifications only after the user is set
  useEffect(() => {
    const fetchNotifications = async () => {
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
      } catch (error) {
        console.error('Error fetching projects:', error)
      }
    }

    void fetchNotifications()

  }, [user])

  return (
    <></>
  )
}