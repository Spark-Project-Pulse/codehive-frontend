import { type UUID } from 'crypto'

export interface Badge {
  badge_id: number
  name: string
  description: string
  reputation_threshold: number | null
  is_global: boolean
  created_at: Date
  associated_tag?: UUID | null
  image_url: string
}

export interface UserBadge {
  id: number
  badge_info: Badge
  earned_at: Date
  user: UUID
}

export interface UserBadgeProgress {
  id: number
  badge_info: Badge
  progress_value: number
  progress_target: number
  last_updated: Date
  user: UUID
}