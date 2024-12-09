'use server'

import { type SuccessResponse, type ApiResponse } from '@/types/Api'
import { type Hive, type HiveOption, type HiveMember } from '@/types/Hives'
import { getSupaUser } from '@/utils/supabase/server'
import { type UUID } from 'crypto'
import { makeAuthenticatedBackendFetch } from '@/lib/makeAuthenticatedBackendRequest'

/**
 * Creates a new hive request.
 *
 * @param {FormData} formData - Form data containing hive details.
 * @returns {Promise<ApiResponse<{ hive_id: string; title: string }>>} The hive's ID and title on success, or an error message on failure.
 */
export const createHiveRequest = async (
  formData: FormData
): Promise<ApiResponse<{ hive_id: string; title: string }>> => {
  try {
    const user = await getSupaUser()
    if (!user) {
      return { errorMessage: 'User not authenticated' }
    }

    // add the owner to the form
    formData.append('owner', user.id)

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/hives/createRequest/`,
      {
        method: 'POST',
        body: formData,
      }
    )

    if (!response.ok) {
      throw new Error('Network response was not ok')
    }

    const responseData = (await response.json()) as
      | {
          hive_id: string
          title: string
        }
      | { error: string }

    if ('error' in responseData) {
      return { errorMessage: responseData.error }
    } else {
      return {
        errorMessage: null,
        data: {
          hive_id: responseData.hive_id,
          title: responseData.title,
        },
      }
    }
  } catch (error) {
    console.error('Error creating hive request: ', error)
    return { errorMessage: 'Error creating hive request' }
  }
}

/**
 * Approves a hive request.
 *
 * @param {UUID} hiveId - The ID of the hive request to approve.
 * @returns {Promise<ApiResponse<{ message: string }>>} A success message on approval or an error message on failure.
 */
export const approveHiveRequest = async (
  hiveId: UUID
): Promise<ApiResponse<{ message: string }>> => {
  try {
    const user = await getSupaUser()
    if (!user) {
      return { errorMessage: 'User not authenticated' }
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/hives/approveHiveRequest/`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          hive_id: hiveId,
          user_id: user.id,
        }),
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(
        `HTTP error! Status: ${response.status}, Message: ${errorText}`
      )
    }

    const responseData = (await response.json()) as { message: string }
    return { errorMessage: null, data: responseData }
  } catch (error) {
    console.error('Error approving hive request:', error)
    return { errorMessage: 'Error approving hive request' }
  }
}

/**
 * Rejects a hive request.
 *
 * @param {UUID} hiveId - The ID of the hive request to reject.
 * @returns {Promise<ApiResponse<{ message: string }>>} A success message on rejection or an error message on failure.
 */
export const rejectHiveRequest = async (
  hiveId: UUID
): Promise<ApiResponse<{ message: string }>> => {
  try {
    const user = await getSupaUser()
    if (!user) {
      return { errorMessage: 'User not authenticated' }
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/hives/rejectHiveRequest/`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          hive_id: hiveId,
          user_id: user.id,
        }),
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(
        `HTTP error! Status: ${response.status}, Message: ${errorText}`
      )
    }

    const responseData = (await response.json()) as { message: string }
    return { errorMessage: null, data: responseData }
  } catch (error) {
    console.error('Error rejecting hive request:', error)
    return { errorMessage: 'Error rejecting hive request' }
  }
}

/**
 * Adds the current user to a hive.
 *
 * @param {UUID} hiveId - The ID of the hive to join.
 * @returns {Promise<ApiResponse<{ message: string }>>} A success message on success or an error message on failure.
 */
export const addUserToHive = async (
  hiveId: UUID
): Promise<ApiResponse<{ message: string }>> => {
  try {
    const user = await getSupaUser()

    if (!user) {
      return { errorMessage: 'User not authenticated' }
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/hives/addHiveMember/`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ hive_id: hiveId, user_id: user.id }),
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(
        `HTTP error! Status: ${response.status}, Message: ${errorText}`
      )
    }

    const responseData = (await response.json()) as SuccessResponse
    return { errorMessage: null, data: responseData }
  } catch (error) {
    console.error('Error adding user to hive: ', error)
    return { errorMessage: 'Error adding user to hive' }
  }
}

/**
 * Removes the current user from a hive.
 *
 * @param {UUID} hiveId - The ID of the hive to leave.
 * @returns {Promise<ApiResponse<{ message: string }>>} A success message on success or an error message on failure.
 */
export const removeUserFromHive = async (
  hiveId: UUID
): Promise<ApiResponse<{ message: string }>> => {
  try {
    const user = await getSupaUser()

    if (!user) {
      return { errorMessage: 'User not authenticated' }
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/hives/removeHiveMember/`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ hive_id: hiveId, user_id: user.id }),
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(
        `HTTP error! Status: ${response.status}, Message: ${errorText}`
      )
    }

    const responseData = (await response.json()) as SuccessResponse
    return { errorMessage: null, data: responseData }
  } catch (error) {
    console.error('Error removing user from hive: ', error)
    return { errorMessage: 'Error removing user from hive' }
  }
}

/**
 * Fetches hives with pagination, tag filtering, and search functionality.
 *
 * @param {number} pageNumber - The current page number.
 * @param {number} pageSize - The number of hives per page.
 * @param {string[]} selectedTags - An array of selected tag IDs.
 * @param {string} searchQuery - The search query string.
 * @returns {Promise<ApiResponse<{ hives: Hive[]; totalHives:
 */
export const getAllHives = async (
  pageNumber: number,
  pageSize: number,
  selectedTags: string[],
  searchQuery: string
): Promise<ApiResponse<{ hives: Hive[]; totalHives: number }>> => {
  try {
    let url = ''
    const params = new URLSearchParams()

    if (searchQuery.trim()) {
      // Use the search endpoint
      url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/hives/search/`
      params.append('q', searchQuery.trim())
    } else {
      // Use the general getAll endpoint
      url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/hives/getAll/`
    }

    // Append tags in both cases
    selectedTags.forEach((tagId) => {
      params.append('tags', tagId)
    })

    // Always append pagination parameters
    params.append('page', pageNumber.toString())
    params.append('page_size', pageSize.toString())

    const response = await makeAuthenticatedBackendFetch(
      `/hives/getAll/?${params.toString()}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(
        `HTTP error! Status: ${response.status}, Message: ${errorText}`
      )
    }

    const responseData = (await response.json()) as {
      hives: Hive[]
      totalHives: number
    }

    return {
      errorMessage: null,
      data: {
        hives: responseData.hives,
        totalHives: responseData.totalHives,
      },
    }
  } catch (error) {
    console.error('Error fetching hives:', error)
    return { errorMessage: 'Error fetching hives' }
  }
}

