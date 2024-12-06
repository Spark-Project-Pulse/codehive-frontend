'use client'

import { createCommunityRequest } from '@/api/communities'
import CommunityForm from '@/components/pages/communities/create/CommunityForm'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import NotAuthenticatedPopup from '@/components/universal/NotAuthenticatedPopup'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function CreateCommunityPage() {
  const { toast } = useToast()
  const router = useRouter()
  const [authPopupOpen, setAuthPopupOpen] = useState(false) // State to control popup visibility

  // Function to handle form submission and perform API call
  async function handleFormSubmit(values: {
    title: string
    description: string
    tags?: string[]
    avatar?: File | null
  }) {
    try {
      const formData = new FormData()
      formData.append('title', values.title)
      formData.append('description', values.description)

      if (values.tags) {
        values.tags.forEach((tag) => formData.append('tags', tag))
      }

      if (values.avatar) {
        formData.append('avatar', values.avatar)
      }

      const response = await createCommunityRequest(formData)
      const { errorMessage, data } = response

      if (!errorMessage && data?.title && !data?.toxic && !data?.avatar_image_nsfw) {
        // Navigate to the home page
        router.push('/')
        toast({
          title: 'Community Request Submitted!',
          description: 'We will review your request and get back to you soon.',
        })
      } else if (errorMessage === 'User not authenticated') {
        // Open the authentication popup
        setAuthPopupOpen(true)
      } else if (data?.toxic) {
        // Show toxic content toast if there is toxic content
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Toxic content detected in your title.',
        })
      } else if (data?.avatar_image_nsfw) {
        // Show innapropiate content toast if there is innapropiate content
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Innapropiate content detected in your avatar.',
        })
      } else {
        // Show error toast if an error occurs
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'There was an error submitting your community.',
        })
      }
    } catch (error) {
      console.error('Unexpected error:', error)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'There was an unexpected error submitting your community.',
      })
    }
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

      {/* Main Community Creation Card */}
      <h1 className="text-center text-h4 font-heading -mb-20 relative top-16">
        Create a New Community
      </h1>
      <div className="flex items-center justify-center min-h-screen relative -top-12">
        <div className="bg-gradient-to-b from-primary to-tertiary p-[2px] rounded-md">
          <Card className="mx-auto w-full max-w-2xl">
            <CardHeader>
              <CardDescription>
                Fill out the form below to request a new community. Your request
                will be reviewed by a moderator before being approved.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <CommunityForm onSubmit={handleFormSubmit} />
            </CardContent>
          </Card>
        </div>
      </div>
    </>

  )
}
