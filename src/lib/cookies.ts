'use server'

import { type SidebarCommunity } from '@/types/Communities'
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

// Community Cookie Functions

// Takes in an array of SidebarCommunity objects and sets cookies to store the community info
export const setCommunitiesCookie = (communityData: SidebarCommunity[]) => {
  cookies().set('communities_info', JSON.stringify(communityData), {
    sameSite: 'lax',
    maxAge: Time.intervalToSeconds("INFREQUENT"), // 5 minutes
  })
}

// Gets the communities info cookie value
export const getCommunitiesCookie = async (): Promise<SidebarCommunity[]> => {
  const cookieValue = cookies().get('communities_info')?.value
  return Promise.resolve(
    cookieValue ? (JSON.parse(cookieValue) as SidebarCommunity[]) : []
  )
}

// Checks if the communities cookie exists (returns true if the cookie exists)
export const communitiesCookieExists = async (): Promise<boolean> => {
  return Promise.resolve(cookies().has('communities_info'))
}

// Clears the communities cookies, can be used when communities are updated or user logs out
export const clearCommunitiesCookie = () => {
  cookies().delete('communities_info')
}


// Notifications Cookie Functions

// Takes in an object of NotificationsInfo and sets cookies to store the Notification info
export const setNotificationsCookie = (notificationData: NotificatonsInfo) => {
  cookies().set('notifications_info', JSON.stringify(notificationData), {
    sameSite: 'lax',
    maxAge: Time.intervalToSeconds("STANDARD"), // 1 minute
  })
}

// Gets the communities info cookie value
export const getNotificationsCookie = async (): Promise<NotificatonsInfo> => {
  const cookieValue = cookies().get('notifications_info')?.value
  return Promise.resolve(
    cookieValue ? (JSON.parse(cookieValue) as NotificatonsInfo) : { count: 0 }
  )
}

// Checks if the communities cookie exists (returns true if the cookie exists)
export const notificationsCookieExists = async (): Promise<boolean> => {
  return Promise.resolve(cookies().has('notifications_info'))
}

// Clears the communities cookies, can be used when communities are updated or user logs out
export const clearNotificationsCookie = () => {
  cookies().delete('notifications_info')
}
