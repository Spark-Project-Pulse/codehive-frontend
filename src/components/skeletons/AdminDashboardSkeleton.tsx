import { Skeleton } from "@/components/ui/skeleton"

export default function AdminDashboardSkeleton() {
  return (
    <div className="container mx-auto p-6">
      {/* Title skeleton */}
      <Skeleton className="mb-6 h-10 w-48" />

      {/* Tabs list skeleton */}
      <div className="mb-4">
        <div className="flex space-x-2">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-10 w-32" />
          ))}
        </div>
      </div>

      {/* Content area skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <div className="grid gap-4 pt-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      </div>
    </div>
  )
}