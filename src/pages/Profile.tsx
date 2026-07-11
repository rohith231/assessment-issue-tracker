import { useAuth } from '@/hooks/useAuth'
import { Card, CardContent, CardHeader } from '@/components/Card'
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { useState } from 'react'
import { getInitials, formatDate } from '@/lib/utils'

export function Profile() {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(user?.name || '')

  const getStats = () => {
    const projects = localStorage.getItem('app_projects')
    const projectList = projects ? JSON.parse(projects) : []
    let totalIssues = 0
    let resolvedIssues = 0

    projectList.forEach((proj: any) => {
      const issues = localStorage.getItem(`issues_${proj.slug}`)
      const issueList = issues ? JSON.parse(issues) : []
      totalIssues += issueList.length
      resolvedIssues += issueList.filter((issue: any) => issue.status === 'resolved').length
    })

    return {
      projects: projectList.length,
      totalIssues,
      resolvedIssues,
    }
  }

  const stats = getStats()

  const handleSave = () => {
    setIsEditing(false)
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-text-muted">Loading...</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-foreground mb-8">Profile Settings</h1>

      <Card className="mb-8">
        <CardHeader>
          <h2 className="text-xl font-bold text-foreground">Profile Information</h2>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-8">
            <div className="flex-shrink-0">
              <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center text-white text-3xl font-bold">
                {getInitials(user.name)}
              </div>
            </div>

            <div className="flex-1 space-y-6">
              {isEditing ? (
                <>
                  <Input
                    label="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <Button onClick={handleSave}>Save Changes</Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="label">Full Name</label>
                    <p className="text-foreground font-medium">{user.name}</p>
                  </div>
                  <div>
                    <label className="label">Email Address</label>
                    <p className="text-foreground font-medium">{user.email}</p>
                  </div>
                  <div>
                    <label className="label">Member Since</label>
                    <p className="text-foreground font-medium">
                      {user.createdAt ? formatDate(user.createdAt) : 'Recently joined'}
                    </p>
                  </div>
                  <div>
                    <label className="label">User ID</label>
                    <p className="text-foreground font-medium text-sm">{user.id}</p>
                  </div>
                  <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-xl font-bold text-foreground">Quick Stats</h2>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="card text-center p-4 rounded-lg bg-card-bg border border-border">
              <div className="text-2xl font-bold text-primary">{stats.projects}</div>
              <p className="text-secondary text-sm mt-1">Projects Created</p>
            </div>
            <div className="card text-center p-4 rounded-lg bg-card-bg border border-border">
              <div className="text-2xl font-bold text-primary">{stats.totalIssues}</div>
              <p className="text-secondary text-sm mt-1">Total Issues</p>
            </div>
            <div className="card text-center p-4 rounded-lg bg-card-bg border border-border">
              <div className="text-2xl font-bold text-primary">{stats.resolvedIssues}</div>
              <p className="text-secondary text-sm mt-1">Issues Resolved</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
