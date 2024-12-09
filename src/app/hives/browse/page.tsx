'use client'

import { getAllHives } from '@/api/hives'
import { getAllTags } from '@/api/tags'
import HiveCard from '@/components/pages/hives/browse/HiveCard'
import SkeletonHiveCard from '@/components/pages/hives/browse/SkeletonHiveCard'
import { ActiveFilters } from '@/components/universal/search/ActiveFilters'
import { PaginationComponent } from '@/components/universal/search/PaginationComponent'
import { SearchAndTagComponent } from '@/components/universal/search/SearchAndTagComponent'
import { useDebounce } from '@/hooks/useDebounce'
import { type Hive } from '@/types/Hives'
import { type TagOption } from '@/types/Tags'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

// Main component for browsing hives
export default function BrowseHives() {
  // State for hives fetched from the API
  const [hives, setHives] = useState<Hive[]>([])
  // State for loading status
  const [isLoading, setIsLoading] = useState<boolean>(true)
  // State to track if an error occurred during data fetching
  const [hasError, setHasError] = useState<boolean>(false)
  // State for available tags fetched from the API
  const [tags, setTags] = useState<TagOption[]>([])
  // State for selected tags used in filtering
  const [selectedTags, setSelectedTags] = useState<TagOption[]>([])

  // Pagination state variables
  const [currentPage, setCurrentPage] = useState<number>(1) // Current page for pagination
  const [pageSize] = useState<number>(30) // Number of hives per page
  const [totalPages, setTotalPages] = useState<number>(1) // Total number of pages available
  const [, setTotalHives] = useState<number>(0) // Total number of hives fetched

  // State for the search query and debouncing to limit API calls
  const [searchQuery, setSearchQuery] = useState<string>('')
  const debouncedSearchQuery = useDebounce(searchQuery, 500)

  const router = useRouter()

  // useEffect to fetch hives with pagination, filtering, and search capabilities
  useEffect(() => {
    const fetchHives = async () => {
      try {
        setIsLoading(true) // Start loading
        const selectedTagValues = selectedTags.map((tag) => tag.value) // Extract tag values

        // Fetch hives with current page, selected tags, and search query
        const response = await getAllHives(
          currentPage,
          pageSize,
          selectedTagValues,
          debouncedSearchQuery
        )
        if (response.errorMessage) {
          throw new Error(response.errorMessage) // Handle error from response
        }

        // Update state if data is received
        if (response.data) {
          setHives(response.data.hives)
          setTotalHives(response.data.totalHives)
          setTotalPages(Math.ceil(response.data.totalHives / pageSize))
        } else {
          throw new Error('No data received') // Handle case with no data
        }
      } catch (error) {
        console.error('Error fetching hives:', error) // Log error
        setHasError(true) // Set error state
      } finally {
        setIsLoading(false) // Stop loading
      }
    }

    void fetchHives()
  }, [currentPage, pageSize, selectedTags, debouncedSearchQuery])

  // Handle click on a hive card to navigate to the hive details page
  const handleHiveClick = (hive_title: string) => {
    router.push(`/hives/${hive_title}`)
  }

  // useEffect to fetch available tags for filtering
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const fetchedTags = await getAllTags() // Fetch all tags
        setTags(fetchedTags) // Set tags state
      } catch (error) {
        console.error('Error fetching tags:', error) // Log error if fetching tags fails
      }
    }

    void fetchTags()
  }, []) // Runs only once when the component mounts

  // Function to clear all filters and reset state
  const clearFilters = () => {
    setSelectedTags([])
    setSearchQuery('')
    setCurrentPage(1) // Reset to first page when filters are cleared
  }

  // useEffect to reset to the first page whenever filters or search query changes
  useEffect(() => {
    setCurrentPage(1)
  }, [selectedTags, debouncedSearchQuery])

  // Function to handle changes in search query
  const handleSearchChange = (query: string) => setSearchQuery(query)

  // Function to remove a tag from the selected tags list
  const handleRemoveTag = (tagValue: string) => {
    setSelectedTags(selectedTags.filter((tag) => tag.value !== tagValue))
  }

  // Function to clear the search query
  const handleClearSearchQuery = () => setSearchQuery('')

  return (
    <div className="max-w-7xl p-6 mb-96">
      {/* Main title for the hives page */}
      <h1 className="text-center text-h4 font-subHeading mb-10">
        Hives
      </h1>

      <div className="flex flex-col space-y-6 md:flex-row md:space-x-6 md:space-y-0">
        {/* Search and tag filtering component */}
        <SearchAndTagComponent
          tags={tags}
          selectedTags={selectedTags}
          onSearchChange={handleSearchChange}
          onTagChange={setSelectedTags}
          onClearFilters={clearFilters}
          searchQuery={searchQuery}
          showSortOptions={false}
        />
        <div className="md:w-3/4">
          {/* Display hive card skeletons while fetching hives */}
          {isLoading && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 30 }, (_, index) => (
                <SkeletonHiveCard key={index} />
              ))}
            </div>
          )}

          {/* Display error message if there was an issue fetching hives */}
          {hasError && (
            <div className="my-10 text-center text-destructive">
              <p>
                Something went wrong while fetching the hives. Please try
                again later.
              </p>
            </div>
          )}

          {/* Display hives if loading is complete and no error occurred */}
          {!isLoading && !hasError && (
            <>
              {/* Show active filters if tags or search query are applied */}
              {(selectedTags.length > 0 || searchQuery.trim()) && (
                <ActiveFilters
                  selectedTags={selectedTags}
                  searchQuery={searchQuery}
                  onRemoveTag={handleRemoveTag}
                  onClearSearchQuery={handleClearSearchQuery}
                />
              )}

              {/* Display hive cards if there are hives available */}
              {hives.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {hives.map((hive) => (
                    <div key={hive.hive_id} className="bg-gradient-to-b from-primary to-tertiary p-[1px] rounded-lg">
                      <HiveCard
                        key={hive.hive_id}
                        hive={hive}
                        tags={tags}
                        onCardClick={() => handleHiveClick(hive.title)}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-lg text-gray-700">
                  No hives match your search criteria.
                </p>
              )}

              {/* Pagination component to navigate between pages */}
              {totalPages > 1 && (
                <PaginationComponent
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage} // Pass setCurrentPage directly
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
