import { type UUID } from 'crypto'
import { type User } from './Users'

export interface Comment {
  comment_id: UUID
  answer: UUID
  response: string
  expert_id: UUID
  expert_info: User
  created_at: Date
}