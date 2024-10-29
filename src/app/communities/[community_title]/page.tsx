'use client'

import { getCommunityByTitle } from '@/api/communities'
import { getAllTags } from '@/api/tags'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/ui/loading'
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

    const fetchTags = async () => {
        try {
          const fetchedTags = await getAllTags()
          setTags(fetchedTags)
        } catch (error) {
          console.error('Error fetching tags:', error)
        }
      }

    void fetchCommunity()
    void fetchTags()
  }, [params.community_title])

  const handleJoinCommunity = async () => {
    try {
        
      } catch (error) {

      }
  }

  // Conditional rendering for loading state
  if (isLoading) {
    return <LoadingSpinner />
  }

  return(
    <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-start gap-6 mb-8">
        <Avatar className="w-24 h-24">
          <AvatarImage src={community?.avatar_url ?? '/default-community-avatar.png'} alt="Community avatar" />
        </Avatar>
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-2">{community?.title}</h1>
          <p className="text-muted-foreground mb-4">{community?.description}</p>
          <div className="flex flex-wrap gap-2 mb-4">
          {community?.tags?.map((tagId) => {
            const tag = tags.find((t) => t.value === tagId)
            return tag ? <Badge variant="secondary">{tag.label}</Badge> : null // Handle cases where tag is not found
          })}
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {community?.member_count.toLocaleString()} members
            </span>
          </div>
        </div>
        <Button onClick={handleJoinCommunity}>Join Community</Button>
      </div>
    </div>
  )
}
