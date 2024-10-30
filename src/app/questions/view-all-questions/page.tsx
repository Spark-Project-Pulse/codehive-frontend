'use client'

import { useEffect, useState } from 'react'
import { LoadingSpinner } from '@/components/ui/loading'
import { useRouter } from 'next/navigation'
import { getAllTags } from '@/api/tags'
import { type TagOption } from '@/types/Tags'
import { type Question } from '@/types/Questions'
import { getAllQuestions } from '@/api/questions'
import { useDebounce } from '@/hooks/useDebounce'
import { SearchAndTagComponent } from '@/components/universal/search/SearchAndTagComponent'
import { ActiveFilters } from '@/components/universal/search/ActiveFilters'
import { PaginationComponent } from '@/components/universal/search/PaginationComponent'

const QuestionsPage: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [hasError, setHasError] = useState<boolean>(false)
  const [tags, setTags] = useState<TagOption[]>([])
  const [selectedTags, setSelectedTags] = useState<TagOption[]>([])

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [pageSize] = useState<number>(20) // You can make this adjustable if needed
  const [totalPages, setTotalPages] = useState<number>(1)
  const [totalQuestions, setTotalQuestions] = useState<number>(0)

  const [searchQuery, setSearchQuery] = useState<string>('')
  const debouncedSearchQuery = useDebounce(searchQuery, 500)

  const router = useRouter()

  // Fetch Questions with Pagination, Filtering, and Search
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setIsLoading(true)
        const selectedTagValues = selectedTags.map((tag) => tag.value)

        const response = await getAllQuestions(
          currentPage,
          pageSize,
          selectedTagValues,
          debouncedSearchQuery
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
        setIsLoading(false)
      }
    }

    void fetchQuestions()
  }, [currentPage, pageSize, selectedTags, debouncedSearchQuery])

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

  const handleQuestionClick = (questionId: string) => {
    router.push(`/questions/${questionId}`)
  }

  const clearFilters = () => {
    setSelectedTags([])
    setSearchQuery('')
    setCurrentPage(1) // Reset to first page when filters are cleared
  }

  // Reset to first page when filters or search query change
  useEffect(() => {
    setCurrentPage(1)
  }, [selectedTags, debouncedSearchQuery])

  const handleSearchChange = (query: string) => setSearchQuery(query)

  const handleRemoveTag = (tagValue: string) => {
    setSelectedTags(selectedTags.filter((tag) => tag.value !== tagValue))
  }

  const handleClearSearchQuery = () => setSearchQuery('')

  return (
    <div className="max-w-7xl p-6">
      <h1 className="text-center font-subHeading text-h2 font-bold text-secondary-foreground">
        Questions
      </h1>

      <div className="flex flex-col space-y-6 md:flex-row md:space-x-6 md:space-y-0">
        <SearchAndTagComponent
          tags={tags}
          selectedTags={selectedTags}
          onSearchChange={handleSearchChange}
          onTagChange={setSelectedTags}
          onClearFilters={clearFilters}
          searchQuery={searchQuery}
        />

        <main className="md:w-3/4">
          {isLoading && (
            <div className="my-10 flex flex-col items-center justify-center">
              <LoadingSpinner />
              <p className="mt-4 text-muted">Loading questions...</p>
            </div>
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
              {(selectedTags.length > 0 || searchQuery.trim()) && (
                <ActiveFilters
                  selectedTags={selectedTags}
                  searchQuery={searchQuery}
                  onRemoveTag={handleRemoveTag}
                  onClearSearchQuery={handleClearSearchQuery}
                />
              )}

              <ul className="space-y-6">
                {questions.length > 0 ? (
                  questions.map((question) => (
                    <li
                      key={question.question_id.toString()}
                      className="cursor-pointer rounded-lg border border-border bg-card p-6 shadow-md transition hover:bg-secondary"
                      onClick={() =>
                        handleQuestionClick(question.question_id.toString())
                      }
                    >
                      <div className="flex items-start justify-between">
                        <h2 className="mb-2 text-balance text-xl font-semibold text-secondary-foreground">
                          {question.title}
                        </h2>
                        <div className="text-right">
                          <p className="text-base font-medium text-foreground">
                            {question.asker_info?.username ?? 'Anonymous'}
                          </p>
                          <p className="text-sm font-medium text-foreground">
                            {new Date(
                              question.created_at ?? ''
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <p className="mt-4 text-base text-foreground">
                        {question.description}
                      </p>
                      {/* Display Tags */}
                      <div className="mt-4 flex flex-wrap gap-2">
                        {question.tags?.map((tagId) => {
                          const tag = tags.find((t) => t.value === tagId)
                          return tag ? (
                            <span
                              key={tag.value}
                              className="rounded-full bg-indigo-100 px-2 py-1 text-sm font-medium text-indigo-700"
                            >
                              {tag.label}
                            </span>
                          ) : null // Handle cases where tag is not found
                        })}
                      </div>
                    </li>
                  ))
                ) : (
                  <p className="text-center text-lg text-gray-700">
                    No questions match your search criteria.
                  </p>
                )}
              </ul>

              {/* Use Pagination Component */}
              {totalPages > 1 && (
                <PaginationComponent
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage} // Pass setCurrentPage directly
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
