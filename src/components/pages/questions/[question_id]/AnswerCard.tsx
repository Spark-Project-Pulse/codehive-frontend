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

interface AnswerCardProps {
  answer: Answer
  comments: Record<UUID, Comment[]>
  onCommentSubmit: (values: { response: string }) => void
  onAddComment: (answerId: UUID) => void
  onUpvote: (answerId: UUID) => void
  onDownvote: (answerId: UUID) => void
  openCommentFormId: string | null
}

export default function AnswerCard({
  answer,
  comments,
  onCommentSubmit,
  onAddComment,
  onUpvote,
  onDownvote,
  openCommentFormId,
}: AnswerCardProps) {
  return (
    <Card className="mb-6 mt-6">
      <div className="flex">
        {/* Upvote/Downvote and Score */}
        <div className="flex flex-col items-center space-y-2 p-4">
          <Button
            onClick={() => onUpvote(answer.answer_id)}
            variant="outline"
            className="flex items-center space-x-2 transition-colors hover:text-primary-foreground"
          >
            <span role="img" aria-label="thumbs up">👍</span>
          </Button>
          <h1>{answer.score}</h1>
          <Button
            onClick={() => onDownvote(answer.answer_id)}
            variant="outline"
            className="flex items-center space-x-2 transition-colors hover:text-primary-foreground"
          >
            <span role="img" aria-label="thumbs down">👎</span>
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
