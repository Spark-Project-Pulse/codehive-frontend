'use server'

import { type User } from '@/types/User'

/**
 * Creates a new user by sending a POST request to the backend.
 *
 * Args:
 *   user (User): The user data to create.
 *
 * Returns:
 *   Promise<{errorMessage: string | null, user_id?: UUID}>: The created user's ID on success, or an error message on failure.
 */
export const createUser = async (user: User) => {
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

    // Access the user_id
    const userId = responseData.user_id
    return { errorMessage: null, user_id: userId }
  } catch (error) {
    console.error('Error creating user: ', error)
    return { errorMessage: 'Error creating user' }
  }
}

/**
 * Retrieves a user by their ID from the backend.
 *
 * Args:
 *   user_id (string)): The ID of the user to retrieve.
 *
 * Returns:
 *   Promise<{errorMessage: string | null, user?: User}>: The user's data on success, or an error message on failure.
 */
export const getUserById = async (user_id: string) => {
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
    
        // Extract the JSON data from the response
        const user = await response.json() as User
    
        return { errorMessage: null, user: user }
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
 *   Promise<{errorMessage: string | null, userExists?: boolean}>: Whether the user exists on success, or an error message on failure.
 */
export const userExists = async (user_id: string) => {
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
    const userExists = await response.json()

    return { errorMessage: null, userExists: userExists }
  } catch (error) {
    console.error('Error checking if user exists: ', error)
    return { errorMessage: 'Error checking if user exists' }
  }
}
