'use client'

import { useState, useEffect, useCallback } from 'react'
import { apiClient } from '@/lib/api-client'

// ===================== Types =====================

export interface TeacherUser {
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

export interface TeacherStats {
  totalTasks: number
  inProgressTasks: number
  pendingAttendanceSessions: number
  pendingMarks: number
}

export interface Batch {
  id: string
  name: string
  semester: number
  section: string
  department_id: string
  student_count?: number
}

export interface Subject {
  id: string
  name: string
  code: string
  semester: number
}

export interface TeacherAssignment {
  id: string
  title: string
  subject_name: string
  subject_id: string
  batch_name: string
  deadline: string
  max_marks: number
  status: string
}

export interface TeacherTask {
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
  committee_name: string | null
  subtasks: any[]
}

export interface TeacherAttendanceSession {
  id: string
  subject_name: string
  batch_name: string
  session_date: string
  start_time: string
  status: string
  present_count: number
  absent_count: number
  total_students: number
}

export interface FacultyMember {
  id?: string
  name: string
  role: string
  email: string
  phone: string
  avatar: string
  specialization: string
}

export interface Announcement {
  id: string | number
  title: string
  date: string
  content: string
  from: string
  pinned: boolean
  read: boolean
  status: string
}

export interface MarksEntry {
  studentId: string | number
  studentName: string
  roll: string
  marks: number | null
  status: string
  grade: string | null
}

export interface TeacherDashboardData {
  user: TeacherUser | null
  stats: TeacherStats | null
  batches: Batch[]
  subjects: Subject[]
  assignments: TeacherAssignment[]
  tasks: TeacherTask[]
  attendanceSessions: TeacherAttendanceSession[]
  students: Record<string, any[]>
  timetable: Record<string, any[]>
  marksData: MarksEntry[]
  announcements: { toStudents: Announcement[]; fromAdmin: Announcement[] }
  faculty: FacultyMember[]
  loading: boolean
  error: string | null
  refetch: () => void
}

// ===================== Hook =====================

export function useTeacherDashboard(): TeacherDashboardData {
  const [user, setUser] = useState<TeacherUser | null>(null)
  const [stats, setStats] = useState<TeacherStats | null>(null)
  const [batches, setBatches] = useState<Batch[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [assignments, setAssignments] = useState<TeacherAssignment[]>([])
  const [tasks, setTasks] = useState<TeacherTask[]>([])
  const [attendanceSessions, setAttendanceSessions] = useState<TeacherAttendanceSession[]>([])
  const [students, setStudents] = useState<Record<string, any[]>>({})
  const [timetable, setTimetable] = useState<Record<string, any[]>>({})
  const [marksData, setMarksData] = useState<MarksEntry[]>([])
  const [announcements, setAnnouncements] = useState<{ toStudents: Announcement[]; fromAdmin: Announcement[] }>({
    toStudents: [],
    fromAdmin: [],
  })
  const [faculty, setFaculty] = useState<FacultyMember[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const results = await Promise.allSettled([
        apiClient.get('/auth/me'),
        apiClient.get('/dashboard/stats'),
        apiClient.get('/batches'),
        apiClient.get('/subjects'),
        apiClient.get('/assignments'),
        apiClient.get('/tasks'),
        apiClient.get('/attendance/sessions'),
        apiClient.get('/students'),
        apiClient.get('/timetable'),
        apiClient.get('/marks'),
        apiClient.get('/announcements'),
        apiClient.get('/faculty'),
      ])

      const userResult = results[0]
      if (userResult.status === 'fulfilled' && userResult.value.success) {
        setUser(userResult.value.data as TeacherUser)
      }

      const statsResult = results[1]
      if (statsResult.status === 'fulfilled' && statsResult.value.success) {
        setStats(statsResult.value.data?.stats as TeacherStats)
      }

      const batchesResult = results[2]
      if (batchesResult.status === 'fulfilled' && batchesResult.value.success) {
        setBatches((batchesResult.value.data || []) as Batch[])
      }

      const subjectsResult = results[3]
      if (subjectsResult.status === 'fulfilled' && subjectsResult.value.success) {
        setSubjects((subjectsResult.value.data || []) as Subject[])
      }

      const assignmentsResult = results[4]
      if (assignmentsResult.status === 'fulfilled' && assignmentsResult.value.success) {
        setAssignments((assignmentsResult.value.data || []) as TeacherAssignment[])
      }

      const tasksResult = results[5]
      if (tasksResult.status === 'fulfilled' && tasksResult.value.success) {
        setTasks((tasksResult.value.data || []) as TeacherTask[])
      }

      const attendanceResult = results[6]
      if (attendanceResult.status === 'fulfilled' && attendanceResult.value.success) {
        setAttendanceSessions((attendanceResult.value.data || []) as TeacherAttendanceSession[])
      }

      const studentsResult = results[7]
      if (studentsResult.status === 'fulfilled' && studentsResult.value.success) {
        const studentsData = studentsResult.value.data
        if (Array.isArray(studentsData)) {
          // Group students by batch
          const grouped: Record<string, any[]> = {}
          studentsData.forEach((s: any) => {
            const batchKey = s.batch_id || s.batch || 'default'
            if (!grouped[batchKey]) grouped[batchKey] = []
            grouped[batchKey].push({
              id: s.id,
              name: s.name,
              roll: s.roll_number || s.roll || '',
            })
          })
          setStudents(grouped)
        }
      }

      const timetableResult = results[8]
      if (timetableResult.status === 'fulfilled' && timetableResult.value.success) {
        const timetableData = timetableResult.value.data
        setTimetable(timetableData || {})
      }

      const marksResult = results[9]
      if (marksResult.status === 'fulfilled' && marksResult.value.success) {
        const marksDataArr = marksResult.value.data
        setMarksData(Array.isArray(marksDataArr) ? marksDataArr : [])
      }

      const announcementsResult = results[10]
      if (announcementsResult.status === 'fulfilled' && announcementsResult.value.success) {
        const annData = announcementsResult.value.data
        setAnnouncements({
          toStudents: Array.isArray(annData?.toStudents) ? annData.toStudents : [],
          fromAdmin: Array.isArray(annData?.fromAdmin) ? annData.fromAdmin : [],
        })
      }

      const facultyResult = results[11]
      if (facultyResult.status === 'fulfilled' && facultyResult.value.success) {
        setFaculty((facultyResult.value.data || []) as FacultyMember[])
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to load dashboard data'
      setError(message)
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
    batches,
    subjects,
    assignments,
    tasks,
    attendanceSessions,
    students,
    timetable,
    marksData,
    announcements,
    faculty,
    loading,
    error,
    refetch: fetchData,
  }
}

export default useTeacherDashboard
