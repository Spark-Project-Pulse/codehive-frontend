'use server'

import { type ApiResponse } from '@/types/Api'
import { type Comment } from '@/types/Comments'
import { getSupaUser } from '@/utils/supabase/server'

/**
 * Submits a comment to an answer.
 *
 * @param {Object} commentData - The response and answer ID for the comment.
 * @param {string} commentData.response - The content of the comment.
 * @param {string} commentData.answer - The ID of the answer to comment on.
 * @returns {Promise<ApiResponse<Comment>>} The created comment on success, or an error message on failure.
 */
export const createComment = async (commentData: {
  response: string
  answer: string
}): Promise<ApiResponse<Comment>> => {
  try {
    const user = await getSupaUser()

    if (!user) {
      return { errorMessage: 'User not authenticated' }
    }

    const vals = { expert: user?.id, ...commentData }
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/comments/create/`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(vals),
      }
    )

    if (!response.ok) {
      throw new Error('Network response was not ok')
    }

    const responseData = (await response.json()) as Comment | { error: string }

    if ('error' in responseData) {
      return { errorMessage: responseData.error }
    } else {
      return { errorMessage: null, data: responseData }
    }
  } catch (error) {
    console.error('Error submitting comment:', error)
    return { errorMessage: 'Error submitting comment' }
  }
}

/**
 * Fetches comments for a specific answer by ID.
 *
 * @param {string} answer_id - The ID of the answer whose comments to retrieve.
 * @returns {Promise<ApiResponse<Comment[]>>} The list of comments on success, or an error message on failure.
 */
export const getCommentsByAnswerId = async (
  answer_id: string
): Promise<ApiResponse<Comment[]>> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/comments/getCommentsByAnswerId/${answer_id}`,
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

    const commentsData = (await response.json()) as Comment[]
    return { errorMessage: null, data: commentsData }
  } catch (error) {
    console.error('Error fetching comments: ', error)
    return { errorMessage: 'Error fetching comments' }
  }
}
