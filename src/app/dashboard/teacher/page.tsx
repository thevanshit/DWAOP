'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/common/DashboardLayout'
import AttendanceWorkflow from '@/components/workflows/AttendanceWorkflow'
import AssignmentWorkflow from '@/components/workflows/AssignmentWorkflow'
import TaskCoordination from '@/components/workflows/TaskCoordination'
import { Home, Calendar, FileText, Users, LayoutGrid, Clock, CheckCircle2, AlertTriangle } from 'lucide-react'
import { AttendanceSession, Assignment, Task, UserRole } from '@/types'

const MOCK_ATTENDANCE: AttendanceSession[] = [
  {
    id: '101',
    type: 'attendance',
    title: 'Operating Systems (Section A)',
    subject: 'Operating Systems',
    status: 'created',
    date: new Date(),
    totalStudents: 55,
    presentStudents: 0,
    absentStudents: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
]

const MOCK_ASSIGNMENTS: Assignment[] = [
  {
    id: '102',
    type: 'assignment',
    title: 'Kernel Simulation Project',
    subject: 'Operating Systems',
    status: 'under_review',
    maxMarks: 100,
    deadline: new Date(Date.now() - 86400000),
    submitted: true,
    late: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
]

const MOCK_TASKS: Task[] = [
  {
    id: '201',
    type: 'task',
    title: 'Update Course Curriculum for Next Sem',
    description: 'Review and update the OS curriculum to include cloud computing modules.',
    status: 'in_progress',
    assignee: 'You',
    committee: 'Academic Board',
    createdAt: new Date(),
    updatedAt: new Date(),
  }
]

export default function TeacherDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const userRole: UserRole = 'teacher'

  const navItems = [
    { label: 'Overview', icon: <Home className="w-4 h-4" />, href: '#overview' },
    { label: 'Classes', icon: <Users className="w-4 h-4" />, href: '#classes' },
    { label: 'Evaluations', icon: <FileText className="w-4 h-4" />, href: '#evaluations' },
    { label: 'Tasks', icon: <LayoutGrid className="w-4 h-4" />, href: '#coordination' },
  ]

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '') || 'overview'
      setActiveTab(hash)
    }
    handleHash()
    window.addEventListener('hashchange', handleHash)
    return () => window.removeEventListener('hashchange', handleHash)
  }, [])

  return (
    <DashboardLayout
      role={userRole}
      roleLabel="Faculty"
      navItems={navItems}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold text-[var(--color-text-primary)]">Faculty Dashboard</h1>
            <p className="text-sm text-[var(--color-text-muted)]">Manage classes, evaluations, and tasks</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:bg-[var(--color-primary-dark)] transition-colors">
            <Clock className="w-4 h-4" />
            <span>Start Class</span>
          </button>
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatCard
                label="Today's Classes"
                value="3"
                subValue="Next: OS at 2:00 PM"
                icon={<Calendar className="w-5 h-5" />}
              />
              <StatCard
                label="Pending Review"
                value="12"
                subValue="Submissions"
                icon={<FileText className="w-5 h-5" />}
                color="orange"
              />
              <StatCard
                label="Active Tasks"
                value="2"
                subValue="Committees"
                icon={<LayoutGrid className="w-5 h-5" />}
              />
            </div>

            {/* Workflows */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-[var(--color-text-secondary)] mb-4">Pending Workflows</h3>
                <div className="space-y-4">
                  {MOCK_ATTENDANCE.map(s => <AttendanceWorkflow key={s.id} session={s} userRole={userRole} onTransition={() => { }} />)}
                  {MOCK_ASSIGNMENTS.map(a => <AssignmentWorkflow key={a.id} assignment={a} userRole={userRole} onTransition={() => { }} />)}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-[var(--color-text-secondary)] mb-4">Tasks</h3>
                <div className="space-y-3">
                  {MOCK_TASKS.map(t => (
                    <div key={t.id} className="bg-white border border-[var(--color-border)] rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-[var(--color-primary)]">{t.committee}</span>
                        <span className="px-2 py-0.5 bg-[var(--color-primary-faint)] text-[var(--color-primary)] text-xs rounded">In Progress</span>
                      </div>
                      <h4 className="text-sm font-medium text-[var(--color-text-primary)] mb-1">{t.title}</h4>
                      <p className="text-xs text-[var(--color-text-muted)] mb-3">{t.description}</p>
                      <div className="flex items-center justify-between text-xs text-[var(--color-text-muted)]">
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Due: Tomorrow</span>
                        <button className="text-[var(--color-primary)] hover:underline">Update</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'classes' && (
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-[var(--color-text-secondary)]">Classes</h3>
            {MOCK_ATTENDANCE.map(s => <AttendanceWorkflow key={s.id} session={s} userRole={userRole} onTransition={() => { }} />)}
          </div>
        )}

        {activeTab === 'evaluations' && (
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-[var(--color-text-secondary)]">Evaluations</h3>
            {MOCK_ASSIGNMENTS.map(a => <AssignmentWorkflow key={a.id} assignment={a} userRole={userRole} onTransition={() => { }} />)}
          </div>
        )}

        {activeTab === 'coordination' && (
          <TaskCoordination tasks={MOCK_TASKS} userRole={userRole} />
        )}
      </div>
    </DashboardLayout>
  )
}

function StatCard({ label, value, subValue, icon, color = "blue" }: { label: string, value: string, subValue: string, icon: React.ReactNode, color?: 'blue' | 'green' | 'orange' }) {
  const colors = {
    blue: { bg: 'bg-[var(--color-primary-faint)]', text: 'text-[var(--color-primary)]' },
    green: { bg: 'bg-[var(--color-success-light)]', text: 'text-[var(--color-success)]' },
    orange: { bg: 'bg-[var(--color-warning-light)]', text: 'text-[var(--color-warning)]' }
  }

  return (
    <div className="bg-white border border-[var(--color-border)] rounded-xl p-4 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colors[color].bg} ${colors[color].text}`}>
        {icon}
      </div>
      <div>
        <p className="text-xs text-[var(--color-text-muted)]">{label}</p>
        <p className="text-lg font-semibold text-[var(--color-text-primary)]">{value}</p>
        <p className="text-xs text-[var(--color-text-muted)]">{subValue}</p>
      </div>
    </div>
  )
}
