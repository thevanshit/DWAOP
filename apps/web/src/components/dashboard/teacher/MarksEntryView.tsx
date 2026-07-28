'use client'

import { useState } from 'react'
import { Save } from 'lucide-react'
import { cn } from '@/lib/utils'
import { apiClient } from '@/lib/api-client'
import type { ViewBatch, ViewAssignment } from './TeacherDashboardProvider'
import type { MarksEntry } from '@/hooks/useTeacherDashboard'

interface MarksEntryViewProps {
  batches: ViewBatch[]
  selectedBatch: string
  onSelectBatch: (id: string) => void
  assignments: ViewAssignment[]
  selectedAssignment: number | null
  onSelectAssignment: (id: number | null) => void
  marksData: MarksEntry[]
}

export function MarksEntryView({ batches, selectedBatch, onSelectBatch, assignments, selectedAssignment, onSelectAssignment, marksData }: MarksEntryViewProps) {
  const assignment = assignments.find((a) => a.id === selectedAssignment)
  const quickGrades = ['A', 'B', 'C', 'D', 'E']

  // Controlled marks state
  const [marksInput, setMarksInput] = useState<Record<string | number, string>>({})
  const [gradesInput, setGradesInput] = useState<Record<string | number, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [validationErrors, setValidationErrors] = useState<Record<string | number, string>>({})

  const getMarkValue = (studentId: string | number): string => {
    if (marksInput[studentId] !== undefined) return marksInput[studentId]
    const student = marksData.find((s) => s.studentId === studentId)
    if (student?.marks !== null && student?.marks !== undefined) return String(student.marks)
    return ''
  }

  const handleMarksChange = (studentId: string | number, value: string) => {
    setMarksInput(prev => ({ ...prev, [String(studentId)]: value }))
    // Clear validation error on change
    if (validationErrors[String(studentId)]) {
      setValidationErrors(prev => {
        const next = { ...prev }
        delete next[String(studentId)]
        return next
      })
    }
  }

  const handleGradeSelect = (studentId: string | number, grade: string) => {
    setGradesInput(prev => ({ ...prev, [String(studentId)]: grade }))
  }

  const handleSaveAll = async () => {
    if (!assignment) return

    // Validate
    const errors: Record<string | number, string> = {}
    let hasErrors = false

    marksData.forEach((student) => {
      const val = getMarkValue(String(student.studentId))
      if (val !== '') {
        const numVal = Number(val)
        if (isNaN(numVal) || numVal < 0) {
          errors[String(student.studentId)] = 'Invalid marks'
          hasErrors = true
        } else if (numVal > assignment.maxMarks) {
          errors[String(student.studentId)] = `Max ${assignment.maxMarks}`
          hasErrors = true
        }
      }
    })

    if (hasErrors) {
      setValidationErrors(errors)
      return
    }

    setSubmitting(true)
    setSubmitError(null)
    setSubmitSuccess(false)

    try {
      const entries = marksData.map((student) => {
        const marks = getMarkValue(String(student.studentId))
        const grade = gradesInput[String(student.studentId)] || student.grade || undefined
        return {
          studentId: student.studentId,
          marks: marks !== '' ? Number(marks) : null,
          grade: grade || null,
        }
      })

      const response = await apiClient.post('/marks/entry', {
        assignmentId: selectedAssignment,
        batchId: selectedBatch,
        entries,
      })

      if (response.success) {
        setSubmitSuccess(true)
        setTimeout(() => setSubmitSuccess(false), 3000)
      } else {
        setSubmitError(response.error || 'Failed to save marks')
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
        <h2 className="text-xl font-bold text-slate-900">Marks Entry</h2>
      </div>

      {/* Success/Error Messages */}
      {submitSuccess && (
        <div className="px-4 py-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700 font-medium">
          Marks saved successfully!
        </div>
      )}
      {submitError && (
        <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 font-medium">
          {submitError}
        </div>
      )}

      <div className="flex gap-3">
        <select 
          value={selectedBatch}
          onChange={(e) => onSelectBatch(e.target.value)}
          className="flex-1 h-11 px-4 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-600/20 shadow-sm"
        >
          {batches.map((b) => (
            <option key={b.id} value={b.id}>{b.name}</option>
          ))}
        </select>
        <select 
          value={selectedAssignment || ''}
          onChange={(e) => onSelectAssignment(e.target.value ? Number(e.target.value) : null)}
          className="flex-1 h-11 px-4 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-600/20 shadow-sm"
        >
          <option value="">Select Assignment</option>
          {assignments.filter((a) => a.batch === batches.find((b) => b.id === selectedBatch)?.name).map((a) => (
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
                <p className="text-xs text-slate-500">{assignment.batch} &bull; Max Marks: {assignment.maxMarks}</p>
              </div>
              <button 
                onClick={handleSaveAll}
                disabled={submitting}
                className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" /> {submitting ? 'Saving...' : 'Save All'}
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
              {marksData.map((student) => (
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
                    {gradesInput[String(student.studentId)] || student.grade ? (
                      <span className={cn("inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold",
                        (gradesInput[String(student.studentId)] || student.grade) === 'A' ? "bg-green-100 text-green-700" :
                        (gradesInput[String(student.studentId)] || student.grade) === 'B' ? "bg-blue-100 text-blue-700" :
                        (gradesInput[String(student.studentId)] || student.grade) === 'C' ? "bg-amber-100 text-amber-700" :
                        "bg-red-100 text-red-700"
                      )}>
                        {gradesInput[String(student.studentId)] || student.grade}
                      </span>
                    ) : (
                      <div className="flex items-center justify-center gap-0.5">
                        {quickGrades.map(g => (
                          <button 
                            key={g} 
                            onClick={() => handleGradeSelect(student.studentId, g)}
                            className="w-6 h-6 text-[10px] font-medium text-slate-500 hover:bg-slate-100 rounded"
                          >
                            {g}
                          </button>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col items-center">
                      <input 
                        type="number"
                        value={getMarkValue(String(student.studentId))}
                        onChange={(e) => handleMarksChange(student.studentId, e.target.value)}
                        min={0}
                        max={assignment.maxMarks}
                        placeholder="--"
                        className={cn(
                          "w-16 mx-auto text-center px-2 py-1.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20",
                          validationErrors[String(student.studentId)] ? "border-red-400 bg-red-50" : "border-slate-200"
                        )}
                      />
                      {validationErrors[String(student.studentId)] && (
                        <span className="text-[10px] text-red-500 mt-0.5">{validationErrors[String(student.studentId)]}</span>
                      )}
                    </div>
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
