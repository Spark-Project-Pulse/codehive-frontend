'use server'

import { type ErrorResponse, type ApiResponse } from '@/types/Api'
import { type UserRole, type User } from '@/types/Users'
import { getSupaUser } from '@/utils/supabase/server'
import { type UUID } from 'crypto'

/**
 * Creates a new user by sending a POST request to the backend.
 *
 * Args:
 *   user (User): The user data to create.
 *
 * Returns:
 *   Promise<ApiResponse<{ user_id: string}>>: The created user's ID on success, or an error message on failure.
 */
export const createUser = async (
  user: User
): Promise<ApiResponse<{ user_id: string }>> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/create/`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      }
    )

    if (!response.ok) {
      throw new Error('Network response was not ok')
    }

    // Extract the JSON data from the response
    const responseData = (await response.json()) as User
    return { errorMessage: null, data: { user_id: responseData.user } }
  } catch (error) {
    console.error('Error creating user: ', error)
    return { errorMessage: 'Error creating user' }
  }
}

/**
 * Changes the reputation of a user by a specified amount.
 *
 * Args:
 *   user_id (string): The ID of the user whose reputation should be changed.
 *   amount (number): The amount by which to change the reputation (positive or negative).
 *
 * Returns:
 *   Promise<ApiResponse<{ user_id: string; new_reputation: number }>>: The user's ID and new reputation on success, or an error message on failure.
 */
export const changeReputationByAmount = async (
  user_id: UUID,
  amount: string
): Promise<ApiResponse<{ user_id: string; new_reputation: number }>> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/changeReputationByAmount/${user_id}/${amount}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    if (!response.ok) {
      const errorData = (await response.json()) as ErrorResponse
      throw new Error(errorData.error ?? 'Network response was not ok')
    }

    // Extract the JSON data from the response
    const responseData = (await response.json()) as {
      user_id: string
      new_reputation: number
    }
    return { errorMessage: null, data: responseData }
  } catch (error) {
    console.error('Error changing reputation: ', error)
    return {
      errorMessage:
        error instanceof Error ? error.message : 'Error changing reputation',
    }
  }
}

/**
 * Retrieves a user by their ID from the backend.
 *
 * Args:
 *   user_id (string): The ID of the user to retrieve.
 *
 * Returns:
 *   Promise<ApiResponse<User>>: The user's data on success, or an error message on failure.
 */
export const getUserById = async (
  user_id: string
): Promise<ApiResponse<User>> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/getById/${user_id}`,
      {
        method: 'GET',
        headers: {
          // Authorization: `Bearer ${token}`, // Uncomment if using auth
          'Content-Type': 'application/json',
        },
      }
    )

    if (!response.ok) {
      throw new Error('Network response was not ok')
    }

    const userData = (await response.json()) as User
    return { errorMessage: null, data: userData }
  } catch (error) {
    console.error('Error getting user: ', error)
    return { errorMessage: 'Error getting user' }
  }
}

/**
 * Retrieves a user by their username from the backend.
 *
 * Args:
 *   username (string): The username of the user to retrieve.
 *
 * Returns:
 *   Promise<ApiResponse<User>>: The user's data on success, or an error message on failure.
 */
export const getUserByUsername = async (
  username: string
): Promise<ApiResponse<User>> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/getByUsername/${username}`,
      {
        method: 'GET',
        headers: {
          // Authorization: `Bearer ${token}`, // Uncomment if using auth
          'Content-Type': 'application/json',
        },
      }
    )

    if (!response.ok) {
      throw new Error('Network response was not ok')
    }

    const userData = (await response.json()) as User
    return { errorMessage: null, data: userData }
  } catch (error) {
    console.error('Error getting user: ', error)
    return { errorMessage: 'Error getting user' }
  }
}

/*
 * Retrieves the current user's role by their id from the backend.
 *
 * Returns:
 *   Promise<ApiResponse<UserRole>>: The user's role on success, or an error message on failure.
 */
export const getCurrentUserRole = async (): Promise<ApiResponse<UserRole>> => {
  try {
    const user = await getSupaUser()

    if (!user) {
      throw new Error('User is not authenticated')
    }

    const reponse = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/getUserRoleById/${user.id}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    if (!reponse.ok) {
      throw new Error('Network response was not ok')
    }

    // Extract the JSON data from the response
    const responseData = (await reponse.json()) as UserRole
    return { errorMessage: null, data: responseData }
  } catch (error) {
    console.error('Error getting user role: ', error)
    return { errorMessage: 'Error getting user role' }
  }
}

/**
 * Checks if a user exists by their ID.
 *
 * Args:
 *   user_id (string): The ID of the user to check.
 *
 * Returns:
 *   Promise<ApiResponse<{ exists: boolean }>>: Whether the user exists on success, or an error message on failure.
 */
export const userExists = async (
  user_id: string
): Promise<ApiResponse<{ exists: boolean }>> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/userExists/${user_id}`,
      {
        method: 'GET',
        headers: {
          // Authorization: `Bearer ${token}`, // Uncomment if using auth
          'Content-Type': 'application/json',
        },
      }
    )

    if (!response.ok) {
      throw new Error('Network response was not ok')
    }

    // Extract the JSON data from the response
    const responseData = (await response.json()) as { exists: boolean }
    return { errorMessage: null, data: { exists: responseData.exists } }
  } catch (error) {
    console.error('Error checking if user exists: ', error)
    return { errorMessage: 'Error checking if user exists' }
  }
}

/**
 * Uploads profile image for the user
 *
 * Args:
 *   user_id (string): The ID of the user to upload photo
 *   file (File): The file the user is uploading for photo
 *
 * Returns:
 *   Promise<ApiResponse<{ user_id:string }>>: User's id on success, or error msg on failure
 */
export const uploadProfileImage = async (
  user_id: string,
  formData: FormData
): Promise<ApiResponse<{ user_id: string }>> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/updateProfileImageById/${user_id}/`,
      {
        method: 'PUT',
        body: formData,
      }
    )

    if (!response.ok) {
      throw new Error('Network response was not ok')
    }

    // Extract the JSON data from the response
    const responseData = (await response.json()) as User
    return { errorMessage: null, data: { user_id: responseData.user } }
  } catch (error) {
    console.error('Error uploading photo image: ', error)
    return { errorMessage: 'Error uploading photo image' }
  }
}
