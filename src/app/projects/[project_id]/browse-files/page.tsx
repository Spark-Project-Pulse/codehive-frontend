'use client'

import { LoadingSpinner } from '@/components/ui/loading'
import { useCallback, useEffect, useState } from 'react'
import { type RepoContent, type Project } from '@/types/Projects'
import { getProjectById } from '@/api/projects'

export default function BrowseFiles({
  params,
}: {
  params: { project_id: string }
}) {
  const [project, setProject] = useState<Project | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [repoContents, setRepoContents] = useState<RepoContent[]>([])
  const [currentPath, setCurrentPath] = useState<string>('')

  const fetchRepoContents = async (path: string, repoFullName: string) => {
    setIsLoading(true)
    try {
      const res = await fetch(
        `https://api.github.com/repos/${repoFullName}/contents/${path}`
      )
      if (res.ok) {
        const data = (await res.json()) as RepoContent[]
        setRepoContents(data)
        setCurrentPath(path)
      } else {
        console.error('Failed to fetch repo contents')
      }
    } catch (error) {
      console.error('Error fetching contents:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const fetchProject = async () => {
      setIsLoading(true)

      try {
        const { errorMessage, data } = await getProjectById(params.project_id)

        if (!errorMessage && data) {
          setProject(data)

          if (data?.repo_full_name) {
            void fetchRepoContents('', data.repo_full_name)
          }

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
    <section className="min-h-screen bg-gray-100 py-24">
      <div className="mx-auto max-w-4xl px-4">
        {project ? (
          project.repo_full_name ? (
            <div className="rounded-lg bg-white p-6 shadow-lg">
              hello there {project.repo_full_name}
            </div>
          ) : (
            <div className="rounded-lg border border-red-400 bg-red-100 p-4 text-red-700">
              <h2 className="text-lg font-bold">GitHub repository not linked</h2>
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
