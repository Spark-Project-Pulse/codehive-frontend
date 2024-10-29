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
import { Badge, Users } from 'lucide-react'

interface CommunityCardProps {
  community: Community
}

export default function CommunityCard({ community }: CommunityCardProps) {
  return (
    <Card key={community.community_id} className="flex flex-col">
      <CardHeader className="flex-row items-center gap-4">
        <img
          src={community.avatar_url}
          alt="Community avatar"
          className="h-12 w-12 rounded-full"
        />
        <CardTitle>{community.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4 text-muted-foreground">{community.description}</p>
        <div className="mb-4 flex flex-wrap gap-2">
          {community.tags?.map((tag) => <Badge key={tag}>{tag}</Badge>)}
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
