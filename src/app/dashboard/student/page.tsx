'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/common/DashboardLayout'
import OverviewTab from '@/components/dashboard/OverviewTab'
import TimetableViewer from '@/components/dashboard/TimetableViewer'
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
  Lock,
  Sparkles,
  Target,
  Activity,
  BookMarked
} from 'lucide-react'
import { UserRole } from '@/types'

const SUBJECTS = [
  { id: 1, name: 'Data Structures', code: 'CS301', attendance: 88, totalClasses: 25, presentClasses: 22, assignmentCompletion: 85, readinessScore: 90, lastClass: 'Feb 10', nextClass: 'Feb 15' },
  { id: 2, name: 'Database Systems', code: 'CS302', attendance: 80, totalClasses: 25, presentClasses: 20, assignmentCompletion: 60, readinessScore: 70, lastClass: 'Feb 12', nextClass: 'Feb 16' },
  { id: 3, name: 'Operating Systems', code: 'CS303', attendance: 84, totalClasses: 25, presentClasses: 21, assignmentCompletion: 50, readinessScore: 62, lastClass: 'Feb 11', nextClass: 'Feb 14' },
  { id: 4, name: 'Software Engineering', code: 'CS304', attendance: 92, totalClasses: 25, presentClasses: 23, assignmentCompletion: 95, readinessScore: 94, lastClass: 'Feb 13', nextClass: 'Feb 17' },
  { id: 5, name: 'Computer Networks', code: 'CS305', attendance: 76, totalClasses: 25, presentClasses: 19, assignmentCompletion: 70, readinessScore: 75, lastClass: 'Feb 12', nextClass: 'Feb 16' },
  { id: 6, name: 'Web Technologies', code: 'CS306', attendance: 84, totalClasses: 25, presentClasses: 21, assignmentCompletion: 80, readinessScore: 82, lastClass: 'Feb 14', nextClass: 'Feb 18' },
]

const TIMETABLE = [
  { day: 'Monday', slots: [{ time: '09:00-10:00', subject: 'Data Structures', room: 'A101' }, { time: '10:00-11:00', subject: 'Database Systems', room: 'A102' }, { time: '11:00-12:00', subject: 'Operating Systems', room: 'A103' }, { time: '02:00-04:00', subject: 'SE Lab', room: 'Lab-1' }] },
  { day: 'Tuesday', slots: [{ time: '09:00-10:00', subject: 'Operating Systems', room: 'A103' }, { time: '10:00-11:00', subject: 'Data Structures', room: 'A101' }, { time: '11:00-12:00', subject: 'Software Engineering', room: 'A104' }] },
  { day: 'Wednesday', slots: [{ time: '09:00-10:00', subject: 'Database Systems', room: 'A102' }, { time: '10:00-11:00', subject: 'Operating Systems', room: 'A103' }, { time: '11:00-12:00', subject: 'Data Structures', room: 'A101' }, { time: '02:00-04:00', subject: 'DBMS Lab', room: 'Lab-2' }] },
  { day: 'Thursday', slots: [{ time: '09:00-10:00', subject: 'Software Engineering', room: 'A104' }, { time: '10:00-11:00', subject: 'Database Systems', room: 'A102' }, { time: '11:00-12:00', subject: 'OS Lab', room: 'Lab-1' }] },
  { day: 'Friday', slots: [{ time: '09:00-10:00', subject: 'Data Structures', room: 'A101' }, { time: '10:00-11:00', subject: 'Software Engineering', room: 'A104' }, { time: '11:00-12:00', subject: 'Database Systems', room: 'A102' }] },
]

const SUBJECTS_DATA = [
  { code: 'DBMS', name: 'Database Management System', category: 'theory' },
  { code: 'OS', name: 'Operating System', category: 'theory' },
  { code: 'SE', name: 'Software Engineering', category: 'theory' },
  { code: 'AI', name: 'Artificial Intelligence', category: 'theory' },
  { code: 'DM', name: 'Data Mining', category: 'theory' },
  { code: 'DLCD', name: 'Digital Logic & Computer Design', category: 'theory' },
  { code: 'DBMS LAB', name: 'DBMS Lab', category: 'lab' },
  { code: 'DM LAB', name: 'Data Mining Lab', category: 'lab' },
  { code: 'PY LAB', name: 'Python Lab', category: 'lab' },
]

