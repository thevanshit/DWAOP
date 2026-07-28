'use client'

import { useState } from 'react'
import { Plus, Pin, X } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { apiClient } from '@/lib/api-client'
import type { Announcement } from '@/hooks/useTeacherDashboard'

interface AnnouncementsViewProps {
  type: 'toStudents' | 'fromAdmin'
  setType: (type: 'toStudents' | 'fromAdmin') => void
  announcements: { toStudents: Announcement[]; fromAdmin: Announcement[] }
}

export function AnnouncementsView({ type, setType, announcements }: AnnouncementsViewProps) {
  const [showNewForm, setShowNewForm] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newContent, setNewContent] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCreateAnnouncement = async () => {
    if (!newTitle.trim() || !newContent.trim()) {
      setError('Please fill in title and content')
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      const response = await apiClient.post('/announcements', {
        title: newTitle,
        content: newContent,
        audience: 'students',
      })

      if (response.success) {
        setShowNewForm(false)
        setNewTitle('')
        setNewContent('')
      } else {
        setError(response.error || 'Failed to create announcement')
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Network error')
    } finally {
      setSubmitting(false)
    }
  }

  const currentAnnouncements = type === 'toStudents' ? announcements.toStudents : announcements.fromAdmin

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">Announcements</h2>
        {type === 'toStudents' && (
          <button 
            onClick={() => setShowNewForm(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
          >
            <Plus className="w-4 h-4" /> New Announcement
          </button>
        )}
      </div>

      <div className="flex gap-2">
        <button onClick={() => setType('toStudents')} className={cn("px-4 py-2.5 rounded-xl text-sm font-medium transition-colors", type === 'toStudents' ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "bg-white text-slate-600 border border-slate-200")}>
          To Students
        </button>
        <button onClick={() => setType('fromAdmin')} className={cn("px-4 py-2.5 rounded-xl text-sm font-medium transition-colors", type === 'fromAdmin' ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "bg-white text-slate-600 border border-slate-200")}>
          From Admin
        </button>
      </div>

      {/* New Announcement Form */}
      {showNewForm && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-blue-200 p-5 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900">New Announcement</h3>
            <button onClick={() => { setShowNewForm(false); setError(null) }} className="p-1 hover:bg-slate-100 rounded-lg">
              <X className="w-4 h-4 text-slate-500" />
            </button>
          </div>
          {error && (
            <div className="mb-3 px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
              {error}
            </div>
          )}
          <div className="space-y-3">
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Announcement title"
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20"
            />
            <textarea
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="Announcement content"
              rows={3}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 resize-none"
            />
            <div className="flex justify-end gap-2">
              <button 
                onClick={() => { setShowNewForm(false); setError(null) }}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button 
                onClick={handleCreateAnnouncement}
                disabled={submitting}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 disabled:opacity-50"
              >
                {submitting ? 'Publishing...' : 'Publish'}
              </button>
            </div>
          </div>
        </motion.div>
      )}

      <div className="space-y-3">
        {currentAnnouncements.map((announcement) => (
          <div key={announcement.id} className={cn("bg-white rounded-2xl border p-5 shadow-sm", 
            announcement.pinned ? "border-blue-200 bg-blue-50/30" : "border-slate-200")}>
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                {announcement.pinned && <Pin className="w-3.5 h-3.5 text-blue-600 fill-blue-600" />}
                <h3 className="font-medium text-slate-900">{announcement.title}</h3>
              </div>
              <div className="flex items-center gap-2">
                <span className={cn("text-[10px] px-2 py-1 rounded-lg font-medium",
                  announcement.status === 'active' ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700")}>
                  {announcement.status === 'active' ? 'Active' : 'Expiring'}
                </span>
                {!announcement.read && <span className="w-2 h-2 bg-blue-600 rounded-full" />}
              </div>
            </div>
            <p className="text-sm text-slate-600 mb-3">{announcement.content}</p>
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-500">From: {announcement.from}</p>
              <p className="text-xs text-slate-400">{announcement.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
