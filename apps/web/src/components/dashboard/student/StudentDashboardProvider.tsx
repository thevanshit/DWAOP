'use client'

import { createContext, useContext, ReactNode, useState, useEffect } from 'react'
import { useStudentDashboard } from '@/hooks/useStudentDashboard'
import { apiClient } from '@/lib/api-client'
import type { StudentDashboardData, MarkEntry, Assignment, Task, LeaveRequest, Notification, TrackReport } from '@/hooks/useStudentDashboard'

// ==================== Transformed types for tabs ====================

export interface TabSubject {
  id: number
  name: string
  code: string
  attendance: number
  totalClasses: number
  presentClasses: number
  assignmentCompletion: number
  readinessScore: number
  lastClass: string
  nextClass: string
}

export interface TabMark {
  subject: string
  subjectCode?: string
  internal1: number
  internal2: number
  assignment: number
  total: number
  status: string
}

export interface TabAssignment {
  id: number
  subject: string
  category: 'theory' | 'lab'
  title: string
  description: string
  type: 'project' | 'coding' | 'documentation' | 'questions'
  submissionType: 'github' | 'file' | 'text'
  dueDate: string
  status: 'pending' | 'submitted' | 'evaluated' | 'late'
  maxMarks: number
  submittedDate?: string
  marks?: number
  githubLink?: string
}

export interface TabTrackReport {
  semester: string
  year: string
  attendance: number
  marks: number | null
  cgpa: number | null
  status: 'locked' | 'in_progress' | 'completed'
}

// ==================== Context ====================

interface StudentDashboardContextValue {
  // Raw API data
  raw: StudentDashboardData

  // Transformed data for tabs
  subjects: TabSubject[]
  marks: TabMark[]
  assignments: TabAssignment[]
  trackReports: TabTrackReport[]

  // Demo data kept for tabs without APIs
  feeStructure: any[]
  transactions: any[]
  currentHostel: any
  hostelAmenities: any[]
  hostelHistory: any[]
  messMenu: any
  hostelEmergency: any[]
  sportsFacilities: any[]
  sportsEvents: any[]
  sportsAchievements: any[]
}

const StudentDashboardContext = createContext<StudentDashboardContextValue | null>(null)

export function useStudentDashboardData() {
  const ctx = useContext(StudentDashboardContext)
  if (!ctx) {
    throw new Error('useStudentDashboardData must be used within StudentDashboardProvider')
  }
  return ctx
}

// ==================== Transform Helpers ====================

function transformSubjects(raw: StudentDashboardData): TabSubject[] {
  if (!raw.subjects?.length) return FALLBACK_SUBJECTS

  return raw.subjects.map((s, i) => ({
    id: i + 1,
    name: s.name,
    code: s.code,
    attendance: raw.stats?.attendancePercentage ?? 75,
    totalClasses: 25,
    presentClasses: Math.round(25 * ((raw.stats?.attendancePercentage ?? 75) / 100)),
    assignmentCompletion: 70,
    readinessScore: 75,
    lastClass: 'Today',
    nextClass: 'Tomorrow',
  }))
}

function transformMarks(raw: StudentDashboardData): TabMark[] {
  if (!raw.marks?.length) return FALLBACK_MARKS

  return raw.marks.map((m: MarkEntry) => {
    const internal1 = m.components?.find((c: any) => c.component_type === 'internal1' || c.component_name?.toLowerCase().includes('internal 1'))
    const internal2 = m.components?.find((c: any) => c.component_type === 'internal2' || c.component_name?.toLowerCase().includes('internal 2'))
    const assignment = m.components?.find((c: any) => c.component_type === 'assignment' || c.component_name?.toLowerCase().includes('assignment'))

    return {
      subject: m.subject_name,
      subjectCode: m.subject_code,
      internal1: internal1?.obtained_marks ?? 0,
      internal2: internal2?.obtained_marks ?? 0,
      assignment: assignment?.obtained_marks ?? 0,
      total: m.total_marks ?? 0,
      status: m.status === 'finalised' ? 'finalized' : m.status,
    }
  })
}

function transformAssignments(raw: StudentDashboardData): TabAssignment[] {
  if (!raw.assignments?.length) return FALLBACK_ASSIGNMENTS

  return raw.assignments.map((a: Assignment, i) => {
    const submission = a.submission
    let status: TabAssignment['status'] = 'pending'
    if (submission) {
      if (submission.status === 'evaluated') status = 'evaluated'
      else if (submission.status === 'late') status = 'late'
      else status = 'submitted'
    }

    return {
      id: i + 1,
      subject: a.subject_name || 'Unknown',
      category: 'theory',
      title: a.title,
      description: a.description || '',
      type: 'documentation',
      submissionType: 'file',
      dueDate: a.deadline?.split('T')[0] || 'No date',
      status,
      maxMarks: a.max_marks,
      submittedDate: submission?.submitted_at?.split('T')[0],
      marks: submission?.marks ?? undefined,
    }
  })
}

