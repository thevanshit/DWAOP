'use client'

import DashboardLayout from '@/components/common/DashboardLayout'
import {
  Home,
  Calendar,
  FileText,
  Users,
  Settings,
  Shield,
  TrendingUp,
  AlertTriangle,
  BarChart3,
  Filter,
  Download,
  Plus,
  Mail,
  Bell,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Edit,
  Send,
  UserCircle,
  Activity,
  Target,
  Zap,
  UserPlus,
  CreditCard,
  Building2,
  BookOpen,
  FileCheck,
  UserCog,
  GraduationCap,
  ClipboardCheck,
  Search,
  MoreVertical,
  MessageSquare,
  HelpCircle,
  UserCheck,
  Briefcase,
} from 'lucide-react'
import { useState } from 'react'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'

const attendanceTrendData = [
  { week: 'W1', attendance: 82 },
  { week: 'W2', attendance: 78 },
  { week: 'W3', attendance: 85 },
  { week: 'W4', attendance: 88 },
  { week: 'W5', attendance: 90 },
  { week: 'W6', attendance: 87 },
]

const assessmentOutcomes = [
  { subject: 'DS', avgMarks: 78, submissionRate: 92, onTimeRate: 85 },
  { subject: 'DBMS', avgMarks: 75, submissionRate: 88, onTimeRate: 80 },
  { subject: 'SE', avgMarks: 82, submissionRate: 95, onTimeRate: 90 },
  { subject: 'CN', avgMarks: 80, submissionRate: 90, onTimeRate: 85 },
]

const facultyWorkload = [
  { name: 'Dr. Ritu Makani', tasks: 45, completed: 38 },
  { name: 'Prof. Jyoti', tasks: 38, completed: 35 },
  { name: 'Prof. Sunila', tasks: 42, completed: 40 },
  { name: 'Dr. Jai Bhagwan', tasks: 35, completed: 32 },
]

const pieData = [
  { name: 'High Risk', value: 8, color: '#EF4444' },
  { name: 'Medium Risk', value: 15, color: '#F59E0B' },
  { name: 'Low Risk', value: 350, color: '#10B981' },
]