/**
 * Fetches all hive options from the backend.
 *
 * @returns {Promise<HiveOption[]>} An array of hive options on success, or an empty array on failure.
 */
export const getAllHiveOptions = async (): Promise<HiveOption[]> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/hives/getAllOptions`,
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

    const data = (await response.json()) as Hive[]

    const options: HiveOption[] = data.map((hive) => ({
      value: hive.hive_id,
      label: hive.title,
    }))

    return options
  } catch (error) {
    console.error('Error fetching hives:', error)
    return []
  }
}

/**
 * Fetches all members of a specific hive by ID from the backend.
 *
 * @param {string} hive_id - The ID of the hive whose members to retrieve.
 * @returns {Promise<ApiResponse<HiveMember[]>>} The list of members on success, or an error message on failure.
 */
export const getAllHiveMembers = async (
  hive_id: string
): Promise<ApiResponse<HiveMember[]>> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/hives/getAllMembers/${hive_id}`,
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

    const membersData = (await response.json()) as HiveMember[]
    return { errorMessage: null, data: membersData }
  } catch (error) {
    console.error('Error fetching members: ', error)
    return { errorMessage: 'Error fetching members' }
  }
}

/**
 * Fetches a hive by its ID from the backend.
 *
 * @param {UUID} hive_id - The ID of the hive to retrieve.
 * @returns {Promise<ApiResponse<Hive>>} The hive data on success, or an error message on failure.
 */
export const getHiveById = async (
  hive_id: UUID
): Promise<ApiResponse<Hive>> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/hives/getById/${hive_id}`,
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

    const hiveData = (await response.json()) as Hive
    return { errorMessage: null, data: hiveData }
  } catch (error) {
    console.error('Error fetching hive: ', error)
    return { errorMessage: 'Error fetching hive' }
  }
}

/**
 * Retrieves a hive by its title from the backend.
 *
 * @param {string} title - The title of the hive to retrieve.
 * @returns {Promise<ApiResponse<Hive>>} The hive's data on success, or an error message on failure.
 */
export const getHiveByTitle = async (
  title: string
): Promise<ApiResponse<Hive>> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/hives/getByTitle/${title}`,
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

    const hiveData = (await response.json()) as Hive
    return { errorMessage: null, data: hiveData }
  } catch (error) {
    console.error('Error getting hive: ', error)
    return { errorMessage: 'Error getting hive' }
  }
}

/**
 * Fetches all hives associated with the current user.
 *
 * @returns {Promise<ApiResponse<HiveMember[]>>} The hives data on success, or an error message on failure.
 */
export const getCurrentUserHives = async (): Promise<
  ApiResponse<HiveMember[]>
> => {
  try {
    const user = await getSupaUser()

    if (!user) {
      throw new Error('User is not authenticated')
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/hives/getUserHivesById/${user.id}`,
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

    const hiveData = (await response.json()) as HiveMember[]
    return { errorMessage: null, data: hiveData }
  } catch (error) {
    console.error('Error fetching hives: ', error)
    return { errorMessage: 'Error fetching hives' }
  }
}

/**
 * Fetches all hive requests from the backend.
 *
 * @returns {Promise<ApiResponse<Hive[]>>} An array of hive requests on success, or an error message on failure.
 */
export const getAllHiveRequests = async (): Promise<ApiResponse<Hive[]>> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/hives/getAllHiveRequests`,
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

    const hiveData = (await response.json()) as Hive[]
    return { errorMessage: null, data: hiveData }
  } catch (error) {
    console.error('Error fetching hive requests: ', error)
    return { errorMessage: 'Error fetching hive requests' }
  }
}

/**
 * Checks if a user is part of a specific hive by title.
 *
 * @param {string} hive_title - The title of the hive to check.
 * @returns {Promise<ApiResponse<{ is_member: boolean }>>} Whether the user is part of the hive on success, or an error message on failure.
 */
export const userIsPartOfHive = async (
  hive_title: string
): Promise<ApiResponse<{ is_member: boolean }>> => {
  try {
    const user = await getSupaUser()

    if (!user) {
      return { errorMessage: 'User not authenticated' }
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/hives/userIsPartOfHive/${hive_title}/${user.id}`,
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
    const responseData = (await response.json()) as { is_member: boolean }
    return { errorMessage: null, data: { is_member: responseData.is_member } }
  } catch (error) {
    console.error('Error checking if user is part of hive: ', error)
    return { errorMessage: 'Error checking if user is part of hive' }
  }
}
