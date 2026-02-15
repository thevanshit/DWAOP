'use client'

import { useState } from 'react'
import { 
  FileText, 
  Search, 
  Clock, 
  ChevronDown,
  ChevronRight,
  Beaker,
  BookOpen,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  FileCheck
} from 'lucide-react'

interface Assignment {
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
}

interface AssignmentsTabProps {
  assignments: Assignment[]
}

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

const statusStyles = {
  pending: { label: 'Pending', bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200', icon: Clock },
  submitted: { label: 'Submitted', bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200', icon: FileCheck },
  evaluated: { label: 'Evaluated', bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-200', icon: CheckCircle },
  late: { label: 'Late', bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200', icon: AlertCircle },
}

function StatusPill({ status }: { status: keyof typeof statusStyles }) {
  const style = statusStyles[status]
  const Icon = style.icon
  return (
    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${style.bg} ${style.text} flex items-center gap-1`}>
      <Icon className="w-3 h-3" />
      {style.label}
    </span>
  )
}

function DueSoonCard({ assignment }: { assignment: Assignment }) {
  const isLate = assignment.status === 'late'
  const style = statusStyles[assignment.status]
  const Icon = style.icon
  
  return (
    <div className="group flex items-center justify-between p-4 
      bg-white rounded-xl border border-black/[0.04] 
      shadow-[0_1px_3px_rgba(0,0,0,0.02)] 
      hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)] 
      transition-all duration-200"
    >
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${style.bg} border ${style.border}`}>
          <Icon className={`w-5 h-5 ${style.text}`} />
        </div>
        <div className="min-w-0">
          <p className="font-medium text-[var(--color-text-primary)] text-sm truncate">{assignment.title}</p>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-xs px-2 py-0.5 bg-[var(--color-primary-faint)] text-[var(--color-primary)] rounded-full font-medium">
              {assignment.subject}
            </span>
            <span className="text-xs text-[var(--color-text-muted)] flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Due {assignment.dueDate}
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <StatusPill status={assignment.status} />
        <button className="px-4 py-2 bg-[var(--color-primary)] text-white text-xs font-medium rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors flex items-center gap-2">
          {assignment.status === 'submitted' || assignment.status === 'evaluated' ? 'View' : 'Submit'}
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  )
}

function AssignmentItem({ assignment }: { assignment: Assignment }) {
  const status = statusStyles[assignment.status]
  const Icon = status.icon

  return (
    <div className="flex items-center justify-between p-4 hover:bg-slate-50/50 transition-all border-b border-slate-50 last:border-0">
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${status.bg}`}>
          <Icon className={`w-4 h-4 ${status.text}`} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-[var(--color-text-primary)] text-sm truncate">{assignment.title}</p>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-[10px] text-[var(--color-text-muted)]">{assignment.maxMarks} marks</span>
            <span className="text-[10px] flex items-center gap-1 text-[var(--color-text-muted)]">
              <Clock className="w-3 h-3" />
              {assignment.dueDate}
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        {assignment.status === 'evaluated' && assignment.marks !== undefined && (
          <div className="text-right">
            <span className="text-sm font-semibold text-green-600">{assignment.marks}/{assignment.maxMarks}</span>
            <p className="text-[10px] text-[var(--color-text-muted)]">Scored</p>
          </div>
        )}
        <StatusPill status={assignment.status} />
        <button className="px-3 py-1.5 bg-[var(--color-primary)] text-white text-xs font-medium rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors">
          {assignment.status === 'submitted' || assignment.status === 'evaluated' ? 'View' : 'Submit'}
        </button>
      </div>
    </div>
  )
}

function SubjectRow({ subjectData, assignments, isOpen, onToggle }: { 
  subjectData: typeof SUBJECTS_DATA[0]
  assignments: Assignment[]
  isOpen: boolean
  onToggle: () => void
}) {
  const pendingCount = assignments.filter(a => a.status === 'pending').length
  const submittedCount = assignments.filter(a => a.status === 'submitted').length
  const evaluatedCount = assignments.filter(a => a.status === 'evaluated').length
  const lateCount = assignments.filter(a => a.status === 'late').length

  return (
    <div className="bg-white rounded-xl border border-black/[0.04] shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-5 hover:bg-slate-50/50 transition-all"
      >
        <div className="flex items-center gap-4">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${
            subjectData.category === 'lab' ? 'bg-violet-50' : 'bg-[var(--color-primary-faint)]'
          }`}>
            {subjectData.category === 'lab' ? (
              <Beaker className="w-5 h-5 text-violet-500" />
            ) : (
              <BookOpen className="w-5 h-5 text-[var(--color-primary)]" />
            )}
          </div>
          <div className="text-left">
            <p className="font-medium text-[var(--color-text-primary)]">{subjectData.name}</p>
            <p className="text-xs text-[var(--color-text-muted)]">{assignments.length} assignments</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex gap-1.5">
            {pendingCount > 0 && <span className="w-6 h-6 text-[10px] font-medium bg-amber-50 text-amber-600 rounded-md flex items-center justify-center">{pendingCount}</span>}
            {submittedCount > 0 && <span className="w-6 h-6 text-[10px] font-medium bg-blue-50 text-blue-600 rounded-md flex items-center justify-center">{submittedCount}</span>}
            {evaluatedCount > 0 && <span className="w-6 h-6 text-[10px] font-medium bg-green-50 text-green-600 rounded-md flex items-center justify-center">{evaluatedCount}</span>}
            {lateCount > 0 && <span className="w-6 h-6 text-[10px] font-medium bg-red-50 text-red-500 rounded-md flex items-center justify-center">{lateCount}</span>}
          </div>
          {isOpen ? <ChevronDown className="w-5 h-5 text-slate-400" /> : <ChevronRight className="w-5 h-5 text-slate-400" />}
        </div>
      </button>
      
      {isOpen && assignments.length > 0 && (
        <div className="border-t border-slate-50">
          {assignments.map(assignment => (
            <AssignmentItem key={assignment.id} assignment={assignment} />
          ))}
        </div>
      )}
      
      {isOpen && assignments.length === 0 && (
        <div className="border-t border-slate-50 p-8 text-center">
          <FileText className="w-8 h-8 text-slate-200 mx-auto mb-2" />
          <p className="text-sm text-[var(--color-text-muted)]">No assignments</p>
        </div>
      )}
    </div>
  )
}

export default function AssignmentsTab({ assignments }: AssignmentsTabProps) {
  const [activeFilter, setActiveFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [openSubject, setOpenSubject] = useState<string | null>(null)

  const filteredAssignments = assignments.filter(assignment => {
    const matchesFilter = activeFilter === 'all' || assignment.status === activeFilter
    const matchesSearch = assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        assignment.subject.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const dueSoon = filteredAssignments.filter(a => a.status === 'pending' || a.status === 'late')

  const stats = {
    all: assignments.length,
    pending: assignments.filter(a => a.status === 'pending').length,
    submitted: assignments.filter(a => a.status === 'submitted').length,
    evaluated: assignments.filter(a => a.status === 'evaluated').length,
    late: assignments.filter(a => a.status === 'late').length,
  }

  const theorySubjects = SUBJECTS_DATA.filter(s => s.category === 'theory')
  const labSubjects = SUBJECTS_DATA.filter(s => s.category === 'lab')

  const toggleSubject = (code: string) => {
    setOpenSubject(prev => prev === code ? null : code)
  }

  return (
    <div className="space-y-6">
      {/* Status Cards - Card Style */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'All', key: 'all', count: stats.all, color: 'primary', icon: FileText },
          { label: 'Pending', key: 'pending', count: stats.pending, color: 'amber', icon: Clock },
          { label: 'Submitted', key: 'submitted', count: stats.submitted, color: 'blue', icon: FileCheck },
          { label: 'Evaluated', key: 'evaluated', count: stats.evaluated, color: 'green', icon: CheckCircle },
        ].map(item => {
          const Icon = item.icon
          return (
            <button
              key={item.key}
              onClick={() => setActiveFilter(item.key)}
              className={`
                p-5 rounded-2xl border text-left transition-all duration-200
                bg-white border-black/[0.04] shadow-[0_1px_3px_rgba(0,0,0,0.02)]
                hover:shadow-[0_4px_12px_rgba(0,0,0,0.04)]
                ${activeFilter === item.key 
                  ? item.color === 'primary'
                    ? 'bg-[var(--color-primary)] border-[var(--color-primary)] shadow-[var(--color-primary)]/10'
                    : `bg-${item.color}-50 border-${item.color}-300`
                  : ''
                }
              `}
            >
              <div className="flex items-center justify-between mb-3">
                <span className={`text-xs font-medium uppercase tracking-wider ${
                  activeFilter === item.key 
                    ? item.color === 'primary' ? 'text-white/80' : `text-${item.color}-600`
                    : 'text-[var(--color-text-muted)]'
                }`}>{item.label}</span>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  activeFilter === item.key
                    ? item.color === 'primary' ? 'bg-white/20' : `bg-${item.color}-100`
                    : 'bg-gray-100'
                }`}>
                  <Icon className={`w-4 h-4 ${
                    activeFilter === item.key
                      ? item.color === 'primary' ? 'text-white' : `text-${item.color}-600`
                      : 'text-gray-400'
                  }`} />
                </div>
              </div>
              <p className={`text-3xl font-bold ${
                activeFilter === item.key 
                  ? item.color === 'primary' ? 'text-white' : `text-${item.color}-700`
                  : 'text-[var(--color-text-primary)]'
              }`}>{item.count}</p>
            </button>
          )
        })}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          placeholder="Search assignments..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 border border-black/[0.04] rounded-xl text-sm bg-white shadow-[0_1px_3px_rgba(0,0,0,0.02)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all"
        />
      </div>

      {/* Due Soon */}
      {dueSoon.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-[var(--color-text-primary)] flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-500" />
            Due Soon
            <span className="px-2 py-0.5 bg-amber-50 text-amber-600 text-xs rounded-full">{dueSoon.length}</span>
          </h3>
          <div className="space-y-2">
            {dueSoon.slice(0, 3).map(assignment => (
              <DueSoonCard key={assignment.id} assignment={assignment} />
            ))}
          </div>
        </div>
      )}

      {/* Theory Subjects */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-[var(--color-text-primary)] flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-[var(--color-primary)]" />
          Theory Subjects
        </h3>
        <div className="space-y-2">
          {theorySubjects.map(subjectData => {
            const subjectAssignments = filteredAssignments.filter(a => a.subject === subjectData.code)
            return (
              <SubjectRow
                key={subjectData.code}
                subjectData={subjectData}
                assignments={subjectAssignments}
                isOpen={openSubject === subjectData.code}
                onToggle={() => toggleSubject(subjectData.code)}
              />
            )
          })}
        </div>
      </div>

      {/* Lab Subjects */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-[var(--color-text-primary)] flex items-center gap-2">
          <Beaker className="w-4 h-4 text-violet-500" />
          Lab Subjects
        </h3>
        <div className="space-y-2">
          {labSubjects.map(subjectData => {
            const subjectAssignments = filteredAssignments.filter(a => a.subject === subjectData.code)
            return (
              <SubjectRow
                key={subjectData.code}
                subjectData={subjectData}
                assignments={subjectAssignments}
                isOpen={openSubject === subjectData.code}
                onToggle={() => toggleSubject(subjectData.code)}
              />
            )
          })}
        </div>
      </div>

      {filteredAssignments.length === 0 && (
        <div className="bg-white rounded-xl border border-black/[0.04] p-12 text-center shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <FileText className="w-12 h-12 text-slate-200 mx-auto mb-4" />
          <p className="text-[var(--color-text-muted)] font-medium">No assignments found</p>
        </div>
      )}
    </div>
  )
}
