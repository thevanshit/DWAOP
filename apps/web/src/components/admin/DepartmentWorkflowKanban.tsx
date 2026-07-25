'use client'

import { useState } from 'react'
import {
  Search,
  Filter,
  Plus,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  FileText,
  Users,
  Calendar,
  Award,
  ClipboardCheck,
  MoreVertical,
  ArrowUpRight,
  ArrowDownRight,
  Layers
} from 'lucide-react'
import { cn } from '@/lib/utils'

type WorkflowType = 'attendance' | 'assignment' | 'marks' | 'leave' | 'task'
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
  priority?: 'low' | 'medium' | 'high' | 'critical'
  risk?: 'low' | 'medium' | 'high'
  committee?: string
}

interface DepartmentWorkflowKanbanProps {
  workflows?: WorkflowItem[]
  onCreateWorkflow?: (type: WorkflowType) => void
}

const MOCK_WORKFLOWS: WorkflowItem[] = [
  // Attendance workflows
  { id: 'att-1', type: 'attendance', title: 'OS Lecture - CSE-AIML', description: 'Lecture attendance for Operating Systems', status: 'in_progress', batch: 'CSE-AIML', subject: 'Operating Systems', assignee: 'Dr. Vineet Jain', priority: 'high' },
  { id: 'att-2', type: 'attendance', title: 'CN Lab - CSE', description: 'Lab attendance for Computer Networks', status: 'created', batch: 'CSE', subject: 'Computer Networks', assignee: 'Dr. Priya', priority: 'medium' },
  { id: 'att-3', type: 'attendance', title: 'DBMS Lecture - IT', description: 'Lecture attendance for Database Systems', status: 'done', batch: 'IT', subject: 'Database Systems', assignee: 'Dr. Rahul', priority: 'medium' },
  
  // Assignment workflows
  { id: 'asgn-1', type: 'assignment', title: 'OS Assignment 4 - Deadlock', description: 'Deadlock prevention assignment', status: 'under_review', batch: 'CSE-AIML', subject: 'Operating Systems', assignee: 'Dr. Vineet Jain', dueDate: '2026-02-20', priority: 'high' },
  { id: 'asgn-2', type: 'assignment', title: 'CN Lab Report - Routing', description: 'Routing protocol lab report', status: 'created', batch: 'CSE', subject: 'Computer Networks', assignee: 'Dr. Priya', dueDate: '2026-02-22', priority: 'medium' },
  { id: 'asgn-3', type: 'assignment', title: 'SE Mini Project Phase 2', description: 'Software Engineering project', status: 'delayed', batch: 'CSE-AIML', subject: 'Software Engineering', assignee: 'Dr. Suresh', dueDate: '2026-02-18', priority: 'critical', risk: 'high' },
  
  // Marks workflows
  { id: 'mrk-1', type: 'marks', title: 'IA-1 Marks - OS', description: 'Internal Assessment 1 marks entry', status: 'under_review', batch: 'CSE-AIML', subject: 'Operating Systems', assignee: 'Dr. Vineet Jain', dueDate: '2026-02-25', priority: 'high' },
  { id: 'mrk-2', type: 'marks', title: 'IA-1 Marks - CN', description: 'Internal Assessment 1 marks entry', status: 'created', batch: 'CSE', subject: 'Computer Networks', assignee: 'Dr. Priya', dueDate: '2026-02-28', priority: 'medium' },
  { id: 'mrk-3', type: 'marks', title: 'Lab Marks - DBMS', description: 'Database Systems lab marks', status: 'locked', batch: 'IT', subject: 'Database Systems', assignee: 'Dr. Rahul', priority: 'low' },
  
  // Leave workflows
  { id: 'lv-1', type: 'leave', title: 'Medical Leave - Student 45', description: 'Medical leave request for 3 days', status: 'under_review', batch: 'CSE-AIML', assignee: 'Dr. Vineet Jain', priority: 'high' },
  { id: 'lv-2', type: 'leave', title: 'Event Permission - Student 23', description: 'Permission for tech event participation', status: 'created', batch: 'CSE', assignee: 'Dr. Suresh', priority: 'medium' },
  
  // Task workflows
  { id: 'tsk-1', type: 'task', title: 'NBA Documentation', description: 'Accreditation documents preparation', status: 'in_progress', assignee: 'Dr. Amit Kumar', committee: 'Accreditation', dueDate: '2026-02-20', priority: 'critical' },
  { id: 'tsk-2', type: 'task', title: 'Exam Paper Setting', description: 'Mid-term exam question papers', status: 'delayed', assignee: 'Dr. Vineet Jain', committee: 'Exam Cell', dueDate: '2026-02-18', priority: 'high', risk: 'high' },
  { id: 'tsk-3', type: 'task', title: 'Timetable Update', description: 'Update semester timetable', status: 'done', assignee: 'Admin', committee: 'Academic', priority: 'medium' },
]

