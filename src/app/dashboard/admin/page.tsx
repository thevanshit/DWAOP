'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Home,
  AlertTriangle,
  BarChart3,
  LayoutGrid,
  Settings,
  Users,
  ShieldCheck,
  FileCheck,
  Clock,
  TrendingUp,
  Calendar,
  FileText,
  Award,
  ClipboardCheck,
  Layers,
  Gauge,
  Search,
  Bell,
  ChevronRight,
  Activity,
  Plus,
  X,
  CheckCircle,
  XCircle,
  Filter,
  Download,
  User,
  Briefcase,
  Building2,
  Target,
  AlertCircle,
  CalendarDays,
  GraduationCap,
  FileQuestion,
  Edit,
  Trash2,
  Eye,
  MessageSquare,
  Mail,
  Phone,
  MoreVertical,
  Send,
  DollarSign,
  Bed,
  BookOpen,
  TrendingDown,
  PieChart,
  BarChart,
  Megaphone,
  UserCheck,
  ClipboardList,
  CheckSquare,
  AlertOctagon,
  Ticket,
  ListChecks,
  Wallet,
  ShoppingCart
} from 'lucide-react'
import { cn } from '@/lib/utils'

type TabType = 'overview' | 'workflows' | 'students' | 'faculty' | 'requests' | 'coordination' | 'analytics' | 'complaints' | 'announcements' | 'compliance' | 'settings'

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
}

// ==================== DEMO DATA ====================

const OVERVIEW_STATS = [
  { label: 'At Risk Students', value: '12', sub: 'Need attention', icon: AlertTriangle, color: 'red' },
  { label: 'Pending Tasks', value: '24', sub: 'Across department', icon: Layers, color: 'blue' },
  { label: 'Pending Approvals', value: '08', sub: 'Awaiting review', icon: Clock, color: 'amber' },
  { label: 'Faculty Load', value: '78%', sub: 'Avg workload', icon: Gauge, color: 'purple' },
]

const QUICK_ACTIONS = [
  { label: 'All Students', icon: Users, href: '#students', color: 'blue' },
  { label: 'Faculty', icon: Award, href: '#faculty', color: 'green' },
  { label: 'Requests', icon: FileCheck, href: '#requests', color: 'amber' },
  { label: 'Analytics', icon: BarChart3, href: '#analytics', color: 'purple' },
]

// Workflow data
type WorkflowType = 'student' | 'faculty' | 'admin'
type WorkflowStatus = 'created' | 'in_progress' | 'under_review' | 'done' | 'delayed' | 'locked'

interface WorkflowItem {
  id: string
  type: WorkflowType
  title: string
  description: string
  status: WorkflowStatus
  assignee?: string
  batch?: string
  subject?: string
  dueDate?: string
  priority: 'low' | 'medium' | 'high' | 'critical'
}

const WORKFLOWS: WorkflowItem[] = [
  // Student workflows
  { id: 'sw-1', type: 'student', title: 'Attendance - OS Lecture', description: 'Daily attendance for CSE-AIML', status: 'in_progress', assignee: 'Dr. Vineet Jain', batch: 'CSE-AIML', subject: 'Operating Systems', priority: 'high' },
  { id: 'sw-2', type: 'student', title: 'Assignment Submission - CN Lab', description: 'Routing protocol lab report', status: 'created', assignee: 'Dr. Priya', batch: 'CSE', subject: 'Computer Networks', priority: 'medium' },
  { id: 'sw-3', type: 'student', title: 'IA-1 Marks Entry', description: 'Internal marks for CSE-AIML', status: 'under_review', assignee: 'Dr. Vineet Jain', batch: 'CSE-AIML', subject: 'Operating Systems', dueDate: '2026-02-25', priority: 'high' },
  { id: 'sw-4', type: 'student', title: 'Leave Request - Student 45', description: 'Medical leave for 3 days', status: 'done', assignee: 'Dr. Amit Kumar', batch: 'CSE-AIML', priority: 'medium' },
  
  // Faculty workflows
  { id: 'fw-1', type: 'faculty', title: 'NBA Documentation', description: 'Accreditation documents', status: 'in_progress', assignee: 'Dr. Amit Kumar', priority: 'critical' },
  { id: 'fw-2', type: 'faculty', title: 'Exam Paper Setting', description: 'Mid-term question papers', status: 'delayed', assignee: 'Dr. Vineet Jain', dueDate: '2026-02-18', priority: 'high' },
  { id: 'fw-3', type: 'faculty', title: 'Syllabus Update - OS', description: 'Update as per AICTE guidelines', status: 'created', assignee: 'Dr. Vineet Jain', subject: 'Operating Systems', priority: 'medium' },
  { id: 'fw-4', type: 'faculty', title: 'Lab Assessment', description: 'Evaluate lab performances', status: 'done', assignee: 'Dr. Priya', priority: 'low' },
  
  // Admin workflows
  { id: 'aw-1', type: 'admin', title: 'Department Budget', description: 'Prepare annual budget', status: 'in_progress', assignee: 'Admin', priority: 'high' },
  { id: 'aw-2', type: 'admin', title: 'Timetable Finalization', description: 'Semester timetable', status: 'done', assignee: 'Admin', priority: 'medium' },
  { id: 'aw-3', type: 'admin', title: 'Faculty Recruitment', description: 'Hire new faculty members', status: 'under_review', assignee: 'HOD', priority: 'critical' },
  { id: 'aw-4', type: 'admin', title: 'Infrastructure Upgrade', description: 'Lab equipment purchase', status: 'locked', assignee: 'Admin', priority: 'low' },
]

const COLUMNS: { id: WorkflowStatus; label: string; color: string }[] = [
  { id: 'created', label: 'To Do', color: '#6366F1' },
  { id: 'in_progress', label: 'In Progress', color: '#F59E0B' },
  { id: 'under_review', label: 'Under Review', color: '#8B5CF6' },
  { id: 'done', label: 'Completed', color: '#10B981' },
  { id: 'delayed', label: 'Delayed', color: '#EF4444' },
  { id: 'locked', label: 'Locked', color: '#6B7280' },
]

// Student data with eligibility, fee, hostel status
const STUDENTS = [
  { id: '1', name: 'Rahul Sharma', roll: 'CS-AIML-045', email: 'rahul@example.com', phone: '+91 98765 43210', batch: 'CSE-AIML', attendance: 58, cgpa: 7.2, status: 'at_risk', riskLevel: 'high', pending: 3, eligible: false, feeStatus: 'paid', hostelStatus: 'day_scholar', section: 'A' },
  { id: '2', name: 'Priya Singh', roll: 'CS-023', email: 'priya@example.com', phone: '+91 98765 43211', batch: 'CSE', attendance: 62, cgpa: 8.1, status: 'at_risk', riskLevel: 'high', pending: 2, eligible: false, feeStatus: 'paid', hostelStatus: 'hostel', section: 'B' },
  { id: '3', name: 'Amit Kumar', roll: 'IT-067', email: 'amit@example.com', phone: '+91 98765 43212', batch: 'IT', attendance: 78, cgpa: 7.8, status: 'active', pending: 1, eligible: true, feeStatus: 'paid', hostelStatus: 'day_scholar', section: 'A' },
  { id: '4', name: 'Sneha Gupta', roll: 'CS-AIML-089', email: 'sneha@example.com', phone: '+91 98765 43213', batch: 'CSE-AIML', attendance: 85, cgpa: 8.9, status: 'active', pending: 0, eligible: true, feeStatus: 'paid', hostelStatus: 'hostel', section: 'A' },
  { id: '5', name: 'Vikram Patel', roll: 'CS-034', email: 'vikram@example.com', phone: '+91 98765 43214', batch: 'CSE', attendance: 70, cgpa: 7.5, status: 'at_risk', riskLevel: 'medium', pending: 1, eligible: true, feeStatus: 'pending', hostelStatus: 'day_scholar', section: 'B' },
  { id: '6', name: 'Ananya Reddy', roll: 'IT-012', email: 'ananya@example.com', phone: '+91 98765 43215', batch: 'IT', attendance: 92, cgpa: 9.1, status: 'active', pending: 0, eligible: true, feeStatus: 'paid', hostelStatus: 'hostel', section: 'A' },
  { id: '7', name: 'Raj Malhotra', roll: 'CS-056', email: 'raj@example.com', phone: '+91 98765 43216', batch: 'CSE', attendance: 88, cgpa: 8.4, status: 'active', pending: 0, eligible: true, feeStatus: 'paid', hostelStatus: 'day_scholar', section: 'A' },
  { id: '8', name: 'Kavya Nair', roll: 'CS-AIML-078', email: 'kavya@example.com', phone: '+91 98765 43217', batch: 'CSE-AIML', attendance: 95, cgpa: 9.3, status: 'active', pending: 0, eligible: true, feeStatus: 'paid', hostelStatus: 'hostel', section: 'B' },
]

