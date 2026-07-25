'use client'

import { motion } from 'framer-motion'
import { CalendarDays } from 'lucide-react'
import { cn } from '@/lib/utils'
import { TIMETABLE, DAY_NAMES } from './data'

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
}

export function TimetableView() {
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'] as const
  const currentDay = DAY_NAMES[new Date().getDay() - 1] || 'Mon'

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">Weekly Timetable</h2>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-full">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-xs font-medium text-green-700">Today: {currentDay}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-5 gap-4">
        {DAY_NAMES.slice(0, 5).map((day, idx) => (
          <motion.div 
            key={day} 
            variants={itemVariants}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            <div className={cn(
              "py-3.5 text-center text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2",
              day.toLowerCase() === currentDay.toLowerCase() 
                ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-600/25" 
                : "bg-slate-50 text-slate-700"
            )}>
              {day.toLowerCase() === currentDay.toLowerCase() && <CalendarDays className="w-3.5 h-3.5" />}
              {day}
            </div>
            <div className="p-3 space-y-2 min-h-[280px]">
              {(TIMETABLE as any)[days[idx]]?.length === 0 ? (
                <div className="flex items-center justify-center h-24 text-xs text-slate-400">
                  No classes
                </div>
              ) : (
                (TIMETABLE as any)[days[idx]]?.map((cls: any, i: number) => (
                  <motion.div 
                    key={i} 
                    whileHover={{ scale: 1.02 }}
                    className={cn(
                      "p-3 rounded-xl border transition-all cursor-pointer group relative overflow-hidden",
                      cls.type === 'Lecture' 
                        ? "bg-gradient-to-r from-blue-50 to-blue-100/50 border-blue-100 hover:border-blue-300" 
                        : "bg-gradient-to-r from-slate-50 to-slate-100/50 border-slate-200 hover:border-slate-300"
                    )}
                  >
                    <div className={cn(
                      "absolute left-0 top-0 bottom-0 w-1 rounded-l-xl",
                      cls.type === 'Lecture' ? "bg-blue-600" : "bg-slate-400"
                    )} />
                    <div className="pl-2">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className={cn(
                          "text-[9px] font-bold px-1.5 py-0.5 rounded",
                          cls.type === 'Lecture' ? "bg-blue-600 text-white" : "bg-slate-400 text-white"
                        )}>
                          {cls.type}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-slate-900 group-hover:text-blue-700 transition-colors">{cls.subject}</p>
                      <p className="text-[10px] text-blue-600 font-medium mt-1">{cls.time}</p>
                      <div className="flex items-center gap-1 mt-1.5">
                        <span className="text-[10px] text-slate-500">{cls.batch}</span>
                        {cls.group && <span className="text-[10px] text-slate-400">({cls.group})</span>}
                      </div>
                      <p className="text-[10px] text-slate-400 mt-0.5">{cls.room}</p>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