const ASSIGNMENTS: { id: number; subject: string; category: 'theory' | 'lab'; title: string; description: string; type: 'project' | 'coding' | 'documentation' | 'questions'; submissionType: 'github' | 'file' | 'text'; dueDate: string; status: 'pending' | 'submitted' | 'evaluated' | 'late'; maxMarks: number; submittedDate?: string; marks?: number; githubLink?: string }[] = [
  { id: 1, subject: 'DBMS', category: 'theory', title: 'SQL Optimization Assignment', description: 'Optimize the given SQL queries for better performance', type: 'coding', submissionType: 'file', dueDate: '2026-02-20', status: 'pending', maxMarks: 50 },
  { id: 2, subject: 'DBMS', category: 'theory', title: 'ER Diagram Design', description: 'Create ER diagram for online bookstore system', type: 'project', submissionType: 'file', dueDate: '2026-02-12', status: 'submitted', maxMarks: 75, submittedDate: '2026-02-10' },
  { id: 3, subject: 'DBMS', category: 'theory', title: 'Normalization Quiz', description: 'Complete the normalization exercises', type: 'questions', submissionType: 'text', dueDate: '2026-02-08', status: 'evaluated', maxMarks: 25, marks: 22 },
  { id: 4, subject: 'OS', category: 'theory', title: 'Process Scheduling Report', description: 'Write a detailed report on CPU scheduling algorithms', type: 'documentation', submissionType: 'text', dueDate: '2026-02-25', status: 'pending', maxMarks: 50 },
  { id: 5, subject: 'OS', category: 'theory', title: 'Memory Management Essay', description: 'Explain paging and segmentation techniques', type: 'documentation', submissionType: 'text', dueDate: '2026-02-15', status: 'submitted', maxMarks: 30, submittedDate: '2026-02-14' },
  { id: 6, subject: 'SE', category: 'theory', title: 'UML System Design', description: 'Create UML diagrams for library management system', type: 'project', submissionType: 'file', dueDate: '2026-03-01', status: 'pending', maxMarks: 100 },
  { id: 7, subject: 'SE', category: 'theory', title: 'SDLC Documentation', description: 'Document all phases of SDLC for the given project', type: 'documentation', submissionType: 'file', dueDate: '2026-02-10', status: 'evaluated', maxMarks: 50, marks: 45 },
  { id: 8, subject: 'AI', category: 'theory', title: 'Search Algorithms Project', description: 'Implement BFS and DFS for puzzle solving', type: 'project', submissionType: 'github', dueDate: '2026-02-28', status: 'pending', maxMarks: 75 },
  { id: 9, subject: 'AI', category: 'theory', title: 'ML Basics Quiz', description: 'Complete the machine learning fundamentals quiz', type: 'questions', submissionType: 'text', dueDate: '2026-02-18', status: 'submitted', maxMarks: 25, submittedDate: '2026-02-17' },
  { id: 10, subject: 'DM', category: 'theory', title: 'Clustering Analysis', description: 'Perform K-means clustering on given dataset', type: 'project', submissionType: 'file', dueDate: '2026-02-22', status: 'pending', maxMarks: 50 },
  { id: 11, subject: 'DM', category: 'theory', title: 'Association Rules Report', description: 'Write report on market basket analysis', type: 'documentation', submissionType: 'text', dueDate: '2026-02-05', status: 'late', maxMarks: 30, submittedDate: '2026-02-07' },
  { id: 12, subject: 'DLCD', category: 'theory', title: 'Boolean Algebra Worksheet', description: 'Solve boolean expression problems', type: 'questions', submissionType: 'text', dueDate: '2026-02-20', status: 'pending', maxMarks: 25 },
  { id: 13, subject: 'DLCD', category: 'theory', title: 'Circuit Design Assignment', description: 'Design sequential circuit for given specifications', type: 'coding', submissionType: 'file', dueDate: '2026-02-12', status: 'evaluated', maxMarks: 50, marks: 42 },
  { id: 14, subject: 'DBMS LAB', category: 'lab', title: 'SQL Queries Lab', description: 'Write complex SQL queries using joins and subqueries', type: 'coding', submissionType: 'file', dueDate: '2026-02-18', status: 'submitted', maxMarks: 30, submittedDate: '2026-02-16' },
  { id: 15, subject: 'DBMS LAB', category: 'lab', title: 'Database Design Project', description: 'Design and implement a complete database system', type: 'project', submissionType: 'file', dueDate: '2026-03-05', status: 'pending', maxMarks: 75 },
  { id: 16, subject: 'DM LAB', category: 'lab', title: 'Data Preprocessing Lab', description: 'Clean and preprocess the given dataset using Python', type: 'coding', submissionType: 'github', dueDate: '2026-02-25', status: 'pending', maxMarks: 50 },
  { id: 17, subject: 'DM LAB', category: 'lab', title: 'Classification Model Lab', description: 'Build classification model using scikit-learn', type: 'project', submissionType: 'github', dueDate: '2026-02-10', status: 'evaluated', maxMarks: 50, marks: 48 },
  { id: 18, subject: 'PY LAB', category: 'lab', title: 'Flask REST API', description: 'Create REST API using Flask framework', type: 'project', submissionType: 'github', dueDate: '2026-02-22', status: 'pending', maxMarks: 75 },
  { id: 19, subject: 'PY LAB', category: 'lab', title: 'NumPy Exercises', description: 'Complete NumPy array manipulation exercises', type: 'coding', submissionType: 'file', dueDate: '2026-02-08', status: 'late', maxMarks: 25 },
  { id: 20, subject: 'PY LAB', category: 'lab', title: 'Pandas Data Analysis', description: 'Analyze given dataset using Pandas', type: 'coding', submissionType: 'github', dueDate: '2026-02-15', status: 'submitted', maxMarks: 50, submittedDate: '2026-02-14' },
]

