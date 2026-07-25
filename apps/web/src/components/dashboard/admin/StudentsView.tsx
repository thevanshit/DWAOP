'use client'

import { useState } from 'react'
import { Users, CheckCircle, AlertTriangle, Award, Download, CheckCircle as CheckIcon, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { STUDENT_DATA } from './data'
import { StatCard } from './StatCard'

export function StudentsView() {
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'at_risk'>('all')
  const [batchFilter, setBatchFilter] = useState('all')
  const [eligibleFilter, setEligibleFilter] = useState<'all' | 'eligible' | 'not_eligible'>('all')

  const filteredStudents = STUDENT_DATA.filter(s => {
    const matchesStatus = statusFilter === 'all' || s.status === statusFilter
    const matchesBatch = batchFilter === 'all' || s.batch === batchFilter
    const matchesEligible = eligibleFilter === 'all' || (eligibleFilter === 'eligible' && s.eligible) || (eligibleFilter === 'not_eligible' && !s.eligible)
    return matchesStatus && matchesBatch && matchesEligible
  })

  const stats = {
    total: STUDENT_DATA.length,
    active: STUDENT_DATA.filter(s => s.status === 'active').length,
    atRisk: STUDENT_DATA.filter(s => s.status === 'at_risk').length,
    eligible: STUDENT_DATA.filter(s => s.eligible).length,
    notEligible: STUDENT_DATA.filter(s => !s.eligible).length,
    feePending: STUDENT_DATA.filter(s => s.feeStatus === 'pending').length,
    hostel: STUDENT_DATA.filter(s => s.hostelStatus === 'hostel').length,
    dayScholar: STUDENT_DATA.filter(s => s.hostelStatus === 'day_scholar').length,
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Student Management</h2>
          <p className="text-sm text-slate-500 mt-1">Manage and monitor all students</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 shadow-lg shadow-blue-600/20">
          <Download className="w-4 h-4" /> Export Data
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Students" value={stats.total} icon={Users} color="blue" />
        <StatCard label="Active" value={stats.active} icon={CheckCircle} color="green" />
        <StatCard label="At Risk" value={stats.atRisk} icon={AlertTriangle} color="red" />
        <StatCard label="Exam Eligible" value={stats.eligible} icon={Award} color="purple" />
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-xs text-slate-500 mr-2">Status:</span>
        <button onClick={() => setStatusFilter('all')} className={cn("px-3 py-1.5 rounded-lg text-xs font-medium", statusFilter === 'all' ? "bg-slate-800 text-white" : "bg-white text-slate-600 border border-slate-200")}>All</button>
        <button onClick={() => setStatusFilter('active')} className={cn("px-3 py-1.5 rounded-lg text-xs font-medium", statusFilter === 'active' ? "bg-green-600 text-white" : "bg-white text-slate-600 border border-slate-200")}>Active</button>
        <button onClick={() => setStatusFilter('at_risk')} className={cn("px-3 py-1.5 rounded-lg text-xs font-medium", statusFilter === 'at_risk' ? "bg-red-600 text-white" : "bg-white text-slate-600 border border-slate-200")}>At Risk</button>
        <div className="border-l border-slate-200 mx-2" />
        <span className="text-xs text-slate-500 mr-2">Batch:</span>
        <select value={batchFilter} onChange={(e) => setBatchFilter(e.target.value)} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white border border-slate-200">
          <option value="all">All Batches</option>
          <option value="CSE-AIML">CSE-AIML</option>
          <option value="CSE">CSE</option>
          <option value="IT">IT</option>
        </select>
        <div className="border-l border-slate-200 mx-2" />
        <span className="text-xs text-slate-500 mr-2">Eligibility:</span>
        <button onClick={() => setEligibleFilter('all')} className={cn("px-3 py-1.5 rounded-lg text-xs font-medium", eligibleFilter === 'all' ? "bg-slate-800 text-white" : "bg-white text-slate-600 border border-slate-200")}>All</button>
        <button onClick={() => setEligibleFilter('eligible')} className={cn("px-3 py-1.5 rounded-lg text-xs font-medium", eligibleFilter === 'eligible' ? "bg-green-600 text-white" : "bg-white text-slate-600 border border-slate-200")}>Eligible</button>
        <button onClick={() => setEligibleFilter('not_eligible')} className={cn("px-3 py-1.5 rounded-lg text-xs font-medium", eligibleFilter === 'not_eligible' ? "bg-red-600 text-white" : "bg-white text-slate-600 border border-slate-200")}>Not Eligible</button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left text-xs font-semibold text-slate-600 px-4 py-3">Student</th>
                <th className="text-left text-xs font-semibold text-slate-600 px-4 py-3">Batch</th>
                <th className="text-center text-xs font-semibold text-slate-600 px-4 py-3">Attendance</th>
                <th className="text-center text-xs font-semibold text-slate-600 px-4 py-3">CGPA</th>
                <th className="text-center text-xs font-semibold text-slate-600 px-4 py-3">Eligible</th>
                <th className="text-center text-xs font-semibold text-slate-600 px-4 py-3">Fee Status</th>
                <th className="text-center text-xs font-semibold text-slate-600 px-4 py-3">Hostel</th>
                <th className="text-center text-xs font-semibold text-slate-600 px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold",
                        student.status === 'active' ? "bg-green-500" : "bg-red-500"
                      )}>
                        {student.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">{student.name}</p>
                        <p className="text-[10px] text-slate-500">{student.roll}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-slate-700">{student.batch}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={cn(
                      "text-sm font-medium",
                      student.attendance >= 75 ? "text-green-600" : student.attendance >= 65 ? "text-amber-600" : "text-red-600"
                    )}>{student.attendance}%</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="text-sm font-medium text-slate-900">{student.cgpa}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {student.eligible ? (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600"><CheckIcon className="w-3 h-3" /> Eligible</span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-red-600"><XCircle className="w-3 h-3" /> Not Eligible</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={cn(
                      "text-xs font-medium px-2 py-1 rounded-full",
                      student.feeStatus === 'paid' ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                    )}>{student.feeStatus === 'paid' ? 'Paid' : 'Pending'}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="text-xs text-slate-600">{student.hostelStatus === 'hostel' ? 'Hostel' : 'Day Scholar'}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={cn(
                      "text-xs font-medium px-2 py-1 rounded-full",
                      student.status === 'active' ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    )}>{student.status === 'active' ? 'Active' : 'At Risk'}</span>
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
