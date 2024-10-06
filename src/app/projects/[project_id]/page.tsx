'use client'

import { LoadingSpinner } from '@/components/ui/loading'
import { useEffect, useState } from 'react'
import { type Project } from '@/types/Projects'

export default function ProjectPage({
  params,
}: {
  params: { project_id: string }
}) {
  const [project, setProject] = useState<Project | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    //TODO: Move API to seperate place for all project API calls
    const fetchProject = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/projects/getById/${params.project_id}`,
          {
            method: 'GET',
            headers: {
              // Authorization: `Bearer ${token}`, // Uncomment if using auth
              'Content-Type': 'application/json',
            },
          }
        )

        if (!response.ok) {
          throw new Error('Network response was not ok')
        }

        // Extract the JSON data from the response
        const projectData = await response.json() as Project

        setProject(projectData)
      } catch (error) {
        console.error('Error fetching project:', error)
      } finally {
        setIsLoading(false)
      }
    }

    void fetchProject()
  }, [params.project_id])

  // Conditional rendering for loading state
  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <section className="min-h-screen bg-gray-100 py-24">
      <div className="mx-auto max-w-4xl px-4">
        {project ? (
          <div>
            <div className="rounded-lg bg-white p-6 shadow-lg">
              <h1 className="mb-4 text-3xl font-bold text-gray-800">
                {project.title}
              </h1>
              <p className="text-lg text-gray-600">{project.description}</p>
              <p className="mt-4 text-gray-500">
                Author: Anonymous User
              </p>
            </div>
          </div>
        ) : (
          <div className="rounded-lg border border-red-400 bg-red-100 p-4 text-red-700">
            <h2 className="text-lg font-bold">project not found</h2>
          </div>
        )}
      </div>
    </section>
  )
}
