
import React from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import FileExplorer from '@/components/universal/code/FileExplorer'
import { CodeViewer } from '@/components/universal/code/CodeViewer'
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
              <FileExplorer
                fileSystem={fileSystemTree}
                onFolderClick={handleFolderClick}
                onFileClick={handleFileClick}
                currentFilePath={currentFilePath}
                loadingPath={isLoadingDirectory ? currentFilePath : null}
              />
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