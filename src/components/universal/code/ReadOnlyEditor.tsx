import { Skeleton } from '@/components/ui/skeleton'
import { Editor } from '@monaco-editor/react'

interface ReadOnlyEditorProps {
  language: string
  value: string
  theme: string
  lineNumberStart: number
}

export default function ReadOnlyEditor({
  language,
  value,
  theme,
  lineNumberStart,
}: ReadOnlyEditorProps) {
  return (
    <Editor
      loading={<Skeleton className="h-full w-full" />}
      language={language}
      value={value}
      theme={theme}
      options={{
        lineNumbers: (num) => (num + lineNumberStart - 1).toString(),
        automaticLayout: true,
        selectOnLineNumbers: true,
        readOnly: true,
        minimap: { enabled: false },
        renderLineHighlight: 'all',
        scrollBeyondLastLine: false,
        cursorStyle: 'block',
        scrollbar: {
          vertical: 'hidden',
        },
      }}
      onMount={(editor) => {
        const lineCount = editor.getModel()?.getLineCount() ?? 1
        const lineHeight = 18 // Approximate height for each line
        editor.layout({
          width: editor.getDomNode()?.offsetWidth ?? 500,
          height: (lineCount + 1) * lineHeight,
        })
      }}
    />
  )
}
