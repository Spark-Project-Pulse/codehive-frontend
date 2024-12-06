import MDEditor from '@uiw/react-md-editor'

interface DynamicMarkdownPreviewProps {
  value: string
}

export default function DynamicMarkdownPreview({
  value,
}: DynamicMarkdownPreviewProps) {
  return (
    <div className="dynamic-md-preview">
      <MDEditor
        value={value}
        preview="preview"
        hideToolbar
        visibleDragbar={false}
      />
    </div>
  )
}
