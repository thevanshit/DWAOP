'use client'

import { Award, TrendingUp, BookOpen } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useStudentDashboardData } from './StudentDashboardProvider'

export default function MarksTab() {
  const { marks } = useStudentDashboardData()
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'finalized': return { bg: 'bg-green-100 text-green-700', label: 'Finalized' }
      case 'under_review': return { bg: 'bg-amber-100 text-amber-700', label: 'Under Review' }
      case 'draft': return { bg: 'bg-slate-100 text-slate-700', label: 'Draft' }
      default: return { bg: 'bg-slate-100 text-slate-700', label: status }
    }
  }

  const totalMarks = marks.reduce((sum, m) => sum + m.total, 0)
  const maxMarks = marks.length * 30
  const average = Math.round((totalMarks / maxMarks) * 100)

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-slate-900">Marks & Grades</h2>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200/60 p-5 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-slate-500">Total Internal Marks</span>
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-900">{totalMarks}/{maxMarks}</p>
          <p className="text-xs text-slate-400 mt-1">{marks.length} subjects × 30 marks</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200/60 p-5 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-slate-500">Average</span>
            <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-bold text-blue-600">{average}%</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200/60 p-5 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-slate-500">Subjects</span>
            <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-900">{marks.length}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/60 shadow-[0_2px_8px_rgba(0,0,0,0.06)] overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Subject</th>
              <th className="text-center text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Internal I</th>
              <th className="text-center text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Internal II</th>
              <th className="text-center text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Total</th>
              <th className="text-center text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {marks.map((mark, i) => (
              <tr key={i} className="hover:bg-slate-50">
                <td className="px-4 py-3">
                  <p className="text-sm font-medium text-slate-900">{mark.subject}</p>
                  <p className="text-[10px] text-slate-500">{mark.subjectCode}</p>
                </td>
                <td className="px-4 py-3 text-center text-sm text-slate-700">{mark.internal1}</td>
                <td className="px-4 py-3 text-center text-sm text-slate-700">{mark.internal2}</td>
                <td className="px-4 py-3 text-center">
                  <span className="text-sm font-bold text-slate-900">{mark.total}</span>
                  <span className="text-[10px] text-slate-400">/30</span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className={cn("text-[10px] font-medium px-2 py-0.5 rounded-full", getStatusStyle(mark.status).bg)}>
                    {getStatusStyle(mark.status).label}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
