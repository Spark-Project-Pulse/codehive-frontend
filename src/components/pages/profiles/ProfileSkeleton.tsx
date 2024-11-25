
import { Skeleton } from '@/components/ui/skeleton'

export default function ProfileSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-8 md:flex-row">
        <div className="md:w-1/3">
          <div className="p-4">
            <div className="relative h-32 w-32 mx-auto">
              <Skeleton className="h-32 w-32 rounded-full" />
            </div>
            <div className="mt-4">
              <Skeleton className="h-6 w-32 mx-auto" />
            </div>
            <div className="mt-2">
              <Skeleton className="h-4 w-24 mx-auto" />
            </div>
          </div>
        </div>
        <div className="md:w-2/3">
          <Skeleton className="h-10 w-1/2 mb-4" />
          <div className="space-y-4">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
          </div>
        </div>
      </div>
    </div>
  )
}