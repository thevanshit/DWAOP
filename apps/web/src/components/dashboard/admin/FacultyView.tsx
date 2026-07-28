'use client'

import { motion } from 'framer-motion'
import { Plus, Mail, Phone, MessageSquare, Eye, ClipboardList } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAdminDashboardContext } from './AdminDashboardProvider'

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
}

export function FacultyView() {
  const { faculty } = useAdminDashboardContext()

  const handleMessage = (name: string) => {
    // TODO: Integrate with messaging system
    console.log(`Open message dialog for ${name}`)
    alert(`Messaging ${name} would open here`)
  }

  const handleView = (name: string) => {
    // TODO: Navigate to faculty detail/profile page
    console.log(`View profile for ${name}`)
    alert(`Profile for ${name} would open here`)
  }

  const handleAssignTask = (name: string) => {
    // TODO: Open task assignment modal
    console.log(`Assign task to ${name}`)
    alert(`Task assignment for ${name} would open here`)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Faculty Management</h2>
          <p className="text-sm text-slate-500 mt-1">Manage faculty members and their workload</p>
        </div>
        <button type="button" className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 shadow-lg shadow-blue-600/20">
          <Plus className="w-4 h-4" /> Add Faculty
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {faculty.map((f) => (
          <motion.div
            key={f.id}
            variants={itemVariants}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-lg hover:border-blue-200 transition-all"
          >
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-600/20">
                {f.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-slate-900">{f.name}</h3>
                  <span className={cn(
                    "text-[10px] font-medium px-2 py-0.5 rounded-full",
                    f.status === 'active' ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                  )}>{f.status === 'active' ? 'Active' : 'On Leave'}</span>
                </div>
                <p className="text-xs text-slate-500">{f.role}</p>
                <p className="text-[10px] text-blue-600 font-medium mt-1">{f.specialization}</p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <Mail className="w-3.5 h-3.5" />
                <span>{f.email}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <Phone className="w-3.5 h-3.5" />
                <span>{f.phone}</span>
              </div>
            </div>

            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-500">Workload</span>
                <span className={cn(
                  "text-xs font-medium",
                  f.workload >= 80 ? "text-red-600" : f.workload >= 70 ? "text-amber-600" : "text-green-600"
                )}>{f.workload}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div
                  className={cn(
                    "h-2 rounded-full",
                    f.workload >= 80 ? "bg-red-500" : f.workload >= 70 ? "bg-amber-500" : "bg-green-500"
                  )}
                  style={{ width: `${f.workload}%` }}
                />
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <button
                onClick={() => handleMessage(f.name)}
                type="button"
                aria-label={`Message ${f.name}`}
                className="flex-1 py-2 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5 inline mr-1" /> Message
              </button>
              <button
                onClick={() => handleView(f.name)}
                type="button"
                aria-label={`View ${f.name}`}
                className="flex-1 py-2 text-xs font-medium text-slate-600 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <Eye className="w-3.5 h-3.5 inline mr-1" /> View
              </button>
              <button
                onClick={() => handleAssignTask(f.name)}
                type="button"
                aria-label={`Assign task to ${f.name}`}
                className="flex-1 py-2 text-xs font-medium text-amber-600 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors"
              >
                <ClipboardList className="w-3.5 h-3.5 inline mr-1" /> Assign Task
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
