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

export interface Repo {
  id: number;
  node_id: string;
  name: string;
  full_name: string;
  private: boolean;
  // Add more fields as necessary (see docs for details https://docs.github.com/en/rest/repos/repos?apiVersion=2022-11-28#list-repositories-for-a-user)
}