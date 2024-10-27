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
import { type UUID } from 'crypto'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { downvoteAnswer, upvoteAnswer } from '@/api/answers'
import { toast } from '@/components/ui/use-toast'
import { changeReputationByAmount } from '@/api/users'

interface AnswerCardProps {
  answer: Answer
  comments: Record<UUID, Comment[]>
  upvoted: boolean
  downvoted: boolean
  onCommentSubmit: (values: { response: string }) => void
  onAddComment: (answerId: UUID) => void
  openCommentFormId: string | null
}

export default function AnswerCard({
  answer,
  comments,
  upvoted,
  downvoted,
  onCommentSubmit,
  onAddComment,
  openCommentFormId,
}: AnswerCardProps) {
  const [optimisticScore, setOptimisticScore] = useState<number>(answer.score)
  const [hasUpvoted, setHasUpvoted] = useState<boolean>(upvoted)
  const [hasDownvoted, setHasDownvoted] = useState<boolean>(downvoted)

  // Function to change user's reputation
  const handleChangeReputation = async (amount: string) => {
    try {
      const { errorMessage } = await changeReputationByAmount(
        answer.expert,
        amount
      )
      if (errorMessage) {
        throw new Error(errorMessage)
      }
    } catch (error) {
      console.log(error)
    }
  }

  // Function to handle upvoting
  const handleUpvote = async () => {
    const prevScore = optimisticScore
    const prevUpvoted = hasUpvoted
    const prevDownvoted = hasDownvoted

    // Toggle UI immediately
    setHasUpvoted(!hasUpvoted)
    setHasDownvoted(false)
    setOptimisticScore(prevScore + (hasUpvoted ? -1 : hasDownvoted ? 2 : 1))

    // Determine the reputation adjustment amount
    let reputationChange = 0
    if (!prevUpvoted && !prevDownvoted) {
      reputationChange = 1 // Neutral to Upvote
    } else if (prevUpvoted) {
      reputationChange = -1 // Upvote to Neutral
    } else if (prevDownvoted) {
      reputationChange = 2 // Downvote to Upvote
    }

    try {
      const { errorMessage } = await upvoteAnswer(
        answer.answer_id,
        answer.expert
      )
      if (errorMessage) throw new Error(errorMessage)
      await handleChangeReputation(reputationChange.toString())
    } catch (error) {
      // Revert changes if API call fails
      setOptimisticScore(prevScore)
      setHasUpvoted(prevUpvoted)
      setHasDownvoted(prevDownvoted)

      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Upvote failed. Please try again.'
      toast({
        variant: 'destructive',
        title: 'Error',
        description: errorMessage,
      })
    }
  }

  // Function to handle downvoting
  const handleDownvote = async () => {
    const prevScore = optimisticScore
    const prevUpvoted = hasUpvoted
    const prevDownvoted = hasDownvoted

    // Toggle UI immediately
    setHasDownvoted(!hasDownvoted)
    setHasUpvoted(false)
    setOptimisticScore(prevScore + (hasDownvoted ? 1 : hasUpvoted ? -2 : -1))

    // Determine the reputation adjustment amount
    let reputationChange = 0
    if (!prevUpvoted && !prevDownvoted) {
      reputationChange = -1 // Neutral to Downvote
    } else if (prevDownvoted) {
      reputationChange = 1 // Downvote to Neutral
    } else if (prevUpvoted) {
      reputationChange = -2 // Upvote to Downvote
    }

    try {
      const { errorMessage } = await downvoteAnswer(
        answer.answer_id,
        answer.expert
      )
      if (errorMessage) throw new Error(errorMessage)
      await handleChangeReputation(reputationChange.toString())
    } catch (error) {
      // Revert changes if API call fails
      setOptimisticScore(prevScore)
      setHasUpvoted(prevUpvoted)
      setHasDownvoted(prevDownvoted)

      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Downvote failed. Please try again.'
      toast({
        variant: 'destructive',
        title: 'Error',
        description: errorMessage,
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
            className={`flex items-center space-x-2 text-xl transition-colors hover:text-primary-foreground ${
              hasUpvoted ? 'bg-gray-300 text-white' : 'bg-transparent'
            }`}
          >
            👍
          </Button>
          <h1>{optimisticScore}</h1>
          <Button
            onClick={() => handleDownvote()}
            variant="outline"
            className={`flex items-center space-x-2 text-xl transition-colors hover:text-primary-foreground ${
              hasDownvoted ? 'bg-gray-300 text-white' : 'bg-transparent'
            }`}
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
              onClick={() => Promise.resolve(onAddComment(answer.answer_id))}
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
