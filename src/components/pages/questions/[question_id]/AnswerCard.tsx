'use client'

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { type Answer } from '@/types/Answers'
import { type Comment } from '@/types/Comments'
import { ButtonWithLoading } from '@/components/universal/ButtonWithLoading'
import CommentForm from '@/components/pages/questions/[question_id]/CommentForm'
import CommentCard from '@/components/pages/questions/[question_id]/CommentCard'
import { UUID } from 'crypto'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import { downvoteAnswer, upvoteAnswer } from '@/api/answers'
import { toast } from '@/components/ui/use-toast'
import { decreaseReputation, increaseReputation } from '@/api/users'

interface AnswerCardProps {
  answer: Answer
  comments: Record<UUID, Comment[]>
  onCommentSubmit: (values: { response: string }) => void
  onAddComment: (answerId: UUID) => void
  openCommentFormId: string | null
}

export default function AnswerCard({
  answer,
  comments,
  onCommentSubmit,
  onAddComment,
  openCommentFormId,
}: AnswerCardProps) {
  // Initialize the score once, and persist it between renders
  const [optimisticAnswer, setOptimisticAnswer] = useState<number>(answer.score)

  // Sync the initial score when the answer score changes, only on mount or if the prop changes
  useEffect(() => {
    setOptimisticAnswer(answer.score)
  }, [answer.score])

  // Function to increase user's reputation
  const handleIncreaseReputation = async () => {
    try {
      const { errorMessage, data } = await increaseReputation(answer.asker_id)
      if (errorMessage) {
        throw new Error(errorMessage)
      }
    } catch (error) {
      console.log(error)
    }
  }

  // Function to decrease user's reputation
  const handleDecreaseReputation = async () => {
    try {
      const { errorMessage, data } = await decreaseReputation(answer.asker_id)
      if (errorMessage) {
        throw new Error(errorMessage)
      }
    } catch (error) {
      console.log(error)
    }
  }

  // Function to handle upvoting
  const handleUpvote = async () => {
    setOptimisticAnswer((currentScore) => currentScore + 1)

    try {
      const { errorMessage, data } = await upvoteAnswer(answer.answer_id)
      if (errorMessage) {
        throw new Error(errorMessage)
      } else {
        handleIncreaseReputation()
      }
    } catch (error) {
      // Revert optimistic state in case of error and show a toast notification
      setOptimisticAnswer((currentScore) => currentScore - 1)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Upvote failed. Please try again.',
      })
    }
  }

  // Function to handle downvoting
  const handleDownvote = async () => {
    setOptimisticAnswer((currentScore) => currentScore - 1)

    try {
      const { errorMessage, data } = await downvoteAnswer(answer.answer_id)
      if (errorMessage) {
        throw new Error(errorMessage)
      } else {
        handleDecreaseReputation()
      }
    } catch (error) {
      // Revert optimistic state in case of error and show a toast notification
      setOptimisticAnswer((currentScore) => currentScore + 1)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Downvote failed. Please try again.',
      })
    }
  }

  return (
    <Card className="mb-6 mt-6">
      <div className="flex">
        {/* Upvote/Downvote and Score */}
        <div className="flex flex-col items-center space-y-2 p-4">
          <Button
            onClick={() => handleUpvote()}
            variant="outline"
            className="flex items-center space-x-2 text-xl transition-colors hover:text-primary-foreground"
          >
            👍
          </Button>
          <h1>{optimisticAnswer}</h1>
          <Button
            onClick={() => handleDownvote()}
            variant="outline"
            className="flex items-center space-x-2 text-xl transition-colors hover:text-primary-foreground"
          >
            👎
          </Button>
        </div>

        {/* Card Content */}
        <div className="flex-1">
          <CardHeader>
            <CardTitle>Answer</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{answer.response}</p>
            <p className="mt-4 text-gray-500">
              Answered by:{' '}
              {answer.expert_info?.username
                ? answer.expert_info?.username
                : 'Anonymous User'}
            </p>
            {/* Comments Section */}
            {comments[answer.answer_id] &&
              comments[answer.answer_id].length > 0 && (
                <div className="mt-8">
                  <h2 className="text-lg font-bold">Comments:</h2>
                  <div className="list-disc pl-5">
                    {comments[answer.answer_id].map((comment) => (
                      <CommentCard key={comment.comment_id} comment={comment} />
                    ))}
                  </div>
                </div>
              )}
          </CardContent>
          <CardFooter>
            <ButtonWithLoading
              buttonType="button"
              buttonText="Add a comment"
              onClick={async () => {
                await onAddComment(answer.answer_id)
              }}
            />
            {/* Display comment form if applicable */}
            {openCommentFormId === answer.answer_id && (
              <CommentForm onSubmit={onCommentSubmit} />
            )}
          </CardFooter>
        </div>
      </div>
    </Card>
  )
}