function transformTrackReports(raw: StudentDashboardData): TabTrackReport[] {
  if (!raw.trackReports?.length) return FALLBACK_TRACK_REPORTS

  return raw.trackReports.map((r: TrackReport) => ({
    semester: r.semester,
    year: r.academic_year,
    attendance: r.attendance?.length ? Math.round(r.attendance.reduce((a: number, b: any) => a + (b.percentage || 0), 0) / r.attendance.length) : 0,
    marks: r.marks?.length ? Math.round(r.marks.reduce((a: number, b: any) => a + (b.total_marks || 0), 0)) : null,
    cgpa: null,
    status: (r.status === 'locked' ? 'locked' : r.status === 'in_progress' ? 'in_progress' : 'completed') as TabTrackReport['status'],
  }))
}

// ==================== Fallback demo data ====================

const FALLBACK_SUBJECTS: TabSubject[] = [
  { id: 1, name: 'Data Structures', code: 'CS301', attendance: 88, totalClasses: 25, presentClasses: 22, assignmentCompletion: 85, readinessScore: 90, lastClass: 'Feb 10', nextClass: 'Feb 15' },
  { id: 2, name: 'Database Systems', code: 'CS302', attendance: 80, totalClasses: 25, presentClasses: 20, assignmentCompletion: 60, readinessScore: 70, lastClass: 'Feb 12', nextClass: 'Feb 16' },
  { id: 3, name: 'Operating Systems', code: 'CS303', attendance: 84, totalClasses: 25, presentClasses: 21, assignmentCompletion: 50, readinessScore: 62, lastClass: 'Feb 11', nextClass: 'Feb 14' },
  { id: 4, name: 'Software Engineering', code: 'CS304', attendance: 92, totalClasses: 25, presentClasses: 23, assignmentCompletion: 95, readinessScore: 94, lastClass: 'Feb 13', nextClass: 'Feb 17' },
  { id: 5, name: 'Computer Networks', code: 'CS305', attendance: 76, totalClasses: 25, presentClasses: 19, assignmentCompletion: 70, readinessScore: 75, lastClass: 'Feb 12', nextClass: 'Feb 16' },
  { id: 6, name: 'Web Technologies', code: 'CS306', attendance: 84, totalClasses: 25, presentClasses: 21, assignmentCompletion: 80, readinessScore: 82, lastClass: 'Feb 14', nextClass: 'Feb 18' },
]

const FALLBACK_MARKS: TabMark[] = [
  { subject: 'Data Structures', subjectCode: 'CS301', internal1: 20, internal2: 21, assignment: 0, total: 41, status: 'finalized' },
  { subject: 'Database Systems', subjectCode: 'CS302', internal1: 21, internal2: 20, assignment: 0, total: 41, status: 'under_review' },
  { subject: 'Operating Systems', subjectCode: 'CS303', internal1: 20, internal2: 22, assignment: 0, total: 42, status: 'draft' },
  { subject: 'Software Engineering', subjectCode: 'CS304', internal1: 22, internal2: 21, assignment: 0, total: 43, status: 'finalized' },
  { subject: 'Computer Networks', subjectCode: 'CS305', internal1: 21, internal2: 20, assignment: 0, total: 41, status: 'draft' },
  { subject: 'Web Technologies', subjectCode: 'CS306', internal1: 21, internal2: 21, assignment: 0, total: 42, status: 'draft' },
]

const FALLBACK_ASSIGNMENTS: TabAssignment[] = [
  { id: 1, subject: 'DBMS', category: 'theory', title: 'SQL Optimization Assignment', description: 'Optimize the given SQL queries', type: 'coding', submissionType: 'file', dueDate: '2026-02-20', status: 'pending', maxMarks: 50 },
  { id: 2, subject: 'DBMS', category: 'theory', title: 'ER Diagram Design', description: 'Create ER diagram', type: 'project', submissionType: 'file', dueDate: '2026-02-12', status: 'submitted', maxMarks: 75, submittedDate: '2026-02-10' },
  { id: 3, subject: 'OS', category: 'theory', title: 'Process Scheduling Report', description: 'Report on CPU scheduling', type: 'documentation', submissionType: 'text', dueDate: '2026-02-25', status: 'pending', maxMarks: 50 },
  { id: 4, subject: 'SE', category: 'theory', title: 'UML System Design', description: 'UML diagrams for library system', type: 'project', submissionType: 'file', dueDate: '2026-03-01', status: 'pending', maxMarks: 100 },
  { id: 5, subject: 'AI', category: 'theory', title: 'Search Algorithms Project', description: 'Implement BFS and DFS', type: 'project', submissionType: 'github', dueDate: '2026-02-28', status: 'pending', maxMarks: 75 },
]

