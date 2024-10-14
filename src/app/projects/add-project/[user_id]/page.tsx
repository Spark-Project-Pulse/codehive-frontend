'use client'

import { useToast } from '@/components/ui/use-toast'
import { useRouter } from 'next/navigation'
import { type Repo, type AddProject } from '@/types/Projects'
import ProjectForm from '@/components/pages/projects/add-project/ProjectForm'
import { createProject } from '@/api/projects'
import { LoadingSpinner } from '@/components/ui/loading'
import { useEffect, useState } from 'react'
import { type User } from '@/types/Users'
import { getUserById } from '@/api/users'

// Main page for adding a project
export default function AddProject({
  params,
}: {
  params: { user_id: string }
}) {
  const { toast } = useToast()
  const router = useRouter()

  const [isLoading, setIsLoading] = useState(true)
  const [repos, setRepos] = useState<Repo[]>([])
  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getUserById(params.user_id)

        if (response.errorMessage) {
          console.error('Error fetching user:', response.errorMessage)
          return
        }

        // Fetch GitHub repositories using the user's GitHub username
        const githubUsername = response.data?.username
        if (githubUsername) {
          const reposResponse = await fetch(
            `https://api.github.com/users/${githubUsername}/repos`
          )
          const reposData = await reposResponse.json() as Repo[]
          setRepos(reposData)
        }

      } catch (error) {
        console.error('Error fetching user:', error)
      } finally {
        setIsLoading(false)
      }
    }

    void fetchUser()
  }, [params.user_id])

  
  // Function to handle form submission and perform API call
  async function handleFormSubmit(values: {
    public: boolean
    title: string
    description: string,
    repoFullName: string,
  }) {
    try {
      const response = await createProject(values)
      const { errorMessage, data } = response

      if (!errorMessage && data?.project_id) {
        // Navigate to the new question page using project_id
        router.push(`/projects/${data.project_id}`)
      } else {
        // Show error toast if an error occurs
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'There was an error creating your project.',
        })
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
    <div className="items-center px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-center text-2xl font-bold text-gray-900">
        Add a project
      </h1>
      <ProjectForm repos={repos} onSubmit={handleFormSubmit} />
    </div>
  )
}
