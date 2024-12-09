'use server'

import { type ApiResponse } from '@/types/Api'
import { type Question, type ListQuestionsRepsonse } from '@/types/Questions'
import { getSupaUser } from '@/utils/supabase/server'
import { type UUID } from 'crypto'

/**
 * Creates a new question by sending a POST request to the backend.
 *
 * @param {Object} values - An object containing `title` and `description` for the question.
 * @param {string} values.title - The title of the question.
 * @param {string} values.description - The description of the question.
 * @returns {Promise<ApiResponse<{ question_id: string }>>} The created question's ID on success, or an error message on failure.
 * @throws {Error} Throws an error if the network request fails or returns a non-OK response.
 * 
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

    const responseData = (await response.json()) as Question | { error: string }

    if ('error' in responseData) {
      return { errorMessage: responseData.error }
    } else {
      return {
        errorMessage: null,
        data: { question_id: responseData.question_id },
      }
    }
  } catch (error) {
    console.error('Error creating question: ', error)
    return { errorMessage: 'Error creating question' }
  }
}

/**
 * Fetches all the questions associated with a user by their ID from the backend.
 *
 * @param {string} user_id - The ID of the user.
 * @returns {Promise<ApiResponse<Question[]>>} The questions data on success, or an error message on failure.
 * 
 */
export const getQuestionsByUserId = async (
  user_id: string
): Promise<ApiResponse<Question[]>> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/questions/getByUserId/${user_id}/`,
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
 * @param {string} question_id - The ID of the question to retrieve.
 * @returns {Promise<ApiResponse<Question>>} The question data on success, or an error message on failure.
 * 
 */
export const getQuestionById = async (
  question_id: string
): Promise<ApiResponse<Question>> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/questions/getById/${question_id}/`,
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
 * @param {number} pageNumber - The current page number.
 * @param {number} pageSize - The number of questions per page.
 * @param {string[]} selectedTags - An array of selected tag IDs.
 * @param {string} searchQuery - The search query string.
 * @param {string} sortBy - Sort filter applied to the search
 * @returns {Promise<ApiResponse<{ questions: Question[]; totalQuestions: number }>>} The questions data on success, or an error message on failure.
 * 
 */

export const getAllQuestions = async (
    pageNumber: number,
    pageSize: number,
    selectedTags: string[],
    searchQuery: string,
    related_community_id: UUID | null,
    sortBy: string
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
      }
  
      // Append tags
      selectedTags.forEach((tagId) => {
        params.append('tags', tagId)
      })
      if (related_community_id) {
        params.append('related_community_id', related_community_id.toString())
      }
  
      // Always append pagination and sortBy parameters
      params.append('page', pageNumber.toString())
      params.append('page_size', pageSize.toString())
      params.append('sort_by', sortBy)
  
      const response = await fetch(`${url}?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
  
      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(
          `HTTP error! Status: ${response.status}, Message: ${errorText}`
        )
      }
  
      const responseData = (await response.json()) as ListQuestionsRepsonse
  
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
 * @returns {Promise<ApiResponse<Question>>} The question data on success, or an error message on failure.
 *
 */
export const changeMark = async (
  question_id: string
): Promise<ApiResponse<Question>> => {
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

/**
 * Updates an existing question by sending a PUT request to the backend.
 *
 * @param {Object} values - An object containing `question_id`, `asker`, `title` and `description` for the question.
 * @param {string} values.questionId - The id of the question.
 * @param {string} values.asker - The asker of the question.
 * @param {string} values.title - The title of the question.
 * @param {string} values.description - The description of the question.
 * @returns {Promise<ApiResponse<{ question_id: string }>>} The updated question's ID on success, or an error message on failure.
 *
 */
export const updateQuestion = async (values: {
  questionId: string
  asker: string
  title: string
  description: string
}): Promise<ApiResponse<{ question_id: string }>> => {
  try {
    const user = await getSupaUser()

    if (!user) {
      throw new Error('User not authenticated')
    }

    if (user.id !== values.asker) {
      throw new Error('You are not authorized to update this question')
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/questions/update/${values.questionId}/`,
      {
        method: 'PUT', // Use PUT for updates
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      }
    )

    if (!response.ok) {
      throw new Error('Network response was not ok')
    }

    const responseData = (await response.json()) as Question | { error: string }

    if ('error' in responseData) {
      return { errorMessage: responseData.error }
    } else {
      return {
        errorMessage: null,
        data: {
          question_id: responseData.question_id,
        },
      }
    }
  } catch (error) {
    console.error('Error updating question: ', error)
    throw new Error('Error updating question')
  }
}

/**
 * Deletes an existing question by sending a DELETE request to the backend.
 *
 * @param {string} questionId - The question id for the question to be deleted.
 * @param {string?} asker - The user id of the user who asked the question.
 * @returns {Promise<ApiResponse<{ message: string }>>} A message if the question was deleted, otherwise an error message.
 *
 */
export const deleteQuestion = async (
  questionId: string,
  asker?: string
): Promise<ApiResponse<{ message: string }>> => {
  try {
    const user = await getSupaUser()

    if (!user) {
      throw new Error('User not authenticated')
    }

    if (user.id !== asker) {
      throw new Error('You are not authorized to delete this question')
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/questions/delete/${questionId}/`,
      {
        method: 'DELETE', // Use DELETE
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ asker }),
      }
    )

    if (!response.ok) {
      throw new Error('Network response was not ok')
    }

    const responseData = (await response.json()) as string
    return {
      errorMessage: null,
      data: {
        message: responseData,
      },
    }
  } catch (error) {
    console.error('Error deleting question: ', error)
    throw new Error('Error deleting question')
  }
}
