'use client'

import { createContext, useContext, ReactNode } from 'react'
import { AlertTriangle, Clock3 } from 'lucide-react'
import { useTeacherDashboard, type Batch, type TeacherAssignment, type TeacherTask, type FacultyMember, type Announcement, type MarksEntry, type TeacherUser } from '@/hooks/useTeacherDashboard'
import * as DEMO from './data'

// ===================== Types =====================

export interface ViewBatch {
  id: string
  name: string
  students: number
  subjects: string[]
  attendance: number
  pendingAssignments: number
  lastLecture: string
  lecturesTaken: Record<string, number>
  labsTaken: Record<string, number>
  avgMarks: number
}

export interface ViewStudent {
  id: string | number
  name: string
  roll: string
}

export interface TimetableEntry {
  time: string
  subject: string
  batch: string
  group?: string
  room: string
  type: string
}

export interface AcademicTaskItem {
  id: string
  title: string
  subject: string
  batch: string
  priority: string
  deadline: string
  isOverdue: boolean
}

export interface TaskGroup {
  overdue: AcademicTaskItem[]
  todo: AcademicTaskItem[]
  inProgress: AcademicTaskItem[]
  done: AcademicTaskItem[]
}

export interface AdminTaskItem {
  id: string
  title: string
  type: string
  priority: string
  deadline: string
  from: string
  isOverdue: boolean
}

export interface AdminTaskGroup {
  overdue: AdminTaskItem[]
  todo: AdminTaskItem[]
  inProgress: AdminTaskItem[]
  done: AdminTaskItem[]
}

export interface ViewAssignment {
  id: string | number
  title: string
  batch: string
  subject: string
  dueDate: string
  maxMarks: number
  submitted: number
  total: number
  isLate: boolean
}

export interface SmartStatus {
  type: 'urgent' | 'success' | 'warning' | 'info'
  text: string
  icon: React.ComponentType<{ className?: string }>
}

export interface AnalyticsTeacherStats {
  totalLectures: number
  totalLabs: number
  avgAttendance: number
  assignmentsGiven: number
  hoursThisMonth: number
  studentInteraction: number
}

export interface BatchPerformance {
  name: string
  attendance: number
  avgMarks: number
  trend: number
}

export interface RiskAlert {
  type: string
  message: string
  batch: string
}

export interface AnalyticsData {
  teacherStats: AnalyticsTeacherStats
  batchPerformance: BatchPerformance[]
  riskAlerts: RiskAlert[]
}

export interface TeacherDashboardContextType {
  todayClasses: TimetableEntry[]
  smartStatus: SmartStatus[]
  batches: ViewBatch[]
  students: Record<string, ViewStudent[]>
  timetable: Record<string, TimetableEntry[]>
  academicTasks: TaskGroup
  adminTasks: AdminTaskGroup
  assignments: ViewAssignment[]
  marksData: MarksEntry[]
  analytics: AnalyticsData
  announcements: { toStudents: Announcement[]; fromAdmin: Announcement[] }
  faculty: FacultyMember[]
  user: { name: string; role: string; avatar: string } | null
  loading: boolean
  error: string | null
  refetch: () => void
}

const TeacherDashboardContext = createContext<TeacherDashboardContextType | null>(null)

function deriveTodayClasses(tasks: TeacherTask[], sessions: any[]): TimetableEntry[] {
  // Derive today's classes from tasks and attendance sessions
  if (sessions.length > 0) {
    const today = new Date().toISOString().split('T')[0]
    return sessions
      .filter((s: any) => s.session_date?.startsWith(today) || s.scheduled_date?.startsWith(today))
      .slice(0, 6)
      .map((s: any) => ({
        time: s.start_time?.slice(0, 5) || '09:00',
        subject: s.subject_name || 'Class',
        batch: s.batch_name || '',
        group: '',
        room: s.location || '',
        type: 'Lecture' as const,
      }))
  }
  return DEMO.TODAY_CLASSES
}

