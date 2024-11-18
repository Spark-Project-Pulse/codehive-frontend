'use client'

import { useEffect, useState } from 'react'
import { type Suggestion } from '@/types/Projects'
import { codeReview, getProjectById } from '@/api/projects'
import { Button } from '@/components/ui/button'
import { type RepoContent, type Project } from '@/types/Projects'
import { fetchRepoContents } from '@/lib/github'
import type { FileSystemItem } from '@/types/FileSystem'
import { LoadingSpinner } from '@/components/ui/loading'
import FileBrowser from '@/components/universal/code/FileBrowser'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from '@/components/ui/use-toast'
import { useUser } from '@/app/contexts/UserContext'

export default function BrowseFiles({
  params,
}: {
  params: { project_id: string }
}) {
  const { user } = useUser()
  const [project, setProject] = useState<Project | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [isSuggestionsLoading, setIsSuggestionsLoading] =
    useState<boolean>(false)
  const [fileSystemTree, setFileSystemTree] = useState<FileSystemItem[]>([])
  const [fileContent, setFileContent] = useState<string | null>(null)
  const [currentFilePath, setCurrentFilePath] = useState<string | null>(null)
  const [isLoadingFileContent, setIsLoadingFileContent] =
    useState<boolean>(false)
  const [isLoadingDirectory, setIsLoadingDirectory] = useState<boolean>(false)

  // Helper functions
  const convertRepoContentsToFSItems = (
    repoContents: RepoContent[]
  ): FileSystemItem[] => {
    return repoContents.map((item) => ({
      name: item.name,
      path: item.path,
      type: item.type === 'dir' ? 'folder' : 'file',
      isExpanded: false,
    }))
  }

  const findNodeInTree = (
    tree: FileSystemItem[],
    path: string
  ): FileSystemItem | null => {
    for (const item of tree) {
      if (item.path === path) {
        return item
      } else if (item.type === 'folder' && item.children) {
        const result = findNodeInTree(item.children, path)
        if (result) return result
      }
    }
    return null
  }

  const updateTreeWithChildren = (
    tree: FileSystemItem[],
    path: string,
    children: FileSystemItem[]
  ): FileSystemItem[] => {
    return tree.map((item) => {
      if (item.path === path) {
        return { ...item, children, isExpanded: true }
      } else if (item.type === 'folder' && item.children) {
        return {
          ...item,
          children: updateTreeWithChildren(item.children, path, children),
        }
      } else {
        return item
      }
    })
  }

  const toggleNodeExpansion = (
    tree: FileSystemItem[],
    path: string
  ): FileSystemItem[] => {
    return tree.map((item) => {
      if (item.path === path) {
        return { ...item, isExpanded: !item.isExpanded }
      } else if (item.type === 'folder' && item.children) {
        return { ...item, children: toggleNodeExpansion(item.children, path) }
      } else {
        return item
      }
    })
  }

  // Fetch the project and root directory on mount
  useEffect(() => {
    const fetchProject = async () => {
      setIsLoading(true)

      try {
        const { errorMessage, data } = await getProjectById(params.project_id)

        if (!errorMessage && data) {
          setProject(data)

          if (data?.repo_full_name) {
            // Fetch root directory contents
            const { errorMessage, data: repoData } = await fetchRepoContents(
              '',
              data.repo_full_name
            )

            if (!errorMessage && repoData) {
              const fsItems = convertRepoContentsToFSItems(repoData.repoContent)
              setFileSystemTree(fsItems)
            } else {
              console.error('Failed to load repo contents:', errorMessage)
            }
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

  const handleFolderClick = async (path: string) => {
    if (!project?.repo_full_name) return
    const node = findNodeInTree(fileSystemTree, path)

    if (node) {
      if (node.isExpanded) {
        // Collapse folder
        const newTree = toggleNodeExpansion(fileSystemTree, path)
        setFileSystemTree(newTree)
      } else {
        // Expand folder and fetch contents if not already loaded
        if (!node.children) {
          setIsLoadingDirectory(true)
          const { errorMessage, data } = await fetchRepoContents(
            path,
            project.repo_full_name
          )
          if (!errorMessage && data) {
            const children = convertRepoContentsToFSItems(data.repoContent)
            const newTree = updateTreeWithChildren(
              fileSystemTree,
              path,
              children
            )
            setFileSystemTree(newTree)
          } else {
            console.error('Failed to load repo contents:', errorMessage)
          }
          setIsLoadingDirectory(false)
        } else {
          const newTree = toggleNodeExpansion(fileSystemTree, path)
          setFileSystemTree(newTree)
        }
      }
    }
  }

  const handleFileClick = async (path: string) => {
    if (!project?.repo_full_name) return
    const node = findNodeInTree(fileSystemTree, path)

    if (node && node.type === 'file') {
      try {
        // Clear the suggestions when a new file is clicked
        setSuggestions([])

        setIsLoadingFileContent(true)
        const { errorMessage, data } = await fetchRepoContents(
          path,
          project.repo_full_name
        )
        if (!errorMessage && data?.repoContent) {
          const fileData = data.repoContent[0]
          if (fileData?.content && fileData.encoding === 'base64') {
            // Decode Base64 content
            const decodedContent = atob(fileData.content)
            setFileContent(decodedContent)
            setCurrentFilePath(path)
          } else if (fileData.download_url) {
            // Fallback to download URL
            const response = await fetch(fileData.download_url)
            const content = await response.text()
            setFileContent(content)
            setCurrentFilePath(path)
          } else {
            console.error('File content not found')
          }
        } else {
          console.error('Error fetching file contents', errorMessage)
        }
      } catch (error) {
        console.error('Error fetching file contents:', error)
      } finally {
        setIsLoadingFileContent(false)
      }
    }
  }

  // Handle the AI Code Review button click
  const handleCodeReviewClicked =
    (filename: string | null, fileContent: string) => async () => {
      try {
        setIsSuggestionsLoading(true)
        const { errorMessage, data } = await codeReview(
          project?.title ?? '',
          project?.description ?? '',
          filename ?? '',
          fileContent
        )

        if (!errorMessage && data && data.suggestions !== undefined) {
          setSuggestions(data.suggestions)
        } else {
          console.error('Error:', errorMessage)
        }
      } catch (error) {
        console.error('Unexpected error:', error)
        toast({
          variant: 'destructive',
          title: 'Error',
          description: `We encountered an error while processing your file. Please try again later.`,
        })
      } finally {
        setIsSuggestionsLoading(false)
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
    <section className="flex min-h-screen py-2">
      <FileBrowser
        project={project}
        isLoadingDirectory={isLoadingDirectory}
        fileSystemTree={fileSystemTree}
        handleFolderClick={handleFolderClick}
        handleFileClick={handleFileClick}
        currentFilePath={currentFilePath}
        isLoadingFileContent={isLoadingFileContent}
        fileContent={fileContent}
      />
      {/* Suggestions Panel */}
      {fileContent && user?.user === project?.owner && (
        <div className="w-1/4 border-l p-2">
          <h2 className="mb-4 text-center text-xl font-bold">Suggestions</h2>
          <ScrollArea className="h-[calc(100vh-150px)] overflow-y-auto overflow-x-hidden">
            {isSuggestionsLoading ? (
              <div>
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="mb-2 h-20" />
                ))}
              </div>
            ) : suggestions.length > 0 ? (
              <div className="space-y-4">
                {suggestions.map((suggestion, i) => (
                  <Card key={i} className="w-full">
                    <CardHeader>
                      <CardTitle className="truncate text-sm font-medium">
                        Line {suggestion.line_number}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="break-words text-sm">
                        {suggestion.suggestion}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center">
                <Button
                  onClick={handleCodeReviewClicked(
                    currentFilePath,
                    fileContent
                  )}
                >
                  AI Code Review
                </Button>
                <p className="pt-2">
                  No suggestions yet. Click "AI Code Review" to get suggestions.
                </p>
              </div>
            )}
          </ScrollArea>
        </div>
      )}
    </section>
  )
}
