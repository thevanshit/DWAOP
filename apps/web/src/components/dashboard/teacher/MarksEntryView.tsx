'use client'

import { Save } from 'lucide-react'
import { cn } from '@/lib/utils'

export function MarksEntryView({ batches, selectedBatch, onSelectBatch, assignments, selectedAssignment, onSelectAssignment, marksData }: any) {
  const assignment = assignments.find((a: any) => a.id === selectedAssignment)
  const quickGrades = ['A', 'B', 'C', 'D', 'E']

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">Marks Entry</h2>
      </div>

      <div className="flex gap-3">
        <select 
          value={selectedBatch}
          onChange={(e) => onSelectBatch(e.target.value)}
          className="flex-1 h-11 px-4 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-600/20 shadow-sm"
        >
          {batches.map((b: any) => (
            <option key={b.id} value={b.id}>{b.name}</option>
          ))}
        </select>
        <select 
          value={selectedAssignment || ''}
          onChange={(e) => onSelectAssignment(Number(e.target.value))}
          className="flex-1 h-11 px-4 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-600/20 shadow-sm"
        >
          <option value="">Select Assignment</option>
          {assignments.filter((a: any) => a.batch === batches.find((b: any) => b.id === selectedBatch)?.name).map((a: any) => (
            <option key={a.id} value={a.id}>{a.title}</option>
          ))}
        </select>
      </div>

      {assignment && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-slate-900">{assignment.title}</h3>
                <p className="text-xs text-slate-500">{assignment.batch} • Max Marks: {assignment.maxMarks}</p>
              </div>
              <button className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700">
                <Save className="w-3.5 h-3.5" /> Save All
              </button>
            </div>
          </div>
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Roll No</th>
                <th className="text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Student Name</th>
                <th className="text-center text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Status</th>
                <th className="text-center text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Grade</th>
                <th className="text-center text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Marks / {assignment.maxMarks}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {marksData.map((student: any) => (
                <tr key={student.studentId} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-sm font-medium text-slate-900">{student.roll}</td>
                  <td className="px-4 py-3 text-sm text-slate-700">{student.studentName}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={cn("inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium",
                      student.status === 'Graded' ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                    )}>
                      {student.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {student.grade ? (
                      <span className={cn("inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold",
                        student.grade === 'A' ? "bg-green-100 text-green-700" :
                        student.grade === 'B' ? "bg-blue-100 text-blue-700" :
                        student.grade === 'C' ? "bg-amber-100 text-amber-700" :
                        "bg-red-100 text-red-700"
                      )}>
                        {student.grade}
                      </span>
                    ) : (
                      <div className="flex items-center justify-center gap-0.5">
                        {quickGrades.map(g => (
                          <button key={g} className="w-6 h-6 text-[10px] font-medium text-slate-500 hover:bg-slate-100 rounded">{g}</button>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <input 
                      type="number" 
                      defaultValue={student.marks || ''}
                      max={assignment.maxMarks}
                      placeholder="--"
                      className="w-16 mx-auto text-center px-2 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                    />
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
