'use server'

import { type ApiResponse } from '@/types/Api'
import { Community } from '@/types/Communities'
import { getSupaUser } from '@/utils/supabase/server'

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