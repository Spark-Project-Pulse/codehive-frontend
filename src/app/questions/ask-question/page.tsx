'use client'

import { useToast } from '@/components/ui/use-toast'
import { useRouter, useSearchParams } from 'next/navigation'
import { createQuestion } from '@/api/questions'
import QuestionForm from '@/components/pages/questions/ask-question/QuestionForm'
import { UUID } from 'crypto'

export default function AskQuestion() {
  const { toast } = useToast()
  const router = useRouter()
  const searchParams = useSearchParams()
  const communityId = searchParams.get('communityId') as UUID | null // Get communityId from URL

  // Function to handle form submission and perform API call
  async function handleFormSubmit(values: {
    title: string
    description: string
    related_project?: string
    related_community?: string
    tags?: string[] // Accept tags from form values
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
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'There was an unexpected error submitting your question.',
      })
    }
  }

  return (
    <div className="items-center px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-center text-h2 font-bold font-subHeading text-secondary-foreground">
        Ask a Question
      </h1>
      <QuestionForm onSubmit={handleFormSubmit} communityId={communityId} />
    </div>
  )
}