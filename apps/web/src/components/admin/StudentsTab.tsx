'use client'

import { useState } from 'react'
import {
  Users,
  Search,
  Filter,
  ChevronRight,
  Calendar,
  Award,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  MoreVertical,
  FileText,
  Download,
  Eye,
  Mail,
  Phone,
  GraduationCap,
  BookOpen,
  TrendingUp,
  TrendingDown
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface Student {
  id: string
  name: string
  rollNumber: string
  email: string
  phone: string
  batch: string
  semester: number
  attendance: number
  cgpa: number
  status: 'active' | 'at_risk' | 'inactive'
  riskLevel?: 'low' | 'medium' | 'high'
  pendingAssignments: number
  lastActive?: string
}

interface StudentsTabProps {}

const MOCK_STUDENTS: Student[] = [
  { id: '1', name: 'Rahul Sharma', rollNumber: 'CS-AIML-045', email: 'rahul@example.com', phone: '+91 98765 43210', batch: 'CSE-AIML', semester: 4, attendance: 58, cgpa: 7.2, status: 'at_risk', riskLevel: 'high', pendingAssignments: 3, lastActive: '2 days ago' },
  { id: '2', name: 'Priya Singh', rollNumber: 'CS-023', email: 'priya@example.com', phone: '+91 98765 43211', batch: 'CSE', semester: 4, attendance: 62, cgpa: 8.1, status: 'at_risk', riskLevel: 'high', pendingAssignments: 2, lastActive: '1 day ago' },
  { id: '3', name: 'Amit Kumar', rollNumber: 'IT-067', email: 'amit@example.com', phone: '+91 98765 43212', batch: 'IT', semester: 4, attendance: 78, cgpa: 7.8, status: 'active', pendingAssignments: 1, lastActive: 'Today' },
  { id: '4', name: 'Sneha Gupta', rollNumber: 'CS-AIML-089', email: 'sneha@example.com', phone: '+91 98765 43213', batch: 'CSE-AIML', semester: 4, attendance: 85, cgpa: 8.9, status: 'active', pendingAssignments: 2, lastActive: 'Today' },
  { id: '5', name: 'Vikram Patel', rollNumber: 'CS-034', email: 'vikram@example.com', phone: '+91 98765 43214', batch: 'CSE', semester: 4, attendance: 70, cgpa: 7.5, status: 'at_risk', riskLevel: 'medium', pendingAssignments: 1, lastActive: 'Today' },
  { id: '6', name: 'Ananya Reddy', rollNumber: 'IT-012', email: 'ananya@example.com', phone: '+91 98765 43215', batch: 'IT', semester: 4, attendance: 92, cgpa: 9.1, status: 'active', pendingAssignments: 0, lastActive: 'Today' },
  { id: '7', name: 'Raj Malhotra', rollNumber: 'CS-056', email: 'raj@example.com', phone: '+91 98765 43216', batch: 'CSE', semester: 4, attendance: 88, cgpa: 8.4, status: 'active', pendingAssignments: 1, lastActive: 'Today' },
  { id: '8', name: 'Kavya Nair', rollNumber: 'CS-AIML-078', email: 'kavya@example.com', phone: '+91 98765 43217', batch: 'CSE-AIML', semester: 4, attendance: 95, cgpa: 9.3, status: 'active', pendingAssignments: 0, lastActive: 'Today' },
]

const BATCHES = ['All', 'CSE-AIML', 'CSE', 'IT']
const SEMESTERS = ['All', '4', '6', '8']

export default function StudentsTab({}: StudentsTabProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedBatch, setSelectedBatch] = useState('All')
  const [selectedSemester, setSelectedSemester] = useState('All')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')

  const filteredStudents = MOCK_STUDENTS.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         s.rollNumber.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesBatch = selectedBatch === 'All' || s.batch === selectedBatch
    const matchesSemester = selectedSemester === 'All' || s.semester === parseInt(selectedSemester)
    return matchesSearch && matchesBatch && matchesSemester
  })

  const stats = {
    total: MOCK_STUDENTS.length,
    atRisk: MOCK_STUDENTS.filter(s => s.status === 'at_risk').length,
    active: MOCK_STUDENTS.filter(s => s.status === 'active').length,
    avgAttendance: Math.round(MOCK_STUDENTS.reduce((sum, s) => sum + s.attendance, 0) / MOCK_STUDENTS.length),
    avgCGPA: (MOCK_STUDENTS.reduce((sum, s) => sum + s.cgpa, 0) / MOCK_STUDENTS.length).toFixed(1),
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Student Management</h2>
          <p className="text-sm text-slate-500 mt-1">View and manage all students in the department</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-50 shadow-sm">
          <Download className="w-4 h-4" />
          Export Data
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
              <p className="text-xs text-slate-500">Total Students</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">{stats.atRisk}</p>
              <p className="text-xs text-slate-500">At Risk</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">{stats.active}</p>
              <p className="text-xs text-slate-500">Active</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{stats.avgAttendance}%</p>
              <p className="text-xs text-slate-500">Avg Attendance</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <Award className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{stats.avgCGPA}</p>
              <p className="text-xs text-slate-500">Avg CGPA</p>
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
            placeholder="Search by name or roll number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-200 pl-11 pr-4 py-2.5 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>
        <select
          value={selectedBatch}
          onChange={(e) => setSelectedBatch(e.target.value)}
          className="h-11 px-4 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-sm"
        >
          {BATCHES.map(b => <option key={b} value={b}>{b}</option>)}
        </select>
        <select
          value={selectedSemester}
          onChange={(e) => setSelectedSemester(e.target.value)}
          className="h-11 px-4 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-sm"
        >
          {SEMESTERS.map(s => <option key={s} value={s}>Semester {s}</option>)}
        </select>
      </div>

      {/* Student Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Student</th>
              <th className="px-6 py-4 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Batch</th>
              <th className="px-6 py-4 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Attendance</th>
              <th className="px-6 py-4 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">CGPA</th>
              <th className="px-6 py-4 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Pending</th>
              <th className="px-6 py-4 text-[10px] font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredStudents.map(student => (
              <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-blue-50 border border-slate-200 flex items-center justify-center text-blue-600 font-bold text-sm">
                      {student.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{student.name}</p>
                      <p className="text-xs text-slate-500">{student.rollNumber}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-medium">
                    {student.batch}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "text-sm font-semibold",
                      student.attendance >= 75 ? 'text-green-600' :
                      student.attendance >= 65 ? 'text-amber-600' : 'text-red-600'
                    )}>
                      {student.attendance}%
                    </span>
                    {student.attendance < 75 && (
                      <TrendingDown className="w-3.5 h-3.5 text-red-500" />
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-semibold text-slate-900">{student.cgpa}</span>
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={student.status} riskLevel={student.riskLevel} />
                </td>
                <td className="px-6 py-4">
                  {student.pendingAssignments > 0 ? (
                    <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium">
                      {student.pendingAssignments} pending
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400">None</span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400">
                      <Mail className="w-4 h-4" />
                    </button>
                    <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function StatusBadge({ status, riskLevel }: { status: string; riskLevel?: string }) {
  const styles = {
    active: { bg: 'bg-green-100', text: 'text-green-700', label: 'Active' },
    at_risk: { 
      bg: riskLevel === 'high' ? 'bg-red-100' : 'bg-amber-100', 
      text: riskLevel === 'high' ? 'text-red-700' : 'text-amber-700', 
      label: 'At Risk' 
    },
    inactive: { bg: 'bg-slate-100', text: 'text-slate-600', label: 'Inactive' },
  }
  
  const style = styles[status as keyof typeof styles] || styles.active
  
  return (
    <span className={cn("px-2.5 py-1 rounded-lg text-xs font-medium", style.bg, style.text)}>
      {style.label}
    </span>
  )
}
