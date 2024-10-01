'use client'
import QuestionForm from '@/components/ask-question/QuestionForm'
import { useEffect, useState } from 'react'

// A function that renders the ask question page
export default function AskQuestion() {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [questionTitle, setQuestionTitle] = useState<string>()
  const [questionDescription, setQuestionDescription] = useState<string>()

  useEffect(() => {}, [])

  return (
    <div className="">
      <QuestionForm />
    </div>
  )
}
