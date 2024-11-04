export interface ApiResponse<T> {
  errorMessage: string | null
  data?: T
}

// A success response type that can be used for extracting the API success message, and showing in toast, etc.
export interface SuccessResponse {
  message: string
}

// An error response type that can be used for extracting the API error thrown, and showing in toast, etc.
export interface ErrorResponse {
  message?: string
}
