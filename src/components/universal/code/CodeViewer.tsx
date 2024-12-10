import React, { useEffect, useState } from 'react'
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
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { useTheme } from 'next-themes'
import { getLanguageFromFilename } from '@/utils/codeEditorHelpers'

interface CodeViewerProps {
  fileContent: string | null
  pathname: string
  project: Project
  filename: string | null
  lineNumbers?: boolean
  loading?: boolean
}

export const CodeViewer: React.FC<CodeViewerProps> = ({
  fileContent,
  project,
  pathname,
  lineNumbers = true,
  filename,
  loading = true,
}) => {
  const { resolvedTheme } = useTheme() // Get the current theme (light or dark)
  const { toast } = useToast()
  const router = useRouter()
  const editorLanguage = getLanguageFromFilename(filename) // Get the language from the filename, defaults to plaintext if filename is null
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [selectedLines, setSelectedLines] = useState<{
    startLine: number
    endLine: number
    content: string | null
  } | null>(null)

  // const codeContext =
  //   selectedLine !== null ? fileContent?.split('\n')[selectedLine - 1] : ''

  // useEffect to handle body overflow when the sheet is open/closed
  useEffect(() => {
    const originalOverflow = document.body.style.overflow
    if (isSheetOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = originalOverflow
    }

    return () => {
      // Reset overflow on cleanup
      document.body.style.overflow = originalOverflow
    }
  }, [isSheetOpen])

  const handleEditorMount = (editor: monacoEditor.IStandaloneCodeEditor) => {
    // Listen for selection changes
    editor.onDidChangeCursorSelection(() => {
      const selection = editor.getSelection()

      if (selection) {
        const startLine = selection.startLineNumber
        const endLine = selection.endLineNumber

        if (startLine && endLine) {
          // Capture the range of lines selected
          const selectedLines = fileContent
            ?.split('\n')
            .slice(startLine - 1, endLine) // Adjusting for zero-based index
            .join('\n')

          console.log('Selected lines:', startLine, endLine, selectedLines)

          setSelectedLines({
            startLine,
            endLine,
            content: selectedLines ?? '',
          })
        }
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
    codeContextLineNumberStart?: number
    codeContextLineNumberEnd?: number
    tags?: string[]
  }) {
    try {
      const response = await createQuestion(values)
      const { errorMessage, data } = response

      if (!errorMessage && data?.question_id) {
        // Navigate to the new question page using question_id
        router.push(`/questions/${data.question_id}`)
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description:
            errorMessage ?? 'There was an error submitting your question.',
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

  if (loading) {
    return <Skeleton className="h-full w-full" />
  }

  if (fileContent == null) {
    return (
      <div className="rounded-lg border border-red-400 bg-red-100 p-4 text-red-700">
        <h2 className="text-lg font-bold">File not found</h2>
      </div>
    )
  }

  return (
    <div className="h-full">
      <Editor
        loading={<Skeleton className="h-full w-full" />}
        height="60vh"
        language={editorLanguage}
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
        theme={resolvedTheme === 'dark' ? 'vs-dark' : 'light'}
        onMount={handleEditorMount}
      />
      {selectedLines !== null && (
        <div className="fixed bottom-4 right-6 z-50 rounded shadow-lg">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger>
              <Button>
                Ask on line {selectedLines.startLine}
                {selectedLines.endLine > selectedLines.startLine &&
                  ` - ${selectedLines.endLine}`}
              </Button>
            </SheetTrigger>
            <SheetContent className="overflow-auto">
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
                  codeContext={selectedLines.content ?? undefined}
                  codeContextFullPathname={pathname}
                  codeContextLineNumberStart={selectedLines.startLine}
                  codeContextLineNumberEnd={selectedLines.endLine}
                />
              </SheetHeader>
            </SheetContent>
          </Sheet>
        </div>
      )}
    </div>
  )
}
