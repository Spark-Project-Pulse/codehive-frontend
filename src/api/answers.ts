'use server'

import { type ApiResponse } from '@/types/Api'
import { type Answer } from '@/types/Answers'
import { getSupaUser } from '@/utils/supabase/server'
import { type UUID } from 'crypto'

/**
 * Submits an answer to a question.
 *
 * Args:
 *   answerData: The response and question ID for the answer.
 *
 * Returns:
 *   Promise<ApiResponse<Answer>>: The created answer on success, or an error message on failure.
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
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/answers/create/`,
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

    const createdAnswer = (await response.json()) as Answer
    return { errorMessage: null, data: createdAnswer }
  } catch (error) {
    console.error('Error submitting answer:', error)
    return { errorMessage: 'Error submitting answer' }
  }
}

/**
 * Upvotes an answer, decreasing its score by 1.
 * If the user has already upvoted, the vote is switched to a upvote.
 *
 * Args:
 *   answer_id: The ID of the answer to upvote.
 *
 * Returns:
 *   Promise<ApiResponse<{ new_score: number }>>: The updated score on success, or an error message on failure.
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
      throw new Error("You cannot upvote your own answer")
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/answers/upvote/`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.id,
          answer_id: answer_id,
        }),
      }
    )

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
 * Downvotes an answer, decreasing its score by 1.
 * If the user has already upvoted, the vote is switched to a downvote.
 *
 * Args:
 *   answer_id: The ID of the answer to downvote.
 *
 * Returns:
 *   Promise<ApiResponse<{ new_score: number }>>: The updated score on success, or an error message on failure.
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
      throw new Error("You cannot downvote your own answer")
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/answers/downvote/`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.id,
          answer_id: answer_id,
        }),
      }
    )

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
 * Fetches answers by question ID from the backend.
 *
 * Args:
 *   question_id (string): The ID of the question whose answers to retrieve.
 *
 * Returns:
 *   Promise<ApiResponse<Answer[]>>: The list of answers on success, or an error message on failure.
 */
export const getAnswersByQuestionId = async (
  question_id: string
): Promise<ApiResponse<Answer[]>> => {
  try {
    const user = await getSupaUser()

    let url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/answers/getAnswersByQuestionId/${question_id}`

    if (user) {
      url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/answers/getAnswersByQuestionIdWithUser/${question_id}/${user?.id}`
    }
    const response = await fetch(url, {
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
