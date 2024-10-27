'use client'

import { LoadingSpinner } from '@/components/ui/loading'
import { useEffect, useState } from 'react'
import { type RepoContent, type Project } from '@/types/Projects'
import { getProjectById } from '@/api/projects'
import { Button } from '@/components/ui/button'
import { fetchRepoContents } from '@/lib/github'

export default function BrowseFiles({
  params,
}: {
  params: { project_id: string }
}) {
  const [project, setProject] = useState<Project | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [repoContents, setRepoContents] = useState<RepoContent[]>([])
  const [currentPath, setCurrentPath] = useState<string>('')

  // helper function -> calls `github/fetchRepoContents` function and updates state
  const loadRepoContents = async (path: string, repoFullName: string) => {
    setIsLoading(true)
    const { errorMessage, data } = await fetchRepoContents(path, repoFullName)

    if (!errorMessage && data) {
      setRepoContents(data.repoContent)
      setCurrentPath(path)
    } else {
      console.error('Failed to load repo contents:', errorMessage)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    const fetchProject = async () => {
      setIsLoading(true)

      try {
        const { errorMessage, data } = await getProjectById(params.project_id)

        if (!errorMessage && data) {
          setProject(data)

          if (data?.repo_full_name) {
            // initial call to github api (fetches top level contents)
            void loadRepoContents('', data.repo_full_name)
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

  const handleItemClick = (item: RepoContent, repoFullName: string) => {
    if (item.type === 'dir') {
      void loadRepoContents(item.path, repoFullName)
    } else if (item.type === 'file' && item.download_url) {
      window.open(item.download_url, '_blank')
    }
  }

  // Conditional rendering for loading state
  if (isLoading) {
    return <LoadingSpinner />
  }

  if (!project) {
    return (
      <div className="rounded-lg border border-red-400 bg-red-100 p-4 text-red-700">
        <h2 className="text-lg font-bold">Project not found</h2>
      </div>
    )
  }

  if (!project?.repo_full_name) {
    return (
      <div className="rounded-lg border border-red-400 bg-red-100 p-4 text-red-700">
        <h2 className="text-lg font-bold">GitHub repository not linked</h2>
      </div>
    )
  }

  return (
    <section className="min-h-screen bg-gray-100 py-24">
      <div className="mx-auto max-w-4xl px-4">
        <div className="rounded-lg bg-white p-6 shadow-lg">
          <h1 className="mb-4 text-2xl font-bold">{project.title}</h1>
          <p className="mb-4 text-gray-600">{project.description}</p>

          {currentPath && (
            <Button
              className="mb-4"
              onClick={() =>
                loadRepoContents(
                  currentPath.split('/').slice(0, -1).join('/'), // remove last item from path
                  project.repo_full_name ?? '' // this is just here for the linter (it is handled in the if statements above)
                )
              }
            >
              Back
            </Button>
          )}

          <ul className="space-y-2">
            {repoContents.map((item) => (
              <li
                key={item.path}
                className="cursor-pointer text-blue-500 hover:underline"
                onClick={() =>
                  handleItemClick(item, project.repo_full_name ?? '')
                }
              >
                {item.type === 'dir' ? '📁' : '📄'} {item.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
