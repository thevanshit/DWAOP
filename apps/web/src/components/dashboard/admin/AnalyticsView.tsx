'use client'

import { Users, Award, Layers, TrendingUp } from 'lucide-react'
import { StatCard } from './StatCard'

const attendanceData = [
  { id: 'att-above75', label: 'Above 75%', value: 78, color: 'bg-green-500' },
  { id: 'att-65-75', label: '65-75%', value: 15, color: 'bg-amber-500' },
  { id: 'att-below65', label: 'Below 65%', value: 7, color: 'bg-red-500' },
]

const workflowData = [
  { id: 'wf-completed', label: 'Completed', value: 45, color: 'bg-green-500' },
  { id: 'wf-progress', label: 'In Progress', value: 25, color: 'bg-blue-500' },
  { id: 'wf-pending', label: 'Pending', value: 20, color: 'bg-slate-400' },
  { id: 'wf-delayed', label: 'Delayed', value: 10, color: 'bg-red-500' },
]

const requestData = [
  { id: 'req-approved', label: 'Approved', value: 65, color: 'bg-green-500' },
  { id: 'req-pending', label: 'Pending', value: 25, color: 'bg-amber-500' },
  { id: 'req-rejected', label: 'Rejected', value: 10, color: 'bg-red-500' },
]

const batchData = [
  { id: 'batch-aiml', batch: 'CSE-AIML', attendance: 82, marks: 78 },
  { id: 'batch-cse', batch: 'CSE', attendance: 79, marks: 75 },
  { id: 'batch-it', batch: 'IT', attendance: 85, marks: 80 },
]

const facultyLoadData = [
  { id: 'fl-amit', name: 'Dr. Amit Kumar', load: 85 },
  { id: 'fl-vineet', name: 'Dr. Vineet Jain', load: 78 },
  { id: 'fl-priya', name: 'Dr. Priya Sharma', load: 72 },
]

export function AnalyticsView() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Analytics</h2>
        <p className="text-sm text-slate-500 mt-1">Department performance metrics & insights</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Students" value="240" icon={Users} color="blue" />
        <StatCard label="Faculty Members" value="12" icon={Award} color="green" />
        <StatCard label="Batches" value="3" icon={Layers} color="purple" />
        <StatCard label="Avg CGPA" value="8.1" icon={TrendingUp} color="amber" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <h3 className="text-base font-semibold text-slate-900 mb-4">Student Attendance</h3>
          <div className="space-y-3">
            {attendanceData.map((item) => (
              <div key={item.id}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-600">{item.label}</span>
                  <span className="font-medium text-slate-900">{item.value}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className={`${item.color} h-2 rounded-full`} style={{ width: `${item.value}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">At Risk Students</span>
              <span className="text-sm font-bold text-red-600">12</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <h3 className="text-base font-semibold text-slate-900 mb-4">Workflow Status</h3>
          <div className="space-y-3">
            {workflowData.map((item) => (
              <div key={item.id}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-600">{item.label}</span>
                  <span className="font-medium text-slate-900">{item.value}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className={`${item.color} h-2 rounded-full`} style={{ width: `${item.value}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">Active Tasks</span>
              <span className="text-sm font-bold text-blue-600">24</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <h3 className="text-base font-semibold text-slate-900 mb-4">Request Resolution</h3>
          <div className="space-y-3">
            {requestData.map((item) => (
              <div key={item.id}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-600">{item.label}</span>
                  <span className="font-medium text-slate-900">{item.value}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className={`${item.color} h-2 rounded-full`} style={{ width: `${item.value}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">Avg Resolution Time</span>
              <span className="text-sm font-bold text-purple-600">2.5 days</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <h3 className="text-base font-semibold text-slate-900 mb-4">Batch Performance</h3>
          <div className="space-y-3">
            {batchData.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <span className="text-sm font-medium text-slate-700">{item.batch}</span>
                <div className="flex gap-4">
                  <span className="text-xs text-slate-500">Att: <span className="font-medium text-slate-900">{item.attendance}%</span></span>
                  <span className="text-xs text-slate-500">Marks: <span className="font-medium text-slate-900">{item.marks}</span></span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <h3 className="text-base font-semibold text-slate-900 mb-4">Faculty Workload</h3>
          <div className="space-y-3">
            {facultyLoadData.map((item) => (
              <div key={item.id}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-600">{item.name}</span>
                  <span className={(item.load >= 80 ? "text-red-600" : item.load >= 70 ? "text-amber-600" : "text-green-600")}>{item.load}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${item.load >= 80 ? 'bg-red-500' : item.load >= 70 ? 'bg-amber-500' : 'bg-green-500'}`}
                    style={{ width: `${item.load}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
