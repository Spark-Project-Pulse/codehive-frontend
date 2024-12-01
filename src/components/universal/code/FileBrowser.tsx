import React from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { CodeViewer } from '@/components/universal/code/CodeViewer'
import {
  ChevronRight,
  ChevronDown,
  File as FileIcon,
  Folder as FolderIcon,
} from 'lucide-react'
import type { FileSystemItem } from '@/types/FileSystem'
import type { Project } from '@/types/Projects'
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from '@/components/ui/resizable'

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
    const isLoading =
      item.path === (isLoadingDirectory ? currentFilePath : null)

    return (
      <div key={item.path}>
        <div
          className={`flex cursor-pointer items-center px-2 py-1 hover:bg-gray-100 ${
            isSelected ? 'bg-blue-100' : ''
          }`}
          onClick={() =>
            item.type === 'folder'
              ? handleFolderClick(item.path)
              : handleFileClick(item.path)
          }
        >
          <span className="mr-1">
            {item.type === 'folder' ? (
              isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )
            ) : null}
          </span>
          <span className="mr-2">
            {item.type === 'folder' ? (
              <FolderIcon className="h-4 w-4" />
            ) : (
              <FileIcon className="h-4 w-4" />
            )}
          </span>
          <span className="text-sm">{item.name}</span>
        </div>
        {isLoading ? (
          <div className="ml-4">
            <Skeleton className="mb-2 h-4 w-full" />
            <Skeleton className="mb-2 h-4 w-3/4" />
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
      <div className="mx-auto w-full px-4">
        <ResizablePanelGroup direction="horizontal">
          {/* File Tree Panel */}
          <ResizablePanel defaultSize={20}>
            {isLoadingDirectory && !fileSystemTree.length ? (
              <Skeleton className="h-full w-full" />
            ) : (
              <div className="flex h-full flex-col border-r">
                <div className="flex-1 overflow-auto p-2">
                  {fileSystemTree.map((item) => renderItem(item))}
                </div>
              </div>
            )}
          </ResizablePanel>
          <ResizableHandle withHandle />
          {/* File Content Panel */}
          <ResizablePanel defaultSize={80}>
            {isLoadingFileContent ? (
              <Skeleton className="h-full w-full" />
            ) : fileContent ? (
              <>
                <p className="mb-2">{currentFilePath}</p>
                <CodeViewer
                  fileContent={fileContent}
                  pathname={currentFilePath ?? ''}
                  filename={currentFilePath?.split('/').pop() ?? ''}
                  project={project}
                  loading={isLoadingFileContent}
                />
              </>
            ) : (
              <p className="text-center text-xl">
                Select a file to view its contents.
              </p>
            )}
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </section>
  )
}

export default FileBrowser
