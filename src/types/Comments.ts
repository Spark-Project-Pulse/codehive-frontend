import { type UUID } from 'crypto'
import { type User } from './Users'

export interface Comment {
  comment_id: UUID
  answer: UUID
  response: string
  expert_info: User | null
  created_at: Date
  toxic?: boolean
}