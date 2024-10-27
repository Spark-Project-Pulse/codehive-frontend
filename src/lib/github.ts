import { type ApiResponse } from "@/types/Api"
import { type RepoContent, type RepoContentResponse } from "@/types/Projects"

export const fetchRepoContents = async (path: string, repoFullName: string): Promise<ApiResponse<RepoContentResponse>> => {
  // setIsLoading(true)
  try {
    const response = await fetch(
      `https://api.github.com/repos/${repoFullName}/contents/${path}`
    )
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }

    const repoData = (await response.json()) as RepoContent[]
    const data = { repoContent: repoData, currentPath: path }
    return { errorMessage: null, data: data }
  } catch (error) {
    console.error('Error fetching contents:', error)
    return { errorMessage: 'Error fetching repo contents' }
  } finally {
    // setIsLoading(false)
  }
}