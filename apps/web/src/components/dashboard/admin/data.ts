// ==================== Admin Dashboard Data Types & Fallback Data ====================

import type { ComponentType } from 'react'
import { AlertTriangle, Layers, Clock, Gauge, Users, Award, FileCheck, BarChart3 } from 'lucide-react'

// ===== Shared Types =====

export type AdminTab = 'overview' | 'workflows' | 'students' | 'faculty' | 'requests' | 'coordination' | 'analytics' | 'complaints' | 'announcements' | 'compliance' | 'settings'
export type WorkflowType = 'student' | 'faculty' | 'admin'
export type WorkflowStatus = 'created' | 'in_progress' | 'under_review' | 'done' | 'delayed' | 'locked'
export type Priority = 'low' | 'medium' | 'high' | 'critical'
export type RequestStatus = 'pending' | 'approved' | 'rejected'
export type RequestType = 'leave' | 'issue' | 'permission' | 'certificate'
export type ComplaintStatus = 'pending' | 'in_progress' | 'resolved'
export type ComplaintType = 'student' | 'faculty'
export type AnnouncementTarget = 'students' | 'faculty' | 'both'
export type CoordinationStatus = 'created' | 'in_progress' | 'under_review' | 'done'
export type CoordinationType = 'exam' | 'documentation' | 'admin' | 'meeting' | 'procurement'

export interface OverviewStat {
  label: string
  value: string
  sub: string
  icon: ComponentType<{ className?: string }>
  color: 'red' | 'blue' | 'amber' | 'purple'
}

export interface QuickAction {
  label: string
  icon: ComponentType<{ className?: string }>
  href: string
  color: 'blue' | 'green' | 'amber' | 'purple'
}

export interface WorkflowItem {
  id: string
  type: WorkflowType
  title: string
  description: string
  status: WorkflowStatus
  assignee?: string
  batch?: string
  subject?: string
  dueDate?: string
  priority: Priority
}

export interface ColumnDef {
  id: WorkflowStatus
  label: string
  color: string
}

export interface StudentItem {
  id: string
  name: string
  roll: string
  email: string
  phone: string
  batch: string
  attendance: number
  cgpa: number
  status: string
  riskLevel?: string
  pending: number
  eligible: boolean
  feeStatus: string
  hostelStatus: string
  section: string
}

export interface FacultyItem {
  id: string
  name: string
  role: string
  email: string
  phone: string
  specialization: string
  workload: number
  batches: number
  status: string
}

export interface RequestItem {
  id: string
  type: RequestType
  title: string
  student: string
  roll: string
  batch: string
  status: RequestStatus
  priority: Priority
  date: string
}

export interface CoordinationTask {
  id: string
  title: string
  type: CoordinationType
  status: CoordinationStatus
  assignee: string
  priority: Priority
  dueDate?: string
}

export interface ComplaintItem {
  id: string
  type: ComplaintType
  title: string
  description: string
  student?: string
  batch?: string
  faculty?: string
  status: ComplaintStatus
  priority: Priority
  date: string
}

export interface AnnouncementItem {
  id: string
  title: string
  message: string
  target: AnnouncementTarget
  createdAt: string
  author: string
}

// ===== Fallback Data =====

export const OVERVIEW_STATS: OverviewStat[] = [
  { label: 'At Risk Students', value: '12', sub: 'Need attention', icon: AlertTriangle, color: 'red' as const },
  { label: 'Pending Tasks', value: '24', sub: 'Across department', icon: Layers, color: 'blue' as const },
  { label: 'Pending Approvals', value: '08', sub: 'Awaiting review', icon: Clock, color: 'amber' as const },
  { label: 'Faculty Load', value: '78%', sub: 'Avg workload', icon: Gauge, color: 'purple' as const },
]

