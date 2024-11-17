'use client'

import { LoadingSpinner } from '@/components/ui/loading'
import { useEffect, useState } from 'react'
import { type Project } from '@/types/Projects'
import { Badge } from '@/components/ui/badge'
import { getProjectById } from '@/api/projects'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export default function ProjectPage({
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

  return (
    <section className="min-h-screen py-24">
      <div className="mx-auto max-w-4xl px-4">
        {project ? (
          <Card className="rounded-lg border p-6 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-3xl font-bold">
                  {project.title}
                </CardTitle>
                {project.public ? (
                  <Badge>Public</Badge>
                ) : (
                  <Badge variant="secondary">Private</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-lg">
                {project.description}
              </CardDescription>
              <p className="mt-4">
                Author:{' '}
                {project.owner_info?.username
                  ? project.owner_info?.username
                  : 'Anonymous User'}
              </p>
            </CardContent>
            <CardFooter>
              {project.repo_full_name && (
                <div className="mt-4 flex justify-end">
                  <Link href={`/projects/${project.project_id}/browse-files`}>
                    <Button variant="secondary">Browse Files</Button>
                  </Link>
                </div>
              )}
            </CardFooter>
          </Card>
        ) : (
          <Card className="rounded-lg border border-red-400 bg-red-100 p-4 text-red-700">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Project not found</CardTitle>
            </CardHeader>
          </Card>
        )}
      </div>
    </section>
  )
}
