// Create a new file for the Skeleton component, e.g., 'HiveCardSkeleton.tsx'
'use client'

import { Avatar } from '@/components/ui/avatar'
import { Card, CardFooter, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'


export default function SkeletonCommentCard() {
  return (
    <Card className="w-full mb-6 mt-6 transform">
      <CardHeader className="flex flex-col gap-2">
        <Skeleton className="h-4 w-full" />
      </CardHeader>
      <CardFooter className="flex items-center justify-between mt-4">
        <div className="flex items-center space-x-4">
          <Avatar className="h-8 w-8">
            <Skeleton className="h-8 w-8 rounded-full" />
          </Avatar>
          <div>
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <Skeleton className="h-4 w-32" />
        </div>
      </CardFooter>
    </Card>
  )
}
