import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/Button'
import { Card } from '@/components/Card'
import { Plus, ArrowRight, Folder } from 'lucide-react'

interface Project {
  id: string
  name: string
  description: string
  slug: string
}

const MOCK_PROJECTS: Project[] = [
  {
    id: '1',
    name: 'Website Redesign',
    description: 'Complete redesign of company website',
    slug: 'website-redesign',
  },
  {
    id: '2',
    name: 'Mobile App',
    description: 'New mobile application for iOS and Android',
    slug: 'mobile-app',
  },
  {
    id: '3',
    name: 'API Integration',
    description: 'Integrate third-party APIs',
    slug: 'api-integration',
  },
]

const getStoredProjects = (): Project[] => {
  const stored = localStorage.getItem('app_projects')
  return stored ? JSON.parse(stored) : MOCK_PROJECTS
}

const saveProjects = (projects: Project[]) => {
  localStorage.setItem('app_projects', JSON.stringify(projects))
}

export function Projects() {
  const [projects, setProjects] = useState<Project[]>(getStoredProjects)
  const [showNewProject, setShowNewProject] = useState(false)
  const [projectName, setProjectName] = useState('')
  const [projectDesc, setProjectDesc] = useState('')
  const navigate = useNavigate()

  const handleCreateProject = () => {
    if (!projectName.trim()) {
      alert('Please enter a project name')
      return
    }

    const slug = projectName.toLowerCase().replace(/\s+/g, '-')
    const newProject: Project = {
      id: 'proj_' + Date.now(),
      name: projectName,
      description: projectDesc || 'No description provided',
      slug,
    }

    const updated = [...projects, newProject]
    setProjects(updated)
    saveProjects(updated)
    setShowNewProject(false)
    setProjectName('')
    setProjectDesc('')
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Projects</h1>
          <p className="text-secondary mt-2">Manage all your projects and track issues</p>
        </div>
        <Button
          onClick={() => setShowNewProject(true)}
          className="flex items-center gap-2"
        >
          <Plus size={20} />
          New Project
        </Button>
      </div>

      {showNewProject && (
        <Card className="mb-8 p-6">
          <div className="space-y-4">
            <h3 className="font-bold text-foreground mb-4">Create New Project</h3>
            <div>
              <label className="label">Project Name</label>
              <input
                type="text"
                placeholder="e.g., Website Redesign"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="input w-full"
                autoFocus
              />
            </div>
            <div>
              <label className="label">Description (optional)</label>
              <textarea
                placeholder="Describe your project..."
                value={projectDesc}
                onChange={(e) => setProjectDesc(e.target.value)}
                className="input w-full min-h-20"
              />
            </div>
            <div className="flex gap-2 pt-2">
              <Button onClick={handleCreateProject}>Create Project</Button>
              <Button variant="outline" onClick={() => {
                setShowNewProject(false)
                setProjectName('')
                setProjectDesc('')
              }}>
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      )}

      {projects.length === 0 ? (
        <Card className="text-center py-12">
          <Folder size={48} className="mx-auto text-secondary mb-4" />
          <p className="text-secondary mb-4">No projects yet</p>
          <Button onClick={() => setShowNewProject(true)}>Create your first project</Button>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card
              key={project.id}
              className="hover:shadow-lg transition-all cursor-pointer group"
              onClick={() => navigate(`/projects/${project.slug}`)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Folder className="w-6 h-6 text-primary" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">{project.name}</h3>
              <p className="text-secondary text-sm mb-4">{project.description}</p>
              <div className="flex items-center gap-2 text-primary group-hover:gap-3 transition-all">
                <span className="text-sm font-medium">View Project</span>
                <ArrowRight size={16} />
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
