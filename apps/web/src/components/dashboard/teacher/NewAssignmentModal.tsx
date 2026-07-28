'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { FileText, X } from 'lucide-react'
import { apiClient } from '@/lib/api-client'
import type { ViewBatch } from './TeacherDashboardProvider'

interface NewAssignmentModalProps {
  isOpen: boolean
  onClose: () => void
  batches: ViewBatch[]
}

export function NewAssignmentModal({ isOpen, onClose, batches }: NewAssignmentModalProps) {
  const [title, setTitle] = useState('')
  const [batch, setBatch] = useState(batches[0]?.id || '')
  const [subject, setSubject] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [maxMarks, setMaxMarks] = useState(20)
  const [description, setDescription] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const selectedBatch = batches.find(b => b.id === batch)

  const validate = (): boolean => {
    const errors: Record<string, string> = {}
    if (!title.trim()) errors.title = 'Title is required'
    if (!subject) errors.subject = 'Subject is required'
    if (!dueDate) errors.dueDate = 'Due date is required'
    if (maxMarks <= 0) errors.maxMarks = 'Max marks must be positive'
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return

    setSubmitting(true)
    setError(null)

    try {
      const response = await apiClient.post('/assignments', {
        title: title.trim(),
        batchId: batch,
        subjectName: subject,
        deadline: dueDate,
        maxMarks,
        description: description.trim(),
      })

      if (response.success) {
        // Reset form and close
        setTitle('')
        setSubject('')
        setDueDate('')
        setMaxMarks(20)
        setDescription('')
        setFieldErrors({})
        onClose()
      } else {
        setError(response.error || 'Failed to create assignment')
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Network error')
    } finally {
      setSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-blue-600 to-blue-700">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <FileText className="w-5 h-5" /> Create New Assignment
            </h3>
            <button onClick={onClose} className="p-1.5 hover:bg-white/20 rounded-lg transition-colors">
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
        
        <div className="p-6 space-y-4">
          {error && (
            <div className="px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Assignment Title *</label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => { setTitle(e.target.value); setFieldErrors(prev => { const n = {...prev}; delete n.title; return n; }) }}
              placeholder="Enter assignment title"
              className={`w-full px-4 py-2.5 border ${fieldErrors.title ? 'border-red-400' : 'border-slate-200'} rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20`}
            />
            {fieldErrors.title && <p className="text-[10px] text-red-500 mt-0.5">{fieldErrors.title}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Batch *</label>
              <select 
                value={batch}
                onChange={(e) => setBatch(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20"
              >
                {batches.map((b) => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Subject *</label>
              <select 
                value={subject}
                onChange={(e) => { setSubject(e.target.value); setFieldErrors(prev => { const n = {...prev}; delete n.subject; return n; }) }}
                className={`w-full px-4 py-2.5 border ${fieldErrors.subject ? 'border-red-400' : 'border-slate-200'} rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20`}
              >
                <option value="">Select Subject</option>
                {selectedBatch?.subjects.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              {fieldErrors.subject && <p className="text-[10px] text-red-500 mt-0.5">{fieldErrors.subject}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Due Date *</label>
              <input 
                type="date" 
                value={dueDate}
                onChange={(e) => { setDueDate(e.target.value); setFieldErrors(prev => { const n = {...prev}; delete n.dueDate; return n; }) }}
                className={`w-full px-4 py-2.5 border ${fieldErrors.dueDate ? 'border-red-400' : 'border-slate-200'} rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20`}
              />
              {fieldErrors.dueDate && <p className="text-[10px] text-red-500 mt-0.5">{fieldErrors.dueDate}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Max Marks *</label>
              <input 
                type="number" 
                value={maxMarks}
                onChange={(e) => { setMaxMarks(Number(e.target.value)); setFieldErrors(prev => { const n = {...prev}; delete n.maxMarks; return n; }) }}
                min={1}
                className={`w-full px-4 py-2.5 border ${fieldErrors.maxMarks ? 'border-red-400' : 'border-slate-200'} rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20`}
              />
              {fieldErrors.maxMarks && <p className="text-[10px] text-red-500 mt-0.5">{fieldErrors.maxMarks}</p>}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Description</label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter assignment description"
              rows={3}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 resize-none"
            />
          </div>
        </div>

        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
          <button 
            onClick={onClose}
            disabled={submitting}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmit}
            disabled={submitting}
            className="px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20 disabled:opacity-50"
          >
            {submitting ? 'Creating...' : 'Create Assignment'}
          </button>
        </div>
      </motion.div>
    </div>
  )
}
