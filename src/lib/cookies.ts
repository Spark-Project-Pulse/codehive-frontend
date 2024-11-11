'use server'

import { type SidebarCommunity } from '@/types/Communities'
import { type User } from '@/types/Users'
import { cookies } from 'next/headers'

// User Cookie Functions

// Takes in a User object and sets cookies to store the user info
// Only store info needed for sidebar (for security)
export const setUserCookie = (userData: User) => {
  cookies().set(
    'user_info',
    JSON.stringify(userData),
    {
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 1 day
    }
  )
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

// Community Cookie Functions
// Takes in an array of SidebarCommunity objects and sets cookies to store the community info
export const setCommunitiesCookie = (communityData: SidebarCommunity[]) => {
  cookies().set('communities_info', JSON.stringify(communityData), {
    sameSite: 'lax',
    maxAge: 60 * 60 * 24, // 1 day
  })
}

// Gets the communities info cookie value
export const getCommunitiesCookie = async (): Promise<SidebarCommunity[]> => {
  const cookieValue = cookies().get('communities_info')?.value
  return Promise.resolve(cookieValue ? (JSON.parse(cookieValue) as SidebarCommunity[]) : [])
}

// Checks if the communities cookie exists (returns true if the cookie exists)
export const communitiesCookieExists = async (): Promise<boolean> => {
  return Promise.resolve(cookies().has('communities_info'))
}

// Clears the communities cookies, can be used when communities are updated or user logs out
export const clearCommunitiesCookie = () => {
  cookies().delete('communities_info')
}
