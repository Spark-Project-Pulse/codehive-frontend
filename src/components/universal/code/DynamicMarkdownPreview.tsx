import MDEditor from '@uiw/react-md-editor'
import { useTheme } from 'next-themes'
import { useRef, useEffect } from 'react'

interface DynamicMarkdownPreviewProps {
  value: string
}

export default function DynamicMarkdownPreview({
  value,
}: DynamicMarkdownPreviewProps) {
  const { resolvedTheme } = useTheme()
  
  const editorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (editorRef.current && resolvedTheme) {
      editorRef.current.setAttribute('data-color-mode', resolvedTheme)
    }
  }, [resolvedTheme])
  return (
    <div className="dynamic-md-preview" ref={editorRef}>
      <MDEditor
        value={value}
        preview="preview"
        hideToolbar
        visibleDragbar={false}
      />
    </div>
  )
}
