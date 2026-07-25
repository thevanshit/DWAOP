'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

export function AssignmentsView({ batches, assignments, onNewAssignment }: { batches: any[]; assignments: any[]; onNewAssignment?: () => void }) {
  const [selectedBatch, setSelectedBatch] = useState(batches[0]?.id || '')

  const filteredAssignments = assignments.filter(a => 
    selectedBatch === 'all' || a.batch === batches.find(b => b.id === selectedBatch)?.name
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">Assignments</h2>
        <button 
          onClick={onNewAssignment}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
        >
          <Plus className="w-4 h-4" /> New Assignment
        </button>
      </div>

      <div className="flex gap-2">
        <button onClick={() => setSelectedBatch('all')} className={cn("px-3 py-1.5 rounded-lg text-xs font-medium transition-colors", selectedBatch === 'all' ? "bg-blue-600 text-white" : "bg-white text-slate-600 border border-slate-200")}>All</button>
        {batches.map((b: any) => (
          <button key={b.id} onClick={() => setSelectedBatch(b.id)} className={cn("px-3 py-1.5 rounded-lg text-xs font-medium transition-colors", selectedBatch === b.id ? "bg-blue-600 text-white" : "bg-white text-slate-600 border border-slate-200")}>{b.name}</button>
        ))}
      </div>

      <div className="space-y-3">
        {filteredAssignments.map((a) => (
          <div key={a.id} className={cn("bg-white rounded-2xl border p-4 shadow-sm", a.isLate ? "border-amber-300 bg-amber-50/30" : "border-slate-200")}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-slate-900">{a.title}</h3>
                  {a.isLate && <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-medium">LATE</span>}
                </div>
                <p className="text-xs text-slate-500">{a.subject} • {a.batch}</p>
              </div>
              <span className={cn("text-xs font-medium px-2.5 py-1.5 rounded-lg", a.isLate ? "bg-red-100 text-red-700" : "bg-slate-100 text-slate-600")}>Due: {a.dueDate}</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-500">Submissions</span>
                  <span className="font-medium text-slate-700">{a.submitted}/{a.total}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${(a.submitted / a.total) * 100}%` }} />
                </div>
              </div>
              <span className="text-sm font-semibold text-slate-600">{a.maxMarks} marks</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
