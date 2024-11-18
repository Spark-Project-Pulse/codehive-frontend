// src/lib/github.ts
import { type ApiResponse } from '@/types/Api'
import { type RepoContent, type RepoContentResponse } from '@/types/Projects'

export const fetchRepoContents = async (
  path: string,
  repoFullName: string
): Promise<ApiResponse<RepoContentResponse>> => {
  try {
    const url = `https://api.github.com/repos/${repoFullName}/contents/${path}`
    
    const response = await fetch(url)
    
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`)
    }

    const repoData = await response.json() as RepoContent | RepoContent[]

    let data: RepoContentResponse
    if (Array.isArray(repoData)) {
      data = { repoContent: repoData, currentPath: path }
    } else {
      data = { repoContent: [repoData], currentPath: path }
    }

    return { errorMessage: null, data: data }
  } catch (error: unknown) {
    return { errorMessage: `Error fetching repo contents: ${error?.toString()}`, data: null }
  }
}