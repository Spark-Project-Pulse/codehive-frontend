'use server'

import { type ApiResponse } from '@/types/Api'
import { Community } from '@/types/Communities'

/**
 * Fetches communities with pagination, optional tag filtering, and search functionality.
 *
 * Args:
 *   pageNumber (number): The current page number.
 *   pageSize (number): The number of communities per page.
 *   selectedTags (string[]): An array of selected tag IDs.
 *   searchQuery (string): The search query string.
 *
 * Returns:
 *   Promise<ApiResponse<{ communities: Community[]; totalCommunities: number }>>: The communities data on success, or an error message on failure.
 */
export const getAllCommunities = async (
    pageNumber: number,
    pageSize: number,
    selectedTags: string[],
    searchQuery: string
  ): Promise<ApiResponse<{ communities: Community[]; totalCommunities: number }>> => {
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
  
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/communities/getAll/?${params.toString()}`,
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
 * Fetches a community by its ID from the backend.
 *
 * Args:
 *   community_id (string): The ID of the community to retrieve.
 *
 * Returns:
 *   Promise<ApiResponse<Community>>: The community data on success, or an error message on failure.
 */
export const getCommunityById = async (
    community_id: string
  ): Promise<ApiResponse<Community>> => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/communities/getById/${community_id}`,
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
 * Retrieves a community by their title from the backend.
 *
 * Args:
 *   title (string): The title of the community to retrieve.
 *
 * Returns:
 *   Promise<ApiResponse<Community>>: The community's data on success, or an error message on failure.
 */
export const getCommunityByTitle = async (
    title: string
  ): Promise<ApiResponse<Community>> => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/communities/getByTitle/${title}`,
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
