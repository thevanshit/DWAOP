'use client'

import { useState, useMemo } from 'react'
import { Plus, Search, User, Award, Building2, Filter } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAdminDashboardContext } from './AdminDashboardProvider'

export function WorkflowsView({ showNewWorkflow, setShowNewWorkflow }: { showNewWorkflow: boolean; setShowNewWorkflow: (v: boolean) => void }) {
  const { workflows, columns } = useAdminDashboardContext()
  const [activeType, setActiveType] = useState<'all' | 'student' | 'faculty' | 'admin'>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredWorkflows = useMemo(() =>
    workflows.filter(wf => {
      const matchesType = activeType === 'all' || wf.type === activeType
      const matchesSearch = wf.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           wf.assignee?.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesType && matchesSearch
    }),
    [workflows, activeType, searchQuery]
  )

  const columnsWithTasks = useMemo(() =>
    columns.map(col => ({
      ...col,
      tasks: filteredWorkflows.filter(wf => wf.status === col.id)
    })),
    [columns, filteredWorkflows]
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Department Workflows</h2>
          <p className="text-sm text-slate-500 mt-1">Manage and monitor all workflows</p>
        </div>
        <button
          onClick={() => setShowNewWorkflow(true)}
          type="button"
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 shadow-lg shadow-blue-600/20"
        >
          <Plus className="w-4 h-4" /> New Workflow
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex gap-2 overflow-x-auto pb-1">
          <button onClick={() => setActiveType('all')} type="button" className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors", activeType === 'all' ? "bg-blue-600 text-white" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50")}>
            <Filter className="w-3.5 h-3.5" /> All
          </button>
          <button onClick={() => setActiveType('student')} type="button" className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors", activeType === 'student' ? "bg-blue-600 text-white" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50")}>
            <User className="w-3.5 h-3.5" /> Student
          </button>
          <button onClick={() => setActiveType('faculty')} type="button" className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors", activeType === 'faculty' ? "bg-blue-600 text-white" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50")}>
            <Award className="w-3.5 h-3.5" /> Faculty
          </button>
          <button onClick={() => setActiveType('admin')} type="button" className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors", activeType === 'admin' ? "bg-blue-600 text-white" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50")}>
            <Building2 className="w-3.5 h-3.5" /> Admin
          </button>
        </div>
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search workflows..."
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
            aria-label="Search workflows"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {columnsWithTasks.map((column) => (
          <div key={column.id} className="bg-slate-100/50 rounded-xl p-3 min-h-[200px] max-h-[600px] flex flex-col">
            <div className="flex items-center justify-between mb-3 flex-shrink-0">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: column.color }} />
                <span className="text-xs font-semibold text-slate-700">{column.label}</span>
              </div>
              <span className="text-[10px] font-medium text-slate-500 bg-white px-1.5 py-0.5 rounded">{column.tasks.length}</span>
            </div>
            <div className="space-y-2 overflow-y-auto flex-1 pr-1">
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
