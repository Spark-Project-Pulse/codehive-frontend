'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Community } from '@/types/Communities'
import { TagOption } from '@/types/Tags'
import { Avatar, AvatarImage } from '@radix-ui/react-avatar'
import { Badge, Users } from 'lucide-react'

interface CommunityCardProps {
  community: Community
  tags: TagOption[]
}

export default function CommunityCard({ community, tags }: CommunityCardProps) {
  return (
    <Card key={community.community_id} className="flex flex-col">
      <CardHeader className="flex-row items-center gap-4">
        <Avatar className="h-12 w-12">
          <AvatarImage
            src={community?.avatar_url ?? '/default-community-avatar.png'}
            alt="Community avatar"
          />
        </Avatar>
        <CardTitle>{community.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4 text-muted-foreground">{community.description}</p>
        <div className="mb-4 flex flex-wrap gap-2">
          {community.tags?.map((tagId) => {
            const tag = tags.find((t) => t.value === tagId)
            return tag ? (
              <span
                key={tag.value}
                className="rounded-full bg-indigo-100 px-2 py-1 text-sm font-medium text-indigo-700"
              >
                {tag.label}
              </span>
            ) : null // Handle cases where tag is not found
          })}
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            {community.member_count.toLocaleString()} members
          </span>
        </div>
      </CardContent>
      <CardFooter className="mt-auto">
        <Button className="w-full">Join Community</Button>
      </CardFooter>
    </Card>
  )
}
