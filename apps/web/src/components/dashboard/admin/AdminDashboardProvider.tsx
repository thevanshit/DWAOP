'use client'

import { createContext, useContext, ReactNode } from 'react'
import { useAdminDashboard } from '@/hooks/useAdminDashboard'
import * as DEMO from './data'

export interface AdminDashboardContextType {
  overviewStats: typeof DEMO.OVERVIEW_STATS
  quickActions: typeof DEMO.QUICK_ACTIONS
  workflows: typeof DEMO.WORKFLOWS
  columns: typeof DEMO.COLUMNS
  students: typeof DEMO.STUDENT_DATA
  faculty: typeof DEMO.FACULTY
  requests: typeof DEMO.REQUESTS
  coordinationTasks: typeof DEMO.COORDINATION_TASKS
  complaints: typeof DEMO.COMPLAINTS
  announcements: typeof DEMO.ANNOUNCEMENTS
  user: { name: string; role: string; avatar: string } | null
  loading: boolean
  error: string | null
  refetch: () => void
}

const AdminDashboardContext = createContext<AdminDashboardContextType | null>(null)

export function AdminDashboardProvider({ children }: { children: ReactNode }) {
  const api = useAdminDashboard()

  // Transform real students API data into the view shape (with demo defaults for display fields)
  const students = api.students.length > 0
    ? api.students.map((s: any, i: number) => ({
        id: s.id || String(i + 1),
        name: `${s.first_name || s.firstName || ''} ${s.last_name || s.lastName || ''}`,
        roll: s.roll_number || `CS-${String(i + 1).padStart(3, '0')}`,
        email: s.email || '',
        phone: s.phone || '',
        batch: s.batch_name || '',
        attendance: 75 + Math.floor(Math.random() * 20),
        cgpa: 6 + Math.random() * 3,
        status: 'active',
        pending: 0,
        eligible: true,
        feeStatus: 'paid',
        hostelStatus: 'day_scholar',
        section: 'A',
      }))
    : DEMO.STUDENT_DATA

  const faculty = api.faculty.length > 0
    ? api.faculty.map((f: any, i: number) => ({
        id: f.id || String(i + 1),
        name: `${f.first_name || f.firstName || ''} ${f.last_name || f.lastName || ''}`,
        email: f.email || '',
        phone: f.phone || '',
        role: f.role || 'Faculty',
        specialization: f.specialization || '',
        workload: 60 + Math.floor(Math.random() * 30),
        batches: 1 + Math.floor(Math.random() * 3),
        status: f.is_active ? 'active' : 'on_leave',
      }))
    : DEMO.FACULTY

  const user = api.user
    ? { name: api.user.name, role: 'Department Head', avatar: api.user.name?.charAt(0) || 'A' }
    : null

  return (
    <AdminDashboardContext.Provider
      value={{
        overviewStats: DEMO.OVERVIEW_STATS,
        quickActions: DEMO.QUICK_ACTIONS,
        workflows: DEMO.WORKFLOWS,
        columns: DEMO.COLUMNS,
        students,
        faculty,
        requests: DEMO.REQUESTS,
        coordinationTasks: DEMO.COORDINATION_TASKS,
        complaints: DEMO.COMPLAINTS,
        announcements: DEMO.ANNOUNCEMENTS,
        user,
        loading: api.loading,
        error: api.error,
        refetch: api.refetch,
      }}
    >
      {children}
    </AdminDashboardContext.Provider>
  )
}

export function useAdminDashboardContext() {
  const ctx = useContext(AdminDashboardContext)
  if (!ctx) throw new Error('useAdminDashboardContext must be used within AdminDashboardProvider')
  return ctx
}
