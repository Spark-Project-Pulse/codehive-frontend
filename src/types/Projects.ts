import { type UUID } from 'crypto'

export interface Project {
  project_id: UUID
  owner?: UUID
  public: boolean
  title: string
  description: string
  created_at: Date
}

export interface AddProject {
  project_id: UUID
}