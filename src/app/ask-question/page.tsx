'use client'

import { useState } from 'react'
import QuestionForm from '@/components/ask-question/QuestionForm'
import { useToast } from '../../components/ui/use-toast'
import { LoadingSpinner } from '../../components/ui/loading'

// Main page for asking a question
export default function AskQuestion() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  // Function to handle form submission and perform API call
  async function handleFormSubmit(values: { title: string; description: string }) {
    setIsLoading(true)

    try {
      const response = await fetch(`http://127.0.0.1:8000/questions/create/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      // Show success toast if successful
      toast({
        title: 'Success!',
        description: 'Your question has been submitted successfully.',
      })
    } catch (error) {
      // Show error toast if an error occurs
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'There was an error submitting your question.',
      })
    } finally {
      setIsLoading(false)
    }
  }

    // Conditional rendering for loading state
    if (isLoading) {
      return <LoadingSpinner />
    }

  return (
    <div className="items-center py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-gray-900 text-center">Ask a Question</h1>
      <QuestionForm onSubmit={handleFormSubmit} />
    </div>
  )
}
