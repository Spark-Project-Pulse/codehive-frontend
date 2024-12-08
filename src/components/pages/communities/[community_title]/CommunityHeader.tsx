'use client'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ButtonWithLoading } from '@/components/universal/ButtonWithLoading'
import { type Community } from '@/types/Communities'
import { type TagOption } from '@/types/Tags'
import { Avatar, AvatarImage } from '@radix-ui/react-avatar'
import { Users } from 'lucide-react'

export default function CommunityHeader({
  community,
  tags,
  userIsMember,
  handleJoinCommunity,
  handleLeaveCommunity,
}: {
  community: Community | null
  tags: TagOption[]
  userIsMember: true | false | null
  handleJoinCommunity: () => Promise<void>
  handleLeaveCommunity: () => Promise<void>
}) {
  return (
    <div className="mb-8 flex flex-col items-start gap-6 md:flex-row">
      {/* Community member count */}

      {/* Community avatar */}
      <Avatar className="h-32 w-32">
        <AvatarImage
          src={community?.avatar_url ?? '/default-community-avatar.png'}
          alt="Community avatar"
        />
      </Avatar>
      <div className="flex-1">

        {/* Community title and description */}
        <h1 className="text-h4 font-subHeading">{community?.title}</h1>
        <p className="mb-2 text-black font-body text-p15">{community?.description}</p>
        {/* Community tags */}
        <div className="mb-4 flex flex-wrap gap-2">
          {community?.tags?.map((tagId) => {
            const tag = tags.find((t) => t.value === tagId)
            return tag ? (
              <Badge variant="secondary" key={tagId}>
                {tag.label}
              </Badge>
            ) : null // Handle cases where tag is not found
          })}
        </div>

      </div>
      <div className="flex flex-col items-center space-y-4">


        {/* Join or leave community button */}
        {userIsMember === null && <Skeleton className="h-10 w-32" />}

        {userIsMember === false && (
          <ButtonWithLoading
            onClick={handleJoinCommunity}
            buttonText="Join Community"
            buttonType="button"
          />
        )}

        {userIsMember === true && (
          <AlertDialog>
            <AlertDialogTrigger>
              <Button type="button">Leave community</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your
                  community related data, including your reputation and
                  contributions.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleLeaveCommunity}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
        <div className="flex items-center gap-4 text-p15 font-body text-black">
          <span className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            {community?.member_count.toLocaleString()} members
          </span>
        </div>
      </div>
    </div>
  )
}
