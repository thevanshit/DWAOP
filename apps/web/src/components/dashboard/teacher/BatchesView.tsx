'use client'

import { motion } from 'framer-motion'
import { Users2, UserCheck, FileText, Award } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ASSIGNMENTS_DATA } from './data'

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
}

export function BatchesView({ batches, selectedBatch, onSelectBatch }: { batches: any[]; selectedBatch: string; onSelectBatch: (id: string) => void }) {
  const batch = batches.find(b => b.id === selectedBatch)

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-slate-900">Batches & Students</h2>

      {/* Batch Tabs */}
      <div className="flex gap-2">
        {batches.map(b => (
          <button
            key={b.id}
            onClick={() => onSelectBatch(b.id)}
            className={cn(
              "px-4 py-2.5 rounded-xl text-sm font-medium transition-all",
              selectedBatch === b.id 
                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" 
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            )}
          >
            {b.name}
          </button>
        ))}
      </div>

      {batch && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Batch Stats */}
          <div className="space-y-4">
            <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-slate-500">Total Students</span>
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                  <Users2 className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <p className="text-3xl font-bold text-slate-900">{batch.students}</p>
            </motion.div>
            <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-slate-500">Avg Attendance</span>
                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                  <UserCheck className="w-5 h-5 text-green-600" />
                </div>
              </div>
              <p className="text-3xl font-bold text-green-600">{batch.attendance}%</p>
            </motion.div>
            <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-slate-500">Given Assignments</span>
                <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
                  <FileText className="w-5 h-5 text-amber-600" />
                </div>
              </div>
              <p className="text-3xl font-bold text-amber-600">{ASSIGNMENTS_DATA.filter(a => a.batch === batch.name).length}</p>
            </motion.div>
            <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-slate-500">Avg Marks</span>
                <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                  <Award className="w-5 h-5 text-purple-600" />
                </div>
              </div>
              <p className="text-3xl font-bold text-purple-600">{batch.avgMarks}%</p>
            </motion.div>
          </div>

          {/* Subjects */}
          <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <h3 className="text-base font-semibold text-slate-900 mb-4">Subjects & Classes</h3>
            <div className="space-y-3">
              {batch.subjects.map((subject: string) => (
                <div key={subject} className="p-4 bg-slate-50/80 rounded-xl border border-slate-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-slate-900">{subject}</span>
                    <span className="text-xs bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full font-medium">
                      {batch.lecturesTaken[subject] || 0} Lectures • {batch.labsTaken[subject] || 0} Labs
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${Math.min(((batch.lecturesTaken[subject] || 0) / 15) * 100, 100)}%` }} />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-2">15 lectures total per semester</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
