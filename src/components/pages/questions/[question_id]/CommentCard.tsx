'use client'

import { Card, CardContent } from '@/components/ui/card'
import { type Comment } from '@/types/Comments'
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import { CalendarIcon, UserIcon } from 'lucide-react'
import { format } from 'date-fns'
import { useRouter } from 'next/navigation'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { type UserBadge } from '@/types/Badges'

interface CommentCardProps {
  comment: Comment
}


export default function CommentCard({ comment }: CommentCardProps) {
  // console.log('Expert Badges:', comment.expert_badges);

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
            className={`flex items-center space-x-4 ${
              comment.expert_info && 'cursor-pointer rounded-md p-2 transition-transform duration-200 hover:bg-gray-100'
            }`}
            onClick={handleProfileClick}
          >
            <Avatar className="h-8 w-8">
              <AvatarImage src={comment.expert_info?.profile_image_url} />
              <AvatarFallback>
                {comment.expert_info?.username?.[0].toUpperCase() ?? (
                  <UserIcon className="h-4 w-4" />
                )}
              </AvatarFallback>
            </Avatar>
            <div className="flex items-center space-x-2">
              <p className="text-sm font-medium">
                {comment.expert_info?.username ?? 'Anonymous User'}
              </p>
              {/* Display Badges */}
              {comment.expert_badges && comment.expert_badges.length > 0 && (
                <div className="flex space-x-1">
                  {comment.expert_badges.map((userBadge: UserBadge) => {
                    const { badge_info, badge_tier_info } = userBadge

                    // Determine which badge info to display
                    const displayBadge = badge_tier_info ? badge_tier_info : badge_info

                    return (
                      <Popover key={userBadge.id}>
                        <PopoverTrigger asChild>
                          <div className="relative">
                            <img
                              src={displayBadge.image_url ?? '/default-badge.png'}
                              alt={displayBadge.name || 'Unnamed Badge'}
                              className="h-4 w-4 cursor-pointer transition-transform duration-200 hover:scale-110"
                            />
                            {badge_tier_info && (
                              <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1 text-xs font-bold leading-none text-white bg-blue-600 rounded-full">
                                {badge_tier_info.tier_level}
                              </span>
                            )}
                          </div>
                        </PopoverTrigger>
                        <PopoverContent className="absolute top-full mt-1 bg-white shadow-lg rounded-md p-2 z-10 max-w-xs sm:max-w-sm md:max-w-md">
                          <h4 className="font-medium text-sm break-words">
                            {displayBadge.name || 'Unnamed Badge'}
                          </h4>
                          <p className="text-xs text-gray-600 mt-1 break-words">
                            {displayBadge.description || 'No description available.'}
                          </p>
                          {badge_tier_info && (
                            <p className="text-xs text-gray-500 mt-1">
                              Tier {badge_tier_info.tier_level} - Reputation Threshold: {badge_tier_info.reputation_threshold}
                            </p>
                          )}
                        </PopoverContent>
                      </Popover>
                    )
                  })}
                </div>
              )}
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
