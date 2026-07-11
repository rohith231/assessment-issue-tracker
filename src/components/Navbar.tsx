import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useTheme } from '@/context/ThemeContext'
import { Button } from './Button'
import { LogOut, Moon, Sun, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { getInitials } from '@/lib/utils'

export function Navbar() {
  const { user, logout, isAuthenticated } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-card-bg backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">IH</span>
            </div>
            <span className="font-bold text-lg hidden sm:inline">IssueHub</span>
          </Link>

          <div className="flex items-center gap-4">
            {isAuthenticated && (
              <>
                <Link
                  to="/projects"
                  className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                >
                  Projects
                </Link>
                <span className="text-secondary">•</span>
                <Link
                  to="/profile"
                  className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                >
                  Profile
                </Link>
              </>
            )}

            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-border transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <Moon size={20} />
              ) : (
                <Sun size={20} />
              )}
            </button>

            {isAuthenticated ? (
              <div className="hidden sm:flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {user && getInitials(user.name)}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center gap-2"
                >
                  <LogOut size={16} />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/login')}
                >
                  Login
                </Button>
                <Button
                  size="sm"
                  onClick={() => navigate('/register')}
                  className="hidden sm:inline-block"
                >
                  Sign Up
                </Button>
              </div>
            )}

            <button
              className="sm:hidden p-2 rounded-lg hover:bg-border transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && isAuthenticated && (
          <div className="sm:hidden pb-4 border-t border-border">
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2"
            >
              <LogOut size={16} />
              Logout
            </Button>
          </div>
        )}
      </div>
    </nav>
  )
}
