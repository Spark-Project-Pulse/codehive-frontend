'use client'

import {
  addUserToCommunity,
  getCommunityByTitle,
  removeUserFromCommunity,
  userIsPartOfCommunity,
} from '@/api/communities'
import { getAllTags } from '@/api/tags'
import CommunityHeader from '@/components/pages/communities/[community_title]/CommunityHeader'
import CommunityQuestionsTab from '@/components/pages/communities/[community_title]/CommunityQuestionsTab'
import { LoadingSpinner } from '@/components/ui/loading'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from '@/components/ui/use-toast'
import { type Community } from '@/types/Communities'
import { type TagOption } from '@/types/Tags'
import { useEffect, useState } from 'react'

export default function CommunityPage({
  params,
}: {
  params: { community_title: string }
}) {
  const [community, setCommunity] = useState<Community | null>(null)
  // State for user being a member of this community, null if user is not authenticated
  const [userIsMember, setUserIsMember] = useState<true | false | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const [tags, setTags] = useState<TagOption[]>([])

  useEffect(() => {
    const fetchCommunity = async () => {
      setIsLoading(true)

      try {
        const { errorMessage, data } = await getCommunityByTitle(
          params.community_title
        )

        if (!errorMessage && data) {
          setCommunity(data)
        } else {
          console.error('Error:', errorMessage)
        }
      } catch (error) {
        console.error('Unexpected error:', error)
      } finally {
        setIsLoading(false)
      }
    }

    const fetchUserIsMember = async () => {
      try {
        const { errorMessage, data } = await userIsPartOfCommunity(
          params.community_title
        )

        if (!errorMessage && data) {
          setUserIsMember(data.is_member)
        } else {
          console.error('Error:', errorMessage)
        }
      } catch (error) {
        console.error('Unexpected error:', error)
      }
    }

    const fetchTags = async () => {
      try {
        const fetchedTags = await getAllTags()
        setTags(fetchedTags)
      } catch (error) {
        console.error('Error fetching tags:', error)
      }
    }

    void fetchCommunity()
    void fetchUserIsMember()
    void fetchTags()
  }, [params.community_title])

  const handleJoinCommunity = async () => {
    try {
      if (!community) {
        console.error('Community is null')
        return
      }

      const { errorMessage, data } = await addUserToCommunity(
        community?.community_id
      )

      if (!errorMessage && data) {
        setUserIsMember(true)
        toast({
          title: 'Success!',
          description: `You are now a part of the ${community.title} community`,
        })
      } else {
        console.error('Error:', errorMessage)
      }
    } catch (error) {
      console.error('Unexpected error:', error)
    }
  }

  const handleLeaveCommunity = async () => {
    try {
      if (!community) {
        console.error('Community is null')
        return
      }

      const { errorMessage, data } = await removeUserFromCommunity(
        community?.community_id
      )

      if (!errorMessage && data) {
        setUserIsMember(false)
        toast({
          title: 'Success!',
          description: `You have left the ${community.title} community`,
        })
      } else {
        console.error('Error:', errorMessage)
      }
    } catch (error) {
      console.error('Unexpected error:', error)
    }
  }

  // Conditional rendering for loading state
  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <CommunityHeader
        community={community}
        tags={tags}
        userIsMember={userIsMember}
        handleJoinCommunity={handleJoinCommunity}
        handleLeaveCommunity={handleLeaveCommunity}
      />

      <Tabs defaultValue="questions" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="questions">Questions</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
        </TabsList>
        <TabsContent value="questions">
          {community && (
            <CommunityQuestionsTab communityId={community.community_id} />
          )}
        </TabsContent>
        <TabsContent value="leaderboard"></TabsContent>
      </Tabs>
    </div>
  )
}
