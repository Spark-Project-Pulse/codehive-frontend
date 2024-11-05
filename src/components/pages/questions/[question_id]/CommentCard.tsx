'use client'

import { Card, CardContent } from '@/components/ui/card'
import { type Comment } from '@/types/Comments'
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import { CalendarIcon, UserIcon } from 'lucide-react'
import { format } from 'date-fns'
import { useRouter } from 'next/navigation'

interface CommentCardProps {
  comment: Comment
}

export default function CommentCard({ comment }: CommentCardProps) {
  const router = useRouter()

  // Function to handle profile navigation
  const handleProfileClick = () => {
    if (comment.expert_info) {
      router.push(`/profiles/${comment.expert_info.username}`)
    }
  }

  return (
    <Card className="mb-6 mt-6">
      <CardContent className="mt-6">
        <p className="text-lg">{comment.response}</p>
        {/* Expert info */}
        <div className="mt-4 flex items-center justify-between">
          <div
            className={`flex items-center space-x-4 ${comment.expert_info && 'cursor-pointer rounded-md p-2 transition-transform duration-200 hover:bg-gray-100'}`}
            onClick={handleProfileClick}
          >
            <Avatar className="h-8 w-8">
              <AvatarImage src={comment.expert_info.profile_image_url} />
              <AvatarFallback>
                {comment.expert_info?.username?.[0] ?? (
                  <UserIcon className="h-4 w-4" />
                )}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">
                {comment.expert_info.username ?? 'Anonymous User'}
              </p>
            </div>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <CalendarIcon className="mr-2 h-4 w-4" />
            {format(new Date(comment.created_at), 'PPP')}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
