import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

const SkeletonContributorCard: React.FC = () => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <Skeleton className="h-16 w-16 rounded-full" /> {/* Avatar */}
          <Skeleton className="h-8 w-8" /> {/* Placeholder for trophy/medal */}
        </div>
        <CardTitle className="mt-2">
          <Skeleton className="h-4 w-3/4" /> {/* Username */}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Reputation:</span>
            <Skeleton className="h-4 w-10" /> {/* Reputation Badge */}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Contributions:</span>
            <Skeleton className="h-4 w-6" /> {/* Contributions Count */}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default SkeletonContributorCard
