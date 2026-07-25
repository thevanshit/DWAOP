'use client'

import { Calendar, CheckCircle, AlertCircle, XCircle, Target } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useStudentDashboardData } from './StudentDashboardProvider'

export default function AttendanceTab() {
  const { subjects } = useStudentDashboardData()
  const totalClasses = subjects.reduce((sum, s) => sum + s.totalClasses, 0)
  const totalPresent = subjects.reduce((sum, s) => sum + s.presentClasses, 0)
  const overallAttendance = Math.round((totalPresent / totalClasses) * 100)

  const getEligibilityStatus = (attendance: number) => {
    if (attendance >= 75) return { status: 'Eligible', color: 'green', icon: CheckCircle }
    if (attendance >= 65) return { status: 'At Risk', color: 'yellow', icon: AlertCircle }
    return { status: 'Not Eligible', color: 'red', icon: XCircle }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-slate-900">Attendance Tracking</h2>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200/60 p-5 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-slate-500">Overall Attendance</span>
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-900">{overallAttendance}%</p>
          <p className="text-xs text-slate-400 mt-1">{totalPresent}/{totalClasses} classes attended</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200/60 p-5 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-slate-500">Exam Eligibility</span>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${overallAttendance >= 75 ? 'bg-green-50 text-green-600' : overallAttendance >= 65 ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'}`}>
              {overallAttendance >= 75 ? <CheckCircle className="w-5 h-5" /> : overallAttendance >= 65 ? <AlertCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={cn("text-xl font-bold", overallAttendance >= 75 ? "text-green-600" : overallAttendance >= 65 ? "text-amber-600" : "text-red-600")}>
              {overallAttendance >= 75 ? 'Eligible' : overallAttendance >= 65 ? 'At Risk' : 'Not Eligible'}
            </span>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200/60 p-5 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-slate-500">Required for 75%</span>
            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
              <Target className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-900">
            {Math.max(0, Math.ceil((0.75 * totalClasses) - totalPresent))}
          </p>
          <p className="text-xs text-slate-400 mt-1">more classes needed</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/60 p-5 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
        <h3 className="text-base font-semibold text-slate-900 mb-4">Subject-wise Attendance</h3>
        <div className="space-y-4">
          {subjects.map((subject) => {
            const eligibility = getEligibilityStatus(subject.attendance)
            return (
              <div key={subject.id} className="p-4 bg-slate-50/50 rounded-xl hover:bg-slate-50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{subject.name}</p>
                    <p className="text-xs text-slate-500">{subject.code} • {subject.presentClasses}/{subject.totalClasses} classes</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={cn("text-sm font-bold", eligibility.color === 'green' ? "text-green-600" : eligibility.color === 'yellow' ? "text-amber-600" : "text-red-600")}>
                      {subject.attendance}%
                    </span>
                    <eligibility.icon className={cn("w-4 h-4", eligibility.color === 'green' ? "text-green-600" : eligibility.color === 'yellow' ? "text-amber-600" : "text-red-600")} />
                  </div>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div 
                    className={cn("h-2 rounded-full transition-all", eligibility.color === 'green' ? "bg-green-500" : eligibility.color === 'yellow' ? "bg-amber-500" : "bg-red-500")} 
                    style={{ width: `${subject.attendance}%` }} 
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
