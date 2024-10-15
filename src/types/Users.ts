export interface User {
  user: string
  username: string
  pfp_url?: string
  reputation: number
}

export interface AuthUser {
  id: string
  user_metadata: {
    user_name: string
  }
  // Add any additional fields needed when getting auth user
}