const ATTENDANCE_DATA: { date: string; day: string; status: 'present' | 'absent'; time: string; subject: string }[] = [
  { date: '2026-02-10', day: 'Mon', status: 'present', time: '09:00', subject: 'Data Structures' },
  { date: '2026-02-10', day: 'Mon', status: 'present', time: '10:00', subject: 'Database Systems' },
  { date: '2026-02-10', day: 'Mon', status: 'present', time: '11:00', subject: 'Operating Systems' },
  { date: '2026-02-10', day: 'Mon', status: 'absent', time: '14:00', subject: 'SE Lab' },
  { date: '2026-02-11', day: 'Tue', status: 'present', time: '09:00', subject: 'Operating Systems' },
  { date: '2026-02-11', day: 'Tue', status: 'present', time: '10:00', subject: 'Data Structures' },
  { date: '2026-02-11', day: 'Tue', status: 'absent', time: '11:00', subject: 'Software Engineering' },
  { date: '2026-02-12', day: 'Wed', status: 'present', time: '09:00', subject: 'Database Systems' },
  { date: '2026-02-12', day: 'Wed', status: 'present', time: '10:00', subject: 'Operating Systems' },
  { date: '2026-02-12', day: 'Wed', status: 'present', time: '11:00', subject: 'Data Structures' },
  { date: '2026-02-12', day: 'Wed', status: 'present', time: '14:00', subject: 'DBMS Lab' },
  { date: '2026-02-13', day: 'Thu', status: 'present', time: '09:00', subject: 'Software Engineering' },
  { date: '2026-02-13', day: 'Thu', status: 'absent', time: '10:00', subject: 'Database Systems' },
  { date: '2026-02-13', day: 'Thu', status: 'present', time: '11:00', subject: 'AI' },
]

