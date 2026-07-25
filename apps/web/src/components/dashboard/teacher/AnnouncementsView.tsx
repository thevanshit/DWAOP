'use client'

import { Plus, Pin } from 'lucide-react'
import { cn } from '@/lib/utils'

export function AnnouncementsView({ type, setType, announcements }: { type: 'toStudents' | 'fromAdmin'; setType: (type: 'toStudents' | 'fromAdmin') => void; announcements: any }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">Announcements</h2>
        {type === 'toStudents' && (
          <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20">
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

      <div className="space-y-3">
        {announcements[type].map((announcement: any) => (
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
