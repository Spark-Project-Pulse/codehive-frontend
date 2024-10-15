'use client'

import QuestionForm from '@/components/pages/questions/ask-question/QuestionForm'
import { useToast } from '@/components/ui/use-toast'
import { useRouter } from 'next/navigation'
import { createQuestion } from '@/api/questions'

// Main page for asking a question
export default function AskQuestion() {
  const { toast } = useToast()
  const router = useRouter()

  // Function to handle form submission and perform API call
  async function handleFormSubmit(values: {
    title: string
    description: string
  }) {
    try {
      const response = await createQuestion(values)
      const { errorMessage, data } = response

      if (!errorMessage && data?.question_id) {
        // Navigate to the new question page using question_id
        router.push(`/questions/${data.question_id}`)
      } else {
        // Show error toast if an error occurs
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'There was an error submitting your question.',
        })
      }
    } catch (error) {
      console.error('Unexpected error:', error)
    }
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
