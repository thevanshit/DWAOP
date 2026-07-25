'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, Layers, Loader2, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useStudentDashboard } from '@/hooks/useStudentDashboard'
import { StudentDashboardProvider } from '@/components/dashboard/student/StudentDashboardProvider'
import { useAuth } from '@/lib/auth-context'
import {
  Sidebar,
  OverviewTab,
  AssignmentsTab,
  AttendanceTab,
  MarksTab,
  TrackReportTab,
  FeesTab,
  HostelTab,
  SportsTab,
  RequestsTab,
  SettingsTab,
} from '@/components/dashboard/student'
import TimetableViewer from '@/components/dashboard/TimetableViewer'

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
}

type TabType =
  | 'overview' | 'timetable' | 'assignments' | 'attendance' | 'marks'
  | 'track' | 'fees' | 'hostel' | 'sports' | 'requests' | 'settings'

export default function StudentDashboard() {
  const { user, stats, loading, error } = useStudentDashboard()
  const { isAuthenticated, loading: authLoading } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<TabType>('overview')

  // Auth guard: redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [authLoading, isAuthenticated, router])
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Minor 2 Exam Schedule', message: 'Minor 2 exams from March 1-5, 2026', time: '2 hours ago', read: false, type: 'urgent' },
    { id: 2, title: 'Assignment Submitted', message: 'Your DBMS assignment has been evaluated', time: '1 day ago', read: true, type: 'success' },
    { id: 3, title: 'Attendance Warning', message: 'Your attendance dropped below 75% in OS', time: '2 days ago', read: true, type: 'warning' },
  ])

  // Build currentUser from real API data with fallback
  const currentUser = user ? {
    name: user.name,
    rollNumber: user.email?.split('@')[0] || '',
    semester: 4,
    branch: 'CSE',
    specialization: user.specialization || 'AI/ML',
    avatar: user.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'VG',
  } : {
    name: 'Vanshit Gaur',
    rollNumber: '240010150100',
    semester: 4,
    branch: 'CSE',
    specialization: 'AI/ML',
    avatar: 'VG',
  }

  // Build analytics from real API stats with fallback
  const analytics = {
    overallAttendance: stats?.attendancePercentage ?? 82,
    cgpa: 8.4,
    pendingAssignments: stats?.pendingAssignments ?? 3,
    rank: 12,
    totalStudents: 80,
  }

  // Auth loading state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600 mx-auto" />
          <p className="text-slate-600 font-medium">Checking authentication...</p>
        </div>
      </div>
    )
  }

  // Dashboard data loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600 mx-auto" />
          <p className="text-slate-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error && !user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
          <h2 className="text-xl font-semibold text-slate-900">Failed to load</h2>
          <p className="text-slate-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <StudentDashboardProvider>
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Navbar */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-4 left-4 right-4 h-14 bg-white/90 backdrop-blur-xl rounded-2xl shadow-sm border border-slate-200/50 z-50 flex items-center px-5"
      >
        <div className="flex items-center gap-2.5 mr-6">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/25">
            <Layers className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-base tracking-tight text-slate-900 leading-none">DeptWP</span>
            <span className="text-[9px] text-slate-400 -mt-0.5">Student Portal</span>
          </div>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2.5 hover:bg-slate-100 rounded-xl transition-all duration-200"
            >
              <Bell className="w-5 h-5 text-slate-600" />
              {notifications.some((n) => !n.read) && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white" />
              )}
            </button>
            {showNotifications && (
              <div className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-50">
                <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                  <span className="font-semibold text-slate-800">Notifications</span>
                  <button
                    onClick={() => setNotifications(notifications.map((n) => ({ ...n, read: true })))}
                    className="text-xs text-blue-600 hover:underline"
                  >
                    Mark all read
                  </button>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`px-4 py-3 border-b border-slate-50 hover:bg-slate-50 transition-colors ${!notif.read ? 'bg-blue-50/50' : ''}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-2 h-2 rounded-full mt-2 ${notif.type === 'urgent' ? 'bg-red-500' : notif.type === 'success' ? 'bg-green-500' : 'bg-amber-500'}`} />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-slate-800">{notif.title}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{notif.message}</p>
                          <p className="text-[10px] text-slate-400 mt-1">{notif.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-2 bg-slate-50 text-center">
                  <button className="text-xs text-blue-600 font-medium hover:underline">View All Notifications</button>
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2.5 pl-2.5 border-l border-slate-200">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center text-white font-bold shadow-lg ring-2 ring-blue-50/50">
              {currentUser.avatar}
            </div>
            <div className="hidden lg:block">
              <p className="text-sm font-semibold text-slate-900">{currentUser.name}</p>
              <p className="text-[10px] text-slate-500">Sem {currentUser.semester} &bull; {currentUser.branch}</p>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={(tab: string) => setActiveTab(tab as TabType)}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        pendingAssignments={analytics.pendingAssignments}
      />

      {/* Main Content */}
      <main
        className={cn("pt-20 px-6 pb-6 min-h-screen transition-all duration-300", sidebarCollapsed ? "ml-[104px]" : "ml-[288px]")}
      >
        <div className="max-w-[1400px] mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              variants={containerVariants}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0 }}
            >
              {activeTab === 'overview' && <OverviewTab analytics={analytics} currentUser={currentUser} />}
              {activeTab === 'timetable' && <TimetableViewer />}
              {activeTab === 'assignments' && <AssignmentsTab />}
              {activeTab === 'attendance' && <AttendanceTab />}
              {activeTab === 'marks' && <MarksTab />}
              {activeTab === 'track' && <TrackReportTab />}
              {activeTab === 'fees' && <FeesTab />}
              {activeTab === 'hostel' && <HostelTab />}
              {activeTab === 'sports' && <SportsTab />}
              {activeTab === 'requests' && <RequestsTab />}
              {activeTab === 'settings' && <SettingsTab />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
    </StudentDashboardProvider>
  )
}
