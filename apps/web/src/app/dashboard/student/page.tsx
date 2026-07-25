'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  LayoutDashboard, Calendar, FileText, ClipboardCheck, Award, TrendingUp, 
  Bell, Plus, ChevronLeft, ChevronRight, PanelLeftClose, PanelLeft,
  CalendarDays, ClipboardList, Users, Settings, BookMarked, Home,
  CheckCircle, AlertCircle, XCircle, Clock, AlertTriangle, FileQuestion,
  GraduationCap, Lock, Download, ArrowUpRight, ArrowDownRight, ChevronDown,
  Activity, Target, Sparkles, BookOpen, User, CalendarClock, FileCheck,
  MessageSquare, Clipboard, Layers, Wallet, Landmark, CreditCard, QrCode,
  Building2, Bed, Utensils, Phone, MapPin, Trophy, Medal, Flame, Dumbbell,
  Gamepad2, Flag, Star, Ticket, Megaphone, Wifi, Car, Coffee,
  FlaskConical, Bookmark, Scroll, Palmtree, Plane,
  Send, Paperclip, Filter, Eye, EyeOff, Smile, Frown, Meh, Shield, Moon,
  X, Upload
} from 'lucide-react'
import { cn } from '@/lib/utils'
import TimetableViewer from '@/components/dashboard/TimetableViewer'

type TabType = 'overview' | 'timetable' | 'assignments' | 'attendance' | 'marks' | 'track' | 'fees' | 'hostel' | 'sports' | 'requests' | 'settings'

// ==================== DEMO DATA ====================

const SUBJECTS = [
  { id: 1, name: 'Data Structures', code: 'CS301', attendance: 88, totalClasses: 25, presentClasses: 22, assignmentCompletion: 85, readinessScore: 90, lastClass: 'Feb 10', nextClass: 'Feb 15' },
  { id: 2, name: 'Database Systems', code: 'CS302', attendance: 80, totalClasses: 25, presentClasses: 20, assignmentCompletion: 60, readinessScore: 70, lastClass: 'Feb 12', nextClass: 'Feb 16' },
  { id: 3, name: 'Operating Systems', code: 'CS303', attendance: 84, totalClasses: 25, presentClasses: 21, assignmentCompletion: 50, readinessScore: 62, lastClass: 'Feb 11', nextClass: 'Feb 14' },
  { id: 4, name: 'Software Engineering', code: 'CS304', attendance: 92, totalClasses: 25, presentClasses: 23, assignmentCompletion: 95, readinessScore: 94, lastClass: 'Feb 13', nextClass: 'Feb 17' },
  { id: 5, name: 'Computer Networks', code: 'CS305', attendance: 76, totalClasses: 25, presentClasses: 19, assignmentCompletion: 70, readinessScore: 75, lastClass: 'Feb 12', nextClass: 'Feb 16' },
  { id: 6, name: 'Web Technologies', code: 'CS306', attendance: 84, totalClasses: 25, presentClasses: 21, assignmentCompletion: 80, readinessScore: 82, lastClass: 'Feb 14', nextClass: 'Feb 18' },
]

const TIMETABLE = [
  { day: 'Monday', slots: [{ time: '09:00-10:00', subject: 'Data Structures', room: 'A101', faculty: 'Dr. Sharma' }, { time: '10:00-11:00', subject: 'Database Systems', room: 'A102', faculty: 'Prof. Kumar' }, { time: '11:00-12:00', subject: 'Operating Systems', room: 'A103', faculty: 'Dr. Singh' }, { time: '14:00-16:00', subject: 'SE Lab', room: 'Lab-1', faculty: 'Prof. Verma' }] },
  { day: 'Tuesday', slots: [{ time: '09:00-10:00', subject: 'Operating Systems', room: 'A103', faculty: 'Dr. Singh' }, { time: '10:00-11:00', subject: 'Data Structures', room: 'A101', faculty: 'Dr. Sharma' }, { time: '11:00-12:00', subject: 'Software Engineering', room: 'A104', faculty: 'Prof. Verma' }] },
  { day: 'Wednesday', slots: [{ time: '09:00-10:00', subject: 'Database Systems', room: 'A102', faculty: 'Prof. Kumar' }, { time: '10:00-11:00', subject: 'Operating Systems', room: 'A103', faculty: 'Dr. Singh' }, { time: '11:00-12:00', subject: 'Data Structures', room: 'A101', faculty: 'Dr. Sharma' }, { time: '14:00-16:00', subject: 'DBMS Lab', room: 'Lab-2', faculty: 'Prof. Kumar' }] },
  { day: 'Thursday', slots: [{ time: '09:00-10:00', subject: 'Software Engineering', room: 'A104', faculty: 'Prof. Verma' }, { time: '10:00-11:00', subject: 'Database Systems', room: 'A102', faculty: 'Prof. Kumar' }, { time: '11:00-12:00', subject: 'OS Lab', room: 'Lab-1', faculty: 'Dr. Singh' }] },
  { day: 'Friday', slots: [{ time: '09:00-10:00', subject: 'Data Structures', room: 'A101', faculty: 'Dr. Sharma' }, { time: '10:00-11:00', subject: 'Software Engineering', room: 'A104', faculty: 'Prof. Verma' }, { time: '11:00-12:00', subject: 'Database Systems', room: 'A102', faculty: 'Prof. Kumar' }] },
]

const ADMIN_ANNOUNCEMENTS = [
  { id: 1, title: 'Minor 2 Examination Schedule', message: 'Minor 2 exams will be held from March 1-5, 2026. Detailed schedule will be uploaded soon. Prepare accordingly.', date: '2026-02-12', priority: 'high' },
  { id: 2, title: 'Holiday on 16th February', message: 'College will remain closed on 16th February on the occasion of Konark 2026.', date: '2026-02-11', priority: 'medium' },
  { id: 3, title: 'Mid-Term Break', message: 'Mid-term break from Feb 20-25. College reopens on 26th February.', date: '2026-02-10', priority: 'low' },
]

const FACULTY_ANNOUNCEMENTS = [
  { id: 4, title: 'Operating Systems Class Cancelled', message: 'OS class on Tuesday (Feb 17) has been cancelled due to faculty meeting.', subject: 'Operating Systems', date: '2026-02-14' },
  { id: 5, title: 'DBMS Assignment Deadline Extended', message: 'DBMS Assignment 2 deadline extended to 26th Feb due to server issues.', subject: 'Database Systems', date: '2026-02-13' },
  { id: 6, title: 'DBMS Lab Cancelled', message: 'DBMS Lab on Wednesday (Feb 18) has been cancelled.', subject: 'Database Systems', date: '2026-02-12' },
  { id: 7, title: 'AI Project Review', message: 'AI project first review will be conducted on Feb 20. Submit proposals by Feb 18.', subject: 'Artificial Intelligence', date: '2026-02-11' },
]

const SEMESTER_RESOURCES = [
  { id: 1, title: '4th Semester Syllabus', description: 'Detailed syllabus for Semester IV subjects', type: 'syllabus', file: '#' },
  { id: 2, title: 'AI&ML Scheme (2nd Year)', description: 'Scheme structure for AI&ML specialization', type: 'scheme', file: '#' },
  { id: 3, title: 'Academic Calendar', description: 'Important dates and events for odd semester 2025-26', type: 'calendar', file: '#' },
  { id: 4, title: 'Lab Manual', description: 'Practical experiments and lab guidelines', type: 'lab', file: '#' },
]

const SUBJECT_NOTES = [
  { 
    id: 1, 
    subject: 'Operating Systems', 
    code: 'CS303',
    topics: ['Process Scheduling', 'Deadlock Prevention', 'Memory Management', 'File Systems'],
    notes: [
      { title: 'CPU Scheduling Algorithms', type: 'PDF', pages: 12 },
      { title: 'Deadlock Notes', type: 'PDF', pages: 8 },
      { title: 'Memory Management PPT', type: 'PPT', pages: 25 },
    ]
  },
  { 
    id: 2, 
    subject: 'Computer Networks', 
    code: 'CS305',
    topics: ['OSI Model', 'TCP/IP', 'Routing', 'Network Security'],
    notes: [
      { title: 'Networking Fundamentals', type: 'PDF', pages: 15 },
      { title: 'TCP/IP Notes', type: 'PDF', pages: 10 },
      { title: 'Routing Protocols', type: 'PDF', pages: 8 },
    ]
  },
  { 
    id: 3, 
    subject: 'Software Engineering', 
    code: 'CS304',
    topics: ['SDLC', 'UML Diagrams', 'Agile Methods', 'Testing'],
    notes: [
      { title: 'SDLC Overview', type: 'PDF', pages: 10 },
      { title: 'UML Tutorial', type: 'PDF', pages: 18 },
      { title: 'Agile Methodology', type: 'PPT', pages: 20 },
    ]
  },
  { 
    id: 4, 
    subject: 'Data Structures & Algorithms', 
    code: 'CS301',
    topics: ['Arrays', 'Linked Lists', 'Trees', 'Graphs', 'Sorting'],
    notes: [
      { title: 'DSA Basics', type: 'PDF', pages: 20 },
      { title: 'Tree traversals', type: 'PDF', pages: 12 },
      { title: 'Graph Algorithms', type: 'PDF', pages: 15 },
      { title: 'Sorting Techniques', type: 'PDF', pages: 10 },
    ]
  },
]

const UPCOMING_CLASSES = [
  { date: '2026-02-17', day: 'Monday', slots: [{ time: '09:00', subject: 'Data Structures', room: 'A101', faculty: 'Dr. Sharma', type: 'Lecture' }, { time: '10:00', subject: 'Database Systems', room: 'A102', faculty: 'Prof. Kumar', type: 'Lecture' }, { time: '14:00', subject: 'SE Lab', room: 'Lab-1', faculty: 'Prof. Verma', type: 'Lab' }] },
  { date: '2026-02-18', day: 'Tuesday', slots: [{ time: '09:00', subject: 'Operating Systems', room: 'A103', faculty: 'Dr. Singh', type: 'Lecture' }, { time: '10:00', subject: 'Data Structures', room: 'A101', faculty: 'Dr. Sharma', type: 'Lecture' }, { time: '11:00', subject: 'Software Engineering', room: 'A104', faculty: 'Prof. Verma', type: 'Lecture' }] },
]

const TODAY_CLASSES = [
  { time: '09:00', subject: 'Data Structures', room: 'A101', faculty: 'Dr. Sharma', type: 'Lecture' },
  { time: '10:00', subject: 'Database Systems', room: 'A102', faculty: 'Prof. Kumar', type: 'Lecture' },
  { time: '11:00', subject: 'Operating Systems', room: 'A103', faculty: 'Dr. Singh', type: 'Lecture' },
  { time: '14:00', subject: 'SE Lab', room: 'Lab-1', faculty: 'Prof. Verma', type: 'Lab' },
]

