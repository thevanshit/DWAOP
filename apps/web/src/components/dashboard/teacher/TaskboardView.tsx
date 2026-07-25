'use client'

import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ACADEMIC_TASKS } from './data'

export function TaskboardView({ 
  filter, setFilter, onAddTask 
}: { 
  filter: 'all' | 'urgent' | 'thisweek'
  setFilter: (filter: 'all' | 'urgent' | 'thisweek') => void
  onAddTask?: () => void 
}) {
  const getFilteredTasks = (tasks: any[]) => {
    if (filter === 'urgent') return tasks.filter((t: any) => t.priority === 'HIGH' || t.priority === 'CRITICAL')
    if (filter === 'thisweek') return tasks.filter((t: any) => new Date(t.deadline) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000))
    return tasks
  }

  const overdueTasks = getFilteredTasks(ACADEMIC_TASKS.overdue)
  const todoTasks = getFilteredTasks(ACADEMIC_TASKS.todo)
  const inProgressTasks = getFilteredTasks(ACADEMIC_TASKS.inProgress)
  const doneTasks = getFilteredTasks(ACADEMIC_TASKS.done)

  const columns = [
    { id: 'overdue', label: 'Overdue', color: '#EF4444', tasks: overdueTasks },
    { id: 'todo', label: 'To Do', color: '#2563EB', tasks: todoTasks },
    { id: 'inProgress', label: 'In Progress', color: '#F59E0B', tasks: inProgressTasks },
    { id: 'done', label: 'Completed', color: '#10B981', tasks: doneTasks },
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

      <div className="grid grid-cols-4 gap-4">
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
              {column.tasks.map((task: any) => (
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
                    <span>{task.batch}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
