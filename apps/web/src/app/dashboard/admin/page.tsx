'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Home, AlertTriangle, BarChart3, LayoutGrid, Settings,
  Users, ShieldCheck, FileCheck, Clock, TrendingUp,
  Calendar, FileText, Award, ClipboardCheck, Layers,
  Gauge, Search, Bell, ChevronRight, Activity,
  Plus, X, CheckCircle, XCircle, Filter, Download,
  User, Briefcase, Building2, Target, AlertCircle,
  CalendarDays, GraduationCap, FileQuestion, Edit, Trash2,
  Eye, MessageSquare, Mail, Phone, MoreVertical, Send,
  DollarSign, Bed, BookOpen, TrendingDown, PieChart,
  BarChart, Megaphone, UserCheck, ClipboardList, CheckSquare,
  AlertOctagon, Ticket, ListChecks, Wallet, ShoppingCart,
  PanelLeftClose, PanelLeft
} from 'lucide-react'
import { cn } from '@/lib/utils'

import { AdminDashboardProvider, useAdminDashboardContext } from '@/components/dashboard/admin/AdminDashboardProvider'
import { NavButton } from '@/components/dashboard/admin/NavButton'
import { OverviewView } from '@/components/dashboard/admin/OverviewView'
import { WorkflowsView } from '@/components/dashboard/admin/WorkflowsView'
import { StudentsView } from '@/components/dashboard/admin/StudentsView'
import { FacultyView } from '@/components/dashboard/admin/FacultyView'
import { RequestsView } from '@/components/dashboard/admin/RequestsView'
import { CoordinationView } from '@/components/dashboard/admin/CoordinationView'
import { AnalyticsView } from '@/components/dashboard/admin/AnalyticsView'
import { ComplianceView } from '@/components/dashboard/admin/ComplianceView'
import { ComplaintsView } from '@/components/dashboard/admin/ComplaintsView'
import { AnnouncementsView } from '@/components/dashboard/admin/AnnouncementsView'
import { SettingsView } from '@/components/dashboard/admin/SettingsView'
import { NewWorkflowModal } from '@/components/dashboard/admin/NewWorkflowModal'

type TabType = 'overview' | 'workflows' | 'students' | 'faculty' | 'requests' | 'coordination' | 'analytics' | 'complaints' | 'announcements' | 'compliance' | 'settings'

function DashboardContent() {
  const ctx = useAdminDashboardContext()
  const [activeTab, setActiveTab] = useState<TabType>('overview')
  const [showNewWorkflow, setShowNewWorkflow] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const navItems = [
    { label: 'Overview', icon: Home, section: 'Main' },
    { label: 'Workflows', icon: Layers, section: 'Main' },
    { label: 'Students', icon: Users, section: 'Management' },
    { label: 'Faculty', icon: Award, section: 'Management' },
    { label: 'Requests', icon: FileCheck, section: 'Management' },
    { label: 'Coordination', icon: LayoutGrid, section: 'Operations' },
    { label: 'Analytics', icon: BarChart3, section: 'Operations' },
    { label: 'Compliance', icon: ShieldCheck, section: 'Operations' },
    { label: 'Complaints', icon: AlertOctagon, section: 'Communication' },
    { label: 'Announcements', icon: Megaphone, section: 'Communication' },
    { label: 'Settings', icon: Settings, section: 'System' },
  ]

  const sectionOrder = ['Main', 'Management', 'Operations', 'Communication', 'System']

  return (
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
            <span className="text-[9px] text-slate-400 -mt-0.5">Admin Portal</span>
          </div>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <button className="relative p-2.5 hover:bg-slate-100 rounded-xl transition-all duration-200">
            <Bell className="w-5 h-5 text-slate-600" />
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white" />
          </button>
          <div className="flex items-center gap-2.5 pl-2.5 border-l border-slate-200">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center text-white font-bold shadow-lg ring-2 ring-blue-50/50">
              {ctx.user?.avatar || 'A'}
            </div>
            <div className="hidden lg:block">
              <p className="text-sm font-semibold text-slate-900">{ctx.user?.name || 'Admin'}</p>
              <p className="text-[10px] text-slate-500">Department Head</p>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Sidebar */}
      <motion.aside 
        initial={{ opacity: 0 }}
        animate={{ width: sidebarCollapsed ? 80 : 260, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed left-4 top-20 bottom-6 bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-200/50 flex flex-col"
      >
        <div className="flex items-center justify-between px-3 py-3 border-b border-slate-100">
          {!sidebarCollapsed && <span className="text-xs font-bold text-slate-400 uppercase">Menu</span>}
          <button 
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
          >
            {sidebarCollapsed ? (
              <ChevronRight className="w-4 h-4 text-slate-500" />
            ) : (
              <PanelLeftClose className="w-4 h-4 text-slate-500" />
            )}
          </button>
        </div>

        <div className="flex flex-col flex-1 py-4 px-2.5 overflow-y-auto">
          {sectionOrder.map(section => {
            const items = navItems.filter(i => i.section === section)
            if (items.length === 0) return null
            return (
              <div key={section} className="space-y-1 mb-4">
                {!sidebarCollapsed && (
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-2 mb-1.5">{section}</p>
                )}
                {items.map(item => {
                  const tab = item.label.toLowerCase() as TabType
                  return (
                    <NavButton
                      key={tab}
                      icon={item.icon}
                      label={item.label}
                      isActive={activeTab === tab}
                      onClick={() => setActiveTab(tab)}
                    />
                  )
                })}
              </div>
            )
          })}
        </div>
      </motion.aside>

      {/* Main Content */}
      <main 
        className={cn("pt-20 px-6 pb-6 min-h-screen transition-all duration-300", sidebarCollapsed ? "ml-[104px]" : "ml-[288px]")}
      >
        <div className="max-w-[1400px] mx-auto">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15 }}
          >
            {activeTab === 'overview' && <OverviewView onNavigate={setActiveTab} />}
            {activeTab === 'workflows' && <WorkflowsView showNewWorkflow={showNewWorkflow} setShowNewWorkflow={setShowNewWorkflow} />}
            {activeTab === 'students' && <StudentsView />}
            {activeTab === 'faculty' && <FacultyView />}
            {activeTab === 'requests' && <RequestsView />}
            {activeTab === 'coordination' && <CoordinationView />}
            {activeTab === 'analytics' && <AnalyticsView />}
            {activeTab === 'compliance' && <ComplianceView />}
            {activeTab === 'complaints' && <ComplaintsView />}
            {activeTab === 'announcements' && <AnnouncementsView />}
            {activeTab === 'settings' && <SettingsView />}
          </motion.div>
        </div>
      </main>

      {/* New Workflow Modal */}
      <NewWorkflowModal isOpen={showNewWorkflow} onClose={() => setShowNewWorkflow(false)} />
    </div>
  )
}

export default function AdminDashboard() {
  return (
    <AdminDashboardProvider>
      <DashboardContent />
    </AdminDashboardProvider>
  )
}
