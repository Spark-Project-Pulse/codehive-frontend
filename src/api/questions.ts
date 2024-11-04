'use server'

import { type ApiResponse } from '@/types/Api'
import { type Question } from '@/types/Questions'
import { getSupaUser } from '@/utils/supabase/server'
import { type UUID } from 'crypto'



/**
 * Creates a new question by sending a POST request to the backend.
 *
 * Args:
 *   values: An object containing `title` and `description` for the question.
 *
 * Returns:
 *   Promise<ApiResponse<{ question_id: string }>>: The created question's ID on success, or an error message on failure.
 */
export const createQuestion = async (values: {
  title: string
  description: string
}): Promise<ApiResponse<{ question_id: string }>> => {
  try {
    const user = await getSupaUser()

    const vals = { asker: user?.id, ...values }
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
      data: { question_id: responseData.question_id },
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

// Define the structure of the search response
interface SearchResponse {
  results: Question[]
}

// Define the structure of the getAll response
interface GetAllResponse {
  questions: Question[]
  totalQuestions: number
}

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

    const responseData: unknown = await response.json()

    if (searchQuery.trim()) {
      // Response from search endpoint
      const searchResponseData = responseData as SearchResponse
      return {
        errorMessage: null,
        data: {
          questions: searchResponseData.results,
          totalQuestions: searchResponseData.results.length, // Adjust if backend provides total count
        },
      }
    } else {
      // Response from getAll endpoint
      const getAllResponseData = responseData as GetAllResponse
      return {
        errorMessage: null,
        data: {
          questions: getAllResponseData.questions,
          totalQuestions: getAllResponseData.totalQuestions,
        },
      }
    }
  } catch (error) {
    console.error('Error fetching questions:', error)
    return { errorMessage: 'Error fetching questions' }
  }
}
