import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { type CommunityMember } from '@/types/Communities'
import { Award, Medal, Trophy } from 'lucide-react'

interface ContributorCardProps {
  contributor: CommunityMember
  index: number
}

const ContributorCard: React.FC<ContributorCardProps> = ({ contributor, index }) => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <Avatar className="h-16 w-16">
            <AvatarImage
              src={contributor.user_info.pfp_url}
              alt="Profile photo"
            />
            <AvatarFallback>
              {contributor.user_info.username.charAt(0)}
            </AvatarFallback>
          </Avatar>
          {index < 3 && (
            <div className="text-yellow-500">
              {index === 0 && <Trophy size={32} aria-label="First" />}
              {index === 1 && <Medal size={32} aria-label="Second" />}
              {index === 2 && <Award size={32} aria-label="Third" />}
            </div>
          )}
        </div>
        <CardTitle className="mt-2">
          {contributor.user_info.username}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Reputation:</span>
            <Badge variant="secondary">
              {contributor.community_reputation.toLocaleString()}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Contributions:</span>
            <span>{contributor.contributions}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default ContributorCard
