'use server'

import { type ErrorResponse, type SuccessResponse, type ApiResponse } from '@/types/Api'
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

/**
 * Marks specified notification as read.
 *
 * @param user_id - The ID of the user
 * @param notification_id - The ID of the notification to mark as read
 * @returns Promise with success message or error details
 */
export const markNotificationAsRead = async (
  user_id: string,
  notification_id: string
): Promise<ApiResponse<{ message: string }>> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/notifications/markAsRead/${user_id}/${notification_id}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    if (!response.ok) {
      const responseData = (await response.json()) as ErrorResponse
      return {
        errorMessage: responseData.error ?? 'Network response was not ok',
      }
    }

    const responseData = (await response.json()) as SuccessResponse
    return { errorMessage: null, data: responseData }
  } catch (error) {
    console.error('Error fetching notifications: ', error)
    return { errorMessage: 'Error fetching notifications' }
  }
}

/**
 * Deletes specified notification.
 *
 * @param user_id - The ID of the user
 * @param notification_id - The ID of the notification to delete
 * @returns Promise with success message or error details
 */
export const deleteNotification = async (
  user_id: string,
  notification_id: string
): Promise<ApiResponse<{ message: string }>> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/notifications/delete/${user_id}/${notification_id}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    if (!response.ok) {
      const responseData = (await response.json()) as ErrorResponse
      return {
        errorMessage: responseData.error ?? 'Network response was not ok',
      }
    }

    const responseData = (await response.json()) as SuccessResponse
    return { errorMessage: null, data: responseData }
  } catch (error) {
    console.error('Error fetching notifications: ', error)
    return { errorMessage: 'Error fetching notifications' }
  }
}
