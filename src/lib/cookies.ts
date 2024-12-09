'use server'

import { type SidebarHive } from '@/types/Hives'
import { type UserRole, type User } from '@/types/Users'
import { cookies } from 'next/headers'
import { Time } from '@/lib/constants/time'
import { type NotificatonsInfo } from '@/types/Notifications'

// User Cookie Functions

// Takes in a User object and sets cookies to store the user info
// Only store info needed for sidebar (for security)
export const setUserCookie = (userData: User) => {
  cookies().set('user_info', JSON.stringify(userData), {
    sameSite: 'lax',
    maxAge: Time.intervalToSeconds("INFREQUENT"), // 5 minutes
  })
}

// Gets the user info cookie value
export const getUserCookie = async (): Promise<User | null> => {
  const cookieValue = cookies().get('user_info')?.value
  return Promise.resolve(cookieValue ? (JSON.parse(cookieValue) as User) : null)
}

// Checks if the user cookie exists (returns true if the cookie exists)
export const userCookieExists = async (): Promise<boolean> => {
  return Promise.resolve(cookies().has('user_info'))
}

// Clears the user cookies, can be used when logging out
export const clearUserCookie = () => {
  cookies().delete('user_info')
}

// User Role Cookie Functions

// Takes in a User object and sets cookies to store the user info
// Only store info needed for sidebar (for security)
export const setUserRoleCookie = (userRoleData: UserRole) => {
  cookies().set('user_role_info', JSON.stringify(userRoleData), {
    sameSite: 'lax',
    maxAge: Time.intervalToSeconds("INFREQUENT"), // 5 minutes
  })
}

// Gets the user role info cookie value
export const getUserRoleCookie = async (): Promise<UserRole | null> => {
  const cookieValue = cookies().get('user_role_info')?.value
  return Promise.resolve(
    cookieValue ? (JSON.parse(cookieValue) as UserRole) : null
  )
}

// Checks if the user role cookie exists (returns true if the cookie exists)
export const userRoleCookieExists = async (): Promise<boolean> => {
  return Promise.resolve(cookies().has('user_role_info'))
}

// Clears the user role cookies, can be used when logging out
export const clearUserRoleCookie = () => {
  cookies().delete('user_role_info')
}

// Hive Cookie Functions

// Takes in an array of SidebarHive objects and sets cookies to store the hive info
export const setHivesCookie = (hiveData: SidebarHive[]) => {
  cookies().set('hives_info', JSON.stringify(hiveData), {
    sameSite: 'lax',
    maxAge: Time.intervalToSeconds("INFREQUENT"), // 5 minutes
  })
}

// Gets the hives info cookie value
export const getHivesCookie = async (): Promise<SidebarHive[]> => {
  const cookieValue = cookies().get('hives_info')?.value
  return Promise.resolve(
    cookieValue ? (JSON.parse(cookieValue) as SidebarHive[]) : []
  )
}

// Checks if the hives cookie exists (returns true if the cookie exists)
export const hivesCookieExists = async (): Promise<boolean> => {
  return Promise.resolve(cookies().has('hives_info'))
}

// Clears the hives cookies, can be used when hives are updated or user logs out
export const clearHivesCookie = () => {
  cookies().delete('hives_info')
}


// Notifications Cookie Functions

// Takes in an object of NotificationsInfo and sets cookies to store the Notification info
export const setNotificationsCookie = (notificationData: NotificatonsInfo) => {
  cookies().set('notifications_info', JSON.stringify(notificationData), {
    sameSite: 'lax',
    maxAge: Time.intervalToSeconds("STANDARD"), // 1 minute
  })
}

// Gets the hives info cookie value
export const getNotificationsCookie = async (): Promise<NotificatonsInfo> => {
  const cookieValue = cookies().get('notifications_info')?.value
  return Promise.resolve(
    cookieValue ? (JSON.parse(cookieValue) as NotificatonsInfo) : { count: 0 }
  )
}

// Checks if the hives cookie exists (returns true if the cookie exists)
export const notificationsCookieExists = async (): Promise<boolean> => {
  return Promise.resolve(cookies().has('notifications_info'))
}

// Clears the hives cookies, can be used when hives are updated or user logs out
export const clearNotificationsCookie = () => {
  cookies().delete('notifications_info')
}