const ASSIGNMENTS: { id: number; subject: string; category: 'theory' | 'lab'; title: string; description: string; type: 'project' | 'coding' | 'documentation' | 'questions'; submissionType: 'github' | 'file' | 'text'; dueDate: string; status: 'pending' | 'submitted' | 'evaluated' | 'late'; maxMarks: number; submittedDate?: string; marks?: number; githubLink?: string }[] = [
  { id: 1, subject: 'DBMS', category: 'theory', title: 'SQL Optimization Assignment', description: 'Optimize the given SQL queries for better performance', type: 'coding', submissionType: 'file', dueDate: '2026-02-20', status: 'pending', maxMarks: 50 },
  { id: 2, subject: 'DBMS', category: 'theory', title: 'ER Diagram Design', description: 'Create ER diagram for online bookstore system', type: 'project', submissionType: 'file', dueDate: '2026-02-12', status: 'submitted', maxMarks: 75, submittedDate: '2026-02-10' },
  { id: 3, subject: 'DBMS', category: 'theory', title: 'Normalization Quiz', description: 'Complete the normalization exercises', type: 'questions', submissionType: 'text', dueDate: '2026-02-08', status: 'evaluated', maxMarks: 25, marks: 22 },
  { id: 4, subject: 'OS', category: 'theory', title: 'Process Scheduling Report', description: 'Write a detailed report on CPU scheduling algorithms', type: 'documentation', submissionType: 'text', dueDate: '2026-02-25', status: 'pending', maxMarks: 50 },
  { id: 5, subject: 'SE', category: 'theory', title: 'UML System Design', description: 'Create UML diagrams for library management system', type: 'project', submissionType: 'file', dueDate: '2026-03-01', status: 'pending', maxMarks: 100 },
  { id: 6, subject: 'AI', category: 'theory', title: 'Search Algorithms Project', description: 'Implement BFS and DFS for puzzle solving', type: 'project', submissionType: 'github', dueDate: '2026-02-28', status: 'pending', maxMarks: 75 },
]

const MARKS: { subject: string; subjectCode?: string; internal1: number; internal2: number; assignment: number; total: number; status: string }[] = [
  { subject: 'Data Structures', subjectCode: 'CS301', internal1: 20, internal2: 21, assignment: 0, total: 41, status: 'finalized' },
  { subject: 'Database Systems', subjectCode: 'CS302', internal1: 21, internal2: 20, assignment: 0, total: 41, status: 'under_review' },
  { subject: 'Operating Systems', subjectCode: 'CS303', internal1: 20, internal2: 22, assignment: 0, total: 42, status: 'draft' },
  { subject: 'Software Engineering', subjectCode: 'CS304', internal1: 22, internal2: 21, assignment: 0, total: 43, status: 'finalized' },
  { subject: 'Computer Networks', subjectCode: 'CS305', internal1: 21, internal2: 20, assignment: 0, total: 41, status: 'draft' },
  { subject: 'Web Technologies', subjectCode: 'CS306', internal1: 21, internal2: 21, assignment: 0, total: 42, status: 'draft' },
]

const TRACK_REPORTS = [
  { semester: 'Semester 1', year: '2024-25', attendance: 82, marks: 245, cgpa: 8.2, status: 'locked' },
  { semester: 'Semester 2', year: '2024-25', attendance: 78, marks: 238, cgpa: 7.9, status: 'locked' },
  { semester: 'Semester 3', year: '2025-26', attendance: 85, marks: 252, cgpa: 8.4, status: 'locked' },
  { semester: 'Semester 4', year: '2025-26', attendance: 79, marks: null, cgpa: null, status: 'in_progress' },
]

// Fees Data
const FEE_STRUCTURE = [
  { id: 1, semester: 'Semester 1', year: '2024-25', tuition: 42000, hostel: 13550, library: 2000, exam: 1500, total: 59050, status: 'paid', paidDate: '2024-07-20', ref: 'TXN/2024/001' },
  { id: 2, semester: 'Semester 2', year: '2024-25', tuition: 42000, hostel: 13550, library: 2000, exam: 1500, total: 59050, status: 'paid', paidDate: '2024-12-15', ref: 'TXN/2024/002' },
  { id: 3, semester: 'Semester 3', year: '2025-26', tuition: 42000, hostel: 13550, library: 2000, exam: 1500, total: 59050, status: 'paid', paidDate: '2025-07-18', ref: 'TXN/2025/001' },
  { id: 4, semester: 'Semester 4', year: '2025-26', tuition: 42000, hostel: 13550, library: 2000, exam: 1500, total: 59050, status: 'pending', dueDate: '2026-02-28' },
]

const TRANSACTIONS = [
  { id: 1, date: '2024-07-20', amount: 59050, method: 'Online Transfer', reference: 'TXN/2024/001', semester: 'Semester 1' },
  { id: 2, date: '2024-12-15', amount: 59050, method: 'UPI Payment', reference: 'TXN/2024/002', semester: 'Semester 2' },
  { id: 3, date: '2025-07-18', amount: 59050, method: 'Online Transfer', reference: 'TXN/2025/001', semester: 'Semester 3' },
]

// Hostel Data
const CURRENT_HOSTEL = {
  name: 'Vivekanand Hostel',
  block: 'BH4 (Boys Hostel 4)',
  roomNumber: '2A Wing, 318',
  floor: '3rd Floor',
  bedType: '4 Sharing',
  messType: 'Vegetarian',
  warden: 'Dr. O.P. Sangwan (Chief Warden)',
  wardens: ['Mr. Shardul', 'Mr. Manoj Yadav'],
  contact: '+91 1800 123 4567',
}

const HOSTEL_HISTORY = [
  { year: '2025-26', semester: 'Semester 4', hostel: 'Vivekanand Hostel', block: 'BH4', room: '318', status: 'current' },
  { year: '2025-26', semester: 'Semester 3', hostel: 'Vivekanand Hostel', block: 'BH4', room: '215', status: 'previous' },
  { year: '2024-25', semester: 'Semester 2', hostel: 'Vivekanand Hostel', block: 'BH4', room: '112', status: 'previous' },
  { year: '2024-25', semester: 'Semester 1', hostel: 'Vivekanand Hostel', block: 'BH4', room: '108', status: 'previous' },
]

// Sports Data
const SPORTS_FACILITIES = [
  { id: 1, name: 'Badminton', icon: '🏸', courts: 2, available: true, timing: '6 AM - 9 PM' },
  { id: 2, name: 'Basketball', icon: '🏀', courts: 1, available: true, timing: '6 AM - 9 PM' },
  { id: 3, name: 'Cricket', icon: '🏏', ground: 1, available: true, timing: '6 AM - 6 PM' },
  { id: 4, name: 'Football', icon: '⚽', ground: 1, available: true, timing: '6 AM - 6 PM' },
  { id: 5, name: 'Table Tennis', icon: '🏓', tables: 4, available: true, timing: '8 AM - 9 PM' },
  { id: 6, name: 'Chess', icon: '♟️', tables: 10, available: true, timing: '10 AM - 8 PM' },
  { id: 7, name: 'Gym', icon: '🏋️', available: true, timing: '5 AM - 10 PM' },
  { id: 8, name: 'Swimming', icon: '🏊', available: true, timing: '6 AM - 8 PM' },
]

const SPORTS_EVENTS = [
  { id: 1, name: 'Inter-College Basketball Tournament', sport: 'Basketball', date: '2026-02-25', venue: 'Main Court', registrationDeadline: '2026-02-20', fee: 500, type: 'Tournament', teams: 8, registered: true },
  { id: 2, name: 'Annual Badminton Championship', sport: 'Badminton', date: '2026-03-01', venue: 'Sports Complex', registrationDeadline: '2026-02-25', fee: 300, type: 'Championship', participants: 64, registered: false },
  { id: 3, name: 'Cricket League 2026', sport: 'Cricket', date: '2026-03-05', venue: 'Cricket Ground', registrationDeadline: '2026-02-28', fee: 1000, type: 'League', teams: 12, registered: false },
  { id: 4, name: 'Table Tennis Open', sport: 'Table Tennis', date: '2026-02-28', venue: 'Sports Complex', registrationDeadline: '2026-02-22', fee: 200, type: 'Open', participants: 32, registered: true },
]

const SPORTS_ACHIEVEMENTS = [
  { id: 1, student: 'Vanshit Gaur', event: 'Inter-College Badminton 2025', sport: 'Badminton', position: 'Winner', date: '2025-11-15' },
  { id: 2, student: 'Vanshit Gaur', event: 'Annual Sports Meet', sport: 'Table Tennis', position: 'Runner-up', date: '2025-09-20' },
]

// Hostel Enhancement Data
const HOSTEL_AMENITIES = [
  { id: 1, name: 'WiFi', icon: Wifi, available: true, description: 'High-speed internet 24/7' },
  { id: 2, name: 'Laundry', icon: FlaskConical, available: true, description: 'Automated laundry machines' },
  { id: 3, name: 'Parking', icon: Car, available: true, description: 'Two-wheeler parking available' },
  { id: 4, name: 'Mess', icon: Utensils, available: true, description: 'Multi-cuisine mess facility' },
  { id: 5, name: 'Security', icon: Shield, available: true, description: '24/7 security & CCTV' },
  { id: 6, name: 'Gym', icon: Dumbbell, available: true, description: 'Indoor gymnasium' },
]

const MESS_MENU = {
  breakfast: ['Puri Sabzi', 'Paratha', 'Oats', 'Poha', 'Eggs', 'Milk', 'Tea/Coffee'],
  lunch: ['Dal Makhani', 'Rice', 'Roti', 'Vegetables', 'Pickle', 'Salad', 'Buttermilk'],
  snacks: ['Samosa', 'Pakora', 'Tea/Coffee', 'Biscuits', 'Fruits'],
  dinner: ['Paneer', 'Rice', 'Roti', 'Dal', 'Vegetables', 'Salad', 'Dessert'],
}

const HOSTEL_EMERGENCY = [
  { id: 1, name: 'Warden Office', phone: '+91 1800 123 4567', available: '24/7' },
  { id: 2, name: 'Security Gate', phone: '+91 1800 123 4568', available: '24/7' },
  { id: 3, name: 'Medical Emergency', phone: '+91 1800 123 4569', available: '24/7' },
  { id: 4, name: 'Maintenance', phone: '+91 1800 123 4570', available: '9 AM - 6 PM' },
]

// Track Report Enhancement Data
const TRACK_SEMESTER_DETAILS = [
  { semester: 'Semester 1', year: '2024-25', subjects: [
    { name: 'Mathematics I', marks: 85, grade: 'A' },
    { name: 'Physics', marks: 78, grade: 'B+' },
    { name: 'Chemistry', marks: 82, grade: 'A' },
    { name: 'Programming', marks: 88, grade: 'A+' },
    { name: 'English', marks: 75, grade: 'B' },
  ]},
  { semester: 'Semester 2', year: '2024-25', subjects: [
    { name: 'Mathematics II', marks: 80, grade: 'A' },
    { name: 'Data Structures', marks: 85, grade: 'A' },
    { name: 'Digital Logic', marks: 73, grade: 'B+' },
    { name: 'Communicative English', marks: 72, grade: 'B' },
    { name: 'Engineering Mechanics', marks: 76, grade: 'B+' },
  ]},
  { semester: 'Semester 3', year: '2025-26', subjects: [
    { name: 'Database Systems', marks: 82, grade: 'A' },
    { name: 'Operating Systems', marks: 79, grade: 'B+' },
    { name: 'Software Engineering', marks: 88, grade: 'A+' },
    { name: 'Computer Networks', marks: 75, grade: 'B' },
    { name: 'AI/ML Basics', marks: 85, grade: 'A' },
  ]},
]

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } }
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
}

