'use client'

import { useState } from 'react'
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Calendar,
  Award,
  ClipboardCheck,
  FileText,
  Download,
  CalendarDays,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  PieChart,
  LineChart
} from 'lucide-react'
import { cn } from '@/lib/utils'

const ATTENDANCE_DATA = [
  { month: 'Sep', cseAIML: 88, cse: 85, it: 82 },
  { month: 'Oct', cseAIML: 85, cse: 83, it: 80 },
  { month: 'Nov', cseAIML: 82, cse: 80, it: 78 },
  { month: 'Dec', cseAIML: 80, cse: 78, it: 75 },
  { month: 'Jan', cseAIML: 78, cse: 76, it: 72 },
  { month: 'Feb', cseAIML: 85, cse: 82, it: 79 },
]

const MARKS_DATA = [
  { subject: 'OS', average: 72, top: 95, bottom: 45 },
  { subject: 'CN', average: 68, top: 92, bottom: 42 },
  { subject: 'DBMS', average: 75, top: 98, bottom: 48 },
  { subject: 'SE', average: 70, top: 90, bottom: 40 },
  { subject: 'WD', average: 78, top: 96, bottom: 52 },
]

const BATCH_COMPARISON = [
  { name: 'CSE-AIML', attendance: 85, marks: 75, assignments: 92, trend: 'up' },
  { name: 'CSE', attendance: 82, marks: 72, assignments: 88, trend: 'stable' },
  { name: 'IT', attendance: 79, marks: 70, assignments: 85, trend: 'down' },
]

const FACULTY_LOAD = [
  { name: 'Dr. Amit Kumar', workload: 92, tasks: 18, completed: 15 },
  { name: 'Dr. Vineet Jain', workload: 85, tasks: 17, completed: 12 },
  { name: 'Dr. Priya Sharma', workload: 78, tasks: 12, completed: 10 },
  { name: 'Dr. Suresh Kumar', workload: 65, tasks: 9, completed: 8 },
  { name: 'Dr. Rahul Gupta', workload: 72, tasks: 12, completed: 9 },
]

