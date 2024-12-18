import { type UUID } from 'crypto'
import { type User } from '@/types/Users'

export interface Project {
  project_id: UUID
  public: boolean
  title: string
  description: string
  created_at: Date
  owner?: UUID
  owner_info?: User
  repo_full_name?: string
}

export type ProjectOption = {
  value: string;
  label: string;
};

export interface AddProject {
  project_id: UUID
}

export interface Repo {
  id: number;
  node_id: string;
  name: string;
  full_name: string
  private: boolean
  // Add more fields as necessary (see docs for details https://docs.github.com/en/rest/repos/repos?apiVersion=2022-11-28#list-repositories-for-a-user)
}

export interface RepoContentResponse {
  repoContent: RepoContent[];
  currentPath: string;
}

export interface RepoContent {
  name: string
  path: string
  sha: string
  size: number
  url: string
  html_url: string
  git_url: string
  download_url: string | null
  type: 'dir' | 'file' | 'symlink' | 'submodule'
  // Include content and encoding when type is 'file'
  content?: string
  encoding?: string
  // Same as above (see docs for details https://docs.github.com/en/rest/repos/contents?apiVersion=2022-11-28#get-repository-content)
}

export interface Suggestion {
  line_number: string
  suggestion: string
}

export interface SidebarProject {
  id: string
  title: string
  url: string
}