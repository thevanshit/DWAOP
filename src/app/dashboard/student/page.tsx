'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/common/DashboardLayout'
import OverviewTab from '@/components/dashboard/AdvancedOverview'
import AssignmentsTab from '@/components/dashboard/AssignmentsTab'
import AttendanceTab from '@/components/dashboard/AttendanceTab'
import MarksTab from '@/components/dashboard/MarksTab'
import RequestsTab from '@/components/dashboard/RequestsTab'
import TrackReportTab from '@/components/dashboard/TrackReportTab'
import MetricCard from '@/components/ui/MetricCard'
import StatusBadge from '@/components/ui/StatusBadge'
import SectionHeader from '@/components/ui/SectionHeader'
import AttendanceProgressBar from '@/components/ui/AttendanceProgressBar'
import SubjectCard from '@/components/ui/SubjectCard'
import AssignmentCard from '@/components/ui/AssignmentCard'
import {
  Home,
  FileText,
  Calendar,
  Award,
  ClipboardList,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  BookOpen,
  Bell,
  Users,
  ChevronRight,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  GraduationCap,
  CalendarDays,
  FileQuestion,
  AlertTriangle,
  Download,
  Lock
} from 'lucide-react'
import { UserRole } from '@/types'

const SUBJECTS = [
  { id: 1, name: 'Data Structures', code: 'CS301', attendance: 88, totalClasses: 25, presentClasses: 22, assignmentCompletion: 85, readinessScore: 90, lastClass: 'Feb 10', nextClass: 'Feb 15' },
  { id: 2, name: 'Database Systems', code: 'CS302', attendance: 72, totalClasses: 25, presentClasses: 18, assignmentCompletion: 60, readinessScore: 70, lastClass: 'Feb 12', nextClass: 'Feb 16' },
  { id: 3, name: 'Operating Systems', code: 'CS303', attendance: 65, totalClasses: 25, presentClasses: 16, assignmentCompletion: 50, readinessScore: 62, lastClass: 'Feb 11', nextClass: 'Feb 14' },
  { id: 4, name: 'Software Engineering', code: 'CS304', attendance: 92, totalClasses: 25, presentClasses: 23, assignmentCompletion: 95, readinessScore: 94, lastClass: 'Feb 13', nextClass: 'Feb 17' },
]

const TIMETABLE = [
  { day: 'Monday', slots: [{ time: '09:00-10:00', subject: 'Data Structures', room: 'A101' }, { time: '10:00-11:00', subject: 'Database Systems', room: 'A102' }, { time: '11:00-12:00', subject: 'Operating Systems', room: 'A103' }, { time: '02:00-04:00', subject: 'SE Lab', room: 'Lab-1' }] },
  { day: 'Tuesday', slots: [{ time: '09:00-10:00', subject: 'Operating Systems', room: 'A103' }, { time: '10:00-11:00', subject: 'Data Structures', room: 'A101' }, { time: '11:00-12:00', subject: 'Software Engineering', room: 'A104' }] },
  { day: 'Wednesday', slots: [{ time: '09:00-10:00', subject: 'Database Systems', room: 'A102' }, { time: '10:00-11:00', subject: 'Operating Systems', room: 'A103' }, { time: '11:00-12:00', subject: 'Data Structures', room: 'A101' }, { time: '02:00-04:00', subject: 'DBMS Lab', room: 'Lab-2' }] },
  { day: 'Thursday', slots: [{ time: '09:00-10:00', subject: 'Software Engineering', room: 'A104' }, { time: '10:00-11:00', subject: 'Database Systems', room: 'A102' }, { time: '11:00-12:00', subject: 'OS Lab', room: 'Lab-1' }] },
  { day: 'Friday', slots: [{ time: '09:00-10:00', subject: 'Data Structures', room: 'A101' }, { time: '10:00-11:00', subject: 'Software Engineering', room: 'A104' }, { time: '11:00-12:00', subject: 'Database Systems', room: 'A102' }] },
]

