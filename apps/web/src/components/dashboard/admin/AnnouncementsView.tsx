'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Plus, Megaphone, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAdminDashboardContext } from './AdminDashboardProvider'

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
}

interface FormErrors {
  title?: string
  message?: string
}

export function AnnouncementsView() {
  const { announcements } = useAdminDashboardContext()
  const [targetFilter, setTargetFilter] = useState<'all' | 'students' | 'faculty' | 'both'>('all')
  const [showModal, setShowModal] = useState(false)
  const [formTitle, setFormTitle] = useState('')
  const [formTarget, setFormTarget] = useState<'students' | 'faculty' | 'both'>('both')
  const [formMessage, setFormMessage] = useState('')
  const [formErrors, setFormErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const filteredAnnouncements = useMemo(() =>
    announcements.filter(a => targetFilter === 'all' || a.target === targetFilter || a.target === 'both'),
    [announcements, targetFilter]
  )

  const validateForm = (): boolean => {
    const errors: FormErrors = {}
    if (!formTitle.trim()) errors.title = 'Title is required'
    else if (formTitle.trim().length < 3) errors.title = 'Title must be at least 3 characters'
    else if (formTitle.trim().length > 200) errors.title = 'Title must be under 200 characters'

    if (!formMessage.trim()) errors.message = 'Message is required'
    else if (formMessage.trim().length < 10) errors.message = 'Message must be at least 10 characters'
    else if (formMessage.trim().length > 2000) errors.message = 'Message must be under 2000 characters'

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handlePublish = async () => {
    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      // TODO: Replace with actual API call
      // await apiClient.post('/announcements', { title: formTitle, target: formTarget, message: formMessage })
      await new Promise(resolve => setTimeout(resolve, 500))
      console.log('Published announcement:', { title: formTitle, target: formTarget, message: formMessage })
      alert(`Announcement "${formTitle}" published successfully!`)
      handleCloseModal()
    } catch (err) {
      alert('Failed to publish announcement. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setFormTitle('')
    setFormTarget('both')
    setFormMessage('')
    setFormErrors({})
  }

  const isFormValid = formTitle.trim().length >= 3 && formMessage.trim().length >= 10

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Announcements</h2>
          <p className="text-sm text-slate-500 mt-1">Create and manage announcements for students and faculty</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          type="button"
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 shadow-lg shadow-blue-600/20"
        >
          <Plus className="w-4 h-4" /> New Announcement
        </button>
      </div>

      <div className="flex gap-2">
        <button onClick={() => setTargetFilter('all')} type="button" className={cn("px-3 py-1.5 rounded-lg text-xs font-medium", targetFilter === 'all' ? "bg-slate-800 text-white" : "bg-white text-slate-600 border border-slate-200")}>All</button>
        <button onClick={() => setTargetFilter('students')} type="button" className={cn("px-3 py-1.5 rounded-lg text-xs font-medium", targetFilter === 'students' ? "bg-blue-600 text-white" : "bg-white text-slate-600 border border-slate-200")}>Students</button>
        <button onClick={() => setTargetFilter('faculty')} type="button" className={cn("px-3 py-1.5 rounded-lg text-xs font-medium", targetFilter === 'faculty' ? "bg-green-600 text-white" : "bg-white text-slate-600 border border-slate-200")}>Faculty</button>
        <button onClick={() => setTargetFilter('both')} type="button" className={cn("px-3 py-1.5 rounded-lg text-xs font-medium", targetFilter === 'both' ? "bg-purple-600 text-white" : "bg-white text-slate-600 border border-slate-200")}>Both</button>
      </div>

      <div className="space-y-3">
        {filteredAnnouncements.map((announcement) => (
          <motion.div
            key={announcement.id}
            variants={itemVariants}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center text-white">
                  <Megaphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">{announcement.title}</h3>
                  <p className="text-sm text-slate-600 mt-1">{announcement.message}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className={cn(
                      "text-[10px] font-medium px-2 py-1 rounded-full",
                      announcement.target === 'students' ? "bg-blue-100 text-blue-700" :
                      announcement.target === 'faculty' ? "bg-green-100 text-green-700" :
                      "bg-purple-100 text-purple-700"
                    )}>
                      {announcement.target === 'both' ? 'Students & Faculty' : announcement.target}
                    </span>
                    <span className="text-xs text-slate-400">By {announcement.author} • {announcement.createdAt}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Create Announcement Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-blue-600 to-blue-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Megaphone className="w-5 h-5" /> Create Announcement
                </h3>
                <button onClick={handleCloseModal} type="button" className="p-1.5 hover:bg-white/20 rounded-lg transition-colors" aria-label="Close modal">
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">Title *</label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => { setFormTitle(e.target.value); if (formErrors.title) setFormErrors(prev => ({ ...prev, title: undefined })) }}
                  placeholder="Enter announcement title"
                  className={cn(
                    "w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600",
                    formErrors.title ? "border-red-400 bg-red-50" : "border-slate-200"
                  )}
                  aria-label="Announcement title"
                  aria-required="true"
                />
                {formErrors.title && <p className="text-xs text-red-500 mt-1">{formErrors.title}</p>}
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">Target Audience *</label>
                <select
                  value={formTarget}
                  onChange={(e) => setFormTarget(e.target.value as 'students' | 'faculty' | 'both')}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                >
                  <option value="students">Students</option>
                  <option value="faculty">Faculty</option>
                  <option value="both">Both</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">Message *</label>
                <textarea
                  value={formMessage}
                  onChange={(e) => { setFormMessage(e.target.value); if (formErrors.message) setFormErrors(prev => ({ ...prev, message: undefined })) }}
                  rows={3}
                  placeholder="Enter announcement message"
                  className={cn(
                    "w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 resize-none",
                    formErrors.message ? "border-red-400 bg-red-50" : "border-slate-200"
                  )}
                  aria-label="Announcement message"
                  aria-required="true"
                />
                {formErrors.message && <p className="text-xs text-red-500 mt-1">{formErrors.message}</p>}
              </div>
            </div>
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
              <button onClick={handleCloseModal} type="button" className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 rounded-xl transition-colors">Cancel</button>
              <button
                onClick={handlePublish}
                disabled={!isFormValid || isSubmitting}
                type="button"
                className={cn(
                  "px-5 py-2.5 text-sm font-medium rounded-xl transition-colors shadow-lg",
                  isFormValid && !isSubmitting
                    ? "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-600/20"
                    : "bg-slate-300 text-slate-500 cursor-not-allowed"
                )}
              >
                {isSubmitting ? 'Publishing...' : 'Publish'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