function deriveSmartStatus(tasks: TeacherTask[], stats: any): SmartStatus[] {
  const statuses: SmartStatus[] = []
  const overdue = tasks.filter((t) => t.status === 'created' && t.due_date && new Date(t.due_date) < new Date())
  const critical = tasks.filter((t) => t.priority === 'CRITICAL' || t.priority === 'HIGH')

  if (overdue.length > 0) {
    statuses.push({
      type: 'urgent',
      text: `${overdue.length} task${overdue.length > 1 ? 's' : ''} overdue`,
      icon: AlertTriangle,
    })
  }

  if (stats?.pendingAttendanceSessions && stats.pendingAttendanceSessions > 0) {
    statuses.push({
      type: 'warning',
      text: `${stats.pendingAttendanceSessions} attendance session${stats.pendingAttendanceSessions > 1 ? 's' : ''} pending`,
      icon: Clock3,
    })
  }

  if (critical.length > 0) {
    statuses.push({
      type: 'urgent',
      text: `${critical.length} high priority task${critical.length > 1 ? 's' : ''}`,
      icon: AlertTriangle,
    })
  }

  if (statuses.length === 0) {
    statuses.push(...DEMO.SMART_STATUS)
  }

  return statuses.slice(0, 4)
}

function deriveAnalytics(tasks: TeacherTask[], stats: any, batches: ViewBatch[]): AnalyticsData {
  return {
    teacherStats: {
      totalLectures: stats?.totalTasks ? stats.totalTasks * 2 : 32,
      totalLabs: stats?.inProgressTasks ? Math.max(stats.inProgressTasks, 10) : 18,
      avgAttendance: batches.length > 0 ? Math.round(batches.reduce((s, b) => s + b.attendance, 0) / batches.length) : 88,
      assignmentsGiven: stats?.pendingMarks || 12,
      hoursThisMonth: 78,
      studentInteraction: 240,
    },
    batchPerformance: batches.map((b) => ({
      name: b.name,
      attendance: b.attendance,
      avgMarks: b.avgMarks,
      trend: b.attendance > 85 ? 2 : b.attendance > 80 ? 0 : -2,
    })),
    riskAlerts: batches
      .filter((b) => b.attendance < 85)
      .map((b) => ({
        type: 'warning',
        message: `${b.name} attendance is at ${b.attendance}%`,
        batch: b.name,
      })),
  }
}

