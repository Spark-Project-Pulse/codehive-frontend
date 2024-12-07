import MDEditor from '@uiw/react-md-editor'
import { useTheme } from 'next-themes'

interface DynamicMarkdownPreviewProps {
  value: string
}

export default function DynamicMarkdownPreview({
  value,
}: DynamicMarkdownPreviewProps) {
  const { resolvedTheme } = useTheme()
  
  const getTheme = () => {
    if (resolvedTheme && ['dark', 'light'].includes(resolvedTheme)) {
      return resolvedTheme
    }
  }
  return (
    <div className="dynamic-md-preview" data-color-mode={getTheme()}>
      <MDEditor
        value={value}
        preview="preview"
        hideToolbar
        visibleDragbar={false}
      />
    </div>
  )
}
