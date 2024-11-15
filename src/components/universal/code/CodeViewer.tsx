import React, { useState } from 'react'
import Editor from '@monaco-editor/react'
import { type editor as monacoEditor } from 'monaco-editor'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import QuestionForm from '@/components/pages/questions/ask-question/QuestionForm'
import { createQuestion } from '@/api/questions'
import { useToast } from '@/components/ui/use-toast'
import { useRouter } from 'next/navigation'
import { type Project } from '@/types/Projects'

interface CodeViewerProps {
  fileContent: string | null
  pathname: string
  project: Project
  filename: string | null
  lineNumbers?: boolean
  language?: string
}

export const CodeViewer: React.FC<CodeViewerProps> = ({
  fileContent,
  project,
  pathname,
  lineNumbers = true,
  language = 'javascript', // TODO: dynamically pass this from parent component
}) => {
  const { toast } = useToast()
  const router = useRouter()

  const [selectedLine, setSelectedLine] = useState<number | null>(null)
  const codeContext =
    selectedLine !== null ? fileContent?.split('\n')[selectedLine - 1] : ''

  const handleEditorMount = (editor: monacoEditor.IStandaloneCodeEditor) => {
    // Add click event listener
    editor.onMouseDown((e) => {
      if (e.target.position) {
        const lineNumber = e.target.position.lineNumber
        setSelectedLine(lineNumber)
      }
    })

    // Alternative: Listen for selection changes
    editor.onDidChangeCursorSelection(() => {
      const position = editor.getPosition()
      if (position) {
        setSelectedLine(position.lineNumber)
      }
    })
  }

  // Function to handle form submission and perform API call
  async function handleFormSubmit(values: {
    title: string
    description: string
    related_project?: string
    codeContext?: string
    codeContextFullPathname?: string
    codeContextLineNumber?: number
    tags?: string[]
  }) {
    try {
      const response = await createQuestion(values)
      const { errorMessage, data } = response

      if (!errorMessage && data?.question_id) {
        // Navigate to the new question page using question_id
        router.push(`/questions/${data.question_id}`)
      } else {
        // Show error toast if an error occurs
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'There was an error submitting your question.',
        })
      }
    } catch (error) {
      console.error('Unexpected error:', error)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'There was an unexpected error submitting your question.',
      })
    }
  }

  if (fileContent == null) {
    return (
      <div className="rounded-lg border border-red-400 bg-red-100 p-4 text-red-700">
        <h2 className="text-lg font-bold">File not found</h2>
      </div>
    )
  }

  return (
    <div className="relative">
      <Editor
        height="40vh"
        language={language}
        value={fileContent}
        options={{
          selectOnLineNumbers: true,
          readOnly: true,
          lineNumbers: lineNumbers ? 'on' : 'off',
          automaticLayout: true,
          minimap: { enabled: false },
          renderLineHighlight: 'all',
          scrollBeyondLastLine: false,
          cursorStyle: 'block',
        }}
        onMount={handleEditorMount}
      />
      {selectedLine !== null && (
        <div className="absolute bottom-0 right-6 rounded shadow-lg">
          <Sheet>
            <SheetTrigger>Ask on line {selectedLine}</SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Ask a Question</SheetTitle>
                <SheetDescription>
                  Use the form below to add <strong>context</strong> to your
                  question!
                </SheetDescription>
                <QuestionForm
                  onSubmit={handleFormSubmit}
                  hasContext
                  project={project}
                  codeContext={codeContext}
                  codeContextFullPathname={pathname}
                  codeContextLineNumber={selectedLine}
                />
              </SheetHeader>
            </SheetContent>
          </Sheet>
        </div>
      )}
    </div>
  )
}
