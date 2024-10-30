// Create a new file for the Skeleton component, e.g., 'CommunityCardSkeleton.tsx'
'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Avatar } from '@radix-ui/react-avatar'

export default function CommunityCardSkeleton() {
  return (
    <Card className="flex transform cursor-pointer flex-col transition-transform duration-200 hover:scale-105 hover:shadow-lg">
      <CardHeader className="flex-row items-center gap-4">
        <Avatar className="h-12 w-12">
          <Skeleton className="h-12 w-12 rounded-full" />
        </Avatar>
        <CardTitle>
          <Skeleton className="h-6 w-3/4" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Skeleton className="mb-4 h-4 w-full" />
        <div className="mb-4 flex flex-wrap gap-2">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-24" />
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <Skeleton className="h-4 w-1/4" />
        </div>
      </CardContent>
    </Card>
  )
}
