'use client'

import { useToast } from '@/components/ui/use-toast'
import { useRouter } from 'next/navigation'
import { type AddProject } from '@/types/Projects'
import ProjectForm from '@/components/pages/projects/add-project/ProjectForm'
import { createProject } from '@/api/projects'

// Main page for adding a project
export default function AddProject() {
  const { toast } = useToast()
  const router = useRouter()

  // Function to handle form submission and perform API call
  async function handleFormSubmit(values: {
    public: boolean
    title: string
    description: string
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

  return (
    <div className="items-center px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-center text-2xl font-bold text-gray-900">
        Add a project
      </h1>
      <ProjectForm onSubmit={handleFormSubmit} />
    </div>
  )
}
