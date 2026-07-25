'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { FileText, X, Send, Upload } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useStudentDashboardData } from './StudentDashboardProvider'

export default function AssignmentsTab() {
  const { assignments } = useStudentDashboardData()
  const [filter, setFilter] = useState<'all' | 'pending' | 'submitted' | 'evaluated'>('all')
  const [showSubmitModal, setShowSubmitModal] = useState(false)
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null)
  const [submissionType, setSubmissionType] = useState<'file' | 'text' | 'github'>('file')
  const [submissionText, setSubmissionText] = useState('')
  const [githubLink, setGithubLink] = useState('')

  const filteredAssignments = filter === 'all' ? assignments : assignments.filter(a => a.status === filter)

  const handleSubmit = () => {
    setShowSubmitModal(false)
    setSelectedAssignment(null)
    setSubmissionText('')
    setGithubLink('')
  }

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'pending': return { bg: 'bg-amber-100 text-amber-700', label: 'Pending' }
      case 'submitted': return { bg: 'bg-blue-100 text-blue-700', label: 'Submitted' }
      case 'evaluated': return { bg: 'bg-green-100 text-green-700', label: 'Evaluated' }
      case 'late': return { bg: 'bg-red-100 text-red-700', label: 'Late' }
      default: return { bg: 'bg-slate-100 text-slate-700', label: status }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">Assignments</h2>
        <div className="flex gap-2">
          {(['all', 'pending', 'submitted', 'evaluated'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors capitalize",
                filter === f ? "bg-slate-800 text-white" : "bg-white text-slate-600 border border-slate-200"
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filteredAssignments.map((a) => (
          <div key={a.id} className={cn("bg-white rounded-2xl border p-4 shadow-sm", a.status === 'late' ? "border-red-300 bg-red-50/30" : "border-slate-200")}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-slate-900">{a.title}</h3>
                  <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-medium">{a.subject}</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">{a.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={cn("text-xs font-medium px-2.5 py-1 rounded-lg", getStatusStyle(a.status).bg)}>
                  {getStatusStyle(a.status).label}
                </span>
                <span className="text-xs text-slate-500">Due: {a.dueDate}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-xs text-slate-500">
                <span>Max Marks: {a.maxMarks}</span>
                {a.marks !== undefined && <span className="text-green-600 font-medium">Marks: {a.marks}</span>}
              </div>
              {a.status === 'pending' && (
                <button 
                  onClick={() => { setSelectedAssignment(a); setShowSubmitModal(true); }}
                  className="px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700"
                >
                  Submit Now
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Submit Assignment Modal */}
      {showSubmitModal && selectedAssignment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Submit Assignment</h3>
                <p className="text-sm text-slate-500">{selectedAssignment.title}</p>
              </div>
              <button 
                onClick={() => setShowSubmitModal(false)}
                className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-800">{selectedAssignment.subject}</p>
                  <p className="text-xs text-slate-500">Due: {selectedAssignment.dueDate} • Max: {selectedAssignment.maxMarks} marks</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">Submission Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['file', 'text', 'github'] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => setSubmissionType(type)}
                      className={cn(
                        "px-3 py-2.5 rounded-xl text-sm font-medium transition-all capitalize",
                        submissionType === type 
                          ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25" 
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      )}
                    >
                      {type === 'github' ? 'GitHub' : type === 'text' ? 'Text' : 'File'}
                    </button>
                  ))}
                </div>
              </div>

              {submissionType === 'file' && (
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-blue-400 hover:bg-blue-50/30 transition-colors cursor-pointer">
                  <Upload className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm font-medium text-slate-700">Click to upload file</p>
                  <p className="text-xs text-slate-500 mt-1">PDF, DOC, or ZIP files only</p>
                </div>
              )}

              {submissionType === 'text' && (
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">Your Answer</label>
                  <textarea
                    value={submissionText}
                    onChange={(e) => setSubmissionText(e.target.value)}
                    placeholder="Type your answer here..."
                    className="w-full h-40 px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>
              )}

              {submissionType === 'github' && (
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">GitHub Repository Link</label>
                  <input
                    type="url"
                    value={githubLink}
                    onChange={(e) => setGithubLink(e.target.value)}
                    placeholder="https://github.com/username/repo"
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button 
                  onClick={() => setShowSubmitModal(false)}
                  className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 text-sm font-medium rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSubmit}
                  className="flex-1 px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Submit
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
