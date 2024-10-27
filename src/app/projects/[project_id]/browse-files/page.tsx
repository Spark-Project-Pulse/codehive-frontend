'use client'

import { LoadingSpinner } from '@/components/ui/loading'
import { useEffect, useState } from 'react'
import { type RepoContent, type Project } from '@/types/Projects'
import { getProjectById } from '@/api/projects'
import { Button } from '@/components/ui/button'
import { fetchRepoContents } from '@/lib/github'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { useRouter, useSearchParams } from 'next/navigation'
import { CodeViewer } from '@/components/universal/code/CodeViewer'

export default function BrowseFiles({
  params,
}: {
  params: { project_id: string }
}) {
  const [project, setProject] = useState<Project | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [repoContents, setRepoContents] = useState<RepoContent[]>([])
  const [fileContent, setFileContent] = useState<string | null>(null)

  const router = useRouter()
  const searchParams = useSearchParams()
  const currentPath = searchParams.get('path') ?? '' // use URL search param 'path' for currentPath

  // helper function -> calls `github/fetchRepoContents` function and updates state
  const loadRepoContents = async (path: string, repoFullName: string) => {
    setIsLoading(true)
    setFileContent(null)
    const { errorMessage, data } = await fetchRepoContents(path, repoFullName)

    if (!errorMessage && data) {
      setRepoContents(data.repoContent)
      router.replace(`?path=${path}`)
    } else {
      console.error('Failed to load repo contents:', errorMessage)
    }
    setIsLoading(false)
  }

  // const loadFileContents = async

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

  const handleItemClick = async (item: RepoContent, repoFullName: string) => {
    if (item.type === 'dir') {
      void loadRepoContents(item.path, repoFullName)
    } else if (item.type === 'file' && item.download_url) {
      try {
        setIsLoading(true)
        const response = await fetch(item.download_url)
        const content = await response.text()
        setFileContent(content)
        router.replace(`?path=${item.path}`)
      } catch (error) {
        console.error('Error fetching file contents:', error)
      } finally {
        setIsLoading(false)
      }
    }
  }

  const breadcrumbSegments = currentPath.split('/').filter(Boolean)

  // conditional rendering for loading state
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
    <section className="min-h-screen py-24">
      <div className="mx-auto max-w-4xl px-4">
        <div className="rounded-lg bg-white p-6 shadow-lg">
          <h1 className="mb-4 text-2xl font-bold">{project.title}</h1>
          <p className="mb-4 text-gray-600">{project.description}</p>

          {/* render breadcrumbs + back button */}
          <div className="mb-4 flex flex-row items-center justify-between">
            <Breadcrumb className="mb-4">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink
                    href={`?path=`}
                    onClick={() =>
                      loadRepoContents('', project?.repo_full_name ?? '')
                    }
                  >
                    {project.title}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {breadcrumbSegments.map((segment, index) => {
                  const path = breadcrumbSegments.slice(0, index + 1).join('/')
                  const isLast = index === breadcrumbSegments.length - 1
                  return (
                    <BreadcrumbItem key={path}>
                      <BreadcrumbSeparator />
                      {isLast ? (
                        <BreadcrumbPage>{segment}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink
                          href={`?path=${path}`}
                          onClick={(e) => {
                            e.preventDefault()
                            void loadRepoContents(
                              path,
                              project?.repo_full_name ?? ''
                            )
                          }}
                        >
                          {segment}
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                  )
                })}
              </BreadcrumbList>
            </Breadcrumb>

            {currentPath && (
              <Button
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
          </div>

          {/* conditionally render the file content or directory contents */}
          {fileContent ? (
            <CodeViewer fileContent={fileContent} />
          ) : (
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
          )}
        </div>
      </div>
    </section>
  )
}
