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
        const questionData: Question = responseData.data[0]

        setQuestion(questionData)
      } catch (error) {
        console.error('Error fetching question:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchQuestion()
  }, [])

  // Conditional rendering for loading state
  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <section className="py-24 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto px-4">
        {question ? (
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">{question.title}</h1>
            <p className="text-gray-600 text-lg">{question.description}</p>
          </div>
        ) : (
          <div className="bg-red-100 border border-red-400 text-red-700 rounded-lg p-4">
            <h2 className="text-lg font-bold">Question not found</h2>
          </div>
        )}
      </div>
    </section>
  )
}
