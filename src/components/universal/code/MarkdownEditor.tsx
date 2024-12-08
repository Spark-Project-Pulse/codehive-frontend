import React, { useEffect, useRef, useState } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Card } from '@/components/ui/card'
import { FileEdit, Eye } from 'lucide-react'
import MDEditor, {
  type ICommand,
  bold,
  code,
  help,
  italic,
  link,
  quote,
  strikethrough,
  table,
  unorderedListCommand,
  orderedListCommand,
  hr,
  codeLive,
  codeEdit,
  fullscreen,
  codePreview,
  divider,
} from '@uiw/react-md-editor'
import { useTheme } from 'next-themes'

interface MarkdownEditorProps {
  value: string
  height?: number
  onChange: (value: string) => void
}

export default function MarkdownEditor({
  value,
  height,
  onChange,
}: MarkdownEditorProps) {
  const [activeTab, setActiveTab] = useState('edit')
  const { resolvedTheme } = useTheme()

  const editorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (editorRef.current && resolvedTheme) {
      editorRef.current.setAttribute('data-color-mode', resolvedTheme)
    }
  }, [resolvedTheme])

  const handleEditorChange = (value?: string) => {
    if (value !== undefined) {
      onChange(value)
    }
  }

  const valid: ICommand[] = [
    bold,
    italic,
    strikethrough,
    code,
    link,
    orderedListCommand,
    unorderedListCommand,
    quote,
    table,
    hr,
    help,
  ]

  return (
    <Card className="border-none shadow-none">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="edit" className="flex items-center gap-2">
            <FileEdit className="h-4 w-4" />
            Edit
          </TabsTrigger>
          <TabsTrigger value="preview" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Preview
          </TabsTrigger>
        </TabsList>

        {/* Edit Tab */}
        <TabsContent value="edit" className="mt-0">
          <div ref={editorRef}>
            <MDEditor
              value={value}
              onChange={handleEditorChange}
              height={height ?? 300}
              preview="edit"
              highlightEnable={false}
              fullscreen={false}
              commands={valid}
              commandsFilter={(cmd) => {
                if (
                  [
                    codeLive,
                    codeEdit,
                    fullscreen,
                    codePreview,
                    divider,
                  ].includes(cmd)
                ) {
                  return false
                }
                return cmd
              }}
              // TODO: maybe give this a shot https://github.com/uiwjs/react-md-editor/issues/419
            />
          </div>
        </TabsContent>

        {/* Preview Tab */}
        <TabsContent value="preview" className="mt-0">
          <div ref={editorRef}>
            <MDEditor
              value={value}
              height={300}
              preview="preview"
              hideToolbar
              visibleDragbar={false}
            />
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  )
}
