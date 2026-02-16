'use client'

import { useState } from 'react'
import {
  Shield,
  Lock,
  Unlock,
  Settings,
  FileCheck,
  AlertCircle,
  ChevronRight,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  Calendar,
  Award,
  ClipboardCheck,
  Eye,
  Save,
  RotateCcw,
  Bell,
  Gauge
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface GovernanceAction {
  id: string
  title: string
  description: string
  icon: React.ElementType
  type: 'lock' | 'unlock' | 'config' | 'approve' | 'override'
  category: 'marks' | 'attendance' | 'policy' | 'workflow'
  status?: 'pending' | 'completed' | 'warning'
  count?: number
  lastAction?: string
}

interface GovernanceActionsPanelProps {
  onAction?: (action: string, params?: any) => void
}

const ACTIONS: GovernanceAction[] = [
  { 
    id: 'lock-marks', 
    title: 'Lock Internal Marks', 
    description: 'Finalize and lock all IA-1 marks for semester', 
    icon: Lock, 
    type: 'lock',
    category: 'marks',
    status: 'pending',
    count: 6,
    lastAction: 'Last locked: Jan 15, 2026'
  },
  { 
    id: 'unlock-marks', 
    title: 'Unlock Marks', 
    description: 'Allow faculty to edit marks during review window', 
    icon: Unlock, 
    type: 'unlock',
    category: 'marks',
    status: 'completed',
    lastAction: 'Feb 1, 2026'
  },
  { 
    id: 'finalize-attendance', 
    title: 'Finalize Attendance', 
    description: 'Lock attendance records for past month', 
    icon: ClipboardCheck, 
    type: 'lock',
    category: 'attendance',
    status: 'pending',
    count: 24,
    lastAction: 'Last finalized: Feb 1, 2026'
  },
  { 
    id: 'approve-leaves', 
    title: 'Pending Leave Requests', 
    description: 'Review and approve student leave applications', 
    icon: Calendar, 
    type: 'approve',
    category: 'workflow',
    status: 'warning',
    count: 5,
    lastAction: '3 pending > 48 hours'
  },
  { 
    id: 'policy-config', 
    title: 'Policy Configuration', 
    description: 'Configure attendance threshold, grace periods', 
    icon: Settings, 
    type: 'config',
    category: 'policy',
    lastAction: 'Modified: Jan 20, 2026'
  },
  { 
    id: 'override-workflow', 
    title: 'Workflow Override', 
    description: 'Override workflow in exceptional cases', 
    icon: RotateCcw, 
    type: 'override',
    category: 'workflow',
    lastAction: '3 overrides this semester'
  },
  { 
    id: 'compliance-check', 
    title: 'Compliance Check', 
    description: 'Run system-wide compliance audit', 
    icon: FileCheck, 
    type: 'approve',
    category: 'policy',
    status: 'completed',
    lastAction: 'Passed: Feb 10, 2026'
  },
  { 
    id: 'escalation', 
    title: 'Escalation Center', 
    description: 'View and manage escalated items', 
    icon: AlertCircle, 
    type: 'approve',
    category: 'workflow',
    status: 'warning',
    count: 2,
    lastAction: '2 escalated to HOD'
  },
]

export default function GovernanceActionsPanel({ onAction }: GovernanceActionsPanelProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const categories = ['all', 'marks', 'attendance', 'policy', 'workflow']
  const categoryIcons: Record<string, React.ElementType> = {
    all: Gauge,
    marks: Award,
    attendance: ClipboardCheck,
    policy: Settings,
    workflow: RotateCcw,
  }

  const filteredActions = selectedCategory === 'all' || !selectedCategory 
    ? ACTIONS 
    : ACTIONS.filter(a => a.category === selectedCategory)

  const pendingCount = ACTIONS.filter(a => a.status === 'pending').length
  const warningCount = ACTIONS.filter(a => a.status === 'warning').length

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-200 bg-slate-50/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <Shield className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Governance Actions</h3>
              <p className="text-xs text-slate-500">Quick administrative controls</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {pendingCount > 0 && (
              <span className="flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-700 rounded-lg text-xs font-medium">
                <Clock className="w-3 h-3" />
                {pendingCount} Pending
              </span>
            )}
            {warningCount > 0 && (
              <span className="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded-lg text-xs font-medium">
                <AlertCircle className="w-3 h-3" />
                {warningCount} Urgent
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="px-5 py-3 border-b border-slate-100">
        <div className="flex gap-2 overflow-x-auto">
          {categories.map(cat => {
            const Icon = categoryIcons[cat]
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat === 'all' ? null : cat)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap",
                  (selectedCategory === cat || (!selectedCategory && cat === 'all'))
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            )
          })}
        </div>
      </div>

      {/* Actions List */}
      <div className="divide-y divide-slate-100 max-h-[400px] overflow-y-auto">
        {filteredActions.map(action => (
          <ActionCard 
            key={action.id} 
            action={action} 
            onClick={() => onAction?.(action.id)} 
          />
        ))}
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-slate-200 bg-slate-50/50">
        <button className="w-full text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center justify-center gap-1">
          View All Actions
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

function ActionCard({ action, onClick }: { action: GovernanceAction; onClick?: () => void }) {
  const statusStyles = {
    pending: { bg: 'bg-amber-50', border: 'border-amber-200', icon: 'text-amber-600', badge: 'bg-amber-100 text-amber-700' },
    completed: { bg: 'bg-green-50', border: 'border-green-200', icon: 'text-green-600', badge: 'bg-green-100 text-green-700' },
    warning: { bg: 'bg-red-50', border: 'border-red-200', icon: 'text-red-600', badge: 'bg-red-100 text-red-700' },
  }

  const status = action.status ? statusStyles[action.status] : null
  const Icon = action.icon

  return (
    <div 
      onClick={onClick}
      className={cn(
        "px-5 py-4 hover:bg-slate-50 transition-colors cursor-pointer",
        status?.bg
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center",
            status?.bg || 'bg-slate-100'
          )}>
            <Icon className={cn("w-5 h-5", status?.icon || 'text-slate-600')} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-slate-900">{action.title}</p>
              {action.count && (
                <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded text-[10px] font-medium">
                  {action.count}
                </span>
              )}
              {status?.badge && (
                <span className={cn("px-1.5 py-0.5 rounded text-[9px] font-medium uppercase", status.badge)}>
                  {action.status}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{action.description}</p>
            {action.lastAction && (
              <p className="text-[10px] text-slate-400 mt-1">{action.lastAction}</p>
            )}
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-slate-400 mt-1" />
      </div>
    </div>
  )
}
