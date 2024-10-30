'use client'

import { getAllCommunities } from '@/api/communities'
import { getAllTags } from '@/api/tags'
import CommunityCard from '@/components/pages/communities/browse/CommunityCard'
import { LoadingSpinner } from '@/components/ui/loading'
import { ActiveFilters } from '@/components/universal/search/ActiveFilters'
import { PaginationComponent } from '@/components/universal/search/PaginationComponent'
import { SearchAndTagComponent } from '@/components/universal/search/SearchAndTagComponent'
import { useDebounce } from '@/hooks/useDebounce'
import { type Community } from '@/types/Communities'
import { type TagOption } from '@/types/Tags'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

// Main component for browsing communities
export default function BrowseCommunities() {
  // State for communities fetched from the API
  const [communities, setCommunities] = useState<Community[]>([])
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
  const [pageSize] = useState<number>(30) // Number of communities per page
  const [totalPages, setTotalPages] = useState<number>(1) // Total number of pages available
  const [totalCommunities, setTotalCommunities] = useState<number>(0) // Total number of communities fetched

  // State for the search query and debouncing to limit API calls
  const [searchQuery, setSearchQuery] = useState<string>('')
  const debouncedSearchQuery = useDebounce(searchQuery, 500)

  const router = useRouter()

  // useEffect to fetch communities with pagination, filtering, and search capabilities
  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        setIsLoading(true) // Start loading
        const selectedTagValues = selectedTags.map((tag) => tag.value) // Extract tag values

        // Fetch communities with current page, selected tags, and search query
        const response = await getAllCommunities(
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
          setCommunities(response.data.communities)
          setTotalCommunities(response.data.totalCommunities)
          setTotalPages(Math.ceil(response.data.totalCommunities / pageSize))
        } else {
          throw new Error('No data received') // Handle case with no data
        }
      } catch (error) {
        console.error('Error fetching communities:', error) // Log error
        setHasError(true) // Set error state
      } finally {
        setIsLoading(false) // Stop loading
      }
    }

    void fetchCommunities()
  }, [currentPage, pageSize, selectedTags, debouncedSearchQuery])

  // Handle click on a community card to navigate to the community details page
  const handleCommunityClick = (community_title: string) => {
    router.push(`/communities/${community_title}`)
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
    <div className="max-w-7xl p-6">
      {/* Main title for the communities page */}
      <h1 className="text-center font-subHeading text-h2 font-bold text-secondary-foreground">
        Communities
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
        />
        <div className="md:w-3/4">
          {/* Display loading spinner while fetching communities */}
          {isLoading && (
            <div className="my-10 flex flex-col items-center justify-center">
              <LoadingSpinner />
              <p className="mt-4 text-muted">Loading communities...</p>
            </div>
          )}

          {/* Display error message if there was an issue fetching communities */}
          {hasError && (
            <div className="my-10 text-center text-destructive">
              <p>
                Something went wrong while fetching the communities. Please try
                again later.
              </p>
            </div>
          )}

          {/* Display communities if loading is complete and no error occurred */}
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

              {/* Display community cards if there are communities available */}
              {communities !== undefined &&
              communities !== null &&
              communities.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {communities.map((community) => (
                    <CommunityCard
                        key={community.community_id}
                      community={community}
                      tags={tags}
                      onCardClick={() =>
                        handleCommunityClick(community.title)
                      }
                    />
                  ))}
                </div>
              ) : (
                <p className="text-center text-lg text-gray-700">
                  No communities match your search criteria.
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
