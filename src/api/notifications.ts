'use server'

import {
  type ErrorResponse,
  type SuccessResponse,
  type ApiResponse,
} from '@/types/Api'
import { type NotificatonsInfo, type Notification } from '@/types/Notifications'
import { getSupaUser } from '@/utils/supabase/server'

/**
 * Fetches all the notifications associated with a user by their ID from the backend.
 *
 * @param {string} user_id - The ID of the user.
 * @returns {Promise<ApiResponse<Notification[]>>} The notifications data on success, or an error message on failure.
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

    const notificationData = (await response.json()) as Notification[]
    return { errorMessage: null, data: notificationData }
  } catch (error) {
    console.error('Error fetching notifications: ', error)
    return { errorMessage: 'Error fetching notifications' }
  }
}

/**
 * Fetches the number of unread notifications for a user.
 *
 * @returns {Promise<ApiResponse<NotificatonsInfo>} Promise with success message or error details
 * 
 */
export const getUnreadNotificationsCountByUserId = async (): Promise<
  ApiResponse<NotificatonsInfo>
> => {
  try {
    const user = await getSupaUser()
    
    if (!user) {
      throw new Error('User is not authenticated')
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/notifications/getUnreadCountByUserId/${user.id}`,
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

    const notificationData = (await response.json()) as NotificatonsInfo
    return { errorMessage: null, data: notificationData }
  } catch (error) {
    console.error('Error fetching notifications: ', error)
    return { errorMessage: 'Error fetching notifications' }
  }
}

/**
 * Marks specified notification as read.
 *
 * @param {string} user_id - The ID of the user
 * @param {string} notification_id - The ID of the notification to mark as read
 * @returns {Promise<ApiResponse<{ message: string }>>} Promise with success message or error details
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
    console.error('Error reading notification: ', error)
    return { errorMessage: 'Error reading notification' }
  }
}

/**
 * Marks specified notification as unread.
 *
 * @param {string} user_id - The ID of the user
 * @param {string} notification_id - The ID of the notification to mark as read
 * @returns {Promise<ApiResponse<{ message: string }>>} Promise with success message or error details
 */
export const markNotificationAsUnread = async (
  user_id: string,
  notification_id: string
): Promise<ApiResponse<{ message: string }>> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/notifications/markAsUnread/${user_id}/${notification_id}`,
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
    console.error('Error unreading notification: ', error)
    return { errorMessage: 'Error unreading notification' }
  }
}

/**
 * Deletes specified notification.
 *
 * @param {string} user_id - The ID of the user
 * @param {string} notification_id - The ID of the notification to delete
 * @returns {Promise<ApiResponse<{ message: string }>>} Promise with success message or error details
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
    console.error('Error deleting notifications: ', error)
    return { errorMessage: 'Error deleting notifications' }
  }
}
