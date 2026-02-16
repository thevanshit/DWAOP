'use client'

import { useState } from 'react'
import {
  Shield,
  FileCheck,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  ChevronRight,
  Calendar,
  Users,
  Award,
  ClipboardCheck,
  Activity,
  Lock,
  Unlock,
  Eye,
  History,
  Settings,
  RefreshCw
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface ComplianceItem {
  id: string
  category: 'attendance' | 'marks' | 'assignments' | 'policies' | 'accreditation'
  title: string
  description: string
  status: 'compliant' | 'warning' | 'non_compliant' | 'pending'
  lastCheck: string
  details: string
  items: { label: string; status: 'pass' | 'fail' | 'pending' }[]
}

const COMPLIANCE_ITEMS: ComplianceItem[] = [
  {
    id: '1',
    category: 'attendance',
    title: 'Attendance Compliance',
    description: 'Verify attendance records meet minimum threshold requirements',
    status: 'warning',
    lastCheck: '2026-02-16 10:30 AM',
    details: '12 students below 75% attendance threshold',
    items: [
      { label: 'Attendance threshold (75%)', status: 'fail' },
      { label: 'Attendance records finalized', status: 'pass' },
      { label: 'Leave applications processed', status: 'pass' },
      { label: 'Attendance warnings issued', status: 'pending' },
    ]
  },
  {
    id: '2',
    category: 'marks',
    title: 'Internal Marks Compliance',
    description: 'Ensure all internal assessment marks are properly recorded',
    status: 'compliant',
    lastCheck: '2026-02-16 09:00 AM',
    details: 'All marks properly recorded and locked',
    items: [
      { label: 'IA-1 marks submitted', status: 'pass' },
      { label: 'Marks within valid range', status: 'pass' },
      { label: 'Mark entry deadlines met', status: 'pass' },
      { label: 'Review window completed', status: 'pass' },
    ]
  },
  {
    id: '3',
    category: 'assignments',
    title: 'Assignment Submission',
    description: 'Track assignment completion and submission rates',
    status: 'compliant',
    lastCheck: '2026-02-15 04:00 PM',
    details: '88% submission rate across all batches',
    items: [
      { label: 'Assignment completion rate > 80%', status: 'pass' },
      { label: 'Late submission penalties applied', status: 'pass' },
      { label: 'Feedback provided for all submissions', status: 'pending' },
      { label: 'Plagiarism checks completed', status: 'pass' },
    ]
  },
  {
    id: '4',
    category: 'policies',
    title: 'Policy Configuration',
    description: 'Verify department policies are properly configured',
    status: 'compliant',
    lastCheck: '2026-02-10 02:00 PM',
    details: 'All policies configured correctly',
    items: [
      { label: 'Attendance threshold set', status: 'pass' },
      { label: 'Grace period configured', status: 'pass' },
      { label: 'Leave policy updated', status: 'pass' },
      { label: 'Marking policy documented', status: 'pass' },
    ]
  },
  {
    id: '5',
    category: 'accreditation',
    title: 'NBA Accreditation Readiness',
    description: 'Prepare documentation for upcoming NBA visit',
    status: 'warning',
    lastCheck: '2026-02-14 11:00 AM',
    details: '3 documents pending submission',
    items: [
      { label: 'Course files prepared', status: 'pass' },
      { label: 'CO-PO mapping completed', status: 'pass' },
      { label: 'Faculty profiles updated', status: 'pending' },
      { label: 'Student outcomes documented', status: 'fail' },
    ]
  },
]

const AUDIT_LOG = [
  { id: '1', action: 'Locked IA-1 Marks', user: 'Dr. Amit Kumar', target: 'Operating Systems - CSE-AIML', timestamp: '2026-02-16 10:15 AM' },
  { id: '2', action: 'Approved Leave Request', user: 'Dr. Vineet Jain', target: 'Rahul Sharma (CS-AIML-045)', timestamp: '2026-02-16 09:45 AM' },
  { id: '3', action: 'Finalized Attendance', user: 'Dr. Priya Sharma', target: 'Database Systems - IT', timestamp: '2026-02-16 09:30 AM' },
  { id: '4', action: 'Created Task', user: 'Admin', target: 'NBA Documentation', timestamp: '2026-02-15 04:20 PM' },
  { id: '5', action: 'Modified Policy', user: 'Dr. Amit Kumar', target: 'Attendance Threshold (75%)', timestamp: '2026-02-15 02:00 PM' },
  { id: '6', action: 'Unlocked Marks', user: 'Dr. Suresh Kumar', target: 'Data Structures - CSE-AIML', timestamp: '2026-02-14 11:30 AM' },
]

const RECENT_ACTIVITY = [
  { id: '1', type: 'lock', message: 'IA-1 Marks locked for OS (CSE-AIML)', time: '2 hours ago' },
  { id: '2', type: 'approve', message: 'Leave request approved for Rahul Sharma', time: '3 hours ago' },
  { id: '3', type: 'finalize', message: 'Attendance finalized for DBMS (IT)', time: '4 hours ago' },
  { id: '4', type: 'create', message: 'New task created: NBA Documentation', time: '1 day ago' },
  { id: '5', type: 'config', message: 'Policy modified: Attendance threshold', time: '1 day ago' },
]

export default function ComplianceTab() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [selectedItem, setSelectedItem] = useState<string | null>(null)

  const categories = ['all', 'attendance', 'marks', 'assignments', 'policies', 'accreditation']
  
  const filteredItems = activeCategory === 'all' || !activeCategory 
    ? COMPLIANCE_ITEMS 
    : COMPLIANCE_ITEMS.filter(i => i.category === activeCategory)

  const stats = {
    total: COMPLIANCE_ITEMS.length,
    compliant: COMPLIANCE_ITEMS.filter(i => i.status === 'compliant').length,
    warning: COMPLIANCE_ITEMS.filter(i => i.status === 'warning').length,
    nonCompliant: COMPLIANCE_ITEMS.filter(i => i.status === 'non_compliant').length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Compliance & Audit</h2>
          <p className="text-sm text-slate-500 mt-1">Monitor compliance status and review system activity</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-50">
            <RefreshCw className="w-4 h-4" />
            Run Audit
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 shadow-lg shadow-blue-600/20">
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <Shield className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
              <p className="text-xs text-slate-500">Total Checks</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">{stats.compliant}</p>
              <p className="text-xs text-slate-500">Compliant</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-amber-600">{stats.warning}</p>
              <p className="text-xs text-slate-500">Warnings</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600">{stats.nonCompliant}</p>
              <p className="text-xs text-slate-500">Non-Compliant</p>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat === 'all' ? null : cat)}
            className={cn(
              "px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all capitalize",
              (activeCategory === cat || (!activeCategory && cat === 'all'))
                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                : "bg-white border border-slate-200 text-slate-600 hover:border-slate-300"
            )}
          >
            {cat === 'all' ? 'All Categories' : cat}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Compliance List */}
        <div className="md:col-span-2 space-y-4">
          {filteredItems.map(item => (
            <ComplianceCard 
              key={item.id} 
              item={item} 
              isSelected={selectedItem === item.id}
              onSelect={() => setSelectedItem(selectedItem === item.id ? null : item.id)}
            />
          ))}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Recent Activity */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200 bg-slate-50/50">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-slate-500" />
                <h3 className="text-sm font-semibold text-slate-900">Recent Activity</h3>
              </div>
            </div>
            <div className="divide-y divide-slate-100 max-h-[300px] overflow-y-auto">
              {RECENT_ACTIVITY.map(activity => (
                <div key={activity.id} className="px-5 py-3 hover:bg-slate-50">
                  <p className="text-xs text-slate-700">{activity.message}</p>
                  <p className="text-[10px] text-slate-400 mt-1">{activity.time}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Audit Trail */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200 bg-slate-50/50">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-slate-500" />
                <h3 className="text-sm font-semibold text-slate-900">Audit Trail</h3>
              </div>
            </div>
            <div className="divide-y divide-slate-100 max-h-[300px] overflow-y-auto">
              {AUDIT_LOG.map(log => (
                <div key={log.id} className="px-5 py-3 hover:bg-slate-50">
                  <p className="text-xs font-medium text-slate-700">{log.action}</p>
                  <p className="text-[10px] text-slate-500">{log.user} • {log.target}</p>
                </div>
              ))}
            </div>
            <div className="px-5 py-3 border-t border-slate-200 bg-slate-50/50">
              <button className="w-full text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center justify-center gap-1">
                View Full Audit Log
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ComplianceCard({ item, isSelected, onSelect }: { 
  item: ComplianceItem; 
  isSelected: boolean;
  onSelect: () => void;
}) {
  const statusStyles = {
    compliant: { bg: 'bg-green-50', border: 'border-green-200', icon: 'text-green-600', badge: 'bg-green-100 text-green-700' },
    warning: { bg: 'bg-amber-50', border: 'border-amber-200', icon: 'text-amber-600', badge: 'bg-amber-100 text-amber-700' },
    non_compliant: { bg: 'bg-red-50', border: 'border-red-200', icon: 'text-red-600', badge: 'bg-red-100 text-red-700' },
    pending: { bg: 'bg-slate-50', border: 'border-slate-200', icon: 'text-slate-600', badge: 'bg-slate-100 text-slate-600' },
  }
  
  const style = statusStyles[item.status]
  const categoryIcons = {
    attendance: ClipboardCheck,
    marks: Award,
    assignments: FileCheck,
    policies: Settings,
    accreditation: Shield,
  }
  
  const CategoryIcon = categoryIcons[item.category]

  return (
    <div 
      onClick={onSelect}
      className={cn(
        "bg-white rounded-2xl border-2 transition-all cursor-pointer overflow-hidden",
        isSelected ? style.border : "border-slate-200"
      )}
    >
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-start gap-3">
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", style.bg)}>
              <CategoryIcon className={cn("w-5 h-5", style.icon)} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                <span className={cn("px-2 py-0.5 rounded text-[10px] font-medium uppercase", style.badge)}>
                  {item.status.replace('_', ' ')}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{item.description}</p>
            </div>
          </div>
          <ChevronRight className={cn("w-4 h-4 text-slate-400 transition-transform", isSelected && "rotate-90")} />
        </div>
        
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <span className="text-xs text-slate-400">Last checked: {item.lastCheck}</span>
          <span className="text-xs text-slate-600 font-medium">{item.details}</span>
        </div>
      </div>

      {/* Expanded Details */}
      {isSelected && (
        <div className="px-5 pb-5">
          <div className="bg-slate-50 rounded-xl p-4">
            <p className="text-xs font-semibold text-slate-700 mb-3">Compliance Items</p>
            <div className="space-y-2">
              {item.items.map((check, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="text-xs text-slate-600">{check.label}</span>
                  {check.status === 'pass' ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : check.status === 'fail' ? (
                    <XCircle className="w-4 h-4 text-red-500" />
                  ) : (
                    <Clock className="w-4 h-4 text-amber-500" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
