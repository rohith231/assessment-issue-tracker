import React, { createContext, useState, useCallback, useEffect } from 'react'
import { User } from '@/types'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  clearError: () => void
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

const generateToken = () => {
  return 'token_' + Math.random().toString(36).substr(2, 9)
}

const getStoredUsers = () => {
  const users = localStorage.getItem('app_users')
  return users ? JSON.parse(users) : []
}

const saveUsers = (users: any[]) => {
  localStorage.setItem('app_users', JSON.stringify(users))
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('auth_token')
      if (token) {
        try {
          const users = getStoredUsers()
          const foundUser = users.find((u: any) => u.token === token)
          if (foundUser) {
            setUser({
              id: foundUser.id,
              name: foundUser.name,
              email: foundUser.email,
              createdAt: foundUser.createdAt ? new Date(foundUser.createdAt) : new Date(),
            })
          } else {
            localStorage.removeItem('auth_token')
            setUser(null)
          }
        } catch {
          localStorage.removeItem('auth_token')
          setUser(null)
        }
      }
      setIsLoading(false)
    }

    initAuth()
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    setError(null)
    setIsLoading(true)
    try {
      const users = getStoredUsers()
      const foundUser = users.find((u: any) => u.email === email && u.password === password)
      
      if (!foundUser) {
        throw new Error('Invalid email or password')
      }

      localStorage.setItem('auth_token', foundUser.token)
      setUser({
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        createdAt: foundUser.createdAt ? new Date(foundUser.createdAt) : new Date(),
      })
    } catch (err: any) {
      const message = err.message || 'Login failed'
      setError(message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      setError(null)
      setIsLoading(true)
      try {
        const users = getStoredUsers()
        
        const emailExists = users.some((u: any) => u.email === email)
        if (emailExists) {
          throw new Error('Email already registered')
        }

        const token = generateToken()
        const createdAt = new Date().toISOString()
        const newUser = {
          id: 'user_' + Date.now(),
          name,
          email,
          password,
          token,
          createdAt,
        }

        users.push(newUser)
        saveUsers(users)

        localStorage.setItem('auth_token', token)
        setUser({
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          createdAt: new Date(createdAt),
        })
      } catch (err: any) {
        const message = err.message || 'Registration failed'
        setError(message)
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    []
  )

  const logout = useCallback(() => {
    localStorage.removeItem('auth_token')
    setUser(null)
    setError(null)
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    register,
    logout,
    clearError,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
