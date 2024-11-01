// Create a new file for the Skeleton component, e.g., 'CommunityCardSkeleton.tsx'
'use client'

import { Avatar } from '@/components/ui/avatar'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'


export default function SkeletonAnswerCard() {
  return (
    <Card className="w-full mb-6 mt-6 transform">
      <CardHeader className="flex flex-col gap-2">
        <CardTitle>
          <Skeleton className="h-6 w-1/4" />
        </CardTitle>
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-1/2" />
      </CardHeader>
      <CardContent>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-14" />
        </div>
      </CardContent>
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
