
import { Skeleton } from '@/components/ui/skeleton'

export default function ProjectSkeleton() {
  return (
    <section className="min-h-screen bg-gray-100 py-24">
      <div className="mx-auto max-w-4xl px-4">
        <div className="rounded-lg bg-white p-6 shadow-lg">
          <Skeleton className="mb-4 h-8 w-1/2" /> {/* Title skeleton */}
          <Skeleton className="mb-2 h-4 w-full" /> {/* Description skeleton */}
          <Skeleton className="mb-2 h-4 w-1/3" /> {/* Author skeleton */}
          <Skeleton className="mt-4 h-10 w-32" /> {/* Button skeleton */}
        </div>
      </div>
    </section>
  )
}