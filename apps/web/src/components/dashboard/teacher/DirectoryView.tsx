'use client'

import { motion } from 'framer-motion'
import { MessageSquare, User, Mail, Phone } from 'lucide-react'
import type { FacultyMember } from '@/hooks/useTeacherDashboard'

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
}

interface DirectoryViewProps {
  faculty: FacultyMember[]
}

export function DirectoryView({ faculty }: DirectoryViewProps) {
  const handleMessage = (member: FacultyMember) => {
    window.location.href = `mailto:${member.email}`
  }

  const handleProfile = (member: FacultyMember) => {
    // Could navigate to profile page or show modal
    // For now, show a toast-like action
    alert(`Viewing profile of ${member.name}`)
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-slate-900">Faculty Directory</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {faculty.map((f) => (
          <motion.div 
            key={f.email} 
            variants={itemVariants}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-lg hover:border-blue-200 transition-all group"
          >
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/20 group-hover:scale-105 transition-transform">
                <span className="text-white font-bold text-lg">{f.avatar}</span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">{f.name}</h3>
                <p className="text-xs text-slate-500 mb-1">{f.role}</p>
                <p className="text-[10px] text-blue-600 font-medium">{f.specialization}</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Mail className="w-3.5 h-3.5" />
                <span className="truncate">{f.email}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500 mt-1.5">
                <Phone className="w-3.5 h-3.5" />
                <span>{f.phone}</span>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button 
                onClick={() => handleMessage(f)}
                className="flex-1 py-2 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5 inline mr-1" /> Message
              </button>
              <button 
                onClick={() => handleProfile(f)}
                className="flex-1 py-2 text-xs font-medium text-slate-600 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <User className="w-3.5 h-3.5 inline mr-1" /> Profile
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
