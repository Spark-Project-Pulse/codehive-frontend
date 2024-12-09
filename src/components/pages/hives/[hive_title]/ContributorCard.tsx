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
    <div className="bg-gradient-to-b from-primary to-tertiary p-[2px] rounded-lg hover:border-primary duration-200 hover:from-primary hover:to-tertiary">
      <Card
        onClick={handleCardClick}
        className="cursor-pointer overflow-hidden transition-transform duration-200 hover:scale-105 hover:shadow-lg hover:border-primary"
      >
        <CardHeader className="pb-2">
          <div className="flex items-center justify-start">
            <Avatar className="h-16 w-16">
              <AvatarImage
                src={contributor.user_info.profile_image_url}
                alt="Profile photo"
              />
              <AvatarFallback>
                {contributor.user_info.username.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <CardTitle className="-mt-6 pl-2 pr-2">{contributor.user_info.username}</CardTitle>
            {index < 3 && (
              <div className="text-yellow-500">
                {index === 0 && <Trophy size={32} aria-label="First" />}
                {index === 1 && <Medal size={32} aria-label="Second" />}
                {index === 2 && <Award size={32} aria-label="Third" />}
              </div>
            )}
          </div>

        </CardHeader>
        <CardContent>
          <div className="flex justify-around">
            <div className="flex flex-col items-center">
              <span className="text-p15 font-body">Reputation</span>
              <Badge variant="secondary">
                {contributor.hive_reputation.toLocaleString()}
              </Badge>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-p15 font-body">Contributions</span>
              <Badge variant="secondary">
                {contributor.contributions.toLocaleString()}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ContributorCard
