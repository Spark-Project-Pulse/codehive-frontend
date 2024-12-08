import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { type HiveMember } from '@/types/Hives'
import { Award, Medal, Trophy } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface ContributorCardProps {
  contributor: HiveMember
  index: number
}

const ContributorCard: React.FC<ContributorCardProps> = ({
  contributor,
  index,
}) => {
  const router = useRouter()

  // Function to navigate to the contributor's profile
  const handleCardClick = () => {
    router.push(`/profiles/${contributor.user_info.username}`)
  }

  return (
    <Card
      onClick={handleCardClick}
      className="cursor-pointer overflow-hidden transition-transform duration-200 hover:scale-105 hover:shadow-lg"
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <Avatar className="h-16 w-16">
            <AvatarImage
              src={contributor.user_info.profile_image_url}
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
        <CardTitle className="mt-2">{contributor.user_info.username}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Reputation:</span>
            <Badge variant="secondary">
              {contributor.hive_reputation.toLocaleString()}
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
