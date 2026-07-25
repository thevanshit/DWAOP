'use client'

import { createContext, useContext, ReactNode } from 'react'
import { useTeacherDashboard } from '@/hooks/useTeacherDashboard'
import * as DEMO from './data'

// ===================== Types =====================

export interface TeacherDashboardContextType {
  todayClasses: typeof DEMO.TODAY_CLASSES
  smartStatus: typeof DEMO.SMART_STATUS
  batches: typeof DEMO.BATCHES
  students: typeof DEMO.STUDENTS
  timetable: typeof DEMO.TIMETABLE
  academicTasks: typeof DEMO.ACADEMIC_TASKS
  adminTasks: typeof DEMO.ADMIN_TASKS
  assignments: typeof DEMO.ASSIGNMENTS_DATA
  marksData: typeof DEMO.MARKS_DATA
  analytics: typeof DEMO.ANALYTICS_DATA
  announcements: typeof DEMO.ANNOUNCEMENTS
  faculty: typeof DEMO.FACULTY_DIRECTORY
  user: { name: string; role: string; avatar: string } | null
  loading: boolean
  error: string | null
  refetch: () => void
}

const TeacherDashboardContext = createContext<TeacherDashboardContextType | null>(null)

export function TeacherDashboardProvider({ children }: { children: ReactNode }) {
  const api = useTeacherDashboard()

  // Transform real API data into view shapes, falling back to demo data
  const user = api.user
    ? { name: `${api.user.firstName} ${api.user.lastName}`, role: api.user.role, avatar: api.user.avatar || api.user.firstName.charAt(0) }
    : null

  // Map real batches to view shape (enrich with demo defaults for display-only fields)
  const batches: typeof DEMO.BATCHES = api.batches.length > 0
    ? api.batches.map((b: any, idx: number) => {
        const demoBatch = DEMO.BATCHES[idx % DEMO.BATCHES.length]
        return {
          id: b.id,
          name: b.name,
          students: b.student_count || 80,
          subjects: demoBatch?.subjects || ['Operating Systems'],
          attendance: demoBatch?.attendance || 85,
          pendingAssignments: demoBatch?.pendingAssignments || 2,
          lastLecture: demoBatch?.lastLecture || 'Feb 15, 2026',
          lecturesTaken: (demoBatch?.lecturesTaken || { 'Operating Systems': 10 }) as any,
          labsTaken: (demoBatch?.labsTaken || { 'Operating Systems': 5 }) as any,
          avgMarks: demoBatch?.avgMarks || 80,
        }
      }) as any
    : DEMO.BATCHES

  return (
    <TeacherDashboardContext.Provider
      value={{
        todayClasses: DEMO.TODAY_CLASSES,
        smartStatus: DEMO.SMART_STATUS,
        batches,
        students: DEMO.STUDENTS,
        timetable: DEMO.TIMETABLE,
        academicTasks: api.tasks.length > 0
          ? ({ overdue: ([] as any[]), todo: api.tasks.filter((t: any) => t.status === 'created'), inProgress: api.tasks.filter((t: any) => t.status === 'in_progress'), done: api.tasks.filter((t: any) => t.status === 'done') } as any)
          : DEMO.ACADEMIC_TASKS,
        adminTasks: DEMO.ADMIN_TASKS,
        assignments: api.assignments.length > 0
          ? api.assignments.map((a: any) => ({
              id: a.id,
              title: a.title,
              batch: a.batch_name || '',
              subject: a.subject_name || '',
              dueDate: a.deadline || '',
              maxMarks: a.max_marks || 20,
              submitted: 0,
              total: 80,
              isLate: a.status === 'delayed',
            }))
          : DEMO.ASSIGNMENTS_DATA,
        marksData: DEMO.MARKS_DATA,
        analytics: DEMO.ANALYTICS_DATA,
        announcements: DEMO.ANNOUNCEMENTS,
        faculty: DEMO.FACULTY_DIRECTORY,
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