const ASSIGNMENTS: { id: number; subject: string; title: string; dueDate: string; status: 'pending' | 'submitted' | 'evaluated' | 'late'; maxMarks: number; submittedDate?: string; marks?: number }[] = [
  { id: 1, subject: 'Data Structures', title: 'Binary Tree Implementation', dueDate: '2026-02-15', status: 'pending', maxMarks: 100 },
  { id: 2, subject: 'Database Systems', title: 'SQL Queries Assignment', dueDate: '2026-02-18', status: 'submitted', maxMarks: 50, submittedDate: '2026-02-12' },
  { id: 3, subject: 'Operating Systems', title: 'Process Scheduling Essay', dueDate: '2026-02-20', status: 'pending', maxMarks: 75 },
  { id: 4, subject: 'Software Engineering', title: 'UML Diagram Design', dueDate: '2026-02-10', status: 'evaluated', maxMarks: 100, marks: 85 },
  { id: 5, subject: 'Data Structures', title: 'Graph Algorithms Quiz', dueDate: '2026-02-08', status: 'late', maxMarks: 25 },
]

const ATTENDANCE_DATA: { date: string; day: string; status: 'present' | 'absent'; time: string }[] = [
  { date: '2026-02-10', day: 'Mon', status: 'present', time: '09:00' },
  { date: '2026-02-10', day: 'Mon', status: 'present', time: '10:00' },
  { date: '2026-02-10', day: 'Mon', status: 'present', time: '11:00' },
  { date: '2026-02-10', day: 'Mon', status: 'absent', time: '14:00' },
  { date: '2026-02-11', day: 'Tue', status: 'present', time: '09:00' },
  { date: '2026-02-11', day: 'Tue', status: 'present', time: '10:00' },
  { date: '2026-02-11', day: 'Tue', status: 'absent', time: '11:00' },
  { date: '2026-02-12', day: 'Wed', status: 'present', time: '09:00' },
  { date: '2026-02-12', day: 'Wed', status: 'present', time: '10:00' },
  { date: '2026-02-12', day: 'Wed', status: 'present', time: '11:00' },
  { date: '2026-02-12', day: 'Wed', status: 'present', time: '14:00' },
  { date: '2026-02-13', day: 'Thu', status: 'present', time: '09:00' },
  { date: '2026-02-13', day: 'Thu', status: 'absent', time: '10:00' },
  { date: '2026-02-13', day: 'Thu', status: 'present', time: '11:00' },
]

const MARKS: { subject: string; subjectCode?: string; minor1: number | null; minor2: number | null; assignment: number | null; total: number | null; status: string }[] = [
  { subject: 'Data Structures', subjectCode: 'CS301', minor1: 85, minor2: 78, assignment: 90, total: 253, status: 'finalized' },
  { subject: 'Database Systems', subjectCode: 'CS302', minor1: 72, minor2: 80, assignment: 75, total: 227, status: 'under_review' },
  { subject: 'Operating Systems', subjectCode: 'CS303', minor1: 68, minor2: null, assignment: null, total: 68, status: 'draft' },
  { subject: 'Software Engineering', subjectCode: 'CS304', minor1: 88, minor2: 92, assignment: 85, total: 265, status: 'finalized' },
]

const ANNOUNCEMENTS = [
  { id: 1, title: 'Internal Exam Schedule Released', message: 'Minor 2 exams will be held from March 1-5. Check detailed schedule on portal.', date: '2026-02-12', category: 'exam', priority: 'high', author: 'Dr. Sharma' },
  { id: 2, title: 'Holiday on 14th February', message: 'College will remain closed on Valentine\'s Day.', date: '2026-02-11', category: 'holiday', priority: 'medium', author: 'Admin' },
  { id: 3, title: 'Assignment Deadline Extended', message: 'DBMS assignment deadline extended to Feb 20 due to server issues.', date: '2026-02-10', category: 'academic', priority: 'low', author: 'Prof. Kumar' },
  { id: 4, title: 'Guest Lecture on AI/ML', message: 'Industry expert from Google will deliver a lecture on Feb 18 at 2 PM.', date: '2026-02-09', category: 'general', priority: 'medium', author: 'HOD CSE' },
]

