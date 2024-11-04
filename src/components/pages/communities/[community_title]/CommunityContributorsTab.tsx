import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { type CommunityMember } from '@/types/Communities'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { type UUID } from 'crypto'
import { Award, Medal, Trophy } from 'lucide-react'
import { useEffect, useState } from 'react'
import { getAllCommunityMembers } from '@/api/communities'

interface CommunityContributorsTabProps {
  communityId: UUID
}

const CommunityContributorsTab: React.FC<CommunityContributorsTabProps> = ({
  communityId,
}) => {
  const [contributors, setContributors] = useState<CommunityMember[]>([])
  const [contributorsLoading, setContributorsLoading] = useState<boolean>(true)

  // Fetch members specific to this community
  useEffect(() => {
    const fetchContributors = async () => {
      setContributorsLoading(true)
      try {
        const response = await getAllCommunityMembers(communityId)

        if (response.errorMessage) {
          throw new Error(response.errorMessage)
        }

        if (response.data) {
          setContributors(response.data)
        } else {
          throw new Error('No data received')
        }
      } catch (error) {
        console.error('Error fetching members:', error)
      } finally {
        setContributorsLoading(false)
      }
    }

    void fetchContributors()
  }, [communityId])

  return (
    <div className="container mx-auto p-4">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {contributors.map((contributor, index) => (
          <Card key={contributor.user_id} className="overflow-hidden">
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
        ))}
      </div>
    </div>
  )
}
export default CommunityContributorsTab
