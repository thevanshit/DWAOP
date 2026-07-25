'use client'

import { useState, useEffect } from 'react'
import { 
  Calendar, Clock, CheckCircle, AlertTriangle, XCircle, 
  BookOpen, Award, Target, TrendingUp, ChevronRight,
  Bell, Play, Pause, Zap, Brain, Flame, ArrowRight,
  BookMarked, GraduationCap, FileText, Users
} from 'lucide-react'
import SectionHeader from '@/components/ui/SectionHeader'

interface Subject {
  id: number
  name: string
  code: string
  attendance: number
  totalClasses: number
  presentClasses: number
  assignmentCompletion: number
  readinessScore: number
  lastClass: string
  nextClass: string
}

interface Announcement {
  id: number
  title: string
  message: string
  date: string
  category: string
  priority: string
  author: string
}

interface UpcomingClass {
  date: string
  day: string
  classes: {
    time: string
    subject: string
    room: string
    faculty: string
  }[]
}

interface TimetableDay {
  day: string
  slots: {
    time: string
    subject: string
    room: string
  }[]
}

interface AdvancedOverviewProps {
  subjects: Subject[]
  announcements: Announcement[]
  upcomingClasses: UpcomingClass[]
  timetable: TimetableDay[]
  isCR?: boolean
}

