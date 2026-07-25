'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Megaphone, Building2, GraduationCap, Calendar, CheckCircle,
  AlertCircle, Award, FileText, AlertTriangle, Clock, TrendingUp,
  ArrowUpRight, ArrowDownRight, XCircle, Download, BookOpen,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useStudentDashboardData } from './StudentDashboardProvider'
import {
  ADMIN_ANNOUNCEMENTS, FACULTY_ANNOUNCEMENTS,
  UPCOMING_CLASSES, TODAY_CLASSES, SEMESTER_RESOURCES, SUBJECT_NOTES,
} from './data'

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } }
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
}

function QuickStatCard({ label, value, icon: Icon, color, trend, sub }: any) {
  const colorMap: Record<string, string> = {
    blue: 'from-blue-50 to-blue-100 text-blue-700',
    green: 'from-green-50 to-green-100 text-green-700',
    amber: 'from-amber-50 to-amber-100 text-amber-700',
    purple: 'from-purple-50 to-purple-100 text-purple-700',
    red: 'from-red-50 to-red-100 text-red-700',
  }

  return (
    <motion.div variants={itemVariants} className="bg-white rounded-2xl p-5 border border-slate-200/60 shadow-[0_2px_8px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08),0_8px_24px_rgba(0,0,0,0.06)] hover:border-slate-300/60 transition-all duration-300">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-slate-500">{label}</span>
        <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center shadow-sm", colorMap[color])}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div className="flex items-baseline gap-1.5">
        <p className="text-3xl font-bold text-slate-900">{value}</p>
      </div>
      <p className="text-[10px] text-slate-500 mt-1">{sub}</p>
    </motion.div>
  )
}

