import React from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { CodeViewer } from '@/components/universal/code/CodeViewer'
import { ChevronRight, ChevronDown, File as FileIcon, Folder as FolderIcon } from 'lucide-react'
import type { FileSystemItem } from '@/types/FileSystem'
import type { Project } from '@/types/Projects'

interface FileBrowserProps {
  project: Project
  isLoadingDirectory: boolean
  fileSystemTree: FileSystemItem[]
  handleFolderClick: (path: string) => void
  handleFileClick: (path: string) => void
  currentFilePath: string | null
  isLoadingFileContent: boolean
  fileContent: string | null
}

const FileBrowser: React.FC<FileBrowserProps> = ({
  project,
  isLoadingDirectory,
  fileSystemTree,
  handleFolderClick,
  handleFileClick,
  currentFilePath,
  isLoadingFileContent,
  fileContent,
}) => {
  const renderItem = (item: FileSystemItem) => {
    const isExpanded = item.isExpanded
    const isSelected = item.path === currentFilePath
    const isLoading = item.path === (isLoadingDirectory ? currentFilePath : null)

    return (
      <div key={item.path}>
        <div
          className={`flex items-center py-1 px-2 hover:bg-gray-100 cursor-pointer ${
            isSelected ? 'bg-blue-100' : ''
          }`}
          onClick={() =>
            item.type === 'folder' ? handleFolderClick(item.path) : handleFileClick(item.path)
          }
        >
          <span className="mr-1">
            {item.type === 'folder' ? (
              isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )
            ) : null}
          </span>
          <span className="mr-2">
            {item.type === 'folder' ? (
              <FolderIcon className="w-4 h-4" />
            ) : (
              <FileIcon className="w-4 h-4" />
            )}
          </span>
          <span className="text-sm">{item.name}</span>
        </div>
        {isLoading ? (
          <div className="ml-4">
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4 mb-2" />
            <Skeleton className="h-4 w-2/4" />
          </div>
        ) : (
          item.type === 'folder' &&
          isExpanded &&
          item.children && (
            <div className="ml-4">
              {item.children.map((child) => renderItem(child))}
            </div>
          )
        )}
      </div>
    )
  }

  return (
    <section className="min-h-screen py-2">
      <div className="w-full mx-auto px-4">
        <h1 className="mb-4 text-2xl font-bold">{project.title}</h1>
        <p className="mb-4 text-gray-600">{project.description}</p>
        <div className="flex">
          <div className="w-1/4">
            {isLoadingDirectory && !fileSystemTree.length ? (
              <Skeleton className="h-full w-full" />
            ) : (
              <div className="flex flex-col h-full bg-white border-r">
                <div className="flex-1 overflow-auto p-2">
                  {fileSystemTree.map((item) => renderItem(item))}
                </div>
              </div>
            )}
          </div>
          <div className="w-3/4 ml-4">
            {isLoadingFileContent ? (
              <Skeleton className="h-full w-full" />
            ) : fileContent ? (
              <>
                <p className="mb-2 text-gray-500">{currentFilePath}</p>
                <CodeViewer
                  fileContent={fileContent}
                  pathname={currentFilePath ?? ''}
                  filename={currentFilePath?.split('/').pop() ?? ''}
                  project={project}
                  loading={isLoadingFileContent}
                />
              </>
            ) : (
              <p>Select a file to view its contents.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default FileBrowser