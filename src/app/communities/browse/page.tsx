'use client'

import { getAllCommunities } from '@/api/communities'
import { getAllTags } from '@/api/tags'
import CommunityCard from '@/components/pages/communities/browse/CommunityCard'
import { LoadingSpinner } from '@/components/ui/loading'
import { SearchAndTagComponent } from '@/components/universal/search/SearchAndTagComponent'
import { useDebounce } from '@/hooks/useDebounce'
import { Community } from '@/types/Communities'
import { TagOption } from '@/types/Tags'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function BrowseCommunities() {
  const [communities, setCommunities] = useState<Community[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [hasError, setHasError] = useState<boolean>(false)
  const [tags, setTags] = useState<TagOption[]>([])
  const [selectedTags, setSelectedTags] = useState<TagOption[]>([])

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [pageSize] = useState<number>(30)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [totalCommunities, setTotalCommunities] = useState<number>(0)

  const [searchQuery, setSearchQuery] = useState<string>('')
  const debouncedSearchQuery = useDebounce(searchQuery, 500)

  const router = useRouter()

  // Fetch Communities with Pagination, Filtering, and Search
  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        setIsLoading(true)
        const selectedTagValues = selectedTags.map((tag) => tag.value)

        const response = await getAllCommunities(
          currentPage,
          pageSize,
          selectedTagValues,
          debouncedSearchQuery
        )

        if (response.errorMessage) {
          throw new Error(response.errorMessage)
        }

        if (response.data) {
          setCommunities(response.data.communities)
          setTotalCommunities(response.data.totalCommunities)
          setTotalPages(Math.ceil(response.data.totalCommunities / pageSize))
        } else {
          throw new Error('No data received')
        }
      } catch (error) {
        console.error('Error fetching communities:', error)
        setHasError(true)
      } finally {
        setIsLoading(false)
      }
    }

    void fetchCommunities()
  }, [currentPage, selectedTags, debouncedSearchQuery])

  const handleCommunityClick = (communityId: string) => {
    router.push(`/communities/${communityId}`)
  }

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

  return (
    <div className="max-w-7xl p-6">
      <h1 className="text-center font-subHeading text-h2 font-bold text-secondary-foreground">
        Communities
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
        <div className="md:w-3/4">
          {isLoading && (
            <div className="my-10 flex flex-col items-center justify-center">
              <LoadingSpinner />
              <p className="mt-4 text-muted">Loading communities...</p>
            </div>
          )}

          {hasError && (
            <div className="my-10 text-center text-destructive">
              <p>
                Something went wrong while fetching the communities. Please try
                again later.
              </p>
            </div>
          )}

          {!isLoading && !hasError && (
            <>
              {communities.map((community) => (
                <CommunityCard community={community} />
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
