import { type UUID } from 'crypto'
import { type ReactNode } from 'react'
import { type User } from './Users'

export interface Community {
  community_id: UUID
  title: string
  description: string
  member_count: number
  created_at: Date
  avatar_url?: string
  tags?: string[]
}

export interface CommunityMember {
  community_id: UUID
  user_id: UUID
  community_info: Community
  user_info: User
  community_reputation: number
  contributions: number
}

export type CommunityOption = {
  value: string
  label: string
}

export type SidebarCommunity = {
  name: string
  url: string
  icon: () => ReactNode
}
