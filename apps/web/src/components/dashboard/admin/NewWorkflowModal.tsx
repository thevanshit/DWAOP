'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Layers, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FormErrors {
  title?: string
  assignee?: string
  description?: string
}

export function NewWorkflowModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [title, setTitle] = useState('')
  const [type, setType] = useState<string>('student')
  const [assignee, setAssignee] = useState('')
  const [priority, setPriority] = useState('medium')
  const [description, setDescription] = useState('')
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen) return null

  const validate = (): boolean => {
    const newErrors: FormErrors = {}
    if (!title.trim()) newErrors.title = 'Workflow title is required'
    else if (title.trim().length < 3) newErrors.title = 'Title must be at least 3 characters'
    else if (title.trim().length > 200) newErrors.title = 'Title must be under 200 characters'

    if (!assignee.trim()) newErrors.assignee = 'Assignee is required'
    else if (assignee.trim().length < 2) newErrors.assignee = 'Assignee name must be at least 2 characters'

    if (!description.trim()) newErrors.description = 'Description is required'
    else if (description.trim().length < 10) newErrors.description = 'Description must be at least 10 characters'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return

    setIsSubmitting(true)
    try {
      // TODO: Replace with actual API call
      // await apiClient.post('/workflows', { title, type, assignee, priority, description })
      await new Promise(resolve => setTimeout(resolve, 500))
      console.log('Creating workflow:', { title, type, assignee, priority, description })
      alert(`Workflow "${title}" created successfully for ${type}`)
      handleClose()
    } catch (err) {
      alert('Failed to create workflow. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setTitle('')
    setType('student')
    setAssignee('')
    setPriority('medium')
    setDescription('')
    setErrors({})
    setIsSubmitting(false)
    onClose()
  }

  const isFormValid = title.trim().length >= 3 && assignee.trim().length >= 2 && description.trim().length >= 10

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
              <Layers className="w-5 h-5" /> Create New Workflow
            </h3>
            <button onClick={handleClose} type="button" className="p-1.5 hover:bg-white/20 rounded-lg transition-colors" aria-label="Close modal">
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Workflow Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => { setTitle(e.target.value); if (errors.title) setErrors(prev => ({ ...prev, title: undefined })) }}
              placeholder="Enter workflow title"
              className={cn(
                "w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600",
                errors.title ? "border-red-400 bg-red-50" : "border-slate-200"
              )}
              aria-label="Workflow title"
              aria-required="true"
            />
            {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
              >
                <option value="student">Student</option>
                <option value="faculty">Faculty</option>
                <option value="admin">Administration</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Assignee *</label>
            <input
              type="text"
              value={assignee}
              onChange={(e) => { setAssignee(e.target.value); if (errors.assignee) setErrors(prev => ({ ...prev, assignee: undefined })) }}
              placeholder="Enter assignee name"
              className={cn(
                "w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600",
                errors.assignee ? "border-red-400 bg-red-50" : "border-slate-200"
              )}
              aria-label="Assignee"
              aria-required="true"
            />
            {errors.assignee && <p className="text-xs text-red-500 mt-1">{errors.assignee}</p>}
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Description *</label>
            <textarea
              value={description}
              onChange={(e) => { setDescription(e.target.value); if (errors.description) setErrors(prev => ({ ...prev, description: undefined })) }}
              placeholder="Enter workflow description"
              rows={3}
              className={cn(
                "w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 resize-none",
                errors.description ? "border-red-400 bg-red-50" : "border-slate-200"
              )}
              aria-label="Workflow description"
              aria-required="true"
            />
            {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
          </div>
        </div>

        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
          <button
            onClick={handleClose}
            type="button"
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isFormValid || isSubmitting}
            type="button"
            className={cn(
              "px-5 py-2.5 text-sm font-medium rounded-xl transition-colors shadow-lg",
              isFormValid && !isSubmitting
                ? "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-600/20"
                : "bg-slate-300 text-slate-500 cursor-not-allowed"
            )}
          >
            {isSubmitting ? 'Creating...' : 'Create Workflow'}
          </button>
        </div>
      </motion.div>
    </div>
  )
}
