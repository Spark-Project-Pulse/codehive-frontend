import { ChevronRight, ChevronDown, File as FileIcon, Folder as FolderIcon } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import type { FileSystemItem } from '@/types/FileSystem'

type FileExplorerProps = {
  fileSystem: FileSystemItem[]
  onFolderClick: (path: string) => void
  onFileClick: (path: string) => void
  currentFilePath: string | null
  loadingPath: string | null
}

export default function FileExplorer({
  fileSystem,
  onFolderClick,
  onFileClick,
  currentFilePath,
  loadingPath,
}: FileExplorerProps) {
  const renderItem = (item: FileSystemItem) => {
    const isExpanded = item.isExpanded
    const isSelected = item.path === currentFilePath
    const isLoading = item.path === loadingPath

    return (
      <div key={item.path}>
        <div
          className={`flex items-center py-1 px-2 hover:bg-gray-100 cursor-pointer ${isSelected ? 'bg-blue-100' : ''
            }`}
          onClick={() =>
            item.type === 'folder' ? onFolderClick(item.path) : onFileClick(item.path)
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
    <div className="flex flex-col h-full bg-white border-r">
      <div className="flex-1 overflow-auto p-2">{fileSystem.map((item) => renderItem(item))}</div>
    </div>
  )
}