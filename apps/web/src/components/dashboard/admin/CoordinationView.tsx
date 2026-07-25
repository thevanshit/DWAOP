'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import { COORDINATION_TASKS } from './data'

const priorityColors: Record<string, string> = {
  critical: "bg-red-100 text-red-700",
  high: "bg-amber-100 text-amber-700",
  medium: "bg-blue-100 text-blue-700",
  low: "bg-slate-100 text-slate-600",
}

const statusColors: Record<string, string> = {
  created: "bg-indigo-100 text-indigo-700",
  in_progress: "bg-amber-100 text-amber-700",
  under_review: "bg-purple-100 text-purple-700",
  done: "bg-green-100 text-green-700",
}

const typeColors: Record<string, string> = {
  exam: "bg-red-100 text-red-700",
  documentation: "bg-blue-100 text-blue-700",
  admin: "bg-purple-100 text-purple-700",
  meeting: "bg-green-100 text-green-700",
  procurement: "bg-amber-100 text-amber-700",
}

export function CoordinationView() {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredTasks = COORDINATION_TASKS.filter(t =>
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.assignee?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Coordination</h2>
          <p className="text-sm text-slate-500 mt-1">Track cross-department tasks and coordination items</p>
        </div>
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks..."
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left text-xs font-semibold text-slate-600 px-4 py-3">Task</th>
                <th className="text-left text-xs font-semibold text-slate-600 px-4 py-3">Assignee</th>
                <th className="text-center text-xs font-semibold text-slate-600 px-4 py-3">Type</th>
                <th className="text-center text-xs font-semibold text-slate-600 px-4 py-3">Priority</th>
                <th className="text-center text-xs font-semibold text-slate-600 px-4 py-3">Status</th>
                <th className="text-center text-xs font-semibold text-slate-600 px-4 py-3">Due Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTasks.map((task) => (
                <tr key={task.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-slate-900">{task.title}</p>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-700">{task.assignee}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={cn("text-[10px] font-medium px-2 py-0.5 rounded-full", typeColors[task.type])}>{task.type}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={cn("text-[10px] font-medium px-2 py-0.5 rounded-full", priorityColors[task.priority])}>{task.priority}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={cn("text-[10px] font-medium px-2 py-0.5 rounded-full", statusColors[task.status])}>{task.status.replace('_', ' ')}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="text-xs text-slate-600">{task.dueDate || '—'}</span>
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
