export interface ApiResponse<T> {
  errorMessage: string | null
  data?: T
}

// An error response type that can be used for extracting the API error thrown, and showing in toast, etc.
export interface ErrorResponse {
  message?: string
}
