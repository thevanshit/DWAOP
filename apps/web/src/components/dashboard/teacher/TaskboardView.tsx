'use client'

import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTeacherDashboardContext, type AcademicTaskItem } from './TeacherDashboardProvider'

function isDateWithinWeek(dateStr: string): boolean {
  const parsed = new Date(dateStr)
  if (isNaN(parsed.getTime())) {
    // Try parsing as relative date string like "Feb 20"
    const parsedRelative = new Date(`${dateStr}, ${new Date().getFullYear()}`)
    if (isNaN(parsedRelative.getTime())) return false
    const now = new Date()
    const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
    return parsedRelative >= now && parsedRelative <= weekFromNow
  }
  const now = new Date()
  const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
  return parsed >= now && parsed <= weekFromNow
}

export function TaskboardView({ 
  filter, setFilter, onAddTask 
}: { 
  filter: 'all' | 'urgent' | 'thisweek'
  setFilter: (filter: 'all' | 'urgent' | 'thisweek') => void
  onAddTask?: () => void 
}) {
  const ctx = useTeacherDashboardContext()
  const academicTasks = ctx.academicTasks

  const getFilteredTasks = (tasks: AcademicTaskItem[]) => {
    if (filter === 'urgent') return tasks.filter((t) => t.priority === 'HIGH' || t.priority === 'CRITICAL')
    if (filter === 'thisweek') return tasks.filter((t) => isDateWithinWeek(t.deadline))
    return tasks
  }

  const overdueTasks = getFilteredTasks(academicTasks.overdue)
  const todoTasks = getFilteredTasks(academicTasks.todo)
  const inProgressTasks = getFilteredTasks(academicTasks.inProgress)
  const doneTasks = getFilteredTasks(academicTasks.done)

  const columns = [
    { id: 'overdue' as const, label: 'Overdue', color: '#EF4444', tasks: overdueTasks },
    { id: 'todo' as const, label: 'To Do', color: '#2563EB', tasks: todoTasks },
    { id: 'inProgress' as const, label: 'In Progress', color: '#F59E0B', tasks: inProgressTasks },
    { id: 'done' as const, label: 'Completed', color: '#10B981', tasks: doneTasks },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">Taskboard</h2>
        <div className="flex gap-2">
          {onAddTask && (
            <button 
              onClick={onAddTask}
              className="flex items-center gap-2 px-4 py-2.5 bg-amber-600 text-white rounded-xl text-sm font-medium hover:bg-amber-700 transition-colors shadow-lg shadow-amber-600/20"
            >
              <Plus className="w-4 h-4" /> Add Task
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <button onClick={() => setFilter('all')} className={cn("px-3 py-1.5 rounded-lg text-xs font-medium transition-colors", filter === 'all' ? "bg-slate-800 text-white" : "bg-white text-slate-600 border border-slate-200")}>All</button>
        <button onClick={() => setFilter('urgent')} className={cn("px-3 py-1.5 rounded-lg text-xs font-medium transition-colors", filter === 'urgent' ? "bg-red-600 text-white" : "bg-white text-slate-600 border border-slate-200")}>Urgent</button>
        <button onClick={() => setFilter('thisweek')} className={cn("px-3 py-1.5 rounded-lg text-xs font-medium transition-colors", filter === 'thisweek' ? "bg-amber-600 text-white" : "bg-white text-slate-600 border border-slate-200")}>This Week</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {columns.map(column => (
          <div key={column.id} className={cn("bg-slate-100/50 rounded-xl p-3", column.id === 'overdue' && "bg-red-50/50")}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: column.color }} />
                <span className="text-xs font-semibold text-slate-700">{column.label}</span>
              </div>
              <span className="text-[10px] font-medium text-slate-500 bg-white px-1.5 py-0.5 rounded">{column.tasks.length}</span>
            </div>
            <div className="space-y-2">
              {column.tasks.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-6">No tasks</p>
              ) : (
                column.tasks.map((task) => (
                  <div key={task.id} className={cn("p-3 bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow", 
                    task.isOverdue ? "border-red-300 bg-red-50/50" : "border-slate-200")}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={cn("text-[9px] font-bold px-1.5 py-0.5 rounded uppercase", 
                        task.priority === 'CRITICAL' ? "bg-red-100 text-red-700" :
                        task.priority === 'HIGH' ? "bg-amber-100 text-amber-700" :
                        "bg-slate-100 text-slate-600")}>
                        {task.priority}
                      </span>
                      <span className={cn("text-[10px]", task.isOverdue ? "text-red-600 font-medium" : "text-slate-400")}>{task.deadline}</span>
                    </div>
                    <h4 className="text-xs font-semibold text-slate-900 mb-1.5">{task.title}</h4>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                      <span className="bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">{task.subject}</span>
                      {task.batch && <span>{task.batch}</span>}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
