
import { Skeleton } from '@/components/ui/skeleton'

export default function QuestionsSkeleton() {
  return (
    <div>
      <Skeleton className="mb-4 h-6 w-1/3" /> {/* Questions title skeleton */}
      {Array.from({ length: 3 }).map((_, index) => (
        <Skeleton key={index} className="mb-2 h-4 w-full" />
      ))}
    </div>
  )
}