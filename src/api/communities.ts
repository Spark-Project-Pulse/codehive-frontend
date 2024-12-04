'use server'

import { type SuccessResponse, type ApiResponse } from '@/types/Api'
import {
  type Community,
  type CommunityOption,
  type CommunityMember,
} from '@/types/Communities'
import { getSupaUser } from '@/utils/supabase/server'
import { type UUID } from 'crypto'
import { makeAuthenticatedBackendFetch } from '@/lib/makeAuthenticatedBackendRequest'

/**
 * Creates a new community request.
 *
 * @param {FormData} formData - Form data containing community details.
 * @returns {Promise<ApiResponse<{ community_id: string; title: string }>>} The community's ID and title on success, or an error message on failure.
 */
export const createCommunityRequest = async (
  formData: FormData
): Promise<ApiResponse<{ community_id: string; title: string }>> => {
  try {
    const user = await getSupaUser()
    if (!user) {
      return { errorMessage: 'User not authenticated' }
    }

    // add the owner to the form
    formData.append('owner', user.id)

    const response = await makeAuthenticatedBackendFetch(
      '/communities/createRequest/',
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
          community_id: string
          title: string
        }
      | { error: string }

    if ('error' in responseData) {
      return { errorMessage: responseData.error }
    } else {
      return {
        errorMessage: null,
        data: {
          community_id: responseData.community_id,
          title: responseData.title,
        },
      }
    }
  } catch (error) {
    console.error('Error creating community request: ', error)
    return { errorMessage: 'Error creating community request' }
  }
}

/**
 * Approves a community request.
 *
 * @param {UUID} communityId - The ID of the community request to approve.
 * @returns {Promise<ApiResponse<{ message: string }>>} A success message on approval or an error message on failure.
 */
export const approveCommunityRequest = async (
  communityId: UUID
): Promise<ApiResponse<{ message: string }>> => {
  try {
    const user = await getSupaUser()
    if (!user) {
      return { errorMessage: 'User not authenticated' }
    }

    const response = await makeAuthenticatedBackendFetch(
      '/communities/approveCommunityRequest/',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          community_id: communityId,
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
    console.error('Error approving community request:', error)
    return { errorMessage: 'Error approving community request' }
  }
}

/**
 * Rejects a community request.
 *
 * @param {UUID} communityId - The ID of the community request to reject.
 * @returns {Promise<ApiResponse<{ message: string }>>} A success message on rejection or an error message on failure.
 */
export const rejectCommunityRequest = async (
  communityId: UUID
): Promise<ApiResponse<{ message: string }>> => {
  try {
    const user = await getSupaUser()
    if (!user) {
      return { errorMessage: 'User not authenticated' }
    }

    const response = await makeAuthenticatedBackendFetch(
      '/communities/rejectCommunityRequest/',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          community_id: communityId,
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
    console.error('Error rejecting community request:', error)
    return { errorMessage: 'Error rejecting community request' }
  }
}

/**
 * Adds the current user to a community.
 *
 * @param {UUID} communityId - The ID of the community to join.
 * @returns {Promise<ApiResponse<{ message: string }>>} A success message on success or an error message on failure.
 */
export const addUserToCommunity = async (
  communityId: UUID
): Promise<ApiResponse<{ message: string }>> => {
  try {
    const user = await getSupaUser()

    if (!user) {
      return { errorMessage: 'User not authenticated' }
    }

    const response = await makeAuthenticatedBackendFetch(
      '/communities/addCommunityMember/',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ community_id: communityId, user_id: user.id }),
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
    console.error('Error adding user to community: ', error)
    return { errorMessage: 'Error adding user to community' }
  }
}

/**
 * Removes the current user from a community.
 *
 * @param {UUID} communityId - The ID of the community to leave.
 * @returns {Promise<ApiResponse<{ message: string }>>} A success message on success or an error message on failure.
 */
export const removeUserFromCommunity = async (
  communityId: UUID
): Promise<ApiResponse<{ message: string }>> => {
  try {
    const user = await getSupaUser()

    if (!user) {
      return { errorMessage: 'User not authenticated' }
    }

    const response = await makeAuthenticatedBackendFetch(
      '/communities/removeCommunityMember/',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ community_id: communityId, user_id: user.id }),
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
    console.error('Error removing user from community: ', error)
    return { errorMessage: 'Error removing user from community' }
  }
}

/**
 * Fetches communities with pagination, tag filtering, and search functionality.
 *
 * @param {number} pageNumber - The current page number.
 * @param {number} pageSize - The number of communities per page.
 * @param {string[]} selectedTags - An array of selected tag IDs.
 * @param {string} searchQuery - The search query string.
 * @returns {Promise<ApiResponse<{ communities: Community[]; totalCommunities:
 */
export const getAllCommunities = async (
  pageNumber: number,
  pageSize: number,
  selectedTags: string[],
  searchQuery: string
): Promise<
  ApiResponse<{ communities: Community[]; totalCommunities: number }>
