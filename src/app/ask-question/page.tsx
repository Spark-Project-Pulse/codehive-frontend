'use client'

import { useState } from 'react'
import QuestionForm from '@/components/ask-question/QuestionForm'
import { useToast } from '../../components/ui/use-toast'
import { LoadingSpinner } from '../../components/ui/loading'
import { useRouter } from 'next/navigation'

// Main page for asking a question
export default function AskQuestion() {
  const { toast } = useToast()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  // Function to handle form submission and perform API call
  async function handleFormSubmit(values: {
    title: string
    description: string
  }) {
    setIsLoading(true)

    //TODO: Move API to seperate place for all question API calls
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/questions/create/`, {
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
      const responseData = await response.json()

      // Access the question_id
      const questionId = responseData["question_id"]

      // Navigate to the new question page using question_id
      router.push(`/questions/${questionId}`) // Change to the desired route format
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

  // Conditional rendering for loading state
  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <div className="items-center px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-center text-2xl font-bold text-gray-900">
        Ask a Question
      </h1>
      <QuestionForm onSubmit={handleFormSubmit} />
    </div>
  )
}
