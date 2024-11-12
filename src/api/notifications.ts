'use server'

import { type ApiResponse } from '@/types/Api'
import { type Notification } from '@/types/Notifications'


/**
 * Fetches all the notifications associated with a user by their ID from the backend.
 *
 * Args:
 *   user_id (string): The ID of the user.
 *
 * Returns:
 *   Promise<ApiResponse<Question[]>>: The notifications data on success, or an error message on failure.
 */
export const getNotificationsByUserId = async (
  user_id: string
): Promise<ApiResponse<Notification[]>> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/notifications/getByUserId/${user_id}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    if (!response.ok) {
      throw new Error('Network response was not ok')
    }

    const questionData = (await response.json()) as Notification[]
    return { errorMessage: null, data: questionData }
  } catch (error) {
    console.error('Error fetching notifications: ', error)
    return { errorMessage: 'Error fetching notifications' }
  }
}