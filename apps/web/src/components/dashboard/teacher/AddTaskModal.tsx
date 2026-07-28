'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ClipboardList, X } from 'lucide-react'
import { apiClient } from '@/lib/api-client'

interface AddTaskModalProps {
  isOpen: boolean
  onClose: () => void
  batches?: { id: string; name: string }[]
  subjects?: string[]
}

export function AddTaskModal({ isOpen, onClose, batches = [], subjects = [] }: AddTaskModalProps) {
  const [title, setTitle] = useState('')
  const [batch, setBatch] = useState('')
  const [subject, setSubject] = useState('')
  const [priority, setPriority] = useState('MEDIUM')
  const [deadline, setDeadline] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const validate = (): boolean => {
    const errors: Record<string, string> = {}
    if (!title.trim()) errors.title = 'Task title is required'
    if (!deadline) errors.deadline = 'Deadline is required'
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return

    setSubmitting(true)
    setError(null)

    try {
      const response = await apiClient.post('/tasks', {
        title: title.trim(),
        category: subject || 'General',
        priority,
        dueDate: deadline,
        batchName: batch || 'All',
        status: 'created',
      })

      if (response.success) {
        setTitle('')
        setBatch('')
        setSubject('')
        setPriority('MEDIUM')
        setDeadline('')
        setFieldErrors({})
        onClose()
      } else {
        setError(response.error || 'Failed to create task')
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
        <div className="px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-amber-500 to-orange-500">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <ClipboardList className="w-5 h-5" /> Assign Task
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
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Task Title *</label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => { setTitle(e.target.value); setFieldErrors(prev => { const n = {...prev}; delete n.title; return n; }) }}
              placeholder="Enter task title"
              className={`w-full px-4 py-2.5 border ${fieldErrors.title ? 'border-red-400' : 'border-slate-200'} rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-600/20`}
            />
            {fieldErrors.title && <p className="text-[10px] text-red-500 mt-0.5">{fieldErrors.title}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Batch</label>
              <select 
                value={batch}
                onChange={(e) => setBatch(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-600/20"
              >
                <option value="">All Batches</option>
                {batches.map((b) => (
                  <option key={b.id} value={b.name}>{b.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Subject</label>
              <select 
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-600/20"
              >
                <option value="">Select Subject</option>
                {subjects.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Priority</label>
              <select 
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-600/20"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="CRITICAL">Critical</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Deadline *</label>
              <input 
                type="date" 
                value={deadline}
                onChange={(e) => { setDeadline(e.target.value); setFieldErrors(prev => { const n = {...prev}; delete n.deadline; return n; }) }}
                className={`w-full px-4 py-2.5 border ${fieldErrors.deadline ? 'border-red-400' : 'border-slate-200'} rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-600/20`}
              />
              {fieldErrors.deadline && <p className="text-[10px] text-red-500 mt-0.5">{fieldErrors.deadline}</p>}
            </div>
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
            className="px-5 py-2.5 bg-amber-600 text-white text-sm font-medium rounded-xl hover:bg-amber-700 transition-colors shadow-lg shadow-amber-600/20 disabled:opacity-50"
          >
            {submitting ? 'Assigning...' : 'Assign Task'}
          </button>
        </div>
      </motion.div>
    </div>
  )
}
