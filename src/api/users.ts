'use server'

import { type ApiResponse } from '@/types/Api'
import { type User } from '@/types/Users'
import { UUID } from 'crypto'

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
      const errorData = await response.json()
      throw new Error(errorData?.message || 'Network response was not ok')
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
