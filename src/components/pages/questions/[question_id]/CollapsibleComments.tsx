import { CardContent, CardFooter } from '@/components/ui/card'
import SkeletonCommentCard from '@/components/pages/questions/[question_id]/SkeletonCommentCard'
import CommentCard from '@/components/pages/questions/[question_id]/CommentCard'
import CommentForm from '@/components/pages/questions/[question_id]//CommentForm'
import { type Answer } from '@/types/Answers'
import { type Comment } from '@/types/Comments'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

interface CollapsibleCommentsProps {
  comments: Comment[]
  answer: Answer
  isLoadingComments: boolean
  onCommentSubmit: (values: {
    response: string
    answer: string
  }) => Promise<void>
  initialDisplayCount?: number
}

export default function CollapsibleComments({
  comments,
  answer,
  isLoadingComments,
  onCommentSubmit,
  initialDisplayCount = 3,
}: CollapsibleCommentsProps) {
  const [showAllComments, setShowAllComments] = useState(false)

  const displayedComments = showAllComments
    ? comments
    : comments.slice(0, initialDisplayCount)

  const remainingCount = comments.length - initialDisplayCount
  const hasMoreComments = comments.length > initialDisplayCount

  return (
    <>
      <CardContent>
        {isLoadingComments ? (
          <SkeletonCommentCard />
        ) : (
          <>
            {comments?.length > 0 && (
              <div className="mt-8">
                <h2 className="text-lg font-bold">
                  {comments.length}{' '}
                  {comments.length === 1 ? 'Comment' : 'Comments'}
                </h2>

                <div className="list-disc pl-5">
                  {displayedComments.map((comment) => (
                    <CommentCard key={comment.comment_id} comment={comment} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {hasMoreComments && (
          <Button
            onClick={() => setShowAllComments(!showAllComments)}
            variant="link"
            className="pl-5"
          >
            {showAllComments ? (
              'Show less'
            ) : (
              <>
                Show {remainingCount} more{' '}
                {remainingCount === 1 ? 'comment' : 'comments'}
              </>
            )}
          </Button>
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
    </>
  )
}