const UPCOMING_CLASSES = [
  { date: '2026-02-14', day: 'Today', classes: [{ time: '09:00 AM', subject: 'Data Structures', room: 'A101', faculty: 'Dr. Sharma' }, { time: '10:00 AM', subject: 'Database Systems', room: 'A102', faculty: 'Prof. Kumar' }] },
  { date: '2026-02-15', day: 'Tomorrow', classes: [{ time: '09:00 AM', subject: 'Operating Systems', room: 'A103', faculty: 'Dr. Singh' }, { time: '11:00 AM', subject: 'Software Engineering', room: 'A104', faculty: 'Prof. Verma' }] },
  { date: '2026-02-17', day: 'Monday', classes: [{ time: '09:00 AM', subject: 'Data Structures', room: 'A101', faculty: 'Dr. Sharma' }, { time: '02:00 PM', subject: 'SE Lab', room: 'Lab-1', faculty: 'Prof. Verma' }] },
]

const TRACK_REPORTS = [
  { semester: 'Semester 1', year: '2024-25', attendance: 82, marks: 245, cgpa: 8.2, status: 'locked' },
  { semester: 'Semester 2', year: '2024-25', attendance: 78, marks: 238, cgpa: 7.9, status: 'locked' },
  { semester: 'Semester 3', year: '2025-26', attendance: 85, marks: 252, cgpa: 8.4, status: 'locked' },
  { semester: 'Semester 4', year: '2025-26', attendance: 79, marks: null, cgpa: null, status: 'in_progress' },
]

const REQUESTS = [
  { id: 1, type: 'leave', subject: 'Medical Leave', date: '2026-02-10', status: 'approved', description: 'Medical leave for 2 days' },
  { id: 2, type: 'issue', subject: 'Attendance Correction', date: '2026-02-08', status: 'pending', description: 'Missed class on 6th Feb due to medical emergency' },
]

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const userRole: UserRole = 'student'

  const navItems = [
    { label: 'Overview', icon: <Home className="w-5 h-5" />, href: '#overview', section: 'Dashboard' },
    { label: 'Assignments', icon: <FileText className="w-5 h-5" />, href: '#assignments', badge: 2, section: 'Dashboard' },
    { label: 'Attendance', icon: <Calendar className="w-5 h-5" />, href: '#attendance', section: 'Dashboard' },
    { label: 'Marks', icon: <Award className="w-5 h-5" />, href: '#marks', section: 'Dashboard' },
    { label: 'Requests', icon: <ClipboardList className="w-5 h-5" />, href: '#requests', badge: 1, section: 'Academic' },
    { label: 'Track Report', icon: <TrendingUp className="w-5 h-5" />, href: '#track', section: 'Academic' },
  ]

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '') || 'overview'
      setActiveTab(hash)
    }
    handleHash()
    window.addEventListener('hashchange', handleHash)
    return () => window.removeEventListener('hashchange', handleHash)
  }, [])

  const getEligibilityStatus = (attendance: number) => {
    if (attendance >= 75) return { status: 'Eligible', color: 'green', icon: <CheckCircle className="w-4 h-4" /> }
    if (attendance >= 65) return { status: 'At Risk', color: 'yellow', icon: <AlertCircle className="w-4 h-4" /> }
    return { status: 'Not Eligible', color: 'red', icon: <XCircle className="w-4 h-4" /> }
  }

  return (
    <DashboardLayout role={userRole} roleLabel="Student" navItems={navItems}>
      <DashboardContent activeTab={activeTab} />
    </DashboardLayout>
  )
}