export default function StudentDashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<TabType>('overview')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Minor 2 Exam Schedule', message: 'Minor 2 exams from March 1-5, 2026', time: '2 hours ago', read: false, type: 'urgent' },
    { id: 2, title: 'Assignment Submitted', message: 'Your DBMS assignment has been evaluated', time: '1 day ago', read: true, type: 'success' },
    { id: 3, title: 'Attendance Warning', message: 'Your attendance dropped below 75% in OS', time: '2 days ago', read: true, type: 'warning' },
  ])
  
  const currentUser = { name: 'Vanshit Gaur', rollNumber: '240010150100', semester: 4, branch: 'CSE', specialization: 'AI/ML', avatar: 'VG' }

  const analytics = {
    overallAttendance: 82,
    cgpa: 8.4,
    pendingAssignments: ASSIGNMENTS.filter(a => a.status === 'pending').length,
    rank: 12,
    totalStudents: 80,
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Navbar */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-4 left-4 right-4 h-14 bg-white/90 backdrop-blur-xl rounded-2xl shadow-sm border border-slate-200/50 z-50 flex items-center px-5"
      >
        <div className="flex items-center gap-2.5 mr-6">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/25">
            <Layers className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-base tracking-tight text-slate-900 leading-none">DeptWP</span>
            <span className="text-[9px] text-slate-400 -mt-0.5">Student Portal</span>
          </div>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2.5 hover:bg-slate-100 rounded-xl transition-all duration-200"
            >
              <Bell className="w-5 h-5 text-slate-600" />
              {notifications.some(n => !n.read) && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white" />
              )}
            </button>
            {showNotifications && (
              <div className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-50">
                <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                  <span className="font-semibold text-slate-800">Notifications</span>
                  <button 
                    onClick={() => setNotifications(notifications.map(n => ({ ...n, read: true })))}
                    className="text-xs text-blue-600 hover:underline"
                  >
                    Mark all read
                  </button>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.map((notif) => (
                    <div 
                      key={notif.id} 
                      className={`px-4 py-3 border-b border-slate-50 hover:bg-slate-50 transition-colors ${!notif.read ? 'bg-blue-50/50' : ''}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-2 h-2 rounded-full mt-2 ${notif.type === 'urgent' ? 'bg-red-500' : notif.type === 'success' ? 'bg-green-500' : 'bg-amber-500'}`} />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-slate-800">{notif.title}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{notif.message}</p>
                          <p className="text-[10px] text-slate-400 mt-1">{notif.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-2 bg-slate-50 text-center">
                  <button className="text-xs text-blue-600 font-medium hover:underline">View All Notifications</button>
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2.5 pl-2.5 border-l border-slate-200">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center text-white font-bold shadow-lg ring-2 ring-blue-50/50">
              {currentUser.avatar}
            </div>
            <div className="hidden lg:block">
              <p className="text-sm font-semibold text-slate-900">{currentUser.name}</p>
              <p className="text-[10px] text-slate-500">Sem {currentUser.semester} • {currentUser.branch}</p>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Sidebar */}
      <motion.aside 
        initial={{ opacity: 0 }}
        animate={{ width: sidebarCollapsed ? 80 : 260, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed left-4 top-20 bottom-6 bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-200/50 flex flex-col"
      >
        <div className="flex items-center justify-between px-3 py-3 border-b border-slate-100">
          {!sidebarCollapsed && <span className="text-xs font-bold text-slate-400 uppercase">Menu</span>}
          <button 
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
          >
            {sidebarCollapsed ? (
              <ChevronRight className="w-4 h-4 text-slate-500" />
            ) : (
              <PanelLeftClose className="w-4 h-4 text-slate-500" />
            )}
          </button>
        </div>

        <div className="flex flex-col flex-1 py-4 px-2.5 overflow-y-auto">
          <div className="space-y-1">
            {!sidebarCollapsed && <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-2 mb-1.5">Main</p>}
            <NavButton icon={LayoutDashboard} label="Overview" isActive={activeTab === 'overview'} collapsed={sidebarCollapsed} onClick={() => setActiveTab('overview')} />
            <NavButton icon={Calendar} label="Timetable" isActive={activeTab === 'timetable'} collapsed={sidebarCollapsed} onClick={() => setActiveTab('timetable')} />
          </div>

          <div className="space-y-1 mt-4">
            {!sidebarCollapsed && <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-2 mb-1.5">Academic</p>}
            <NavButton icon={FileText} label="Assignments" isActive={activeTab === 'assignments'} collapsed={sidebarCollapsed} onClick={() => setActiveTab('assignments')} badge={analytics.pendingAssignments} />
            <NavButton icon={ClipboardCheck} label="Attendance" isActive={activeTab === 'attendance'} collapsed={sidebarCollapsed} onClick={() => setActiveTab('attendance')} />
            <NavButton icon={Award} label="Marks" isActive={activeTab === 'marks'} collapsed={sidebarCollapsed} onClick={() => setActiveTab('marks')} />
            <NavButton icon={TrendingUp} label="Track Report" isActive={activeTab === 'track'} collapsed={sidebarCollapsed} onClick={() => setActiveTab('track')} />
          </div>

          <div className="space-y-1 mt-4">
            {!sidebarCollapsed && <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-2 mb-1.5">Campus</p>}
            <NavButton icon={Wallet} label="Fees" isActive={activeTab === 'fees'} collapsed={sidebarCollapsed} onClick={() => setActiveTab('fees')} />
            <NavButton icon={Building2} label="Hostel" isActive={activeTab === 'hostel'} collapsed={sidebarCollapsed} onClick={() => setActiveTab('hostel')} />
            <NavButton icon={Trophy} label="Sports" isActive={activeTab === 'sports'} collapsed={sidebarCollapsed} onClick={() => setActiveTab('sports')} />
            <NavButton icon={ClipboardList} label="Requests" isActive={activeTab === 'requests'} collapsed={sidebarCollapsed} onClick={() => setActiveTab('requests')} badge={1} />
          </div>
        </div>

        <div className="px-2.5 pb-4 pt-2 border-t border-slate-100">
          <NavButton icon={Settings} label="Settings" isActive={activeTab === 'settings'} collapsed={sidebarCollapsed} onClick={() => setActiveTab('settings')} />
        </div>
      </motion.aside>

      {/* Main Content */}
      <main 
        className={cn("pt-20 px-6 pb-6 min-h-screen transition-all duration-300", sidebarCollapsed ? "ml-[104px]" : "ml-[288px]")}
      >
        <div className="max-w-[1400px] mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            variants={containerVariants}
            initial="hidden"
            animate="show"
            exit={{ opacity: 0 }}
          >
            {activeTab === 'overview' && <OverviewView analytics={analytics} currentUser={currentUser} />}
            {activeTab === 'timetable' && <TimetableView />}
            {activeTab === 'assignments' && <AssignmentsView />}
            {activeTab === 'attendance' && <AttendanceView />}
            {activeTab === 'marks' && <MarksView />}
            {activeTab === 'track' && <TrackReportView />}
            {activeTab === 'fees' && <FeesView />}
            {activeTab === 'hostel' && <HostelView />}
            {activeTab === 'sports' && <SportsView />}
            {activeTab === 'requests' && <RequestsView />}
            {activeTab === 'settings' && <SettingsView />}
          </motion.div>
        </AnimatePresence>
        </div>
      </main>
    </div>
  )
}

function NavButton({ icon: Icon, label, isActive, collapsed, onClick, badge }: { icon: any; label: string; isActive?: boolean; collapsed: boolean; onClick: () => void; badge?: number }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className={cn(
        "relative w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
        collapsed ? "justify-center" : "justify-start",
        isActive ? "text-blue-600" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
      )}
    >
      {isActive && (
        <motion.div layoutId="navIndicator" className="absolute inset-0 bg-blue-50 rounded-xl -z-10 shadow-sm shadow-blue-500/20" />
      )}
      <Icon className={cn("w-[18px] h-[18px] flex-shrink-0", isActive && "text-blue-600")} />
      {!collapsed && (
        <>
          <span>{label}</span>
          {badge !== undefined && badge > 0 && (
            <span className="ml-auto px-1.5 py-0.5 rounded-full text-[10px] bg-red-500 text-white font-medium">
              {badge}
            </span>
          )}
        </>
      )}
    </motion.button>
  )
}

// ==================== OVERVIEW VIEW ====================
function OverviewView({ analytics, currentUser }: { analytics: any; currentUser: any }) {
  const router = useRouter()
  const currentHour = new Date().getHours()
  const greeting = currentHour < 12 ? 'Good morning' : currentHour < 17 ? 'Good afternoon' : 'Good evening'

  const pendingAssignmentsCount = ASSIGNMENTS.filter(a => a.status === 'pending').length
  const totalClasses = SUBJECTS.reduce((sum, s) => sum + s.totalClasses, 0)
  const totalPresent = SUBJECTS.reduce((sum, s) => sum + s.presentClasses, 0)
  const overallAttendance = Math.round((totalPresent / totalClasses) * 100)
  
  const getEligibilityStatus = (attendance: number) => {
    if (attendance >= 75) return { status: 'Eligible', color: 'green', icon: CheckCircle }
    if (attendance >= 65) return { status: 'At Risk', color: 'yellow', icon: AlertCircle }
    return { status: 'Not Eligible', color: 'red', icon: XCircle }
  }
  const eligibility = getEligibilityStatus(overallAttendance)

  const quickStats = [
    { label: 'Attendance', value: `${overallAttendance}%`, sub: 'Above 75%', icon: Calendar, color: 'blue', trend: 'up' },
    { label: 'Internal Marks', value: '120/180', sub: '6 Subjects', icon: Award, color: 'green', trend: 'up' },
    { label: 'Pending', value: pendingAssignmentsCount.toString(), sub: 'Assignments', icon: FileText, color: 'amber', trend: 'down' },
    { label: 'Eligible', value: eligibility.status, sub: 'For Exams', icon: CheckCircle, color: eligibility.color === 'green' ? 'green' : eligibility.color === 'yellow' ? 'amber' : 'red', trend: 'up' },
  ]

  const getSmartStatus = () => {
    const statuses = []
    if (pendingAssignmentsCount > 0) {
      statuses.push({ type: 'warning', text: `${pendingAssignmentsCount} assignments pending`, icon: FileText })
    }
    if (overallAttendance < 75) {
      statuses.push({ type: 'danger', text: 'Attendance below 75%', icon: AlertTriangle })
    } else {
      statuses.push({ type: 'success', text: 'Attendance eligible', icon: CheckCircle })
    }
    statuses.push({ type: 'info', text: 'Next class in 30 minutes', icon: Clock })
    return statuses
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div 
        variants={itemVariants}
        className="bg-gradient-to-br from-white via-slate-50 to-white rounded-2xl border border-slate-200/60 shadow-[0_1px_3px_rgba(0,0,0,0.02),0_4px_12px_rgba(0,0,0,0.02)] p-6 md:p-8"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold text-slate-900">
                {greeting}, <span className="text-blue-600">{currentUser.name.split(' ')[0]}</span>!
              </h1>
              <div className="text-slate-500 mt-2 space-y-0.5">
                <p className="text-sm">Sem {currentUser.semester} • BTech • {currentUser.branch} ({currentUser.specialization})</p>
                <p className="text-sm">Roll No: {currentUser.rollNumber}</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Smart Status */}
      <motion.div variants={itemVariants} className="flex flex-wrap gap-2.5">
        {getSmartStatus().map((status, i) => (
          <div
            key={i}
            className={cn(
              "flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border backdrop-blur-sm",
              status.type === 'danger' ? "bg-red-50/80 text-red-700 border-red-200" :
              status.type === 'success' ? "bg-green-50/80 text-green-700 border-green-200" :
              status.type === 'warning' ? "bg-amber-50/80 text-amber-700 border-amber-200" :
              "bg-blue-50/80 text-blue-700 border-blue-200"
            )}
          >
            <status.icon className="w-3.5 h-3.5" />
            {status.text}
          </div>
        ))}
      </motion.div>

      {/* Quick Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat, i) => (
          <QuickStatCard key={i} {...stat} />
        ))}
      </motion.div>

      {/* Announcements Section */}
      <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl flex items-center justify-center text-amber-600 shadow-sm">
              <Megaphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 text-base">Announcements</h3>
              <p className="text-xs text-slate-500">Stay updated with latest notices</p>
            </div>
          </div>
        </div>
        <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100">
          {/* Administration */}
          <div className="p-5 space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <Building2 className="w-4 h-4 text-blue-600" />
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Administration</p>
            </div>
            <div className="space-y-3">
              {ADMIN_ANNOUNCEMENTS.map((ann) => (
                <div key={ann.id} className="p-3 rounded-xl border bg-blue-50/40 border-blue-100 hover:bg-blue-50/60 transition-colors">
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <p className="font-medium text-sm text-slate-800 line-clamp-2">{ann.title}</p>
                    {ann.priority === 'high' && <span className="w-2 h-2 bg-red-500 rounded-full shrink-0 mt-1" />}
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-2">{ann.message}</p>
                  <span className="text-[10px] text-slate-400 mt-2 block">{ann.date}</span>
                </div>
              ))}
            </div>
          </div>
          {/* Faculty Updates */}
          <div className="p-5 space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <GraduationCap className="w-4 h-4 text-slate-600" />
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Faculty Updates</p>
            </div>
            <div className="space-y-3">
              {FACULTY_ANNOUNCEMENTS.slice(0, 3).map((ann) => (
                <div key={ann.id} className="p-3 rounded-xl border bg-slate-50 border-slate-200 hover:bg-slate-100/60 transition-colors">
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <p className="font-medium text-sm text-slate-800 line-clamp-2">{ann.title}</p>
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-2">{ann.message}</p>
                  <div className="flex items-center justify-between mt-2">
                    {ann.subject && <span className="text-[10px] font-medium text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">{ann.subject}</span>}
                    <span className="text-[10px] text-slate-400">{ann.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Weekly Timetable Preview */}
      <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-slate-800 text-base">Weekly Timetable</h3>
            <p className="text-xs text-slate-500 mt-0.5">B.Tech {currentUser.branch} {currentUser.specialization} • Sem {currentUser.semester}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 bg-slate-300 rounded-sm"></div>
              <span className="text-[11px] text-slate-500 font-medium">Lab</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 bg-blue-300 rounded-sm"></div>
              <span className="text-[11px] text-slate-500 font-medium">Lecture</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 bg-amber-200 rounded-sm"></div>
              <span className="text-[11px] text-slate-500 font-medium">Lunch</span>
            </div>
          </div>
        </div>
        <div className="p-4 overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Time Header */}
            <div className="grid grid-cols-[50px_repeat(9,1fr)] gap-1.5 text-[9px] text-slate-400 mb-2">
              <div></div>
              <div className="text-center font-medium">8:30<br/>-9:30</div>
              <div className="text-center font-medium">9:30<br/>-10:30</div>
              <div className="text-center font-medium">10:30<br/>-11:30</div>
              <div className="text-center font-medium">11:30<br/>-12:30</div>
              <div className="text-center font-medium text-amber-600">12:30<br/>-1:30</div>
              <div className="text-center font-medium">1:30<br/>-2:30</div>
              <div className="text-center font-medium">2:30<br/>-3:30</div>
              <div className="text-center font-medium">3:30<br/>-4:30</div>
              <div className="text-center font-medium">4:30<br/>-5:30</div>
            </div>
            {/* MONDAY */}
            <div className="grid grid-cols-[50px_repeat(9,1fr)] gap-1.5 mb-1.5">
              <div className="flex items-center justify-center text-xs font-semibold text-slate-500">MON</div>
              <div className="p-1.5 text-[8px] bg-slate-100 rounded border border-slate-200 text-center font-medium col-span-2">Python LAB G1<br/>DM LAB G2</div>
              <div className="p-1.5 text-[9px] bg-white rounded border border-slate-200 text-center font-medium">SE</div>
              <div className="p-1.5 text-[9px] bg-white rounded border border-slate-200 text-center font-medium">AI</div>
              <div className="p-1.5 text-[9px] bg-amber-50 rounded border border-amber-200 text-center font-medium text-amber-600">Lunch</div>
              <div className="p-1.5 text-[8px] bg-slate-100 rounded border border-slate-200 text-center font-medium col-span-2">Python LAB G3<br/>DM LAB G1</div>
              <div className="p-1.5 text-[9px] bg-white rounded border border-slate-200 text-center font-medium">DM</div>
              <div className="p-1.5 text-[9px] bg-white rounded border border-slate-200 text-center font-medium">DBMS</div>
            </div>
            {/* TUESDAY */}
            <div className="grid grid-cols-[50px_repeat(9,1fr)] gap-1.5 mb-1.5">
              <div className="flex items-center justify-center text-xs font-semibold text-slate-500">TUE</div>
              <div className="p-1.5 text-[8px] bg-slate-100 rounded border border-slate-200 text-center font-medium col-span-2">Python LAB G2<br/>DM LAB G3</div>
              <div className="p-1.5 text-[9px] bg-white rounded border border-slate-200 text-center font-medium">SE</div>
              <div className="p-1.5 text-[9px] bg-white rounded border border-slate-200 text-center font-medium">DBMS</div>
              <div className="p-1.5 text-[9px] bg-amber-50 rounded border border-amber-200 text-center font-medium text-amber-600">Lunch</div>
              <div className="p-1.5 text-[9px] bg-white rounded border border-slate-200 text-center font-medium">DM</div>
              <div className="p-1.5 text-[9px] bg-white rounded border border-slate-200 text-center font-medium">DLCD</div>
              <div className="p-1.5 text-[9px] bg-slate-100 rounded border border-slate-200 text-center font-medium col-span-2">DBMS LAB G1</div>
            </div>
            {/* WEDNESDAY */}
            <div className="grid grid-cols-[50px_repeat(9,1fr)] gap-1.5 mb-1.5">
              <div className="flex items-center justify-center text-xs font-semibold text-slate-500">WED</div>
              <div className="p-1.5 text-[8px] bg-slate-100 rounded border border-slate-200 text-center font-medium col-span-2">Python LAB G3<br/>DM LAB G1</div>
              <div className="p-1.5 text-[9px] bg-white rounded border border-slate-200 text-center font-medium">OS</div>
              <div className="p-1.5 text-[9px] bg-slate-50 rounded border border-slate-100"></div>
              <div className="p-1.5 text-[9px] bg-amber-50 rounded border border-amber-200 text-center font-medium text-amber-600">Lunch</div>
              <div className="p-1.5 text-[9px] bg-white rounded border border-slate-200 text-center font-medium">SE</div>
              <div className="p-1.5 text-[9px] bg-white rounded border border-slate-200 text-center font-medium">DBMS</div>
              <div className="p-1.5 text-[9px] bg-slate-100 rounded border border-slate-200 text-center font-medium col-span-2">DBMS LAB G2</div>
            </div>
            {/* THURSDAY */}
            <div className="grid grid-cols-[50px_repeat(9,1fr)] gap-1.5 mb-1.5">
              <div className="flex items-center justify-center text-xs font-semibold text-slate-500">THU</div>
              <div className="p-1.5 text-[8px] bg-slate-100 rounded border border-slate-200 text-center font-medium col-span-2">Python LAB G1<br/>DM LAB G2</div>
              <div className="p-1.5 text-[9px] bg-white rounded border border-slate-200 text-center font-medium">OS</div>
              <div className="p-1.5 text-[9px] bg-white rounded border border-slate-200 text-center font-medium">AI</div>
              <div className="p-1.5 text-[9px] bg-amber-50 rounded border border-amber-200 text-center font-medium text-amber-600">Lunch</div>
              <div className="p-1.5 text-[9px] bg-white rounded border border-slate-200 text-center font-medium">DM</div>
              <div className="p-1.5 text-[9px] bg-white rounded border border-slate-200 text-center font-medium">DLCD</div>
              <div className="p-1.5 text-[9px] bg-slate-50 rounded border border-slate-100"></div>
              <div className="p-1.5 text-[9px] bg-slate-50 rounded border border-slate-100"></div>
            </div>
            {/* FRIDAY */}
            <div className="grid grid-cols-[50px_repeat(9,1fr)] gap-1.5">
              <div className="flex items-center justify-center text-xs font-semibold text-slate-500">FRI</div>
              <div className="p-1.5 text-[8px] bg-slate-100 rounded border border-slate-200 text-center font-medium col-span-2">Python LAB G2<br/>DM LAB G3</div>
              <div className="p-1.5 text-[9px] bg-white rounded border border-slate-200 text-center font-medium">OS</div>
              <div className="p-1.5 text-[9px] bg-white rounded border border-slate-200 text-center font-medium">AI</div>
              <div className="p-1.5 text-[9px] bg-amber-50 rounded border border-amber-200 text-center font-medium text-amber-600">Lunch</div>
              <div className="p-1.5 text-[9px] bg-white rounded border border-slate-200 text-center font-medium">DLCD</div>
              <div className="p-1.5 text-[9px] bg-slate-100 rounded border border-slate-200 text-center font-medium col-span-2">DBMS LAB G3</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Upcoming Classes & Marks Overview */}
      <div className="grid grid-cols-[2fr_1fr] gap-6">
        {/* Upcoming Classes */}
        <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-slate-900">Upcoming Classes</h3>
            <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">Next 2 Days</span>
          </div>
          <div className="space-y-4">
            {UPCOMING_CLASSES.map((day, idx) => (
              <div key={idx}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">{day.day}</span>
                  <span className="text-[10px] text-slate-400">{day.date}</span>
                </div>
                <div className="space-y-1.5">
                  {day.slots.map((cls, i) => (
                    <div key={i} className="flex items-center gap-3 p-2.5 bg-slate-50/80 rounded-lg hover:bg-slate-100 transition-colors">
                      <div className={cn("w-1 h-8 rounded-full", cls.type === 'Lab' ? "bg-slate-300" : "bg-blue-600")} />
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-slate-900">{cls.subject}</p>
                        <p className="text-[10px] text-slate-500">{cls.faculty} • {cls.room}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-medium text-slate-600">{cls.time}</p>
                        <span className={cn("text-[9px] font-medium px-1.5 py-0.5 rounded", cls.type === 'Lecture' ? "bg-blue-100 text-blue-700" : "bg-slate-200 text-slate-600")}>
                          {cls.type}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Marks Overview */}
        <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-slate-900">Marks Overview</h3>
            <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">Internal</span>
          </div>
          <div className="space-y-3">
            {MARKS.filter(m => m.total !== null).map((mark, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-slate-700">{mark.subject}</span>
                    <span className="text-[10px] text-slate-400">{mark.subjectCode}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={cn("text-xs font-semibold", 
                      mark.total >= 24 ? "text-blue-600" : 
                      mark.total >= 18 ? "text-amber-600" : "text-red-600"
                    )}>
                      {mark.total}/30
                    </span>
                    <span className={cn("text-[10px] px-1.5 py-0.5 rounded font-medium", 
                      mark.status === 'finalized' ? "bg-blue-50 text-blue-600" : 
                      mark.status === 'under_review' ? "bg-amber-50 text-amber-600" : "bg-slate-100 text-slate-500"
                    )}>
                      {mark.status === 'finalized' ? 'Final' : mark.status === 'under_review' ? 'Review' : 'Draft'}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-1">
                  <div className="bg-slate-50 rounded-lg p-2 text-center">
                    <p className="text-[10px] text-slate-400">Internal I</p>
                    <p className="text-xs font-semibold text-slate-700">{mark.internal1}/15</p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-2 text-center">
                    <p className="text-[10px] text-slate-400">Internal II</p>
                    <p className="text-xs font-semibold text-slate-700">{mark.internal2}/15</p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-2 text-center">
                    <p className="text-[10px] text-blue-400">Total</p>
                    <p className="text-xs font-bold text-blue-600">{mark.total}/30</p>
                  </div>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5">
                  <div 
                    className={cn("h-1.5 rounded-full", 
                      mark.total >= 24 ? "bg-blue-500" : 
                      mark.total >= 18 ? "bg-amber-500" : "bg-red-500"
                    )} 
                    style={{ width: `${Math.min((mark.total / 30) * 100, 100)}%` }} 
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">Class Average</span>
              <span className="text-sm font-bold text-blue-600">
                {Math.round(MARKS.reduce((sum, m) => sum + m.total, 0) / MARKS.length)}/30
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Semester Resources */}
      <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-slate-200 shadow-[0_2px_8px_rgba(0,0,0,0.06)] overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 border border-slate-200 rounded-xl flex items-center justify-center text-blue-600 shadow-sm">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 text-base">Semester Resources</h3>
              <p className="text-xs text-slate-500">Academic documents & syllabus</p>
            </div>
          </div>
        </div>
        <div className="p-5">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {SEMESTER_RESOURCES.map((res) => (
              <a
                key={res.id}
                href={res.file}
                target="_blank"
                className="group p-4 rounded-xl border border-slate-200 hover:border-blue-300 transition-all hover:shadow-md bg-slate-50/50"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm border border-slate-100">
                    <Download className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm text-slate-800">{res.title}</p>
                    <p className="text-xs text-slate-500">{res.description}</p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Subject Notes */}
      <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-slate-200 shadow-[0_2px_8px_rgba(0,0,0,0.06)] overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-50 border border-purple-200 rounded-xl flex items-center justify-center text-purple-600 shadow-sm">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 text-base">Subject Notes</h3>
              <p className="text-xs text-slate-500">Study materials for each subject</p>
            </div>
          </div>
        </div>
        <div className="p-5">
          <div className="grid md:grid-cols-2 gap-4">
            {SUBJECT_NOTES.map((subject) => (
              <div key={subject.id} className="p-4 rounded-xl border border-slate-200 hover:border-purple-300 transition-all hover:shadow-md bg-slate-50/50">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-semibold text-sm text-slate-800">{subject.subject}</p>
                    <p className="text-xs text-slate-500">{subject.code}</p>
                  </div>
                  <span className="text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded-full font-medium">
                    {subject.notes.length} notes
                  </span>
                </div>
                <div className="space-y-2">
                  {subject.notes.map((note, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 bg-white rounded-lg border border-slate-100 hover:border-purple-200 transition-colors cursor-pointer">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-slate-400" />
                        <span className="text-xs text-slate-700">{note.title}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-400">{note.pages} pages</span>
                        <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">{note.type}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Today's Schedule (Compact) */}
      <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-slate-900">Today&apos;s Schedule</h3>
          <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">Today</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {TODAY_CLASSES.map((cls, i) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-slate-50/80 rounded-xl hover:bg-slate-100 transition-colors">
              <div className={cn("w-1 h-10 rounded-full", i === 0 ? "bg-blue-600" : cls.type === 'Lab' ? "bg-slate-300" : "bg-slate-200")} />
              <div className="flex-1">
                <p className="text-xs font-semibold text-slate-900 truncate">{cls.subject}</p>
                <p className="text-[10px] text-slate-500">{cls.faculty} • {cls.room}</p>
              </div>
              <div className="w-12 text-right">
                <p className="text-xs font-medium text-slate-600">{cls.time}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

function QuickStatCard({ label, value, icon: Icon, color, trend, sub }: any) {
  const colorMap: Record<string, string> = {
    blue: 'from-blue-50 to-blue-100 text-blue-700',
    green: 'from-green-50 to-green-100 text-green-700',
    amber: 'from-amber-50 to-amber-100 text-amber-700',
    purple: 'from-purple-50 to-purple-100 text-purple-700',
    red: 'from-red-50 to-red-100 text-red-700',
  }

  return (
    <motion.div variants={itemVariants} className="bg-white rounded-2xl p-5 border border-slate-200/60 shadow-[0_2px_8px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08),0_8px_24px_rgba(0,0,0,0.06)] hover:border-slate-300/60 transition-all duration-300">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-slate-500">{label}</span>
        <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center shadow-sm", colorMap[color])}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div className="flex items-baseline gap-1.5">
        <p className="text-3xl font-bold text-slate-900">{value}</p>
      </div>
      <p className="text-[10px] text-slate-500 mt-1">{sub}</p>
    </motion.div>
  )
}

function QuickActionButton({ label, icon: Icon, onClick, color }: { label: string; icon: any; onClick: () => void; color: string }) {
  const colorMap: Record<string, string> = {
    blue: 'from-blue-600 to-blue-700 shadow-blue-600/20',
    green: 'from-green-600 to-green-700 shadow-green-600/20',
    amber: 'from-amber-600 to-amber-700 shadow-amber-600/20',
  }

  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 p-3.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all group"
    >
      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shadow-lg", colorMap[color])}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <span className="text-sm font-semibold text-slate-700">{label}</span>
      <ChevronRight className="w-4 h-4 text-slate-400 ml-auto group-hover:text-slate-700 transition-colors" />
    </button>
  )
}

function CalendarCheck({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
      <line x1="16" x2="16" y1="2" y2="6"/>
      <line x1="8" x2="8" y1="2" y2="6"/>
      <line x1="3" x2="21" y1="10" y2="10"/>
      <path d="m9 16 2 2 4-4"/>
    </svg>
  )
}

// ==================== TIMETABLE VIEW ====================
function TimetableView() {
  return <TimetableViewer studentInfo={{ branch: 'CSE AI&ML', semester: 4 }} />
}

// ==================== ASSIGNMENTS VIEW ====================
function AssignmentsView() {
  const [filter, setFilter] = useState<'all' | 'pending' | 'submitted' | 'evaluated'>('all')
  const [showSubmitModal, setShowSubmitModal] = useState(false)
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null)
  const [submissionType, setSubmissionType] = useState<'file' | 'text' | 'github'>('file')
  const [submissionText, setSubmissionText] = useState('')
  const [githubLink, setGithubLink] = useState('')

  const filteredAssignments = filter === 'all' ? ASSIGNMENTS : ASSIGNMENTS.filter(a => a.status === filter)

  const handleSubmit = () => {
    setShowSubmitModal(false)
    setSelectedAssignment(null)
    setSubmissionText('')
    setGithubLink('')
  }

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'pending': return { bg: 'bg-amber-100 text-amber-700', label: 'Pending' }
      case 'submitted': return { bg: 'bg-blue-100 text-blue-700', label: 'Submitted' }
      case 'evaluated': return { bg: 'bg-green-100 text-green-700', label: 'Evaluated' }
      case 'late': return { bg: 'bg-red-100 text-red-700', label: 'Late' }
      default: return { bg: 'bg-slate-100 text-slate-700', label: status }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">Assignments</h2>
        <div className="flex gap-2">
          {(['all', 'pending', 'submitted', 'evaluated'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors capitalize",
                filter === f ? "bg-slate-800 text-white" : "bg-white text-slate-600 border border-slate-200"
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filteredAssignments.map((a) => (
          <div key={a.id} className={cn("bg-white rounded-2xl border p-4 shadow-sm", a.status === 'late' ? "border-red-300 bg-red-50/30" : "border-slate-200")}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-slate-900">{a.title}</h3>
                  <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-medium">{a.subject}</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">{a.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={cn("text-xs font-medium px-2.5 py-1 rounded-lg", getStatusStyle(a.status).bg)}>
                  {getStatusStyle(a.status).label}
                </span>
                <span className="text-xs text-slate-500">Due: {a.dueDate}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-xs text-slate-500">
                <span>Max Marks: {a.maxMarks}</span>
                {a.marks !== undefined && <span className="text-green-600 font-medium">Marks: {a.marks}</span>}
              </div>
              {a.status === 'pending' && (
                <button 
                  onClick={() => { setSelectedAssignment(a); setShowSubmitModal(true); }}
                  className="px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700"
                >
                  Submit Now
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Submit Assignment Modal */}
      {showSubmitModal && selectedAssignment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Submit Assignment</h3>
                <p className="text-sm text-slate-500">{selectedAssignment.title}</p>
              </div>
              <button 
                onClick={() => setShowSubmitModal(false)}
                className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-800">{selectedAssignment.subject}</p>
                  <p className="text-xs text-slate-500">Due: {selectedAssignment.dueDate} • Max: {selectedAssignment.maxMarks} marks</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">Submission Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['file', 'text', 'github'] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => setSubmissionType(type)}
                      className={cn(
                        "px-3 py-2.5 rounded-xl text-sm font-medium transition-all capitalize",
                        submissionType === type 
                          ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25" 
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      )}
                    >
                      {type === 'github' ? 'GitHub' : type === 'text' ? 'Text' : 'File'}
                    </button>
                  ))}
                </div>
              </div>

              {submissionType === 'file' && (
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-blue-400 hover:bg-blue-50/30 transition-colors cursor-pointer">
                  <Upload className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm font-medium text-slate-700">Click to upload file</p>
                  <p className="text-xs text-slate-500 mt-1">PDF, DOC, or ZIP files only</p>
                </div>
              )}

              {submissionType === 'text' && (
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">Your Answer</label>
                  <textarea
                    value={submissionText}
                    onChange={(e) => setSubmissionText(e.target.value)}
                    placeholder="Type your answer here..."
                    className="w-full h-40 px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>
              )}

              {submissionType === 'github' && (
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">GitHub Repository Link</label>
                  <input
                    type="url"
                    value={githubLink}
                    onChange={(e) => setGithubLink(e.target.value)}
                    placeholder="https://github.com/username/repo"
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button 
                  onClick={() => setShowSubmitModal(false)}
                  className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 text-sm font-medium rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSubmit}
                  className="flex-1 px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Submit
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

// ==================== ATTENDANCE VIEW ====================
function AttendanceView() {
  const totalClasses = SUBJECTS.reduce((sum, s) => sum + s.totalClasses, 0)
  const totalPresent = SUBJECTS.reduce((sum, s) => sum + s.presentClasses, 0)
  const overallAttendance = Math.round((totalPresent / totalClasses) * 100)

  const getEligibilityStatus = (attendance: number) => {
    if (attendance >= 75) return { status: 'Eligible', color: 'green', icon: CheckCircle }
    if (attendance >= 65) return { status: 'At Risk', color: 'yellow', icon: AlertCircle }
    return { status: 'Not Eligible', color: 'red', icon: XCircle }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-slate-900">Attendance Tracking</h2>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200/60 p-5 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-slate-500">Overall Attendance</span>
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-900">{overallAttendance}%</p>
          <p className="text-xs text-slate-400 mt-1">{totalPresent}/{totalClasses} classes attended</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200/60 p-5 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-slate-500">Exam Eligibility</span>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${overallAttendance >= 75 ? 'bg-green-50 text-green-600' : overallAttendance >= 65 ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'}`}>
              {overallAttendance >= 75 ? <CheckCircle className="w-5 h-5" /> : overallAttendance >= 65 ? <AlertCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={cn("text-xl font-bold", overallAttendance >= 75 ? "text-green-600" : overallAttendance >= 65 ? "text-amber-600" : "text-red-600")}>
              {overallAttendance >= 75 ? 'Eligible' : overallAttendance >= 65 ? 'At Risk' : 'Not Eligible'}
            </span>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200/60 p-5 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-slate-500">Required for 75%</span>
            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
              <Target className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-900">
            {Math.max(0, Math.ceil((0.75 * totalClasses) - totalPresent))}
          </p>
          <p className="text-xs text-slate-400 mt-1">more classes needed</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/60 p-5 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
        <h3 className="text-base font-semibold text-slate-900 mb-4">Subject-wise Attendance</h3>
        <div className="space-y-4">
          {SUBJECTS.map((subject) => {
            const eligibility = getEligibilityStatus(subject.attendance)
            return (
              <div key={subject.id} className="p-4 bg-slate-50/50 rounded-xl hover:bg-slate-50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{subject.name}</p>
                    <p className="text-xs text-slate-500">{subject.code} • {subject.presentClasses}/{subject.totalClasses} classes</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={cn("text-sm font-bold", eligibility.color === 'green' ? "text-green-600" : eligibility.color === 'yellow' ? "text-amber-600" : "text-red-600")}>
                      {subject.attendance}%
                    </span>
                    <eligibility.icon className={cn("w-4 h-4", eligibility.color === 'green' ? "text-green-600" : eligibility.color === 'yellow' ? "text-amber-600" : "text-red-600")} />
                  </div>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div 
                    className={cn("h-2 rounded-full transition-all", eligibility.color === 'green' ? "bg-green-500" : eligibility.color === 'yellow' ? "bg-amber-500" : "bg-red-500")} 
                    style={{ width: `${subject.attendance}%` }} 
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ==================== MARKS VIEW ====================
function MarksView() {
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'finalized': return { bg: 'bg-green-100 text-green-700', label: 'Finalized' }
      case 'under_review': return { bg: 'bg-amber-100 text-amber-700', label: 'Under Review' }
      case 'draft': return { bg: 'bg-slate-100 text-slate-700', label: 'Draft' }
      default: return { bg: 'bg-slate-100 text-slate-700', label: status }
    }
  }

  const totalMarks = MARKS.reduce((sum, m) => sum + m.total, 0)
  const maxMarks = MARKS.length * 30
  const average = Math.round((totalMarks / maxMarks) * 100)

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-slate-900">Marks & Grades</h2>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200/60 p-5 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-slate-500">Total Internal Marks</span>
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-900">{totalMarks}/{maxMarks}</p>
          <p className="text-xs text-slate-400 mt-1">6 subjects × 30 marks</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200/60 p-5 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-slate-500">Average</span>
            <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-bold text-blue-600">{average}%</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200/60 p-5 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-slate-500">Subjects</span>
            <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-900">{MARKS.length}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/60 shadow-[0_2px_8px_rgba(0,0,0,0.06)] overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Subject</th>
              <th className="text-center text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Internal I</th>
              <th className="text-center text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Internal II</th>
              <th className="text-center text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Total</th>
              <th className="text-center text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {MARKS.map((mark, i) => (
              <tr key={i} className="hover:bg-slate-50">
                <td className="px-4 py-3">
                  <p className="text-sm font-medium text-slate-900">{mark.subject}</p>
                  <p className="text-[10px] text-slate-500">{mark.subjectCode}</p>
                </td>
                <td className="px-4 py-3 text-center text-sm text-slate-700">{mark.internal1}</td>
                <td className="px-4 py-3 text-center text-sm text-slate-700">{mark.internal2}</td>
                <td className="px-4 py-3 text-center">
                  <span className="text-sm font-bold text-slate-900">{mark.total}</span>
                  <span className="text-[10px] text-slate-400">/30</span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className={cn("text-[10px] font-medium px-2 py-0.5 rounded-full", getStatusStyle(mark.status).bg)}>
                    {getStatusStyle(mark.status).label}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ==================== TRACK REPORT VIEW ====================
function TrackReportView() {
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'locked': return { bg: 'bg-green-50', text: 'text-green-600', icon: CheckCircle, label: 'Completed' }
      case 'in_progress': return { bg: 'bg-blue-50', text: 'text-blue-600', icon: Clock, label: 'In Progress' }
      default: return { bg: 'bg-slate-50', text: 'text-slate-600', icon: Lock, label: 'Locked' }
    }
  }

  const overallCGPA = 8.2

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white border border-slate-200 rounded-xl flex items-center justify-center shadow-sm">
            <Scroll className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Track Report</h2>
            <p className="text-sm text-slate-500">Academic performance across semesters</p>
          </div>
        </div>
        <button className="px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 flex items-center gap-2 shadow-lg shadow-blue-500/25">
          <Download className="w-4 h-4" />
          Download DMC
        </button>
      </div>

      {/* Overall Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
          <p className="text-xs text-slate-500 mb-1">Overall CGPA</p>
          <p className="text-3xl font-bold text-slate-900">{overallCGPA}</p>
          <p className="text-xs text-slate-400 mt-1">Out of 10.0</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
          <p className="text-xs text-slate-500 mb-1">Semesters Completed</p>
          <p className="text-3xl font-bold text-slate-900">3</p>
          <p className="text-xs text-slate-400 mt-1">Out of 8</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
          <p className="text-xs text-slate-500 mb-1">Average Attendance</p>
          <p className="text-3xl font-bold text-slate-900">82%</p>
          <p className="text-xs text-slate-400 mt-1">All semesters</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
          <p className="text-xs text-slate-500 mb-1">Current Status</p>
          <div className="flex items-center gap-2 mt-1">
            <Clock className="w-5 h-5 text-blue-600" />
            <span className="text-lg font-bold text-blue-600">Sem 4 On Going</span>
          </div>
        </div>
      </div>

      {/* Semester List */}
      <div className="space-y-4">
        <h3 className="text-base font-semibold text-slate-800">Semester Details</h3>
        
        {/* Semester 1 */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-lg font-semibold text-slate-900">Semester 1</h4>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Completed</span>
                </div>
                <p className="text-sm text-slate-500">Academic Year 2024-25</p>
              </div>
            </div>
            <button className="px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg font-medium flex items-center gap-1">
              <Download className="w-4 h-4" />
              DMC
            </button>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-slate-100">
            <div>
              <p className="text-xs text-slate-500">CGPA</p>
              <p className="text-xl font-bold text-slate-900">8.2</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Attendance</p>
              <p className="text-xl font-bold text-slate-900">82%</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Subjects</p>
              <p className="text-xl font-bold text-slate-900">5</p>
            </div>
          </div>
        </div>

        {/* Semester 2 */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-lg font-semibold text-slate-900">Semester 2</h4>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Completed</span>
                </div>
                <p className="text-sm text-slate-500">Academic Year 2024-25</p>
              </div>
            </div>
            <button className="px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg font-medium flex items-center gap-1">
              <Download className="w-4 h-4" />
              DMC
            </button>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-slate-100">
            <div>
              <p className="text-xs text-slate-500">CGPA</p>
              <p className="text-xl font-bold text-slate-900">7.9</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Attendance</p>
              <p className="text-xl font-bold text-slate-900">78%</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Subjects</p>
              <p className="text-xl font-bold text-slate-900">5</p>
            </div>
          </div>
        </div>

        {/* Semester 3 */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-lg font-semibold text-slate-900">Semester 3</h4>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Completed</span>
                </div>
                <p className="text-sm text-slate-500">Academic Year 2025-26</p>
              </div>
            </div>
            <button className="px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg font-medium flex items-center gap-1">
              <Download className="w-4 h-4" />
              DMC
            </button>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-slate-100">
            <div>
              <p className="text-xs text-slate-500">CGPA</p>
              <p className="text-xl font-bold text-slate-900">8.4</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Attendance</p>
              <p className="text-xl font-bold text-slate-900">85%</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Subjects</p>
              <p className="text-xl font-bold text-slate-900">5</p>
            </div>
          </div>
        </div>

        {/* Semester 4 - Ongoing */}
        <div className="bg-white rounded-2xl border-2 border-blue-200 p-5 shadow-[0_4px_12px_rgba(37,99,235,0.15)] bg-blue-50/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-lg font-semibold text-slate-900">Semester 4</h4>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">In Progress</span>
                </div>
                <p className="text-sm text-slate-500">Academic Year 2025-26 • Current</p>
              </div>
            </div>
            <span className="text-xs text-blue-600 font-medium">Ongoing</span>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-blue-100">
            <div>
              <p className="text-xs text-blue-500">CGPA</p>
              <p className="text-xl font-bold text-blue-600">—</p>
            </div>
            <div>
              <p className="text-xs text-blue-500">Attendance</p>
              <p className="text-xl font-bold text-blue-600">79%</p>
            </div>
            <div>
              <p className="text-xs text-blue-500">Subjects</p>
              <p className="text-xl font-bold text-blue-600">6</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ==================== FEES VIEW ====================
function FeesView() {
  const [showQR, setShowQR] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)

  const totalPending = FEE_STRUCTURE.filter(f => f.status === 'pending').reduce((sum, f) => sum + f.total, 0)
  const totalPaid = FEE_STRUCTURE.filter(f => f.status === 'paid').reduce((sum, f) => sum + f.total, 0)
  const pendingFee = FEE_STRUCTURE.find(f => f.status === 'pending')

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-slate-900">Fee Submission</h2>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-slate-500">Total Paid</span>
            <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-green-600">₹{totalPaid.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-slate-500">Pending</span>
            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-amber-600">₹{totalPending.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-slate-500">Per Semester</span>
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900">₹59,050</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-slate-500">Next Due</span>
            <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
              <CalendarDays className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900">Feb 28</p>
        </div>
      </div>

      {pendingFee && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/50 rounded-2xl p-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex items-start gap-4 flex-1">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600 shrink-0">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-amber-900 text-lg">Pending Fee Payment</h3>
                <p className="text-amber-700 mt-1">
                  You have <span className="font-bold text-amber-900">₹{pendingFee.total.toLocaleString()}</span> pending for {pendingFee.semester} ({pendingFee.year})
                </p>
              </div>
            </div>
            <button 
              onClick={() => setShowPaymentModal(true)}
              className="px-5 py-2.5 bg-amber-600 text-white font-medium rounded-xl hover:bg-amber-700 inline-flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all hover:scale-105"
            >
              <CreditCard className="w-4 h-4" />
              Pay Now
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="font-semibold text-slate-900">Fee Structure</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left text-[10px] font-semibold text-slate-500 uppercase px-4 py-3">Semester</th>
                <th className="text-right text-[10px] font-semibold text-slate-500 uppercase px-4 py-3">Tuition</th>
                <th className="text-right text-[10px] font-semibold text-slate-500 uppercase px-4 py-3">Hostel</th>
                <th className="text-right text-[10px] font-semibold text-slate-500 uppercase px-4 py-3">Total</th>
                <th className="text-center text-[10px] font-semibold text-slate-500 uppercase px-4 py-3">Status</th>
                <th className="text-center text-[10px] font-semibold text-slate-500 uppercase px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {FEE_STRUCTURE.map((fee) => (
                <tr key={fee.id} className="hover:bg-slate-50">
                  <td className="px-4 py-4">
                    <p className="text-sm font-semibold text-slate-900">{fee.semester}</p>
                    <p className="text-xs text-slate-500">{fee.year}</p>
                  </td>
                  <td className="px-4 py-4 text-sm text-right text-slate-600">₹{fee.tuition.toLocaleString()}</td>
                  <td className="px-4 py-4 text-sm text-right text-slate-600">₹{fee.hostel.toLocaleString()}</td>
                  <td className="px-4 py-4 text-sm font-bold text-slate-900 text-right">₹{fee.total.toLocaleString()}</td>
                  <td className="px-4 py-4 text-center">
                    <span className={cn("px-3 py-1.5 rounded-full text-xs font-semibold", fee.status === 'paid' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600')}>
                      {fee.status === 'paid' ? 'Paid' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    {fee.status === 'paid' ? (
                      <button className="text-blue-600 hover:text-blue-700 text-sm font-medium inline-flex items-center gap-1">
                        <Download className="w-4 h-4" /> Receipt
                      </button>
                    ) : (
                      <button 
                        onClick={() => setShowPaymentModal(true)}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium inline-flex items-center gap-1"
                      >
                        Pay <ChevronRight className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-semibold text-slate-900">Transaction History</h3>
          <button className="text-sm text-blue-600 hover:underline flex items-center gap-1 font-medium">
            <Download className="w-4 h-4" /> Download All
          </button>
        </div>
        <div className="divide-y divide-slate-100">
          {TRANSACTIONS.map((txn) => (
            <div key={txn.id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">₹{txn.amount.toLocaleString()}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-slate-500">{txn.method}</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-xs text-slate-500">{txn.reference}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-slate-900">{txn.semester}</p>
                <p className="text-xs text-slate-500">{txn.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-1">Select Payment Method</h3>
              <p className="text-slate-500 text-sm">Amount: ₹59,050</p>
            </div>
            <div className="space-y-3">
              <button 
                onClick={() => { setShowPaymentModal(false); setShowQR(true); }}
                className="w-full flex items-center gap-4 p-4 border border-slate-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                  <QrCode className="w-6 h-6" />
                </div>
                <div className="text-left flex-1">
                  <p className="font-semibold text-slate-900">UPI / QR Code</p>
                  <p className="text-xs text-slate-500">Scan & Pay via any UPI app</p>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </button>
              <button className="w-full flex items-center gap-4 p-4 border border-slate-200 rounded-xl hover:border-green-300 hover:bg-green-50 transition-all">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600">
                  <Landmark className="w-6 h-6" />
                </div>
                <div className="text-left flex-1">
                  <p className="font-semibold text-slate-900">Net Banking</p>
                  <p className="text-xs text-slate-500">Direct bank transfer</p>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </button>
              <button className="w-full flex items-center gap-4 p-4 border border-slate-200 rounded-xl hover:border-purple-300 hover:bg-purple-50 transition-all">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600">
                  <CreditCard className="w-6 h-6" />
                </div>
                <div className="text-left flex-1">
                  <p className="font-semibold text-slate-900">Debit / Credit Card</p>
                  <p className="text-xs text-slate-500">Visa, Mastercard, RuPay</p>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <button 
              onClick={() => setShowPaymentModal(false)}
              className="w-full mt-4 px-4 py-2.5 border border-slate-200 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {showQR && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <div className="text-center">
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mx-auto mb-4">
                <QrCode className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-1">Scan to Pay</h3>
              <p className="text-slate-500 mb-4">Amount: <span className="font-bold text-slate-900">₹59,050</span></p>
              <div className="bg-slate-100 rounded-xl p-4 mb-4">
                <div className="w-40 h-40 bg-white mx-auto rounded-lg flex items-center justify-center border-2 border-dashed border-slate-300">
                  <QrCode className="w-24 h-24 text-slate-400" />
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => setShowQR(false)}
                  className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-50"
                >
                  Cancel
                </button>
                <a 
                  href="upi://pay?pa=college@upi&pn=DeptWP&am=59050"
                  className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium text-center hover:bg-blue-700"
                >
                  Open UPI
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ==================== HOSTEL VIEW ====================
function HostelView() {
  const [activeTab, setActiveTab] = useState<'details' | 'mess' | 'emergency'>('details')
  const getStatusStyle = (status: string) => {
    return status === 'current' 
      ? { bg: 'bg-blue-50 text-blue-600', label: 'Current' }
      : { bg: 'bg-slate-100 text-slate-600', label: 'Previous' }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white border border-slate-200 rounded-xl flex items-center justify-center shadow-sm">
            <Building2 className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Hostel Details</h2>
            <p className="text-sm text-slate-500">Your accommodation information</p>
          </div>
        </div>
        <button className="px-4 py-2.5 bg-white border border-slate-200 text-slate-700 text-sm font-medium rounded-xl hover:bg-slate-50 flex items-center gap-2 shadow-sm">
          <AlertTriangle className="w-4 h-4" />
          Report Issue
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <button onClick={() => setActiveTab('details')} className={cn("px-4 py-2.5 rounded-xl text-sm font-medium transition-all", activeTab === 'details' ? "bg-blue-600 text-white shadow-sm" : "bg-white border border-slate-200 text-slate-600 hover:border-slate-300")}>Details</button>
        <button onClick={() => setActiveTab('mess')} className={cn("px-4 py-2.5 rounded-xl text-sm font-medium transition-all", activeTab === 'mess' ? "bg-blue-600 text-white shadow-sm" : "bg-white border border-slate-200 text-slate-600 hover:border-slate-300")}>Mess Menu</button>
        <button onClick={() => setActiveTab('emergency')} className={cn("px-4 py-2.5 rounded-xl text-sm font-medium transition-all", activeTab === 'emergency' ? "bg-blue-600 text-white shadow-sm" : "bg-white border border-slate-200 text-slate-600 hover:border-slate-300")}>Emergency Contacts</button>
      </div>

      {activeTab === 'details' && (
        <>
          {/* Main Hostel Card */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="h-16 bg-slate-50 border-b border-slate-100"></div>
            <div className="px-6 pb-6">
              <div className="flex items-center gap-4 -mt-10 mb-4">
                <div className="w-16 h-16 bg-white border border-slate-200 rounded-xl shadow-sm flex items-center justify-center">
                  <Building2 className="w-8 h-8 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-bold text-slate-900">{CURRENT_HOSTEL.name}</h2>
                  <p className="text-sm text-slate-500">{CURRENT_HOSTEL.block}</p>
                </div>
                <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-full">Current</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                    <Home className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500">Room Number</p>
                    <p className="text-sm font-semibold text-slate-900">{CURRENT_HOSTEL.roomNumber}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                  <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center text-purple-600">
                    <Bed className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500">Bed Type</p>
                    <p className="text-sm font-semibold text-slate-900">{CURRENT_HOSTEL.bedType}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                  <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center text-amber-600">
                    <Utensils className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500">Mess Type</p>
                    <p className="text-sm font-semibold text-slate-900">{CURRENT_HOSTEL.messType}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                  <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-green-600">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500">Floor</p>
                    <p className="text-sm font-semibold text-slate-900">{CURRENT_HOSTEL.floor}</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100">
                <h4 className="text-xs font-medium text-slate-500 mb-2">Warden Contact</h4>
                <p className="text-sm font-semibold text-slate-900">{CURRENT_HOSTEL.warden}</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {CURRENT_HOSTEL.wardens.map((w, i) => (
                    <span key={i} className="text-xs text-slate-500">{w}</span>
                  ))}
                </div>
                <a href={`tel:${CURRENT_HOSTEL.contact}`} className="inline-flex items-center gap-1 text-xs text-blue-600 mt-1 hover:underline">
                  <Phone className="w-3 h-3" /> {CURRENT_HOSTEL.contact}
                </a>
              </div>
            </div>
          </div>

          {/* Amenities Grid */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <h3 className="font-semibold text-slate-900 mb-4">Hostel Amenities</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {HOSTEL_AMENITIES.map((amenity) => (
                <div key={amenity.id} className="p-4 bg-slate-50 rounded-xl text-center hover:bg-slate-100 transition-colors">
                  <div className="w-10 h-10 bg-white rounded-lg shadow-sm flex items-center justify-center mx-auto mb-2">
                    <amenity.icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <p className="text-xs font-semibold text-slate-800">{amenity.name}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{amenity.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Hostel History */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-slate-100">
              <h3 className="font-semibold text-slate-900 text-sm flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Hostel History
              </h3>
            </div>
            <div className="divide-y divide-slate-100">
              {HOSTEL_HISTORY.map((history, idx) => (
                <div key={idx} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50">
                  <div className="flex items-center gap-4">
                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", getStatusStyle(history.status).bg)}>
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">{history.hostel}</p>
                      <p className="text-xs text-slate-500">Block {history.block} • Room {history.room}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={cn("text-xs font-medium px-2 py-1 rounded-full", getStatusStyle(history.status).bg)}>
                      {history.semester}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {activeTab === 'mess' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <h3 className="font-semibold text-slate-900 mb-4">Weekly Mess Menu</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(MESS_MENU).map(([meal, items]) => (
              <div key={meal} className="p-4 bg-slate-50 rounded-xl">
                <h4 className="text-sm font-semibold text-slate-800 capitalize mb-3 flex items-center gap-2">
                  {meal === 'breakfast' && <Coffee className="w-4 h-4 text-amber-500" />}
                  {meal === 'lunch' && <Utensils className="w-4 h-4 text-green-500" />}
                  {meal === 'snacks' && <Star className="w-4 h-4 text-orange-500" />}
                  {meal === 'dinner' && <Moon className="w-4 h-4 text-indigo-500" />}
                  {meal}
                </h4>
                <ul className="space-y-1.5">
                  {items.map((item, idx) => (
                    <li key={idx} className="text-xs text-slate-600 flex items-center gap-2">
                      <span className="w-1 h-1 bg-slate-300 rounded-full" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-xs text-amber-800">Mess timings: Breakfast 7:00-9:00 AM | Lunch 12:00-2:00 PM | Snacks 4:30-5:30 PM | Dinner 7:00-9:00 PM</p>
          </div>
        </div>
      )}

      {activeTab === 'emergency' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <h3 className="font-semibold text-slate-900 mb-4">Emergency Contacts</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {HOSTEL_EMERGENCY.map((contact) => (
              <div key={contact.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{contact.name}</p>
                  <p className="text-xs text-slate-500 mt-0.5">Available: {contact.available}</p>
                </div>
                <a href={`tel:${contact.phone}`} className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Call
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ==================== SPORTS VIEW ====================
function SportsView() {
  const [activeSection, setActiveSection] = useState<'facilities' | 'events' | 'achievements' | 'registrations'>('facilities')
  const [showRegisterModal, setShowRegisterModal] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<any>(null)

  const myRegistrations = SPORTS_EVENTS.filter(e => e.registered)

  const openRegisterModal = (event: any) => {
    setSelectedEvent(event)
    setShowRegisterModal(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white border border-slate-200 rounded-xl flex items-center justify-center shadow-sm">
            <Dumbbell className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Sports & Recreation</h2>
            <p className="text-sm text-slate-500">Facilities, events & achievements</p>
          </div>
        </div>
      </div>

      {/* Section Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <button onClick={() => setActiveSection('facilities')} className={cn("px-4 py-2.5 rounded-xl text-sm font-medium transition-all", activeSection === 'facilities' ? "bg-blue-600 text-white shadow-sm" : "bg-white border border-slate-200 text-slate-600 hover:border-slate-300")}>Facilities</button>
        <button onClick={() => setActiveSection('events')} className={cn("px-4 py-2.5 rounded-xl text-sm font-medium transition-all", activeSection === 'events' ? "bg-blue-600 text-white shadow-sm" : "bg-white border border-slate-200 text-slate-600 hover:border-slate-300")}>Events</button>
        <button onClick={() => setActiveSection('registrations')} className={cn("px-4 py-2.5 rounded-xl text-sm font-medium transition-all", activeSection === 'registrations' ? "bg-blue-600 text-white shadow-sm" : "bg-white border border-slate-200 text-slate-600 hover:border-slate-300")}>My Registrations</button>
        <button onClick={() => setActiveSection('achievements')} className={cn("px-4 py-2.5 rounded-xl text-sm font-medium transition-all", activeSection === 'achievements' ? "bg-blue-600 text-white shadow-sm" : "bg-white border border-slate-200 text-slate-600 hover:border-slate-300")}>Achievements</button>
      </div>

      {activeSection === 'facilities' && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {SPORTS_FACILITIES.map((facility) => (
            <div key={facility.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-3xl mb-3">{facility.icon}</div>
              <h3 className="font-semibold text-slate-900">{facility.name}</h3>
              <p className="text-xs text-slate-500 mt-1">{facility.timing}</p>
              <div className="flex items-center gap-2 mt-3">
                <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Available
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeSection === 'events' && (
        <div className="space-y-4">
          {SPORTS_EVENTS.map((event) => (
            <div key={event.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center text-2xl">
                    {event.sport === 'Basketball' ? '🏀' : event.sport === 'Badminton' ? '🏸' : event.sport === 'Cricket' ? '🏏' : '🏓'}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">{event.name}</h3>
                    <p className="text-sm text-slate-500">{event.sport} • {event.type}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                      <span className="flex items-center gap-1"><CalendarDays className="w-3 h-3" /> {event.date}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {event.venue}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded">Deadline: {event.registrationDeadline}</span>
                      {event.teams && <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded">{event.teams} Teams</span>}
                      {event.participants && <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded">{event.participants} Participants</span>}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  {event.registered ? (
                    <span className="px-3 py-1.5 bg-green-50 text-green-600 text-xs font-medium rounded-full">Registered</span>
                  ) : (
                    <button 
                      onClick={() => openRegisterModal(event)}
                      className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
                    >
                      Register
                    </button>
                  )}
                  <p className="text-xs text-slate-500 mt-2">₹{event.fee}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeSection === 'registrations' && (
        <div className="space-y-4">
          {myRegistrations.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
              <ClipboardList className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-500 font-medium">No registrations yet</p>
              <p className="text-sm text-slate-400 mt-1">Browse events to register</p>
            </div>
          ) : (
            myRegistrations.map((event) => (
              <div key={event.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">{event.name}</h3>
                      <p className="text-sm text-slate-500">{event.sport} • {event.date}</p>
                      <p className="text-xs text-green-600 mt-1">Registration Confirmed</p>
                    </div>
                  </div>
                  <button className="text-sm text-blue-600 hover:underline">View Details</button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeSection === 'achievements' && (
        <div className="space-y-4">
          {SPORTS_ACHIEVEMENTS.map((achievement) => (
            <div key={achievement.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center">
                  <Trophy className="w-7 h-7 text-amber-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900">{achievement.event}</h3>
                  <p className="text-sm text-slate-500">{achievement.sport} • {achievement.date}</p>
                  <p className="text-xs text-slate-400 mt-1">Student: {achievement.student}</p>
                </div>
                <div className="text-right">
                  <span className={cn("px-3 py-1.5 rounded-full text-xs font-medium", 
                    achievement.position === 'Winner' ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-600"
                  )}>
                    {achievement.position}
                  </span>
                </div>
              </div>
            </div>
          ))}
          {SPORTS_ACHIEVEMENTS.length === 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
              <Medal className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-500">No achievements yet. Start participating!</p>
            </div>
          )}
        </div>
      )}

      {/* Registration Modal */}
      {showRegisterModal && selectedEvent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">Event Registration</h3>
              <button onClick={() => setShowRegisterModal(false)} className="text-slate-400 hover:text-slate-600">
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-xl">
                <h4 className="font-semibold text-slate-900">{selectedEvent.name}</h4>
                <p className="text-sm text-slate-500">{selectedEvent.sport} • {selectedEvent.date}</p>
                <p className="text-sm text-slate-500">{selectedEvent.venue}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Team Name (optional)</label>
                <input type="text" placeholder="Enter team name for team events" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Player Names (for team events)</label>
                <textarea placeholder="Enter player names separated by comma" rows={2} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
              </div>
              <div className="flex items-center justify-between p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <span className="text-sm text-slate-700">Registration Fee</span>
                <span className="font-bold text-slate-900">₹{selectedEvent.fee}</span>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowRegisterModal(false)} className="flex-1 px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50">Cancel</button>
                <button onClick={() => setShowRegisterModal(false)} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">Confirm & Pay</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ==================== REQUESTS VIEW ====================
function RequestsView() {
  const [activeRequestTab, setActiveRequestTab] = useState('leave')
  const [showNewRequestModal, setShowNewRequestModal] = useState(false)
  const [requestType, setRequestType] = useState<'leave' | 'issue'>('leave')
  
  const requestTabs = [
    { id: 'leave', label: 'Leave Application', icon: CalendarDays, count: 2 },
    { id: 'issue', label: 'Report Issue', icon: AlertTriangle, count: 1 },
  ]

  const allRequests = [
    { id: 1, type: 'leave', subject: 'Medical Leave', date: '2026-02-10', status: 'approved', description: 'Medical leave for 2 days', appliedDate: 'Feb 10, 2026', priority: 'high' },
    { id: 2, type: 'issue', subject: 'Attendance Correction', date: '2026-02-08', status: 'pending', description: 'Missed class on 6th Feb due to medical emergency', appliedDate: 'Feb 8, 2026', priority: 'medium' },
    { id: 3, type: 'leave', subject: 'Family Function', date: '2026-01-25', status: 'approved', description: 'Attendance correction for family function', appliedDate: 'Jan 25, 2026', priority: 'low' },
  ]

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'approved': return { bg: 'bg-blue-50 text-blue-600', icon: CheckCircle }
      case 'pending': return { bg: 'bg-amber-50 text-amber-600', icon: Clock }
      case 'rejected': return { bg: 'bg-red-50 text-red-600', icon: XCircle }
      default: return { bg: 'bg-slate-100 text-slate-600', icon: Clock }
    }
  }

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-50 text-red-600'
      case 'medium': return 'bg-amber-50 text-amber-600'
      case 'low': return 'bg-slate-100 text-slate-600'
      default: return 'bg-slate-100 text-slate-600'
    }
  }

  const openNewRequest = (type: 'leave' | 'issue') => {
    setRequestType(type)
    setShowNewRequestModal(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white border border-slate-200 rounded-xl flex items-center justify-center shadow-sm">
            <ClipboardList className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Requests & Applications</h2>
            <p className="text-sm text-slate-500">Manage your applications & issues</p>
          </div>
        </div>
        <button 
          onClick={() => openNewRequest(activeRequestTab as 'leave' | 'issue')}
          className="px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 flex items-center gap-2 shadow-lg shadow-blue-600/20"
        >
          <Plus className="w-4 h-4" />
          New Request
        </button>
      </div>

      {/* Request Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-50 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{allRequests.filter(r => r.status === 'pending').length}</p>
              <p className="text-xs text-slate-500">Pending</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{allRequests.filter(r => r.status === 'approved').length}</p>
              <p className="text-xs text-slate-500">Approved</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{allRequests.filter(r => r.status === 'rejected').length}</p>
              <p className="text-xs text-slate-500">Rejected</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {requestTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveRequestTab(tab.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all",
              activeRequestTab === tab.id
                ? "bg-blue-600 text-white shadow-md"
                : "bg-white border border-slate-200 text-slate-600 hover:border-slate-300"
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
            {tab.count > 0 && (
              <span className="ml-1 px-1.5 py-0.5 rounded-full text-xs bg-white/20">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Request List */}
      <div className="space-y-4">
        {allRequests.filter(r => r.type === activeRequestTab).length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-100 p-12 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ClipboardList className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-slate-500 font-medium">No requests in this category</p>
            <button onClick={() => openNewRequest(activeRequestTab as 'leave' | 'issue')} className="mt-4 text-sm text-blue-600 hover:underline">Create a new request</button>
          </div>
        ) : (
          allRequests.filter(r => r.type === activeRequestTab).map((req) => (
            <div key={req.id} className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <p className="text-sm font-semibold text-slate-900">{req.subject}</p>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusStyle(req.status).bg}`}>
                      {req.status}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${getPriorityStyle(req.priority)}`}>
                      {req.priority}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mb-2">{req.description}</p>
                  <div className="flex items-center gap-4 text-xs text-slate-400">
                    <span>Applied on: {req.appliedDate}</span>
                    <span>•</span>
                    <span>For: {req.date}</span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </div>
              
              {/* Status Timeline */}
              {req.status === 'pending' && (
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
                    <span>Awaiting review from administration</span>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* New Request Modal */}
      {showNewRequestModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">
                {requestType === 'leave' ? 'New Leave Application' : 'Report an Issue'}
              </h3>
              <button onClick={() => setShowNewRequestModal(false)} className="text-slate-400 hover:text-slate-600">
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            {/* Type Selector */}
            <div className="flex gap-2 mb-4">
              <button onClick={() => setRequestType('leave')} className={cn("flex-1 py-2 rounded-lg text-sm font-medium transition-colors", requestType === 'leave' ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600")}>Leave Application</button>
              <button onClick={() => setRequestType('issue')} className={cn("flex-1 py-2 rounded-lg text-sm font-medium transition-colors", requestType === 'issue' ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600")}>Report Issue</button>
            </div>

            <div className="space-y-4">
              {requestType === 'leave' ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Subject *</label>
                    <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm">
                      <option>Medical Leave</option>
                      <option>Family Function</option>
                      <option>Personal Work</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">From Date *</label>
                      <input type="date" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">To Date *</label>
                      <input type="date" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Reason *</label>
                    <textarea rows={3} placeholder="Describe the reason for leave..." className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Attach Document (Optional)</label>
                    <div className="border-2 border-dashed border-slate-200 rounded-lg p-4 text-center">
                      <Paperclip className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                      <p className="text-xs text-slate-500">Upload medical certificate or supporting document</p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Issue Category *</label>
                    <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm">
                      <option>Attendance Correction</option>
                      <option>Fee Related</option>
                      <option>Hostel Issue</option>
                      <option>Academic Issue</option>
                      <option>Technical Issue</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Subject *</label>
                    <input type="text" placeholder="Brief subject of the issue" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Description *</label>
                    <textarea rows={3} placeholder="Describe the issue in detail..." className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Priority</label>
                    <div className="flex gap-2">
                      <button className="px-3 py-1.5 text-xs bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200">Low</button>
                      <button className="px-3 py-1.5 text-xs bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200">Medium</button>
                      <button className="px-3 py-1.5 text-xs bg-red-100 text-red-700 rounded-lg hover:bg-red-200">High</button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Attach Image (Optional)</label>
                    <div className="border-2 border-dashed border-slate-200 rounded-lg p-4 text-center">
                      <Paperclip className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                      <p className="text-xs text-slate-500">Upload a photo of the issue (max 5MB)</p>
                    </div>
                  </div>
                </>
              )}
              
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowNewRequestModal(false)} className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-sm font-medium hover:bg-slate-50">Cancel</button>
                <button onClick={() => setShowNewRequestModal(false)} className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 flex items-center justify-center gap-2">
                  <Send className="w-4 h-4" />
                  Submit Request
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ==================== SETTINGS VIEW ====================
function SettingsView() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-slate-900">Settings</h2>
      <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
        <Settings className="w-12 h-12 text-slate-400 mx-auto mb-4" />
        <p className="text-slate-500">Settings page coming soon</p>
      </div>
    </div>
  )
}
