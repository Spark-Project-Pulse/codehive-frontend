'use client'

import { LoadingSpinner } from '@/components/ui/loading'
import { type Question } from '@/types/Questions'
import { useEffect, useState } from 'react'
import AnswerForm from '@/components/pages/questions/[question_id]/AnswerForm'
import { useToast } from '@/components/ui/use-toast'
import { type Answer } from '@/types/Answers'
import { getQuestionById } from '@/api/questions'
import { createAnswer, getAnswersByQuestionId } from '@/api/answers'

export default function QuestionPage({
  params,
}: {
  params: { question_id: string }
}) {
  const { toast } = useToast()
  const [question, setQuestion] = useState<Question | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [answers, setAnswers] = useState<Answer[]>([])

  useEffect(() => {
    const fetchQuestion = async () => {
      setIsLoading(true)

      try {
        const { errorMessage, data } = await getQuestionById(params.question_id)

        if (!errorMessage && data) {
          setQuestion(data)
        } else {
          console.error('Error:', errorMessage)
        }
      } catch (error) {
        console.error('Unexpected error:', error)
      } finally {
        setIsLoading(false)
      }
    }

    const fetchAnswers = async () => {
      //TODO: A seperate loading spinner below the question for loading answers
      try {
        const { errorMessage, data }= await getAnswersByQuestionId(params.question_id)

        if (!errorMessage && data) {
          setAnswers(data)
        } else {
          console.error('Error:', errorMessage)
        }
      } catch (error) {
        console.error('Unexpected error:', error)
      } finally {
        // End answer loading state
      }
    }

    void fetchQuestion()
    void fetchAnswers()
  }, [params.question_id])

    // Function to handle answer form submission and perform API call
    async function handleAnswerSubmit(values: { response: string }) {
      // Append question_id to the values object
      const requestData = {
        ...values,
        question: params.question_id,
      }
  
      try {
        const response = await createAnswer(requestData)
        const { errorMessage, data } = response
  
        if (!errorMessage && data) {
          // Update the answers state to include the new answer
          setAnswers((prevAnswers) => [...prevAnswers, data])
        } else {
          toast({
            variant: 'destructive',
            title: 'Error',
            description: errorMessage,
          })
        }
      } catch (error) {
        console.error('Unexpected error:', error)
      }
    }

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
                <div className="list-disc pl-5">
                  {answers.map((answer) => (
                    <div
                      key={answer.answer_id}
                      className="mb-6 mt-6 rounded-lg bg-white p-6 shadow-lg"
                    >
                      Answer: {answer.response}
                      <p className="mt-4 text-gray-500">
                        Answered by:{' '}
                        {answer.expert_id ? answer.expert_id : 'Anonymous User'}
                      </p>
                    </div>
                  ))}
                </div>
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
