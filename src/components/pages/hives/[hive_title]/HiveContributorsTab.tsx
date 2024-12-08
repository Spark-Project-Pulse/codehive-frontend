'use client'

import { type HiveMember } from '@/types/Hives'
import { type UUID } from 'crypto'
import { useEffect, useState } from 'react'
import { getAllHiveMembers } from '@/api/hives'
import ContributorCard from './ContributorCard'
import SkeletonContributorCard from './SkeletonContributorCard'

interface HiveContributorsTabProps {
  hiveId: UUID
}

const HiveContributorsTab: React.FC<HiveContributorsTabProps> = ({
  hiveId,
}) => {
  const [contributors, setContributors] = useState<HiveMember[]>([])
  const [contributorsLoading, setContributorsLoading] = useState<boolean>(true)

  // Fetch members specific to this hive
  useEffect(() => {
    const fetchContributors = async () => {
      setContributorsLoading(true)
      try {
        const response = await getAllHiveMembers(hiveId)

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
  }, [hiveId])

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
export default HiveContributorsTab
