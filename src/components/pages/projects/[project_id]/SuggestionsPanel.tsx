'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from '@/components/ui/use-toast'
import { codeReview } from '@/api/projects'
import type { Suggestion } from '@/types/Projects'

interface SuggestionsPanelProps {
  projectTitle: string
  projectDescription: string
  filePath: string | null
  fileContent: string | null
}

export default function SuggestionsPanel({
  projectTitle,
  projectDescription,
  filePath,
  fileContent,
}: SuggestionsPanelProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [isSuggestionsLoading, setIsSuggestionsLoading] =
    useState<boolean>(false)

  const handleCodeReviewClicked = async () => {
    if (!filePath || !fileContent) return

    try {
      setIsSuggestionsLoading(true)
      const { errorMessage, data } = await codeReview(
        projectTitle,
        projectDescription,
        filePath,
        fileContent
      )

      if (!errorMessage && data?.suggestions) {
        setSuggestions(data.suggestions)
      } else {
        console.error('Error:', errorMessage)
      }
    } catch (error) {
      console.error('Unexpected error:', error)
      toast({
        variant: 'destructive',
        title: 'Error',
        description:
          'We encountered an error while processing your file. Please try again later.',
      })
    } finally {
      setIsSuggestionsLoading(false)
    }
  }

  return (
    <div className="flex h-full flex-col">
      {/* Panel Header */}
      <div className="border-b p-4">
        <h2 className="text-center text-xl font-bold">Suggestions</h2>
      </div>
      {/* Suggestions Content */}
      {isSuggestionsLoading ? (
        <div className="p-4">
          {[...Array.from({ length: 5 })].map((_, i) => (
            <Skeleton key={i} className="mb-4 h-20" />
          ))}
        </div>
      ) : suggestions.length > 0 ? (
        <div className="space-y-4 p-4">
          {suggestions.map((suggestion, i) => (
            <Card key={i} className="mb-4">
              <CardHeader>
                <CardTitle className="text-sm font-medium">
                  Line {suggestion.line_number}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{suggestion.suggestion}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="p-4 text-center">
          <Button onClick={handleCodeReviewClicked}>AI Code Review</Button>
          <p className="mt-2 text-sm">
            No suggestions yet. Click "AI Code Review" to get started.
          </p>
        </div>
      )}
    </div>
  )
}
