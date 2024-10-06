'use client'

import { useState } from 'react'
import { useToast } from '@/components/ui/use-toast'
import { LoadingSpinner } from '@/components/ui/loading'
import { useRouter } from 'next/navigation'
import { type AddProject } from '@/types/Projects'
import ProjectForm from '@/components/projects/add-project/ProjectForm'

// Main page for adding a project
export default function AddProject() {
  const { toast } = useToast()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  // Function to handle form submission and perform API call
  async function handleFormSubmit(values: {
    public: boolean
    title: string
    description: string
  }) {
    setIsLoading(true)

    //TODO: Move API to seperate place for all project API calls
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/projects/create/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      // Extract the JSON data from the response
      const responseData = await response.json() as AddProject

      // Access the project_id
      const projectId = responseData.project_id

      // Navigate to the new project page using project_id
      router.push(`/projects/${projectId}`) // Change to the desired route format
    } catch (error) {
      // Show error toast if an error occurs
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'There was an error creating your project.',
      })
      console.error("Error creating project:", error);
    } finally {
      setIsLoading(false)
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
      <ProjectForm onSubmit={handleFormSubmit} />
    </div>
  )
}