// Faculty data with contact info
const FACULTY = [
  { id: '1', name: 'Dr. Amit Kumar', role: 'HOD, CSE', email: 'amit@gjust.edu.in', phone: '+91 98765 43210', specialization: 'Machine Learning', workload: 85, batches: 2, status: 'active' },
  { id: '2', name: 'Dr. Vineet Jain', role: 'Assistant Professor', email: 'vineet@gjust.edu.in', phone: '+91 98765 43211', specialization: 'Operating Systems', workload: 78, batches: 3, status: 'active' },
  { id: '3', name: 'Dr. Priya Sharma', role: 'Assistant Professor', email: 'priya@gjust.edu.in', phone: '+91 98765 43212', specialization: 'Database Systems', workload: 72, batches: 2, status: 'active' },
  { id: '4', name: 'Dr. Suresh Kumar', role: 'Professor', email: 'suresh@gjust.edu.in', phone: '+91 98765 43213', specialization: 'Data Structures', workload: 68, batches: 2, status: 'active' },
  { id: '5', name: 'Dr. Rahul Verma', role: 'Assistant Professor', email: 'rahul@gjust.edu.in', phone: '+91 98765 43214', specialization: 'Computer Networks', workload: 65, batches: 2, status: 'on_leave' },
]

// Requests data
const REQUESTS = [
  { id: '1', type: 'leave', title: 'Medical Leave - 3 Days', student: 'Rahul Sharma', roll: 'CS-AIML-045', batch: 'CSE-AIML', status: 'pending', priority: 'high', date: '2026-02-15' },
  { id: '2', type: 'leave', title: 'Family Function', student: 'Priya Singh', roll: 'CS-023', batch: 'CSE', status: 'pending', priority: 'medium', date: '2026-02-14' },
  { id: '3', type: 'issue', title: 'Attendance Correction', student: 'Amit Kumar', roll: 'IT-067', batch: 'IT', status: 'approved', priority: 'medium', date: '2026-02-13' },
  { id: '4', type: 'permission', title: 'Workshop Attendance', student: 'Sneha Gupta', roll: 'CS-AIML-089', batch: 'CSE-AIML', status: 'pending', priority: 'low', date: '2026-02-12' },
  { id: '5', type: 'certificate', title: 'Bonafide Certificate', student: 'Vikram Patel', roll: 'CS-034', batch: 'CSE', status: 'approved', priority: 'low', date: '2026-02-11' },
]

