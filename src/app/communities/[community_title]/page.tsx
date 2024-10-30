'use client'

import {
  addUserToCommunity,
  getCommunityByTitle,
  removeUserFromCommunity,
  userIsPartOfCommunity,
} from '@/api/communities'
import { getAllTags } from '@/api/tags'
import { Badge } from '@/components/ui/badge'
import { LoadingSpinner } from '@/components/ui/loading'
import { toast } from '@/components/ui/use-toast'
import { ButtonWithLoading } from '@/components/universal/ButtonWithLoading'
import { Community } from '@/types/Communities'
import { TagOption } from '@/types/Tags'
import { Avatar, AvatarImage } from '@radix-ui/react-avatar'
import { Users } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function CommunityTitle({
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
      <div className="mb-8 flex flex-col items-start gap-6 md:flex-row">
        <Avatar className="h-24 w-24">
          <AvatarImage
            src={community?.avatar_url ?? '/default-community-avatar.png'}
            alt="Community avatar"
          />
        </Avatar>
        <div className="flex-1">
          <h1 className="mb-2 text-3xl font-bold">{community?.title}</h1>
          <p className="mb-4 text-muted-foreground">{community?.description}</p>
          <div className="mb-4 flex flex-wrap gap-2">
            {community?.tags?.map((tagId) => {
              const tag = tags.find((t) => t.value === tagId)
              return tag ? <Badge variant="secondary">{tag.label}</Badge> : null // Handle cases where tag is not found
            })}
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              {community?.member_count.toLocaleString()} members
            </span>
          </div>
        </div>
        {userIsMember === false && (
          <ButtonWithLoading
            onClick={handleJoinCommunity}
            buttonText="Join Community"
            buttonType="button"
          />
        )}

        {userIsMember === true && (
          <ButtonWithLoading
            onClick={handleLeaveCommunity}
            buttonText="Leave Community"
            buttonType="button"
          />
        )}
      </div>
    </div>
  )
}
