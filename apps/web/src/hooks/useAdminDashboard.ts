'use client'

import { useState, useEffect, useCallback } from 'react'
import { apiClient } from '@/lib/api-client'

// ===================== Types =====================

export interface AdminUser {
  id: string
  name: string
  firstName: string
  lastName: string
  email: string
  role: string
  avatar: string | null
}

export interface AdminStats {
  totalStudents: number
  totalTeachers: number
  atRiskStudents: number
  notEligibleStudents: number
  delayedTasks: number
  pendingApprovals: number
  marksStatus: { locked: number; total: number }
}

export interface AdminDashboardData {
  user: AdminUser | null
  stats: AdminStats | null
  students: any[]
  faculty: any[]
  workflows: any[]
  tasks: any[]
  complaints: any[]
  announcements: any[]
  loading: boolean
  error: string | null
  refetch: () => void
}

// ===================== Hook =====================

export function useAdminDashboard(): AdminDashboardData {
  const [user, setUser] = useState<AdminUser | null>(null)
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [students, setStudents] = useState<any[]>([])
  const [faculty, setFaculty] = useState<any[]>([])
  const [workflows, setWorkflows] = useState<any[]>([])
  const [tasks, setTasks] = useState<any[]>([])
  const [complaints, setComplaints] = useState<any[]>([])
  const [announcements, setAnnouncements] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const results = await Promise.allSettled([
        apiClient.get('/auth/me'),
        apiClient.get('/dashboard/stats'),
        apiClient.get('/users', { params: { role: 'student', isActive: 'true' } }),
        apiClient.get('/users', { params: { role: 'teacher', isActive: 'true' } }),
        apiClient.get('/workflows'),
        apiClient.get('/tasks'),
      ])

      const userResult = results[0]
      if (userResult.status === 'fulfilled' && userResult.value.success) {
        const u = userResult.value.data as any
        setUser({
          id: u.id,
          name: `${u.first_name || u.firstName || ''} ${u.last_name || u.lastName || ''}`,
          firstName: u.first_name || u.firstName || '',
          lastName: u.last_name || u.lastName || '',
          email: u.email || '',
          role: u.role || 'admin',
          avatar: u.avatar || null,
        })
      }

      const statsResult = results[1]
      if (statsResult.status === 'fulfilled' && statsResult.value.success) {
        setStats(statsResult.value.data as AdminStats)
      }

      const studentsResult = results[2]
      if (studentsResult.status === 'fulfilled' && studentsResult.value.success) {
        setStudents((studentsResult.value.data || []) as any[])
      }

      const facultyResult = results[3]
      if (facultyResult.status === 'fulfilled' && facultyResult.value.success) {
        setFaculty((facultyResult.value.data || []) as any[])
      }

      const workflowsResult = results[4]
      if (workflowsResult.status === 'fulfilled' && workflowsResult.value.success) {
        setWorkflows((workflowsResult.value.data || []) as any[])
      }

      const tasksResult = results[5]
      if (tasksResult.status === 'fulfilled' && tasksResult.value.success) {
        setTasks((tasksResult.value.data || []) as any[])
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return {
    user,
    stats,
    students,
    faculty,
    workflows,
    tasks,
    complaints: [],
    announcements: [],
    loading,
    error,
    refetch: fetchData,
  }
}

export default useAdminDashboard
