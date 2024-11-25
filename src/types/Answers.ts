import { type UUID } from 'crypto'
import { type User } from './Users'

export interface Answer {
  answer_id: UUID
  expert: UUID
  expert_info?: User
  response: string
  score: number
  created_at: Date
  asker_id?: UUID
  curr_user_upvoted?: boolean
  curr_user_downvoted?: boolean
  toxic?: boolean
}