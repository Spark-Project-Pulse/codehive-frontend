'use server'

import { type ApiResponse } from '@/types/Api'
import { type Question, type ListQuestionsRepsonse } from '@/types/Questions'
import { getSupaUser } from '@/utils/supabase/server'
import { type UUID } from 'crypto'



/**
 * Creates a new question by sending a POST request to the backend.
 *
 * Args:
 *   values: An object containing `title` and `description` for the question.
 *
 * Returns:
 *   Promise<ApiResponse<{ question_id: string, toxic: boolean }>>: The created question's ID on success, or an error message on failure.
 */
export const createQuestion = async (values: {
  title: string
  description: string
}): Promise<ApiResponse<{ question_id: string, toxic?: boolean }>> => {
  try {
    const user = await getSupaUser()

    const vals = { asker: user?.id, is_answered: false, ...values }
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/questions/create/`,
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

    const responseData = (await response.json()) as Question
    return {
      errorMessage: null,
      data: { question_id: responseData.question_id, toxic: responseData.toxic },
    }
  } catch (error) {
    console.error('Error creating question: ', error)
    return { errorMessage: 'Error creating question' }
  }
}

/**
 * Fetches all the questions associated with a user by their ID from the backend.
 *
 * Args:
 *   user_id (string): The ID of the user.
 *
 * Returns:
 *   Promise<ApiResponse<Question[]>>: The questions data on success, or an error message on failure.
 */
export const getQuestionsByUserId = async (
  user_id: string
): Promise<ApiResponse<Question[]>> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/questions/getByUserId/${user_id}`,
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

    const questionData = (await response.json()) as Question[]
    return { errorMessage: null, data: questionData }
  } catch (error) {
    console.error('Error fetching questions: ', error)
    return { errorMessage: 'Error fetching questions' }
  }
}

/**
 * Fetches a question by its ID from the backend.
 *
 * Args:
 *   question_id (string): The ID of the question to retrieve.
 *
 * Returns:
 *   Promise<ApiResponse<Question>>: The question data on success, or an error message on failure.
 */
export const getQuestionById = async (
  question_id: string
): Promise<ApiResponse<Question>> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/questions/getById/${question_id}`,
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

    const questionData = (await response.json()) as Question
    return { errorMessage: null, data: questionData }
  } catch (error) {
    console.error('Error fetching question: ', error)
    return { errorMessage: 'Error fetching question' }
  }
}

/**
 * Fetches questions with pagination, optional tag filtering, and search functionality.
 *
 * Args:
 *   pageNumber (number): The current page number.
 *   pageSize (number): The number of questions per page.
 *   selectedTags (string[]): An array of selected tag IDs.
 *   searchQuery (string): The search query string.
 *
 * Returns:
 *   Promise<ApiResponse<{ questions: Question[]; totalQuestions: number }>>: The questions data on success, or an error message on failure.
 */

export const getAllQuestions = async (
  pageNumber: number,
  pageSize: number,
  selectedTags: string[],
  searchQuery: string,
  related_community_id: UUID | null
): Promise<ApiResponse<{ questions: Question[]; totalQuestions: number }>> => {
  try {
    let url = ''
    const params = new URLSearchParams()

    if (searchQuery.trim()) {
      // Use the search endpoint
      url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/questions/search/`
      params.append('q', searchQuery.trim())
    } else {
      // Use the general getAll endpoint
      url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/questions/getAll/`
      params.append('page', pageNumber.toString())
      params.append('page_size', pageSize.toString())
    }

    // Append tags in both cases
    selectedTags.forEach((tagId) => {
      params.append('tags', tagId)
    })
    if (related_community_id) {
      params.append('related_community_id', related_community_id.toString())
    }

    // Always append pagination parameters
    params.append('page', pageNumber.toString())
    params.append('page_size', pageSize.toString())

    const response = await fetch(`${url}?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`)
    }

    const responseData = await response.json() as ListQuestionsRepsonse

    return {
      errorMessage: null,
      data: {
        questions: responseData.questions,
        totalQuestions: responseData.totalQuestions,
      },
    }

  } catch (error) {
    console.error('Error fetching questions:', error)
    return { errorMessage: 'Error fetching questions' }
  }
}

/**
 * Marks a question as answered or un-answered, depending on current state
 *
 * Args:
 *   None
 *
 * Returns:
 *   Promise<ApiResponse<Question>>: The question data on success, or an error message on failure.
 */
export const changeMark = async (question_id: string): Promise<ApiResponse<Question>> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/questions/changeMark/${question_id}/`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    if (!response.ok) {
      throw new Error('Network response was not ok')
    }

    const questionData = (await response.json()) as Question
    return { errorMessage: null, data: questionData }
  } catch (error) {
    console.error('Error fetching question: ', error)
    return { errorMessage: 'Error fetching question' }
  }
}