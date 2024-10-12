import { type UUID } from 'crypto'

export interface Answer {
  answer_id: UUID
  asker_id?: UUID
  expert_id?: UUID
  response: string
  created_at: Date
}