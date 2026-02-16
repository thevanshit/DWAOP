'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/common/DashboardLayout'
import TaskCoordination from '@/components/workflows/TaskCoordination'
import DepartmentWorkflowKanban from '@/components/admin/DepartmentWorkflowKanban'
import AtRiskAnalyticsPanel from '@/components/admin/AtRiskAnalyticsPanel'
import GovernanceActionsPanel from '@/components/admin/GovernanceActionsPanel'
import FacultyWorkloadPanel from '@/components/admin/FacultyWorkloadPanel'
import StudentsTab from '@/components/admin/StudentsTab'
import FacultyTab from '@/components/admin/FacultyTab'
import RequestsTab from '@/components/admin/RequestsTab'
import AnalyticsTab from '@/components/admin/AnalyticsTab'
import ComplianceTab from '@/components/admin/ComplianceTab'
import {
  Home,
  AlertTriangle,
  BarChart3,
  LayoutGrid,
  Settings,
  Users,
  ShieldCheck,
  FileCheck,
  Clock,
  TrendingUp,
  Calendar,
  FileText,
  Award,
  ClipboardCheck,
  Layers,
  Gauge,
  Search,
  Bell,
  ChevronRight,
  Activity
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
  },
  {
    id: '303',
    type: 'task',
    title: 'Update Course Syllabus',
    description: 'Update Operating Systems syllabus as per new AICTE guidelines.',
    status: 'created',
    assignee: 'Dr. Vineet Jain',
    committee: 'Academic Board',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

type TabType = 'overview' | 'workflows' | 'students' | 'faculty' | 'requests' | 'coordination' | 'analytics' | 'compliance' | 'settings'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('overview')
  const userRole: UserRole = 'admin'

  const navItems = [
    { label: 'Overview', icon: <Home className="w-4 h-4" />, href: '#overview', section: 'Main' },
    { label: 'Workflows', icon: <Layers className="w-4 h-4" />, href: '#workflows', section: 'Main' },
    { label: 'Students', icon: <Users className="w-4 h-4" />, href: '#students', section: 'Management' },
    { label: 'Faculty', icon: <Award className="w-4 h-4" />, href: '#faculty', section: 'Management' },
    { label: 'Requests', icon: <FileCheck className="w-4 h-4" />, href: '#requests', section: 'Management' },
    { label: 'Coordination', icon: <LayoutGrid className="w-4 h-4" />, href: '#coordination', section: 'Operations' },
    { label: 'Analytics', icon: <BarChart3 className="w-4 h-4" />, href: '#analytics', section: 'Operations' },
    { label: 'Compliance', icon: <ShieldCheck className="w-4 h-4" />, href: '#compliance', section: 'Operations' },
    { label: 'Settings', icon: <Settings className="w-4 h-4" />, href: '#settings', section: 'System' },
  ]

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '') || 'overview'
      setActiveTab(hash as TabType)
    }
    handleHash()
    window.addEventListener('hashchange', handleHash)
    return () => window.removeEventListener('hashchange', handleHash)
  }, [])

  const currentHour = new Date().getHours()
  const greeting = currentHour < 12 ? 'Good morning' : currentHour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <DashboardLayout
      role={userRole}
      roleLabel="Admin"
      navItems={navItems}
    >
      {activeTab === 'overview' && <OverviewView />}
      {activeTab === 'workflows' && <WorkflowsView />}
      {activeTab === 'students' && <StudentsTab />}
      {activeTab === 'faculty' && <FacultyTab />}
      {activeTab === 'requests' && <RequestsTab />}
      {activeTab === 'coordination' && <TaskCoordination tasks={MOCK_TASKS} userRole={userRole} />}
      {activeTab === 'analytics' && <AnalyticsTab />}
      {activeTab === 'compliance' && <ComplianceTab />}
      {activeTab === 'settings' && <SettingsView />}
    </DashboardLayout>
  )
}

