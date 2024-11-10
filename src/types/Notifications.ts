import { type UUID } from 'crypto'
import { type User } from '@/types/Users'
import { type Question } from '@/types/Questions'
import { type Answer } from '@/types/Answers'
import { type Comment } from '@/types/Comments'

export interface Notification {
  notification_id: UUID
  recipient: UUID
  notification_type: NotificationType
  message: string
  read: boolean
  created_at: Date
  recipient_info: User | null
  question_info: Question | null
  answer_info: Answer | null
  comment_info: Comment | null
  actor_info : User | null
  question: UUID | null
  answer: UUID | null
  comment: UUID | null
  actor: UUID | null
}

type NotificationType =
  | "question_answered"
  | "answer_commented"
  | "question_upvoted"
  | "answer_accepted"
  | "mention"