export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  createdAt: Date
}

export interface Project {
  id: string
  name: string
  description: string
  slug: string
  ownerId: string
  owner: User
  members: ProjectMember[]
  createdAt: Date
  updatedAt: Date
}

export interface ProjectMember {
  id: string
  projectId: string
  userId: string
  user: User
  role: 'admin' | 'member'
  joinedAt: Date
}

export type IssueStatus = 'open' | 'in-progress' | 'resolved' | 'closed'
export type IssuePriority = 'low' | 'medium' | 'high' | 'critical'

export interface Issue {
  id: string
  projectId: string
  project?: Project
  title: string
  description: string
  status: IssueStatus
  priority: IssuePriority
  assigneeId?: string
  assignee?: User
  creatorId: string
  creator: User
  labels: Label[]
  comments: Comment[]
  createdAt: Date
  updatedAt: Date
}

export interface Label {
  id: string
  projectId: string
  name: string
  color: string
  description?: string
}

export interface Comment {
  id: string
  issueId: string
  userId: string
  user: User
  content: string
  createdAt: Date
  updatedAt: Date
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

export interface CreateProjectPayload {
  name: string
  description: string
  slug: string
}

export interface CreateIssuePayload {
  projectId: string
  title: string
  description: string
  priority: IssuePriority
  assigneeId?: string
  labels?: string[]
}

export interface UpdateIssuePayload {
  title?: string
  description?: string
  status?: IssueStatus
  priority?: IssuePriority
  assigneeId?: string | null
  labels?: string[]
}

export interface CreateCommentPayload {
  issueId: string
  content: string
}