export default function AdminDashboard() {
  const [selectedTab, setSelectedTab] = useState('overview')

  const navItems = [
    { label: 'Dashboard', icon: <Home className="w-5 h-5" />, href: '#overview' },
    { label: 'Scrum Board', icon: <Calendar className="w-5 h-5" />, href: '#scrum' },
    { label: 'Student Risk', icon: <AlertTriangle className="w-5 h-5" />, href: '#risk' },
    { label: 'Analytics', icon: <BarChart3 className="w-5 h-5" />, href: '#analytics' },
    { label: 'Workflows', icon: <FileText className="w-5 h-5" />, href: '#workflows' },
    { label: 'Student Queries', icon: <MessageSquare className="w-5 h-5" />, href: '#queries' },
    { label: 'Chairperson Office', icon: <Briefcase className="w-5 h-5" />, href: '#chairperson' },
    { label: 'Student Registration', icon: <UserPlus className="w-5 h-5" />, href: '#registration' },
    { label: 'Fee Management', icon: <CreditCard className="w-5 h-5" />, href: '#fees' },
    { label: 'Semester Registration', icon: <BookOpen className="w-5 h-5" />, href: '#semester' },
    { label: 'Documents', icon: <FileCheck className="w-5 h-5" />, href: '#documents' },
    { label: 'Detail Changes', icon: <UserCog className="w-5 h-5" />, href: '#details' },
    { label: 'Course Registration', icon: <GraduationCap className="w-5 h-5" />, href: '#course' },
    { label: 'Exam Registration', icon: <ClipboardCheck className="w-5 h-5" />, href: '#exam' },
    { label: 'Policy Config', icon: <Settings className="w-5 h-5" />, href: '#policy' },
  ]

  return (
    <DashboardLayout role="admin" roleLabel="Administration Dashboard" navItems={navItems}>
      <div className="space-y-6 max-w-full overflow-x-hidden">
        {/* Header */}
        <div className="relative overflow-hidden rounded-2xl border border-gray-100 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 p-6">
          <div className="absolute inset-y-0 right-0 w-1/3 bg-[radial-gradient(circle_at_70%_30%,rgba(59,130,246,0.18),transparent_55%)]" />
          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                Welcome, <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Administrator</span>
              </h1>
              <p className="text-gray-600">
                High-level view of workflows, risk, and compliance across the department.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <div className="px-4 py-2 rounded-xl bg-white/70 backdrop-blur border border-gray-100 flex flex-col items-center">
                <span className="text-xs text-gray-500">Active Workflows</span>
                <span className="text-xl font-bold text-blue-600">247</span>
              </div>
              <div className="px-4 py-2 rounded-xl bg-white/70 backdrop-blur border border-gray-100 flex flex-col items-center">
                <span className="text-xs text-gray-500">Students under Watch</span>
                <span className="text-xl font-bold text-red-500">23</span>
              </div>
              <div className="px-4 py-2 rounded-xl bg-white/70 backdrop-blur border border-gray-100 flex flex-col items-center">
                <span className="text-xs text-gray-500">Delayed Items</span>
                <span className="text-xl font-bold text-orange-500">12</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="overflow-x-auto -mx-6 px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 min-w-max lg:min-w-0">
            <div className="rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white p-5 shadow-lg hover:shadow-xl transition-shadow min-w-[280px] lg:min-w-0">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wide opacity-80 mb-1">Active Workflows</p>
                  <p className="text-3xl font-bold">247</p>
                  <p className="text-xs opacity-80 mt-1">+12 from last week</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6" />
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 text-white p-5 shadow-lg hover:shadow-xl transition-shadow min-w-[280px] lg:min-w-0">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wide opacity-80 mb-1">Students under Watch</p>
                  <p className="text-3xl font-bold">23</p>
                  <p className="text-xs opacity-80 mt-1">-3 improved this week</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6" />
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white p-5 shadow-lg hover:shadow-xl transition-shadow min-w-[280px] lg:min-w-0">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wide opacity-80 mb-1">Delayed Processes</p>
                  <p className="text-3xl font-bold">12</p>
                  <p className="text-xs opacity-80 mt-1">Requires attention</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6" />
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 text-white p-5 shadow-lg hover:shadow-xl transition-shadow min-w-[280px] lg:min-w-0">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wide opacity-80 mb-1">Locked Marks</p>
                  <p className="text-3xl font-bold">18/20</p>
                  <p className="text-xs opacity-80 mt-1">90% completion</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Tabs */}
        <div className="card rounded-2xl">
          <div className="border-b border-jira-gray-200 mb-6">
            <div className="overflow-x-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: '#C1C7D0 #F4F5F7' }}>
              <div className="flex space-x-6 min-w-max px-1 pb-1">
                {['overview', 'scrum', 'risk', 'analytics', 'workflows', 'queries', 'chairperson', 'registration', 'fees', 'semester', 'documents', 'details', 'course', 'exam', 'policy'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setSelectedTab(tab)}
                    className={`pb-4 px-3 font-medium text-sm border-b-2 transition-colors whitespace-nowrap flex-shrink-0 ${selectedTab === tab
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-jira-gray-600 hover:text-jira-gray-900'
                      }`}
                  >
                    {tab.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Overview Tab */}
          {selectedTab === 'overview' && (
            <div className="space-y-6">
              {/* Quick Action Cards */}
              <div className="grid md:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 hover:shadow-md transition-shadow cursor-pointer group">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Mail className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Pending Emails</p>
                      <p className="text-lg font-bold text-gray-900">24</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 hover:shadow-md transition-shadow cursor-pointer group">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Bell className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Notifications</p>
                      <p className="text-lg font-bold text-gray-900">18</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-green-100 border border-green-200 hover:shadow-md transition-shadow cursor-pointer group">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Approvals</p>
                      <p className="text-lg font-bold text-gray-900">32</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 hover:shadow-md transition-shadow cursor-pointer group">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Activity className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">System Health</p>
                      <p className="text-lg font-bold text-gray-900">98%</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Workflow Summary */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">Workflow Summary</h3>
                    <p className="text-sm text-gray-600">Real-time status of all department workflows</p>
                  </div>
                  <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All</button>
                </div>
                <div className="grid md:grid-cols-4 gap-4">
                  {[
                    { label: 'Backlog', count: 45, color: 'from-gray-500 to-gray-600', icon: FileText },
                    { label: 'In Progress', count: 32, color: 'from-blue-500 to-blue-600', icon: Activity },
                    { label: 'Delayed', count: 12, color: 'from-amber-500 to-orange-500', icon: Clock },
                    { label: 'Completed', count: 18, color: 'from-emerald-500 to-green-600', icon: CheckCircle },
                  ].map((status, idx) => {
                    const IconComponent = status.icon
                    return (
                      <div
                        key={idx}
                        className="rounded-xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-5 hover:shadow-lg transition-shadow"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${status.color} flex items-center justify-center`}>
                            <IconComponent className="w-5 h-5 text-white" />
                          </div>
                          <span className="px-3 py-1 bg-white rounded-full text-sm font-bold text-gray-800 border border-gray-200">
                            {status.count}
                          </span>
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-3">{status.label}</h4>
                        <div className="space-y-2">
                          {[
                            { title: 'Internal Marks Review', type: 'Marks', assignee: 'Dr. Ritu' },
                            { title: 'Leave Request Approval', type: 'Leave', assignee: 'Prof. Jyoti' },
                          ].map((item, i) => (
                            <div
                              key={i}
                              className="bg-white p-3 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
                            >
                              <p className="text-xs font-medium text-gray-900 mb-1">{item.title}</p>
                              <div className="flex items-center justify-between">
                                <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-[10px] font-medium">
                                  {item.type}
                                </span>
                                <span className="text-[10px] text-gray-500">{item.assignee}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Student Risk Snapshot */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">Student Risk Snapshot</h3>
                    <p className="text-sm text-gray-600">
                      Students currently under watch based on attendance, assignments and marks.
                    </p>
                  </div>
                  <button className="text-sm text-rose-600 hover:text-rose-700 font-medium flex items-center space-x-1">
                    <span>View Full List</span>
                    <TrendingUp className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    {
                      name: 'Rohit Kumar',
                      id: '2022CSE001',
                      batch: 'CSE Batch 1',
                      reason: 'Low attendance (68%)',
                      subject: 'Database Management',
                      risk: 'high',
                      assignments: 3,
                    },
                    {
                      name: 'Rahul Sharma',
                      id: '2022CSE015',
                      batch: 'CSE Batch 2',
                      reason: 'Missing assignments (3)',
                      subject: 'Data Structures',
                      risk: 'medium',
                      assignments: 2,
                    },
                    {
                      name: 'Nikita Patel',
                      id: '2022CSE028',
                      batch: 'CSE (AIML) Batch 1',
                      reason: 'Low internal marks (45%)',
                      subject: 'Software Engineering',
                      risk: 'high',
                      assignments: 1,
                    },
                    {
                      name: 'Maheshwari Reddy',
                      id: '2022CSE042',
                      batch: 'CSE Batch 1',
                      reason: 'Declining attendance trend',
                      subject: 'Computer Networks',
                      risk: 'medium',
                      assignments: 2,
                    },
                    {
                      name: 'Karan Mehta',
                      id: '2022CSE055',
                      batch: 'CSE IT',
                      reason: 'Multiple late submissions',
                      subject: 'Operating Systems',
                      risk: 'medium',
                      assignments: 4,
                    },
                    {
                      name: 'Priyanka Singh',
                      id: '2022CSE068',
                      batch: 'CSE (AIML) Batch 2',
                      reason: 'Low attendance (72%)',
                      subject: 'Machine Learning',
                      risk: 'high',
                      assignments: 2,
                    },
                    {
                      name: 'Harsh Kalkal',
                      id: '2022CSE071',
                      batch: 'CSE Batch 2',
                      reason: 'Incomplete assignments',
                      subject: 'Web Technologies',
                      risk: 'medium',
                      assignments: 3,
                    },
                  ].map((student, idx) => (
                    <div
                      key={idx}
                      className="p-5 rounded-xl border border-rose-200 bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50 hover:shadow-lg transition-all"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-md ${student.risk === 'high' ? 'bg-gradient-to-br from-rose-500 to-red-600' : 'bg-gradient-to-br from-amber-500 to-orange-500'
                              }`}
                          >
                            {student.name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">
                              {student.name}
                            </p>
                            <p className="text-xs text-gray-600">{student.id} • {student.batch}</p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 text-xs rounded-full font-semibold ${student.risk === 'high' ? 'bg-rose-200 text-rose-800' : 'bg-amber-200 text-amber-800'
                          }`}>
                          {student.risk === 'high' ? 'High Risk' : 'Medium Risk'}
                        </span>
                      </div>
                      <div className="space-y-2 mb-3">
                        <div className="flex items-center space-x-2 text-sm">
                          <AlertTriangle className="w-4 h-4 text-rose-600" />
                          <span className="text-gray-700">{student.reason}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          <FileText className="w-4 h-4 text-blue-600" />
                          <span className="text-gray-700">{student.subject} • {student.assignments} missing</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button className="flex-1 btn-primary text-xs px-3 py-2">View Profile</button>
                        <button className="btn-secondary text-xs px-3 py-2 flex items-center space-x-1">
                          <Mail className="w-3 h-3" />
                          <span>Contact</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delayed Academic Processes */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">Delayed Academic Processes</h3>
                    <p className="text-sm text-gray-600">Items requiring immediate attention</p>
                  </div>
                  <button className="text-sm text-orange-600 hover:text-orange-700 font-medium">View All</button>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    { title: 'Internal Marks Finalization - DBMS', assignee: 'Prof. Rishi Pal Singh', delay: '3 days overdue', priority: 'high', batch: 'CSE Batch 2' },
                    { title: 'Assignment Evaluation - Data Structures', assignee: 'Prof. Om Prakash Sangwan', delay: '2 days overdue', priority: 'medium', batch: 'CSE Batch 1' },
                    { title: 'Attendance Finalization - SE', assignee: 'Prof. Jyoti', delay: '1 day overdue', priority: 'low', batch: 'CSE (AIML) Batch 1' },
                    { title: 'Leave Request Approval - Multiple', assignee: 'Dr. Ritu Makani', delay: '4 days overdue', priority: 'high', batch: 'All Batches' },
                  ].map((item, idx) => (
                    <div key={idx} className="p-5 rounded-xl border border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-1">{item.title}</h4>
                          <p className="text-xs text-gray-600 mb-2">{item.batch}</p>
                          <div className="flex items-center space-x-2">
                            <UserCircle className="w-3 h-3 text-gray-500" />
                            <span className="text-xs text-gray-600">{item.assignee}</span>
                          </div>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full font-medium ${item.priority === 'high' ? 'bg-red-100 text-red-700' :
                          item.priority === 'medium' ? 'bg-orange-100 text-orange-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>
                          {item.priority}
                        </span>
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-orange-200">
                        <span className="text-xs text-orange-700 font-medium flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{item.delay}</span>
                        </span>
                        <button className="btn-primary text-xs px-4 py-1.5">Escalate</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Marks Status */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Marks Status Overview</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-6 rounded-xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-green-50">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-emerald-700 flex items-center space-x-2">
                        <Shield className="w-5 h-5" />
                        <span>Locked Marks</span>
                      </h4>
                      <span className="px-3 py-1 bg-emerald-200 text-emerald-800 rounded-full text-xs font-bold">18 Subjects</span>
                    </div>
                    <div className="space-y-2">
                      {['Data Structures', 'Database Management', 'Software Engineering', 'Computer Networks'].map((subject, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-white rounded-lg border border-emerald-200 hover:shadow-sm transition-shadow">
                          <span className="text-sm font-medium text-gray-900">{subject}</span>
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-emerald-600" />
                            <span className="text-xs text-emerald-600 font-semibold">Locked</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="p-6 rounded-xl border border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-amber-700 flex items-center space-x-2">
                        <Clock className="w-5 h-5" />
                        <span>Pending Finalization</span>
                      </h4>
                      <span className="px-3 py-1 bg-amber-200 text-amber-800 rounded-full text-xs font-bold">2 Subjects</span>
                    </div>
                    <div className="space-y-2">
                      {['Operating Systems', 'Web Technologies'].map((subject, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-white rounded-lg border border-amber-200 hover:shadow-sm transition-shadow">
                          <span className="text-sm font-medium text-gray-900">{subject}</span>
                          <button className="text-xs text-amber-600 font-semibold hover:text-amber-700 flex items-center space-x-1">
                            <Eye className="w-3 h-3" />
                            <span>Review</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Scrum Board Tab */}
          {selectedTab === 'scrum' && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold">Department Scrum Board</h3>
                  <p className="text-sm text-gray-600">
                    Track administrative work across Backlog, Sprint, Review and Done.
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="btn-secondary flex items-center space-x-2">
                    <Filter className="w-4 h-4" />
                    <span>Filter</span>
                  </button>
                  <button className="btn-secondary flex items-center space-x-2">
                    <Download className="w-4 h-4" />
                    <span>Export</span>
                  </button>
                  <button className="btn-primary flex items-center space-x-2">
                    <Plus className="w-4 h-4" />
                    <span>Create Task</span>
                  </button>
                </div>
              </div>

              <div className="grid md:grid-cols-4 gap-4">
                {[
                  { name: 'Backlog', color: 'from-gray-500 to-gray-600', count: 12 },
                  { name: 'In Sprint', color: 'from-blue-500 to-blue-600', count: 8 },
                  { name: 'Review', color: 'from-amber-500 to-orange-500', count: 5 },
                  { name: 'Done', color: 'from-emerald-500 to-green-600', count: 15 },
                ].map((column, colIdx) => (
                  <div key={column.name} className="bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 p-4">
                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full bg-gradient-to-br ${column.color}`}></div>
                        <h4 className="font-semibold text-gray-900">{column.name}</h4>
                      </div>
                      <span className="px-2 py-1 bg-white rounded-full text-xs font-bold text-gray-700 border border-gray-300">
                        {column.count}
                      </span>
                    </div>
                    <div className="space-y-3 min-h-[300px]">
                      {[
                        { title: 'Exam Paper Setting - Data Structures', assignee: 'Prof. Yogesh Chaba', priority: 'high', due: '5 days', type: 'exam' },
                        { title: 'Accreditation Documentation Review', assignee: 'Prof. Rishi Pal Singh', priority: 'medium', due: '10 days', type: 'documentation' },
                        { title: 'Timetable Update for Next Semester', assignee: 'Prof. Om Prakash Sangwan', priority: 'low', due: '3 days', type: 'admin' },
                        { title: 'Faculty Meeting Preparation', assignee: 'Dr. Ritu Makani', priority: 'medium', due: '2 days', type: 'meeting' },
                      ].slice(0, colIdx === 0 ? 3 : colIdx === 1 ? 2 : colIdx === 2 ? 2 : 1).map((task, idx) => (
                        <div key={idx} className="bg-white p-4 rounded-xl border border-gray-200 hover:shadow-lg transition-all cursor-pointer group">
                          <div className="flex items-start justify-between mb-2">
                            <h5 className="font-semibold text-sm text-gray-900 group-hover:text-blue-700 transition-colors line-clamp-2">
                              {task.title}
                            </h5>
                            <span className={`px-2 py-1 text-xs rounded-full flex-shrink-0 ml-2 ${task.priority === 'high' ? 'bg-red-100 text-red-700' :
                              task.priority === 'medium' ? 'bg-amber-100 text-amber-700' :
                                'bg-blue-100 text-blue-700'
                              }`}>
                              {task.priority}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="w-6 h-6 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                              {task.assignee.split(' ').map(n => n[0]).join('')}
                            </div>
                            <span className="text-xs text-gray-600">{task.assignee.split(' ')[1]}</span>
                          </div>
                          <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100">
                            <div className="flex items-center space-x-2">
                              <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px] font-medium">
                                {task.type}
                              </span>
                              <span className="text-xs text-gray-500 flex items-center space-x-1">
                                <Clock className="w-3 h-3" />
                                <span>{task.due}</span>
                              </span>
                            </div>
                            <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                              View →
                            </button>
                          </div>
                        </div>
                      ))}
                      {colIdx === 0 && (
                        <button className="w-full p-3 border-2 border-dashed border-gray-300 rounded-xl text-sm text-gray-500 hover:border-blue-400 hover:text-blue-600 transition-colors flex items-center justify-center space-x-2">
                          <Plus className="w-4 h-4" />
                          <span>Add Task</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Student Risk Tab */}
          {selectedTab === 'risk' && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold">Student Risk Management</h3>
                  <p className="text-sm text-gray-600">
                    Monitor and manage students requiring academic intervention and support.
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="btn-secondary flex items-center space-x-2">
                    <Download className="w-4 h-4" />
                    <span>Export Report</span>
                  </button>
                  <button className="btn-primary flex items-center space-x-2">
                    <Target className="w-4 h-4" />
                    <span>Generate Intervention Plan</span>
                  </button>
                </div>
              </div>

              {/* Risk Summary Cards */}
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-5 rounded-xl bg-gradient-to-br from-rose-500 to-red-600 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase opacity-80 mb-1">High Risk</p>
                      <p className="text-3xl font-bold">8</p>
                    </div>
                    <AlertTriangle className="w-8 h-8 opacity-80" />
                  </div>
                </div>
                <div className="p-5 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase opacity-80 mb-1">Medium Risk</p>
                      <p className="text-3xl font-bold">15</p>
                    </div>
                    <TrendingUp className="w-8 h-8 opacity-80" />
                  </div>
                </div>
                <div className="p-5 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase opacity-80 mb-1">Low Risk</p>
                      <p className="text-3xl font-bold">350</p>
                    </div>
                    <CheckCircle className="w-8 h-8 opacity-80" />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  {
                    name: 'Rohit Kumar',
                    id: '2022CSE001',
                    program: 'B.Tech CSE',
                    semester: '5th',
                    batch: 'CSE Batch 1',
                    risks: ['Low attendance (68%)', 'Missing 3 assignments'],
                    subjects: ['Database Management', 'Data Structures'],
                    attendance: 68,
                    eligibility: 'at_risk',
                    crRole: 'Boy CR',
                  },
                  {
                    name: 'Rahul Sharma',
                    id: '2022CSE015',
                    program: 'B.Tech CSE',
                    semester: '5th',
                    batch: 'CSE Batch 2',
                    risks: ['Low internal marks (45%)'],
                    subjects: ['Software Engineering'],
                    attendance: 75,
                    eligibility: 'at_risk',
                    crRole: null,
                  },
                  {
                    name: 'Nikita Patel',
                    id: '2022CSE028',
                    program: 'B.Tech CSE',
                    semester: '5th',
                    batch: 'CSE (AIML) Batch 1',
                    risks: ['Chronic absenteeism', 'Low performance trend'],
                    subjects: ['Database Management', 'Data Structures', 'Software Engineering'],
                    attendance: 65,
                    eligibility: 'not_eligible',
                    crRole: 'Girl CR',
                  },
                  {
                    name: 'Maheshwari Reddy',
                    id: '2022CSE042',
                    program: 'B.Tech CSE',
                    semester: '5th',
                    batch: 'CSE Batch 1',
                    risks: ['Declining attendance trend', 'Missing assignments (2)'],
                    subjects: ['Computer Networks'],
                    attendance: 72,
                    eligibility: 'at_risk',
                    crRole: null,
                  },
                  {
                    name: 'Karan Mehta',
                    id: '2022CSE055',
                    program: 'B.Tech CSE',
                    semester: '5th',
                    batch: 'CSE IT',
                    risks: ['Multiple late submissions', 'Low attendance (70%)'],
                    subjects: ['Operating Systems'],
                    attendance: 70,
                    eligibility: 'at_risk',
                    crRole: 'Boy CR',
                  },
                  {
                    name: 'Priyanka Singh',
                    id: '2022CSE068',
                    program: 'B.Tech CSE',
                    semester: '5th',
                    batch: 'CSE (AIML) Batch 2',
                    risks: ['Low attendance (72%)', 'Incomplete assignments'],
                    subjects: ['Machine Learning'],
                    attendance: 72,
                    eligibility: 'at_risk',
                    crRole: 'Girl CR',
                  },
                  {
                    name: 'Harsh Kalkal',
                    id: '2022CSE071',
                    program: 'B.Tech CSE',
                    semester: '5th',
                    batch: 'CSE Batch 2',
                    risks: ['Incomplete assignments (3)', 'Low internal marks (48%)'],
                    subjects: ['Web Technologies'],
                    attendance: 78,
                    eligibility: 'at_risk',
                    crRole: null,
                  },
                ].map((student, idx) => (
                  <div key={idx} className="p-6 border border-rose-200 rounded-xl bg-gradient-to-br from-rose-50 via-orange-50 to-white hover:shadow-lg transition-all">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div
                          className={`w-14 h-14 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-lg ${student.eligibility === 'not_eligible' ? 'bg-gradient-to-br from-rose-500 to-red-600' :
                            student.attendance < 70 ? 'bg-gradient-to-br from-rose-400 to-pink-500' :
                              'bg-gradient-to-br from-amber-500 to-orange-500'
                            }`}
                        >
                          {student.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-bold text-lg text-gray-900">{student.name}</h4>
                            {student.crRole && (
                              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                                {student.crRole}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{student.id} • {student.program} • {student.semester} • {student.batch}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 text-xs rounded-full font-semibold ${student.eligibility === 'not_eligible' ? 'bg-red-200 text-red-800' : 'bg-amber-200 text-amber-800'
                        }`}>
                        {student.eligibility === 'not_eligible' ? 'Not Eligible' : 'At Risk'}
                      </span>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm font-semibold mb-2 text-gray-700">Risk Indicators</p>
                        <ul className="space-y-2">
                          {student.risks.map((risk, i) => (
                            <li key={i} className="text-sm text-gray-700 flex items-start space-x-2">
                              <AlertTriangle className="w-4 h-4 text-rose-600 mt-0.5 flex-shrink-0" />
                              <span>{risk}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-sm font-semibold mb-2 text-gray-700">Affected Subjects</p>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {student.subjects.map((subject, i) => (
                            <span key={i} className="px-3 py-1 bg-white rounded-lg text-xs font-medium border border-gray-200 text-gray-700">
                              {subject}
                            </span>
                          ))}
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Overall Attendance</p>
                          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                            <div
                              className={`h-2.5 rounded-full ${student.attendance < 70 ? 'bg-red-500' : 'bg-amber-500'
                                }`}
                              style={{ width: `${student.attendance}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-gray-600">{student.attendance}%</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 pt-4 border-t border-rose-200">
                      <button className="btn-primary text-sm px-4 py-2 flex items-center space-x-2">
                        <Eye className="w-4 h-4" />
                        <span>View Full Profile</span>
                      </button>
                      <button className="btn-secondary text-sm px-4 py-2 flex items-center space-x-2">
                        <Mail className="w-4 h-4" />
                        <span>Contact Advisor</span>
                      </button>
                      <button className="btn-secondary text-sm px-4 py-2 flex items-center space-x-2">
                        <FileText className="w-4 h-4" />
                        <span>Generate Report</span>
                      </button>
                      <button className="btn-secondary text-sm px-4 py-2 flex items-center space-x-2">
                        <Target className="w-4 h-4" />
                        <span>Intervention Plan</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {selectedTab === 'analytics' && (
            <div className="space-y-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Department Analytics</h3>
                <p className="text-sm text-gray-600">
                  Comprehensive insights into attendance, assessments, faculty workload, and risk patterns.
                </p>
              </div>

              {/* Attendance Trends Chart */}
              <div className="p-6 rounded-xl border border-gray-200 bg-gradient-to-br from-blue-50 via-white to-purple-50">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-semibold text-lg text-gray-900">Attendance Trends</h4>
                    <p className="text-sm text-gray-600">Weekly attendance percentage across all batches</p>
                  </div>
                  <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">Export Data</button>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={attendanceTrendData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis dataKey="week" stroke="#6B7280" />
                      <YAxis stroke="#6B7280" />
                      <Tooltip
                        contentStyle={{ borderRadius: 12, borderColor: '#E5E7EB', backgroundColor: 'white' }}
                        cursor={{ stroke: '#3B82F6', strokeWidth: 2 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="attendance"
                        stroke="url(#colorAttendance)"
                        strokeWidth={3}
                        dot={{ fill: '#3B82F6', r: 5 }}
                        activeDot={{ r: 7 }}
                      />
                      <defs>
                        <linearGradient id="colorAttendance" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#3B82F6" stopOpacity={1} />
                          <stop offset="100%" stopColor="#8B5CF6" stopOpacity={1} />
                        </linearGradient>
                      </defs>
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Assessment Outcomes */}
              <div className="p-6 rounded-xl border border-gray-200 bg-gradient-to-br from-green-50 via-white to-emerald-50">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-semibold text-lg text-gray-900">Assessment Outcomes</h4>
                    <p className="text-sm text-gray-600">Performance metrics across subjects</p>
                  </div>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={assessmentOutcomes} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis dataKey="subject" stroke="#6B7280" />
                      <YAxis stroke="#6B7280" />
                      <Tooltip
                        contentStyle={{ borderRadius: 12, borderColor: '#E5E7EB', backgroundColor: 'white' }}
                        cursor={{ fill: 'rgba(16,185,129,0.1)' }}
                      />
                      <Legend />
                      <Bar dataKey="avgMarks" fill="url(#colorAvgMarks)" radius={[8, 8, 0, 0]} name="Avg Marks" />
                      <Bar dataKey="submissionRate" fill="url(#colorSubmission)" radius={[8, 8, 0, 0]} name="Submission %" />
                      <Bar dataKey="onTimeRate" fill="url(#colorOnTime)" radius={[8, 8, 0, 0]} name="On-Time %" />
                      <defs>
                        <linearGradient id="colorAvgMarks" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10B981" stopOpacity={0.9} />
                          <stop offset="95%" stopColor="#059669" stopOpacity={0.8} />
                        </linearGradient>
                        <linearGradient id="colorSubmission" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.9} />
                          <stop offset="95%" stopColor="#2563EB" stopOpacity={0.8} />
                        </linearGradient>
                        <linearGradient id="colorOnTime" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.9} />
                          <stop offset="95%" stopColor="#7C3AED" stopOpacity={0.8} />
                        </linearGradient>
                      </defs>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Faculty Workload */}
              <div className="p-6 rounded-xl border border-gray-200 bg-gradient-to-br from-purple-50 via-white to-pink-50">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-semibold text-lg text-gray-900">Faculty Workload Distribution</h4>
                    <p className="text-sm text-gray-600">Task allocation and completion rates</p>
                  </div>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={facultyWorkload} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis type="number" stroke="#6B7280" />
                      <YAxis dataKey="name" type="category" stroke="#6B7280" width={120} />
                      <Tooltip
                        contentStyle={{ borderRadius: 12, borderColor: '#E5E7EB', backgroundColor: 'white' }}
                        cursor={{ fill: 'rgba(139,92,246,0.1)' }}
                      />
                      <Legend />
                      <Bar dataKey="tasks" fill="url(#colorTasks)" radius={[0, 8, 8, 0]} name="Total Tasks" />
                      <Bar dataKey="completed" fill="url(#colorCompleted)" radius={[0, 8, 8, 0]} name="Completed" />
                      <defs>
                        <linearGradient id="colorTasks" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.9} />
                          <stop offset="95%" stopColor="#EC4899" stopOpacity={0.8} />
                        </linearGradient>
                        <linearGradient id="colorCompleted" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="5%" stopColor="#10B981" stopOpacity={0.9} />
                          <stop offset="95%" stopColor="#059669" stopOpacity={0.8} />
                        </linearGradient>
                      </defs>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Risk Distribution Pie Chart */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 rounded-xl border border-gray-200 bg-gradient-to-br from-rose-50 via-white to-orange-50">
                  <h4 className="font-semibold text-lg text-gray-900 mb-4">Student Risk Distribution</h4>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{ borderRadius: 12, borderColor: '#E5E7EB', backgroundColor: 'white' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex justify-center space-x-4 mt-4">
                    {pieData.map((item, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                        <span className="text-xs text-gray-600">{item.name}: {item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Department Risk Heat Map */}
                <div className="p-6 rounded-xl border border-gray-200 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
                  <h4 className="font-semibold text-lg text-gray-900 mb-4">Department Risk Heat Map</h4>
                  <p className="text-sm text-gray-600 mb-4">Risk level by subject across all batches</p>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { subject: 'DS', risk: 'medium', value: 15 },
                      { subject: 'DBMS', risk: 'high', value: 8 },
                      { subject: 'SE', risk: 'low', value: 3 },
                      { subject: 'CN', risk: 'low', value: 2 },
                      { subject: 'OS', risk: 'medium', value: 12 },
                      { subject: 'ML', risk: 'low', value: 5 },
                    ].map((item, idx) => (
                      <div key={idx} className="text-center">
                        <div
                          className={`w-full h-20 rounded-xl mb-2 flex items-center justify-center text-white font-bold text-lg shadow-lg ${item.risk === 'high'
                            ? 'bg-gradient-to-br from-red-500 to-rose-600'
                            : item.risk === 'medium'
                              ? 'bg-gradient-to-br from-amber-500 to-orange-500'
                              : 'bg-gradient-to-br from-emerald-500 to-green-600'
                            }`}
                        >
                          {item.value}
                        </div>
                        <p className="text-xs font-semibold text-gray-900">{item.subject}</p>
                        <p
                          className={`text-[10px] font-medium ${item.risk === 'high'
                            ? 'text-red-600'
                            : item.risk === 'medium'
                              ? 'text-amber-600'
                              : 'text-emerald-600'
                            }`}
                        >
                          {item.risk === 'high' ? 'High Risk' : item.risk === 'medium' ? 'Medium Risk' : 'Low Risk'}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Workflows Tab */}
          {selectedTab === 'workflows' && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold">All Department Workflows</h3>
                  <p className="text-sm text-gray-600">
                    Complete view of all academic and administrative workflows across the department.
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="btn-secondary flex items-center space-x-2">
                    <Filter className="w-4 h-4" />
                    <span>Filter</span>
                  </button>
                  <button className="btn-secondary flex items-center space-x-2">
                    <Download className="w-4 h-4" />
                    <span>Export</span>
                  </button>
                  <button className="btn-primary flex items-center space-x-2">
                    <Plus className="w-4 h-4" />
                    <span>Create Workflow</span>
                  </button>
                </div>
              </div>

              {/* Workflow Stats */}
              <div className="grid md:grid-cols-4 gap-4">
                {[
                  { label: 'Total Workflows', count: 247, color: 'from-blue-500 to-blue-600', icon: FileText },
                  { label: 'Active', count: 89, color: 'from-green-500 to-emerald-600', icon: Activity },
                  { label: 'Pending', count: 45, color: 'from-amber-500 to-orange-500', icon: Clock },
                  { label: 'Completed', count: 113, color: 'from-purple-500 to-pink-600', icon: CheckCircle },
                ].map((stat, idx) => {
                  const IconComponent = stat.icon
                  return (
                    <div key={idx} className="p-4 rounded-xl bg-gradient-to-br from-white to-gray-50 border border-gray-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-gray-600 mb-1">{stat.label}</p>
                          <p className="text-2xl font-bold text-gray-900">{stat.count}</p>
                        </div>
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                          <IconComponent className="w-5 h-5 text-white" />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Workflow List */}
              <div className="space-y-3">
                {[
                  {
                    type: 'attendance',
                    title: 'Attendance Session - Data Structures',
                    status: 'finalised',
                    assignee: 'Prof. Yogesh Chaba',
                    batch: 'CSE Batch 1',
                    date: 'Dec 12, 2024',
                    priority: 'normal',
                    students: 50,
                    present: 44,
                  },
                  {
                    type: 'assignment',
                    title: 'Assignment Evaluation - DBMS',
                    status: 'in_progress',
                    assignee: 'Prof. Rishi Pal Singh',
                    batch: 'CSE Batch 2',
                    date: 'Dec 13, 2024',
                    priority: 'high',
                    submissions: 38,
                    total: 48,
                  },
                  {
                    type: 'marks',
                    title: 'Internal Marks Review - SE',
                    status: 'under_review',
                    assignee: 'Prof. Om Prakash Sangwan',
                    batch: 'CSE (AIML) Batch 1',
                    date: 'Dec 11, 2024',
                    priority: 'high',
                    students: 45,
                    entered: 42,
                  },
                  {
                    type: 'leave',
                    title: 'Leave Request - Student 2022CSE001',
                    status: 'pending',
                    assignee: 'Prof. Jyoti',
                    batch: 'CSE Batch 1',
                    date: 'Dec 14, 2024',
                    priority: 'normal',
                    days: 3,
                  },
                  {
                    type: 'task',
                    title: 'Exam Paper Preparation - CN',
                    status: 'in_progress',
                    assignee: 'Prof. Sunila',
                    batch: 'CSE IT',
                    date: 'Dec 10, 2024',
                    priority: 'critical',
                    progress: 65,
                  },
                ].map((workflow, idx) => {
                  const typeColors = {
                    attendance: 'bg-blue-100 text-blue-700 border-blue-200',
                    assignment: 'bg-green-100 text-green-700 border-green-200',
                    marks: 'bg-purple-100 text-purple-700 border-purple-200',
                    leave: 'bg-yellow-100 text-yellow-700 border-yellow-200',
                    task: 'bg-indigo-100 text-indigo-700 border-indigo-200',
                  }

                  const statusColors = {
                    finalised: 'bg-emerald-100 text-emerald-700',
                    in_progress: 'bg-blue-100 text-blue-700',
                    under_review: 'bg-amber-100 text-amber-700',
                    pending: 'bg-gray-100 text-gray-700',
                  }

                  return (
                    <div
                      key={idx}
                      className="p-5 border border-gray-200 rounded-xl hover:shadow-lg transition-all bg-gradient-to-br from-white to-gray-50"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-start space-x-4 flex-1">
                          <span className={`px-3 py-1 text-xs rounded-lg font-semibold border ${typeColors[workflow.type as keyof typeof typeColors]}`}>
                            {workflow.type.charAt(0).toUpperCase() + workflow.type.slice(1)}
                          </span>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 mb-1">{workflow.title}</h4>
                            <div className="flex items-center space-x-3 text-xs text-gray-600">
                              <span className="flex items-center space-x-1">
                                <UserCircle className="w-3 h-3" />
                                <span>{workflow.assignee}</span>
                              </span>
                              <span>•</span>
                              <span>{workflow.batch}</span>
                              <span>•</span>
                              <span>{workflow.date}</span>
                            </div>
                            {workflow.type === 'attendance' &&
                              workflow.present !== undefined &&
                              workflow.students !== undefined &&
                              workflow.students > 0 && (
                                <div className="mt-2 text-xs text-gray-600">
                                  Present: {workflow.present}/{workflow.students} (
                                  {Math.round((workflow.present / workflow.students) * 100)}%)
                                </div>
                              )}

                            {workflow.type === 'assignment' &&
                              workflow.submissions !== undefined &&
                              workflow.total !== undefined &&
                              workflow.total > 0 && (
                                <div className="mt-2 text-xs text-gray-600">
                                  Submissions: {workflow.submissions}/{workflow.total} ({Math.round((workflow.submissions / workflow.total) * 100)}%)
                                </div>
                              )}
                            {workflow.type === 'marks' &&
                              workflow.entered !== undefined &&
                              workflow.students !== undefined &&
                              workflow.students > 0 && (
                                <div className="mt-2 text-xs text-gray-600">
                                  Marks Entered: {workflow.entered}/{workflow.students} ({Math.round((workflow.entered / workflow.students) * 100)}%)
                                </div>
                              )}
                            {workflow.type === 'task' &&
                              workflow.progress !== undefined && (
                                <div className="mt-2">
                                  <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                                    <span>Progress</span>
                                    <span>{workflow.progress}%</span>
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                                    <div
                                      className="bg-blue-500 h-1.5 rounded-full"
                                      style={{ width: `${workflow.progress}%` }}
                                    ></div>
                                  </div>
                                </div>
                              )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 text-xs rounded-full font-medium ${workflow.priority === 'critical' ? 'bg-red-100 text-red-700' :
                            workflow.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                            {workflow.priority}
                          </span>
                          <span className={`px-3 py-1 text-xs rounded-full capitalize ${statusColors[workflow.status as keyof typeof statusColors]}`}>
                            {workflow.status.replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                        <div className="flex items-center space-x-2">
                          <button className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-1">
                            <Eye className="w-3 h-3" />
                            <span>View Details</span>
                          </button>
                          {workflow.status === 'pending' && (
                            <button className="text-xs text-green-600 hover:text-green-700 font-medium flex items-center space-x-1">
                              <CheckCircle className="w-3 h-3" />
                              <span>Approve</span>
                            </button>
                          )}
                          {workflow.status === 'in_progress' && (
                            <button className="text-xs text-amber-600 hover:text-amber-700 font-medium flex items-center space-x-1">
                              <Clock className="w-3 h-3" />
                              <span>Track</span>
                            </button>
                          )}
                        </div>
                        <button className="text-xs text-gray-600 hover:text-gray-900 font-medium flex items-center space-x-1">
                          <Edit className="w-3 h-3" />
                          <span>Edit</span>
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Student Queries Tab */}
          {selectedTab === 'queries' && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold">Student Queries & Help Center</h3>
                  <p className="text-sm text-gray-600">
                    Manage student queries, applications, document requests, and support tickets.
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="btn-secondary flex items-center space-x-2">
                    <Filter className="w-4 h-4" />
                    <span>Filter</span>
                  </button>
                  <button className="btn-secondary flex items-center space-x-2">
                    <Download className="w-4 h-4" />
                    <span>Export</span>
                  </button>
                </div>
              </div>

              {/* Query Stats */}
              <div className="grid md:grid-cols-4 gap-4">
                {[
                  { label: 'Pending Queries', count: 42, color: 'from-amber-500 to-orange-500', icon: Clock },
                  { label: 'Resolved', count: 156, color: 'from-green-500 to-emerald-600', icon: CheckCircle },
                  { label: 'In Progress', count: 18, color: 'from-blue-500 to-blue-600', icon: Activity },
                  { label: 'Total Queries', count: 216, color: 'from-purple-500 to-purple-600', icon: MessageSquare },
                ].map((stat, idx) => {
                  const IconComponent = stat.icon
                  return (
                    <div key={idx} className="p-5 rounded-xl bg-gradient-to-br from-white to-gray-50 border border-gray-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-gray-600 mb-1">{stat.label}</p>
                          <p className="text-2xl font-bold text-gray-900">{stat.count}</p>
                        </div>
                        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Query Categories */}
              <div className="grid md:grid-cols-4 gap-4">
                {[
                  { type: 'Document Requests', count: 28, pending: 8, color: 'from-blue-500 to-blue-600' },
                  { type: 'Application Help', count: 35, pending: 12, color: 'from-green-500 to-green-600' },
                  { type: 'General Queries', count: 45, pending: 15, color: 'from-purple-500 to-purple-600' },
                  { type: 'Technical Support', count: 18, pending: 7, color: 'from-amber-500 to-orange-500' },
                ].map((category, idx) => (
                  <div key={idx} className="p-5 rounded-xl border border-gray-200 bg-gradient-to-br from-white to-gray-50">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-gray-900 text-sm">{category.type}</h4>
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${category.color} flex items-center justify-center`}>
                        <HelpCircle className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">Total</span>
                        <span className="text-lg font-bold text-gray-900">{category.count}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">Pending</span>
                        <span className="text-sm font-semibold text-amber-600">{category.pending}</span>
                      </div>
                    </div>
                    <button className="btn-secondary w-full mt-3 text-xs">View All</button>
                  </div>
                ))}
              </div>

              {/* Query List */}
              <div className="space-y-3">
                {[
                  {
                    student: 'Rohit Kumar',
                    id: '2022CSE001',
                    queryType: 'Document Request',
                    subject: 'Request for Bonafide Certificate',
                    message: 'I need a bonafide certificate for scholarship application. Please process my request.',
                    status: 'pending',
                    submitted: 'Dec 12, 2024',
                    priority: 'normal',
                  },
                  {
                    student: 'Rahul Sharma',
                    id: '2022CSE015',
                    queryType: 'Application Help',
                    subject: 'Semester Registration Issue',
                    message: 'Unable to register for courses. Getting error message when selecting electives.',
                    status: 'in_progress',
                    submitted: 'Dec 11, 2024',
                    priority: 'high',
                  },
                  {
                    student: 'Nikita Patel',
                    id: '2022CSE028',
                    queryType: 'General Query',
                    subject: 'Fee Payment Confirmation',
                    message: 'I have paid my semester fees but the status is still showing pending. Please verify.',
                    status: 'resolved',
                    submitted: 'Dec 8, 2024',
                    priority: 'normal',
                  },
                  {
                    student: 'Maheshwari Reddy',
                    id: '2022CSE042',
                    queryType: 'Document Request',
                    subject: 'Transcript Request',
                    message: 'I need an official transcript for job application. Please provide the procedure.',
                    status: 'pending',
                    submitted: 'Dec 13, 2024',
                    priority: 'normal',
                  },
                  {
                    student: 'Karan Mehta',
                    id: '2022CSE055',
                    queryType: 'Technical Support',
                    subject: 'Login Issue',
                    message: 'Cannot access my dashboard. Password reset not working. Need immediate help.',
                    status: 'in_progress',
                    submitted: 'Dec 13, 2024',
                    priority: 'high',
                  },
                ].map((query, idx) => {
                  const statusColors = {
                    pending: 'bg-amber-100 text-amber-700 border-amber-200',
                    in_progress: 'bg-blue-100 text-blue-700 border-blue-200',
                    resolved: 'bg-green-100 text-green-700 border-green-200',
                  }

                  return (
                    <div key={idx} className="p-5 border border-gray-200 rounded-xl hover:shadow-lg transition-all bg-gradient-to-br from-white to-gray-50">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-start space-x-4 flex-1">
                          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                            {query.student.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h4 className="font-semibold text-gray-900">{query.student}</h4>
                              {query.priority === 'high' && (
                                <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                                  High Priority
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-600 mb-2">{query.id}</p>
                            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 mb-2">
                              <div className="flex items-center space-x-2 mb-1">
                                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                                  {query.queryType}
                                </span>
                                <span className="text-xs text-gray-500">•</span>
                                <span className="text-sm font-semibold text-gray-900">{query.subject}</span>
                              </div>
                              <p className="text-xs text-gray-700 mt-2 line-clamp-2">{query.message}</p>
                            </div>
                            <span className="text-xs text-gray-600">Submitted: {query.submitted}</span>
                          </div>
                        </div>
                        <span className={`px-3 py-1 text-xs rounded-full border font-medium ${statusColors[query.status as keyof typeof statusColors]}`}>
                          {query.status === 'in_progress' ? 'In Progress' : query.status.charAt(0).toUpperCase() + query.status.slice(1)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                        <button className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-1">
                          <Eye className="w-3 h-3" />
                          <span>View Full Query</span>
                        </button>
                        {query.status === 'pending' && (
                          <div className="flex items-center space-x-2">
                            <button className="text-xs text-green-600 hover:text-green-700 font-medium flex items-center space-x-1">
                              <CheckCircle className="w-3 h-3" />
                              <span>Resolve</span>
                            </button>
                            <button className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-1">
                              <MessageSquare className="w-3 h-3" />
                              <span>Reply</span>
                            </button>
                          </div>
                        )}
                        {query.status === 'in_progress' && (
                          <button className="text-xs text-purple-600 hover:text-purple-700 font-medium flex items-center space-x-1">
                            <Activity className="w-3 h-3" />
                            <span>Update Status</span>
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Chairperson Office Tab */}
          {selectedTab === 'chairperson' && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold">Chairperson Office</h3>
                  <p className="text-sm text-gray-600">
                    Manage chairperson notifications, tasks, approvals, and administrative communications.
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="btn-secondary flex items-center space-x-2">
                    <Filter className="w-4 h-4" />
                    <span>Filter</span>
                  </button>
                  <button className="btn-secondary flex items-center space-x-2">
                    <Download className="w-4 h-4" />
                    <span>Export</span>
                  </button>
                </div>
              </div>

              {/* Chairperson Stats */}
              <div className="grid md:grid-cols-4 gap-4">
                {[
                  { label: 'Pending Tasks', count: 15, color: 'from-amber-500 to-orange-500', icon: Clock },
                  { label: 'Notifications', count: 28, color: 'from-blue-500 to-blue-600', icon: Bell },
                  { label: 'Approvals Required', count: 12, color: 'from-purple-500 to-purple-600', icon: UserCheck },
                  { label: 'Completed Tasks', count: 89, color: 'from-green-500 to-emerald-600', icon: CheckCircle },
                ].map((stat, idx) => {
                  const IconComponent = stat.icon
                  return (
                    <div key={idx} className="p-5 rounded-xl bg-gradient-to-br from-white to-gray-50 border border-gray-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-gray-600 mb-1">{stat.label}</p>
                          <p className="text-2xl font-bold text-gray-900">{stat.count}</p>
                        </div>
                        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Notifications Section */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-semibold text-lg text-gray-900">Recent Notifications</h4>
                    <p className="text-sm text-gray-600">Important updates and alerts for the chairperson</p>
                  </div>
                  <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All</button>
                </div>
                <div className="space-y-3">
                  {[
                    {
                      type: 'Approval Required',
                      title: 'Internal Marks Finalization - CSE Batch 1',
                      message: 'Dr. Ritu Makani has submitted internal marks for final approval. Review required.',
                      time: '2 hours ago',
                      priority: 'high',
                      status: 'unread',
                    },
                    {
                      type: 'Task Assignment',
                      title: 'Accreditation Documentation Review',
                      message: 'NAAC accreditation documents need chairperson review before submission deadline.',
                      time: '5 hours ago',
                      priority: 'medium',
                      status: 'unread',
                    },
                    {
                      type: 'Student Appeal',
                      title: 'Eligibility Appeal - Rohit Kumar',
                      message: 'Student has submitted an appeal for exam eligibility. Requires chairperson decision.',
                      time: '1 day ago',
                      priority: 'high',
                      status: 'read',
                    },
                    {
                      type: 'Department Meeting',
                      title: 'Faculty Meeting Scheduled',
                      message: 'Monthly faculty meeting scheduled for Dec 20, 2024. Agenda items need approval.',
                      time: '2 days ago',
                      priority: 'normal',
                      status: 'read',
                    },
                  ].map((notification, idx) => (
                    <div
                      key={idx}
                      className={`p-5 border rounded-xl hover:shadow-lg transition-all bg-gradient-to-br from-white to-gray-50 ${
                        notification.status === 'unread' ? 'border-blue-300 bg-blue-50/30' : 'border-gray-200'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${
                            notification.status === 'unread' ? 'bg-blue-600' : 'bg-gray-300'
                          }`}></div>
                          <span className={`px-2 py-0.5 text-xs rounded font-medium ${
                            notification.type === 'Approval Required' ? 'bg-purple-100 text-purple-700' :
                            notification.type === 'Task Assignment' ? 'bg-blue-100 text-blue-700' :
                            notification.type === 'Student Appeal' ? 'bg-rose-100 text-rose-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {notification.type}
                          </span>
                          {notification.priority === 'high' && (
                            <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs font-medium">
                              High Priority
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-gray-500">{notification.time}</span>
                      </div>
                      <h5 className="font-semibold text-gray-900 mb-1">{notification.title}</h5>
                      <p className="text-sm text-gray-600 mb-3">{notification.message}</p>
                      <div className="flex items-center space-x-2">
                        <button className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-1">
                          <Eye className="w-3 h-3" />
                          <span>View Details</span>
                        </button>
                        {notification.type === 'Approval Required' && (
                          <button className="text-xs text-green-600 hover:text-green-700 font-medium flex items-center space-x-1">
                            <CheckCircle className="w-3 h-3" />
                            <span>Approve</span>
                          </button>
                        )}
                        <button className="text-xs text-gray-600 hover:text-gray-700 font-medium flex items-center space-x-1">
                          <Bell className="w-3 h-3" />
                          <span>Mark as Read</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tasks Section */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-semibold text-lg text-gray-900">Assigned Tasks</h4>
                    <p className="text-sm text-gray-600">Tasks requiring chairperson attention</p>
                  </div>
                  <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All Tasks</button>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    {
                      title: 'Review and Approve Department Budget 2025',
                      assignee: 'Finance Committee',
                      dueDate: 'Dec 20, 2024',
                      priority: 'high',
                      status: 'pending',
                      progress: 0,
                    },
                    {
                      title: 'Faculty Recruitment - Interview Panel',
                      assignee: 'HR Committee',
                      dueDate: 'Dec 18, 2024',
                      priority: 'high',
                      status: 'in_progress',
                      progress: 60,
                    },
                    {
                      title: 'Accreditation Report Final Review',
                      assignee: 'Quality Assurance',
                      dueDate: 'Dec 25, 2024',
                      priority: 'critical',
                      status: 'pending',
                      progress: 0,
                    },
                    {
                      title: 'Annual Department Report Preparation',
                      assignee: 'Administration',
                      dueDate: 'Dec 30, 2024',
                      priority: 'medium',
                      status: 'in_progress',
                      progress: 40,
                    },
                  ].map((task, idx) => (
                    <div key={idx} className="p-5 border border-gray-200 rounded-xl hover:shadow-lg transition-all bg-gradient-to-br from-white to-gray-50">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h5 className="font-semibold text-gray-900">{task.title}</h5>
                            <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                              task.priority === 'critical' ? 'bg-red-100 text-red-700' :
                              task.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                              'bg-blue-100 text-blue-700'
                            }`}>
                              {task.priority}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 mb-2">Assigned by: {task.assignee}</p>
                          <div className="flex items-center space-x-3 text-xs text-gray-600">
                            <span className="flex items-center space-x-1">
                              <Clock className="w-3 h-3" />
                              <span>Due: {task.dueDate}</span>
                            </span>
                            <span>•</span>
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                              task.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                              'bg-blue-100 text-blue-700'
                            }`}>
                              {task.status === 'in_progress' ? 'In Progress' : 'Pending'}
                            </span>
                          </div>
                        </div>
                      </div>
                      {task.status === 'in_progress' && (
                        <div className="mb-3">
                          <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                            <span>Progress</span>
                            <span>{task.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full"
                              style={{ width: `${task.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                      <div className="flex items-center space-x-2 pt-3 border-t border-gray-200">
                        <button className="btn-primary text-xs px-4 py-2 flex-1">View Task</button>
                        <button className="btn-secondary text-xs px-4 py-2 flex-1">Update Status</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div>
                <h4 className="font-semibold text-lg text-gray-900 mb-4">Quick Actions</h4>
                <div className="grid md:grid-cols-4 gap-4">
                  {[
                    { label: 'Send Announcement', icon: Send, color: 'from-blue-500 to-blue-600' },
                    { label: 'Schedule Meeting', icon: Calendar, color: 'from-green-500 to-green-600' },
                    { label: 'Review Reports', icon: FileText, color: 'from-purple-500 to-purple-600' },
                    { label: 'Contact Faculty', icon: Mail, color: 'from-amber-500 to-orange-500' },
                  ].map((action, idx) => {
                    const IconComponent = action.icon
                    return (
                      <button
                        key={idx}
                        className="p-5 rounded-xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 hover:shadow-lg transition-all text-left"
                      >
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center mb-3`}>
                          <IconComponent className="w-5 h-5 text-white" />
                        </div>
                        <p className="font-semibold text-sm text-gray-900">{action.label}</p>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Policy Configuration Tab */}
          {selectedTab === 'policy' && (
            <div className="space-y-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Policy Configuration</h3>
                <p className="text-sm text-gray-600">
                  Configure department-wide policies, thresholds, and rules. Changes affect all workflows and academic processes.
                </p>
              </div>

              <div className="space-y-6">
                {/* Attendance Policies */}
                <div className="p-6 border border-gray-200 rounded-xl bg-gradient-to-br from-blue-50 via-white to-blue-50">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg text-gray-900">Attendance Policies</h4>
                      <p className="text-sm text-gray-600">Configure attendance thresholds and warning rules</p>
                    </div>
                  </div>
                  <div className="space-y-4 mt-4">
                    <div className="p-4 bg-white rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-semibold text-gray-900">Minimum Attendance Percentage</p>
                          <p className="text-xs text-gray-600 mt-1">Required for exam eligibility. Students below this threshold will be marked as "Not Eligible".</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="number" defaultValue={75} className="input w-20 text-center font-semibold" />
                          <span className="text-gray-600">%</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 bg-white rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-semibold text-gray-900">Early Warning Threshold</p>
                          <p className="text-xs text-gray-600 mt-1">Percentage to trigger early warning alerts. Students approaching the minimum threshold will be notified.</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="number" defaultValue={80} className="input w-20 text-center font-semibold" />
                          <span className="text-gray-600">%</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 bg-white rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-semibold text-gray-900">Grace Period for Late Attendance</p>
                          <p className="text-xs text-gray-600 mt-1">Minutes allowed after class start time for attendance marking without penalty.</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="number" defaultValue={15} className="input w-20 text-center font-semibold" />
                          <span className="text-gray-600">minutes</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button className="btn-primary mt-4">Save Attendance Policies</button>
                </div>

                {/* Review Windows */}
                <div className="p-6 border border-gray-200 rounded-xl bg-gradient-to-br from-purple-50 via-white to-purple-50">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                      <Clock className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg text-gray-900">Review Windows & Deadlines</h4>
                      <p className="text-sm text-gray-600">Configure time windows for student reviews and clarifications</p>
                    </div>
                  </div>
                  <div className="space-y-4 mt-4">
                    <div className="p-4 bg-white rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-semibold text-gray-900">Marks Review Window Duration</p>
                          <p className="text-xs text-gray-600 mt-1">Number of days students can request clarification on internal marks after they are made visible.</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="number" defaultValue={7} className="input w-20 text-center font-semibold" />
                          <span className="text-gray-600">days</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 bg-white rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-semibold text-gray-900">Track Report Review Period</p>
                          <p className="text-xs text-gray-600 mt-1">Days available for students to review and raise concerns about their Track Report.</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="number" defaultValue={5} className="input w-20 text-center font-semibold" />
                          <span className="text-gray-600">days</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 bg-white rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-semibold text-gray-900">Assignment Late Submission Grace Period</p>
                          <p className="text-xs text-gray-600 mt-1">Hours after deadline before assignment is marked as "Late" (penalty may still apply).</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="number" defaultValue={24} className="input w-20 text-center font-semibold" />
                          <span className="text-gray-600">hours</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button className="btn-primary mt-4">Save Review Windows</button>
                </div>

                {/* Escalation Rules */}
                <div className="p-6 border border-gray-200 rounded-xl bg-gradient-to-br from-amber-50 via-white to-orange-50">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center">
                      <Zap className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg text-gray-900">Escalation Rules & Automation</h4>
                      <p className="text-sm text-gray-600">Configure automatic escalation and notification rules</p>
                    </div>
                  </div>
                  <div className="space-y-4 mt-4">
                    <div className="p-4 bg-white rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-semibold text-gray-900">Auto-Escalate After (Hours)</p>
                          <p className="text-xs text-gray-600 mt-1">Automatic escalation to HOD when a workflow remains in "Pending" or "In Progress" state beyond this duration.</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="number" defaultValue={48} className="input w-20 text-center font-semibold" />
                          <span className="text-gray-600">hours</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 bg-white rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-semibold text-gray-900">Leave Escalation Threshold (Days)</p>
                          <p className="text-xs text-gray-600 mt-1">Leave requests exceeding this duration automatically escalate to HOD for approval.</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="number" defaultValue={3} className="input w-20 text-center font-semibold" />
                          <span className="text-gray-600">days</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 bg-white rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-semibold text-gray-900">Risk Alert Threshold</p>
                          <p className="text-xs text-gray-600 mt-1">Number of risk indicators required before a student is flagged for administrative review.</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="number" defaultValue={2} className="input w-20 text-center font-semibold" />
                          <span className="text-gray-600">indicators</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button className="btn-primary mt-4">Save Escalation Rules</button>
                </div>

                {/* Notification Settings */}
                <div className="p-6 border border-gray-200 rounded-xl bg-gradient-to-br from-green-50 via-white to-emerald-50">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                      <Bell className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg text-gray-900">Notification & Communication</h4>
                      <p className="text-sm text-gray-600">Configure email, SMS, and in-app notification preferences</p>
                    </div>
                  </div>
                  <div className="space-y-4 mt-4">
                    <div className="p-4 bg-white rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-gray-900">Enable Email Notifications</p>
                          <p className="text-xs text-gray-600 mt-1">Send email alerts for critical workflow updates and deadline reminders.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" defaultChecked className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                    <div className="p-4 bg-white rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-gray-900">Enable SMS Notifications</p>
                          <p className="text-xs text-gray-600 mt-1">Send SMS alerts for urgent matters and deadline reminders.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                    <div className="p-4 bg-white rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-semibold text-gray-900">Deadline Reminder Frequency</p>
                          <p className="text-xs text-gray-600 mt-1">Send reminder notifications before deadlines (in days).</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="number" defaultValue={3} className="input w-20 text-center font-semibold" />
                          <span className="text-gray-600">days before</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button className="btn-primary mt-4">Save Notification Settings</button>
                </div>
              </div>
            </div>
          )}

          {/* Student Registration Tab */}
          {selectedTab === 'registration' && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold">Student Registration Management</h3>
                  <p className="text-sm text-gray-600">
                    Manage new student registrations, approvals, and enrollment processes.
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="btn-secondary flex items-center space-x-2">
                    <Filter className="w-4 h-4" />
                    <span>Filter</span>
                  </button>
                  <button className="btn-secondary flex items-center space-x-2">
                    <Download className="w-4 h-4" />
                    <span>Export</span>
                  </button>
                  <button className="btn-primary flex items-center space-x-2">
                    <Plus className="w-4 h-4" />
                    <span>New Registration</span>
                  </button>
                </div>
              </div>

              {/* Registration Stats */}
              <div className="grid md:grid-cols-4 gap-4">
                {[
                  { label: 'Pending Approval', count: 24, color: 'from-amber-500 to-orange-500', icon: Clock },
                  { label: 'Approved', count: 156, color: 'from-green-500 to-emerald-600', icon: CheckCircle },
                  { label: 'Rejected', count: 8, color: 'from-red-500 to-rose-600', icon: XCircle },
                  { label: 'Total Applications', count: 188, color: 'from-blue-500 to-blue-600', icon: UserPlus },
                ].map((stat, idx) => {
                  const IconComponent = stat.icon
                  return (
                    <div key={idx} className="p-5 rounded-xl bg-gradient-to-br from-white to-gray-50 border border-gray-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-gray-600 mb-1">{stat.label}</p>
                          <p className="text-2xl font-bold text-gray-900">{stat.count}</p>
                        </div>
                        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Registration List */}
              <div className="space-y-3">
                {[
                  {
                    name: 'Aman Verma',
                    email: 'aman.verma@student.gjust.ac.in',
                    program: 'B.Tech CSE',
                    batch: 'CSE Batch 1',
                    status: 'pending',
                    submitted: 'Dec 10, 2024',
                    documents: 5,
                    priority: 'normal',
                  },
                  {
                    name: 'Kavya Sharma',
                    email: 'kavya.sharma@student.gjust.ac.in',
                    program: 'B.Tech CSE',
                    batch: 'CSE Batch 2',
                    status: 'approved',
                    submitted: 'Dec 8, 2024',
                    documents: 6,
                    priority: 'normal',
                  },
                  {
                    name: 'Vikram Singh',
                    email: 'vikram.singh@student.gjust.ac.in',
                    program: 'B.Tech CSE (AIML)',
                    batch: 'CSE (AIML) Batch 1',
                    status: 'pending',
                    submitted: 'Dec 12, 2024',
                    documents: 4,
                    priority: 'high',
                  },
                  {
                    name: 'Ananya Patel',
                    email: 'ananya.patel@student.gjust.ac.in',
                    program: 'B.Tech CSE',
                    batch: 'CSE IT',
                    status: 'rejected',
                    submitted: 'Dec 5, 2024',
                    documents: 3,
                    priority: 'normal',
                  },
                ].map((student, idx) => {
                  const statusColors = {
                    pending: 'bg-amber-100 text-amber-700 border-amber-200',
                    approved: 'bg-green-100 text-green-700 border-green-200',
                    rejected: 'bg-red-100 text-red-700 border-red-200',
                  }

                  return (
                    <div key={idx} className="p-5 border border-gray-200 rounded-xl hover:shadow-lg transition-all bg-gradient-to-br from-white to-gray-50">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-start space-x-4 flex-1">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                            {student.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 mb-1">{student.name}</h4>
                            <p className="text-xs text-gray-600 mb-2">{student.email}</p>
                            <div className="flex items-center space-x-3 text-xs text-gray-600">
                              <span className="flex items-center space-x-1">
                                <GraduationCap className="w-3 h-3" />
                                <span>{student.program}</span>
                              </span>
                              <span>•</span>
                              <span>{student.batch}</span>
                              <span>•</span>
                              <span className="flex items-center space-x-1">
                                <FileText className="w-3 h-3" />
                                <span>{student.documents} documents</span>
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {student.priority === 'high' && (
                            <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-700 font-medium">
                              High Priority
                            </span>
                          )}
                          <span className={`px-3 py-1 text-xs rounded-full border font-medium ${statusColors[student.status as keyof typeof statusColors]}`}>
                            {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                        <span className="text-xs text-gray-600">Submitted: {student.submitted}</span>
                        <div className="flex items-center space-x-2">
                          <button className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-1">
                            <Eye className="w-3 h-3" />
                            <span>View Details</span>
                          </button>
                          {student.status === 'pending' && (
                            <>
                              <button className="text-xs text-green-600 hover:text-green-700 font-medium flex items-center space-x-1">
                                <CheckCircle className="w-3 h-3" />
                                <span>Approve</span>
                              </button>
                              <button className="text-xs text-red-600 hover:text-red-700 font-medium flex items-center space-x-1">
                                <XCircle className="w-3 h-3" />
                                <span>Reject</span>
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Fee Management Tab */}
          {selectedTab === 'fees' && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold">Fee Management System</h3>
                  <p className="text-sm text-gray-600">
                    Manage tuition fees, hostel fees, and payment transactions across all students.
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="btn-secondary flex items-center space-x-2">
                    <Filter className="w-4 h-4" />
                    <span>Filter</span>
                  </button>
                  <button className="btn-secondary flex items-center space-x-2">
                    <Download className="w-4 h-4" />
                    <span>Export Report</span>
                  </button>
                </div>
              </div>

              {/* Fee Stats */}
              <div className="grid md:grid-cols-4 gap-4">
                {[
                  { label: 'Total Collected', amount: '₹12,45,000', color: 'from-green-500 to-emerald-600', icon: CheckCircle },
                  { label: 'Pending Payments', amount: '₹2,35,000', color: 'from-amber-500 to-orange-500', icon: Clock },
                  { label: 'Overdue', amount: '₹85,000', color: 'from-red-500 to-rose-600', icon: AlertTriangle },
                  { label: 'This Month', amount: '₹3,20,000', color: 'from-blue-500 to-blue-600', icon: TrendingUp },
                ].map((stat, idx) => {
                  const IconComponent = stat.icon
                  return (
                    <div key={idx} className="p-5 rounded-xl bg-gradient-to-br from-white to-gray-50 border border-gray-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-gray-600 mb-1">{stat.label}</p>
                          <p className="text-xl font-bold text-gray-900">{stat.amount}</p>
                        </div>
                        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Fee Categories */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Tuition Fees */}
                <div className="p-6 rounded-xl border border-gray-200 bg-gradient-to-br from-blue-50 via-white to-blue-50">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg text-gray-900">Tuition Fee Payments</h4>
                      <p className="text-xs text-gray-600">Semester and annual fee transactions</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {[
                      { student: 'Rohit Kumar', id: '2022CSE001', amount: '₹45,000', status: 'paid', date: 'Dec 10, 2024' },
                      { student: 'Rahul Sharma', id: '2022CSE015', amount: '₹45,000', status: 'pending', date: 'Due: Dec 20, 2024' },
                      { student: 'Nikita Patel', id: '2022CSE028', amount: '₹45,000', status: 'overdue', date: 'Overdue: 5 days' },
                    ].map((fee, idx) => (
                      <div key={idx} className="p-4 bg-white rounded-lg border border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <p className="font-semibold text-sm text-gray-900">{fee.student}</p>
                            <p className="text-xs text-gray-600">{fee.id}</p>
                          </div>
                          <span className={`px-3 py-1 text-xs rounded-full font-medium ${fee.status === 'paid' ? 'bg-green-100 text-green-700' :
                            fee.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                            {fee.status.charAt(0).toUpperCase() + fee.status.slice(1)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-gray-900">{fee.amount}</span>
                          <span className="text-xs text-gray-600">{fee.date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="btn-primary w-full mt-4">View All Tuition Fees</button>
                </div>

                {/* Hostel Fees */}
                <div className="p-6 rounded-xl border border-gray-200 bg-gradient-to-br from-purple-50 via-white to-purple-50">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg text-gray-900">Hostel Fee Payments</h4>
                      <p className="text-xs text-gray-600">Accommodation and mess fee transactions</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {[
                      { student: 'Maheshwari Reddy', id: '2022CSE042', amount: '₹25,000', status: 'paid', date: 'Dec 8, 2024' },
                      { student: 'Karan Mehta', id: '2022CSE055', amount: '₹25,000', status: 'pending', date: 'Due: Dec 18, 2024' },
                      { student: 'Priyanka Singh', id: '2022CSE068', amount: '₹25,000', status: 'paid', date: 'Dec 5, 2024' },
                    ].map((fee, idx) => (
                      <div key={idx} className="p-4 bg-white rounded-lg border border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <p className="font-semibold text-sm text-gray-900">{fee.student}</p>
                            <p className="text-xs text-gray-600">{fee.id}</p>
                          </div>
                          <span className={`px-3 py-1 text-xs rounded-full font-medium ${fee.status === 'paid' ? 'bg-green-100 text-green-700' :
                            fee.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                            {fee.status.charAt(0).toUpperCase() + fee.status.slice(1)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-gray-900">{fee.amount}</span>
                          <span className="text-xs text-gray-600">{fee.date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="btn-primary w-full mt-4">View All Hostel Fees</button>
                </div>
              </div>
            </div>
          )}

          {/* Semester Registration Tab */}
          {selectedTab === 'semester' && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold">Semester Registration</h3>
                  <p className="text-sm text-gray-600">
                    Manage semester enrollment, course selection, and registration approvals.
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="btn-secondary flex items-center space-x-2">
                    <Filter className="w-4 h-4" />
                    <span>Filter</span>
                  </button>
                  <button className="btn-secondary flex items-center space-x-2">
                    <Download className="w-4 h-4" />
                    <span>Export</span>
                  </button>
                </div>
              </div>

              {/* Registration Stats */}
              <div className="grid md:grid-cols-4 gap-4">
                {[
                  { label: 'Registered', count: 245, color: 'from-green-500 to-emerald-600', icon: CheckCircle },
                  { label: 'Pending', count: 32, color: 'from-amber-500 to-orange-500', icon: Clock },
                  { label: 'Incomplete', count: 18, color: 'from-red-500 to-rose-600', icon: AlertTriangle },
                  { label: 'Total Students', count: 295, color: 'from-blue-500 to-blue-600', icon: Users },
                ].map((stat, idx) => {
                  const IconComponent = stat.icon
                  return (
                    <div key={idx} className="p-5 rounded-xl bg-gradient-to-br from-white to-gray-50 border border-gray-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-gray-600 mb-1">{stat.label}</p>
                          <p className="text-2xl font-bold text-gray-900">{stat.count}</p>
                        </div>
                        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Registration List */}
              <div className="space-y-3">
                {[
                  {
                    name: 'Rohit Kumar',
                    id: '2022CSE001',
                    semester: '5th Semester',
                    batch: 'CSE Batch 1',
                    status: 'registered',
                    courses: 6,
                    date: 'Dec 10, 2024',
                  },
                  {
                    name: 'Rahul Sharma',
                    id: '2022CSE015',
                    semester: '5th Semester',
                    batch: 'CSE Batch 2',
                    status: 'pending',
                    courses: 4,
                    date: 'In Progress',
                  },
                  {
                    name: 'Nikita Patel',
                    id: '2022CSE028',
                    semester: '5th Semester',
                    batch: 'CSE (AIML) Batch 1',
                    status: 'incomplete',
                    courses: 3,
                    date: 'Dec 8, 2024',
                  },
                ].map((student, idx) => {
                  const statusColors = {
                    registered: 'bg-green-100 text-green-700 border-green-200',
                    pending: 'bg-amber-100 text-amber-700 border-amber-200',
                    incomplete: 'bg-red-100 text-red-700 border-red-200',
                  }

                  return (
                    <div key={idx} className="p-5 border border-gray-200 rounded-xl hover:shadow-lg transition-all bg-gradient-to-br from-white to-gray-50">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-start space-x-4 flex-1">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                            {student.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 mb-1">{student.name}</h4>
                            <p className="text-xs text-gray-600 mb-2">{student.id} • {student.batch}</p>
                            <div className="flex items-center space-x-3 text-xs text-gray-600">
                              <span className="flex items-center space-x-1">
                                <BookOpen className="w-3 h-3" />
                                <span>{student.semester}</span>
                              </span>
                              <span>•</span>
                              <span className="flex items-center space-x-1">
                                <FileText className="w-3 h-3" />
                                <span>{student.courses} courses selected</span>
                              </span>
                            </div>
                          </div>
                        </div>
                        <span className={`px-3 py-1 text-xs rounded-full border font-medium ${statusColors[student.status as keyof typeof statusColors]}`}>
                          {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                        <span className="text-xs text-gray-600">Last Updated: {student.date}</span>
                        <div className="flex items-center space-x-2">
                          <button className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-1">
                            <Eye className="w-3 h-3" />
                            <span>View Details</span>
                          </button>
                          {student.status === 'pending' && (
                            <button className="text-xs text-green-600 hover:text-green-700 font-medium flex items-center space-x-1">
                              <CheckCircle className="w-3 h-3" />
                              <span>Approve</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Document Management Tab */}
          {selectedTab === 'documents' && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold">Document Management</h3>
                  <p className="text-sm text-gray-600">
                    Track and manage student document submissions, verifications, and approvals.
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="btn-secondary flex items-center space-x-2">
                    <Search className="w-4 h-4" />
                    <span>Search</span>
                  </button>
                  <button className="btn-secondary flex items-center space-x-2">
                    <Download className="w-4 h-4" />
                    <span>Export</span>
                  </button>
                </div>
              </div>

              {/* Document Stats */}
              <div className="grid md:grid-cols-4 gap-4">
                {[
                  { label: 'Verified', count: 1245, color: 'from-green-500 to-emerald-600', icon: CheckCircle },
                  { label: 'Pending Review', count: 89, color: 'from-amber-500 to-orange-500', icon: Clock },
                  { label: 'Rejected', count: 12, color: 'from-red-500 to-rose-600', icon: XCircle },
                  { label: 'Total Documents', count: 1346, color: 'from-blue-500 to-blue-600', icon: FileCheck },
                ].map((stat, idx) => {
                  const IconComponent = stat.icon
                  return (
                    <div key={idx} className="p-5 rounded-xl bg-gradient-to-br from-white to-gray-50 border border-gray-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-gray-600 mb-1">{stat.label}</p>
                          <p className="text-2xl font-bold text-gray-900">{stat.count}</p>
                        </div>
                        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Document Categories */}
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { type: 'Academic Certificates', count: 245, pending: 12, color: 'from-blue-500 to-blue-600' },
                  { type: 'Identity Documents', count: 298, pending: 8, color: 'from-purple-500 to-purple-600' },
                  { type: 'Fee Receipts', count: 312, pending: 15, color: 'from-green-500 to-green-600' },
                ].map((category, idx) => (
                  <div key={idx} className="p-6 rounded-xl border border-gray-200 bg-gradient-to-br from-white to-gray-50">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-gray-900">{category.type}</h4>
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${category.color} flex items-center justify-center`}>
                        <FileCheck className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Total</span>
                        <span className="text-lg font-bold text-gray-900">{category.count}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Pending</span>
                        <span className="text-sm font-semibold text-amber-600">{category.pending}</span>
                      </div>
                    </div>
                    <button className="btn-secondary w-full mt-4 text-sm">View All</button>
                  </div>
                ))}
              </div>

              {/* Document List */}
              <div className="space-y-3">
                {[
                  {
                    student: 'Rohit Kumar',
                    id: '2022CSE001',
                    document: '10th Marksheet',
                    type: 'Academic Certificate',
                    status: 'verified',
                    submitted: 'Dec 10, 2024',
                    verifiedBy: 'Prof. Jyoti',
                  },
                  {
                    student: 'Rahul Sharma',
                    id: '2022CSE015',
                    document: 'Aadhar Card',
                    type: 'Identity Document',
                    status: 'pending',
                    submitted: 'Dec 12, 2024',
                    verifiedBy: '-',
                  },
                  {
                    student: 'Nikita Patel',
                    id: '2022CSE028',
                    document: 'Fee Receipt - Semester 5',
                    type: 'Fee Receipt',
                    status: 'verified',
                    submitted: 'Dec 8, 2024',
                    verifiedBy: 'Dr. Ritu Makani',
                  },
                ].map((doc, idx) => {
                  const statusColors = {
                    verified: 'bg-green-100 text-green-700',
                    pending: 'bg-amber-100 text-amber-700',
                    rejected: 'bg-red-100 text-red-700',
                  }

                  return (
                    <div key={idx} className="p-5 border border-gray-200 rounded-xl hover:shadow-lg transition-all bg-gradient-to-br from-white to-gray-50">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-start space-x-4 flex-1">
                          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <FileText className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 mb-1">{doc.document}</h4>
                            <p className="text-xs text-gray-600 mb-2">{doc.student} ({doc.id})</p>
                            <div className="flex items-center space-x-3 text-xs text-gray-600">
                              <span className="px-2 py-0.5 bg-gray-100 rounded text-gray-700">{doc.type}</span>
                              <span>•</span>
                              <span>Submitted: {doc.submitted}</span>
                              <span>•</span>
                              <span>Verified by: {doc.verifiedBy}</span>
                            </div>
                          </div>
                        </div>
                        <span className={`px-3 py-1 text-xs rounded-full font-medium ${statusColors[doc.status as keyof typeof statusColors]}`}>
                          {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                        <button className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-1">
                          <Eye className="w-3 h-3" />
                          <span>View Document</span>
                        </button>
                        {doc.status === 'pending' && (
                          <div className="flex items-center space-x-2">
                            <button className="text-xs text-green-600 hover:text-green-700 font-medium flex items-center space-x-1">
                              <CheckCircle className="w-3 h-3" />
                              <span>Verify</span>
                            </button>
                            <button className="text-xs text-red-600 hover:text-red-700 font-medium flex items-center space-x-1">
                              <XCircle className="w-3 h-3" />
                              <span>Reject</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Detail Change Requests Tab */}
          {selectedTab === 'details' && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold">Detail Change Requests</h3>
                  <p className="text-sm text-gray-600">
                    Manage student requests for updating personal information, contact details, and academic records.
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="btn-secondary flex items-center space-x-2">
                    <Filter className="w-4 h-4" />
                    <span>Filter</span>
                  </button>
                  <button className="btn-secondary flex items-center space-x-2">
                    <Download className="w-4 h-4" />
                    <span>Export</span>
                  </button>
                </div>
              </div>

              {/* Request Stats */}
              <div className="grid md:grid-cols-4 gap-4">
                {[
                  { label: 'Pending Approval', count: 34, color: 'from-amber-500 to-orange-500', icon: Clock },
                  { label: 'Approved', count: 128, color: 'from-green-500 to-emerald-600', icon: CheckCircle },
                  { label: 'Rejected', count: 9, color: 'from-red-500 to-rose-600', icon: XCircle },
                  { label: 'Total Requests', count: 171, color: 'from-blue-500 to-blue-600', icon: UserCog },
                ].map((stat, idx) => {
                  const IconComponent = stat.icon
                  return (
                    <div key={idx} className="p-5 rounded-xl bg-gradient-to-br from-white to-gray-50 border border-gray-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-gray-600 mb-1">{stat.label}</p>
                          <p className="text-2xl font-bold text-gray-900">{stat.count}</p>
                        </div>
                        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Change Request List */}
              <div className="space-y-3">
                {[
                  {
                    student: 'Rohit Kumar',
                    id: '2022CSE001',
                    changeType: 'Contact Number',
                    oldValue: '+91 98765 43210',
                    newValue: '+91 98765 43211',
                    status: 'pending',
                    requested: 'Dec 12, 2024',
                    reason: 'Updated phone number',
                  },
                  {
                    student: 'Rahul Sharma',
                    id: '2022CSE015',
                    changeType: 'Email Address',
                    oldValue: 'rahul.sharma@email.com',
                    newValue: 'rahul.sharma.new@email.com',
                    status: 'approved',
                    requested: 'Dec 10, 2024',
                    reason: 'Changed email provider',
                  },
                  {
                    student: 'Nikita Patel',
                    id: '2022CSE028',
                    changeType: 'Address',
                    oldValue: 'Old Address, City',
                    newValue: 'New Address, City',
                    status: 'pending',
                    requested: 'Dec 13, 2024',
                    reason: 'Moved to new location',
                  },
                ].map((request, idx) => {
                  const statusColors = {
                    pending: 'bg-amber-100 text-amber-700 border-amber-200',
                    approved: 'bg-green-100 text-green-700 border-green-200',
                    rejected: 'bg-red-100 text-red-700 border-red-200',
                  }

                  return (
                    <div key={idx} className="p-5 border border-gray-200 rounded-xl hover:shadow-lg transition-all bg-gradient-to-br from-white to-gray-50">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-start space-x-4 flex-1">
                          <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-600 rounded-full flex items-center justify-center text-white font-bold">
                            {request.student.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 mb-1">{request.student}</h4>
                            <p className="text-xs text-gray-600 mb-2">{request.id}</p>
                            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 mb-2">
                              <p className="text-xs font-semibold text-gray-700 mb-1">Change Type: {request.changeType}</p>
                              <div className="space-y-1 text-xs">
                                <div className="flex items-center space-x-2">
                                  <span className="text-gray-500">Old:</span>
                                  <span className="text-gray-700 line-through">{request.oldValue}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <span className="text-gray-500">New:</span>
                                  <span className="text-green-700 font-medium">{request.newValue}</span>
                                </div>
                              </div>
                              <p className="text-xs text-gray-600 mt-2">Reason: {request.reason}</p>
                            </div>
                          </div>
                        </div>
                        <span className={`px-3 py-1 text-xs rounded-full border font-medium ${statusColors[request.status as keyof typeof statusColors]}`}>
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                        <span className="text-xs text-gray-600">Requested: {request.requested}</span>
                        {request.status === 'pending' && (
                          <div className="flex items-center space-x-2">
                            <button className="text-xs text-green-600 hover:text-green-700 font-medium flex items-center space-x-1">
                              <CheckCircle className="w-3 h-3" />
                              <span>Approve</span>
                            </button>
                            <button className="text-xs text-red-600 hover:text-red-700 font-medium flex items-center space-x-1">
                              <XCircle className="w-3 h-3" />
                              <span>Reject</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Course Registration Tab */}
          {selectedTab === 'course' && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold">Course Registration</h3>
                  <p className="text-sm text-gray-600">
                    Manage elective course selections, approvals, and capacity management.
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="btn-secondary flex items-center space-x-2">
                    <Filter className="w-4 h-4" />
                    <span>Filter</span>
                  </button>
                  <button className="btn-secondary flex items-center space-x-2">
                    <Download className="w-4 h-4" />
                    <span>Export</span>
                  </button>
                </div>
              </div>

              {/* Course Stats */}
              <div className="grid md:grid-cols-4 gap-4">
                {[
                  { label: 'Total Courses', count: 24, color: 'from-blue-500 to-blue-600', icon: GraduationCap },
                  { label: 'Enrolled Students', count: 456, color: 'from-green-500 to-emerald-600', icon: Users },
                  { label: 'Pending Approvals', count: 23, color: 'from-amber-500 to-orange-500', icon: Clock },
                  { label: 'Full Capacity', count: 3, color: 'from-red-500 to-rose-600', icon: AlertTriangle },
                ].map((stat, idx) => {
                  const IconComponent = stat.icon
                  return (
                    <div key={idx} className="p-5 rounded-xl bg-gradient-to-br from-white to-gray-50 border border-gray-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-gray-600 mb-1">{stat.label}</p>
                          <p className="text-2xl font-bold text-gray-900">{stat.count}</p>
                        </div>
                        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Course List */}
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  {
                    code: 'CS501',
                    name: 'Machine Learning',
                    instructor: 'Prof. Yogesh Chaba',
                    enrolled: 45,
                    capacity: 50,
                    status: 'available',
                  },
                  {
                    code: 'CS502',
                    name: 'Cloud Computing',
                    instructor: 'Prof. Rishi Pal Singh',
                    enrolled: 50,
                    capacity: 50,
                    status: 'full',
                  },
                  {
                    code: 'CS503',
                    name: 'Cybersecurity',
                    instructor: 'Prof. Om Prakash Sangwan',
                    enrolled: 38,
                    capacity: 45,
                    status: 'available',
                  },
                  {
                    code: 'CS504',
                    name: 'Data Science',
                    instructor: 'Prof. Jyoti',
                    enrolled: 42,
                    capacity: 50,
                    status: 'available',
                  },
                ].map((course, idx) => (
                  <div key={idx} className="p-5 border border-gray-200 rounded-xl hover:shadow-lg transition-all bg-gradient-to-br from-white to-gray-50">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-semibold text-gray-900">{course.code}</h4>
                          {course.status === 'full' && (
                            <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                              Full
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-700 mb-2">{course.name}</p>
                        <p className="text-xs text-gray-600 mb-3">{course.instructor}</p>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs text-gray-600">Enrollment</p>
                            <p className="text-sm font-semibold text-gray-900">
                              {course.enrolled}/{course.capacity} students
                            </p>
                          </div>
                          <div className="w-20">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${course.status === 'full' ? 'bg-red-500' : 'bg-green-500'
                                  }`}
                                style={{ width: `${(course.enrolled / course.capacity) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <button className="btn-secondary w-full mt-3 text-sm">View Details</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Exam Registration Tab */}
          {selectedTab === 'exam' && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold">Exam Registration</h3>
                  <p className="text-sm text-gray-600">
                    Manage examination registrations, hall tickets, and eligibility verification.
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="btn-secondary flex items-center space-x-2">
                    <Filter className="w-4 h-4" />
                    <span>Filter</span>
                  </button>
                  <button className="btn-secondary flex items-center space-x-2">
                    <Download className="w-4 h-4" />
                    <span>Export</span>
                  </button>
                </div>
              </div>

              {/* Exam Stats */}
              <div className="grid md:grid-cols-4 gap-4">
                {[
                  { label: 'Registered', count: 278, color: 'from-green-500 to-emerald-600', icon: CheckCircle },
                  { label: 'Pending', count: 17, color: 'from-amber-500 to-orange-500', icon: Clock },
                  { label: 'Not Eligible', count: 12, color: 'from-red-500 to-rose-600', icon: XCircle },
                  { label: 'Total Students', count: 307, color: 'from-blue-500 to-blue-600', icon: ClipboardCheck },
                ].map((stat, idx) => {
                  const IconComponent = stat.icon
                  return (
                    <div key={idx} className="p-5 rounded-xl bg-gradient-to-br from-white to-gray-50 border border-gray-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-gray-600 mb-1">{stat.label}</p>
                          <p className="text-2xl font-bold text-gray-900">{stat.count}</p>
                        </div>
                        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Exam List */}
              <div className="space-y-3">
                {[
                  {
                    exam: 'End Semester Examination - Dec 2024',
                    semester: '5th Semester',
                    date: 'Dec 20 - Dec 30, 2024',
                    registered: 278,
                    eligible: 290,
                    status: 'open',
                  },
                  {
                    exam: 'Mid Semester Examination - Nov 2024',
                    semester: '5th Semester',
                    date: 'Nov 15 - Nov 20, 2024',
                    registered: 295,
                    eligible: 295,
                    status: 'closed',
                  },
                ].map((exam, idx) => (
                  <div key={idx} className="p-6 border border-gray-200 rounded-xl hover:shadow-lg transition-all bg-gradient-to-br from-white to-gray-50">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg text-gray-900 mb-1">{exam.exam}</h4>
                        <p className="text-sm text-gray-600 mb-2">{exam.semester}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-600">
                          <span className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3" />
                            <span>{exam.date}</span>
                          </span>
                          <span>•</span>
                          <span>Registered: {exam.registered}/{exam.eligible}</span>
                        </div>
                      </div>
                      <span className={`px-3 py-1 text-xs rounded-full font-medium ${exam.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                        {exam.status === 'open' ? 'Registration Open' : 'Registration Closed'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${(exam.registered / exam.eligible) * 100}%` }}
                        ></div>
                      </div>
                      <span className="ml-3 text-xs text-gray-600">
                        {Math.round((exam.registered / exam.eligible) * 100)}%
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 mt-4">
                      <button className="btn-primary text-sm px-4 py-2">View Registrations</button>
                      <button className="btn-secondary text-sm px-4 py-2">Generate Hall Tickets</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