// ==================== MAIN COMPONENT ====================

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('overview')
  const [showNewWorkflow, setShowNewWorkflow] = useState(false)

  const navItems = [
    { label: 'Overview', icon: <Home className="w-4 h-4" />, href: '#overview', section: 'Main' },
    { label: 'Workflows', icon: <Layers className="w-4 h-4" />, href: '#workflows', section: 'Main' },
    { label: 'Students', icon: <Users className="w-4 h-4" />, href: '#students', section: 'Management' },
    { label: 'Faculty', icon: <Award className="w-4 h-4" />, href: '#faculty', section: 'Management' },
    { label: 'Requests', icon: <FileCheck className="w-4 h-4" />, href: '#requests', section: 'Management' },
    { label: 'Coordination', icon: <LayoutGrid className="w-4 h-4" />, href: '#coordination', section: 'Operations' },
    { label: 'Analytics', icon: <BarChart3 className="w-4 h-4" />, href: '#analytics', section: 'Operations' },
    { label: 'Compliance', icon: <ShieldCheck className="w-4 h-4" />, href: '#compliance', section: 'Operations' },
    { label: 'Settings', icon: <Settings className="w-4 h-4" />, href: '#settings', section: 'System' },
  ]

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '') || 'overview'
      setActiveTab(hash as TabType)
    }
    handleHash()
    window.addEventListener('hashchange', handleHash)
    return () => window.removeEventListener('hashchange', handleHash)
  }, [])

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
            <span className="font-bold text-base tracking-tight text-slate-900 leading-none">DWAOP</span>
            <span className="text-[9px] text-slate-400 -mt-0.5">Admin Portal</span>
          </div>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <button className="relative p-2.5 hover:bg-slate-100 rounded-xl transition-all duration-200">
            <Bell className="w-5 h-5 text-slate-600" />
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white" />
          </button>
          <div className="flex items-center gap-2.5 pl-2.5 border-l border-slate-200">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center text-white font-bold shadow-lg ring-2 ring-blue-50/50">
              AD
            </div>
            <div className="hidden lg:block">
              <p className="text-sm font-semibold text-slate-900">Admin</p>
              <p className="text-[10px] text-slate-500">Department Head</p>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Sidebar */}
      <motion.aside 
        initial={{ opacity: 0 }}
        animate={{ width: 260, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed left-4 top-20 bottom-6 bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-200/50 flex flex-col"
      >
        <div className="flex items-center justify-between px-3 py-3 border-b border-slate-100">
          <span className="text-xs font-bold text-slate-400 uppercase">Menu</span>
        </div>

        <div className="flex flex-col flex-1 py-4 px-2.5 overflow-y-auto">
          <div className="space-y-1">
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-2 mb-1.5">Main</p>
            <NavButton icon={Home} label="Overview" isActive={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
            <NavButton icon={Layers} label="Workflows" isActive={activeTab === 'workflows'} onClick={() => setActiveTab('workflows')} />
          </div>

          <div className="space-y-1 mt-4">
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-2 mb-1.5">Management</p>
            <NavButton icon={Users} label="Students" isActive={activeTab === 'students'} onClick={() => setActiveTab('students')} />
            <NavButton icon={Award} label="Faculty" isActive={activeTab === 'faculty'} onClick={() => setActiveTab('faculty')} />
            <NavButton icon={FileCheck} label="Requests" isActive={activeTab === 'requests'} onClick={() => setActiveTab('requests')} />
          </div>

          <div className="space-y-1 mt-4">
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-2 mb-1.5">Operations</p>
            <NavButton icon={LayoutGrid} label="Coordination" isActive={activeTab === 'coordination'} onClick={() => setActiveTab('coordination')} />
            <NavButton icon={BarChart3} label="Analytics" isActive={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')} />
            <NavButton icon={ShieldCheck} label="Compliance" isActive={activeTab === 'compliance'} onClick={() => setActiveTab('compliance')} />
          </div>

          <div className="space-y-1 mt-4">
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-2 mb-1.5">Communication</p>
            <NavButton icon={AlertOctagon} label="Complaints" isActive={activeTab === 'complaints'} onClick={() => setActiveTab('complaints')} />
            <NavButton icon={Megaphone} label="Announcements" isActive={activeTab === 'announcements'} onClick={() => setActiveTab('announcements')} />
          </div>
        </div>

        <div className="px-2.5 pb-4 pt-2 border-t border-slate-100">
          <NavButton icon={Settings} label="Settings" isActive={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="pt-20 px-6 pb-6 min-h-screen ml-[288px]">
        <div className="max-w-[1400px] mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {activeTab === 'overview' && <OverviewView onNavigate={setActiveTab} />}
            {activeTab === 'workflows' && <WorkflowsView showNewWorkflow={showNewWorkflow} setShowNewWorkflow={setShowNewWorkflow} />}
            {activeTab === 'students' && <StudentsView />}
            {activeTab === 'faculty' && <FacultyView />}
            {activeTab === 'requests' && <RequestsView />}
            {activeTab === 'coordination' && <CoordinationView />}
            {activeTab === 'analytics' && <AnalyticsView />}
            {activeTab === 'compliance' && <ComplianceView />}
            {activeTab === 'complaints' && <ComplaintsView />}
            {activeTab === 'announcements' && <AnnouncementsView />}
            {activeTab === 'settings' && <SettingsView />}
          </motion.div>
        </div>
      </main>

      {/* New Workflow Modal */}
      <NewWorkflowModal isOpen={showNewWorkflow} onClose={() => setShowNewWorkflow(false)} />
    </div>
  )
}

function NavButton({ icon: Icon, label, isActive, onClick }: { icon: any; label: string; isActive?: boolean; onClick: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className={cn(
        "relative w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 justify-start",
        isActive ? "text-blue-600" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
      )}
    >
      {isActive && (
        <motion.div layoutId="navIndicator" className="absolute inset-0 bg-blue-50 rounded-xl -z-10 shadow-sm shadow-blue-500/20" />
      )}
      <Icon className={cn("w-[18px] h-[18px] flex-shrink-0", isActive && "text-blue-600")} />
      <span>{label}</span>
    </motion.button>
  )
}

// ==================== OVERVIEW VIEW ====================

function OverviewView({ onNavigate }: { onNavigate: (tab: TabType) => void }) {
  const greeting = (() => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
  })()

  const workflowPreview = WORKFLOWS.slice(0, 6)

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
                {greeting}, <span className="text-blue-600">Admin!</span>
              </h1>
              <p className="text-slate-500 mt-2">Department governance & operations overview</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid - 4 cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {OVERVIEW_STATS.map((stat, i) => (
          <motion.div 
            key={i}
            whileHover={{ y: -2 }}
            className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-lg hover:border-blue-200 transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-slate-500">{stat.label}</span>
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110",
                stat.color === 'red' ? "bg-gradient-to-br from-red-50 to-red-100" :
                stat.color === 'blue' ? "bg-gradient-to-br from-blue-50 to-blue-100" :
                stat.color === 'amber' ? "bg-gradient-to-br from-amber-50 to-amber-100" :
                "bg-gradient-to-br from-purple-50 to-purple-100"
              )}>
                <stat.icon className={cn("w-5 h-5", 
                  stat.color === 'red' ? "text-red-600" :
                  stat.color === 'blue' ? "text-blue-600" :
                  stat.color === 'amber' ? "text-amber-600" :
                  "text-purple-600"
                )} />
              </div>
            </div>
            <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
            <p className="text-xs text-slate-500 mt-1">{stat.sub}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Workflow Search & Preview */}
      <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-slate-900">Workflow Overview</h3>
          <button onClick={() => onNavigate('workflows')} className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            View All →
          </button>
        </div>
        
        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search workflows (students, faculty, administration)..."
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
          />
        </div>

        {/* Mini Workflow List */}
        <div className="space-y-2">
          {workflowPreview.map((wf) => (
            <div key={wf.id} className="flex items-center justify-between p-3 bg-slate-50/80 rounded-xl hover:bg-slate-100 transition-colors">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center",
                  wf.type === 'student' ? "bg-blue-100 text-blue-600" :
                  wf.type === 'faculty' ? "bg-green-100 text-green-600" :
                  "bg-purple-100 text-purple-600"
                )}>
                  {wf.type === 'student' ? <User className="w-4 h-4" /> :
                   wf.type === 'faculty' ? <Award className="w-4 h-4" /> :
                   <Building2 className="w-4 h-4" />}
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">{wf.title}</p>
                  <p className="text-xs text-slate-500">{wf.assignee} • {wf.batch || 'Admin'}</p>
                </div>
              </div>
              <span className={cn(
                "text-[10px] font-medium px-2 py-1 rounded-full",
                wf.status === 'done' ? "bg-green-100 text-green-700" :
                wf.status === 'in_progress' ? "bg-amber-100 text-amber-700" :
                wf.status === 'delayed' ? "bg-red-100 text-red-700" :
                wf.status === 'under_review' ? "bg-purple-100 text-purple-700" :
                "bg-slate-100 text-slate-600"
              )}>
                {wf.status.replace('_', ' ')}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Quick Actions & Faculty Load */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <h3 className="text-base font-semibold text-slate-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            {QUICK_ACTIONS.map((action, i) => (
              <button 
                key={i}
                onClick={() => onNavigate(action.href.replace('#', '') as TabType)}
                className={cn(
                  "flex items-center gap-3 p-4 rounded-xl border hover:shadow-md transition-all group",
                  action.color === 'blue' ? "bg-blue-50/50 border-blue-100 hover:border-blue-300" :
                  action.color === 'green' ? "bg-green-50/50 border-green-100 hover:border-green-300" :
                  action.color === 'amber' ? "bg-amber-50/50 border-amber-100 hover:border-amber-300" :
                  "bg-purple-50/50 border-purple-100 hover:border-purple-300"
                )}
              >
                <action.icon className={cn("w-5 h-5", 
                  action.color === 'blue' ? "text-blue-600" :
                  action.color === 'green' ? "text-green-600" :
                  action.color === 'amber' ? "text-amber-600" :
                  "text-purple-600"
                )} />
                <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">{action.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Faculty Workload */}
        <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <h3 className="text-base font-semibold text-slate-900 mb-4">Faculty Workload</h3>
          <div className="space-y-3">
            {FACULTY.slice(0, 4).map((f, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                  {f.name.split(' ').map(n => n[0]).join('').slice(0,2)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-slate-900">{f.name}</p>
                    <span className="text-xs text-slate-500">{f.workload}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div 
                      className={cn(
                        "h-2 rounded-full",
                        f.workload >= 80 ? "bg-red-500" :
                        f.workload >= 70 ? "bg-amber-500" :
                        "bg-green-500"
                      )} 
                      style={{ width: `${f.workload}%` }} 
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

// ==================== WORKFLOWS VIEW ====================

function WorkflowsView({ showNewWorkflow, setShowNewWorkflow }: { showNewWorkflow: boolean; setShowNewWorkflow: (v: boolean) => void }) {
  const [activeType, setActiveType] = useState<WorkflowType | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredWorkflows = WORKFLOWS.filter(wf => {
    const matchesType = activeType === 'all' || wf.type === activeType
    const matchesSearch = wf.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         wf.assignee?.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesType && matchesSearch
  })

  const columns = COLUMNS.map(col => ({
    ...col,
    tasks: filteredWorkflows.filter(wf => wf.status === col.id)
  }))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Department Workflows</h2>
          <p className="text-sm text-slate-500 mt-1">Manage and monitor all workflows</p>
        </div>
        <button 
          onClick={() => setShowNewWorkflow(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 shadow-lg shadow-blue-600/20"
        >
          <Plus className="w-4 h-4" /> New Workflow
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex gap-2">
          <FilterButton label="All" active={activeType === 'all'} onClick={() => setActiveType('all')} />
          <FilterButton label="Student" active={activeType === 'student'} onClick={() => setActiveType('student')} icon={<User className="w-3.5 h-3.5" />} />
          <FilterButton label="Faculty" active={activeType === 'faculty'} onClick={() => setActiveType('faculty')} icon={<Award className="w-3.5 h-3.5" />} />
          <FilterButton label="Admin" active={activeType === 'admin'} onClick={() => setActiveType('admin')} icon={<Building2 className="w-3.5 h-3.5" />} />
        </div>
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search workflows..."
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
          />
        </div>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {columns.map((column) => (
          <div key={column.id} className="bg-slate-100/50 rounded-xl p-3 min-h-[200px]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: column.color }} />
                <span className="text-xs font-semibold text-slate-700">{column.label}</span>
              </div>
              <span className="text-[10px] font-medium text-slate-500 bg-white px-1.5 py-0.5 rounded">{column.tasks.length}</span>
            </div>
            <div className="space-y-2">
              {column.tasks.map((wf) => (
                <div key={wf.id} className="p-3 bg-white rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <span className={cn(
                      "text-[9px] font-bold px-1.5 py-0.5 rounded uppercase",
                      wf.priority === 'critical' ? "bg-red-100 text-red-700" :
                      wf.priority === 'high' ? "bg-amber-100 text-amber-700" :
                      "bg-slate-100 text-slate-600"
                    )}>
                      {wf.priority}
                    </span>
                    <div className={cn(
                      "w-6 h-6 rounded flex items-center justify-center",
                      wf.type === 'student' ? "bg-blue-100" :
                      wf.type === 'faculty' ? "bg-green-100" :
                      "bg-purple-100"
                    )}>
                      {wf.type === 'student' ? <User className="w-3 h-3 text-blue-600" /> :
                       wf.type === 'faculty' ? <Award className="w-3 h-3 text-green-600" /> :
                       <Building2 className="w-3 h-3 text-purple-600" />}
                    </div>
                  </div>
                  <h4 className="text-xs font-semibold text-slate-900 mb-1">{wf.title}</h4>
                  <p className="text-[10px] text-slate-500">{wf.assignee}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function FilterButton({ label, active, onClick, icon }: { label: string; active: boolean; onClick: () => void; icon?: React.ReactNode }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
        active ? "bg-blue-600 text-white" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
      )}
    >
      {icon}
      {label}
    </button>
  )
}

// ==================== STUDENTS VIEW ====================

function StudentsView() {
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'at_risk'>('all')
  const [batchFilter, setBatchFilter] = useState('all')
  const [eligibleFilter, setEligibleFilter] = useState<'all' | 'eligible' | 'not_eligible'>('all')

  const filteredStudents = STUDENTS.filter(s => {
    const matchesStatus = statusFilter === 'all' || s.status === statusFilter
    const matchesBatch = batchFilter === 'all' || s.batch === batchFilter
    const matchesEligible = eligibleFilter === 'all' || (eligibleFilter === 'eligible' && s.eligible) || (eligibleFilter === 'not_eligible' && !s.eligible)
    return matchesStatus && matchesBatch && matchesEligible
  })

  const stats = {
    total: STUDENTS.length,
    active: STUDENTS.filter(s => s.status === 'active').length,
    atRisk: STUDENTS.filter(s => s.status === 'at_risk').length,
    eligible: STUDENTS.filter(s => s.eligible).length,
    notEligible: STUDENTS.filter(s => !s.eligible).length,
    feePending: STUDENTS.filter(s => s.feeStatus === 'pending').length,
    hostel: STUDENTS.filter(s => s.hostelStatus === 'hostel').length,
    dayScholar: STUDENTS.filter(s => s.hostelStatus === 'day_scholar').length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Student Management</h2>
          <p className="text-sm text-slate-500 mt-1">Manage and monitor all students</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 shadow-lg shadow-blue-600/20">
          <Download className="w-4 h-4" /> Export Data
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Students" value={stats.total} icon={Users} color="blue" />
        <StatCard label="Active" value={stats.active} icon={CheckCircle} color="green" />
        <StatCard label="At Risk" value={stats.atRisk} icon={AlertTriangle} color="red" />
        <StatCard label="Exam Eligible" value={stats.eligible} icon={Award} color="purple" />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-xs text-slate-500 mr-2">Status:</span>
        <button onClick={() => setStatusFilter('all')} className={cn("px-3 py-1.5 rounded-lg text-xs font-medium", statusFilter === 'all' ? "bg-slate-800 text-white" : "bg-white text-slate-600 border border-slate-200")}>All</button>
        <button onClick={() => setStatusFilter('active')} className={cn("px-3 py-1.5 rounded-lg text-xs font-medium", statusFilter === 'active' ? "bg-green-600 text-white" : "bg-white text-slate-600 border border-slate-200")}>Active</button>
        <button onClick={() => setStatusFilter('at_risk')} className={cn("px-3 py-1.5 rounded-lg text-xs font-medium", statusFilter === 'at_risk' ? "bg-red-600 text-white" : "bg-white text-slate-600 border border-slate-200")}>At Risk</button>
        <div className="border-l border-slate-200 mx-2" />
        <span className="text-xs text-slate-500 mr-2">Batch:</span>
        <select value={batchFilter} onChange={(e) => setBatchFilter(e.target.value)} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white border border-slate-200">
          <option value="all">All Batches</option>
          <option value="CSE-AIML">CSE-AIML</option>
          <option value="CSE">CSE</option>
          <option value="IT">IT</option>
        </select>
        <div className="border-l border-slate-200 mx-2" />
        <span className="text-xs text-slate-500 mr-2">Eligibility:</span>
        <button onClick={() => setEligibleFilter('all')} className={cn("px-3 py-1.5 rounded-lg text-xs font-medium", eligibleFilter === 'all' ? "bg-slate-800 text-white" : "bg-white text-slate-600 border border-slate-200")}>All</button>
        <button onClick={() => setEligibleFilter('eligible')} className={cn("px-3 py-1.5 rounded-lg text-xs font-medium", eligibleFilter === 'eligible' ? "bg-green-600 text-white" : "bg-white text-slate-600 border border-slate-200")}>Eligible</button>
        <button onClick={() => setEligibleFilter('not_eligible')} className={cn("px-3 py-1.5 rounded-lg text-xs font-medium", eligibleFilter === 'not_eligible' ? "bg-red-600 text-white" : "bg-white text-slate-600 border border-slate-200")}>Not Eligible</button>
      </div>

      {/* Student List - Table Style */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left text-xs font-semibold text-slate-600 px-4 py-3">Student</th>
                <th className="text-left text-xs font-semibold text-slate-600 px-4 py-3">Batch</th>
                <th className="text-center text-xs font-semibold text-slate-600 px-4 py-3">Attendance</th>
                <th className="text-center text-xs font-semibold text-slate-600 px-4 py-3">CGPA</th>
                <th className="text-center text-xs font-semibold text-slate-600 px-4 py-3">Eligible</th>
                <th className="text-center text-xs font-semibold text-slate-600 px-4 py-3">Fee Status</th>
                <th className="text-center text-xs font-semibold text-slate-600 px-4 py-3">Hostel</th>
                <th className="text-center text-xs font-semibold text-slate-600 px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold",
                        student.status === 'active' ? "bg-green-500" : "bg-red-500"
                      )}>
                        {student.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">{student.name}</p>
                        <p className="text-[10px] text-slate-500">{student.roll}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-slate-700">{student.batch}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={cn(
                      "text-sm font-medium",
                      student.attendance >= 75 ? "text-green-600" : student.attendance >= 65 ? "text-amber-600" : "text-red-600"
                    )}>{student.attendance}%</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="text-sm font-medium text-slate-900">{student.cgpa}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {student.eligible ? (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600"><CheckCircle className="w-3 h-3" /> Eligible</span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-red-600"><XCircle className="w-3 h-3" /> Not Eligible</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={cn(
                      "text-xs font-medium px-2 py-1 rounded-full",
                      student.feeStatus === 'paid' ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                    )}>{student.feeStatus === 'paid' ? 'Paid' : 'Pending'}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="text-xs text-slate-600">{student.hostelStatus === 'hostel' ? 'Hostel' : 'Day Scholar'}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={cn(
                      "text-xs font-medium px-2 py-1 rounded-full",
                      student.status === 'active' ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    )}>{student.status === 'active' ? 'Active' : 'At Risk'}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, icon: Icon, color }: { label: string; value: number | string; icon: any; color: string }) {
  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-slate-500">{label}</span>
        <div className={cn(
          "w-8 h-8 rounded-lg flex items-center justify-center",
          color === 'blue' ? "bg-blue-50 text-blue-600" :
          color === 'green' ? "bg-green-50 text-green-600" :
          color === 'red' ? "bg-red-50 text-red-600" :
          "bg-amber-50 text-amber-600"
        )}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
    </div>
  )
}

// ==================== FACULTY VIEW ====================

function FacultyView() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Faculty Management</h2>
          <p className="text-sm text-slate-500 mt-1">Manage faculty members and their workload</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 shadow-lg shadow-blue-600/20">
          <Plus className="w-4 h-4" /> Add Faculty
        </button>
      </div>

      {/* Faculty Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {FACULTY.map((f, i) => (
          <motion.div 
            key={i}
            variants={itemVariants}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-lg hover:border-blue-200 transition-all"
          >
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-600/20">
                {f.name.split(' ').map(n => n[0]).join('').slice(0,2)}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-slate-900">{f.name}</h3>
                  <span className={cn(
                    "text-[10px] font-medium px-2 py-0.5 rounded-full",
                    f.status === 'active' ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                  )}>{f.status === 'active' ? 'Active' : 'On Leave'}</span>
                </div>
                <p className="text-xs text-slate-500">{f.role}</p>
                <p className="text-[10px] text-blue-600 font-medium mt-1">{f.specialization}</p>
              </div>
            </div>
            
            {/* Contact Info */}
            <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <Mail className="w-3.5 h-3.5" />
                <span>{f.email}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <Phone className="w-3.5 h-3.5" />
                <span>{f.phone}</span>
              </div>
            </div>

            {/* Workload */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-500">Workload</span>
                <span className={cn(
                  "text-xs font-medium",
                  f.workload >= 80 ? "text-red-600" : f.workload >= 70 ? "text-amber-600" : "text-green-600"
                )}>{f.workload}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div 
                  className={cn(
                    "h-2 rounded-full",
                    f.workload >= 80 ? "bg-red-500" : f.workload >= 70 ? "bg-amber-500" : "bg-green-500"
                  )} 
                  style={{ width: `${f.workload}%` }} 
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-4 flex gap-2">
              <button className="flex-1 py-2 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                <MessageSquare className="w-3.5 h-3.5 inline mr-1" /> Message
              </button>
              <button className="flex-1 py-2 text-xs font-medium text-slate-600 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                <Eye className="w-3.5 h-3.5 inline mr-1" /> View
              </button>
              <button className="flex-1 py-2 text-xs font-medium text-amber-600 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors">
                <ClipboardList className="w-3.5 h-3.5 inline mr-1" /> Assign Task
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// ==================== REQUESTS VIEW ====================

function RequestsView() {
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all')

  const filteredRequests = REQUESTS.filter(r => {
    const matchesType = typeFilter === 'all' || r.type === typeFilter
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter
    return matchesType && matchesStatus
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Requests & Approvals</h2>
          <p className="text-sm text-slate-500 mt-1">Review and process student requests</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 shadow-lg shadow-blue-600/20">
          <Download className="w-4 h-4" /> Export Report
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Requests" value={REQUESTS.length} icon={FileText} color="blue" />
        <StatCard label="Pending" value={REQUESTS.filter(r => r.status === 'pending').length} icon={Clock} color="amber" />
        <StatCard label="Approved" value={REQUESTS.filter(r => r.status === 'approved').length} icon={CheckCircle} color="green" />
        <StatCard label="Rejected" value={REQUESTS.filter(r => r.status === 'rejected').length} icon={XCircle} color="red" />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <button onClick={() => setTypeFilter('all')} className={cn("px-3 py-1.5 rounded-lg text-xs font-medium", typeFilter === 'all' ? "bg-slate-800 text-white" : "bg-white text-slate-600 border border-slate-200")}>All</button>
        <button onClick={() => setTypeFilter('leave')} className={cn("px-3 py-1.5 rounded-lg text-xs font-medium", typeFilter === 'leave' ? "bg-blue-600 text-white" : "bg-white text-slate-600 border border-slate-200")}>Leave</button>
        <button onClick={() => setTypeFilter('issue')} className={cn("px-3 py-1.5 rounded-lg text-xs font-medium", typeFilter === 'issue' ? "bg-amber-600 text-white" : "bg-white text-slate-600 border border-slate-200")}>Issues</button>
        <button onClick={() => setTypeFilter('permission')} className={cn("px-3 py-1.5 rounded-lg text-xs font-medium", typeFilter === 'permission' ? "bg-green-600 text-white" : "bg-white text-slate-600 border border-slate-200")}>Permissions</button>
        <button onClick={() => setTypeFilter('certificate')} className={cn("px-3 py-1.5 rounded-lg text-xs font-medium", typeFilter === 'certificate' ? "bg-purple-600 text-white" : "bg-white text-slate-600 border border-slate-200")}>Certificates</button>
        <div className="border-l border-slate-200 mx-2" />
        <button onClick={() => setStatusFilter('all')} className={cn("px-3 py-1.5 rounded-lg text-xs font-medium", statusFilter === 'all' ? "bg-slate-800 text-white" : "bg-white text-slate-600 border border-slate-200")}>All Status</button>
        <button onClick={() => setStatusFilter('pending')} className={cn("px-3 py-1.5 rounded-lg text-xs font-medium", statusFilter === 'pending' ? "bg-amber-600 text-white" : "bg-white text-slate-600 border border-slate-200")}>Pending</button>
        <button onClick={() => setStatusFilter('approved')} className={cn("px-3 py-1.5 rounded-lg text-xs font-medium", statusFilter === 'approved' ? "bg-green-600 text-white" : "bg-white text-slate-600 border border-slate-200")}>Approved</button>
        <button onClick={() => setStatusFilter('rejected')} className={cn("px-3 py-1.5 rounded-lg text-xs font-medium", statusFilter === 'rejected' ? "bg-red-600 text-white" : "bg-white text-slate-600 border border-slate-200")}>Rejected</button>
      </div>

      {/* Requests List */}
      <div className="space-y-3">
        {filteredRequests.map((req) => (
          <motion.div 
            key={req.id}
            variants={itemVariants}
            className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center",
                  req.type === 'leave' ? "bg-blue-100 text-blue-600" :
                  req.type === 'issue' ? "bg-amber-100 text-amber-600" :
                  req.type === 'permission' ? "bg-green-100 text-green-600" :
                  "bg-purple-100 text-purple-600"
                )}>
                  {req.type === 'leave' ? <Calendar className="w-5 h-5" /> :
                   req.type === 'issue' ? <AlertTriangle className="w-5 h-5" /> :
                   req.type === 'permission' ? <GraduationCap className="w-5 h-5" /> :
                   <Award className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="font-medium text-slate-900">{req.title}</h3>
                  <p className="text-xs text-slate-500">{req.student} • {req.roll} • {req.batch}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={cn(
                  "text-[10px] font-medium px-2 py-1 rounded-full",
                  req.priority === 'high' ? "bg-red-100 text-red-700" :
                  req.priority === 'medium' ? "bg-amber-100 text-amber-700" :
                  "bg-slate-100 text-slate-600"
                )}>
                  {req.priority}
                </span>
                <span className={cn(
                  "text-[10px] font-medium px-2 py-1 rounded-full",
                  req.status === 'pending' ? "bg-amber-100 text-amber-700" :
                  req.status === 'approved' ? "bg-green-100 text-green-700" :
                  "bg-red-100 text-red-700"
                )}>
                  {req.status}
                </span>
                <span className="text-xs text-slate-400">{req.date}</span>
              </div>
            </div>
            {req.status === 'pending' && (
              <div className="mt-3 pt-3 border-t border-slate-100 flex gap-2">
                <button className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700">
                  <CheckCircle className="w-3.5 h-3.5" /> Approve
                </button>
                <button className="flex items-center gap-1 px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-medium hover:bg-red-700">
                  <XCircle className="w-3.5 h-3.5" /> Reject
                </button>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// ==================== OTHER VIEWS ====================

// Coordination tasks data
const COORDINATION_TASKS = [
  { id: '1', title: 'Exam Paper Setting - Mid Term', type: 'exam', status: 'in_progress', assignee: 'Dr. Amit Kumar', priority: 'high', dueDate: '2026-02-20' },
  { id: '2', title: 'NBA Documentation Preparation', type: 'documentation', status: 'in_progress', assignee: 'Dr. Vineet Jain', priority: 'critical', dueDate: '2026-02-25' },
  { id: '3', title: 'Timetable Finalization - Semester 4', type: 'admin', status: 'done', assignee: 'Admin', priority: 'medium', dueDate: '2026-02-15' },
  { id: '4', title: 'Faculty Meeting Agenda', type: 'meeting', status: 'created', assignee: 'HOD', priority: 'low', dueDate: '2026-02-22' },
  { id: '5', title: 'Lab Equipment Purchase', type: 'procurement', status: 'under_review', assignee: 'Admin', priority: 'medium', dueDate: '2026-02-28' },
]

function CoordinationView() {
  const [filter, setFilter] = useState<'all' | 'created' | 'in_progress' | 'under_review' | 'done'>('all')

  const filteredTasks = COORDINATION_TASKS.filter(t => filter === 'all' || t.status === filter)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Coordination</h2>
          <p className="text-sm text-slate-500 mt-1">Manage administration tasks, meetings & documentation</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 shadow-lg shadow-blue-600/20">
          <Plus className="w-4 h-4" /> New Task
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Tasks" value={COORDINATION_TASKS.length} icon={ClipboardList} color="blue" />
        <StatCard label="In Progress" value={COORDINATION_TASKS.filter(t => t.status === 'in_progress').length} icon={Activity} color="amber" />
        <StatCard label="Under Review" value={COORDINATION_TASKS.filter(t => t.status === 'under_review').length} icon={Eye} color="purple" />
        <StatCard label="Completed" value={COORDINATION_TASKS.filter(t => t.status === 'done').length} icon={CheckCircle} color="green" />
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <button onClick={() => setFilter('all')} className={cn("px-3 py-1.5 rounded-lg text-xs font-medium", filter === 'all' ? "bg-slate-800 text-white" : "bg-white text-slate-600 border border-slate-200")}>All</button>
        <button onClick={() => setFilter('created')} className={cn("px-3 py-1.5 rounded-lg text-xs font-medium", filter === 'created' ? "bg-slate-800 text-white" : "bg-white text-slate-600 border border-slate-200")}>To Do</button>
        <button onClick={() => setFilter('in_progress')} className={cn("px-3 py-1.5 rounded-lg text-xs font-medium", filter === 'in_progress' ? "bg-blue-600 text-white" : "bg-white text-slate-600 border border-slate-200")}>In Progress</button>
        <button onClick={() => setFilter('under_review')} className={cn("px-3 py-1.5 rounded-lg text-xs font-medium", filter === 'under_review' ? "bg-purple-600 text-white" : "bg-white text-slate-600 border border-slate-200")}>Under Review</button>
        <button onClick={() => setFilter('done')} className={cn("px-3 py-1.5 rounded-lg text-xs font-medium", filter === 'done' ? "bg-green-600 text-white" : "bg-white text-slate-600 border border-slate-200")}>Completed</button>
      </div>

      {/* Tasks List */}
      <div className="space-y-3">
        {filteredTasks.map((task) => (
          <motion.div 
            key={task.id}
            variants={itemVariants}
            className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center",
                  task.type === 'exam' ? "bg-blue-100 text-blue-600" :
                  task.type === 'documentation' ? "bg-purple-100 text-purple-600" :
                  task.type === 'meeting' ? "bg-green-100 text-green-600" :
                  "bg-amber-100 text-amber-600"
                )}>
                  {task.type === 'exam' ? <FileText className="w-5 h-5" /> :
                   task.type === 'documentation' ? <FileCheck className="w-5 h-5" /> :
                   task.type === 'meeting' ? <Calendar className="w-5 h-5" /> :
                   <ShoppingCart className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="font-medium text-slate-900">{task.title}</h3>
                  <p className="text-xs text-slate-500">{task.assignee} • Due: {task.dueDate}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={cn(
                  "text-[10px] font-medium px-2 py-1 rounded-full",
                  task.priority === 'critical' ? "bg-red-100 text-red-700" :
                  task.priority === 'high' ? "bg-amber-100 text-amber-700" :
                  "bg-slate-100 text-slate-600"
                )}>{task.priority}</span>
                <span className={cn(
                  "text-[10px] font-medium px-2 py-1 rounded-full",
                  task.status === 'done' ? "bg-green-100 text-green-700" :
                  task.status === 'in_progress' ? "bg-blue-100 text-blue-700" :
                  task.status === 'under_review' ? "bg-purple-100 text-purple-700" :
                  "bg-slate-100 text-slate-600"
                )}>{task.status.replace('_', ' ')}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function AnalyticsView() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Analytics</h2>
        <p className="text-sm text-slate-500 mt-1">Department performance metrics & insights</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Students" value="240" icon={Users} color="blue" />
        <StatCard label="Faculty Members" value="12" icon={Award} color="green" />
        <StatCard label="Batches" value="3" icon={Layers} color="purple" />
        <StatCard label="Avg CGPA" value="8.1" icon={TrendingUp} color="amber" />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Student Analytics - Attendance */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <h3 className="text-base font-semibold text-slate-900 mb-4">Student Attendance</h3>
          <div className="space-y-3">
            {[
              { label: 'Above 75%', value: 78, color: 'bg-green-500' },
              { label: '65-75%', value: 15, color: 'bg-amber-500' },
              { label: 'Below 65%', value: 7, color: 'bg-red-500' },
            ].map((item, i) => (
              <div key={i}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-600">{item.label}</span>
                  <span className="font-medium text-slate-900">{item.value}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className={`${item.color} h-2 rounded-full`} style={{ width: `${item.value}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">At Risk Students</span>
              <span className="text-sm font-bold text-red-600">12</span>
            </div>
          </div>
        </div>

        {/* Workflow Analytics */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <h3 className="text-base font-semibold text-slate-900 mb-4">Workflow Status</h3>
          <div className="space-y-3">
            {[
              { label: 'Completed', value: 45, color: 'bg-green-500' },
              { label: 'In Progress', value: 25, color: 'bg-blue-500' },
              { label: 'Pending', value: 20, color: 'bg-slate-400' },
              { label: 'Delayed', value: 10, color: 'bg-red-500' },
            ].map((item, i) => (
              <div key={i}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-600">{item.label}</span>
                  <span className="font-medium text-slate-900">{item.value}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className={`${item.color} h-2 rounded-full`} style={{ width: `${item.value}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">Active Tasks</span>
              <span className="text-sm font-bold text-blue-600">24</span>
            </div>
          </div>
        </div>

        {/* Admin/Department Analytics */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <h3 className="text-base font-semibold text-slate-900 mb-4">Request Resolution</h3>
          <div className="space-y-3">
            {[
              { label: 'Approved', value: 65, color: 'bg-green-500' },
              { label: 'Pending', value: 25, color: 'bg-amber-500' },
              { label: 'Rejected', value: 10, color: 'bg-red-500' },
            ].map((item, i) => (
              <div key={i}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-600">{item.label}</span>
                  <span className="font-medium text-slate-900">{item.value}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className={`${item.color} h-2 rounded-full`} style={{ width: `${item.value}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">Avg Resolution Time</span>
              <span className="text-sm font-bold text-purple-600">2.5 days</span>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <h3 className="text-base font-semibold text-slate-900 mb-4">Batch Performance</h3>
          <div className="space-y-3">
            {[
              { batch: 'CSE-AIML', attendance: 82, marks: 78 },
              { batch: 'CSE', attendance: 79, marks: 75 },
              { batch: 'IT', attendance: 85, marks: 80 },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <span className="text-sm font-medium text-slate-700">{item.batch}</span>
                <div className="flex gap-4">
                  <span className="text-xs text-slate-500">Att: <span className="font-medium text-slate-900">{item.attendance}%</span></span>
                  <span className="text-xs text-slate-500">Marks: <span className="font-medium text-slate-900">{item.marks}</span></span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <h3 className="text-base font-semibold text-slate-900 mb-4">Faculty Workload</h3>
          <div className="space-y-3">
            {[
              { name: 'Dr. Amit Kumar', load: 85 },
              { name: 'Dr. Vineet Jain', load: 78 },
              { name: 'Dr. Priya Sharma', load: 72 },
            ].map((item, i) => (
              <div key={i}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-600">{item.name}</span>
                  <span className={item.load >= 80 ? "text-red-600" : item.load >= 70 ? "text-amber-600" : "text-green-600"}>{item.load}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${item.load >= 80 ? 'bg-red-500' : item.load >= 70 ? 'bg-amber-500' : 'bg-green-500'}`} 
                    style={{ width: `${item.load}%` }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function ComplianceView() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Compliance</h2>
        <p className="text-sm text-slate-500 mt-1">System compliance & audit status</p>
      </div>
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-slate-900">Compliance Score</h3>
          <span className="text-2xl font-bold text-green-600">94%</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-3">
          <div className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full" style={{ width: '94%' }} />
        </div>
      </div>
    </div>
  )
}

function SettingsView() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Settings</h2>
        <p className="text-sm text-slate-500 mt-1">Configure department policies and system settings</p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">Policy Configuration</h3>
          <div className="space-y-4">
            <SettingItem label="Attendance Threshold" value="75%" description="Minimum attendance required for exam eligibility" />
            <SettingItem label="Grace Period" value="15 mins" description="Late arrival tolerance for attendance" />
            <SettingItem label="Leave Approval" value="Auto" description="Auto-approve leaves under 2 days" />
            <SettingItem label="Mark Review Window" value="7 days" description="Time for students to review marks" />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">System Settings</h3>
          <div className="space-y-4">
            <SettingItem label="Notifications" value="Enabled" description="Email and in-app notifications" />
            <SettingItem label="Audit Logs" value="90 days" description="Retention period for audit trails" />
            <SettingItem label="Data Export" value="CSV, PDF" description="Available export formats" />
            <SettingItem label="Session Timeout" value="30 mins" description="Auto-logout after inactivity" />
          </div>
        </div>
      </div>
    </div>
  )
}

function SettingItem({ label, value, description }: { label: string; value: string; description: string }) {
  return (
    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
      <div>
        <p className="text-sm font-medium text-slate-700">{label}</p>
        <p className="text-xs text-slate-500">{description}</p>
      </div>
      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium">
        {value}
      </span>
    </div>
  )
}

// ==================== COMPLAINTS VIEW ====================

const COMPLAINTS = [
  { id: '1', type: 'student', title: 'Lab Equipment Issue', description: 'Computer lab 3 has 5 computers not working', student: 'Rahul Sharma', batch: 'CSE-AIML', status: 'pending', priority: 'high', date: '2026-02-15' },
  { id: '2', type: 'faculty', title: 'WiFi Connectivity Issue', description: 'Staff room WiFi not working properly', faculty: 'Dr. Priya', status: 'in_progress', priority: 'medium', date: '2026-02-14' },
  { id: '3', type: 'student', title: 'Attendance Marking Error', description: 'Marked absent wrongly on Feb 10', student: 'Amit Kumar', batch: 'IT', status: 'resolved', priority: 'low', date: '2026-02-13' },
  { id: '4', type: 'student', title: 'Hostel Food Quality', description: 'Mess food quality has degraded', student: 'Priya Singh', batch: 'CSE', status: 'pending', priority: 'medium', date: '2026-02-12' },
  { id: '5', type: 'faculty', title: 'Parking Space Issue', description: 'Not enough parking for faculty', faculty: 'Dr. Suresh', status: 'pending', priority: 'low', date: '2026-02-11' },
]

function ComplaintsView() {
  const [filter, setFilter] = useState<'all' | 'pending' | 'in_progress' | 'resolved'>('all')

  const filteredComplaints = COMPLAINTS.filter(c => filter === 'all' || c.status === filter)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Complaints & Issues</h2>
          <p className="text-sm text-slate-500 mt-1">Track and resolve complaints from students and faculty</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 shadow-lg shadow-blue-600/20">
          <Plus className="w-4 h-4" /> New Complaint
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Complaints" value={COMPLAINTS.length} icon={AlertOctagon} color="blue" />
        <StatCard label="Pending" value={COMPLAINTS.filter(c => c.status === 'pending').length} icon={Clock} color="amber" />
        <StatCard label="In Progress" value={COMPLAINTS.filter(c => c.status === 'in_progress').length} icon={Activity} color="purple" />
        <StatCard label="Resolved" value={COMPLAINTS.filter(c => c.status === 'resolved').length} icon={CheckCircle} color="green" />
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <button onClick={() => setFilter('all')} className={cn("px-3 py-1.5 rounded-lg text-xs font-medium", filter === 'all' ? "bg-slate-800 text-white" : "bg-white text-slate-600 border border-slate-200")}>All</button>
        <button onClick={() => setFilter('pending')} className={cn("px-3 py-1.5 rounded-lg text-xs font-medium", filter === 'pending' ? "bg-amber-600 text-white" : "bg-white text-slate-600 border border-slate-200")}>Pending</button>
        <button onClick={() => setFilter('in_progress')} className={cn("px-3 py-1.5 rounded-lg text-xs font-medium", filter === 'in_progress' ? "bg-purple-600 text-white" : "bg-white text-slate-600 border border-slate-200")}>In Progress</button>
        <button onClick={() => setFilter('resolved')} className={cn("px-3 py-1.5 rounded-lg text-xs font-medium", filter === 'resolved' ? "bg-green-600 text-white" : "bg-white text-slate-600 border border-slate-200")}>Resolved</button>
      </div>

      {/* Complaints List */}
      <div className="space-y-3">
        {filteredComplaints.map((complaint) => (
          <motion.div 
            key={complaint.id}
            variants={itemVariants}
            className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center",
                  complaint.type === 'student' ? "bg-blue-100 text-blue-600" : "bg-green-100 text-green-600"
                )}>
                  {complaint.type === 'student' ? <User className="w-5 h-5" /> : <Award className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="font-medium text-slate-900">{complaint.title}</h3>
                  <p className="text-xs text-slate-500 mt-1">{complaint.description}</p>
                  <p className="text-xs text-slate-400 mt-1">
                    {complaint.type === 'student' ? `${complaint.student} • ${complaint.batch}` : complaint.faculty}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className={cn(
                  "text-[10px] font-medium px-2 py-1 rounded-full",
                  complaint.priority === 'high' ? "bg-red-100 text-red-700" :
                  complaint.priority === 'medium' ? "bg-amber-100 text-amber-700" :
                  "bg-slate-100 text-slate-600"
                )}>{complaint.priority}</span>
                <span className={cn(
                  "text-[10px] font-medium px-2 py-1 rounded-full",
                  complaint.status === 'pending' ? "bg-amber-100 text-amber-700" :
                  complaint.status === 'in_progress' ? "bg-purple-100 text-purple-700" :
                  "bg-green-100 text-green-700"
                )}>{complaint.status.replace('_', ' ')}</span>
                <span className="text-xs text-slate-400">{complaint.date}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// ==================== ANNOUNCEMENTS VIEW ====================

const ANNOUNCEMENTS = [
  { id: '1', title: 'Mid-Term Examination Schedule', message: 'Mid-term exams will be held from March 1-5, 2026', target: 'both', createdAt: '2026-02-15', author: 'Admin' },
  { id: '2', title: 'Faculty Meeting', message: 'Monthly faculty meeting on Feb 20 at 2 PM', target: 'faculty', createdAt: '2026-02-14', author: 'HOD' },
  { id: '3', title: 'Holiday Notice', message: 'College closed on Feb 16 for Konark 2026', target: 'students', createdAt: '2026-02-13', author: 'Admin' },
  { id: '4', title: 'NBA Visit Preparation', message: 'All departments to prepare documentation for NBA visit', target: 'faculty', createdAt: '2026-02-12', author: 'HOD' },
]

function AnnouncementsView() {
  const [targetFilter, setTargetFilter] = useState<'all' | 'students' | 'faculty' | 'both'>('all')
  const [showModal, setShowModal] = useState(false)

  const filteredAnnouncements = ANNOUNCEMENTS.filter(a => targetFilter === 'all' || a.target === targetFilter || a.target === 'both')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Announcements</h2>
          <p className="text-sm text-slate-500 mt-1">Create and manage announcements for students and faculty</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 shadow-lg shadow-blue-600/20"
        >
          <Plus className="w-4 h-4" /> New Announcement
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <button onClick={() => setTargetFilter('all')} className={cn("px-3 py-1.5 rounded-lg text-xs font-medium", targetFilter === 'all' ? "bg-slate-800 text-white" : "bg-white text-slate-600 border border-slate-200")}>All</button>
        <button onClick={() => setTargetFilter('students')} className={cn("px-3 py-1.5 rounded-lg text-xs font-medium", targetFilter === 'students' ? "bg-blue-600 text-white" : "bg-white text-slate-600 border border-slate-200")}>Students</button>
        <button onClick={() => setTargetFilter('faculty')} className={cn("px-3 py-1.5 rounded-lg text-xs font-medium", targetFilter === 'faculty' ? "bg-green-600 text-white" : "bg-white text-slate-600 border border-slate-200")}>Faculty</button>
        <button onClick={() => setTargetFilter('both')} className={cn("px-3 py-1.5 rounded-lg text-xs font-medium", targetFilter === 'both' ? "bg-purple-600 text-white" : "bg-white text-slate-600 border border-slate-200")}>Both</button>
      </div>

      {/* Announcements List */}
      <div className="space-y-3">
        {filteredAnnouncements.map((announcement) => (
          <motion.div 
            key={announcement.id}
            variants={itemVariants}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center text-white">
                  <Megaphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">{announcement.title}</h3>
                  <p className="text-sm text-slate-600 mt-1">{announcement.message}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className={cn(
                      "text-[10px] font-medium px-2 py-1 rounded-full",
                      announcement.target === 'students' ? "bg-blue-100 text-blue-700" :
                      announcement.target === 'faculty' ? "bg-green-100 text-green-700" :
                      "bg-purple-100 text-purple-700"
                    )}>
                      {announcement.target === 'both' ? 'Students & Faculty' : announcement.target}
                    </span>
                    <span className="text-xs text-slate-400">By {announcement.author} • {announcement.createdAt}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* New Announcement Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-blue-600 to-blue-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Megaphone className="w-5 h-5" /> Create Announcement
                </h3>
                <button onClick={() => setShowModal(false)} className="p-1.5 hover:bg-white/20 rounded-lg transition-colors">
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">Title</label>
                <input type="text" placeholder="Enter announcement title" className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">Target Audience</label>
                <select className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600">
                  <option value="students">Students</option>
                  <option value="faculty">Faculty</option>
                  <option value="both">Both</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">Message</label>
                <textarea rows={3} placeholder="Enter announcement message" className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 resize-none" />
              </div>
            </div>
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 rounded-xl transition-colors">Cancel</button>
              <button onClick={() => setShowModal(false)} className="px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20">Publish</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

// ==================== NEW WORKFLOW MODAL ====================

function NewWorkflowModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [title, setTitle] = useState('')
  const [type, setType] = useState<WorkflowType>('student')
  const [assignee, setAssignee] = useState('')
  const [priority, setPriority] = useState('medium')
  const [description, setDescription] = useState('')

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-blue-600 to-blue-700">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Layers className="w-5 h-5" /> Create New Workflow
            </h3>
            <button onClick={onClose} className="p-1.5 hover:bg-white/20 rounded-lg transition-colors">
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
        
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Workflow Title</label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter workflow title"
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Type</label>
              <select 
                value={type}
                onChange={(e) => setType(e.target.value as WorkflowType)}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
              >
                <option value="student">Student</option>
                <option value="faculty">Faculty</option>
                <option value="admin">Administration</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Priority</label>
              <select 
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Assignee</label>
            <input 
              type="text" 
              value={assignee}
              onChange={(e) => setAssignee(e.target.value)}
              placeholder="Enter assignee name"
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Description</label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter workflow description"
              rows={3}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 resize-none"
            />
          </div>
        </div>

        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={() => {
              alert(`Workflow "${title}" created for ${type}`)
              onClose()
            }}
            className="px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
          >
            Create Workflow
          </button>
        </div>
      </motion.div>
    </div>
  )
}
