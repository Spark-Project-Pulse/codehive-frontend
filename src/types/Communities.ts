import { type UUID } from 'crypto'
import { LucideIcon } from 'lucide-react'
import { ReactNode } from 'react'

export interface Community {
  community_id: UUID
  title: string
  description: string
  member_count: number
  created_at: Date
  avatar_url?: string
  tags?: string[]
}

export interface CommunityMembers {
    community_id: UUID
    user_id: UUID
    community_info: Community
}

export type CommunityOption = {
  value: string
  label: string
}

export type SidebarCommunity = {
  name: string;
  url: string;
  icon: () => ReactNode;
}
