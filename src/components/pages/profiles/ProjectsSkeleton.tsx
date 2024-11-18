import { Skeleton } from '@/components/ui/skeleton'

export default function ProjectsSkeleton() {
  return (
    <div>
      <ul className="space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <li
            key={index}
            className="rounded-md border-b p-4 transition-colors duration-300 last:border-b-0 hover:bg-gray-100/50"
          >
            <Skeleton className="h-7 w-3/4 mb-2" /> {/* Title */}
            <Skeleton className="h-5 w-full" /> {/* Description line 1 */}
          </li>
        ))}
      </ul>
    </div>
  )
}