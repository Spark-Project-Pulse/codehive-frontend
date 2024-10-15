export interface ApiResponse<T> {
    errorMessage: string | null
    data?: T
  }