const MARKS: { subject: string; subjectCode?: string; minor1: number | null; minor2: number | null; assignment: number | null; total: number | null; status: string }[] = [
  { subject: 'Data Structures', subjectCode: 'CS301', minor1: 18, minor2: 16, assignment: null, total: 34, status: 'finalized' },
  { subject: 'Database Systems', subjectCode: 'CS302', minor1: 17, minor2: 15, assignment: null, total: 32, status: 'under_review' },
  { subject: 'Operating Systems', subjectCode: 'CS303', minor1: 16, minor2: 14, assignment: null, total: 30, status: 'draft' },
  { subject: 'Software Engineering', subjectCode: 'CS304', minor1: 17, minor2: 16, assignment: null, total: 33, status: 'finalized' },
  { subject: 'Computer Networks', subjectCode: 'CS305', minor1: 16, minor2: 15, assignment: null, total: 31, status: 'draft' },
  { subject: 'Web Technologies', subjectCode: 'CS306', minor1: 16, minor2: 14, assignment: null, total: 30, status: 'draft' },
]

const ADMIN_ANNOUNCEMENTS = [
  { id: 1, title: 'Minor 2 Examination', message: 'Minor 2 exams will be held from March 1-5. Schedule will be uploaded soon.', date: '2026-02-12' },
  { id: 2, title: 'Konark 2026 Holiday', message: 'Holiday on 16th February on the occasion of Konark 2026.', date: '2026-02-11' },
]

