import { type UUID } from 'crypto'

export interface Community {
  community_id: UUID
  name: string
  description: string
  member_count: number
  created_at: Date
  avatar_url?: string
  tags?: string[]
}

export interface CommunityMembers {
    community_id: UUID
    user_id: UUID
}