import { type UUID } from 'crypto'
import { type User } from './Users'

export interface Answer {
  answer_id: UUID
  response: string
  created_at: Date
  asker_id?: UUID
  expert_id?: UUID
  expert_info?: User
}