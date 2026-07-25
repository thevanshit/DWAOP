'use client'

import { motion } from 'framer-motion'
import { 
  CalendarDays, Users2, Clipboard, BookMarked, ChevronRight, 
  ClipboardCheck, FileText, Plus 
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { TODAY_CLASSES, SMART_STATUS } from './data'
import { QuickActionButton } from './QuickActionButton'

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
}

type TabType = 'dashboard' | 'batches' | 'timetable' | 'attendance' | 'assignments' | 'tasks' | 'marks' | 'analytics' | 'announcements' | 'directory' | 'settings'

export function DashboardView({ 
  onNavigate 
}: { 
  onNavigate: (tab: TabType) => void 
}) {
  const todayClasses = TODAY_CLASSES
  const analytics = {
    classesToday: todayClasses.length,
    totalBatches: 3,
    pendingTasks: 8,
    lecturesThisWeek: 18,
    urgentTasks: 3,
  }

  const currentHour = new Date().getHours()
  const greeting = currentHour < 12 ? 'Good morning' : currentHour < 17 ? 'Good afternoon' : 'Good evening'

  const quickStats = [
    { label: 'Classes Today', value: analytics.classesToday, icon: CalendarDays, color: 'blue', trend: 'up' },
    { label: 'Total Batches', value: analytics.totalBatches, icon: Users2, color: 'green', trend: 'up' },
    { label: 'Pending Tasks', value: analytics.pendingTasks, icon: Clipboard, color: 'amber', trend: 'down' },
    { label: 'This Week', value: analytics.lecturesThisWeek, icon: BookMarked, color: 'purple', trend: 'up', suffix: 'Lectures' },
  ]

  return (
    <div className="space-y-6">
      {/* Greeting Card */}
      <motion.div 
        variants={itemVariants}
        className="bg-gradient-to-br from-white via-slate-50 to-white rounded-2xl border border-slate-200/60 shadow-[0_1px_3px_rgba(0,0,0,0.02),0_4px_12px_rgba(0,0,0,0.02)] p-6 md:p-8"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold text-slate-900">
                {greeting}, <span className="text-blue-600">Dr. Vineet</span>!
              </h1>
              <div className="text-slate-500 mt-2 space-y-0.5">
                <p className="text-sm">You have {analytics.classesToday} classes today • {analytics.totalBatches} batches</p>
                <p className="text-sm">{analytics.pendingTasks} pending tasks • {analytics.urgentTasks} urgent</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Smart Status Row */}
      <motion.div variants={itemVariants} className="flex flex-wrap gap-2.5">
        {SMART_STATUS.map((status, i) => {
          const Icon = status.icon
          return (
            <motion.div
              key={i}
              whileHover={{ scale: 1.02 }}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium border backdrop-blur-sm shadow-sm",
                status.type === 'urgent' ? "bg-red-50/80 text-red-700 border-red-200" :
                status.type === 'success' ? "bg-green-50/80 text-green-700 border-green-200" :
                status.type === 'warning' ? "bg-amber-50/80 text-amber-700 border-amber-200" :
                "bg-blue-50/80 text-blue-700 border-blue-200"
              )}
            >
              <Icon className="w-4 h-4" />
              {status.text}
            </motion.div>
          )
        })}
      </motion.div>

      {/* Stats Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat, i) => (
          <motion.div 
            key={i}
            variants={itemVariants}
            whileHover={{ y: -2 }}
            className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-lg hover:border-blue-200 transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-slate-500">{stat.label}</span>
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110",
                stat.color === 'blue' ? "bg-gradient-to-br from-blue-50 to-blue-100" :
                stat.color === 'green' ? "bg-gradient-to-br from-green-50 to-green-100" :
                stat.color === 'amber' ? "bg-gradient-to-br from-amber-50 to-amber-100" :
                "bg-gradient-to-br from-purple-50 to-purple-100"
              )}>
                <stat.icon className={cn("w-5 h-5", 
                  stat.color === 'blue' ? "text-blue-600" :
                  stat.color === 'green' ? "text-green-600" :
                  stat.color === 'amber' ? "text-amber-600" :
                  "text-purple-600"
                )} />
              </div>
            </div>
            <div className="flex items-baseline gap-1.5">
              <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
              {stat.suffix && <p className="text-xs text-slate-500">{stat.suffix}</p>}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Today's Schedule & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
        {/* Today's Schedule */}
        <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-slate-900">Today&apos;s Schedule</h3>
            <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">Today</span>
          </div>
          <div className="space-y-2">
            {todayClasses.map((cls, i) => (
              <motion.div 
                key={i} 
                whileHover={{ x: 4 }}
                className="flex items-center gap-3 p-3 bg-slate-50/80 rounded-xl hover:bg-blue-50/50 transition-colors cursor-pointer group"
              >
                <div className={cn("w-1 h-12 rounded-full", i === 0 ? "bg-blue-600" : cls.type === 'Lab' ? "bg-slate-400" : "bg-slate-300")} />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">{cls.subject}</p>
                  <p className="text-xs text-slate-500">{cls.batch} {cls.group && `(${cls.group})`} • {cls.room}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium text-slate-600">{cls.time}</p>
                  <span className={cn("text-[10px] font-medium px-2 py-0.5 rounded", cls.type === 'Lecture' ? "bg-blue-100 text-blue-700" : "bg-slate-200 text-slate-600")}>
                    {cls.type}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
          <h3 className="text-base font-semibold text-slate-900 mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <QuickActionButton label="Take Attendance" icon={ClipboardCheck} onClick={() => onNavigate('attendance')} />
            <QuickActionButton label="Create Assignment" icon={FileText} onClick={() => onNavigate('assignments')} />
            <QuickActionButton label="Add Task" icon={Plus} onClick={() => onNavigate('tasks')} />
          </div>
        </motion.div>
      </div>
    </div>
  )
}