export const QUICK_ACTIONS: QuickAction[] = [
  { label: 'All Students', icon: Users, href: '#students', color: 'blue' as const },
  { label: 'Faculty', icon: Award, href: '#faculty', color: 'green' as const },
  { label: 'Requests', icon: FileCheck, href: '#requests', color: 'amber' as const },
  { label: 'Analytics', icon: BarChart3, href: '#analytics', color: 'purple' as const },
]

export const WORKFLOWS: WorkflowItem[] = [
  { id: 'sw-1', type: 'student', title: 'Attendance - OS Lecture', description: 'Daily attendance for CSE-AIML', status: 'in_progress', assignee: 'Dr. Vineet Jain', batch: 'CSE-AIML', subject: 'Operating Systems', priority: 'high' },
  { id: 'sw-2', type: 'student', title: 'Assignment Submission - CN Lab', description: 'Routing protocol lab report', status: 'created', assignee: 'Dr. Priya', batch: 'CSE', subject: 'Computer Networks', priority: 'medium' },
  { id: 'sw-3', type: 'student', title: 'IA-1 Marks Entry', description: 'Internal marks for CSE-AIML', status: 'under_review', assignee: 'Dr. Vineet Jain', batch: 'CSE-AIML', subject: 'Operating Systems', dueDate: '2026-02-25', priority: 'high' },
  { id: 'sw-4', type: 'student', title: 'Leave Request - Student 45', description: 'Medical leave for 3 days', status: 'done', assignee: 'Dr. Amit Kumar', batch: 'CSE-AIML', priority: 'medium' },
  { id: 'fw-1', type: 'faculty', title: 'NBA Documentation', description: 'Accreditation documents', status: 'in_progress', assignee: 'Dr. Amit Kumar', priority: 'critical' },
  { id: 'fw-2', type: 'faculty', title: 'Exam Paper Setting', description: 'Mid-term question papers', status: 'delayed', assignee: 'Dr. Vineet Jain', dueDate: '2026-02-18', priority: 'high' },
  { id: 'fw-3', type: 'faculty', title: 'Syllabus Update - OS', description: 'Update as per AICTE guidelines', status: 'created', assignee: 'Dr. Vineet Jain', subject: 'Operating Systems', priority: 'medium' },
  { id: 'fw-4', type: 'faculty', title: 'Lab Assessment', description: 'Evaluate lab performances', status: 'done', assignee: 'Dr. Priya', priority: 'low' },
  { id: 'aw-1', type: 'admin', title: 'Department Budget', description: 'Prepare annual budget', status: 'in_progress', assignee: 'Admin', priority: 'high' },
  { id: 'aw-2', type: 'admin', title: 'Timetable Finalization', description: 'Semester timetable', status: 'done', assignee: 'Admin', priority: 'medium' },
  { id: 'aw-3', type: 'admin', title: 'Faculty Recruitment', description: 'Hire new faculty members', status: 'under_review', assignee: 'HOD', priority: 'critical' },
  { id: 'aw-4', type: 'admin', title: 'Infrastructure Upgrade', description: 'Lab equipment purchase', status: 'locked', assignee: 'Admin', priority: 'low' },
]

export const COLUMNS: ColumnDef[] = [
  { id: 'created', label: 'To Do', color: '#6366F1' },
  { id: 'in_progress', label: 'In Progress', color: '#F59E0B' },
  { id: 'under_review', label: 'Under Review', color: '#8B5CF6' },
  { id: 'done', label: 'Completed', color: '#10B981' },
  { id: 'delayed', label: 'Delayed', color: '#EF4444' },
  { id: 'locked', label: 'Locked', color: '#6B7280' },
]