function DashboardContent({ activeTab }: { activeTab: string }) {
  const studentInfo = {
    name: 'Vanshit Gaur',
    rollNumber: '21SCSE1010XXX',
    semester: 4,
    section: 'A',
    branch: 'Computer Science & Engineering'
  }

  const quickStats = [
    { label: 'Attendance', value: '79%', sub: 'Above 75%', icon: <Calendar className="w-5 h-5" />, color: 'green', trend: 'up' },
    { label: 'CGPA', value: '8.4', sub: 'Out of 10.0', icon: <Award className="w-5 h-5" />, color: 'blue', trend: 'up' },
    { label: 'Pending', value: '2', sub: 'Assignments', icon: <FileText className="w-5 h-5" />, color: 'amber', trend: 'down' },
    { label: 'Rank', value: '#12', sub: 'In Class', icon: <TrendingUp className="w-5 h-5" />, color: 'purple', trend: 'up' },
  ]

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
  }

  if (activeTab === 'overview') {
    return (
      <div className="space-y-6">
        {/* Hero Header */}
        <div className="bg-gradient-to-br from-white via-gray-50 to-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 bg-gradient-to-br from-[var(--color-primary)] to-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-blue-500/20">
                {studentInfo.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{getGreeting()}, {studentInfo.name.split(' ')[0]}!</h1>
                <p className="text-gray-500 mt-1">Semester {studentInfo.semester} • Section {studentInfo.section} • {studentInfo.branch}</p>
                <div className="flex items-center gap-3 mt-3">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">Roll: {studentInfo.rollNumber}</span>
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">Active</span>
                </div>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-3">
              <button className="p-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                <Bell className="w-5 h-5 text-gray-600" />
              </button>
              <button className="px-4 py-2.5 bg-[var(--color-primary)] text-white text-sm font-medium rounded-xl hover:bg-[var(--color-primary-dark)] flex items-center gap-2 shadow-lg shadow-blue-500/20">
                <FileText className="w-4 h-4" />
                View Profile
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickStats.map((stat, idx) => (
            <div key={idx} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-500 font-medium">{stat.label}</span>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  stat.color === 'green' ? 'bg-green-50 text-green-600' :
                  stat.color === 'blue' ? 'bg-blue-50 text-blue-600' :
                  stat.color === 'amber' ? 'bg-amber-50 text-amber-600' :
                  'bg-purple-50 text-purple-600'
                }`}>
                  {stat.icon}
                </div>
              </div>
              <div className="flex items-end justify-between">
                <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
                {stat.trend && (
                  <span className={`text-xs flex items-center mb-1 ${
                    stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-400 mt-1">{stat.sub}</p>
            </div>
          ))}
        </div>

        <OverviewTab
          subjects={SUBJECTS}
          announcements={ANNOUNCEMENTS}
          upcomingClasses={UPCOMING_CLASSES}
          timetable={TIMETABLE}
          isCR={false}
        />
      </div>
    )
  }

  if (activeTab === 'assignments') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Assignments</h2>
            <p className="text-gray-500 mt-1">Track and submit your assignments</p>
          </div>
        </div>
        <AssignmentsTab assignments={ASSIGNMENTS} />
      </div>
    )
  }

  if (activeTab === 'attendance') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Attendance</h2>
            <p className="text-gray-500 mt-1">Monitor your class attendance</p>
          </div>
        </div>
        <AttendanceTab subjects={SUBJECTS} attendanceData={ATTENDANCE_DATA} />
      </div>
    )
  }

  if (activeTab === 'marks') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Marks & Grades</h2>
            <p className="text-gray-500 mt-1">View your internal assessment marks</p>
          </div>
        </div>
        <MarksTab marks={MARKS} />
      </div>
    )
  }

  if (activeTab === 'requests') {
    return <RequestsSection />
  }

  if (activeTab === 'track') {
    return <TrackReportSection />
  }

  return null
}

