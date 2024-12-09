import { type UUID } from 'crypto'
import { type User } from './Users'

export interface Hive {
  hive_id: UUID
  title: string
  description: string
  member_count: number
  approved: boolean
  created_at: Date
  owner_id?: UUID
  owner_info?: User
  avatar_url?: string
  tags?: string[]
  avatar_image_nsfw?: boolean
}

export interface HiveMember {
  hive_id: UUID
  user_id: UUID
  hive_info: Hive
  user_info: User
  hive_reputation: number
  contributions: number
}

export type HiveOption = {
  value: string
  label: string
}

export type SidebarHive = {
  title: string
  url: string
  avatar_url: string
}