const COLUMNS: { id: WorkflowStatus; label: string; color: string }[] = [
  { id: 'created', label: 'To Do', color: '#6366F1' },
  { id: 'in_progress', label: 'In Progress', color: '#F59E0B' },
  { id: 'under_review', label: 'Under Review', color: '#8B5CF6' },
  { id: 'done', label: 'Completed', color: '#10B981' },
  { id: 'delayed', label: 'Delayed', color: '#EF4444' },
  { id: 'locked', label: 'Locked', color: '#6B7280' },
]

const TYPE_ICONS: Record<WorkflowType, React.ElementType> = {
  attendance: ClipboardCheck,
  assignment: FileText,
  marks: Award,
  leave: Calendar,
  task: Layers,
}

const TYPE_COLORS: Record<WorkflowType, string> = {
  attendance: 'bg-blue-100 text-blue-700',
  assignment: 'bg-purple-100 text-purple-700',
  marks: 'bg-green-100 text-green-700',
  leave: 'bg-amber-100 text-amber-700',
  task: 'bg-slate-100 text-slate-700',
}

export default function DepartmentWorkflowKanban({ 
  workflows = MOCK_WORKFLOWS,
  onCreateWorkflow 
}: DepartmentWorkflowKanbanProps) {
  const [view, setView] = useState<'kanban' | 'list'>('kanban')
  const [filterType, setFilterType] = useState<WorkflowType | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredWorkflows = workflows.filter(w => {
    const matchesType = filterType === 'all' || w.type === filterType
    const matchesSearch = w.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         w.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesType && matchesSearch
  })

  const getWorkflowsByStatus = (status: WorkflowStatus) => 
    filteredWorkflows.filter(w => w.status === status)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search workflows..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 pl-11 pr-4 py-2.5 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as WorkflowType | 'all')}
            className="h-11 px-4 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-sm"
          >
            <option value="all">All Types</option>
            <option value="attendance">Attendance</option>
            <option value="assignment">Assignments</option>
            <option value="marks">Marks</option>
            <option value="leave">Leave</option>
            <option value="task">Tasks</option>
          </select>
        </div>

        <div className="flex items-center space-x-3">
          <div className="bg-white border border-slate-200 rounded-xl p-1 flex shadow-sm">
            <button
              onClick={() => setView('kanban')}
              className={cn("p-2 rounded-lg transition-all", view === 'kanban' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:bg-slate-50')}
            >
              <Layers className="w-4 h-4" />
            </button>
            <button
              onClick={() => setView('list')}
              className={cn("p-2 rounded-lg transition-all", view === 'list' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:bg-slate-50')}
            >
              <FileText className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => onCreateWorkflow?.('task')}
            className="px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 flex items-center gap-2 shadow-lg shadow-blue-600/20"
          >
            <Plus className="w-4 h-4" />
            New Workflow
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-6 gap-3">
        {COLUMNS.map(col => (
          <div key={col.id} className="bg-white rounded-xl border border-slate-200 p-3 text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: col.color }} />
              <span className="text-xs font-medium text-slate-500">{col.label}</span>
            </div>
            <p className="text-xl font-bold text-slate-900">{getWorkflowsByStatus(col.id).length}</p>
          </div>
        ))}
      </div>

      {view === 'kanban' ? (
        <div className="grid grid-cols-6 gap-4">
          {COLUMNS.map(col => (
            <div key={col.id} className="flex flex-col">
              <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: col.color }} />
                  <span className="text-xs font-semibold text-slate-700">{col.label}</span>
                </div>
                <span className="text-[10px] font-medium text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                  {getWorkflowsByStatus(col.id).length}
                </span>
              </div>

              <div className="flex-1 bg-slate-50/50 rounded-xl border border-dashed border-slate-200 p-2 space-y-2 min-h-[400px]">
                {getWorkflowsByStatus(col.id).map(workflow => (
                  <WorkflowCard key={workflow.id} workflow={workflow} />
                ))}
                {getWorkflowsByStatus(col.id).length === 0 && (
                  <div className="flex items-center justify-center h-32 text-xs text-slate-400">
                    No workflows
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Workflow</th>
                <th className="px-6 py-4 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Assignee</th>
                <th className="px-6 py-4 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Priority</th>
                <th className="px-6 py-4 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Due Date</th>
                <th className="px-6 py-4 text-[10px] font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredWorkflows.map(workflow => (
                <tr key={workflow.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{workflow.title}</p>
                      <p className="text-xs text-slate-500">{workflow.description}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn("px-2 py-1 rounded-lg text-xs font-medium", TYPE_COLORS[workflow.type])}>
                      {workflow.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={workflow.status} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-600">
                        {workflow.assignee?.charAt(0) || '?'}
                      </div>
                      <span className="text-xs font-medium text-slate-600">{workflow.assignee || 'Unassigned'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <PriorityBadge priority={workflow.priority} />
                  </td>
                  <td className="px-6 py-4">
                    {workflow.dueDate ? (
                      <span className="text-xs font-medium text-slate-500">
                        {new Date(workflow.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function WorkflowCard({ workflow }: { workflow: WorkflowItem }) {
  const TypeIcon = TYPE_ICONS[workflow.type]
  
  return (
    <div className={cn(
      "bg-white p-4 rounded-xl border shadow-sm hover:shadow-md transition-all cursor-pointer",
      workflow.risk === 'high' ? 'border-red-300 bg-red-50/30' : 'border-slate-200'
    )}>
      <div className="flex items-center justify-between mb-3">
        <span className={cn("px-2 py-0.5 rounded-lg text-[10px] font-medium flex items-center gap-1", TYPE_COLORS[workflow.type])}>
          <TypeIcon className="w-3 h-3" />
          {workflow.type}
        </span>
        <div className="flex items-center gap-1">
          {workflow.risk === 'high' && (
            <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
          )}
          <PriorityIndicator priority={workflow.priority} />
        </div>
      </div>

      <h4 className="text-xs font-semibold text-slate-900 leading-tight mb-1">
        {workflow.title}
      </h4>
      
      <p className="text-[10px] text-slate-500 line-clamp-2 mb-3">
        {workflow.description}
      </p>

      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
        <div className="flex items-center gap-1.5">
          {workflow.batch && (
            <span className="text-[9px] font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
              {workflow.batch}
            </span>
          )}
          {workflow.subject && (
            <span className="text-[9px] font-medium text-slate-400">
              {workflow.subject.split(' ')[0]}
            </span>
          )}
        </div>
        {workflow.dueDate && (
          <span className={cn("text-[10px] font-medium flex items-center gap-1",
            workflow.status === 'delayed' ? 'text-red-600' : 'text-slate-400'
          )}>
            <Clock className="w-3 h-3" />
            {new Date(workflow.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
        )}
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: WorkflowStatus }) {
  const styles: Record<WorkflowStatus, { bg: string; text: string; label: string }> = {
    created: { bg: 'bg-indigo-100', text: 'text-indigo-700', label: 'To Do' },
    in_progress: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'In Progress' },
    under_review: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Under Review' },
    done: { bg: 'bg-green-100', text: 'text-green-700', label: 'Completed' },
    delayed: { bg: 'bg-red-100', text: 'text-red-700', label: 'Delayed' },
    locked: { bg: 'bg-slate-100', text: 'text-slate-600', label: 'Locked' },
  }
  
  const style = styles[status]
  
  return (
    <span className={cn("px-2 py-1 rounded-lg text-xs font-medium", style.bg, style.text)}>
      {style.label}
    </span>
  )
}

function PriorityBadge({ priority }: { priority?: 'low' | 'medium' | 'high' | 'critical' }) {
  const styles: Record<string, { bg: string; text: string; label: string }> = {
    low: { bg: 'bg-slate-100', text: 'text-slate-600', label: 'Low' },
    medium: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Medium' },
    high: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'High' },
    critical: { bg: 'bg-red-100', text: 'text-red-700', label: 'Critical' },
  }
  
  const style = styles[priority || 'low']
  
  return (
    <span className={cn("px-2 py-0.5 rounded text-[10px] font-medium", style.bg, style.text)}>
      {style.label}
    </span>
  )
}

function PriorityIndicator({ priority }: { priority?: 'low' | 'medium' | 'high' | 'critical' }) {
  const colors: Record<string, string> = {
    low: 'bg-slate-300',
    medium: 'bg-blue-400',
    high: 'bg-amber-400',
    critical: 'bg-red-500',
  }
  
  return (
    <span className={cn("w-2 h-2 rounded-full", colors[priority || 'low'])} />
  )
}
