import React, { useState } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Card } from '@/components/ui/card'
import {
  FileEdit,
  Eye,
  Bold,
  Italic,
  Code,
  List,
  ListOrdered,
} from 'lucide-react'
import MDEditor, {
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
  type ICommand,
  hr,
} from '@uiw/react-md-editor'
import { Button } from '@/components/ui/button'

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
}

export default function MarkdownEditor({
  value,
  onChange,
}: MarkdownEditorProps) {
  const [activeTab, setActiveTab] = useState('edit')

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
          <MDEditor
            value={value}
            onChange={handleEditorChange}
            height={300}
            preview="edit"
            highlightEnable={false}
            fullscreen={false}
            commands={valid}
            // components={{
            //   // Fully override the toolbar rendering
            //   toolbar: (command, disabled, executeCommand) => {
            //     return (
            //       <Button
            //         key={command.keyCommand}
            //         aria-label={command.name ?? command.keyCommand}
            //         disabled={disabled}
            //         onClick={(event) => {
            //           event.stopPropagation()
            //           executeCommand(command, command.groupName)
            //         }}
            //         variant="outline"
            //         size="icon"
            //         type="button"
            //       >
            //         {getCustomIcon(command)}
            //       </Button>
            //     )
            //   },
            // }}
          />
        </TabsContent>

        {/* Preview Tab */}
        <TabsContent value="preview" className="mt-0">
          <MDEditor value={value} height={300} preview="preview" hideToolbar />
        </TabsContent>
      </Tabs>
    </Card>
  )
}

// function getCustomIcon(command: ICommand) {
//   switch (command) {
//     // case bold:
//     //   return <Bold />

//     default:
//       return command.keyCommand // Fallback to the key command name
//   }
// }
