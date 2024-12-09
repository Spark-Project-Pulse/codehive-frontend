'use client'

import {
  addUserToHive,
  getHiveByTitle,
  removeUserFromHive,
  userIsPartOfHive,
} from '@/api/hives'
import { getAllTags } from '@/api/tags'
import NotFound from '@/app/not-found'
import HiveContributorsTab from '@/components/pages/hives/[hive_title]/HiveContributorsTab'
import HiveHeader from '@/components/pages/hives/[hive_title]/HiveHeader'
import HiveQuestionsTab from '@/components/pages/hives/[hive_title]/HiveQuestionsTab'
import HiveSkeleton from '@/components/pages/hives/[hive_title]/HiveSkeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from '@/components/ui/use-toast'
import NotAuthenticatedPopup from '@/components/universal/NotAuthenticatedPopup'
import { type Hive } from '@/types/Hives'
import { type TagOption } from '@/types/Tags'
import { useEffect, useState } from 'react'

export default function HivePage({
  params,
}: {
  params: { hive_title: string }
}) {
  const [hive, setHive] = useState<Hive | null>(null)
  // State for user being a member of this hive, null if user is not authenticated
  const [userIsMember, setUserIsMember] = useState<true | false | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [authPopupOpen, setAuthPopupOpen] = useState(false) // State to control popup visibility

  const [tags, setTags] = useState<TagOption[]>([])

  useEffect(() => {
    const fetchHive = async () => {
      setIsLoading(true)

      try {
        const { errorMessage, data } = await getHiveByTitle(
          params.hive_title
        )

        if (!errorMessage && data) {
          setHive(data)
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
        const { errorMessage, data } = await userIsPartOfHive(
          params.hive_title
        )

        if (!errorMessage && data) {
          setUserIsMember(data.is_member)
        } else if (errorMessage === 'User not authenticated') {
          setUserIsMember(false)
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

    void fetchHive()
    void fetchUserIsMember()
    void fetchTags()
  }, [params.hive_title])

  const handleJoinHive = async () => {
    try {
      if (!hive) {
        console.error('Hive is null')
        return
      }

      const { errorMessage, data } = await addUserToHive(
        hive?.hive_id
      )

      if (!errorMessage && data) {
        setUserIsMember(true)
        toast({
          title: 'Success!',
          description: `You are now a part of the ${hive.title} hive`,
        })
      } else if (errorMessage === 'User not authenticated') {
        // Open the authentication popup
        setAuthPopupOpen(true)
      } else {
        console.error('Error:', errorMessage)
      }
    } catch (error) {
      console.error('Unexpected error:', error)
    }
  }

  const handleLeaveHive = async () => {
    try {
      if (!hive) {
        console.error('Hive is null')
        return
      }

      const { errorMessage, data } = await removeUserFromHive(
        hive?.hive_id
      )

      if (!errorMessage && data) {
        setUserIsMember(false)
        toast({
          title: 'Success!',
          description: `You have left the ${hive.title} hive`,
        })
      } else if (errorMessage === 'User not authenticated') {
        // Open the authentication popup
        setAuthPopupOpen(true)
      } else {
        console.error('Error:', errorMessage)
      }
    } catch (error) {
      console.error('Unexpected error:', error)
    }
  }

  // Conditional rendering for loading state
  if (isLoading) {
    return <HiveSkeleton />
  }

  return (
    <>
      {/* Popup for unauthenticated users */}
      <NotAuthenticatedPopup
        isOpen={authPopupOpen}
        onClose={() => {
          setAuthPopupOpen(false)
        }}
      />

      {/* Hive page content */}
      {hive !== null ? (
        <div className="container mx-auto px-36 py-8">
          <HiveHeader
            hive={hive}
            tags={tags}
            userIsMember={userIsMember}
            handleJoinHive={handleJoinHive}
            handleLeaveHive={handleLeaveHive}
          />

          <Tabs defaultValue="questions" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="questions">Questions</TabsTrigger>
              <TabsTrigger value="top-contributors">
                Top Contributors
              </TabsTrigger>
            </TabsList>
            <TabsContent value="questions">
              {hive && (
                <HiveQuestionsTab hiveId={hive.hive_id} />
              )}
            </TabsContent>
            <TabsContent value="top-contributors">
              {hive && (
                <HiveContributorsTab
                  hiveId={hive.hive_id}
                />
              )}
            </TabsContent>
          </Tabs>
        </div>
      ) : (
        <NotFound />
      )}
    </>
  )
}
