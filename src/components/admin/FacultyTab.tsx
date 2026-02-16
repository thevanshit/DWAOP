'use client'

import { useState } from 'react'
import {
  Users,
  Search,
  Mail,
  Phone,
  BookOpen,
  Calendar,
  Award,
  ClipboardCheck,
  FileText,
  MoreVertical,
  Plus,
  ChevronRight,
  Clock,
  AlertTriangle,
  CheckCircle,
  GraduationCap,
  Layers
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface FacultyMember {
  id: string
  name: string
  role: string
  avatar: string
  email: string
  phone: string
  specialization: string
  experience: number
  workload: number
  pendingTasks: number
  completedTasks: number
  batches: string[]
  subjects: string[]
  committees: string[]
  attendanceSessions: number
  marksSubmitted: number
  marksPending: number
  status: 'active' | 'on_leave' | 'inactive'
}

const MOCK_FACULTY: FacultyMember[] = [
  { id: '1', name: 'Dr. Amit Kumar', role: 'HOD', avatar: 'AK', email: 'amit.kumar@gjust.edu.in', phone: '+91 98765 43210', specialization: 'Machine Learning', experience: 15, workload: 92, pendingTasks: 3, completedTasks: 15, batches: ['CSE-AIML', 'CSE', 'IT'], subjects: ['AI/ML', 'Data Science'], committees: ['Academic Board', 'NBA Cell'], attendanceSessions: 24, marksSubmitted: 45, marksPending: 12, status: 'active' },
  { id: '2', name: 'Dr. Vineet Jain', role: 'Assistant Professor', avatar: 'VJ', email: 'vineet.jain@gjust.edu.in', phone: '+91 98765 43211', specialization: 'Operating Systems', experience: 8, workload: 85, pendingTasks: 5, completedTasks: 12, batches: ['CSE-AIML', 'CSE'], subjects: ['Operating Systems', 'Computer Networks'], committees: ['Exam Cell'], attendanceSessions: 18, marksSubmitted: 38, marksPending: 8, status: 'active' },
  { id: '3', name: 'Dr. Priya Sharma', role: 'Assistant Professor', avatar: 'PS', email: 'priya.sharma@gjust.edu.in', phone: '+91 98765 43212', specialization: 'Database Systems', experience: 6, workload: 78, pendingTasks: 2, completedTasks: 10, batches: ['CSE', 'IT'], subjects: ['Database Systems', 'DBMS Lab'], committees: ['Placement Cell'], attendanceSessions: 15, marksSubmitted: 32, marksPending: 5, status: 'active' },
  { id: '4', name: 'Dr. Suresh Kumar', role: 'Professor', avatar: 'SK', email: 'suresh.kumar@gjust.edu.in', phone: '+91 98765 43213', specialization: 'Data Structures', experience: 18, workload: 65, pendingTasks: 1, completedTasks: 8, batches: ['CSE-AIML'], subjects: ['Data Structures', 'Algorithms'], committees: ['Research Committee'], attendanceSessions: 12, marksSubmitted: 28, marksPending: 3, status: 'active' },
  { id: '5', name: 'Dr. Rahul Gupta', role: 'Assistant Professor', avatar: 'RG', email: 'rahul.gupta@gjust.edu.in', phone: '+91 98765 43214', specialization: 'Web Technologies', experience: 5, workload: 72, pendingTasks: 3, completedTasks: 9, batches: ['IT', 'CSE'], subjects: ['Web Technologies', 'Python Lab'], committees: ['Sports Committee'], attendanceSessions: 14, marksSubmitted: 30, marksPending: 6, status: 'active' },
  { id: '6', name: 'Dr. Rameshwar Rao', role: 'Associate Professor', avatar: 'RR', email: 'rameshwar@gjust.edu.in', phone: '+91 98765 43215', specialization: 'Computer Networks', experience: 12, workload: 70, pendingTasks: 2, completedTasks: 11, batches: ['CSE-AIML', 'CSE'], subjects: ['Computer Networks', 'CN Lab'], committees: ['Library Committee'], attendanceSessions: 16, marksSubmitted: 35, marksPending: 4, status: 'active' },
]

export default function FacultyTab() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRole, setSelectedRole] = useState('All')

  const ROLES = ['All', 'HOD', 'Professor', 'Associate Professor', 'Assistant Professor']

  const filteredFaculty = MOCK_FACULTY.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         f.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = selectedRole === 'All' || f.role === selectedRole
    return matchesSearch && matchesRole
  })

  const stats = {
    total: MOCK_FACULTY.length,
    active: MOCK_FACULTY.filter(f => f.status === 'active').length,
    avgWorkload: Math.round(MOCK_FACULTY.reduce((sum, f) => sum + f.workload, 0) / MOCK_FACULTY.length),
    totalPendingTasks: MOCK_FACULTY.reduce((sum, f) => sum + f.pendingTasks, 0),
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Faculty Directory</h2>
          <p className="text-sm text-slate-500 mt-1">Manage department faculty and their responsibilities</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 shadow-lg shadow-blue-600/20">
          <Plus className="w-4 h-4" />
          Add Faculty
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
              <p className="text-xs text-slate-500">Total Faculty</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">{stats.active}</p>
              <p className="text-xs text-slate-500">Active</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
              <Layers className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{stats.avgWorkload}%</p>
              <p className="text-xs text-slate-500">Avg Workload</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-amber-600">{stats.totalPendingTasks}</p>
              <p className="text-xs text-slate-500">Pending Tasks</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search faculty by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-200 pl-11 pr-4 py-2.5 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>
        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          className="h-11 px-4 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-sm"
        >
          {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>

      {/* Faculty Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFaculty.map(faculty => (
          <FacultyCard key={faculty.id} faculty={faculty} />
        ))}
      </div>
    </div>
  )
}

function FacultyCard({ faculty }: { faculty: FacultyMember }) {
  const workloadColor = faculty.workload >= 80 ? 'text-red-600' : 
                       faculty.workload >= 60 ? 'text-amber-600' : 'text-green-600'

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white font-bold">
            {faculty.avatar}
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">{faculty.name}</p>
            <p className="text-xs text-slate-500">{faculty.role}</p>
          </div>
        </div>
        <StatusIndicator status={faculty.status} />
      </div>

      {/* Specialization */}
      <div className="flex items-center gap-2 mb-4">
        <BookOpen className="w-4 h-4 text-slate-400" />
        <span className="text-xs text-slate-600">{faculty.specialization}</span>
        <span className="text-xs text-slate-400">•</span>
        <span className="text-xs text-slate-400">{faculty.experience} years exp.</span>
      </div>

      {/* Workload Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-medium text-slate-500">Workload</span>
          <span className={cn("text-xs font-bold", workloadColor)}>{faculty.workload}%</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2">
          <div 
            className={cn("h-2 rounded-full", workloadColor === 'text-red-600' ? 'bg-red-500' : workloadColor === 'text-amber-600' ? 'bg-amber-500' : 'bg-green-500')} 
            style={{ width: `${faculty.workload}%` }} 
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="bg-slate-50 rounded-lg p-2 text-center">
          <p className="text-lg font-bold text-slate-900">{faculty.pendingTasks}</p>
          <p className="text-[9px] text-slate-500">Pending</p>
        </div>
        <div className="bg-slate-50 rounded-lg p-2 text-center">
          <p className="text-lg font-bold text-green-600">{faculty.completedTasks}</p>
          <p className="text-[9px] text-slate-500">Done</p>
        </div>
        <div className="bg-slate-50 rounded-lg p-2 text-center">
          <p className="text-lg font-bold text-blue-600">{faculty.batches.length}</p>
          <p className="text-[9px] text-slate-500">Batches</p>
        </div>
      </div>

      {/* Subjects */}
      <div className="mb-4">
        <p className="text-[10px] font-medium text-slate-500 mb-1.5 uppercase">Subjects</p>
        <div className="flex flex-wrap gap-1">
          {faculty.subjects.map(subject => (
            <span key={subject} className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded text-xs font-medium">
              {subject}
            </span>
          ))}
        </div>
      </div>

      {/* Committees */}
      <div className="mb-4">
        <p className="text-[10px] font-medium text-slate-500 mb-1.5 uppercase">Committees</p>
        <div className="flex flex-wrap gap-1">
          {faculty.committees.map(committee => (
            <span key={committee} className="px-2 py-0.5 bg-amber-50 text-amber-700 rounded text-xs font-medium">
              {committee}
            </span>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-4 border-t border-slate-100">
        <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-600 text-white rounded-xl text-xs font-medium hover:bg-blue-700">
          <Mail className="w-3.5 h-3.5" />
          Email
        </button>
        <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-medium hover:bg-slate-200">
          <Phone className="w-3.5 h-3.5" />
          Call
        </button>
        <button className="p-2 hover:bg-slate-100 rounded-xl text-slate-400">
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

function StatusIndicator({ status }: { status: string }) {
  const styles = {
    active: { bg: 'bg-green-500', text: 'Active' },
    on_leave: { bg: 'bg-amber-500', text: 'On Leave' },
    inactive: { bg: 'bg-slate-400', text: 'Inactive' },
  }
  
  const style = styles[status as keyof typeof styles] || styles.active
  
  return (
    <div className="flex items-center gap-1.5">
      <span className={cn("w-2 h-2 rounded-full", style.bg)} />
      <span className="text-[10px] font-medium text-slate-500">{style.text}</span>
    </div>
  )
}
