
import { Skeleton } from '@/components/ui/skeleton'

export default function BrowseFilesSkeleton() {
  return (
    <section className="min-h-screen py-2">
      <div className="flex">
        <div className="w-1/4 p-4">
          <Skeleton className="mb-4 h-6 w-full" /> {/* Sidebar heading */}
          {/* File list skeletons */}
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="mb-2 h-4 w-full" />
          ))}
        </div>
        <div className="w-3/4 p-4">
          <Skeleton className="mb-4 h-6 w-1/2" /> {/* File name skeleton */}
          <Skeleton className="h-96 w-full" /> {/* Code content skeleton */}
        </div>
      </div>
    </section>
  )
}