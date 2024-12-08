'use client'

import { useToast } from '@/components/ui/use-toast'
import { useRouter, useSearchParams } from 'next/navigation'
import { createQuestion } from '@/api/questions'
import QuestionForm from '@/components/pages/questions/ask-question/QuestionForm'
import { type UUID } from 'crypto'
import * as React from 'react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'

export default function AskQuestionWrapper() {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <AskQuestion />
    </React.Suspense>
  )
}

function AskQuestion() {
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
          description:
            errorMessage ?? 'There was an error submitting your question.',
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
    <div>
      <h1 className="text-center text-h4 font-heading relative mb-4">
        Ask a Question
      </h1>
      <div className="flex items-center justify-center relative">
        <div className="bg-gradient-to-b from-primary to-tertiary p-[2px] rounded-md">
          <Card className="mx-auto w-full max-w-4xl">
            <CardHeader>
              <CardDescription>
                Fill out the form below to ask a question. You can add tags and/or
                submit the question to a community. You can also link an existing
                project or create one as needed.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <QuestionForm onSubmit={handleFormSubmit} communityId={communityId} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
