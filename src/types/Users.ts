export interface User {
  user: string
  username: string
  reputation: number
  pfp_url?: string
}

export interface AuthUser {
  id: string
  user_metadata: {
    user_name: string
  }
  // Add any additional fields needed when getting auth user
}
