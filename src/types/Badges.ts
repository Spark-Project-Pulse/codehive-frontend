import { type UUID } from 'crypto'

export interface Badge {
  badge_id: number
  name: string
  description: string
  image_url: string
}

export interface BadgeTier {
  tier_level: number;
  name: string;
  description: string;
  image_url: string;
  reputation_threshold: number;
}

export interface UserBadge {
  id: number
  badge: number;
  badge_info: Badge
  badge_tier: number | null;
  badge_tier_info: BadgeTier | null;
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
  badge_tier_info: BadgeTier | null;
}