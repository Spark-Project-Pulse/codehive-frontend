// Allows tags to work in QuestionForm

import { type UUID } from 'crypto'

export interface TagOption {
    value: string
    label: string
  }

export type Tag = {
  tag_id: string
  name: string
}
  