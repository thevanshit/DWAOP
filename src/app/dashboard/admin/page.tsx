'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/common/DashboardLayout'
import TaskCoordination from '@/components/workflows/TaskCoordination'
import {
  Home,
  AlertTriangle,
  BarChart3,
  LayoutGrid,
  Settings,
  ArrowUpRight,
  Users,
  ShieldCheck,
  FileCheck,
  Clock,
  TrendingUp,
  Calendar
} from 'lucide-react'
import { Task, UserRole } from '@/types'

const MOCK_TASKS: Task[] = [
  {
    id: '301',
    type: 'task',
    title: 'NBA Accreditation Documentation',
    description: 'Compile all faculty publications and student placement data for the upcoming visit.',
    status: 'under_review',
    assignee: 'Dr. Sarah Smith',
    committee: 'Accreditation Cell',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '302',
    type: 'task',
    title: 'Semester End Examination Prep',
    description: 'Coordinate with exam cell for question paper setting and room allocation.',
    status: 'in_progress',
    assignee: 'Prof. John Doe',
    committee: 'Exams Committee',
    createdAt: new Date(),
    updatedAt: new Date(),
  }
]

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const userRole: UserRole = 'admin'

  const navItems = [
    { label: 'Overview', icon: <Home className="w-4 h-4" />, href: '#overview' },
    { label: 'Compliance', icon: <ShieldCheck className="w-4 h-4" />, href: '#compliance' },
    { label: 'Coordination', icon: <LayoutGrid className="w-4 h-4" />, href: '#coordination' },
    { label: 'Faculty', icon: <Users className="w-4 h-4" />, href: '#faculty' },
    { label: 'Settings', icon: <Settings className="w-4 h-4" />, href: '#settings' },
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
      roleLabel="Admin"
      navItems={navItems}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[var(--color-primary-faint)] rounded-xl flex items-center justify-center text-[var(--color-primary)]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-[var(--color-text-primary)]">Admin Dashboard</h1>
              <p className="text-sm text-[var(--color-text-muted)]">Department governance & compliance</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-white border border-[var(--color-border)] rounded-lg px-4 py-2">
              <p className="text-xs text-[var(--color-text-muted)]">System Trust</p>
              <p className="text-lg font-semibold text-[var(--color-success)]">98.4%</p>
            </div>
          </div>
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard 
                label="At Risk" 
                value="12" 
                subValue="Students" 
                icon={<AlertTriangle className="w-5 h-5" />} 
                color="orange" 
              />
              <StatCard 
                label="Pending" 
                value="08" 
                subValue="Audits" 
                icon={<FileCheck className="w-5 h-5" />} 
                color="blue" 
              />
              <StatCard 
                label="Active" 
                value="24" 
                subValue="Tasks" 
                icon={<LayoutGrid className="w-5 h-5" />} 
                color="blue" 
              />
              <StatCard 
                label="Load" 
                value="82%" 
                subValue="Faculty" 
                icon={<BarChart3 className="w-5 h-5" />} 
                color="blue" 
              />
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Compliance Stream */}
              <div className="md:col-span-2">
                <div className="bg-white border border-[var(--color-border)] rounded-xl overflow-hidden">
                  <div className="px-5 py-4 border-b border-[var(--color-border)]">
                    <h3 className="text-sm font-medium text-[var(--color-text-secondary)]">Compliance Stream</h3>
                  </div>
                  <div className="divide-y divide-[var(--color-border-light)]">
                    {[
                      { title: 'Operating Systems Attendance', owner: 'Prof. John', status: 'Finalized', risk: 'low' },
                      { title: 'IA-1 Marks Upload', owner: 'Dr. Sarah', status: 'Awaiting', risk: 'high' },
                      { title: 'Lab Record Verification', owner: 'Admin Team', status: 'Locked', risk: 'none' }
                    ].map((item, i) => (
                      <div key={i} className="px-5 py-4 flex items-center justify-between hover:bg-[var(--color-surface-subtle)] transition-colors cursor-pointer">
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${
                            item.risk === 'high' ? 'bg-[var(--color-error)]' : 
                            item.risk === 'low' ? 'bg-[var(--color-warning)]' : 'bg-[var(--color-success)]'
                          }`} />
                          <div>
                            <h4 className="text-sm font-medium text-[var(--color-text-primary)]">{item.title}</h4>
                            <p className="text-xs text-[var(--color-text-muted)]">{item.owner} • {item.status}</p>
                          </div>
                        </div>
                        <ArrowUpRight className="w-4 h-4 text-[var(--color-text-muted)]" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Committees */}
              <div>
                <div className="bg-white border border-[var(--color-border)] rounded-xl overflow-hidden">
                  <div className="px-5 py-4 border-b border-[var(--color-border)]">
                    <h3 className="text-sm font-medium text-[var(--color-text-secondary)]">Committees</h3>
                  </div>
                  <div className="divide-y divide-[var(--color-border-light)]">
                    {['Academic Board', 'Exams Cell', 'Placement Cell'].map(name => (
                      <div key={name} className="px-5 py-3 flex items-center justify-between hover:bg-[var(--color-surface-subtle)] transition-colors cursor-pointer">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-[var(--color-surface-subtle)] rounded-lg flex items-center justify-center">
                            <Users className="w-4 h-4 text-[var(--color-text-muted)]" />
                          </div>
                          <span className="text-sm font-medium text-[var(--color-text-primary)]">{name}</span>
                        </div>
                        <ArrowUpRight className="w-4 h-4 text-[var(--color-text-muted)]" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'timetable' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
              <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500">Timetable is now managed as a static component</p>
              <p className="text-xs text-gray-400 mt-1">Contact developer to update the timetable</p>
            </div>
          </div>
        )}

        {activeTab === 'coordination' && (
          <TaskCoordination tasks={MOCK_TASKS} userRole={userRole} />
        )}

        {(activeTab !== 'overview' && activeTab !== 'coordination') && (
          <div className="h-64 bg-white border border-[var(--color-border)] rounded-xl flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="w-8 h-8 text-[var(--color-text-muted)] mx-auto mb-3" />
              <p className="text-sm font-medium text-[var(--color-text-muted)]">Coming soon</p>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

function StatCard({ label, value, subValue, icon, color = "blue" }: { label: string, value: string, subValue: string, icon: React.ReactNode, color?: 'blue' | 'orange' }) {
  const colors = {
    blue: { bg: 'bg-[var(--color-primary-faint)]', text: 'text-[var(--color-primary)]' },
    orange: { bg: 'bg-[var(--color-warning-light)]', text: 'text-[var(--color-warning)]' }
  }

  return (
    <div className="bg-white border border-[var(--color-border)] rounded-xl p-4">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${colors[color].bg} ${colors[color].text}`}>
        {icon}
      </div>
      <p className="text-xs text-[var(--color-text-muted)]">{label}</p>
      <p className="text-xl font-semibold text-[var(--color-text-primary)]">{value}</p>
      <p className="text-xs text-[var(--color-text-muted)]">{subValue}</p>
    </div>
  )
}
