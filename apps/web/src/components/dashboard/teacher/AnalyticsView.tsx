'use client'

import { motion } from 'framer-motion'
import { Plus, AlertCircle, BookOpen, Clipboard, UserCheck, FileText, Clock, Users2, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ViewBatch, AnalyticsData } from './TeacherDashboardProvider'

interface AnalyticsViewProps {
  batches: ViewBatch[]
  analytics: AnalyticsData
  onNewAssignment?: () => void
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
}

export function AnalyticsView({ batches, analytics, onNewAssignment }: AnalyticsViewProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">Analytics</h2>
        {onNewAssignment && (
          <button 
            onClick={onNewAssignment}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
          >
            <Plus className="w-4 h-4" /> New Assignment
          </button>
        )}
      </div>

      {/* Risk Alerts */}
      {analytics.riskAlerts.length > 0 && (
        <div className="space-y-2">
          {analytics.riskAlerts.map((alert, i) => (
            <motion.div 
              key={`${alert.batch}-${i}`} 
              variants={itemVariants}
              className={cn("flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium border",
                alert.type === 'warning' ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-red-50 text-red-700 border-red-200")}
            >
              <AlertCircle className="w-4 h-4" />
              {alert.message}
            </motion.div>
          ))}
        </div>
      )}

      {/* Teacher Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <p className="text-xs text-slate-500 mb-1">Total Lectures</p>
          <p className="text-2xl font-bold text-slate-900">{analytics.teacherStats.totalLectures}</p>
        </motion.div>
        <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
              <Clipboard className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <p className="text-xs text-slate-500 mb-1">Total Labs</p>
          <p className="text-2xl font-bold text-slate-900">{analytics.teacherStats.totalLabs}</p>
        </motion.div>
        <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
              <UserCheck className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <p className="text-xs text-slate-500 mb-1">Avg Attendance</p>
          <p className="text-2xl font-bold text-green-600">{analytics.teacherStats.avgAttendance}%</p>
        </motion.div>
        <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
              <FileText className="w-5 h-5 text-amber-600" />
            </div>
          </div>
          <p className="text-xs text-slate-500 mb-1">Assignments</p>
          <p className="text-2xl font-bold text-slate-900">{analytics.teacherStats.assignmentsGiven}</p>
        </motion.div>
        <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
              <Clock className="w-5 h-5 text-indigo-600" />
            </div>
          </div>
          <p className="text-xs text-slate-500 mb-1">Hours/Month</p>
          <p className="text-2xl font-bold text-slate-900">{analytics.teacherStats.hoursThisMonth}h</p>
        </motion.div>
        <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center">
              <Users2 className="w-5 h-5 text-rose-600" />
            </div>
          </div>
          <p className="text-xs text-slate-500 mb-1">Student Interaction</p>
          <p className="text-2xl font-bold text-blue-600">{analytics.teacherStats.studentInteraction}</p>
        </motion.div>
      </div>

      {/* Batch Performance */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
        <h3 className="text-base font-semibold text-slate-900 mb-4">Batch-wise Performance</h3>
        <div className="space-y-3">
          {analytics.batchPerformance.map((batch) => (
            <motion.div 
              key={batch.name} 
              variants={itemVariants}
              className="p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                    {batch.name.split('-')[0]?.slice(0,2)}{batch.name.split('-')[1]?.slice(0,2) || ''}
                  </div>
                  <span className="font-medium text-slate-900">{batch.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={cn("text-xs font-medium flex items-center gap-0.5", batch.trend > 0 ? "text-green-600" : "text-red-600")}>
                    {batch.trend > 0 ? <TrendingUp className="w-3 h-3" /> : null}{batch.trend > 0 ? '+' : ''}{batch.trend}%
                  </span>
                  <span className="text-sm font-bold text-green-600">{batch.attendance}%</span>
                </div>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2.5">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-2.5 rounded-full" style={{ width: `${batch.attendance}%` }} />
              </div>
              <div className="flex gap-2 mt-3">
                <span className="text-[10px] bg-white text-slate-600 px-3 py-1.5 rounded-lg border border-slate-200 font-medium">Attendance: {batch.attendance}%</span>
                <span className="text-[10px] bg-white text-slate-600 px-3 py-1.5 rounded-lg border border-slate-200 font-medium">Avg Marks: {batch.avgMarks}%</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