export function TeacherDashboardProvider({ children }: { children: ReactNode }) {
  const api = useTeacherDashboard()

  const user = api.user
    ? {
        name: `${api.user.firstName} ${api.user.lastName}`,
        role: api.user.role,
        avatar: api.user.avatar || api.user.firstName.charAt(0),
      }
    : null

  // Map real batches to view shape
  const batches: ViewBatch[] = api.batches.length > 0
    ? api.batches.map((b: Batch) => {
        const demoBatch = DEMO.BATCHES.find((db) => db.id === b.id) || DEMO.BATCHES[0]
        return {
          id: b.id,
          name: b.name,
          students: b.student_count || demoBatch?.students || 80,
          subjects: demoBatch?.subjects || ['Operating Systems'],
          attendance: demoBatch?.attendance || 85,
          pendingAssignments: demoBatch?.pendingAssignments || 2,
          lastLecture: demoBatch?.lastLecture || 'Recently',
          lecturesTaken: (demoBatch?.lecturesTaken || {}) as Record<string, number>,
          labsTaken: (demoBatch?.labsTaken || {}) as Record<string, number>,
          avgMarks: demoBatch?.avgMarks || 80,
        }
      })
    : (DEMO.BATCHES as Array<Record<string, any>>).map((b) => ({
        id: b.id,
        name: b.name,
        students: b.students,
        subjects: b.subjects,
        attendance: b.attendance,
        pendingAssignments: b.pendingAssignments,
        lastLecture: b.lastLecture,
        lecturesTaken: b.lecturesTaken as Record<string, number>,
        labsTaken: b.labsTaken as Record<string, number>,
        avgMarks: b.avgMarks,
      }))

  // Map tasks to academic task groups
  const academicTasks: TaskGroup = api.tasks.length > 0
    ? {
        overdue: api.tasks
          .filter((t: TeacherTask) => t.status === 'created' && t.due_date && new Date(t.due_date) < new Date())
          .map((t: TeacherTask) => ({
            id: t.id,
            title: t.title,
            subject: t.category || 'General',
            batch: '',
            priority: t.priority,
            deadline: t.due_date ? new Date(t.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '',
            isOverdue: true,
          })),
        todo: api.tasks
          .filter((t: TeacherTask) => t.status === 'created' && (!t.due_date || new Date(t.due_date) >= new Date()))
          .map((t: TeacherTask) => ({
            id: t.id,
            title: t.title,
            subject: t.category || 'General',
            batch: '',
            priority: t.priority,
            deadline: t.due_date ? new Date(t.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '',
            isOverdue: false,
          })),
        inProgress: api.tasks
          .filter((t: TeacherTask) => t.status === 'in_progress')
          .map((t: TeacherTask) => ({
            id: t.id,
            title: t.title,
            subject: t.category || 'General',
            batch: '',
            priority: t.priority,
            deadline: t.due_date ? new Date(t.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '',
            isOverdue: false,
          })),
        done: api.tasks
          .filter((t: TeacherTask) => t.status === 'done')
          .map((t: TeacherTask) => ({
            id: t.id,
            title: t.title,
            subject: t.category || 'General',
            batch: '',
            priority: t.priority,
            deadline: t.due_date ? new Date(t.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '',
            isOverdue: false,
          })),
      }
    : {
        overdue: DEMO.ACADEMIC_TASKS.overdue,
        todo: DEMO.ACADEMIC_TASKS.todo,
        inProgress: DEMO.ACADEMIC_TASKS.inProgress,
        done: DEMO.ACADEMIC_TASKS.done,
      }

  // Admin tasks (use demo data mapped properly)
  const adminTasks: AdminTaskGroup = {
    overdue: DEMO.ADMIN_TASKS.overdue,
    todo: DEMO.ADMIN_TASKS.todo,
    inProgress: DEMO.ADMIN_TASKS.inProgress,
    done: DEMO.ADMIN_TASKS.done,
  }

  // Map assignments
  const assignments: ViewAssignment[] = api.assignments.length > 0
    ? api.assignments.map((a: TeacherAssignment) => ({
        id: a.id,
        title: a.title,
        batch: a.batch_name || '',
        subject: a.subject_name || '',
        dueDate: a.deadline ? new Date(a.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '',
        maxMarks: a.max_marks || 20,
        submitted: 0,
        total: 80,
        isLate: a.status === 'delayed',
      }))
    : DEMO.ASSIGNMENTS_DATA.map((a) => ({
        id: a.id,
        title: a.title,
        batch: a.batch,
        subject: a.subject,
        dueDate: a.dueDate,
        maxMarks: a.maxMarks,
        submitted: a.submitted,
        total: a.total,
        isLate: a.isLate,
      }))

  // Students (from API or demo)
  const students: Record<string, ViewStudent[]> = Object.keys(api.students).length > 0
    ? api.students
    : Object.fromEntries(
        Object.entries(DEMO.STUDENTS).map(([key, vals]) => [
          key,
          vals.map((s: any) => ({ id: s.id, name: s.name, roll: s.roll })),
        ])
      )

  // Timetable
  const timetableEntries: Record<string, TimetableEntry[]> = Object.keys(api.timetable).length > 0
    ? api.timetable
    : Object.fromEntries(
        Object.entries(DEMO.TIMETABLE).map(([key, vals]) => [
          key,
          vals.map((v) => ({
            time: v.time,
            subject: v.subject,
            batch: v.batch,
            group: v.group || '',
            room: v.room,
            type: v.type,
          })),
        ])
      )

  // Marks data
  const marksData: MarksEntry[] = api.marksData.length > 0
    ? api.marksData
    : DEMO.MARKS_DATA

  // Analytics
  const analytics: AnalyticsData = deriveAnalytics(api.tasks, api.stats, batches)

  // Announcements
  const announcements = api.announcements.toStudents.length > 0 || api.announcements.fromAdmin.length > 0
    ? api.announcements
    : (DEMO.ANNOUNCEMENTS as { toStudents: Announcement[]; fromAdmin: Announcement[] })

  // Faculty
  const faculty: FacultyMember[] = api.faculty.length > 0
    ? api.faculty
    : DEMO.FACULTY_DIRECTORY.map((f) => ({
        ...f,
        id: f.email,
      }))

  // Today's classes (from sessions or demo)
  const todayClasses = deriveTodayClasses(api.tasks, api.attendanceSessions)

  // Smart status
  const smartStatus = deriveSmartStatus(api.tasks, api.stats)

  return (
    <TeacherDashboardContext.Provider
      value={{
        todayClasses,
        smartStatus,
        batches,
        students,
        timetable: timetableEntries,
        academicTasks,
        adminTasks,
        assignments,
        marksData,
        analytics,
        announcements,
        faculty,
        user,
        loading: api.loading,
        error: api.error,
        refetch: api.refetch,
      }}
    >
      {children}
    </TeacherDashboardContext.Provider>
  )
}

export function useTeacherDashboardContext() {
  const ctx = useContext(TeacherDashboardContext)
  if (!ctx) throw new Error('useTeacherDashboardContext must be used within TeacherDashboardProvider')
  return ctx
}