function OverviewView({
  analytics,
  currentUser
}: {
  analytics: { overallAttendance: number, cgpa: number, pendingAssignments: number, rank: number, totalStudents: number },
  currentUser: { name: string, rollNumber: string, semester: number, branch: string, specialization: string, avatar: string }
}) {
  const { subjects, marks, assignments } = useStudentDashboardData()
  const router = useRouter()
  const currentHour = new Date().getHours()
  const greeting = currentHour < 12 ? 'Good morning' : currentHour < 17 ? 'Good afternoon' : 'Good evening'

  const pendingAssignmentsCount = assignments.filter(a => a.status === 'pending').length
  const totalClasses = subjects.reduce((sum, s) => sum + s.totalClasses, 0)
  const totalPresent = subjects.reduce((sum, s) => sum + s.presentClasses, 0)
  const overallAttendance = Math.round((totalPresent / totalClasses) * 100)

  const getEligibilityStatus = (attendance: number) => {
    if (attendance >= 75) return { status: 'Eligible', color: 'green', icon: CheckCircle }
    if (attendance >= 65) return { status: 'At Risk', color: 'yellow', icon: AlertCircle }
    return { status: 'Not Eligible', color: 'red', icon: XCircle }
  }
  const eligibility = getEligibilityStatus(overallAttendance)

  const quickStats = [
    { label: 'Attendance', value: `${overallAttendance}%`, sub: 'Above 75%', icon: Calendar, color: 'blue', trend: 'up' },
    { label: 'Internal Marks', value: `${marks.reduce((sum, m) => sum + m.total, 0)}/${marks.length * 30}`, sub: `${marks.length} Subjects`, icon: Award, color: 'green', trend: 'up' },
    { label: 'Pending', value: pendingAssignmentsCount.toString(), sub: 'Assignments', icon: FileText, color: 'amber', trend: 'down' },
    { label: 'Eligible', value: eligibility.status, sub: 'For Exams', icon: CheckCircle, color: eligibility.color === 'green' ? 'green' : eligibility.color === 'yellow' ? 'amber' : 'red', trend: 'up' },
  ]

  const getSmartStatus = () => {
    const statuses: { type: string; text: string; icon: any }[] = []
    if (pendingAssignmentsCount > 0) {
      statuses.push({ type: 'warning', text: `${pendingAssignmentsCount} assignments pending`, icon: FileText })
    }
    if (overallAttendance < 75) {
      statuses.push({ type: 'danger', text: 'Attendance below 75%', icon: AlertTriangle })
    } else {
      statuses.push({ type: 'success', text: 'Attendance eligible', icon: CheckCircle })
    }
    statuses.push({ type: 'info', text: 'Next class in 30 minutes', icon: Clock })
    return statuses
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div 
        variants={itemVariants}
        className="bg-gradient-to-br from-white via-slate-50 to-white rounded-2xl border border-slate-200/60 shadow-[0_1px_3px_rgba(0,0,0,0.02),0_4px_12px_rgba(0,0,0,0.02)] p-6 md:p-8"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold text-slate-900">
                {greeting}, <span className="text-blue-600">{currentUser.name.split(' ')[0]}</span>!
              </h1>
              <div className="text-slate-500 mt-2 space-y-0.5">
                <p className="text-sm">Sem {currentUser.semester} &bull; BTech &bull; {currentUser.branch} ({currentUser.specialization})</p>
                <p className="text-sm">Roll No: {currentUser.rollNumber}</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Smart Status */}
      <motion.div variants={itemVariants} className="flex flex-wrap gap-2.5">
        {getSmartStatus().map((status, i) => (
          <div
            key={i}
            className={cn(
              "flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border backdrop-blur-sm",
              status.type === 'danger' ? "bg-red-50/80 text-red-700 border-red-200" :
              status.type === 'success' ? "bg-green-50/80 text-green-700 border-green-200" :
              status.type === 'warning' ? "bg-amber-50/80 text-amber-700 border-amber-200" :
              "bg-blue-50/80 text-blue-700 border-blue-200"
            )}
          >
            <status.icon className="w-3.5 h-3.5" />
            {status.text}
          </div>
        ))}
      </motion.div>

      {/* Quick Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat, i) => (
          <QuickStatCard key={i} {...stat} />
        ))}
      </motion.div>

      {/* Announcements Section */}
      <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl flex items-center justify-center text-amber-600 shadow-sm">
              <Megaphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 text-base">Announcements</h3>
              <p className="text-xs text-slate-500">Stay updated with latest notices</p>
            </div>
          </div>
        </div>
        <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100">
          {/* Administration */}
          <div className="p-5 space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <Building2 className="w-4 h-4 text-blue-600" />
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Administration</p>
            </div>
            <div className="space-y-3">
              {ADMIN_ANNOUNCEMENTS.map((ann) => (
                <div key={ann.id} className="p-3 rounded-xl border bg-blue-50/40 border-blue-100 hover:bg-blue-50/60 transition-colors">
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <p className="font-medium text-sm text-slate-800 line-clamp-2">{ann.title}</p>
                    {ann.priority === 'high' && <span className="w-2 h-2 bg-red-500 rounded-full shrink-0 mt-1" />}
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-2">{ann.message}</p>
                  <span className="text-[10px] text-slate-400 mt-2 block">{ann.date}</span>
                </div>
              ))}
            </div>
          </div>
          {/* Faculty Updates */}
          <div className="p-5 space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <GraduationCap className="w-4 h-4 text-slate-600" />
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Faculty Updates</p>
            </div>
            <div className="space-y-3">
              {FACULTY_ANNOUNCEMENTS.slice(0, 3).map((ann) => (
                <div key={ann.id} className="p-3 rounded-xl border bg-slate-50 border-slate-200 hover:bg-slate-100/60 transition-colors">
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <p className="font-medium text-sm text-slate-800 line-clamp-2">{ann.title}</p>
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-2">{ann.message}</p>
                  <div className="flex items-center justify-between mt-2">
                    {ann.subject && <span className="text-[10px] font-medium text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">{ann.subject}</span>}
                    <span className="text-[10px] text-slate-400">{ann.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Weekly Timetable Preview */}
      <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-slate-800 text-base">Weekly Timetable</h3>
            <p className="text-xs text-slate-500 mt-0.5">B.Tech {currentUser.branch} {currentUser.specialization} &bull; Sem {currentUser.semester}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 bg-slate-300 rounded-sm"></div>
              <span className="text-[11px] text-slate-500 font-medium">Lab</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 bg-blue-300 rounded-sm"></div>
              <span className="text-[11px] text-slate-500 font-medium">Lecture</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 bg-amber-200 rounded-sm"></div>
              <span className="text-[11px] text-slate-500 font-medium">Lunch</span>
            </div>
          </div>
        </div>
        <div className="p-4 overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Time Header */}
            <div className="grid grid-cols-[50px_repeat(9,1fr)] gap-1.5 text-[9px] text-slate-400 mb-2">
              <div></div>
              <div className="text-center font-medium">8:30<br/>-9:30</div>
              <div className="text-center font-medium">9:30<br/>-10:30</div>
              <div className="text-center font-medium">10:30<br/>-11:30</div>
              <div className="text-center font-medium">11:30<br/>-12:30</div>
              <div className="text-center font-medium text-amber-600">12:30<br/>-1:30</div>
              <div className="text-center font-medium">1:30<br/>-2:30</div>
              <div className="text-center font-medium">2:30<br/>-3:30</div>
              <div className="text-center font-medium">3:30<br/>-4:30</div>
              <div className="text-center font-medium">4:30<br/>-5:30</div>
            </div>
            {/* MONDAY */}
            <div className="grid grid-cols-[50px_repeat(9,1fr)] gap-1.5 mb-1.5">
              <div className="flex items-center justify-center text-xs font-semibold text-slate-500">MON</div>
              <div className="p-1.5 text-[8px] bg-slate-100 rounded border border-slate-200 text-center font-medium col-span-2">Python LAB G1<br/>DM LAB G2</div>
              <div className="p-1.5 text-[9px] bg-white rounded border border-slate-200 text-center font-medium">SE</div>
              <div className="p-1.5 text-[9px] bg-white rounded border border-slate-200 text-center font-medium">AI</div>
              <div className="p-1.5 text-[9px] bg-amber-50 rounded border border-amber-200 text-center font-medium text-amber-600">Lunch</div>
              <div className="p-1.5 text-[8px] bg-slate-100 rounded border border-slate-200 text-center font-medium col-span-2">Python LAB G3<br/>DM LAB G1</div>
              <div className="p-1.5 text-[9px] bg-white rounded border border-slate-200 text-center font-medium">DM</div>
              <div className="p-1.5 text-[9px] bg-white rounded border border-slate-200 text-center font-medium">DBMS</div>
            </div>
            {/* TUESDAY */}
            <div className="grid grid-cols-[50px_repeat(9,1fr)] gap-1.5 mb-1.5">
              <div className="flex items-center justify-center text-xs font-semibold text-slate-500">TUE</div>
              <div className="p-1.5 text-[8px] bg-slate-100 rounded border border-slate-200 text-center font-medium col-span-2">Python LAB G2<br/>DM LAB G3</div>
              <div className="p-1.5 text-[9px] bg-white rounded border border-slate-200 text-center font-medium">SE</div>
              <div className="p-1.5 text-[9px] bg-white rounded border border-slate-200 text-center font-medium">DBMS</div>
              <div className="p-1.5 text-[9px] bg-amber-50 rounded border border-amber-200 text-center font-medium text-amber-600">Lunch</div>
              <div className="p-1.5 text-[9px] bg-white rounded border border-slate-200 text-center font-medium">DM</div>
              <div className="p-1.5 text-[9px] bg-white rounded border border-slate-200 text-center font-medium">DLCD</div>
              <div className="p-1.5 text-[9px] bg-slate-100 rounded border border-slate-200 text-center font-medium col-span-2">DBMS LAB G1</div>
            </div>
            {/* WEDNESDAY */}
            <div className="grid grid-cols-[50px_repeat(9,1fr)] gap-1.5 mb-1.5">
              <div className="flex items-center justify-center text-xs font-semibold text-slate-500">WED</div>
              <div className="p-1.5 text-[8px] bg-slate-100 rounded border border-slate-200 text-center font-medium col-span-2">Python LAB G3<br/>DM LAB G1</div>
              <div className="p-1.5 text-[9px] bg-white rounded border border-slate-200 text-center font-medium">OS</div>
              <div className="p-1.5 text-[9px] bg-slate-50 rounded border border-slate-100"></div>
              <div className="p-1.5 text-[9px] bg-amber-50 rounded border border-amber-200 text-center font-medium text-amber-600">Lunch</div>
              <div className="p-1.5 text-[9px] bg-white rounded border border-slate-200 text-center font-medium">SE</div>
              <div className="p-1.5 text-[9px] bg-white rounded border border-slate-200 text-center font-medium">DBMS</div>
              <div className="p-1.5 text-[9px] bg-slate-100 rounded border border-slate-200 text-center font-medium col-span-2">DBMS LAB G2</div>
            </div>
            {/* THURSDAY */}
            <div className="grid grid-cols-[50px_repeat(9,1fr)] gap-1.5 mb-1.5">
              <div className="flex items-center justify-center text-xs font-semibold text-slate-500">THU</div>
              <div className="p-1.5 text-[8px] bg-slate-100 rounded border border-slate-200 text-center font-medium col-span-2">Python LAB G1<br/>DM LAB G2</div>
              <div className="p-1.5 text-[9px] bg-white rounded border border-slate-200 text-center font-medium">OS</div>
              <div className="p-1.5 text-[9px] bg-white rounded border border-slate-200 text-center font-medium">AI</div>
              <div className="p-1.5 text-[9px] bg-amber-50 rounded border border-amber-200 text-center font-medium text-amber-600">Lunch</div>
              <div className="p-1.5 text-[9px] bg-white rounded border border-slate-200 text-center font-medium">DM</div>
              <div className="p-1.5 text-[9px] bg-white rounded border border-slate-200 text-center font-medium">DLCD</div>
              <div className="p-1.5 text-[9px] bg-slate-50 rounded border border-slate-100"></div>
              <div className="p-1.5 text-[9px] bg-slate-50 rounded border border-slate-100"></div>
            </div>
            {/* FRIDAY */}
            <div className="grid grid-cols-[50px_repeat(9,1fr)] gap-1.5">
              <div className="flex items-center justify-center text-xs font-semibold text-slate-500">FRI</div>
              <div className="p-1.5 text-[8px] bg-slate-100 rounded border border-slate-200 text-center font-medium col-span-2">Python LAB G2<br/>DM LAB G3</div>
              <div className="p-1.5 text-[9px] bg-white rounded border border-slate-200 text-center font-medium">OS</div>
              <div className="p-1.5 text-[9px] bg-white rounded border border-slate-200 text-center font-medium">AI</div>
              <div className="p-1.5 text-[9px] bg-amber-50 rounded border border-amber-200 text-center font-medium text-amber-600">Lunch</div>
              <div className="p-1.5 text-[9px] bg-white rounded border border-slate-200 text-center font-medium">DLCD</div>
              <div className="p-1.5 text-[9px] bg-slate-100 rounded border border-slate-200 text-center font-medium col-span-2">DBMS LAB G3</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Upcoming Classes & Marks Overview */}
      <div className="grid grid-cols-[2fr_1fr] gap-6">
        {/* Upcoming Classes */}
        <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-slate-900">Upcoming Classes</h3>
            <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">Next 2 Days</span>
          </div>
          <div className="space-y-4">
            {UPCOMING_CLASSES.map((day, idx) => (
              <div key={idx}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">{day.day}</span>
                  <span className="text-[10px] text-slate-400">{day.date}</span>
                </div>
                <div className="space-y-1.5">
                  {day.slots.map((cls, i) => (
                    <div key={i} className="flex items-center gap-3 p-2.5 bg-slate-50/80 rounded-lg hover:bg-slate-100 transition-colors">
                      <div className={cn("w-1 h-8 rounded-full", cls.type === 'Lab' ? "bg-slate-300" : "bg-blue-600")} />
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-slate-900">{cls.subject}</p>
                        <p className="text-[10px] text-slate-500">{cls.faculty} &bull; {cls.room}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-medium text-slate-600">{cls.time}</p>
                        <span className={cn("text-[9px] font-medium px-1.5 py-0.5 rounded", cls.type === 'Lecture' ? "bg-blue-100 text-blue-700" : "bg-slate-200 text-slate-600")}>
                          {cls.type}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Marks Overview */}
        <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-slate-900">Marks Overview</h3>
            <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">Internal</span>
          </div>
          <div className="space-y-3">
            {marks.filter(m => m.total !== null).map((mark, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-slate-700">{mark.subject}</span>
                    <span className="text-[10px] text-slate-400">{mark.subjectCode}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={cn("text-xs font-semibold", 
                      mark.total >= 24 ? "text-blue-600" : 
                      mark.total >= 18 ? "text-amber-600" : "text-red-600"
                    )}>
                      {mark.total}/30
                    </span>
                    <span className={cn("text-[10px] px-1.5 py-0.5 rounded font-medium", 
                      mark.status === 'finalized' ? "bg-blue-50 text-blue-600" : 
                      mark.status === 'under_review' ? "bg-amber-50 text-amber-600" : "bg-slate-100 text-slate-500"
                    )}>
                      {mark.status === 'finalized' ? 'Final' : mark.status === 'under_review' ? 'Review' : 'Draft'}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-1">
                  <div className="bg-slate-50 rounded-lg p-2 text-center">
                    <p className="text-[10px] text-slate-400">Internal I</p>
                    <p className="text-xs font-semibold text-slate-700">{mark.internal1}/15</p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-2 text-center">
                    <p className="text-[10px] text-slate-400">Internal II</p>
                    <p className="text-xs font-semibold text-slate-700">{mark.internal2}/15</p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-2 text-center">
                    <p className="text-[10px] text-blue-400">Total</p>
                    <p className="text-xs font-bold text-blue-600">{mark.total}/30</p>
                  </div>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5">
                  <div 
                    className={cn("h-1.5 rounded-full", 
                      mark.total >= 24 ? "bg-blue-500" : 
                      mark.total >= 18 ? "bg-amber-500" : "bg-red-500"
                    )} 
                    style={{ width: `${Math.min((mark.total / 30) * 100, 100)}%` }} 
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">Class Average</span>
              <span className="text-sm font-bold text-blue-600">
                {marks.length > 0 ? Math.round(marks.reduce((sum, m) => sum + m.total, 0) / marks.length) : 0}/30
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Semester Resources */}
      <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-slate-200 shadow-[0_2px_8px_rgba(0,0,0,0.06)] overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 border border-slate-200 rounded-xl flex items-center justify-center text-blue-600 shadow-sm">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 text-base">Semester Resources</h3>
              <p className="text-xs text-slate-500">Academic documents &amp; syllabus</p>
            </div>
          </div>
        </div>
        <div className="p-5">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {SEMESTER_RESOURCES.map((res) => (
              <a
                key={res.id}
                href={res.file}
                target="_blank"
                className="group p-4 rounded-xl border border-slate-200 hover:border-blue-300 transition-all hover:shadow-md bg-slate-50/50"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm border border-slate-100">
                    <Download className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm text-slate-800">{res.title}</p>
                    <p className="text-xs text-slate-500">{res.description}</p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Subject Notes */}
      <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-slate-200 shadow-[0_2px_8px_rgba(0,0,0,0.06)] overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-50 border border-purple-200 rounded-xl flex items-center justify-center text-purple-600 shadow-sm">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 text-base">Subject Notes</h3>
              <p className="text-xs text-slate-500">Study materials for each subject</p>
            </div>
          </div>
        </div>
        <div className="p-5">
          <div className="grid md:grid-cols-2 gap-4">
            {SUBJECT_NOTES.map((subject) => (
              <div key={subject.id} className="p-4 rounded-xl border border-slate-200 hover:border-purple-300 transition-all hover:shadow-md bg-slate-50/50">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-semibold text-sm text-slate-800">{subject.subject}</p>
                    <p className="text-xs text-slate-500">{subject.code}</p>
                  </div>
                  <span className="text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded-full font-medium">
                    {subject.notes.length} notes
                  </span>
                </div>
                <div className="space-y-2">
                  {subject.notes.map((note, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 bg-white rounded-lg border border-slate-100 hover:border-purple-200 transition-colors cursor-pointer">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-slate-400" />
                        <span className="text-xs text-slate-700">{note.title}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-400">{note.pages} pages</span>
                        <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">{note.type}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Today's Schedule (Compact) */}
      <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-slate-900">Today&apos;s Schedule</h3>
          <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">Today</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {TODAY_CLASSES.map((cls, i) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-slate-50/80 rounded-xl hover:bg-slate-100 transition-colors">
              <div className={cn("w-1 h-10 rounded-full", i === 0 ? "bg-blue-600" : cls.type === 'Lab' ? "bg-slate-300" : "bg-slate-200")} />
              <div className="flex-1">
                <p className="text-xs font-semibold text-slate-900 truncate">{cls.subject}</p>
                <p className="text-[10px] text-slate-500">{cls.faculty} &bull; {cls.room}</p>
              </div>
              <div className="w-12 text-right">
                <p className="text-xs font-medium text-slate-600">{cls.time}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

export default OverviewView