export const STUDENT_DATA: StudentItem[] = [
  { id: '1', name: 'Rahul Sharma', roll: 'CS-AIML-045', email: 'rahul@example.com', phone: '+91 98765 43210', batch: 'CSE-AIML', attendance: 58, cgpa: 7.2, status: 'at_risk', riskLevel: 'high', pending: 3, eligible: false, feeStatus: 'paid', hostelStatus: 'day_scholar', section: 'A' },
  { id: '2', name: 'Priya Singh', roll: 'CS-023', email: 'priya@example.com', phone: '+91 98765 43211', batch: 'CSE', attendance: 62, cgpa: 8.1, status: 'at_risk', riskLevel: 'high', pending: 2, eligible: false, feeStatus: 'paid', hostelStatus: 'hostel', section: 'B' },
  { id: '3', name: 'Amit Kumar', roll: 'IT-067', email: 'amit@example.com', phone: '+91 98765 43212', batch: 'IT', attendance: 78, cgpa: 7.8, status: 'active', pending: 1, eligible: true, feeStatus: 'paid', hostelStatus: 'day_scholar', section: 'A' },
  { id: '4', name: 'Sneha Gupta', roll: 'CS-AIML-089', email: 'sneha@example.com', phone: '+91 98765 43213', batch: 'CSE-AIML', attendance: 85, cgpa: 8.9, status: 'active', pending: 0, eligible: true, feeStatus: 'paid', hostelStatus: 'hostel', section: 'A' },
  { id: '5', name: 'Vikram Patel', roll: 'CS-034', email: 'vikram@example.com', phone: '+91 98765 43214', batch: 'CSE', attendance: 70, cgpa: 7.5, status: 'at_risk', riskLevel: 'medium', pending: 1, eligible: true, feeStatus: 'pending', hostelStatus: 'day_scholar', section: 'B' },
  { id: '6', name: 'Ananya Reddy', roll: 'IT-012', email: 'ananya@example.com', phone: '+91 98765 43215', batch: 'IT', attendance: 92, cgpa: 9.1, status: 'active', pending: 0, eligible: true, feeStatus: 'paid', hostelStatus: 'hostel', section: 'A' },
  { id: '7', name: 'Raj Malhotra', roll: 'CS-056', email: 'raj@example.com', phone: '+91 98765 43216', batch: 'CSE', attendance: 88, cgpa: 8.4, status: 'active', pending: 0, eligible: true, feeStatus: 'paid', hostelStatus: 'day_scholar', section: 'A' },
  { id: '8', name: 'Kavya Nair', roll: 'CS-AIML-078', email: 'kavya@example.com', phone: '+91 98765 43217', batch: 'CSE-AIML', attendance: 95, cgpa: 9.3, status: 'active', pending: 0, eligible: true, feeStatus: 'paid', hostelStatus: 'hostel', section: 'B' },
]

export const FACULTY: FacultyItem[] = [
  { id: '1', name: 'Dr. Amit Kumar', role: 'HOD, CSE', email: 'amit@gjust.edu.in', phone: '+91 98765 43210', specialization: 'Machine Learning', workload: 85, batches: 2, status: 'active' },
  { id: '2', name: 'Dr. Vineet Jain', role: 'Assistant Professor', email: 'vineet@gjust.edu.in', phone: '+91 98765 43211', specialization: 'Operating Systems', workload: 78, batches: 3, status: 'active' },
  { id: '3', name: 'Dr. Priya Sharma', role: 'Assistant Professor', email: 'priya@gjust.edu.in', phone: '+91 98765 43212', specialization: 'Database Systems', workload: 72, batches: 2, status: 'active' },
  { id: '4', name: 'Dr. Suresh Kumar', role: 'Professor', email: 'suresh@gjust.edu.in', phone: '+91 98765 43213', specialization: 'Data Structures', workload: 68, batches: 2, status: 'active' },
  { id: '5', name: 'Dr. Rahul Verma', role: 'Assistant Professor', email: 'rahul@gjust.edu.in', phone: '+91 98765 43214', specialization: 'Computer Networks', workload: 65, batches: 2, status: 'on_leave' },
]