const FACULTY_ANNOUNCEMENTS = [
  { id: 3, title: 'Operating Systems Class Cancelled', message: 'OS class on Tuesday (Feb 17) has been cancelled.', subject: 'Operating Systems', date: '2026-02-14' },
  { id: 4, title: 'OS Assignment Deadline Extended', message: 'Assignment 2 deadline extended to 26th Feb.', subject: 'Operating Systems', date: '2026-02-13' },
  { id: 5, title: 'DBMS Lab Cancelled', message: 'DBMS Lab on Wednesday (Feb 18) has been cancelled.', subject: 'Database Systems', date: '2026-02-12' },
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
  const getEligibilityStatus = (attendance: number) => {
    if (attendance >= 75) return { status: 'Eligible', color: 'green', icon: <CheckCircle className="w-4 h-4" /> }
    if (attendance >= 65) return { status: 'At Risk', color: 'yellow', icon: <AlertCircle className="w-4 h-4" /> }
    return { status: 'Not Eligible', color: 'red', icon: <XCircle className="w-4 h-4" /> }
  }

  const studentInfo = {
    name: 'Vanshit Gaur',
    rollNumber: '240010150100',
    semester: 4,
    branch: 'Computer Science & Engineering',
    specialization: 'AI/ML'
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
    const getGreeting = () => {
      const hour = new Date().getHours()
      if (hour < 12) return 'Good Morning'
      if (hour < 17) return 'Good Afternoon'
      return 'Good Evening'
    }

    const pendingAssignmentsCount = ASSIGNMENTS.filter(a => a.status === 'pending').length
    const aggregatedCGPA = 8.2

    const totalClasses = SUBJECTS.reduce((sum, s) => sum + s.totalClasses, 0)
    const totalPresent = SUBJECTS.reduce((sum, s) => sum + s.presentClasses, 0)
    const overallAttendance = Math.round((totalPresent / totalClasses) * 100)
    const eligibility = getEligibilityStatus(overallAttendance)

    const subjectsCount = MARKS.length
    const internalMarksPerSubject = 30
    const totalPossibleInternal = subjectsCount * internalMarksPerSubject
    const totalObtainedInternal = 100 // Hardcoded for demo - sum of minor1+minor2 per subject
    const internalMarksPercentage = Math.round((totalObtainedInternal / totalPossibleInternal) * 100)

    return (
      <div className="space-y-6">
        {/* Hero Header - Clean & Structural */}
        <div className="
          bg-gradient-to-br from-white via-[var(--color-primary-faint)]/30 to-white 
          rounded-2xl border border-black/[0.04]
          shadow-[0_1px_3px_rgba(0,0,0,0.02),0_4px_12px_rgba(0,0,0,0.02)]
          p-6 md:p-8
          animate-in fade-in slide-in-from-bottom-4 duration-500
        ">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div>
                <h1 className="text-2xl md:text-3xl font-semibold text-[var(--color-text-primary)]">
                  {getGreeting()}, <span className="text-[var(--color-primary)]">{studentInfo.name.split(' ')[0]}</span>!
                </h1>
                <div className="text-[var(--color-text-secondary)] mt-2 space-y-0.5">
                  <p>Sem IV . BTech . {studentInfo.branch} ({studentInfo.specialization})</p>
                </div>
                <div className="flex items-center gap-3 mt-2">
                  <span className="px-3 py-1 bg-[var(--color-primary-faint)] text-[var(--color-primary)] text-xs font-medium rounded-full">
                    Roll No: {studentInfo.rollNumber}
                  </span>
                </div>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-3">
              <button className="px-5 py-3 bg-[var(--color-primary)] text-white text-sm font-medium rounded-xl hover:bg-[var(--color-primary-dark)] flex items-center gap-2 shadow-lg shadow-[var(--color-primary)]/20 hover:shadow-[var(--color-primary)]/30 transition-all duration-200">
                <BookMarked className="w-4 h-4" />
                View Profile
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats - 4 Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <QuickStatCard
            label="Overall Attendance"
            value={`${overallAttendance}%`}
            sub="Semester attendance"
            icon={<Calendar className="w-5 h-5" />}
            color={overallAttendance >= 75 ? 'green' : overallAttendance >= 65 ? 'yellow' : 'red'}
          />
          <QuickStatCard
            label="Internal Marks"
            value={`${totalObtainedInternal} / ${totalPossibleInternal}`}
            sub={`${internalMarksPercentage}% • ${subjectsCount} subjects`}
            icon={<Award className="w-5 h-5" />}
            color="purple"
          />
          <QuickStatCard
            label="Pending Assignments"
            value={pendingAssignmentsCount.toString()}
            sub="Due this week"
            icon={<FileText className="w-5 h-5" />}
            color="amber"
          />
          <QuickStatCard
            label="Exam Eligibility"
            value={eligibility.status.split(' ')[0]}
            sub={eligibility.status === 'Eligible' ? 'You are eligible' : 'Action required'}
            icon={eligibility.status === 'Eligible' ? <CheckCircle className="w-5 h-5" /> : eligibility.status === 'At Risk' ? <AlertCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
            color={eligibility.status === 'Eligible' ? 'green' : eligibility.status === 'At Risk' ? 'yellow' : 'red'}
          />
        </div>

        <OverviewTab
          administrationAnnouncements={ADMIN_ANNOUNCEMENTS}
          facultyAnnouncements={FACULTY_ANNOUNCEMENTS}
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
            <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">Assignments</h2>
            <p className="text-[var(--color-text-secondary)] mt-1">Track and submit your assignments</p>
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
            <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">Attendance Tracking</h2>
            <p className="text-[var(--color-text-secondary)] mt-1">Monitor your class attendance and eligibility</p>
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
            <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">Marks & Grades</h2>
            <p className="text-[var(--color-text-secondary)] mt-1">View your internal assessment marks</p>
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

function QuickStatCard({ label, value, sub, icon, color = 'blue' }: { label: string; value: string; sub: string; icon: React.ReactNode; color?: 'blue' | 'green' | 'yellow' | 'red' | 'amber' | 'purple' }) {
  const colorStyles = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    red: 'bg-red-50 text-red-600',
    amber: 'bg-amber-50 text-amber-600',
    purple: 'bg-purple-50 text-purple-600'
  }

  return (
    <div className="bg-white rounded-2xl border border-black/[0.04] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:shadow-lg hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-all duration-300">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-[var(--color-text-muted)]">{label}</span>
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${colorStyles[color]}`}>
          {icon}
        </div>
      </div>
      <span className="text-3xl font-bold text-[var(--color-text-primary)]">{value}</span>
      <p className="text-xs text-[var(--color-text-muted)] mt-1">{sub}</p>
    </div>
  )
}
