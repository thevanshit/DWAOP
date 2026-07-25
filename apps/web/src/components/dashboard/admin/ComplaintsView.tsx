'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, AlertOctagon, Clock, Activity, CheckCircle, User, Award } from 'lucide-react'
import { cn } from '@/lib/utils'
import { COMPLAINTS } from './data'
import { StatCard } from './StatCard'

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
}

export function ComplaintsView() {
  const [filter, setFilter] = useState<'all' | 'pending' | 'in_progress' | 'resolved'>('all')

  const filteredComplaints = COMPLAINTS.filter(c => filter === 'all' || c.status === filter)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Complaints & Issues</h2>
          <p className="text-sm text-slate-500 mt-1">Track and resolve complaints from students and faculty</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 shadow-lg shadow-blue-600/20">
          <Plus className="w-4 h-4" /> New Complaint
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Complaints" value={COMPLAINTS.length} icon={AlertOctagon} color="blue" />
        <StatCard label="Pending" value={COMPLAINTS.filter(c => c.status === 'pending').length} icon={Clock} color="amber" />
        <StatCard label="In Progress" value={COMPLAINTS.filter(c => c.status === 'in_progress').length} icon={Activity} color="purple" />
        <StatCard label="Resolved" value={COMPLAINTS.filter(c => c.status === 'resolved').length} icon={CheckCircle} color="green" />
      </div>

      <div className="flex gap-2">
        <button onClick={() => setFilter('all')} className={cn("px-3 py-1.5 rounded-lg text-xs font-medium", filter === 'all' ? "bg-slate-800 text-white" : "bg-white text-slate-600 border border-slate-200")}>All</button>
        <button onClick={() => setFilter('pending')} className={cn("px-3 py-1.5 rounded-lg text-xs font-medium", filter === 'pending' ? "bg-amber-600 text-white" : "bg-white text-slate-600 border border-slate-200")}>Pending</button>
        <button onClick={() => setFilter('in_progress')} className={cn("px-3 py-1.5 rounded-lg text-xs font-medium", filter === 'in_progress' ? "bg-purple-600 text-white" : "bg-white text-slate-600 border border-slate-200")}>In Progress</button>
        <button onClick={() => setFilter('resolved')} className={cn("px-3 py-1.5 rounded-lg text-xs font-medium", filter === 'resolved' ? "bg-green-600 text-white" : "bg-white text-slate-600 border border-slate-200")}>Resolved</button>
      </div>

      <div className="space-y-3">
        {filteredComplaints.map((complaint) => (
          <motion.div 
            key={complaint.id}
            variants={itemVariants}
            className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center",
                  complaint.type === 'student' ? "bg-blue-100 text-blue-600" : "bg-green-100 text-green-600"
                )}>
                  {complaint.type === 'student' ? <User className="w-5 h-5" /> : <Award className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="font-medium text-slate-900">{complaint.title}</h3>
                  <p className="text-xs text-slate-500 mt-1">{complaint.description}</p>
                  <p className="text-xs text-slate-400 mt-1">
                    {complaint.type === 'student' ? `${complaint.student} • ${complaint.batch}` : complaint.faculty}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className={cn(
                  "text-[10px] font-medium px-2 py-1 rounded-full",
                  complaint.priority === 'high' ? "bg-red-100 text-red-700" :
                  complaint.priority === 'medium' ? "bg-amber-100 text-amber-700" :
                  "bg-slate-100 text-slate-600"
                )}>{complaint.priority}</span>
                <span className={cn(
                  "text-[10px] font-medium px-2 py-1 rounded-full",
                  complaint.status === 'pending' ? "bg-amber-100 text-amber-700" :
                  complaint.status === 'in_progress' ? "bg-purple-100 text-purple-700" :
                  "bg-green-100 text-green-700"
                )}>{complaint.status.replace('_', ' ')}</span>
                <span className="text-xs text-slate-400">{complaint.date}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
