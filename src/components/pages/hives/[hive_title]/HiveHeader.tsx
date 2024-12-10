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
import { type Hive } from '@/types/Hives'
import { type TagOption } from '@/types/Tags'
import { Avatar, AvatarImage } from '@radix-ui/react-avatar'
import { Users } from 'lucide-react'

export default function HiveHeader({
  hive,
  tags,
  userIsMember,
  handleJoinHive,
  handleLeaveHive,
}: {
  hive: Hive | null
  tags: TagOption[]
  userIsMember: true | false | null
  handleJoinHive: () => Promise<void>
  handleLeaveHive: () => Promise<void>
}) {
  return (
    <div className="mb-8 flex flex-col items-start gap-6 md:flex-row">
      {/* Hive member count */}

      {/* Hive avatar */}
      <Avatar className="h-32 w-32">
        <AvatarImage
          src={hive?.avatar_url ?? '/default-hive-avatar.png'}
          alt="Hive avatar"
        />
      </Avatar>
      <div className="flex-1">

        {/* Hive title and description */}
        <h1 className="text-h4 font-subHeading">{hive?.title}</h1>
        <p className="mb-2 font-body text-p15">{hive?.description}</p>
        {/* Hive tags */}
        <div className="mb-4 flex flex-wrap gap-2">
          {hive?.tags?.map((tagId) => {
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


        {/* Join or leave hive button */}
        {userIsMember === null && <Skeleton className="h-10 w-32" />}

        {userIsMember === false && (
          <ButtonWithLoading
            onClick={handleJoinHive}
            buttonText="Join Hive"
            buttonType="button"
          />
        )}

        {userIsMember === true && (
          <AlertDialog>
            <AlertDialogTrigger>
              <Button type="button">Leave hive</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your
                  hive related data, including your reputation and
                  contributions.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleLeaveHive}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
        <div className="flex items-center gap-4 text-p15 font-body text-black">
          <span className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            {hive?.member_count.toLocaleString()} members
          </span>
        </div>
      </div>
    </div>
  )
}
