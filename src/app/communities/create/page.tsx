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
import { useRouter } from 'next/navigation'

export default function CreateCommunityPage() {
  const { toast } = useToast()
  const router = useRouter()

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

      if (!errorMessage && data?.title) {
        // Navigate to the home page
        router.push('/')
        toast({
          title: 'Community Request Submitted!',
          description: 'We will review your request and get back to you soon.',
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
    <Card className="mx-auto w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Create a New Community</CardTitle>
        <CardDescription>
          Fill out the form below to request a new community. Your request will
          be reviewed by a moderator before being approved.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <CommunityForm onSubmit={handleFormSubmit} />
      </CardContent>
    </Card>
  )
}
