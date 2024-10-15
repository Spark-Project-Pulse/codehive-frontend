'use client'

import { useState } from 'react'
import QuestionForm from '@/components/ask-question/QuestionForm'
import { useToast } from '../../components/ui/use-toast'
import { LoadingSpinner } from '../../components/ui/loading'
import { useRouter } from 'next/navigation'

export default function AskQuestion() {
  const { toast } = useToast()
  const router = useRouter()

  // manage loading state
  const [isLoading, setIsLoading] = useState(false)

  // Handle form submission with the tags from the form values
  async function handleFormSubmit(values: { title: string; description: string; tags?: string[] }) {
    setIsLoading(true)

    console.log('Payload to be sent:', values)

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

      const responseData = (await response.json()) as { question_id: string }
      const questionId = responseData.question_id

      // Redirect to the question details page
      router.push(`/questions/${questionId}`)
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'There was an error submitting your question.',
      })
      console.error('Error creating question:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Show loading spinner while the form is being submitted
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
