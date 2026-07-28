'use client'

import { createContext, useContext, ReactNode, ComponentType } from 'react'
import { useAdminDashboard } from '@/hooks/useAdminDashboard'
import * as DEMO from './data'
import type {
  OverviewStat, QuickAction, WorkflowItem, ColumnDef,
  StudentItem, FacultyItem, RequestItem, CoordinationTask,
  ComplaintItem, AnnouncementItem,
} from './data'

export interface AdminDashboardContextType {
  overviewStats: OverviewStat[]
  quickActions: QuickAction[]
  workflows: WorkflowItem[]
  columns: ColumnDef[]
  students: StudentItem[]
  faculty: FacultyItem[]
  requests: RequestItem[]
  coordinationTasks: CoordinationTask[]
  complaints: ComplaintItem[]
  announcements: AnnouncementItem[]
  user: { name: string; role: string; avatar: string } | null
  loading: boolean
  error: string | null
  refetch: () => void
}

const AdminDashboardContext = createContext<AdminDashboardContextType | null>(null)

/** Build overview stats from API stats data with fallback to DEMO */
function buildOverviewStats(stats: Record<string, any> | null): OverviewStat[] {
  if (!stats) return DEMO.OVERVIEW_STATS
  return [
    {
      label: 'At Risk Students',
      value: String(stats.atRiskStudents ?? DEMO.OVERVIEW_STATS[0].value),
      sub: 'Need attention',
      icon: DEMO.OVERVIEW_STATS[0].icon as ComponentType<{ className?: string }>,
      color: 'red',
    },
    {
      label: 'Pending Tasks',
      value: String(stats.delayedTasks ?? DEMO.OVERVIEW_STATS[1].value),
      sub: 'Across department',
      icon: DEMO.OVERVIEW_STATS[1].icon as ComponentType<{ className?: string }>,
      color: 'blue',
    },
    {
      label: 'Pending Approvals',
      value: String(stats.pendingApprovals ?? DEMO.OVERVIEW_STATS[2].value),
      sub: 'Awaiting review',
      icon: DEMO.OVERVIEW_STATS[2].icon as ComponentType<{ className?: string }>,
      color: 'amber',
    },
    {
      label: 'Faculty Load',
      value: `${stats.totalTeachers ?? 0} Faculty`,
      sub: 'Active members',
      icon: DEMO.OVERVIEW_STATS[3].icon as ComponentType<{ className?: string }>,
      color: 'purple',
    },
  ]
}

/** Map API student data to StudentItem shape */
function mapStudents(apiStudents: Record<string, any>[]): StudentItem[] {
  if (apiStudents.length === 0) return DEMO.STUDENT_DATA
  return apiStudents.map((s, i) => ({
    id: String(s.id ?? i + 1),
    name: `${s.first_name ?? s.firstName ?? ''} ${s.last_name ?? s.lastName ?? ''}`.trim() || `Student ${i + 1}`,
    roll: s.roll_number ?? `CS-${String(i + 1).padStart(3, '0')}`,
    email: s.email ?? '',
    phone: s.phone ?? '',
    batch: s.batch_name ?? '',
    attendance: s.attendance ?? 85,
    cgpa: s.cgpa ?? 7.5,
    status: s.status ?? 'active',
    pending: s.pending ?? 0,
    eligible: s.eligible ?? true,
    feeStatus: s.fee_status ?? 'paid',
    hostelStatus: s.hostel_status ?? 'day_scholar',
    section: s.section ?? 'A',
  }))
}

/** Map API faculty data to FacultyItem shape */
function mapFaculty(apiFaculty: Record<string, any>[]): FacultyItem[] {
  if (apiFaculty.length === 0) return DEMO.FACULTY
  return apiFaculty.map((f, i) => ({
    id: String(f.id ?? i + 1),
    name: `${f.first_name ?? f.firstName ?? ''} ${f.last_name ?? f.lastName ?? ''}`.trim() || `Faculty ${i + 1}`,
    email: f.email ?? '',
    phone: f.phone ?? '',
    role: f.role ?? 'Faculty',
    specialization: f.specialization ?? '',
    workload: f.workload ?? 70,
    batches: f.batches ?? 1,
    status: f.is_active ? 'active' : 'on_leave',
  }))
}

/** Map API workflow data to WorkflowItem shape */
function mapWorkflows(apiWorkflows: Record<string, any>[]): WorkflowItem[] {
  if (apiWorkflows.length === 0) return DEMO.WORKFLOWS
  return apiWorkflows.map((w, i) => ({
    id: String(w.id ?? `wf-${i + 1}`),
    type: w.type ?? 'student',
    title: w.title ?? `Workflow ${i + 1}`,
    description: w.description ?? '',
    status: w.status ?? 'created',
    assignee: w.assignee ?? w.assigned_to ?? '',
    batch: w.batch ?? '',
    subject: w.subject ?? '',
    dueDate: w.due_date ?? w.dueDate ?? '',
    priority: w.priority ?? 'medium',
  }))
}

/** Map API task data to CoordinationTask shape */
function mapTasks(apiTasks: Record<string, any>[]): CoordinationTask[] {
  if (apiTasks.length === 0) return DEMO.COORDINATION_TASKS
  return apiTasks.map((t, i) => ({
    id: String(t.id ?? `task-${i + 1}`),
    title: t.title ?? `Task ${i + 1}`,
    type: t.type ?? 'admin',
    status: t.status ?? 'created',
    assignee: t.assignee ?? t.assigned_to ?? '',
    priority: t.priority ?? 'medium',
    dueDate: t.due_date ?? t.dueDate ?? '',
  }))
}

export function AdminDashboardProvider({ children }: { children: ReactNode }) {
  const api = useAdminDashboard()

  const overviewStats = buildOverviewStats(api.stats)
  const quickActions = DEMO.QUICK_ACTIONS
  const workflows = mapWorkflows(api.workflows)
  const columns = DEMO.COLUMNS
  const students = mapStudents(api.students)
  const facultyList = mapFaculty(api.faculty)
  const coordinationTasks = mapTasks(api.tasks)
  const complaints: ComplaintItem[] = api.complaints.length > 0
    ? api.complaints.map((c: Record<string, any>, i: number) => ({
        id: String(c.id ?? `comp-${i + 1}`),
        type: c.type ?? 'student',
        title: c.title ?? `Complaint ${i + 1}`,
        description: c.description ?? '',
        student: c.student ?? c.student_name ?? '',
        batch: c.batch ?? '',
        faculty: c.faculty ?? c.faculty_name ?? '',
        status: c.status ?? 'pending',
        priority: c.priority ?? 'medium',
        date: c.date ?? c.created_at ?? '',
      }))
    : DEMO.COMPLAINTS
  const announcements: AnnouncementItem[] = api.announcements.length > 0
    ? api.announcements.map((a: Record<string, any>, i: number) => ({
        id: String(a.id ?? `ann-${i + 1}`),
        title: a.title ?? `Announcement ${i + 1}`,
        message: a.message ?? a.description ?? '',
        target: a.target ?? 'both',
        createdAt: a.created_at ?? a.createdAt ?? '',
        author: a.author ?? 'Admin',
      }))
    : DEMO.ANNOUNCEMENTS

  const user = api.user
    ? { name: api.user.name || 'Admin', role: 'Department Head', avatar: api.user.name?.charAt(0) || 'A' }
    : null

  return (
    <AdminDashboardContext.Provider
      value={{
        overviewStats,
        quickActions,
        workflows,
        columns,
        students,
        faculty: facultyList,
        requests: DEMO.REQUESTS,
        coordinationTasks,
        complaints,
        announcements,
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
