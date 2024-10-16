import { type UUID } from 'crypto'

export interface Comment {
  comment_id: UUID
  answer_id: UUID
  expert_id?: UUID
  response: string
  created_at: Date
}