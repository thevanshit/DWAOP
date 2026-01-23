'use client'

import DashboardLayout from '@/components/common/DashboardLayout'
import {
  Home,
  Calendar,
  FileText,
  Users,
  Clock,
  CheckCircle,
  TrendingUp,
  TrendingDown,
} from 'lucide-react'
import { useState } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'

const performanceData = [
  { subject: 'DS', internal: 85 },
  { subject: 'DBMS', internal: 73 },
  { subject: 'SE', internal: 88 },
  { subject: 'CN', internal: 80 },
]

const attendanceTrend = [
  { week: 'W1', attendance: 82 },
  { week: 'W2', attendance: 78 },
  { week: 'W3', attendance: 85 },
  { week: 'W4', attendance: 88 },
  { week: 'W5', attendance: 90 },
  { week: 'W6', attendance: 87 },
]

const attendanceHeatmapSubjects = ['DS', 'DBMS', 'SE', 'CN']
const attendanceHeatmapDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
const attendanceHeatmapData: number[][] = [
  [1, 1, 0, 1, 1],
  [1, 0, 1, 1, 1],
  [1, 1, 1, 0, 1],
  [0, 1, 1, 1, 0],
]

export default function StudentDashboard() {
  const [selectedTab, setSelectedTab] = useState('overview')

  const navItems = [
    { label: 'Dashboard', icon: <Home className="w-5 h-5" />, href: '#overview' },
    { label: 'Assignments', icon: <FileText className="w-5 h-5" />, href: '#assignments' },
    { label: 'Attendance', icon: <Users className="w-5 h-5" />, href: '#attendance' },
    { label: 'Marks & Grades', icon: <CheckCircle className="w-5 h-5" />, href: '#marks' },
    { label: 'Leave Requests', icon: <Calendar className="w-5 h-5" />, href: '#leaves' },
    { label: 'Track Report', icon: <TrendingUp className="w-5 h-5" />, href: '#track-report' },
  ]

  return (
    <DashboardLayout role="student" roleLabel="Student Dashboard" navItems={navItems}>
      <div className="space-y-6">
        {/* Header */}
        <div className="relative overflow-hidden rounded-2xl border border-gray-100 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 p-6">
          <div className="absolute inset-y-0 right-0 w-1/3 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.15),transparent_55%)]" />
          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                Welcome back, <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Student</span>
              </h1>
              <p className="text-gray-600">
                Here&apos;s your academic snapshot for this semester.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <div className="flex flex-col items-center px-4 py-2 rounded-xl bg-white/70 backdrop-blur border border-gray-100">
                <span className="text-xs text-gray-500">Overall Attendance</span>
                <span className="text-xl font-bold text-green-600">85%</span>
              </div>
              <div className="flex flex-col items-center px-4 py-2 rounded-xl bg-white/70 backdrop-blur border border-gray-100">
                <span className="text-xs text-gray-500">Assignments Done</span>
                <span className="text-xl font-bold text-blue-600">8 / 10</span>
              </div>
              <div className="flex flex-col items-center px-4 py-2 rounded-xl bg-white/70 backdrop-blur border border-gray-100">
                <span className="text-xs text-gray-500">Eligibility</span>
                <span className="text-xl font-bold text-green-600">Eligible</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-4">
          <div className="rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white p-5 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide opacity-80 mb-1">Pending Workflows</p>
                <p className="text-3xl font-bold">5</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-orange-400 to-amber-500 text-white p-5 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide opacity-80 mb-1">Upcoming Deadlines</p>
                <p className="text-3xl font-bold">3</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 text-white p-5 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide opacity-80 mb-1">Attendance</p>
                <p className="text-3xl font-bold">85%</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 text-white p-5 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide opacity-80 mb-1">Eligibility Status</p>
                <p className="text-xl font-bold text-emerald-200">Eligible</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Tabs */}
        <div className="card rounded-2xl">
          <div className="border-b border-jira-gray-200 mb-6">
            <div className="flex space-x-6 overflow-x-auto">
              {['overview', 'assignments', 'attendance', 'marks', 'leaves', 'track-report'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSelectedTab(tab)}
                  className={`pb-4 px-2 font-medium text-sm border-b-2 transition-colors ${
                    selectedTab === tab
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-jira-gray-600 hover:text-jira-gray-900'
                  }`}
                >
                  {tab.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Overview Tab */}
          {selectedTab === 'overview' && (
            <div className="space-y-6">
              {/* Charts Row */}
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Internal Performance Chart */}
                <div className="p-4 rounded-xl border border-gray-200 bg-gradient-to-br from-blue-50 via-white to-purple-50">
                  <h3 className="text-sm font-semibold text-gray-800 mb-1">Internal Marks Overview</h3>
                  <p className="text-xs text-gray-500 mb-4">
                    Compare your internal marks across subjects
                  </p>
                  <div className="h-56">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={performanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis dataKey="subject" stroke="#6B7280" />
                        <YAxis stroke="#6B7280" />
                        <Tooltip
                          contentStyle={{ borderRadius: 12, borderColor: '#E5E7EB' }}
                          cursor={{ fill: 'rgba(59,130,246,0.05)' }}
                        />
                        <Bar dataKey="internal" fill="url(#colorInternal)" radius={[8, 8, 0, 0]} />
                        <defs>
                          <linearGradient id="colorInternal" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.9} />
                            <stop offset="95%" stopColor="#6366F1" stopOpacity={0.8} />
                          </linearGradient>
                        </defs>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Attendance Trend Chart */}
                <div className="p-4 rounded-xl border border-gray-200 bg-gradient-to-br from-emerald-50 via-white to-blue-50">
                  <h3 className="text-sm font-semibold text-gray-800 mb-1">Attendance Trend</h3>
                  <p className="text-xs text-gray-500 mb-4">
                    Weekly attendance percentage for the current semester
                  </p>
                  <div className="h-56">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={attendanceTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis dataKey="week" stroke="#6B7280" />
                        <YAxis stroke="#6B7280" />
                        <Tooltip
                          contentStyle={{ borderRadius: 12, borderColor: '#E5E7EB' }}
                          cursor={{ fill: 'rgba(16,185,129,0.05)' }}
                        />
                        <Bar dataKey="attendance" fill="url(#colorAttendance)" radius={[8, 8, 0, 0]} />
                        <defs>
                          <linearGradient id="colorAttendance" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#22C55E" stopOpacity={0.9} />
                            <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0.8} />
                          </linearGradient>
                        </defs>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Pending Workflows */}
              <div>
                <h3 className="text-lg font-semibold mb-4">My Pending Workflows</h3>
                <div className="space-y-3">
                  {[
                    { title: 'Submit Assignment: Data Structures', type: 'assignment', due: '2 days', status: 'pending' },
                    { title: 'Acknowledge Attendance Warning', type: 'warning', due: '1 day', status: 'urgent' },
                    { title: 'Leave Request Under Review', type: 'leave', due: '3 days', status: 'review' },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-jira-gray-50 rounded-lg border border-jira-gray-200">
                      <div className="flex items-center space-x-4">
                        <div className={`w-2 h-2 rounded-full ${
                          item.status === 'urgent' ? 'bg-red-500' : 
                          item.status === 'review' ? 'bg-yellow-500' : 'bg-blue-500'
                        }`}></div>
                        <div>
                          <p className="font-medium text-jira-gray-900">{item.title}</p>
                          <p className="text-sm text-jira-gray-600">Due in {item.due}</p>
                        </div>
                      </div>
                      <button className="btn-primary text-sm px-4 py-1">View</button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Upcoming Deadlines */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Upcoming Deadlines</h3>
                <div className="space-y-3">
                  {[
                    { title: 'Database Management Assignment', subject: 'DBMS', date: 'Dec 15, 2024', time: '11:59 PM' },
                    { title: 'Software Engineering Project', subject: 'SE', date: 'Dec 20, 2024', time: '11:59 PM' },
                    { title: 'Review Window Closes', subject: 'Internal Marks', date: 'Dec 18, 2024', time: '5:00 PM' },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-jira-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-jira-gray-900">{item.title}</p>
                        <p className="text-sm text-jira-gray-600">{item.subject} • {item.date} at {item.time}</p>
                      </div>
                      <Clock className="w-5 h-5 text-jira-gray-400" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Attendance & Eligibility Status */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 bg-blue-50 rounded-lg border border-blue-200">
                  <h3 className="font-semibold mb-4 flex items-center">
                    <Users className="w-5 h-5 mr-2 text-blue-600" />
                    Attendance Status
                  </h3>
                  <div className="space-y-3">
                    {[
                      { subject: 'Data Structures', percentage: 88, status: 'good' },
                      { subject: 'Database Management', percentage: 75, status: 'at-risk' },
                      { subject: 'Software Engineering', percentage: 92, status: 'good' },
                    ].map((item, idx) => (
                      <div key={idx}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium">{item.subject}</span>
                          <span className={item.status === 'at-risk' ? 'text-orange-600' : 'text-green-600'}>
                            {item.percentage}%
                          </span>
                        </div>
                        <div className="w-full bg-jira-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              item.status === 'at-risk' ? 'bg-orange-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${item.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-6 bg-green-50 rounded-lg border border-green-200">
                  <h3 className="font-semibold mb-4 flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                    Eligibility Status
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-3xl font-bold text-green-600 mb-2">Eligible</p>
                      <p className="text-sm text-jira-gray-600">
                        You meet all requirements for end-semester examinations.
                      </p>
                    </div>
                    <div className="pt-4 border-t border-green-200">
                      <p className="text-sm font-medium mb-2">Remaining Allowable Absences:</p>
                      <div className="space-y-2">
                        {['Data Structures: 4', 'Database Management: 2', 'Software Engineering: 6'].map((item, idx) => (
                          <p key={idx} className="text-sm text-jira-gray-700">{item}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Assignments Tab */}
          {selectedTab === 'assignments' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">My Assignments</h3>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 text-sm border border-jira-gray-300 rounded hover:bg-jira-gray-100">
                    All
                  </button>
                  <button className="px-3 py-1 text-sm border border-jira-gray-300 rounded hover:bg-jira-gray-100">
                    Pending
                  </button>
                  <button className="px-3 py-1 text-sm border border-jira-gray-300 rounded hover:bg-jira-gray-100">
                    Submitted
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  {
                    title: 'Data Structures Assignment 3',
                    subject: 'Data Structures',
                    status: 'assigned',
                    deadline: 'Dec 15, 2024',
                    maxMarks: 100,
                    submitted: false,
                  },
                  {
                    title: 'Database Design Project',
                    subject: 'Database Management',
                    status: 'submitted',
                    deadline: 'Dec 10, 2024',
                    maxMarks: 150,
                    submitted: true,
                    submittedDate: 'Dec 9, 2024',
                  },
                  {
                    title: 'SE Project Documentation',
                    subject: 'Software Engineering',
                    status: 'evaluated',
                    deadline: 'Dec 5, 2024',
                    maxMarks: 200,
                    submitted: true,
                    marks: 175,
                  },
                ].map((assignment, idx) => (
                  <div key={idx} className="p-4 border border-jira-gray-200 rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-semibold text-jira-gray-900">{assignment.title}</h4>
                          <span className={`px-2 py-1 text-xs rounded ${
                            assignment.status === 'assigned' ? 'bg-blue-100 text-blue-700' :
                            assignment.status === 'submitted' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {assignment.status}
                          </span>
                        </div>
                        <p className="text-sm text-jira-gray-600 mb-2">{assignment.subject}</p>
                        <div className="flex items-center space-x-4 text-sm text-jira-gray-600">
                          <span>Deadline: {assignment.deadline}</span>
                          <span>Max Marks: {assignment.maxMarks}</span>
                          {assignment.marks && <span className="text-green-600 font-medium">Marks: {assignment.marks}/{assignment.maxMarks}</span>}
                        </div>
                      </div>
                      <div className="ml-4">
                        {assignment.status === 'assigned' ? (
                          <button className="btn-primary text-sm px-4 py-2">Submit</button>
                        ) : assignment.status === 'submitted' ? (
                          <span className="text-sm text-jira-gray-600">Submitted</span>
                        ) : (
                          <button className="text-sm text-jira-blue-600 hover:underline">View Feedback</button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Attendance Tab */}
          {selectedTab === 'attendance' && (
            <div className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Subject-wise Attendance Cards */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Subject-wise Attendance</h3>
                  <div className="space-y-4">
                    {[
                      { subject: 'Data Structures', percentage: 88, total: 50, present: 44, absent: 6, trend: 'up' },
                      { subject: 'Database Management', percentage: 75, total: 48, present: 36, absent: 12, trend: 'down' },
                      { subject: 'Software Engineering', percentage: 92, total: 45, present: 41, absent: 4, trend: 'up' },
                    ].map((item, idx) => (
                      <div key={idx} className="p-6 border border-jira-gray-200 rounded-xl bg-white">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-semibold text-lg">{item.subject}</h4>
                          <div className="flex items-center space-x-2">
                            {item.trend === 'up' ? (
                              <TrendingUp className="w-5 h-5 text-green-600" />
                            ) : (
                              <TrendingDown className="w-5 h-5 text-red-600" />
                            )}
                            <span
                              className={`text-2xl font-bold ${
                                item.percentage >= 75 ? 'text-green-600' : 'text-orange-600'
                              }`}
                            >
                              {item.percentage}%
                            </span>
                          </div>
                        </div>
                        <div className="w-full bg-jira-gray-200 rounded-full h-3 mb-3">
                          <div
                            className={`h-3 rounded-full ${
                              item.percentage >= 75 ? 'bg-green-500' : 'bg-orange-500'
                            }`}
                            style={{ width: `${item.percentage}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-sm text-jira-gray-600">
                          <span>Total Classes: {item.total}</span>
                          <span>Present: {item.present}</span>
                          <span>Absent: {item.absent}</span>
                          <span>
                            Remaining Allowable:{' '}
                            {Math.max(0, Math.floor(item.total * 0.25) - item.absent)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Attendance Heat Map */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Attendance Heat Map</h3>
                  <div className="p-4 rounded-xl border border-jira-gray-200 bg-gradient-to-br from-blue-50 via-white to-emerald-50">
                    <p className="text-xs text-gray-600 mb-3">
                      Green = Present, Red = Absent across the last 5 class days
                    </p>
                    <div className="overflow-x-auto">
                      <div className="inline-block min-w-full align-middle">
                        <div className="grid" style={{ gridTemplateColumns: `80px repeat(${attendanceHeatmapDays.length}, minmax(40px, 1fr))` }}>
                          {/* Header row */}
                          <div />
                          {attendanceHeatmapDays.map((day) => (
                            <div
                              key={day}
                              className="text-xs font-medium text-center text-gray-600 pb-2"
                            >
                              {day}
                            </div>
                          ))}

                          {/* Rows */}
                          {attendanceHeatmapSubjects.map((subject, rowIdx) => (
                            <>
                              <div
                                key={`${subject}-label`}
                                className="text-xs font-medium text-gray-700 pr-2 flex items-center"
                              >
                                {subject}
                              </div>
                              {attendanceHeatmapDays.map((day, colIdx) => {
                                const value = attendanceHeatmapData[rowIdx][colIdx]
                                return (
                                  <div
                                    key={`${subject}-${day}`}
                                    className={`h-8 w-full rounded-md border transition-transform duration-150 ${
                                      value === 1
                                        ? 'bg-emerald-500/80 border-emerald-500 hover:scale-105'
                                        : 'bg-red-400/80 border-red-500 hover:scale-105'
                                    }`}
                                  />
                                )
                              })}
                            </>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Marks Tab */}
          {selectedTab === 'marks' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold mb-4">Internal Marks</h3>
              <div className="space-y-4">
                {[
                  {
                    subject: 'Data Structures',
                    status: 'under_review',
                    components: { assignments: 35, tests: 40, attendance: 10 },
                    total: 85,
                    maxTotal: 100,
                  },
                  {
                    subject: 'Database Management',
                    status: 'finalised',
                    components: { assignments: 30, tests: 35, attendance: 8 },
                    total: 73,
                    maxTotal: 100,
                  },
                  {
                    subject: 'Software Engineering',
                    status: 'draft',
                    components: { assignments: 0, tests: 0, attendance: 0 },
                    total: 0,
                    maxTotal: 100,
                  },
                ].map((item, idx) => (
                  <div key={idx} className="p-6 border border-jira-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-lg">{item.subject}</h4>
                      <span className={`px-3 py-1 text-xs rounded ${
                        item.status === 'draft' ? 'bg-gray-100 text-gray-700' :
                        item.status === 'under_review' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {item.status.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="grid grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-jira-gray-600">Assignments</p>
                        <p className="text-lg font-semibold">{item.components.assignments}/40</p>
                      </div>
                      <div>
                        <p className="text-sm text-jira-gray-600">Tests</p>
                        <p className="text-lg font-semibold">{item.components.tests}/40</p>
                      </div>
                      <div>
                        <p className="text-sm text-jira-gray-600">Attendance</p>
                        <p className="text-lg font-semibold">{item.components.attendance}/20</p>
                      </div>
                      <div>
                        <p className="text-sm text-jira-gray-600">Total</p>
                        <p className="text-lg font-semibold text-jira-blue-600">{item.total}/{item.maxTotal}</p>
                      </div>
                    </div>
                    {item.status === 'under_review' && (
                      <button className="text-sm text-jira-blue-600 hover:underline">
                        Request Clarification
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Leaves Tab */}
          {selectedTab === 'leaves' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Leave Requests</h3>
                <button className="btn-primary">New Leave Request</button>
              </div>
              <div className="space-y-3">
                {[
                  {
                    type: 'medical',
                    dates: 'Dec 10-12, 2024',
                    status: 'approved',
                    reason: 'Medical emergency',
                  },
                  {
                    type: 'academic',
                    dates: 'Dec 18, 2024',
                    status: 'under_review',
                    reason: 'Conference participation',
                  },
                  {
                    type: 'personal',
                    dates: 'Dec 20, 2024',
                    status: 'rejected',
                    reason: 'Personal work',
                  },
                ].map((leave, idx) => (
                  <div key={idx} className="p-4 border border-jira-gray-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">{leave.type}</span>
                          <span className={`px-2 py-1 text-xs rounded ${
                            leave.status === 'approved' ? 'bg-green-100 text-green-700' :
                            leave.status === 'under_review' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {leave.status.replace('_', ' ')}
                          </span>
                        </div>
                        <p className="font-medium">{leave.dates}</p>
                        <p className="text-sm text-jira-gray-600">{leave.reason}</p>
                      </div>
                      <button className="text-sm text-jira-blue-600 hover:underline">View Details</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Track Report Tab */}
          {selectedTab === 'track-report' && (
            <div className="space-y-6">
              <div className="p-6 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="text-lg font-semibold mb-4">Student Track Report</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-jira-gray-600 mb-2">Current Status</p>
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded text-sm font-medium">
                      Under Review
                    </span>
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="p-4 bg-white rounded-lg">
                      <p className="text-sm text-jira-gray-600 mb-1">Overall Attendance</p>
                      <p className="text-2xl font-bold">85%</p>
                    </div>
                    <div className="p-4 bg-white rounded-lg">
                      <p className="text-sm text-jira-gray-600 mb-1">Assignments Completed</p>
                      <p className="text-2xl font-bold">8/10</p>
                    </div>
                    <div className="p-4 bg-white rounded-lg">
                      <p className="text-sm text-jira-gray-600 mb-1">Eligibility</p>
                      <p className="text-2xl font-bold text-green-600">Eligible</p>
                    </div>
                  </div>
                  <button className="btn-primary">View Full Report</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
