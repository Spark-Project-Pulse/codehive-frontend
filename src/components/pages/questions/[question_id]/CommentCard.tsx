'use client'

import {
  Card,
  CardContent,
} from '@/components/ui/card'
import { type Comment } from '@/types/Comments'

interface CommentCardProps {
  comment: Comment
}

export default function CommentCard({ comment }: CommentCardProps) {
  return (
    <Card className="mb-6 mt-6">
      <CardContent className='mt-6'>
        <p className="text-lg">{comment.response}</p>
        <p className="mt-4 text-gray-500">
          Commented by: {comment.expert_info?.username ?? 'Anonymous User'}
        </p>
      </CardContent>
    </Card>
  )
}
