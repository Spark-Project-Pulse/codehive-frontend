
import { Skeleton } from '@/components/ui/skeleton'

export default function AdminDashboardSkeleton() {
  return (
    <div className="container mx-auto p-6">
      <Skeleton className="mb-6 h-10 w-1/3" />
      <div className="space-y-4">
        <Skeleton className="h-8 w-1/4" />
        <Skeleton className="h-8 w-1/4" />
        <Skeleton className="h-8 w-1/4" />
      </div>
      <div className="mt-6 space-y-4">
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
      </div>
    </div>
  )
}