> => {
  try {
    // Build the query parameters
    const params = new URLSearchParams()
    params.append('page', pageNumber.toString())
    params.append('page_size', pageSize.toString())
    if (searchQuery.trim()) {
      params.append('search', searchQuery.trim())
    }
    selectedTags.forEach((tagId) => {
      params.append('tags', tagId)
    })

    const response = await makeAuthenticatedBackendFetch(
      `/communities/getAll/?${params.toString()}`,
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
      communities: Community[]
      totalCommunities: number
      totalPages: number
      currentPage: number
    }

    return {
      errorMessage: null,
      data: {
        communities: responseData.communities,
        totalCommunities: responseData.totalCommunities,
      },
    }
  } catch (error) {
    console.error('Error fetching communities: ', error)
    return { errorMessage: 'Error fetching communities' }
  }
}

/**
 * Fetches all community options from the backend.
 *
 * @returns {Promise<CommunityOption[]>} An array of community options on success, or an empty array on failure.
 */
export const getAllCommunityOptions = async (): Promise<CommunityOption[]> => {
  try {
    const response = await makeAuthenticatedBackendFetch(
      '/communities/getAllOptions',
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

    const data = (await response.json()) as Community[]

    const options: CommunityOption[] = data.map((community) => ({
      value: community.community_id,
      label: community.title,
    }))

    return options
  } catch (error) {
    console.error('Error fetching communities:', error)
    return []
  }
}

/**
 * Fetches all members of a specific community by ID from the backend.
 *
 * @param {string} community_id - The ID of the community whose members to retrieve.
 * @returns {Promise<ApiResponse<CommunityMember[]>>} The list of members on success, or an error message on failure.
 */
export const getAllCommunityMembers = async (
  community_id: string
): Promise<ApiResponse<CommunityMember[]>> => {
  try {
    const response = await makeAuthenticatedBackendFetch(
      `/communities/getAllMembers/${community_id}`,
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

    const membersData = (await response.json()) as CommunityMember[]
    return { errorMessage: null, data: membersData }
  } catch (error) {
    console.error('Error fetching members: ', error)
    return { errorMessage: 'Error fetching members' }
  }
}

/**
 * Fetches a community by its ID from the backend.
 *
 * @param {UUID} community_id - The ID of the community to retrieve.
 * @returns {Promise<ApiResponse<Community>>} The community data on success, or an error message on failure.
 */
export const getCommunityById = async (
  community_id: UUID
): Promise<ApiResponse<Community>> => {
  try {
    const response = await makeAuthenticatedBackendFetch(
      `/communities/getById/${community_id}`,
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

    const communityData = (await response.json()) as Community
    return { errorMessage: null, data: communityData }
  } catch (error) {
    console.error('Error fetching community: ', error)
    return { errorMessage: 'Error fetching community' }
  }
}

/**
 * Retrieves a community by its title from the backend.
 *
 * @param {string} title - The title of the community to retrieve.
 * @returns {Promise<ApiResponse<Community>>} The community's data on success, or an error message on failure.
 */
export const getCommunityByTitle = async (
  title: string
): Promise<ApiResponse<Community>> => {
  try {
    const response = await makeAuthenticatedBackendFetch(
      `/communities/getByTitle/${title}`,
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

    const communityData = (await response.json()) as Community
    return { errorMessage: null, data: communityData }
  } catch (error) {
    console.error('Error getting community: ', error)
    return { errorMessage: 'Error getting community' }
  }
}

/**
 * Fetches all communities associated with the current user.
 *
 * @returns {Promise<ApiResponse<CommunityMember[]>>} The communities data on success, or an error message on failure.
 */
export const getCurrentUserCommunities = async (): Promise<
  ApiResponse<CommunityMember[]>
> => {
  try {
    const user = await getSupaUser()

    if (!user) {
      throw new Error('User is not authenticated')
    }

    const response = await makeAuthenticatedBackendFetch(
      `/communities/getUserCommunitiesById/${user.id}`,
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

    const communityData = (await response.json()) as CommunityMember[]
    return { errorMessage: null, data: communityData }
  } catch (error) {
    console.error('Error fetching communities: ', error)
    return { errorMessage: 'Error fetching communities' }
  }
}

/**
 * Fetches all community requests from the backend.
 *
 * @returns {Promise<ApiResponse<Community[]>>} An array of community requests on success, or an error message on failure.
 */
export const getAllCommunityRequests = async (): Promise<
  ApiResponse<Community[]>
> => {
  try {
    const response = await makeAuthenticatedBackendFetch(
      '/communities/getAllCommunityRequests',
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

    const communityData = (await response.json()) as Community[]
    return { errorMessage: null, data: communityData }
  } catch (error) {
    console.error('Error fetching community requests: ', error)
    return { errorMessage: 'Error fetching community requests' }
  }
}

/**
 * Checks if a user is part of a specific community by title.
 *
 * @param {string} community_title - The title of the community to check.
 * @returns {Promise<ApiResponse<{ is_member: boolean }>>} Whether the user is part of the community on success, or an error message on failure.
 */
export const userIsPartOfCommunity = async (
  community_title: string
): Promise<ApiResponse<{ is_member: boolean }>> => {
  try {
    const user = await getSupaUser()

    if (!user) {
      return { errorMessage: 'User not authenticated' }
    }

    const response = await makeAuthenticatedBackendFetch(
      `/communities/userIsPartOfCommunity/${community_title}/${user.id}`,
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
    console.error('Error checking if user is part of community: ', error)
    return { errorMessage: 'Error checking if user is part of community' }
  }
}
