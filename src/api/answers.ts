'use server'

import { type ApiResponse } from '@/types/Api'
import { type Answer } from '@/types/Answers'
import { getSupaUser } from '@/utils/supabase/server'
import { type UUID } from 'crypto'
import { GoogleAuth } from 'google-auth-library'
import { makeAuthenticatedBackendFetch } from '@/lib/makeAuthenticatedBackendRequest'

/**
 * @param {Object} answerData - The data for the answer to be created.
 * @param {string} answerData.response - The response text of the answer.
 * @param {string} answerData.question - The ID of the question the answer is for.
 *
 * @returns {Promise<ApiResponse<Answer>>} A promise that resolves with the created answer on success, or an error message on failure.
 */
export const createAnswer = async (answerData: {
  response: string
  question: string
}): Promise<ApiResponse<Answer>> => {
  try {
    const user = await getSupaUser()

    if (!user) {
      return { errorMessage: 'User not authenticated' }
    }

    const vals = { expert: user?.id, ...answerData }
    const response = await makeAuthenticatedBackendFetch('/answers/create/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(vals),
    })

    if (!response.ok) {
      throw new Error('Network response was not ok')
    }

    const responseData = (await response.json()) as Answer | { error: string }
    if ('error' in responseData) {
      return { errorMessage: responseData.error }
    } else {
      return { errorMessage: null, data: responseData }
    }
  } catch (error) {
    console.error('Error submitting answer:', error)
    return { errorMessage: 'Error submitting answer' }
  }
}

/**
 * @param {string} answer_id - The ID of the answer to upvote.
 * @param {UUID} expert - The ID of the expert who created the answer.
 *
 * @returns {Promise<ApiResponse<{ new_score: number }>>} A promise that resolves with the updated score on success, or an error message on failure.
 */
export const upvoteAnswer = async (
  answer_id: string,
  expert: UUID
): Promise<ApiResponse<{ new_score: number }>> => {
  try {
    const user = await getSupaUser()

    if (!user) {
      throw new Error('User not authenticated')
    }

    if (expert === user?.id) {
      throw new Error('You cannot upvote your own answer')
    }

    const response = await makeAuthenticatedBackendFetch('/answers/upvote/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: user.id,
        answer_id: answer_id,
      }),
    })

    if (!response.ok) {
      throw new Error('Network response was not ok')
    }

    const result = (await response.json()) as { new_score: number }
    return { errorMessage: null, data: result }
  } catch (error) {
    console.error('Error upvoting answer:', error)
    const message =
      error instanceof Error ? error.message : 'Error upvoting answer'
    return { errorMessage: message }
  }
}

/**
 * @param {string} answer_id - The ID of the answer to downvote.
 * @param {UUID} expert - The ID of the expert who created the answer.
 *
 * @returns {Promise<ApiResponse<{ new_score: number }>>} A promise that resolves with the updated score on success, or an error message on failure.
 */

export const downvoteAnswer = async (
  answer_id: string,
  expert: UUID
): Promise<ApiResponse<{ new_score: number }>> => {
  try {
    const user = await getSupaUser()

    if (!user) {
      throw new Error('User not authenticated')
    }

    if (expert === user?.id) {
      throw new Error('You cannot downvote your own answer')
    }

    const response = await makeAuthenticatedBackendFetch('/answers/downvote/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: user.id,
        answer_id: answer_id,
      }),
    })

    if (!response.ok) {
      throw new Error('Network response was not ok')
    }

    const result = (await response.json()) as { new_score: number }
    return { errorMessage: null, data: result }
  } catch (error) {
    console.error('Error downvoting answer:', error)
    const message =
      error instanceof Error ? error.message : 'Error downvoting answer'
    return { errorMessage: message }
  }
}

/**
 * @param {string} question_id - The ID of the question whose answers are to be retrieved.
 *
 * @returns {Promise<ApiResponse<Answer[]>>} A promise that resolves with a list of answers on success, or an error message on failure.
 */
export const getAnswersByQuestionId = async (
  question_id: string
): Promise<ApiResponse<Answer[]>> => {
  try {
    const user = await getSupaUser()

    let path = `/answers/getAnswersByQuestionId/${question_id}`
    if (user) {
      path = `/answers/getAnswersByQuestionIdWithUser/${question_id}/${user?.id}`
    }

    const response = await makeAuthenticatedBackendFetch(path, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Network response was not ok')
    }

    const answersData = (await response.json()) as Answer[]
    return { errorMessage: null, data: answersData }
  } catch (error) {
    console.error('Error fetching answers: ', error)
    return { errorMessage: 'Error fetching answers' }
  }
}
