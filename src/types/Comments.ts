import { type UUID } from 'crypto'
import { type User } from './Users'
import { type UserBadge } from './Badges'

export interface Comment {
  comment_id: UUID
  answer: UUID
  response: string
  expert_info: User | null
  created_at: Date
  toxic?: boolean
  expert_badges?: UserBadge[]
}