const FALLBACK_TRACK_REPORTS: TabTrackReport[] = [
  { semester: 'Semester 1', year: '2024-25', attendance: 82, marks: 245, cgpa: 8.2, status: 'locked' },
  { semester: 'Semester 2', year: '2024-25', attendance: 78, marks: 238, cgpa: 7.9, status: 'locked' },
  { semester: 'Semester 3', year: '2025-26', attendance: 85, marks: 252, cgpa: 8.4, status: 'locked' },
  { semester: 'Semester 4', year: '2025-26', attendance: 79, marks: null, cgpa: null, status: 'in_progress' },
]

// Demo data fallback (used when APIs are unavailable)
import {
  FEE_STRUCTURE as DEMO_FEE_STRUCTURE,
  TRANSACTIONS as DEMO_TRANSACTIONS,
  CURRENT_HOSTEL as DEMO_CURRENT_HOSTEL,
  HOSTEL_AMENITIES as DEMO_HOSTEL_AMENITIES,
  HOSTEL_HISTORY as DEMO_HOSTEL_HISTORY,
  MESS_MENU as DEMO_MESS_MENU,
  HOSTEL_EMERGENCY as DEMO_HOSTEL_EMERGENCY,
  SPORTS_FACILITIES as DEMO_SPORTS_FACILITIES,
  SPORTS_EVENTS as DEMO_SPORTS_EVENTS,
  SPORTS_ACHIEVEMENTS as DEMO_SPORTS_ACHIEVEMENTS,
} from './data'

// ==================== Provider ====================

export function StudentDashboardProvider({ children }: { children: ReactNode }) {
  const raw = useStudentDashboard()

  // Fetch fees, hostel, sports data from APIs
  const [feeData, setFeeData] = useState<any>(null)
  const [hostelData, setHostelData] = useState<any>(null)
  const [sportsData, setSportsData] = useState<any>(null)

  useEffect(() => {
    const fetchExtraData = async () => {
      const [feeRes, hostelRes, sportsRes] = await Promise.allSettled([
        apiClient.get('/fees'),
        apiClient.get('/hostel'),
        apiClient.get('/sports'),
      ])
      if (feeRes.status === 'fulfilled' && feeRes.value.success) setFeeData(feeRes.value.data)
      if (hostelRes.status === 'fulfilled' && hostelRes.value.success) setHostelData(hostelRes.value.data)
      if (sportsRes.status === 'fulfilled' && sportsRes.value.success) setSportsData(sportsRes.value.data)
    }
    fetchExtraData()
  }, [])

  const subjects = transformSubjects(raw)
  const marks = transformMarks(raw)
  const assignments = transformAssignments(raw)
  const trackReports = transformTrackReports(raw)

  // Use API data with demo fallback
  const feeRecords = feeData?.feeRecords || DEMO_FEE_STRUCTURE
  const transactions = feeData?.transactions || DEMO_TRANSACTIONS
  const currentHostel = hostelData?.currentAllocation || DEMO_CURRENT_HOSTEL
  const hostelHistory = hostelData?.history || DEMO_HOSTEL_HISTORY
  const hostelAmenities = hostelData?.amenities || DEMO_HOSTEL_AMENITIES
  const messMenu = hostelData?.messMenu || DEMO_MESS_MENU
  const hostelEmergency = hostelData?.emergencyContacts || DEMO_HOSTEL_EMERGENCY
  const sportsFacilities = sportsData?.facilities || DEMO_SPORTS_FACILITIES
  const sportsEvents = sportsData?.events || DEMO_SPORTS_EVENTS
  const sportsAchievements = sportsData?.achievements || DEMO_SPORTS_ACHIEVEMENTS

  const value: StudentDashboardContextValue = {
    raw,
    subjects,
    marks,
    assignments,
    trackReports,
    feeStructure: feeRecords,
    transactions,
    currentHostel,
    hostelAmenities,
    hostelHistory,
    messMenu,
    hostelEmergency,
    sportsFacilities,
    sportsEvents,
    sportsAchievements,
  }

  return (
    <StudentDashboardContext.Provider value={value}>
      {children}
    </StudentDashboardContext.Provider>
  )
}

export default StudentDashboardProvider
