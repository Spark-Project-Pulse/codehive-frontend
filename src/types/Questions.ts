import { type UUID } from 'crypto'
import { type User } from '@/types/Users'
import { type Project } from '@/types/Projects'
import { type Hive } from './Hives'

export interface Question {
  question_id: UUID
  title: string
  description: string
  created_at: Date
  asker?: UUID
  asker_info?: User,
  tags?: string[],
  related_project?: UUID
  related_project_info?: Project
  related_hive_id?: UUID
  related_hive_info?: Hive
  code_context: string;
  code_context_full_pathname: string;
  code_context_line_number: number;
  toxic?: boolean
  is_answered: boolean
}

export interface ListQuestionsRepsonse {
  questions: Question[]
  totalQuestions: number
  totalPages: number
  currentPage: number
}