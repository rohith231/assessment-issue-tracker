import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/Button'
import { ArrowRight, Zap, Users, BarChart3 } from 'lucide-react'

export function Home() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-4">
            Track Issues
            <span className="text-primary"> Effortlessly</span>
          </h1>
          <p className="text-xl text-secondary max-w-2xl mx-auto mb-8">
            Collaborate with your team, manage projects, and track issues in real-time with IssueHub.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() =>
                isAuthenticated ? navigate('/projects') : navigate('/register')
              }
              className="flex items-center justify-center gap-2"
            >
              Get Started
              <ArrowRight size={20} />
            </Button>
            {!isAuthenticated && (
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate('/login')}
              >
                Sign In
              </Button>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="card text-center">
            <Zap className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Fast & Efficient</h3>
            <p className="text-secondary">
              Lightning-fast issue tracking with real-time updates and instant notifications.
            </p>
          </div>
          <div className="card text-center">
            <Users className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Team Collaboration</h3>
            <p className="text-secondary">
              Work together seamlessly with team members across multiple projects.
            </p>
          </div>
          <div className="card text-center">
            <BarChart3 className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Insights & Analytics</h3>
            <p className="text-secondary">
              Get detailed insights into your project progress and team productivity.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
