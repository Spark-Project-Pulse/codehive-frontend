'use client'

import { LoadingSpinner } from '@/components/ui/loading'
import { Question } from '@/types/Question'
import { useEffect, useState } from 'react'

export default function QuestionPage({
  params,
}: {
  params: { question_id: string }
}) {
  const [question, setQuestion] = useState<Question | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    //TODO: Move API to seperate place for all question API calls
    const fetchQuestion = async () => {
      try {
        //TODO: Switch url to be different based on dev environment and prod
        const response = await fetch(
          `http://127.0.0.1:8000/questions/getById/${params.question_id}`,
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
        const responseData = await response.json()

        // Get the data as type Question
        const questionData: Question = responseData 

        setQuestion(questionData)
      } catch (error) {
        console.error('Error fetching question:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchQuestion()
  }, [params.question_id])

  // Conditional rendering for loading state
  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <section className="min-h-screen bg-gray-100 py-24">
      <div className="mx-auto max-w-4xl px-4">
        {question ? (
          <div className="rounded-lg bg-white p-6 shadow-lg">
            <h1 className="mb-4 text-3xl font-bold text-gray-800">
              {question.title}
            </h1>
            <p className="text-lg text-gray-600">{question.description}</p>
            <p className="mt-4 text-gray-500">
              Asked by:{' '}
              {question.asker_id ? question.asker_id : 'Anonymous User'}
            </p>
          </div>
        ) : (
          <div className="rounded-lg border border-red-400 bg-red-100 p-4 text-red-700">
            <h2 className="text-lg font-bold">Question not found</h2>
          </div>
        )}
      </div>
    </section>
  )
}
