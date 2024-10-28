'use client'

import { useEffect, useState } from 'react'
import { LoadingSpinner } from '@/components/ui/loading'
import { useRouter } from 'next/navigation'
import { getAllTags } from '@/api/tags'
import { type TagOption } from '@/types/Tags'
import { type Question } from '@/types/Questions'
import { getAllQuestions } from '@/api/questions'
import { MultiSelector } from '@/components/ui/MultiSelector'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import { useDebounce } from '@/hooks/useDebounce'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

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
  }, [currentPage, selectedTags, debouncedSearchQuery])

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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  return (
    <div className="max-w-7xl p-6">
      <h1 className="text-h2 font-bold font-subHeading text-center text-secondary-foreground">
        Questions
      </h1>

      <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6">
        <aside className="md:w-1/4">
          <div className="p-4 border rounded-lg bg-card">
            <h2 className="text-xl font-semibold mb-4">Search and Filter</h2>
            <div className="mb-4">
              <div className="relative">
                <Input
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Search questions..."
                  className="w-full pr-10"
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
              </div>
            </div>
            <MultiSelector
              options={tags}
              selected={selectedTags}
              onSelectedChange={setSelectedTags}
              placeholder="Select tags..."
            />
            {(selectedTags.length > 0 || searchQuery.trim()) && (
              <button
                onClick={clearFilters}
                className="mt-4 w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
              >
                Clear Filters
              </button>
            )}
          </div>
        </aside>

        <main className="md:w-3/4">
          {isLoading && (
            <div className="flex flex-col items-center justify-center my-10">
              <LoadingSpinner />
              <p className="mt-4 text-muted">Loading questions...</p>
            </div>
          )}

          {hasError && (
            <div className="text-center my-10 text-destructive">
              <p>
                Something went wrong while fetching the questions. Please try
                again later.
              </p>
            </div>
          )}

          {!isLoading && !hasError && (
            <>
              {(selectedTags.length > 0 || searchQuery.trim()) && (
                <div className="mb-4">
                  <p className="text-lg font-medium">Active Filters:</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedTags.map((tag) => (
                      <span
                        key={tag.value}
                        className="px-2 py-1 rounded-full bg-indigo-100 text-indigo-700 text-sm font-medium flex items-center"
                      >
                        {tag.label}
                        <button
                          onClick={() => {
                            setSelectedTags(
                              selectedTags.filter((t) => t.value !== tag.value)
                            )
                          }}
                          className="ml-1 text-indigo-700 hover:text-indigo-900 focus:outline-none"
                        >
                          &times;
                        </button>
                      </span>
                    ))}
                    {searchQuery.trim() && (
                      <span
                        className="px-2 py-1 rounded-full bg-indigo-100 text-indigo-700 text-sm font-medium flex items-center"
                      >
                        {searchQuery}
                        <button
                          onClick={() => {
                            setSearchQuery('')
                          }}
                          className="ml-1 text-indigo-700 hover:text-indigo-900 focus:outline-none"
                        >
                          &times;
                        </button>
                      </span>
                    )}
                  </div>
                </div>
              )}

              <ul className="space-y-6">
                {questions.length > 0 ? (
                  questions.map((question) => (
                    <li
                      key={question.question_id.toString()}
                      className="p-6 rounded-lg shadow-md bg-card border border-border cursor-pointer hover:bg-secondary transition"
                      onClick={() =>
                        handleQuestionClick(question.question_id.toString())
                      }
                    >
                      <div className="flex justify-between items-start">
                        <h2 className="text-xl font-semibold text-secondary-foreground mb-2 text-balance">
                          {question.title}
                        </h2>
                        <div className="text-right">
                          <p className="text-base text-foreground font-medium">
                            {question.asker_info?.username ?? 'Anonymous'}
                          </p>
                          <p className="text-sm text-foreground font-medium">
                            {new Date(
                              question.created_at ?? ''
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <p className="text-base text-foreground mt-4">
                        {question.description}
                      </p>
                      {/* Display Tags */}
                      <div className="mt-4 flex flex-wrap gap-2">
                        {question.tags?.map((tagId) => {
                          const tag = tags.find((t) => t.value === tagId)
                          return tag ? (
                            <span
                              key={tag.value}
                              className="px-2 py-1 rounded-full bg-indigo-100 text-indigo-700 text-sm font-medium"
                            >
                              {tag.label}
                            </span>
                          ) : null // Handle cases where tag is not found
                        })}
                      </div>
                    </li>
                  ))
                ) : (
                  <p className="text-center text-gray-700 text-lg">
                    No questions match your search criteria.
                  </p>
                )}
              </ul>

              {/* Pagination Component */}
              {totalPages > 1 && (
                <div className="mt-6">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          href="#"
                          onClick={() =>
                            setCurrentPage((prev) => Math.max(prev - 1, 1))
                          }
                        />
                      </PaginationItem>

                      {/* Page Numbers */}
                      {Array.from({ length: totalPages }, (_, index) => {
                        const pageNumber = index + 1
                        // Show only a range of pages around the current page
                        if (
                          pageNumber === 1 ||
                          pageNumber === totalPages ||
                          (pageNumber >= currentPage - 2 &&
                            pageNumber <= currentPage + 2)
                        ) {
                          return (
                            <PaginationItem key={pageNumber}>
                              <PaginationLink
                                href="#"
                                isActive={currentPage === pageNumber}
                                onClick={() => setCurrentPage(pageNumber)}
                              >
                                {pageNumber}
                              </PaginationLink>
                            </PaginationItem>
                          )
                        } else if (
                          pageNumber === currentPage - 3 ||
                          pageNumber === currentPage + 3
                        ) {
                          return <PaginationEllipsis key={pageNumber} />
                        } else {
                          return null
                        }
                      })}

                      <PaginationItem>
                        <PaginationNext
                          href="#"
                          onClick={() =>
                            setCurrentPage((prev) =>
                              Math.min(prev + 1, totalPages)
                            )
                          }
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  )
}

export default QuestionsPage