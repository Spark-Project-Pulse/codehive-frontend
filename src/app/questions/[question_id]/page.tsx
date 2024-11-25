'use client'

import { type Question } from '@/types/Questions'
import { useEffect, useState } from 'react'
import AnswerCard from '@/components/pages/questions/[question_id]/AnswerCard'
import QuestionCard from '@/components/pages/questions/[question_id]/QuestionCard'
import AnswerForm from '@/components/pages/questions/[question_id]/AnswerForm'
import { useToast } from '@/components/ui/use-toast'
import { type Answer } from '@/types/Answers'
import { type Comment } from '@/types/Comments'
import { getQuestionById, changeMark } from '@/api/questions'
import { createAnswer, getAnswersByQuestionId } from '@/api/answers'
import { createComment, getCommentsByAnswerId } from '@/api/comments'
import { type UUID } from 'crypto'
import SkeletonAnswerCard from '@/components/pages/questions/[question_id]/SkeletonAnswerCard'
import SkeletonQuestionCard from '@/components/pages/questions/[question_id]/SkeletonQuestionCard'
import { Skeleton } from '@/components/ui/skeleton'
import NotAuthenticatedPopup from '@/components/universal/NotAuthenticatedPopup'
import { Button } from '@/components/ui/button'
import { useUser } from '@/app/contexts/UserContext'

interface QuestionPageProps {
  params: { question_id: string }
}

export default function QuestionPage({ params }: QuestionPageProps) {
  const { toast } = useToast()
  const { user: currentUser } = useUser()
  const [question, setQuestion] = useState<Question | null>(null)
  const [answers, setAnswers] = useState<Answer[]>([])
  const [comments, setComments] = useState<Record<UUID, Comment[]>>({}) // Each answer_id is mapped to a list of comments
  const [isAnswered, setIsAnswered] = useState<boolean | null>(null)
  const isOwner = question?.asker === currentUser?.user

  const [isLoadingQuestion, setIsLoadingQuestion] = useState<boolean>(true)
  const [isLoadingAnswers, setIsLoadingAnswers] = useState<boolean>(true)
  const [isLoadingComments, setIsLoadingComments] = useState<
    Record<UUID, boolean>
  >({})
  const isLoading = isLoadingQuestion || isLoadingAnswers
  const [authPopupOpen, setAuthPopupOpen] = useState(false) // State to control popup visibility

  useEffect(() => {
    const fetchQuestion = async () => {
      setIsLoadingQuestion(true)

      try {
        const { errorMessage, data } = await getQuestionById(params.question_id)

        if (!errorMessage && data) {
          setQuestion(data)
          setIsAnswered(data.is_answered)
          console.log("is_owner: ", isOwner)
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
  async function handleAnswerSubmit(values: {
    response: string
  }): Promise<void> {
    // Append question_id to the values object
    const requestData = {
      ...values,
      question: params.question_id,
    }

    try {
      const response = await createAnswer(requestData)
      const { errorMessage, data } = response

      if (!errorMessage && data && !data?.toxic) {
        // Update the answers state to include the new answer
        setAnswers((prevAnswers) => [...prevAnswers, data])
      } else if (data?.toxic) {
        // Show toxic content toast if there is toxic content
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Toxic content detected in your answer.',
        })
      } else if (errorMessage === 'User not authenticated') {
        // Open the authentication popup
        setAuthPopupOpen(true)
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

  // Function to handle submitting a comment
  async function handleCommentSubmit(values: {
    response: string
    answer: string
  }): Promise<void> {
    try {
      const response = await createComment(values)
      const { errorMessage, data } = response

      if (!errorMessage && data && !data?.toxic) {
        // Update the comments state to include new comment
        setComments((prevComments) => ({
          ...prevComments,
          [data.answer]: [...(prevComments[data.answer] || []), data],
        }))
      } else if (data?.toxic) {
        // Show toxic content toast if there is toxic content
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Toxic content detected in your comment.',
        })
      } else if (errorMessage === 'User not authenticated') {
        // Open the authentication popup
        setAuthPopupOpen(true)
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

  async function handleChangeMark(): Promise<void> {
    try {
      const response = await changeMark(params.question_id)
      const { errorMessage, data } = response
      if (!errorMessage && data) {
        // Update state for mark
        setIsAnswered(data.is_answered)
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

  return (
    <>
      {/* Popup for unauthenticated users */}
      <NotAuthenticatedPopup
        isOpen={authPopupOpen}
        onClose={() => {
          setAuthPopupOpen(false)
        }}
      />
      <section className="min-h-screen py-24">
        <div className="mx-auto max-w-4xl px-4">
          {isLoadingQuestion ? (
            <SkeletonQuestionCard />
          ) : question ? (
            <>
              {isAnswered && (
                <div className="rounded-lg border border-green-400 bg-green-100 p-4 text-green-700">
                  {isOwner ? <h2 className="text-lg font-bold">
                    You have marked this question as answered
                  </h2> : <h2 className="text-lg font-bold">
                    This question has already been answered
                  </h2>}

                </div>
              )}
              <QuestionCard question={question} />
            </>
          ) : (
            <div className="rounded-lg border border-red-400 bg-red-100 p-4 text-red-700">
              <h2 className="text-lg font-bold">Question not found</h2>
            </div>
          )}

          {isOwner && (
            <Button
              variant="outline"
              onClick={() => handleChangeMark()}
              id="width"
              className="col-span-2 h-10"
            >
              {isAnswered ? "Mark as Unanswered" : "Mark as Answered"}
            </Button>
          )}


          {/* Show all current answers below question, if answers exist */}
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
                  {answers.length} {answers.length === 1 ? 'Answer' : 'Answers'}
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
                      isLoadingComments={isLoadingComments[answer.answer_id]}
                    />
                  ))}
                </div>
              </div>
            )
          )}

          {/* Answer form */}
          {!isLoading && (
            <div className="items-center px-4 py-12 sm:px-6 lg:px-8">
              <h1 className="text-center text-2xl font-bold">
                Answer Question
              </h1>
              <AnswerForm onSubmit={handleAnswerSubmit} />
            </div>
          )}
        </div>
      </section>
    </>
  )
}
