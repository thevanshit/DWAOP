'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Check, X, CheckCircle2, Clock3, Save } from 'lucide-react'
import { apiClient } from '@/lib/api-client'
import type { ViewBatch, ViewStudent } from './TeacherDashboardProvider'

interface AttendanceViewProps {
  batches: ViewBatch[]
  selectedBatch: string
  onSelectBatch: (id: string) => void
  students: ViewStudent[]
  attendance: Record<string, 'present' | 'absent' | 'late'>
  onMarkAttendance: (studentId: string | number, status: 'present' | 'absent' | 'late') => void
  onMarkAllPresent: () => void
  onMarkAllAbsent: () => void
}

export function AttendanceView({ batches, selectedBatch, onSelectBatch, students, attendance, onMarkAttendance, onMarkAllPresent, onMarkAllAbsent }: AttendanceViewProps) {
  const [submitting, setSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const markedCount = Object.keys(attendance).length
  const totalStudents = students.length

  const handleSubmitAttendance = async () => {
    if (markedCount === 0) {
      setSubmitError('Please mark attendance for at least one student')
      return
    }
    setSubmitting(true)
    setSubmitError(null)
    setSubmitSuccess(false)

    try {
      const records = Object.entries(attendance).map(([studentId, status]) => ({
        studentId: Number(studentId),
        status,
      }))

      const response = await apiClient.post('/attendance/records', {
        sessionId: selectedBatch,
        records,
      })

      if (response.success) {
        setSubmitSuccess(true)
        setTimeout(() => setSubmitSuccess(false), 3000)
      } else {
        setSubmitError(response.error || 'Failed to save attendance')
      }
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : 'Network error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">Attendance</h2>
        <select 
          value={selectedBatch}
          onChange={(e) => onSelectBatch(e.target.value)}
          className="h-11 px-4 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-600/20 shadow-sm"
        >
          {batches.map((b) => (
            <option key={b.id} value={b.id}>{b.name} ({b.students} students)</option>
          ))}
        </select>
      </div>

      {/* Success/Error Messages */}
      {submitSuccess && (
        <div className="px-4 py-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700 font-medium">
          Attendance saved successfully!
        </div>
      )}
      {submitError && (
        <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 font-medium">
          {submitError}
        </div>
      )}

      {totalStudents > 0 && (
        <>
          {/* Sticky Action Bar */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-xs text-slate-500">Marked</p>
                  <p className="text-xl font-bold text-slate-900">{markedCount} / {totalStudents}</p>
                </div>
                <div className="w-32 bg-slate-100 rounded-full h-2">
                  <div className={cn("h-2 rounded-full transition-all", markedCount === totalStudents ? "bg-green-500" : "bg-blue-600")} style={{ width: `${totalStudents > 0 ? (markedCount / totalStudents) * 100 : 0}%` }} />
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={onMarkAllPresent} className="flex items-center gap-1.5 px-3 py-2 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700">
                  <Check className="w-3.5 h-3.5" /> All Present
                </button>
                <button onClick={onMarkAllAbsent} className="flex items-center gap-1.5 px-3 py-2 bg-red-600 text-white rounded-lg text-xs font-medium hover:bg-red-700">
                  <X className="w-3.5 h-3.5" /> All Absent
                </button>
                <button 
                  onClick={handleSubmitAttendance}
                  disabled={submitting}
                  className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" /> {submitting ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          </div>

          {/* Student List */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Roll No</th>
                  <th className="text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Student Name</th>
                  <th className="text-center text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Status</th>
                  <th className="text-center text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-sm font-medium text-slate-900">{student.roll}</td>
                    <td className="px-4 py-3 text-sm text-slate-700">{student.name}</td>
                    <td className="px-4 py-3 text-center">
                      {attendance[String(student.id)] ? (
                        <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
                          attendance[String(student.id)] === 'present' ? "bg-green-100 text-green-700" :
                          attendance[String(student.id)] === 'absent' ? "bg-red-100 text-red-700" :
                          "bg-amber-100 text-amber-700"
                        )}>
                          {attendance[String(student.id)] === 'present' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                          {attendance[String(student.id)].charAt(0).toUpperCase() + attendance[String(student.id)].slice(1)}
                        </span>
                      ) : (
                        <span className="inline-flex items-center w-2 h-2 rounded-full bg-slate-300" />
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => onMarkAttendance(student.id, 'present')} className={cn("p-1.5 rounded transition-colors", attendance[String(student.id)] === 'present' ? "bg-green-100 text-green-700" : "hover:bg-green-50 text-slate-400")}><Check className="w-4 h-4" /></button>
                        <button onClick={() => onMarkAttendance(student.id, 'absent')} className={cn("p-1.5 rounded transition-colors", attendance[String(student.id)] === 'absent' ? "bg-red-100 text-red-700" : "hover:bg-red-50 text-slate-400")}><X className="w-4 h-4" /></button>
                        <button onClick={() => onMarkAttendance(student.id, 'late')} className={cn("p-1.5 rounded transition-colors", attendance[String(student.id)] === 'late' ? "bg-amber-100 text-amber-700" : "hover:bg-amber-50 text-slate-400")}><Clock3 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}
