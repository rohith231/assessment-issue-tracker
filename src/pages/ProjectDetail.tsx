import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Button } from '@/components/Button'
import { Card } from '@/components/Card'
import { Badge } from '@/components/Badge'
import { getStatusColor, getPriorityColor, formatRelativeTime } from '@/lib/utils'
import { Plus, ArrowLeft, Search } from 'lucide-react'

interface Issue {
  id: string
  title: string
  description?: string
  status: string
  priority: string
  createdAt: string
  assignee?: string
}

const getStoredIssues = (projectSlug: string): Issue[] => {
  const key = `issues_${projectSlug}`
  const stored = localStorage.getItem(key)
  return stored ? JSON.parse(stored) : []
}

const saveIssues = (projectSlug: string, issues: Issue[]) => {
  const key = `issues_${projectSlug}`
  localStorage.setItem(key, JSON.stringify(issues))
}

const MOCK_ISSUES: Issue[] = [
  {
    id: '1',
    title: 'Fix login page responsive design',
    status: 'in-progress',
    priority: 'high',
    createdAt: new Date().toISOString(),
    assignee: 'John Doe',
  },
  {
    id: '2',
    title: 'Add dark mode support',
    status: 'open',
    priority: 'medium',
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Optimize database queries',
    status: 'resolved',
    priority: 'critical',
    createdAt: new Date().toISOString(),
    assignee: 'Jane Smith',
  },
]

export function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>()
  const [issues, setIssues] = useState<Issue[]>(() => {
    const stored = getStoredIssues(slug || '')
    return stored.length > 0 ? stored : MOCK_ISSUES
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showForm, setShowForm] = useState(false)
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null)
  const [formData, setFormData] = useState({ title: '', description: '', priority: 'medium' })

  const filteredIssues = issues.filter((issue) => {
    const matchesSearch = issue.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || issue.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleCreateIssue = () => {
    if (!formData.title.trim()) {
      alert('Please enter an issue title')
      return
    }

    const newIssue: Issue = {
      id: 'issue_' + Date.now(),
      title: formData.title,
      description: formData.description,
      status: 'open',
      priority: formData.priority,
      createdAt: new Date().toISOString(),
    }

    const updated = [...issues, newIssue]
    setIssues(updated)
    saveIssues(slug || '', updated)
    setFormData({ title: '', description: '', priority: 'medium' })
    setShowForm(false)
  }

  const handleStatusChange = (issueId: string, newStatus: string) => {
    const updated = issues.map(issue =>
      issue.id === issueId ? { ...issue, status: newStatus } : issue
    )
    setIssues(updated)
    saveIssues(slug || '', updated)
    if (selectedIssue?.id === issueId) {
      setSelectedIssue({ ...selectedIssue, status: newStatus })
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/projects" className="flex items-center gap-2 text-primary hover:underline mb-6">
        <ArrowLeft size={20} />
        Back to Projects
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground capitalize">{slug?.replace('-', ' ')}</h1>
        <p className="text-secondary mt-2">Track and manage project issues</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="text-center">
          <div className="text-3xl font-bold text-primary">{issues.length}</div>
          <div className="text-sm text-secondary mt-1">Total Issues</div>
        </Card>
        <Card className="text-center">
          <div className="text-3xl font-bold text-yellow-500">
            {issues.filter((i) => i.status === 'in-progress').length}
          </div>
          <div className="text-sm text-secondary mt-1">In Progress</div>
        </Card>
        <Card className="text-center">
          <div className="text-3xl font-bold text-green-500">
            {issues.filter((i) => i.status === 'resolved').length}
          </div>
          <div className="text-sm text-secondary mt-1">Resolved</div>
        </Card>
      </div>

      <div className="mb-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" size={20} />
            <input
              type="text"
              placeholder="Search issues..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input"
          >
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
          <Button 
            onClick={() => setShowForm(!showForm)}
            className="flex items-center justify-center gap-2"
          >
            <Plus size={20} />
            <span className="hidden sm:inline">New Issue</span>
          </Button>
        </div>
      </div>

      {showForm && (
        <Card className="mb-6 p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Create New Issue</h3>
          <div className="space-y-4">
            <div>
              <label className="label">Title</label>
              <input
                type="text"
                placeholder="Issue title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="input w-full"
              />
            </div>
            <div>
              <label className="label">Description</label>
              <textarea
                placeholder="Issue description (optional)"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="input w-full min-h-24"
              />
            </div>
            <div>
              <label className="label">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="input w-full"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleCreateIssue}>Create Issue</Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </div>
        </Card>
      )}

      {selectedIssue && (
        <Card className="mb-8 p-6 border-2 border-primary">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-foreground">{selectedIssue.title}</h3>
            <button
              onClick={() => setSelectedIssue(null)}
              className="text-2xl text-secondary hover:text-foreground"
            >
              ×
            </button>
          </div>
          {selectedIssue.description && (
            <div className="mb-6 p-4 bg-background rounded border border-border">
              <p className="text-foreground">{selectedIssue.description}</p>
            </div>
          )}
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="label">Status</label>
              <select
                value={selectedIssue.status}
                onChange={(e) => handleStatusChange(selectedIssue.id, e.target.value)}
                className="input w-full"
              >
                <option value="open">Open</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>
            <div>
              <label className="label">Priority</label>
              <p className="text-foreground font-medium capitalize">{selectedIssue.priority}</p>
            </div>
            <div>
              <label className="label">Created</label>
              <p className="text-foreground font-medium">{formatRelativeTime(selectedIssue.createdAt)}</p>
            </div>
          </div>
          <Button variant="outline" onClick={() => setSelectedIssue(null)}>Close Details</Button>
        </Card>
      )}

      {filteredIssues.length === 0 ? (
        <Card className="text-center py-12">
          <p className="text-secondary">No issues found</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredIssues.map((issue) => (
            <Card
              key={issue.id}
              className="hover:shadow-md transition-all cursor-pointer"
              onClick={() => setSelectedIssue(issue)}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-foreground truncate hover:underline">
                    {issue.title}
                  </h3>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <Badge variant={getStatusColor(issue.status) as any}>
                      {issue.status}
                    </Badge>
                    <Badge variant={getPriorityColor(issue.priority) as any}>
                      {issue.priority}
                    </Badge>
                    {issue.assignee && (
                      <Badge variant="secondary">{issue.assignee}</Badge>
                    )}
                  </div>
                </div>
                <div className="text-sm text-text-muted whitespace-nowrap">
                  {formatRelativeTime(issue.createdAt)}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
