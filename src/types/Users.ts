export interface User {
  user: string
  username: string
  reputation: number
  pfp_url?: string
  profile_image?: {
    base64String: string
    fileType: string
  }
}

export interface AuthUser {
  id: string
  user_metadata: {
    user_name: string
  }
  // Add any additional fields needed when getting auth user
}