function OverviewView() {
  const greeting = (() => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
  })()

  const stats = [
    { label: 'At Risk Students', value: '12', sub: 'Need attention', icon: AlertTriangle, color: 'red' as const, trend: 'up' },
    { label: 'Pending Tasks', value: '24', sub: 'Across department', icon: Layers, color: 'blue' as const, trend: 'down' },
    { label: 'Pending Approvals', value: '08', sub: 'Awaiting review', icon: Clock, color: 'amber' as const, trend: 'stable' },
    { label: 'Faculty Load', value: '78%', sub: 'Avg workload', icon: Gauge, color: 'purple' as const, trend: 'up' },
    { label: 'Compliance Score', value: '94%', sub: 'System health', icon: ShieldCheck, color: 'green' as const, trend: 'up' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-white via-slate-50 to-white rounded-2xl border border-slate-200/60 shadow-[0_1px_3px_rgba(0,0,0,0.02),0_4px_12px_rgba(0,0,0,0.02)] p-6 md:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-12 h-12 bg-white border border-slate-200 rounded-2xl flex items-center justify-center shadow-sm">
              <ShieldCheck className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold text-slate-900">
                {greeting}, <span className="text-blue-600">Admin!</span>
              </h1>
              <p className="text-slate-500 mt-1">Department governance & operations overview</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-2.5">
              <p className="text-xs text-blue-600 font-medium">System Status</p>
              <p className="text-sm font-bold text-blue-700">Operational</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-slate-500">{stat.label}</span>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                stat.color === 'red' ? 'bg-blue-50 text-blue-600' :
                'bg-blue-50 text-blue-600'
              }`}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            <p className="text-xs text-slate-500 mt-1">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Department Workflow Kanban - 2 columns */}
        <div className="md:col-span-2">
          <DepartmentWorkflowKanban />
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          <AtRiskAnalyticsPanel />
          <GovernanceActionsPanel />
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid md:grid-cols-2 gap-6">
        <FacultyWorkloadPanel />
        
        {/* Quick Links */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-200 bg-slate-50/50">
            <h3 className="text-sm font-semibold text-slate-900">Quick Actions</h3>
          </div>
          <div className="p-4 space-y-2">
            <QuickAction label="View All Students" icon={Users} href="#students" />
            <QuickAction label="Faculty Directory" icon={Award} href="#faculty" />
            <QuickAction label="Pending Requests" icon={FileCheck} href="#requests" />
            <QuickAction label="Department Analytics" icon={BarChart3} href="#analytics" />
            <QuickAction label="Compliance Status" icon={ShieldCheck} href="#compliance" />
          </div>
        </div>
      </div>
    </div>
  )
}

function QuickAction({ label, icon: Icon, href }: { label: string; icon: React.ElementType; href: string }) {
  return (
    <a
      href={href}
      className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors group"
    >
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-blue-50 border border-slate-200 text-blue-600 flex items-center justify-center group-hover:bg-blue-100 group-hover:border-blue-300 transition-colors">
          <Icon className="w-4 h-4" />
        </div>
        <span className="text-sm font-medium text-slate-700">{label}</span>
      </div>
      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
    </a>
  )
}

function WorkflowsView() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Department Workflows</h2>
        <p className="text-sm text-slate-500 mt-1">Manage and monitor all academic and administrative workflows</p>
      </div>
      <DepartmentWorkflowKanban />
    </div>
  )
}

function SettingsView() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Settings</h2>
        <p className="text-sm text-slate-500 mt-1">Configure department policies and system settings</p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Policy Configuration */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">Policy Configuration</h3>
          <div className="space-y-4">
            <SettingItem label="Attendance Threshold" value="75%" description="Minimum attendance required for exam eligibility" />
            <SettingItem label="Grace Period" value="15 mins" description="Late arrival tolerance for attendance" />
            <SettingItem label="Leave Approval" value="Auto" description="Auto-approve leaves under 2 days" />
            <SettingItem label="Mark Review Window" value="7 days" description="Time for students to review marks" />
          </div>
        </div>

        {/* System Settings */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">System Settings</h3>
          <div className="space-y-4">
            <SettingItem label="Notifications" value="Enabled" description="Email and in-app notifications" />
            <SettingItem label="Audit Logs" value="90 days" description="Retention period for audit trails" />
            <SettingItem label="Data Export" value="CSV, PDF" description="Available export formats" />
            <SettingItem label="Session Timeout" value="30 mins" description="Auto-logout after inactivity" />
          </div>
        </div>
      </div>
    </div>
  )
}

function SettingItem({ label, value, description }: { label: string; value: string; description: string }) {
  return (
    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
      <div>
        <p className="text-sm font-medium text-slate-700">{label}</p>
        <p className="text-xs text-slate-500">{description}</p>
      </div>
      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium">
        {value}
      </span>
    </div>
  )
}
