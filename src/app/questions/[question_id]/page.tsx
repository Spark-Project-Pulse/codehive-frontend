'use client'

import { LoadingSpinner } from '@/components/ui/loading'
import { type Question } from '@/types/Question'
import { useEffect, useState } from 'react'
import AnswerForm from '@/components/answer-question/AnswerForm'
import { useToast } from '@/components/ui/use-toast'
import { type Answer } from '@/types/Answer'

export default function QuestionPage({
  params,
}: {
  params: { question_id: string }
}) {
  const { toast } = useToast()
  const [question, setQuestion] = useState<Question | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [answers, setAnswers] = useState<Answer[]>([]);

  // Function to handle answer form submission and perform API call
  async function handleAnswerSubmit(values: {
    answer_field: string
  }) {
    setIsLoading(true)

    //TODO: Move API to seperate place for all answer API calls
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/answers/create/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      // Extract the JSON data from the response
      const responseData = await response.json() as Answer

      // Update the answers state to include the new answer
      setAnswers((prevAnswers) => [...prevAnswers, responseData]);

    } catch (error) {
      // Show error toast if an error occurs
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'There was an error submitting your question.',
      })
      console.error("Error creating question:", error);
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    //TODO: Move API to seperate place for all question API calls
    const fetchQuestion = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/questions/getById/${params.question_id}`,
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
        const questionData = await response.json() as Question

        setQuestion(questionData)
      } catch (error) {
        console.error('Error fetching question:', error)
      } finally {
        setIsLoading(false)
      }
    }

    void fetchQuestion()
  }, [params.question_id])

  // Conditional rendering for loading state
  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <section className="min-h-screen bg-gray-100 py-24">
      <div className="mx-auto max-w-4xl px-4">
        {question ? (
          <div>
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
            {/* Show all current answers below question, if answers exists */}
            {answers.length > 0 && (
              <div className="mt-8">
                <h2 className="text-lg font-bold">Current Answers:</h2>
                <ul className="list-disc pl-5">
                  {answers.map((answer) => (
                    <li key={answer.answer_id}>
                      Answer ID: {answer.answer_id}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {/* Answer button */}
            <div className="items-center px-4 py-12 sm:px-6 lg:px-8">
              <h1 className="text-center text-2xl font-bold text-gray-900">
                Answer Question
              </h1>
              <AnswerForm onSubmit={handleAnswerSubmit} />
            </div>
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
