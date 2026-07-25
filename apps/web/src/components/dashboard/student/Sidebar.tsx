'use client'

import { motion } from 'framer-motion'
import {
  LayoutDashboard, Calendar, FileText, ClipboardCheck, Award, TrendingUp,
  Wallet, Building2, Trophy, ClipboardList, Settings, PanelLeftClose, ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'

type TabType = 'overview' | 'timetable' | 'assignments' | 'attendance' | 'marks' | 'track' | 'fees' | 'hostel' | 'sports' | 'requests' | 'settings'

interface SidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  collapsed: boolean
  setCollapsed: (v: boolean) => void
  pendingAssignments: number
}

function NavButton({ icon: Icon, label, isActive, collapsed, onClick, badge }: { icon: any; label: string; isActive?: boolean; collapsed: boolean; onClick: () => void; badge?: number }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className={cn(
        "relative w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
        collapsed ? "justify-center" : "justify-start",
        isActive ? "text-blue-600" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
      )}
    >
      {isActive && (
        <motion.div layoutId="navIndicator" className="absolute inset-0 bg-blue-50 rounded-xl -z-10 shadow-sm shadow-blue-500/20" />
      )}
      <Icon className={cn("w-[18px] h-[18px] flex-shrink-0", isActive && "text-blue-600")} />
      {!collapsed && (
        <>
          <span>{label}</span>
          {badge !== undefined && badge > 0 && (
            <span className="ml-auto px-1.5 py-0.5 rounded-full text-[10px] bg-red-500 text-white font-medium">
              {badge}
            </span>
          )}
        </>
      )}
    </motion.button>
  )
}

export default function Sidebar({ activeTab, setActiveTab, collapsed, setCollapsed, pendingAssignments }: SidebarProps) {
  return (
    <motion.aside
      initial={{ opacity: 0 }}
      animate={{ width: collapsed ? 80 : 260, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed left-4 top-20 bottom-6 bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-200/50 flex flex-col"
    >
      <div className="flex items-center justify-between px-3 py-3 border-b border-slate-100">
        {!collapsed && <span className="text-xs font-bold text-slate-400 uppercase">Menu</span>}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4 text-slate-500" />
          ) : (
            <PanelLeftClose className="w-4 h-4 text-slate-500" />
          )}
        </button>
      </div>

      <div className="flex flex-col flex-1 py-4 px-2.5 overflow-y-auto">
        <div className="space-y-1">
          {!collapsed && <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-2 mb-1.5">Main</p>}
          <NavButton icon={LayoutDashboard} label="Overview" isActive={activeTab === 'overview'} collapsed={collapsed} onClick={() => setActiveTab('overview')} />
          <NavButton icon={Calendar} label="Timetable" isActive={activeTab === 'timetable'} collapsed={collapsed} onClick={() => setActiveTab('timetable')} />
        </div>

        <div className="space-y-1 mt-4">
          {!collapsed && <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-2 mb-1.5">Academic</p>}
          <NavButton icon={FileText} label="Assignments" isActive={activeTab === 'assignments'} collapsed={collapsed} onClick={() => setActiveTab('assignments')} badge={pendingAssignments} />
          <NavButton icon={ClipboardCheck} label="Attendance" isActive={activeTab === 'attendance'} collapsed={collapsed} onClick={() => setActiveTab('attendance')} />
          <NavButton icon={Award} label="Marks" isActive={activeTab === 'marks'} collapsed={collapsed} onClick={() => setActiveTab('marks')} />
          <NavButton icon={TrendingUp} label="Track Report" isActive={activeTab === 'track'} collapsed={collapsed} onClick={() => setActiveTab('track')} />
        </div>

        <div className="space-y-1 mt-4">
          {!collapsed && <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-2 mb-1.5">Campus</p>}
          <NavButton icon={Wallet} label="Fees" isActive={activeTab === 'fees'} collapsed={collapsed} onClick={() => setActiveTab('fees')} />
          <NavButton icon={Building2} label="Hostel" isActive={activeTab === 'hostel'} collapsed={collapsed} onClick={() => setActiveTab('hostel')} />
          <NavButton icon={Trophy} label="Sports" isActive={activeTab === 'sports'} collapsed={collapsed} onClick={() => setActiveTab('sports')} />
          <NavButton icon={ClipboardList} label="Requests" isActive={activeTab === 'requests'} collapsed={collapsed} onClick={() => setActiveTab('requests')} badge={1} />
        </div>
      </div>

      <div className="px-2.5 pb-4 pt-2 border-t border-slate-100">
        <NavButton icon={Settings} label="Settings" isActive={activeTab === 'settings'} collapsed={collapsed} onClick={() => setActiveTab('settings')} />
      </div>
    </motion.aside>
  )
}
