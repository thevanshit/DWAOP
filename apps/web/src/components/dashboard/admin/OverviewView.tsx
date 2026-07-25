'use client'

import { motion } from 'framer-motion'
import { Home, User, Award, Building2, Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import { OVERVIEW_STATS, QUICK_ACTIONS, WORKFLOWS, FACULTY } from './data'

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
}

type AdminTab = 'overview' | 'workflows' | 'students' | 'faculty' | 'requests' | 'coordination' | 'analytics' | 'complaints' | 'announcements' | 'compliance' | 'settings'

export function OverviewView({ onNavigate }: { onNavigate: (tab: AdminTab) => void }) {
  const greeting = (() => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
  })()

  const workflowPreview = WORKFLOWS.slice(0, 6)

  return (
    <div className="space-y-6">
      <motion.div 
        variants={itemVariants}
        className="bg-gradient-to-br from-white via-slate-50 to-white rounded-2xl border border-slate-200/60 shadow-[0_1px_3px_rgba(0,0,0,0.02),0_4px_12px_rgba(0,0,0,0.02)] p-6 md:p-8"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold text-slate-900">
              {greeting}, <span className="text-blue-600">Admin!</span>
            </h1>
            <p className="text-slate-500 mt-2">Department governance & operations overview</p>
          </div>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {OVERVIEW_STATS.map((stat, i) => (
          <motion.div 
            key={i}
            whileHover={{ y: -2 }}
            className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-lg hover:border-blue-200 transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-slate-500">{stat.label}</span>
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110",
                stat.color === 'red' ? "bg-gradient-to-br from-red-50 to-red-100" :
                stat.color === 'blue' ? "bg-gradient-to-br from-blue-50 to-blue-100" :
                stat.color === 'amber' ? "bg-gradient-to-br from-amber-50 to-amber-100" :
                "bg-gradient-to-br from-purple-50 to-purple-100"
              )}>
                <stat.icon className={cn("w-5 h-5", 
                  stat.color === 'red' ? "text-red-600" :
                  stat.color === 'blue' ? "text-blue-600" :
                  stat.color === 'amber' ? "text-amber-600" :
                  "text-purple-600"
                )} />
              </div>
            </div>
            <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
            <p className="text-xs text-slate-500 mt-1">{stat.sub}</p>
          </motion.div>
        ))}
      </motion.div>

      <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-slate-900">Workflow Overview</h3>
          <button onClick={() => onNavigate('workflows')} className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            View All →
          </button>
        </div>
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search workflows (students, faculty, administration)..."
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
          />
        </div>
        <div className="space-y-2">
          {workflowPreview.map((wf) => (
            <div key={wf.id} className="flex items-center justify-between p-3 bg-slate-50/80 rounded-xl hover:bg-slate-100 transition-colors">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center",
                  wf.type === 'student' ? "bg-blue-100 text-blue-600" :
                  wf.type === 'faculty' ? "bg-green-100 text-green-600" :
                  "bg-purple-100 text-purple-600"
                )}>
                  {wf.type === 'student' ? <User className="w-4 h-4" /> :
                   wf.type === 'faculty' ? <Award className="w-4 h-4" /> :
                   <Building2 className="w-4 h-4" />}
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">{wf.title}</p>
                  <p className="text-xs text-slate-500">{wf.assignee} • {wf.batch || 'Admin'}</p>
                </div>
              </div>
              <span className={cn(
                "text-[10px] font-medium px-2 py-1 rounded-full",
                wf.status === 'done' ? "bg-green-100 text-green-700" :
                wf.status === 'in_progress' ? "bg-amber-100 text-amber-700" :
                wf.status === 'delayed' ? "bg-red-100 text-red-700" :
                wf.status === 'under_review' ? "bg-purple-100 text-purple-700" :
                "bg-slate-100 text-slate-600"
              )}>
                {wf.status.replace('_', ' ')}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <h3 className="text-base font-semibold text-slate-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            {QUICK_ACTIONS.map((action, i) => (
              <button 
                key={i}
                onClick={() => onNavigate(action.href.replace('#', '') as AdminTab)}
                className={cn(
                  "flex items-center gap-3 p-4 rounded-xl border hover:shadow-md transition-all group",
                  action.color === 'blue' ? "bg-blue-50/50 border-blue-100 hover:border-blue-300" :
                  action.color === 'green' ? "bg-green-50/50 border-green-100 hover:border-green-300" :
                  action.color === 'amber' ? "bg-amber-50/50 border-amber-100 hover:border-amber-300" :
                  "bg-purple-50/50 border-purple-100 hover:border-purple-300"
                )}
              >
                <action.icon className={cn("w-5 h-5", 
                  action.color === 'blue' ? "text-blue-600" :
                  action.color === 'green' ? "text-green-600" :
                  action.color === 'amber' ? "text-amber-600" :
                  "text-purple-600"
                )} />
                <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">{action.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <h3 className="text-base font-semibold text-slate-900 mb-4">Faculty Workload</h3>
          <div className="space-y-3">
            {FACULTY.slice(0, 4).map((f, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                  {f.name.split(' ').map(n => n[0]).join('').slice(0,2)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-slate-900">{f.name}</p>
                    <span className="text-xs text-slate-500">{f.workload}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div 
                      className={cn(
                        "h-2 rounded-full",
                        f.workload >= 80 ? "bg-red-500" :
                        f.workload >= 70 ? "bg-amber-500" :
                        "bg-green-500"
                      )} 
                      style={{ width: `${f.workload}%` }} 
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