function RequestsSection() {
  const [activeRequestTab, setActiveRequestTab] = useState('leave')
  
  const requestTabs = [
    { id: 'leave', label: 'Leave Application', icon: <CalendarDays className="w-4 h-4" />, count: 2 },
    { id: 'issue', label: 'Report Issue', icon: <AlertTriangle className="w-4 h-4" />, count: 1 },
    { id: 'permission', label: 'Academic Permission', icon: <GraduationCap className="w-4 h-4" />, count: 0 },
    { id: 'clarification', label: 'Clarification', icon: <FileQuestion className="w-4 h-4" />, count: 0 },
    { id: 'certificate', label: 'Certificates', icon: <Award className="w-4 h-4" />, count: 0 },
  ]

  const allRequests = [
    { id: 1, type: 'leave', subject: 'Medical Leave', date: '2026-02-10', status: 'approved', description: 'Medical leave for 2 days', appliedDate: 'Feb 10, 2026' },
    { id: 2, type: 'issue', subject: 'Attendance Correction', date: '2026-02-08', status: 'pending', description: 'Missed class on 6th Feb due to medical emergency', appliedDate: 'Feb 8, 2026' },
    { id: 3, type: 'leave', subject: 'Family Function', date: '2026-01-25', status: 'approved', description: 'Attendance correction for family function', appliedDate: 'Jan 25, 2026' },
    { id: 4, type: 'permission', subject: 'Workshop Attendance', date: '2026-01-20', status: 'rejected', description: 'Permission to attend external workshop', appliedDate: 'Jan 20, 2026' },
  ]

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-700'
      case 'pending': return 'bg-yellow-100 text-yellow-700'
      case 'rejected': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Requests & Applications</h2>
          <p className="text-sm text-gray-500 mt-1">Submit and track your requests</p>
        </div>
        <button className="px-4 py-2.5 bg-[var(--color-primary)] text-white text-sm font-medium rounded-xl hover:bg-[var(--color-primary-dark)] flex items-center gap-2 shadow-lg shadow-blue-500/20">
          <Plus className="w-4 h-4" />
          New Request
        </button>
      </div>

      {/* Request Type Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {requestTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveRequestTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
              activeRequestTab === tab.id
                ? 'bg-[var(--color-primary)] text-white shadow-md'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300'
            }`}
          >
            {tab.icon}
            {tab.label}
            {tab.count > 0 && (
              <span className={`ml-1 px-1.5 py-0.5 rounded-full text-xs ${activeRequestTab === tab.id ? 'bg-white/20 text-white' : 'bg-red-500 text-white'}`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Request Cards */}
      <div className="space-y-4">
        {allRequests.filter(r => r.type === activeRequestTab || activeRequestTab === 'leave').length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ClipboardList className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 font-medium">No requests in this category</p>
            <button className="mt-4 px-4 py-2 text-sm font-medium text-[var(--color-primary)] hover:underline">
              Submit a new request
            </button>
          </div>
        ) : (
          allRequests.filter(r => r.type === activeRequestTab || activeRequestTab === 'leave').map((req) => (
            <div key={req.id} className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-semibold text-gray-900">{req.subject}</p>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusStyle(req.status)}`}>
                      {req.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{req.description}</p>
                  <p className="text-xs text-gray-400">Applied on: {req.appliedDate}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

function TrackReportSection() {
  const [selectedSemester, setSelectedSemester] = useState(3)

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'locked': return { bg: 'bg-gray-100', text: 'text-gray-600', icon: <Lock className="w-4 h-4" /> }
      case 'in_progress': return { bg: 'bg-blue-100', text: 'text-blue-700', icon: <Clock className="w-4 h-4" /> }
      default: return { bg: 'bg-green-100', text: 'text-green-700', icon: <CheckCircle className="w-4 h-4" /> }
    }
  }

  const currentReport = TRACK_REPORTS[selectedSemester]
  const previousReports = TRACK_REPORTS.slice(0, selectedSemester)

  const avgAttendance = Math.round(previousReports.reduce((sum, r) => sum + r.attendance, 0) / previousReports.length)
  const avgMarks = Math.round(previousReports.reduce((sum, r) => sum + (r.marks || 0), 0) / previousReports.length)
  const avgCGPA = (previousReports.reduce((sum, r) => sum + (r.cgpa || 0), 0) / previousReports.length).toFixed(1)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Track Report</h2>
        <p className="text-sm text-gray-500 mt-1">View your academic progress across all semesters</p>
      </div>

      {/* Semester Selector */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {TRACK_REPORTS.map((report, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedSemester(idx)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
              selectedSemester === idx
                ? 'bg-[var(--color-primary)] text-white shadow-md'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300'
            }`}
          >
            {report.status === 'locked' && <Lock className="w-4 h-4" />}
            {report.semester}
          </button>
        ))}
      </div>

      {/* Current Semester Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-500 font-medium">Attendance</span>
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{currentReport.attendance || 0}%</p>
          <p className="text-xs text-gray-500 mt-1">Current Semester</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-500 font-medium">Total Marks</span>
            <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{currentReport.marks || '—'}</p>
          <p className="text-xs text-gray-500 mt-1">Out of 300</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-500 font-medium">CGPA</span>
            <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
              <GraduationCap className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{currentReport.cgpa || '—'}</p>
          <p className="text-xs text-gray-500 mt-1">Out of 10.0</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-500 font-medium">Status</span>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${getStatusStyle(currentReport.status).bg} ${getStatusStyle(currentReport.status).text}`}>
              {getStatusStyle(currentReport.status).icon}
            </div>
          </div>
          <p className={`text-lg font-bold ${getStatusStyle(currentReport.status).text}`}>
            {currentReport.status === 'in_progress' ? 'In Progress' : currentReport.status === 'locked' ? 'Locked' : 'Active'}
          </p>
          <p className="text-xs text-gray-500 mt-1">{currentReport.year}</p>
        </div>
      </div>

      {/* Cumulative Stats (Only show if past semesters exist) */}
      {selectedSemester > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 p-5">
          <h3 className="font-semibold text-gray-900 mb-4">Cumulative Performance (Sem 1 - {currentReport.semester.replace('Semester ', 'Sem ')})</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{avgAttendance}%</p>
              <p className="text-xs text-gray-600">Avg Attendance</p>
            </div>
            <div className="text-center border-l border-blue-200">
              <p className="text-2xl font-bold text-purple-600">{avgMarks}</p>
              <p className="text-xs text-gray-600">Avg Marks</p>
            </div>
            <div className="text-center border-l border-blue-200">
              <p className="text-2xl font-bold text-green-600">{avgCGPA}</p>
              <p className="text-xs text-gray-600">Avg CGPA</p>
            </div>
          </div>
        </div>
      )}

      {/* Semester Progress Timeline */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">Semester Progress</h3>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between">
            {['Draft', 'Submitted', 'Review', 'Finalized', 'Locked'].map((step, idx) => {
              const stepStatus = currentReport.status === 'locked' ? 'completed' : 
                idx < 4 ? 'current' : 'pending'
              return (
                <div key={idx} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                    stepStatus === 'completed' ? 'bg-green-500 text-white' :
                    stepStatus === 'current' ? 'bg-blue-500 text-white ring-4 ring-blue-100' :
                    'bg-gray-100 text-gray-400'
                  }`}>
                    {stepStatus === 'completed' ? <CheckCircle className="w-5 h-5" /> : idx + 1}
                  </div>
                  {idx < 4 && (
                    <div className={`w-16 h-1 mx-2 rounded ${stepStatus === 'completed' ? 'bg-green-500' : 'bg-gray-200'}`} />
                  )}
                </div>
              )
            })}
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-4">
            <span>Draft</span>
            <span>Submitted</span>
            <span>Under Review</span>
            <span>Finalized</span>
            <span>Locked</span>
          </div>
        </div>
      </div>

      {/* Semester History */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Semester History</h3>
          <button className="text-sm text-[var(--color-primary)] font-medium flex items-center gap-1 hover:underline">
            <Download className="w-4 h-4" /> Download Report
          </button>
        </div>
        <div className="divide-y divide-gray-100">
          {TRACK_REPORTS.map((report, idx) => (
            <div key={idx} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  report.status === 'locked' ? 'bg-gray-100 text-gray-500' : 'bg-blue-100 text-blue-600'
                }`}>
                  {report.status === 'locked' ? <Lock className="w-6 h-6" /> : <Clock className="w-6 h-6" />}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{report.semester}</p>
                  <p className="text-xs text-gray-500">{report.year}</p>
                </div>
              </div>
              <div className="flex items-center gap-8">
                <div className="text-center">
                  <p className="text-sm font-bold text-gray-900">{report.attendance}%</p>
                  <p className="text-xs text-gray-500">Attendance</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-gray-900">{report.marks || '—'}</p>
                  <p className="text-xs text-gray-500">Marks</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-gray-900">{report.cgpa || '—'}</p>
                  <p className="text-xs text-gray-500">CGPA</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
