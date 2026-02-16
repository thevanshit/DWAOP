'use client'

import { useState } from 'react'
import {
  Users,
  BookOpen,
  Clock,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Activity,
  ChevronRight,
  Calendar,
  Award,
  ClipboardCheck,
  FileText,
  Layers
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface FacultyMember {
  id: string
  name: string
  role: string
  avatar: string
  email: string
  specialization: string
  workload: number
  pendingTasks: number
  completedTasks: number
  delayedTasks: number
  batches: string[]
  subjects: string[]
  committees: string[]
  attendanceSessions: number
  marksSubmitted: number
  marksPending: number
  avgClassRating?: number
}

interface FacultyWorkloadPanelProps {
  faculty?: FacultyMember[]
}

const MOCK_FACULTY: FacultyMember[] = [
  {
    id: '1',
    name: 'Dr. Amit Kumar',
    role: 'HOD',
    avatar: 'AK',
    email: 'amit.kumar@gjust.edu.in',
    specialization: 'Machine Learning',
    workload: 92,
    pendingTasks: 3,
    completedTasks: 15,
    delayedTasks: 1,
    batches: ['CSE-AIML', 'CSE', 'IT'],
    subjects: ['AI/ML', 'Data Science'],
    committees: ['Academic Board', 'NBA Cell'],
    attendanceSessions: 24,
    marksSubmitted: 45,
    marksPending: 12,
    avgClassRating: 4.5,
  },
  {
    id: '2',
    name: 'Dr. Vineet Jain',
    role: 'Assistant Professor',
    avatar: 'VJ',
    email: 'vineet.jain@gjust.edu.in',
    specialization: 'Operating Systems',
    workload: 85,
    pendingTasks: 5,
    completedTasks: 12,
    delayedTasks: 2,
    batches: ['CSE-AIML', 'CSE'],
    subjects: ['Operating Systems', 'Computer Networks'],
    committees: ['Exam Cell'],
    attendanceSessions: 18,
    marksSubmitted: 38,
    marksPending: 8,
    avgClassRating: 4.2,
  },
  {
    id: '3',
    name: 'Dr. Priya Sharma',
    role: 'Assistant Professor',
    avatar: 'PS',
    email: 'priya.sharma@gjust.edu.in',
    specialization: 'Database Systems',
    workload: 78,
    pendingTasks: 2,
    completedTasks: 10,
    delayedTasks: 0,
    batches: ['CSE', 'IT'],
    subjects: ['Database Systems', 'DBMS Lab'],
    committees: ['Placement Cell'],
    attendanceSessions: 15,
    marksSubmitted: 32,
    marksPending: 5,
    avgClassRating: 4.3,
  },
  {
    id: '4',
    name: 'Dr. Suresh Kumar',
    role: 'Professor',
    avatar: 'SK',
    email: 'suresh.kumar@gjust.edu.in',
    specialization: 'Data Structures',
    workload: 65,
    pendingTasks: 1,
    completedTasks: 8,
    delayedTasks: 0,
    batches: ['CSE-AIML'],
    subjects: ['Data Structures', 'Algorithms'],
    committees: ['Research Committee'],
    attendanceSessions: 12,
    marksSubmitted: 28,
    marksPending: 3,
    avgClassRating: 4.6,
  },
  {
    id: '5',
    name: 'Dr. Rahul Gupta',
    role: 'Assistant Professor',
    avatar: 'RG',
    email: 'rahul.gupta@gjust.edu.in',
    specialization: 'Web Technologies',
    workload: 72,
    pendingTasks: 3,
    completedTasks: 9,
    delayedTasks: 1,
    batches: ['IT', 'CSE'],
    subjects: ['Web Technologies', 'Python Lab'],
    committees: ['Sports Committee'],
    attendanceSessions: 14,
    marksSubmitted: 30,
    marksPending: 6,
    avgClassRating: 4.0,
  },
]

export default function FacultyWorkloadPanel({ faculty = MOCK_FACULTY }: FacultyWorkloadPanelProps) {
  const [selectedFaculty, setSelectedFaculty] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<'workload' | 'pending' | 'name'>('workload')

  const sortedFaculty = [...faculty].sort((a, b) => {
    if (sortBy === 'workload') return b.workload - a.workload
    if (sortBy === 'pending') return b.pendingTasks - a.pendingTasks
    return a.name.localeCompare(b.name)
  })

  const totalPendingTasks = faculty.reduce((sum, f) => sum + f.pendingTasks, 0)
  const totalDelayedTasks = faculty.reduce((sum, f) => sum + f.delayedTasks, 0)
  const avgWorkload = Math.round(faculty.reduce((sum, f) => sum + f.workload, 0) / faculty.length)

  const selectedMember = faculty.find(f => f.id === selectedFaculty)

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-200 bg-slate-50/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Faculty Workload</h3>
              <p className="text-xs text-slate-500">Department coordination overview</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-4 gap-px bg-slate-200">
        <div className="bg-slate-50 p-4 text-center">
          <p className="text-2xl font-bold text-slate-900">{faculty.length}</p>
          <p className="text-xs font-medium text-slate-500">Faculty</p>
        </div>
        <div className="bg-slate-50 p-4 text-center">
          <p className="text-2xl font-bold text-amber-600">{totalPendingTasks}</p>
          <p className="text-xs font-medium text-slate-500">Pending Tasks</p>
        </div>
        <div className="bg-slate-50 p-4 text-center">
          <p className="text-2xl font-bold text-red-600">{totalDelayedTasks}</p>
          <p className="text-xs font-medium text-slate-500">Delayed</p>
        </div>
        <div className="bg-slate-50 p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">{avgWorkload}%</p>
          <p className="text-xs font-medium text-slate-500">Avg Load</p>
        </div>
      </div>

      {/* Sort Options */}
      <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
        <span className="text-xs font-medium text-slate-500">Sort by:</span>
        <div className="flex gap-2">
          {(['workload', 'pending', 'name'] as const).map(sort => (
            <button
              key={sort}
              onClick={() => setSortBy(sort)}
              className={cn(
                "px-2.5 py-1 rounded-lg text-[10px] font-medium transition-colors",
                sortBy === sort 
                  ? "bg-blue-600 text-white" 
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              )}
            >
              {sort === 'workload' ? 'Workload' : sort === 'pending' ? 'Pending' : 'Name'}
            </button>
          ))}
        </div>
      </div>

      {/* Faculty List */}
      <div className="divide-y divide-slate-100 max-h-[400px] overflow-y-auto">
        {sortedFaculty.map(member => (
          <FacultyRow 
            key={member.id} 
            member={member} 
            isSelected={selectedFaculty === member.id}
            onClick={() => setSelectedFaculty(selectedFaculty === member.id ? null : member.id)}
          />
        ))}
      </div>

      {/* Selected Faculty Details */}
      {selectedMember && (
        <FacultyDetails member={selectedMember} onClose={() => setSelectedFaculty(null)} />
      )}

      {/* Footer */}
      <div className="px-5 py-3 border-t border-slate-200 bg-slate-50/50">
        <button className="w-full text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center justify-center gap-1">
          View Full Directory
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

function FacultyRow({ member, isSelected, onClick }: { 
  member: FacultyMember; 
  isSelected: boolean;
  onClick: () => void;
}) {
  const workloadColor = member.workload >= 80 ? 'text-red-600' : 
                       member.workload >= 60 ? 'text-amber-600' : 'text-green-600'

  return (
    <div 
      onClick={onClick}
      className={cn(
        "px-5 py-4 hover:bg-slate-50 transition-colors cursor-pointer",
        isSelected && "bg-blue-50/50"
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white font-bold text-sm">
            {member.avatar}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-slate-900">{member.name}</p>
              {member.delayedTasks > 0 && (
                <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
              )}
            </div>
            <p className="text-xs text-slate-500">{member.role} • {member.specialization}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="text-center">
            <p className={cn("text-lg font-bold", workloadColor)}>{member.workload}%</p>
            <p className="text-[10px] text-slate-500">Load</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-amber-600">{member.pendingTasks}</p>
            <p className="text-[10px] text-slate-500">Pending</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-green-600">{member.completedTasks}</p>
            <p className="text-[10px] text-slate-500">Done</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function FacultyDetails({ member, onClose }: { member: FacultyMember; onClose: () => void }) {
  return (
    <div className="border-t border-slate-200 bg-slate-50/50 p-5">
      <div className="flex items-start justify-between mb-4">
        <h4 className="text-sm font-semibold text-slate-900">Faculty Details</h4>
        <button onClick={onClose} className="text-xs text-slate-500 hover:text-slate-700">Close</button>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        {/* Batches */}
        <div className="bg-white rounded-lg p-3 border border-slate-200">
          <p className="text-[10px] font-medium text-slate-500 mb-2 uppercase">Assigned Batches</p>
          <div className="flex flex-wrap gap-1">
            {member.batches.map(batch => (
              <span key={batch} className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs font-medium">
                {batch}
              </span>
            ))}
          </div>
        </div>

        {/* Subjects */}
        <div className="bg-white rounded-lg p-3 border border-slate-200">
          <p className="text-[10px] font-medium text-slate-500 mb-2 uppercase">Subjects</p>
          <div className="flex flex-wrap gap-1">
            {member.subjects.map(subject => (
              <span key={subject} className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded text-xs font-medium">
                {subject}
              </span>
            ))}
          </div>
        </div>

        {/* Committees */}
        <div className="bg-white rounded-lg p-3 border border-slate-200">
          <p className="text-[10px] font-medium text-slate-500 mb-2 uppercase">Committees</p>
          <div className="flex flex-wrap gap-1">
            {member.committees.map(committee => (
              <span key={committee} className="px-2 py-0.5 bg-amber-50 text-amber-700 rounded text-xs font-medium">
                {committee}
              </span>
            ))}
          </div>
        </div>

        {/* Academic Stats */}
        <div className="bg-white rounded-lg p-3 border border-slate-200">
          <p className="text-[10px] font-medium text-slate-500 mb-2 uppercase">Academic Stats</p>
          <div className="flex items-center justify-between text-xs">
            <div>
              <p className="text-slate-400">Attendance</p>
              <p className="font-semibold text-slate-900">{member.attendanceSessions} sessions</p>
            </div>
            <div className="text-right">
              <p className="text-slate-400">Marks</p>
              <p className="font-semibold text-green-600">{member.marksSubmitted} submitted</p>
              <p className="text-slate-400 text-[10px]">{member.marksPending} pending</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
