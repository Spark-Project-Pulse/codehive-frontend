'use client'

import { useEffect, useState } from 'react'
import { getAllQuestions } from '@/api/questions'
import { getAllTags } from '@/api/tags'
import { useDebounce } from '@/hooks/useDebounce'
import { type Question } from '@/types/Questions'
import { type TagOption } from '@/types/Tags'
import { SearchAndTagComponent } from '@/components/universal/search/SearchAndTagComponent'
import { ActiveFilters } from '@/components/universal/search/ActiveFilters'
import { PaginationComponent } from '@/components/universal/search/PaginationComponent'
import QuestionCard from '@/components/pages/questions/[question_id]/QuestionCard'
import SkeletonQuestionCard from '@/components/pages/questions/[question_id]/SkeletonQuestionCard'
import { type UUID } from 'crypto'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

interface CommunityQuestionsTabProps {
  communityId: UUID
}

const CommunityQuestionsTab: React.FC<CommunityQuestionsTabProps> = ({
  communityId,
}) => {
  const [questions, setQuestions] = useState<Question[]>([])
  const [questionsLoading, setQuestionsLoading] = useState<boolean>(true)
  const [hasError, setHasError] = useState<boolean>(false)

  const [tags, setTags] = useState<TagOption[]>([])
  const [selectedTags, setSelectedTags] = useState<TagOption[]>([])

  const [currentPage, setCurrentPage] = useState<number>(1)
  const [pageSize] = useState<number>(20)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [totalQuestions, setTotalQuestions] = useState<number>(0)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const debouncedSearchQuery = useDebounce(searchQuery, 500)

  const router = useRouter()

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const fetchedTags = await getAllTags()
        setTags(fetchedTags)
      } catch (error) {
        console.error('Error fetching tags:', error)
      }
    }

    void fetchTags()
  }, [])

  // Fetch questions specific to this community
  useEffect(() => {
    const fetchQuestions = async () => {
      setQuestionsLoading(true)
      try {
        const selectedTagValues = selectedTags.map((tag) => tag.value)
        const response = await getAllQuestions(
          currentPage,
          pageSize,
          selectedTagValues,
          debouncedSearchQuery,
          communityId // Filter by community ID
        )

        if (response.errorMessage) {
          throw new Error(response.errorMessage)
        }

        if (response.data) {
          setQuestions(response.data.questions)
          setTotalQuestions(response.data.totalQuestions)
          setTotalPages(Math.ceil(response.data.totalQuestions / pageSize))
        } else {
          throw new Error('No data received')
        }
      } catch (error) {
        console.error('Error fetching questions:', error)
        setHasError(true)
      } finally {
        setQuestionsLoading(false)
      }
    }

    void fetchQuestions()
  }, [communityId, currentPage, pageSize, selectedTags, debouncedSearchQuery])

  const clearFilters = () => {
    setSelectedTags([])
    setSearchQuery('')
    setCurrentPage(1)
  }

  // Naviage to ask questions page, include community id as a query parameter
  const handleAskQuestionClick = () => {
    router.push(`/questions/ask-question?communityId=${communityId}`)
  }

  return (
    <div className="max-w-7xl p-6">
      <div className="mb-4 flex justify-end">
        <Button onClick={handleAskQuestionClick} className="rounded px-4 py-2">
          Ask Question
        </Button>
      </div>

      <div className="flex flex-wrap gap-4 md:flex-nowrap">
        <div className="w-full flex-shrink-0 md:w-1/4">
          <SearchAndTagComponent
            tags={tags}
            selectedTags={selectedTags}
            onSearchChange={setSearchQuery}
            onTagChange={setSelectedTags}
            onClearFilters={clearFilters}
            searchQuery={searchQuery}
          />
        </div>

        <div className="w-full md:w-3/4">
          {questionsLoading && (
            <ul className="space-y-6">
              {Array.from({ length: 10 }).map((_, index) => (
                <SkeletonQuestionCard href key={index} />
              ))}
            </ul>
          )}

          {hasError && (
            <div className="my-10 text-center text-destructive">
              <p>
                Something went wrong while fetching the questions. Please try
                again later.
              </p>
            </div>
          )}

          {!questionsLoading && !hasError && (
            <>
              {(selectedTags.length > 0 || searchQuery.trim()) && (
                <ActiveFilters
                  selectedTags={selectedTags}
                  searchQuery={searchQuery}
                  onRemoveTag={(tagValue) =>
                    setSelectedTags(
                      selectedTags.filter((tag) => tag.value !== tagValue)
                    )
                  }
                  onClearSearchQuery={() => setSearchQuery('')}
                />
              )}

              <ul className="space-y-6">
                {questions.length > 0 ? (
                  questions.map((question) => (
                    <QuestionCard
                      key={question.question_id}
                      question={question}
                      href={`/questions/${question.question_id}`}
                    />
                  ))
                ) : (
                  <p className="text-center text-lg text-gray-700">
                    No questions match your search criteria.
                  </p>
                )}
              </ul>

              {totalPages > 1 && (
                <PaginationComponent
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default CommunityQuestionsTab
