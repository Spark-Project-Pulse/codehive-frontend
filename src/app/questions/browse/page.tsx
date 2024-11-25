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
          debouncedSearchQuery,
          null
        )

        if (response.errorMessage) {
          throw new Error(response.errorMessage)
        }

        if (response.data) {
          // Ensure uniqueness based on 'question_id'
          const uniqueQuestionsMap = new Map<string, Question>()
          response.data.questions.forEach((question) => {
            uniqueQuestionsMap.set(question.question_id.toString(), question)
          })
          let uniqueQuestions = Array.from(uniqueQuestionsMap.values())

          // Sort questions to prioritize unanswered ones
          uniqueQuestions = uniqueQuestions.sort((a, b) => {
            // Unanswered questions (is_answered === false) come first
            if (!a.is_answered && b.is_answered) return -1
            if (a.is_answered && !b.is_answered) return 1
            return 0 // Keep relative order for questions with the same state
          })

          setQuestions(uniqueQuestions)
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
      <h1 className="text-center text-h2 font-bold">
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
