'use client'

import { useState, useEffect, useCallback } from 'react'
import { apiClient } from '@/lib/api-client'

// ===================== Types =====================

export interface StudentUser {
  id: string
  name: string
  firstName: string
  lastName: string
  email: string
  role: string
  avatar: string | null
  specialization: string | null
  departmentId: string | null
  departmentName: string | null
}

export interface DashboardStats {
  attendancePercentage: number
  pendingAssignments: number
  pendingLeaveRequests: number
  eligibilityStatus: string
}

export interface Subject {
  id: string
  name: string
  code: string
  semester: number
  department_id: string
  department_name?: string
}

export interface AttendanceRecord {
  id: string
  session_id: string
  student_id: string
  status: 'present' | 'absent' | 'late' | 'excused'
  marked_at: string
  session?: {
    subject_name: string
    subject_code: string
    session_date: string
    start_time: string
  }
}

export interface MarkEntry {
  id: string
  subject_id: string
  subject_name: string
  subject_code: string
  total_marks: number
  status: 'draft' | 'submitted' | 'under_review' | 'finalised' | 'locked'
  semester: string
  academic_year: string
  components: MarkComponent[]
}

export interface MarkComponent {
  id: string
  component_type: string
  component_name: string
  max_marks: number
  obtained_marks: number
  weightage: number
}

export interface Assignment {
  id: string
  title: string
  description: string | null
  subject_id: string
  subject_name: string
  subject_code: string
  max_marks: number
  deadline: string
  status: string
  allow_late_submission: number
  submission?: {
    id: string
    status: string
    marks: number | null
    submitted_at: string
    feedback: string | null
  }
}

export interface Task {
  id: string
  title: string
  description: string | null
  status: string
  priority: string
  category: string | null
  due_date: string | null
  assignee_id: string | null
  assignee_name: string | null
  creator_name: string | null
  subtasks: any[]
  comments: any[]
}

export interface LeaveRequest {
  id: string
  leave_type: string
  start_date: string
  end_date: string
  reason: string
  status: string
  created_at: string
  student_name: string
  approver_name: string | null
}

export interface Notification {
  id: string
  title: string
  message: string
  type: string
  category: string | null
  is_read: number
  created_at: string
}

export interface TrackReport {
  id: string
  student_id: string
  semester: string
  academic_year: string
  status: string
  eligibility_status: string
  attendance: any
  marks: any
  riskIndicators: string[]
}

export interface StudentDashboardData {
  user: StudentUser | null
  stats: DashboardStats | null
  subjects: Subject[]
  marks: MarkEntry[]
  assignments: Assignment[]
  tasks: Task[]
  leaveRequests: LeaveRequest[]
  notifications: Notification[]
  trackReports: TrackReport[]
  loading: boolean
  error: string | null
  refetch: () => void
}

// ===================== Hook =====================

export function useStudentDashboard(): StudentDashboardData {
  const [user, setUser] = useState<StudentUser | null>(null)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [marks, setMarks] = useState<MarkEntry[]>([])
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [trackReports, setTrackReports] = useState<TrackReport[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      // Fetch all data in parallel for speed
      const results = await Promise.allSettled([
        apiClient.get('/auth/me'),
        apiClient.get('/dashboard/stats'),
        apiClient.get('/marks'),
        apiClient.get('/assignments'),
        apiClient.get('/tasks'),
        apiClient.get('/leave'),
        apiClient.get('/notifications'),
        apiClient.get('/reports'),
        apiClient.get('/subjects'),
      ])

      // Process user
      const userResult = results[0]
      if (userResult.status === 'fulfilled' && userResult.value.success) {
        setUser(userResult.value.data as StudentUser)
      }

      // Process stats
      const statsResult = results[1]
      if (statsResult.status === 'fulfilled' && statsResult.value.success) {
        setStats(statsResult.value.data as DashboardStats)
      }

      // Process marks
      const marksResult = results[2]
      if (marksResult.status === 'fulfilled' && marksResult.value.success) {
        setMarks((marksResult.value.data || []) as MarkEntry[])
      }

      // Process assignments + their submissions
      const assignmentsResult = results[3]
      if (assignmentsResult.status === 'fulfilled' && assignmentsResult.value.success) {
        const rawAssignments = (assignmentsResult.value.data || []) as any[]
        // Fetch submissions for each assignment
        const assignmentsWithSubmissions = await Promise.all(
          rawAssignments.map(async (a) => {
            const subResult = await apiClient.get(`/assignments/${a.id}/submit`)
            return {
              ...a,
              submission: subResult.success ? subResult.data : null,
            } as Assignment
          })
        )
        setAssignments(assignmentsWithSubmissions)
      }

      // Process tasks
      const tasksResult = results[4]
      if (tasksResult.status === 'fulfilled' && tasksResult.value.success) {
        setTasks((tasksResult.value.data || []) as Task[])
      }

      // Process leave requests
      const leaveResult = results[5]
      if (leaveResult.status === 'fulfilled' && leaveResult.value.success) {
        setLeaveRequests((leaveResult.value.data || []) as LeaveRequest[])
      }

      // Process notifications
      const notifResult = results[6]
      if (notifResult.status === 'fulfilled' && notifResult.value.success) {
        const notifData = notifResult.value.data
        setNotifications((notifData?.notifications || []) as Notification[])
      }

      // Process track reports
      const reportsResult = results[7]
      if (reportsResult.status === 'fulfilled' && reportsResult.value.success) {
        setTrackReports((reportsResult.value.data || []) as TrackReport[])
      }

      // Process subjects
      const subjectsResult = results[8]
      if (subjectsResult.status === 'fulfilled' && subjectsResult.value.success) {
        setSubjects((subjectsResult.value.data || []) as Subject[])
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
    subjects,
    marks: marks || [],
    assignments: assignments || [],
    tasks: tasks || [],
    leaveRequests: leaveRequests || [],
    notifications: notifications || [],
    trackReports: trackReports || [],
    loading,
    error,
    refetch: fetchData,
  }
}

export default useStudentDashboard