export const REQUESTS: RequestItem[] = [
  { id: '1', type: 'leave', title: 'Medical Leave - 3 Days', student: 'Rahul Sharma', roll: 'CS-AIML-045', batch: 'CSE-AIML', status: 'pending', priority: 'high', date: '2026-02-15' },
  { id: '2', type: 'leave', title: 'Family Function', student: 'Priya Singh', roll: 'CS-023', batch: 'CSE', status: 'pending', priority: 'medium', date: '2026-02-14' },
  { id: '3', type: 'issue', title: 'Attendance Correction', student: 'Amit Kumar', roll: 'IT-067', batch: 'IT', status: 'approved', priority: 'medium', date: '2026-02-13' },
  { id: '4', type: 'permission', title: 'Workshop Attendance', student: 'Sneha Gupta', roll: 'CS-AIML-089', batch: 'CSE-AIML', status: 'pending', priority: 'low', date: '2026-02-12' },
  { id: '5', type: 'certificate', title: 'Bonafide Certificate', student: 'Vikram Patel', roll: 'CS-034', batch: 'CSE', status: 'approved', priority: 'low', date: '2026-02-11' },
]

export const COORDINATION_TASKS: CoordinationTask[] = [
  { id: '1', title: 'Exam Paper Setting - Mid Term', type: 'exam', status: 'in_progress', assignee: 'Dr. Amit Kumar', priority: 'high', dueDate: '2026-02-20' },
  { id: '2', title: 'NBA Documentation Preparation', type: 'documentation', status: 'in_progress', assignee: 'Dr. Vineet Jain', priority: 'critical', dueDate: '2026-02-25' },
  { id: '3', title: 'Timetable Finalization - Semester 4', type: 'admin', status: 'done', assignee: 'Admin', priority: 'medium', dueDate: '2026-02-15' },
  { id: '4', title: 'Faculty Meeting Agenda', type: 'meeting', status: 'created', assignee: 'HOD', priority: 'low', dueDate: '2026-02-22' },
  { id: '5', title: 'Lab Equipment Purchase', type: 'procurement', status: 'under_review', assignee: 'Admin', priority: 'medium', dueDate: '2026-02-28' },
]

export const COMPLAINTS: ComplaintItem[] = [
  { id: '1', type: 'student', title: 'Lab Equipment Issue', description: 'Computer lab 3 has 5 computers not working', student: 'Rahul Sharma', batch: 'CSE-AIML', status: 'pending', priority: 'high', date: '2026-02-15' },
  { id: '2', type: 'faculty', title: 'WiFi Connectivity Issue', description: 'Staff room WiFi not working properly', faculty: 'Dr. Priya', status: 'in_progress', priority: 'medium', date: '2026-02-14' },
  { id: '3', type: 'student', title: 'Attendance Marking Error', description: 'Marked absent wrongly on Feb 10', student: 'Amit Kumar', batch: 'IT', status: 'resolved', priority: 'low', date: '2026-02-13' },
  { id: '4', type: 'student', title: 'Hostel Food Quality', description: 'Mess food quality has degraded', student: 'Priya Singh', batch: 'CSE', status: 'pending', priority: 'medium', date: '2026-02-12' },
  { id: '5', type: 'faculty', title: 'Parking Space Issue', description: 'Not enough parking for faculty', faculty: 'Dr. Suresh', status: 'pending', priority: 'low', date: '2026-02-11' },
]

export const ANNOUNCEMENTS: AnnouncementItem[] = [
  { id: '1', title: 'Mid-Term Examination Schedule', message: 'Mid-term exams will be held from March 1-5, 2026', target: 'both', createdAt: '2026-02-15', author: 'Admin' },
  { id: '2', title: 'Faculty Meeting', message: 'Monthly faculty meeting on Feb 20 at 2 PM', target: 'faculty', createdAt: '2026-02-14', author: 'HOD' },
  { id: '3', title: 'Holiday Notice', message: 'College closed on Feb 16 for Konark 2026', target: 'students', createdAt: '2026-02-13', author: 'Admin' },
  { id: '4', title: 'NBA Visit Preparation', message: 'All departments to prepare documentation for NBA visit', target: 'faculty', createdAt: '2026-02-12', author: 'HOD' },
]