export default function AnalyticsTab() {
  const [dateRange, setDateRange] = useState('semester')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Department Analytics</h2>
          <p className="text-sm text-slate-500 mt-1">Comprehensive insights and performance metrics</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="h-11 px-4 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-sm"
          >
            <option value="month">This Month</option>
            <option value="semester">This Semester</option>
            <option value="year">This Year</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 shadow-lg shadow-blue-600/20">
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard 
          label="Avg Attendance" 
          value="82%" 
          trend="down" 
          trendValue="2.3%" 
          icon={Calendar} 
          color="blue"
        />
        <StatCard 
          label="Avg Marks" 
          value="73%" 
          trend="up" 
          trendValue="1.5%" 
          icon={Award} 
          color="green"
        />
        <StatCard 
          label="Completion Rate" 
          value="88%" 
          trend="up" 
          trendValue="3.2%" 
          icon={ClipboardCheck} 
          color="purple"
        />
        <StatCard 
          label="Active Students" 
          value="240" 
          trend="stable" 
          trendValue="0%" 
          icon={Users} 
          color="amber"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Attendance Trend */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                <TrendingDown className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Attendance Trend</h3>
                <p className="text-xs text-slate-500">Batch-wise comparison</p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            {ATTENDANCE_DATA.map((data, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <span className="text-xs font-medium text-slate-500 w-8">{data.month}</span>
                <div className="flex-1 grid grid-cols-3 gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: `${data.cseAIML}%` }} />
                    </div>
                    <span className="text-[10px] text-slate-500 w-6">{data.cseAIML}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 rounded-full" style={{ width: `${data.cse}%` }} />
                    </div>
                    <span className="text-[10px] text-slate-500 w-6">{data.cse}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-amber-500" />
                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full" style={{ width: `${data.it}%` }} />
                    </div>
                    <span className="text-[10px] text-slate-500 w-6">{data.it}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-xs text-slate-500">CSE-AIML</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-xs text-slate-500">CSE</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <span className="text-xs text-slate-500">IT</span>
            </div>
          </div>
        </div>

        {/* Marks Distribution */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                <Award className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Subject Performance</h3>
                <p className="text-xs text-slate-500">Average vs Top/Bottom performers</p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            {MARKS_DATA.map((data, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-medium text-slate-700">{data.subject}</span>
                  <span className="text-xs text-slate-500">Avg: {data.average}%</span>
                </div>
                <div className="relative h-6 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="absolute h-full bg-green-500 rounded-full" 
                    style={{ width: `${(data.average / 100) * 100}%` }} 
                  />
                  <div 
                    className="absolute h-full bg-green-700 rounded-full" 
                    style={{ left: `${(data.average / 100) * 100}%`, width: `${((data.top - data.average) / 100) * 100}%`, opacity: 0.5 }} 
                  />
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-[10px] text-red-500">Low: {data.bottom}%</span>
                  <span className="text-[10px] text-green-600">High: {data.top}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Batch Comparison */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Batch Performance</h3>
                <p className="text-xs text-slate-500">Comparative analysis</p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            {BATCH_COMPARISON.map((batch, idx) => (
              <div key={idx} className="p-4 bg-slate-50 rounded-xl">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-900">{batch.name}</span>
                    {batch.trend === 'up' ? (
                      <ArrowUpRight className="w-4 h-4 text-green-500" />
                    ) : batch.trend === 'down' ? (
                      <ArrowDownRight className="w-4 h-4 text-red-500" />
                    ) : (
                      <Activity className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-[10px] text-slate-500 mb-1">Attendance</p>
                    <p className="text-lg font-bold text-slate-900">{batch.attendance}%</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 mb-1">Marks</p>
                    <p className="text-lg font-bold text-slate-900">{batch.marks}%</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 mb-1">Assignments</p>
                    <p className="text-lg font-bold text-slate-900">{batch.assignments}%</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Faculty Workload */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Faculty Workload</h3>
                <p className="text-xs text-slate-500">Task distribution</p>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            {FACULTY_LOAD.map((faculty, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-blue-50 border border-slate-200 flex items-center justify-center text-blue-600 text-xs font-bold">
                  {faculty.name.split(' ').slice(1).map(n => n[0]).join('')}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-slate-700">{faculty.name.split(' ').slice(1).join(' ')}</span>
                    <span className="text-xs text-slate-500">{faculty.workload}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={cn(
                        "h-full rounded-full",
                        faculty.workload >= 80 ? "bg-blue-500" : "bg-blue-400"
                      )}
                      style={{ width: `${faculty.workload}%` }} 
                    />
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium text-slate-700">{faculty.completed}/{faculty.tasks}</p>
                  <p className="text-[10px] text-slate-400">tasks</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, trend, trendValue, icon: Icon, color }: {
  label: string;
  value: string;
  trend: 'up' | 'down' | 'stable';
  trendValue: string;
  icon: React.ElementType;
  color: string;
}) {
  const colorStyles = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    amber: 'bg-amber-100 text-amber-600',
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-slate-500">{label}</span>
        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", colorStyles[color as keyof typeof colorStyles])}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
      <div className="flex items-center gap-1 mt-1">
        {trend === 'up' ? (
          <TrendingUp className="w-3 h-3 text-green-500" />
        ) : trend === 'down' ? (
          <TrendingDown className="w-3 h-3 text-red-500" />
        ) : (
          <Activity className="w-3 h-3 text-slate-400" />
        )}
        <span className={cn(
          "text-xs font-medium",
          trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-slate-500'
        )}>
          {trendValue}
        </span>
        <span className="text-xs text-slate-400">vs last month</span>
      </div>
    </div>
  )
}
