'use client'

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { apiClient } from './api-client'
import { useRouter } from 'next/navigation'

// Types
interface AuthUser {
  id: string
  email: string
  firstName: string
  lastName: string
  role: string
  departmentId?: string
  emailVerified?: boolean
}

interface LoginCredentials {
  email: string
  password: string
}

interface LoginResult {
  user: AuthUser
  tokens: {
    accessToken: string
    refreshToken: string
  }
}

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  error: string | null
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => Promise<void>
  register: (data: { email: string; password: string; firstName: string; lastName: string; role: string }) => Promise<void>
  isAuthenticated: boolean
  hasRole: (...roles: string[]) => boolean
  hasPermission: (permission: string) => boolean
  refreshUser: () => Promise<void>
}

// Initial context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Default permissions per role (matching backend RBAC)
const ROLE_PERMISSIONS: Record<string, string[]> = {
  student: ['workflow.read', 'assignment.submit', 'leave.submit', 'track.submit'],
  teacher: ['workflow.create', 'workflow.read', 'workflow.update', 'workflow.transition', 'attendance.open', 'attendance.close', 'attendance.mark', 'attendance.finalise', 'assignment.publish', 'assignment.open_submissions', 'assignment.evaluate', 'assignment.finalise', 'marks.submit', 'marks.review', 'leave.approve', 'leave.reject'],
  admin: ['workflow.create', 'workflow.read', 'workflow.update', 'workflow.transition', 'workflow.delete', 'workflow.lock', 'attendance.open', 'attendance.close', 'attendance.mark', 'attendance.finalise', 'attendance.lock', 'assignment.publish', 'assignment.open_submissions', 'assignment.evaluate', 'assignment.finalise', 'marks.submit', 'marks.review', 'marks.finalise', 'marks.lock', 'leave.submit', 'leave.approve', 'leave.reject', 'leave.emergency', 'track.submit', 'track.open_review', 'track.finalise', 'track.lock', 'admin.user_manage', 'admin.role_manage', 'admin.system_config', 'admin.audit_view'],
  hod: ['workflow.read', 'workflow.transition', 'attendance.finalise', 'attendance.lock', 'assignment.finalise', 'marks.review', 'marks.finalise', 'marks.lock', 'leave.approve', 'leave.reject', 'leave.emergency', 'track.finalise', 'track.lock', 'admin.user_manage', 'admin.audit_view'],
  guest_faculty: ['workflow.read', 'attendance.mark', 'assignment.evaluate'],
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Check for existing session on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (apiClient.isAuthenticated()) {
          // Try to fetch user profile
          const result = await apiClient.get('/auth/me')
          if (result.success && result.data) {
            // API returns user data directly in result.data (not result.data.user)
            const userData = result.data as any
            setUser({
              id: userData.id,
              email: userData.email,
              firstName: userData.firstName || userData.name?.split(' ')[0] || '',
              lastName: userData.lastName || userData.name?.split(' ').slice(1).join(' ') || '',
              role: userData.role,
              departmentId: userData.departmentId,
            })
          } else {
            // Token invalid, try refresh
            apiClient.clearTokens()
          }
        }
      } catch {
        apiClient.clearTokens()
      } finally {
        setLoading(false)
      }
    }
    initAuth()
  }, [])

  // Listen for forced logout events
  useEffect(() => {
    const handleForceLogout = () => {
      setUser(null)
      apiClient.clearTokens()
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
    }
    window.addEventListener('auth:logout', handleForceLogout)
    return () => window.removeEventListener('auth:logout', handleForceLogout)
  }, [])

  const login = useCallback(async (credentials: LoginCredentials) => {
    setError(null)
    setLoading(true)

    try {
      const result = await apiClient.post<LoginResult>('/auth/login', credentials, { skipAuth: true })
      
      if (!result.success) {
        setError(result.error || 'Login failed')
        setLoading(false)
        throw new Error(result.error)
      }

      const data = result.data
      if (!data?.tokens || !data?.user) {
        setError('Invalid response from server')
        setLoading(false)
        throw new Error('Invalid response')
      }

      // Store tokens
      apiClient.setTokens(data.tokens.accessToken, data.tokens.refreshToken)
      
      // Set user
      setUser(data.user)
      setError(null)
      setLoading(false)
    } catch (err) {
      if (!(err instanceof Error && err.message)) {
        setError('Network error. Please try again.')
      }
      setLoading(false)
      throw err
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('deptwp_refresh_token') : null
      if (refreshToken) {
        await apiClient.post('/auth/logout', { refreshToken })
      }
    } catch {
      // Ignore logout errors
    } finally {
      setUser(null)
      apiClient.clearTokens()
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
    }
  }, [])

  const register = useCallback(async (_data: { email: string; password: string; firstName: string; lastName: string; role: string }) => {
    // Registration requires admin, so this is typically not used by regular users
    throw new Error('Registration must be done by an administrator')
  }, [])

  const refreshUser = useCallback(async () => {
    try {
      const result = await apiClient.get('/auth/me')
      if (result.success && result.data) {
        const userData = result.data as any
        setUser({
          id: userData.id,
          email: userData.email,
          firstName: userData.firstName || userData.name?.split(' ')[0] || '',
          lastName: userData.lastName || userData.name?.split(' ').slice(1).join(' ') || '',
          role: userData.role,
          departmentId: userData.departmentId,
        })
      }
    } catch {
      // Silently fail
    }
  }, [])

  const hasRole = useCallback((...roles: string[]) => {
    if (!user) return false
    return roles.includes(user.role)
  }, [user])

  const hasPermission = useCallback((permission: string) => {
    if (!user) return false
    const permissions = ROLE_PERMISSIONS[user.role] || []
    return permissions.includes(permission)
  }, [user])

  const value: AuthContextType = {
    user,
    loading,
    error,
    login,
    logout,
    register,
    isAuthenticated: !!user,
    hasRole,
    hasPermission,
    refreshUser,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthContext
