// Allows tags to work in QuestionForm

import { type UUID } from 'crypto'

export interface TagOption {
    value: UUID
    label: string
  }