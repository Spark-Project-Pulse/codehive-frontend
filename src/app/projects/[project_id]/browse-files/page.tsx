'use client'

import React, { useEffect, useState } from 'react'
import { LoadingSpinner } from '@/components/ui/loading'
import FileBrowser from '@/components/universal/code/FileBrowser'

import { type RepoContent, type Project } from '@/types/Projects'
import { getProjectById } from '@/api/projects'
import { fetchRepoContents } from '@/lib/github'
import type { FileSystemItem } from '@/types/FileSystem'

export default function BrowseFiles({ params }: { params: { project_id: string } }) {
  const [project, setProject] = useState<Project | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [fileSystemTree, setFileSystemTree] = useState<FileSystemItem[]>([])
  const [fileContent, setFileContent] = useState<string | null>(null)
  const [currentFilePath, setCurrentFilePath] = useState<string | null>(null)
  const [isLoadingFileContent, setIsLoadingFileContent] = useState<boolean>(false)
  const [isLoadingDirectory, setIsLoadingDirectory] = useState<boolean>(false)

  // Helper functions
  const convertRepoContentsToFSItems = (repoContents: RepoContent[]): FileSystemItem[] => {
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
        return { ...item, children: updateTreeWithChildren(item.children, path, children) }
      } else {
        return item
      }
    })
  }

  const toggleNodeExpansion = (tree: FileSystemItem[], path: string): FileSystemItem[] => {
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
            const newTree = updateTreeWithChildren(fileSystemTree, path, children)
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
    <section className="min-h-screen py-2">
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
    </section>
  )
}