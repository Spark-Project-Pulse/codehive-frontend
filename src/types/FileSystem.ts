export type FileSystemItem = {
  name: string
  path: string
  type: 'file' | 'folder'
  children?: FileSystemItem[]
  isExpanded?: boolean
  isLoading?: boolean
}