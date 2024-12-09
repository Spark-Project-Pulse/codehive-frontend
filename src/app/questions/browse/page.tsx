'use client'

import { useEffect, useState } from 'react'
import { getAllTags } from '@/api/tags'
import { type Question } from '@/types/Questions'
import { type TagOption } from '@/types/Tags'
import { getAllQuestions } from '@/api/questions'
import { useDebounce } from '@/hooks/useDebounce'
import { SearchAndTagComponent } from '@/components/universal/search/SearchAndTagComponent'
import { ActiveFilters } from '@/components/universal/search/ActiveFilters'
import { PaginationComponent } from '@/components/universal/search/PaginationComponent'
import QuestionCard from '@/components/pages/questions/[question_id]/QuestionCard'
import SkeletonQuestionCard from '@/components/pages/questions/[question_id]/SkeletonQuestionCard'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

const QuestionsPage: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [hasError, setHasError] = useState<boolean>(false)
  const [tags, setTags] = useState<TagOption[]>([])
  const [selectedTags, setSelectedTags] = useState<TagOption[]>([])
  const [sortBy, setSortBy] = useState<string>('recency') // Default to 'recency'

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [pageSize] = useState<number>(20) // You can make this adjustable if needed
  const [totalPages, setTotalPages] = useState<number>(1)
  const [, setTotalQuestions] = useState<number>(0)

  const [searchQuery, setSearchQuery] = useState<string>('')
  const debouncedSearchQuery = useDebounce(searchQuery, 500)

  const router = useRouter()

  // Fetch Questions with Pagination, Filtering, and Search
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setIsLoading(true)

        const selectedTagValues = selectedTags.map((tag) => tag.value)
        console.log('Fetching questions with:', {
          currentPage,
          pageSize,
          selectedTagValues,
          searchQuery: debouncedSearchQuery,
          sortBy,
        })

        const response = await getAllQuestions(
          currentPage,
          pageSize,
          selectedTagValues,
          debouncedSearchQuery,
          null,
          sortBy // Pass the sortBy parameter
        )

        if (response.errorMessage) {
          throw new Error(response.errorMessage)
        }

        if (response.data) {
          console.log('API response:', response.data.questions)
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
        setIsLoading(false)
      }
    }

    void fetchQuestions()
  }, [currentPage, pageSize, selectedTags, debouncedSearchQuery, sortBy]) // Add sortBy here

  // Fetch Tags
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

  const clearFilters = () => {
    setSelectedTags([])
    setSearchQuery('')
    setSortBy('recency') // Reset to default sort
    setCurrentPage(1) // Reset to first page when filters are cleared
  }

  const handleSearchChange = (query: string) => setSearchQuery(query)

  const handleSortChange = (sortOption: string) => {
    setSortBy(sortOption)
    setCurrentPage(1) // Reset to the first page when sort changes
  }

  const handleRemoveTag = (tagValue: string) => {
    setSelectedTags(selectedTags.filter((tag) => tag.value !== tagValue))
  }

  const handleClearSearchQuery = () => setSearchQuery('')

  const handleAskQuestionClick = () => {
    router.push(`/questions/ask-question`)
  }

  return (
    <div className="max-w-7xl">
      <h1 className="text-center text-h4 font-subHeading pb-6">
        Questions
      </h1>
      <div className="flex">
        <div className="space-y-6 pr-12">
          <div className="mb-2">
            <Button onClick={handleAskQuestionClick} className="rounded-lg px-4 py-2 w-full">
              Ask Question
            </Button>
          </div>
          <SearchAndTagComponent
            tags={tags}
            selectedTags={selectedTags}
            onSearchChange={handleSearchChange}
            onTagChange={setSelectedTags}
            onClearFilters={clearFilters}
            searchQuery={searchQuery}
            sortOptions={[
              { label: 'Recency', value: 'recency' },
              { label: 'Views', value: 'views' },
              { label: 'Unanswered', value: 'unanswered' },
            ]}
            onSortChange={handleSortChange}
            showSortOptions={true}
          />
        </div>

        <main className="md:w-3/4">
          {isLoading && (
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

          {!isLoading && !hasError && (
            <>
              {(selectedTags.length > 0 || searchQuery.trim() || sortBy !== 'recency') && (
                <ActiveFilters
                  selectedTags={selectedTags}
                  searchQuery={searchQuery}
                  currentSort={sortBy}
                  onRemoveTag={handleRemoveTag}
                  onClearSearchQuery={handleClearSearchQuery}
                />
              )}

              <ul className="space-y-12">
                {questions.length > 0 ? (
                  questions.map((question) => (
                    <li key={question.question_id.toString()}>
                      <QuestionCard
                        question={question}
                        href={`/questions/${question.question_id}`}
                      />
                    </li>
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
        </main>
      </div>
    </div>
  )
}

export default QuestionsPage
