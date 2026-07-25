'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Megaphone, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ANNOUNCEMENTS } from './data'

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
}

export function AnnouncementsView() {
  const [targetFilter, setTargetFilter] = useState<'all' | 'students' | 'faculty' | 'both'>('all')
  const [showModal, setShowModal] = useState(false)

  const filteredAnnouncements = ANNOUNCEMENTS.filter(a => targetFilter === 'all' || a.target === targetFilter || a.target === 'both')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Announcements</h2>
          <p className="text-sm text-slate-500 mt-1">Create and manage announcements for students and faculty</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 shadow-lg shadow-blue-600/20"
        >
          <Plus className="w-4 h-4" /> New Announcement
        </button>
      </div>

      <div className="flex gap-2">
        <button onClick={() => setTargetFilter('all')} className={cn("px-3 py-1.5 rounded-lg text-xs font-medium", targetFilter === 'all' ? "bg-slate-800 text-white" : "bg-white text-slate-600 border border-slate-200")}>All</button>
        <button onClick={() => setTargetFilter('students')} className={cn("px-3 py-1.5 rounded-lg text-xs font-medium", targetFilter === 'students' ? "bg-blue-600 text-white" : "bg-white text-slate-600 border border-slate-200")}>Students</button>
        <button onClick={() => setTargetFilter('faculty')} className={cn("px-3 py-1.5 rounded-lg text-xs font-medium", targetFilter === 'faculty' ? "bg-green-600 text-white" : "bg-white text-slate-600 border border-slate-200")}>Faculty</button>
        <button onClick={() => setTargetFilter('both')} className={cn("px-3 py-1.5 rounded-lg text-xs font-medium", targetFilter === 'both' ? "bg-purple-600 text-white" : "bg-white text-slate-600 border border-slate-200")}>Both</button>
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
                <button onClick={() => setShowModal(false)} className="p-1.5 hover:bg-white/20 rounded-lg transition-colors">
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">Title</label>
                <input type="text" placeholder="Enter announcement title" className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">Target Audience</label>
                <select className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600">
                  <option value="students">Students</option>
                  <option value="faculty">Faculty</option>
                  <option value="both">Both</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">Message</label>
                <textarea rows={3} placeholder="Enter announcement message" className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 resize-none" />
              </div>
            </div>
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 rounded-xl transition-colors">Cancel</button>
              <button onClick={() => setShowModal(false)} className="px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20">Publish</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
