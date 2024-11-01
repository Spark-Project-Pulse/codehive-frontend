'use client'

import { LoadingSpinner } from '@/components/ui/loading'
import { type Question } from '@/types/Questions'
import { useEffect, useState } from 'react'
import AnswerCard from '@/components/pages/questions/[question_id]/AnswerCard'
import QuestionCard from '@/components/pages/questions/[question_id]/QuestionCard'
import AnswerForm from '@/components/pages/questions/[question_id]/AnswerForm'
import { useToast } from '@/components/ui/use-toast'
import { type Answer } from '@/types/Answers'
import { type Comment } from '@/types/Comments'
import { getQuestionById } from '@/api/questions'
import { createAnswer, getAnswersByQuestionId } from '@/api/answers'
import { createComment, getCommentsByAnswerId } from '@/api/comments'
import { type UUID } from 'crypto'
import SkeletonAnswerCard from '@/components/pages/questions/[question_id]/SkeletonAnswerCard'
import SkeletonQuestionsCard from '@/components/pages/questions/[question_id]/SkeletonQuestionCard'
import { Skeleton } from '@/components/ui/skeleton'

export default function QuestionPage({
  params,
}: {
  params: { question_id: string }
}) {
  const { toast } = useToast()
  const [question, setQuestion] = useState<Question | null>(null)
  const [answers, setAnswers] = useState<Answer[]>([])
  const [openCommentFormId, setOpenCommentFormId] = useState<string | null>(
    null
  )
  const [comments, setComments] = useState<Record<UUID, Comment[]>>({}) // Each answer_id is mapped to a list of comments

  const [isLoadingQuestion, setIsLoadingQuestion] = useState<boolean>(true)
  const [isLoadingAnswers, setIsLoadingAnswers] = useState<boolean>(true)
  const [isLoadingComments, setIsLoadingComments] = useState<
    Record<UUID, boolean>
  >({})
  const isLoading = isLoadingQuestion || isLoadingAnswers

  useEffect(() => {
    const fetchQuestion = async () => {
      setIsLoadingQuestion(true)

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
        setIsLoadingQuestion(false)
      }
    }

    const fetchAnswers = async () => {
      setIsLoadingAnswers(true)

      try {
        const { errorMessage, data } = await getAnswersByQuestionId(
          params.question_id
        )

        if (!errorMessage && data) {
          setAnswers(data)

          // Fetches comments for each answer
          data.forEach((answer: Answer) => {
            void fetchComments(answer.answer_id)
          })
        } else {
          console.error('Error:', errorMessage)
        }
      } catch (error) {
        console.error('Unexpected error:', error)
      } finally {
        setIsLoadingAnswers(false)
      }
    }

    // Fetches the comments of an answer
    const fetchComments = async (answer_id: UUID) => {
      setIsLoadingComments((prev) => ({ ...prev, [answer_id]: true }))

      try {
        const { errorMessage, data } = await getCommentsByAnswerId(answer_id)

        if (!errorMessage && data) {
          setComments((prevComments) => ({
            ...prevComments,
            [answer_id]: data,
          }))
        } else {
          console.error('Error fetching comments:', errorMessage)
        }
      } catch (error) {
        console.error('Unexpected error fetching comments:', error)
      } finally {
        setIsLoadingComments((prev) => ({ ...prev, [answer_id]: false }))
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

  // Function to handle add comment button
  function handleAddComment(answerId: UUID): Promise<void> {
    return new Promise((resolve) => {
      if (openCommentFormId === answerId) {
        // Close the form if it's already open for an answer
        setOpenCommentFormId(null)
      } else {
        // Open the form for the clicked answer (also closes any opened commentform)
        setOpenCommentFormId(answerId)
      }
      resolve()
    })
  }

  // Function to handle submitting a comment
  async function handleCommentSubmit(values: { response: string }) {
    if (openCommentFormId == null) {
      console.log('Error: CommentFormId empty?')
    } else {
      const requestData = {
        ...values,
        answer: openCommentFormId,
      }
      try {
        const response = await createComment(requestData)
        const { errorMessage, data } = response

        if (!errorMessage && data) {
          // Update the comments state to include new comment
          setComments((prevComments) => ({
            ...prevComments,
            [data.answer]: [...(prevComments[data.answer] || []), data],
          }))
        } else {
          toast({
            variant: 'destructive',
            title: 'Error',
            description: errorMessage,
          })
        }

        // Close comment form upon submit
        setOpenCommentFormId(null)
      } catch (error) {
        console.error('Unexpected error:', error)
      }
    }
  }

  // // Conditional rendering for loading state
  // if (isLoading) {
  //   return <LoadingSpinner />
  // }

  return (
    <section className="min-h-screen bg-gray-100 py-24">
      <div className="mx-auto max-w-4xl px-4">
        {isLoadingQuestion ? (
          <SkeletonQuestionsCard />
        ) : question ? (
          <QuestionCard question={question} />
        ) : (
          <div className="rounded-lg border border-red-400 bg-red-100 p-4 text-red-700">
            <h2 className="text-lg font-bold">Question not found</h2>
          </div>
        )}

          {/* Show all current answers below question, if answers exists */}
          {isLoadingAnswers ? (
            <div className="mt-8">
              <Skeleton className="h-6 w-12" />
              <div className="list-disc pl-5">
                {Array.from({ length: 2 }).map((_, index) => (
                  <SkeletonAnswerCard key={index} />
                ))}
              </div>
            </div>
          ) : (
            answers.length > 0 && (
              <div className="mt-8">
                <h2 className="text-lg font-bold">
                  {answers.length}{' '}
                  {answers.length === 1 ? 'Answer' : 'Answers'}
                </h2>
                <div className="list-disc pl-5">
                  {answers.map((answer) => (
                    <AnswerCard
                      key={answer.answer_id}
                      answer={answer}
                      comments={comments}
                      upvoted={answer.curr_user_upvoted ?? false}
                      downvoted={answer.curr_user_downvoted ?? false}
                      onCommentSubmit={handleCommentSubmit}
                      onAddComment={handleAddComment}
                      openCommentFormId={openCommentFormId}
                      // isLoadingComments={loadingComments[answer.answer_id]}
                    />
                  ))}
                </div>
              </div>
            )
          )}

          {/* Answer button */}
          {!isLoading &&
          <div className="items-center px-4 py-12 sm:px-6 lg:px-8">
            <h1 className="text-center text-2xl font-bold text-gray-900">
              Answer Question
            </h1>
            <AnswerForm onSubmit={handleAnswerSubmit} />
          </div>
          }
      </div>
    </section>
  )
}
