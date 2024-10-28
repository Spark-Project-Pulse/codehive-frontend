'use server'

import { type ApiResponse } from '@/types/Api'
import { type User } from '@/types/Users'

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
  formData: FormData,
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

/**
 * Gets profile image for the user
 *
 * Args:
 *   user_id (string): The ID of the user to get profile image
 *
 * Returns:
 *   Promise<ApiResponse<{ profile_image?:File }>>: User's profile image or null if no profile image on success, or error msg on failure
 */
export const getProfileImageByUserId = async (
  user_id: string,
): Promise<ApiResponse<{ base64String?: string, fileType?: string }>> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/getProfileImageById/${user_id}/`,
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
    const responseData = await response.json()

    if (responseData.profile_image) {
      // Get the base64 string of image and the file type
      const base64String = responseData.profile_image;
      const fileType = 'image/jpeg'

      return { errorMessage: null, data: { base64String: base64String, fileType: fileType } }
    } else {
      // No profile image found
      return { errorMessage: null, data: { base64String: undefined, fileType: undefined } }
    }
  } catch (error) {
    console.error('Error getting photo image: ', error)
    return { errorMessage: 'Error getting photo image' }
  }
}



