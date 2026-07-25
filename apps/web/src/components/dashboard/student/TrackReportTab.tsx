'use client'

import { Scroll, Download, CheckCircle, Clock, Lock, TrendingUp, BookOpen, Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useStudentDashboardData } from './StudentDashboardProvider'
import { TRACK_SEMESTER_DETAILS } from './data'

export default function TrackReportTab() {
  const { trackReports } = useStudentDashboardData()

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'locked': return { bg: 'bg-green-50', text: 'text-green-600', icon: CheckCircle, label: 'Completed' }
      case 'in_progress': return { bg: 'bg-blue-50', text: 'text-blue-600', icon: Clock, label: 'In Progress' }
      default: return { bg: 'bg-slate-50', text: 'text-slate-600', icon: Lock, label: 'Locked' }
    }
  }

  const overallCGPA = 8.2

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white border border-slate-200 rounded-xl flex items-center justify-center shadow-sm">
            <Scroll className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Track Report</h2>
            <p className="text-sm text-slate-500">Academic performance across semesters</p>
          </div>
        </div>
        <button className="px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 flex items-center gap-2 shadow-lg shadow-blue-500/25">
          <Download className="w-4 h-4" />
          Download DMC
        </button>
      </div>

      {/* Overall Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
          <p className="text-xs text-slate-500 mb-1">Overall CGPA</p>
          <p className="text-3xl font-bold text-slate-900">{overallCGPA}</p>
          <p className="text-xs text-slate-400 mt-1">Out of 10.0</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
          <p className="text-xs text-slate-500 mb-1">Semesters Completed</p>
          <p className="text-3xl font-bold text-slate-900">3</p>
          <p className="text-xs text-slate-400 mt-1">Out of 8</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
          <p className="text-xs text-slate-500 mb-1">Average Attendance</p>
          <p className="text-3xl font-bold text-slate-900">82%</p>
          <p className="text-xs text-slate-400 mt-1">All semesters</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
          <p className="text-xs text-slate-500 mb-1">Current Status</p>
          <div className="flex items-center gap-2 mt-1">
            <Clock className="w-5 h-5 text-blue-600" />
            <span className="text-lg font-bold text-blue-600">Sem 4 On Going</span>
          </div>
        </div>
      </div>

      {/* Semester List */}
      <div className="space-y-4">
        <h3 className="text-base font-semibold text-slate-800">Semester Details</h3>

        {/* Semester 1 */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-lg font-semibold text-slate-900">Semester 1</h4>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Completed</span>
                </div>
                <p className="text-sm text-slate-500">Academic Year 2024-25</p>
              </div>
            </div>
            <button className="px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg font-medium flex items-center gap-1">
              <Download className="w-4 h-4" />
              DMC
            </button>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-slate-100">
            <div>
              <p className="text-xs text-slate-500">CGPA</p>
              <p className="text-xl font-bold text-slate-900">8.2</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Attendance</p>
              <p className="text-xl font-bold text-slate-900">82%</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Subjects</p>
              <p className="text-xl font-bold text-slate-900">5</p>
            </div>
          </div>
        </div>

        {/* Semester 2 */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-lg font-semibold text-slate-900">Semester 2</h4>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Completed</span>
                </div>
                <p className="text-sm text-slate-500">Academic Year 2024-25</p>
              </div>
            </div>
            <button className="px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg font-medium flex items-center gap-1">
              <Download className="w-4 h-4" />
              DMC
            </button>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-slate-100">
            <div>
              <p className="text-xs text-slate-500">CGPA</p>
              <p className="text-xl font-bold text-slate-900">7.9</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Attendance</p>
              <p className="text-xl font-bold text-slate-900">78%</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Subjects</p>
              <p className="text-xl font-bold text-slate-900">5</p>
            </div>
          </div>
        </div>

        {/* Semester 3 */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-lg font-semibold text-slate-900">Semester 3</h4>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Completed</span>
                </div>
                <p className="text-sm text-slate-500">Academic Year 2025-26</p>
              </div>
            </div>
            <button className="px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg font-medium flex items-center gap-1">
              <Download className="w-4 h-4" />
              DMC
            </button>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-slate-100">
            <div>
              <p className="text-xs text-slate-500">CGPA</p>
              <p className="text-xl font-bold text-slate-900">8.4</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Attendance</p>
              <p className="text-xl font-bold text-slate-900">85%</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Subjects</p>
              <p className="text-xl font-bold text-slate-900">5</p>
            </div>
          </div>
        </div>

        {/* Semester 4 - Ongoing */}
        <div className="bg-white rounded-2xl border-2 border-blue-200 p-5 shadow-[0_4px_12px_rgba(37,99,235,0.15)] bg-blue-50/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-lg font-semibold text-slate-900">Semester 4</h4>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">In Progress</span>
                </div>
                <p className="text-sm text-slate-500">Academic Year 2025-26 • Current</p>
              </div>
            </div>
            <span className="text-xs text-blue-600 font-medium">Ongoing</span>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-blue-100">
            <div>
              <p className="text-xs text-blue-500">CGPA</p>
              <p className="text-xl font-bold text-blue-600">—</p>
            </div>
            <div>
              <p className="text-xs text-blue-500">Attendance</p>
              <p className="text-xl font-bold text-blue-600">79%</p>
            </div>
            <div>
              <p className="text-xs text-blue-500">Subjects</p>
              <p className="text-xl font-bold text-blue-600">6</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
