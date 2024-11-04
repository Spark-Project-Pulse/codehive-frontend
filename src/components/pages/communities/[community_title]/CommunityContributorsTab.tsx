'use client'

import { type CommunityMember } from '@/types/Communities'
import { type UUID } from 'crypto'
import { useEffect, useState } from 'react'
import { getAllCommunityMembers } from '@/api/communities'
import ContributorCard from './ContributorCard'
import SkeletonContributorCard from './SkeletonContributorCard'

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
        {contributorsLoading
          ? Array.from({ length: 6 }).map((_, index) => (
              <SkeletonContributorCard key={index} />
            ))
          : contributors.map((contributor, index) => (
              <ContributorCard
                key={contributor.user_id}
                contributor={contributor}
                index={index}
              />
            ))}
      </div>
    </div>
  )
}
export default CommunityContributorsTab