export default function AdvancedOverview({ subjects, announcements, upcomingClasses, timetable, isCR = false }: AdvancedOverviewProps) {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  // Calculate academic metrics
  const totalClasses = subjects.reduce((sum, s) => sum + s.totalClasses, 0)
  const totalPresent = subjects.reduce((sum, s) => sum + s.presentClasses, 0)
  const overallAttendance = Math.round((totalPresent / totalClasses) * 100)
  
  const riskSubjects = subjects.filter(s => s.attendance < 75)
  const warningSubjects = subjects.filter(s => s.attendance >= 75 && s.attendance < 82)
  
  const getEligibilityStatus = () => {
    if (overallAttendance >= 75) return { status: 'eligible', label: 'ELIGIBLE', color: 'text-green-500', bg: 'bg-green-500', border: 'border-green-500/30', dot: 'bg-green-500' }
    if (overallAttendance >= 65) return { status: 'at_risk', label: 'AT RISK', color: 'text-amber-500', bg: 'bg-amber-500', border: 'border-amber-500/30', dot: 'bg-amber-500' }
    return { status: 'not_eligible', label: 'NOT ELIGIBLE', color: 'text-red-500', bg: 'bg-red-500', border: 'border-red-500/30', dot: 'bg-red-500' }
  }
  
  const eligibility = getEligibilityStatus()
  const pendingAssignments = 2
  
  // Generate insights
  const insights = [
    { type: 'warning', text: 'OS attendance dropped 5% this week', icon: <TrendingUp className="w-4 h-4" /> },
    { type: 'danger', text: 'Missing 2 classes reduces eligibility by 40%', icon: <AlertTriangle className="w-4 h-4" /> },
    { type: 'info', text: 'You perform better in morning classes', icon: <Brain className="w-4 h-4" /> },
  ]

  const nextAction = {
    subject: 'Operating Systems',
    action: 'Attend next lecture',
    time: 'Tomorrow, 9:00 AM',
    reason: 'Reach 75% eligibility'
  }

  const semesterProgress = 62

  // Academic flow stages
  const flowStages = [
    { id: 'attendance', label: 'Attendance', status: overallAttendance >= 75 ? 'completed' : 'current', progress: overallAttendance },
    { id: 'assignments', label: 'Assignments', status: pendingAssignments > 0 ? 'current' : 'completed', progress: 60 },
    { id: 'marks', label: 'Internal Marks', status: 'upcoming', progress: 0 },
    { id: 'eligibility', label: 'Eligibility', status: overallAttendance >= 75 ? 'completed' : 'upcoming', progress: overallAttendance },
    { id: 'exams', label: 'Exams', status: 'upcoming', progress: 0 },
  ]

  return (
    <div className="space-y-6">
      {/* ZONE 1: COMMAND HEADER - Full Width Intelligence Panel */}
      <div className="
        bg-gradient-to-br from-white via-[var(--color-primary-faint)]/20 to-white 
        rounded-2xl border border-[var(--color-border-light)] 
        shadow-xl shadow-[var(--color-primary)]/5 
        p-6 md:p-8
        animate-in fade-in slide-in-from-bottom-4 duration-500
      ">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Left: Status Engine */}
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            {/* Academic Status */}
            <div className={`
              flex items-center gap-3 px-5 py-3.5 rounded-xl border-2 
              ${eligibility.border} bg-white/80 backdrop-blur-sm
            `}>
              <div className={`w-3 h-3 rounded-full ${eligibility.dot} ${eligibility.status === 'at_risk' ? 'animate-pulse' : ''}`} />
              <span className={`text-lg font-bold ${eligibility.color}`}>{eligibility.label}</span>
              <span className="text-[var(--color-text-muted)]">|</span>
              <span className="text-sm text-[var(--color-text-muted)]">Academic Status</span>
            </div>

            {/* Risk Level */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-[var(--color-text-muted)]">Risk Level:</span>
              <div className="flex items-center gap-2">
                {riskSubjects.length > 0 ? (
                  <span className="px-3 py-1.5 bg-red-100 text-red-700 text-sm font-bold rounded-lg">HIGH</span>
                ) : warningSubjects.length > 0 ? (
                  <span className="px-3 py-1.5 bg-amber-100 text-amber-700 text-sm font-bold rounded-lg">MEDIUM</span>
                ) : (
                  <span className="px-3 py-1.5 bg-green-100 text-green-700 text-sm font-bold rounded-lg">LOW</span>
                )}
              </div>
            </div>

            {/* Next Action */}
            <div className="flex items-center gap-3 px-4 py-2.5 bg-[var(--color-primary-faint)]/50 rounded-xl border border-[var(--color-primary)]/20">
              <Zap className="w-5 h-5 text-[var(--color-primary)]" />
              <div>
                <span className="text-xs text-[var(--color-primary)] font-medium">Next Action: </span>
                <span className="text-sm font-semibold text-[var(--color-text-primary)]">{nextAction.action}</span>
                <span className="text-xs text-[var(--color-text-muted)]"> ({nextAction.time})</span>
              </div>
            </div>
          </div>

          {/* Right: Circular Health Meter + Progress */}
          <div className="flex items-center gap-8">
            {/* Circular Progress */}
            <div className="relative w-20 h-20">
              <svg className="w-20 h-20 transform -rotate-90">
                <circle cx="40" cy="40" r="35" stroke="currentColor" strokeWidth="6" fill="none" className="text-[var(--color-surface-subtle)]" />
                <circle 
                  cx="40" cy="40" r="35" 
                  stroke="currentColor" 
                  strokeWidth="6" 
                  fill="none"
                  className={`${overallAttendance >= 75 ? 'text-green-500' : overallAttendance >= 65 ? 'text-amber-500' : 'text-red-500'}`}
                  strokeDasharray={`${(overallAttendance / 100) * 220} 220`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl font-bold text-[var(--color-text-primary)]">{overallAttendance}%</span>
              </div>
            </div>

            {/* Semester Progress */}
            <div className="hidden md:block">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm text-[var(--color-text-muted)]">Semester Progress</span>
                <span className="text-sm font-bold text-[var(--color-text-primary)]">{semesterProgress}%</span>
              </div>
              <div className="w-32 h-2 bg-[var(--color-surface-subtle)] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[var(--color-primary)] to-indigo-600 rounded-full transition-all duration-500"
                  style={{ width: `${semesterProgress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: 70% Content | 30% Intelligence Panel */}
      <div className="grid lg:grid-cols-5 gap-6">
        {/* Main Column (70% = 3.5 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* ZONE 2: LIVE SIGNAL BAR */}
          <div className="
            flex items-center gap-2 px-4 py-3 
            bg-white rounded-2xl border border-[var(--color-border-light)] 
            shadow-sm hover:shadow-md transition-shadow
            overflow-x-auto
          ">
            <div className="flex items-center gap-2 shrink-0">
              <span className={`w-2 h-2 rounded-full ${overallAttendance >= 75 ? 'bg-green-500' : 'bg-amber-500 animate-pulse'}`} />
              <span className="text-sm text-[var(--color-text-secondary)]">Attendance OK</span>
            </div>
            <span className="text-[var(--color-border-light)]">|</span>
            <div className="flex items-center gap-2 shrink-0">
              <span className={`w-2 h-2 rounded-full ${riskSubjects.length > 0 ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`} />
              <span className="text-sm text-[var(--color-text-secondary)]">{riskSubjects.length} subjects risky</span>
            </div>
            <span className="text-[var(--color-border-light)]">|</span>
            <div className="flex items-center gap-2 shrink-0">
              <span className={`w-2 h-2 rounded-full ${pendingAssignments > 0 ? 'bg-amber-500' : 'bg-green-500'}`} />
              <span className="text-sm text-[var(--color-text-secondary)]">{pendingAssignments} pending deadlines</span>
            </div>
            <span className="text-[var(--color-border-light)]">|</span>
            <div className="flex items-center gap-2 shrink-0">
              <span className={`w-2 h-2 rounded-full ${overallAttendance >= 75 ? 'bg-green-500' : 'bg-red-500 animate-pulse'}`} />
              <span className="text-sm text-[var(--color-text-secondary)]">Eligibility {overallAttendance >= 75 ? 'Safe' : 'At Risk'}</span>
            </div>
          </div>

          {/* ZONE 3: SUBJECT CONTROL PANEL - Horizontal Modules */}
          <div>
            <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">Subject Control Center</h3>
            <div className="space-y-3">
              {subjects.map((subject) => (
                <SubjectControlModule key={subject.id} subject={subject} />
              ))}
            </div>
          </div>

          {/* ZONE 5: ACADEMIC FLOW TRACKER */}
          <div className="
            bg-white rounded-2xl border border-[var(--color-border-light)] 
            p-6 shadow-sm hover:shadow-md transition-shadow
          ">
            <h3 className="text-sm font-semibold text-[var(--color-text-muted)] mb-6">Academic Flow</h3>
            <div className="flex items-center justify-between">
              {flowStages.map((stage, idx) => (
                <div key={stage.id} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div className={`
                      w-12 h-12 rounded-xl flex items-center justify-center transition-all
                      ${stage.status === 'completed' ? 'bg-green-500 text-white' : 
                        stage.status === 'current' ? 'bg-[var(--color-primary)] text-white ring-4 ring-[var(--color-primary-faint)]' : 
                        'bg-[var(--color-surface-subtle)] text-[var(--color-text-muted)]'}
                    `}>
                      {stage.status === 'completed' ? <CheckCircle className="w-6 h-6" /> :
                       stage.id === 'attendance' ? <Calendar className="w-6 h-6" /> :
                       stage.id === 'assignments' ? <FileText className="w-6 h-6" /> :
                       stage.id === 'marks' ? <Award className="w-6 h-6" /> :
                       <GraduationCap className="w-6 h-6" />}
                    </div>
                    <span className="text-xs font-medium mt-2 text-[var(--color-text-secondary)]">{stage.label}</span>
                  </div>
                  {idx < flowStages.length - 1 && (
                    <div className={`w-16 md:w-24 h-0.5 mx-2 ${stage.status === 'completed' ? 'bg-green-500' : 'bg-[var(--color-surface-subtle)]'}`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ZONE 6: SMART TIMELINE */}
          <div className="
            bg-white rounded-2xl border border-[var(--color-border-light)] 
            p-6 shadow-sm hover:shadow-md transition-shadow
          ">
            <h3 className="text-sm font-semibold text-[var(--color-text-muted)] mb-4">Smart Timeline</h3>
            <div className="space-y-4">
              {upcomingClasses.slice(0, 3).map((day, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="w-20 shrink-0">
                    <span className={`text-sm font-bold ${day.day === 'Today' ? 'text-blue-600' : 'text-gray-900'}`}>
                      {day.day}
                    </span>
                  </div>
                  <div className="flex-1 space-y-2">
                    {day.classes.slice(0, 2).map((cls, cidx) => (
                      <div key={cidx} className={`
                        flex items-center justify-between p-2.5 rounded-xl border
                        ${day.day === 'Today' ? 'bg-[var(--color-primary-faint)] border-[var(--color-primary)]/20' : 'bg-[var(--color-surface-subtle)] border-[var(--color-border-light)]'}
                      `}>
                        <div className="flex items-center gap-3">
                          <Clock className="w-4 h-4 text-[var(--color-text-muted)]" />
                          <span className="text-xs text-[var(--color-text-muted)]">{cls.time}</span>
                          <span className="text-sm font-medium text-[var(--color-text-primary)]">{cls.subject}</span>
                        </div>
                        <span className="text-xs text-[var(--color-text-muted)]">{cls.room}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Side Panel (30% = 1.5 cols) */}
        <div className="lg:col-span-1 space-y-6">
          {/* ZONE 4: INTELLIGENCE PANEL */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center gap-2 mb-4">
              <Brain className="w-5 h-5 text-purple-400" />
              <h3 className="text-sm font-bold text-white">SYSTEM INSIGHTS</h3>
            </div>
            <div className="space-y-3">
              {insights.map((insight, idx) => (
                <div 
                  key={idx} 
                  className={`p-3 rounded-xl border ${
                    insight.type === 'danger' ? 'bg-red-500/10 border-red-500/20' :
                    insight.type === 'warning' ? 'bg-amber-500/10 border-amber-500/20' :
                    'bg-blue-500/10 border-blue-500/20'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <span className={`
                      ${insight.type === 'danger' ? 'text-red-400' : 
                        insight.type === 'warning' ? 'text-amber-400' : 'text-blue-400'}
                    `}>
                      {insight.icon}
                    </span>
                    <span className="text-xs text-gray-300">{insight.text}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ZONE 7: UPCOMING CARDS */}
          <div className="bg-white rounded-2xl border border-[var(--color-border-light)] p-5 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-sm font-semibold text-[var(--color-text-muted)] mb-4">Upcoming</h3>
            <div className="space-y-3">
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-100">
                <div className="flex items-center gap-2 mb-1">
                  <Flame className="w-4 h-4 text-amber-600" />
                  <span className="text-xs font-medium text-amber-700">Internal Exams</span>
                </div>
                <p className="text-sm font-bold text-[var(--color-text-primary)]">March 1-5</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
                <div className="flex items-center gap-2 mb-1">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-medium text-blue-700">Assignment Due</span>
                </div>
                <p className="text-sm font-bold text-[var(--color-text-primary)]">DBMS - Feb 18</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ZONE 3 Component: Subject Control Module
function SubjectControlModule({ subject }: { subject: Subject }) {
  const getStatusColor = () => {
    if (subject.attendance < 75) return { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-600', label: 'CRITICAL', dot: 'bg-red-500' }
    if (subject.attendance < 82) return { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-600', label: 'AT RISK', dot: 'bg-amber-500' }
    return { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-600', label: 'SAFE', dot: 'bg-green-500' }
  }
  
  const status = getStatusColor()
  const classesNeeded = Math.max(0, Math.ceil((75 * subject.totalClasses - subject.presentClasses * 100) / 25))

  return (
    <div className={`
      p-5 rounded-2xl border transition-all hover:shadow-lg hover:-translate-y-0.5
      ${status.border} ${status.bg}
    `}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-2.5 h-2.5 rounded-full ${status.dot} ${status.label === 'AT RISK' ? 'animate-pulse' : ''}`} />
          <h4 className="text-base font-semibold text-[var(--color-text-primary)]">{subject.name}</h4>
          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${status.bg} ${status.text}`}>
            {status.label}
          </span>
        </div>
        <span className="text-2xl font-bold text-[var(--color-text-primary)]">{subject.attendance}%</span>
      </div>
      
      <div className="w-full h-2.5 bg-[var(--color-surface-subtle)] rounded-full overflow-hidden mb-4">
        <div 
          className={`h-full rounded-full transition-all ${
            subject.attendance >= 75 ? 'bg-green-500' : 
            subject.attendance >= 65 ? 'bg-amber-500' : 'bg-red-500'
          }`}
          style={{ width: `${subject.attendance}%` }}
        />
      </div>
      
      <div className="flex items-center justify-between">
        {classesNeeded > 0 ? (
          <p className="text-sm text-[var(--color-text-secondary)]">
            Attend <span className="font-bold text-[var(--color-text-primary)]">{classesNeeded} more</span> classes to reach safe zone
          </p>
        ) : (
          <p className="text-sm text-green-700 font-medium">✓ Attendance in safe zone</p>
        )}
        <button className="flex items-center gap-1 text-sm font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-dark)]">
          Details <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
