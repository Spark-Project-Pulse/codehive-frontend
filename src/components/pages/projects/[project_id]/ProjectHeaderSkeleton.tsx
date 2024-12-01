import { Skeleton } from '@/components/ui/skeleton'

export default function ProjectHeaderSkeleton() {
  return (
    <div className="mb-8 flex flex-col items-start md:flex-row px-12 py-4">
      <div className="flex-1">
        {/* Title skeleton */}
        <Skeleton className="mb-2 h-8 w-1/2" />
        {/* Description skeleton */}
        <Skeleton className="mb-4 h-4 w-3/4" />
        {/* Visibility badge skeleton */}
        <Skeleton className="mb-4 h-6 w-24" />
        {/* Owner skeleton */}
        <Skeleton className="h-4 w-1/3" />
      </div>
    </div>
  )
}