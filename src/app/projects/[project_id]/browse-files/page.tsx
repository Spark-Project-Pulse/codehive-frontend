'use client'

import { LoadingSpinner } from '@/components/ui/loading'
import { useEffect, useState } from 'react'
import { type Project } from '@/types/Projects'
import { Badge } from '@/components/ui/badge'
import { getProjectById } from '@/api/projects'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { toast } from '@/components/ui/use-toast'

export default function BrowseFiles({
  params,
}: {
  params: { project_id: string }
}) {
  const [project, setProject] = useState<Project | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchProject = async () => {
      setIsLoading(true)

      try {
        const { errorMessage, data } = await getProjectById(params.project_id)

        if (!errorMessage && data) {
          setProject(data)
        } else {
          console.error('Error:', errorMessage)
        }
      } catch (error) {
        console.error('Unexpected error:', error)
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

  if (!project?.repo_full_name) {
    toast({
      variant: 'destructive',
      title: 'Error',
      description: 'Repo not linked yet',
    })
  }

  return (
    <section className="min-h-screen bg-gray-100 py-24">
      <div className="mx-auto max-w-4xl px-4">
        {project ? (
          project.repo_full_name ? (
            <div className="rounded-lg bg-white p-6 shadow-lg">
              hello there {project.repo_full_name}
            </div>
          ) : (
            <div className="rounded-lg border border-red-400 bg-red-100 p-4 text-red-700">
              <h2 className="text-lg font-bold">Repository not yet linked</h2>
            </div>
          )
        ) : (
          <div className="rounded-lg border border-red-400 bg-red-100 p-4 text-red-700">
            <h2 className="text-lg font-bold">Project not found</h2>
          </div>
        )}
      </div>
    </section>
  )
}
