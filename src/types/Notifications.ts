import { type UUID } from 'crypto'
import { type User } from '@/types/Users'
import { type Question } from '@/types/Questions'
import { type Answer } from '@/types/Answers'
import { type Comment } from '@/types/Comments'
import { type Hive } from '@/types/Hives'

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
  hive_info: Hive | null
  hive_title: string | null
  actor_info : User | null
  question: UUID | null
  answer: UUID | null
  comment: UUID | null
  hive: UUID | null
  actor: UUID | null
}

export interface NotificatonsInfo {
  count: number
}

type NotificationType =
  | "question_answered"
  | "answer_commented"
  | "question_upvoted"
  | "answer_accepted"
  | "mention"
  | "hive_accepted"
  | "hive_rejected"