'use client'

import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { type Answer } from '@/types/Answers'
import { type Comment } from '@/types/Comments'
import CommentForm from '@/components/pages/questions/[question_id]/CommentForm'
import CommentCard from '@/components/pages/questions/[question_id]/CommentCard'
import { type UUID } from 'crypto'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { downvoteAnswer, upvoteAnswer } from '@/api/answers'
import { toast } from '@/components/ui/use-toast'
import { changeReputationByAmount } from '@/api/users'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { CalendarIcon, UserIcon } from 'lucide-react'
import { format } from 'date-fns'
import SkeletonCommentCard from '@/components/pages/questions/[question_id]/SkeletonCommentCard'

interface AnswerCardProps {
  answer: Answer
  comments: Record<UUID, Comment[]>
  upvoted: boolean
  downvoted: boolean
  onCommentSubmit: (values: {
    response: string
    answer: string
  }) => Promise<void>
  isLoadingComments: boolean
}

export default function AnswerCard({
  answer,
  comments,
  upvoted,
  downvoted,
  onCommentSubmit,
  isLoadingComments,
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
        <div className="flex flex-col items-center space-y-2 pl-6 pt-6">
          <Button
            onClick={() => handleUpvote()}
            variant="outline"
            className={`flex items-center space-x-2 text-xl transition-colors hover:text-primary-foreground ${hasUpvoted ? 'bg-gray-300 text-white' : 'bg-transparent'
              }`}
          >
            👍
          </Button>
          <h1>{optimisticScore}</h1>
          <Button
            onClick={() => handleDownvote()}
            variant="outline"
            className={`flex items-center space-x-2 text-xl transition-colors hover:text-primary-foreground ${hasDownvoted ? 'bg-gray-300 text-white' : 'bg-transparent'
              }`}
          >
            👎
          </Button>
        </div>

        {/* Card Content */}
        <div className="flex-1">
          <CardContent className="mt-6">
            <p>{answer.response}</p>

            {/* Expert info */}
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={answer.expert_info.profile_image_url} />
                  <AvatarFallback>
                    {answer.expert_info?.username?.[0] ?? (
                      <UserIcon className="h-4 w-4" />
                    )}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">
                    {answer.expert_info?.username ?? 'Anonymous User'}
                  </p>
                </div>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(new Date(answer.created_at), 'PPP')}
              </div>
            </div>
          </CardContent>

          {/* Comments Section */}
          <CardContent>
            {isLoadingComments ? (
              <SkeletonCommentCard />
            ) : (
              <>
                {comments[answer.answer_id]?.length > 0 && (
                  <div className="mt-8">
                    <h2 className="text-lg font-bold">
                      {comments[answer.answer_id].length}{' '}
                      {comments[answer.answer_id].length === 1
                        ? 'Comment'
                        : 'Comments'}
                    </h2>
                    <div className="list-disc pl-5">
                      {comments[answer.answer_id].map((comment) => (
                        <CommentCard
                          key={comment.comment_id}
                          comment={comment}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>

          {/* Add Comment Section */}
          {!isLoadingComments && (
            <CardFooter>
              <div className="w-full pl-6">
                <CommentForm
                  onSubmit={onCommentSubmit}
                  answerId={answer.answer_id}
                />
              </div>
            </CardFooter>
          )}
        </div>
      </div>
    </Card>
  )
}
