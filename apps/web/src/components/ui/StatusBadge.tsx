'use client'

import { ReactNode } from 'react'

interface StatusBadgeProps {
  status: string
  variant?: 'default' | 'dot'
  className?: string
}

const statusConfig: Record<string, { bg: string; text: string; label: string; dotColor?: string }> = {
  // Assignment statuses
  pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Pending', dotColor: 'bg-yellow-500' },
  submitted: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Submitted', dotColor: 'bg-blue-500' },
  evaluated: { bg: 'bg-green-100', text: 'text-green-700', label: 'Evaluated', dotColor: 'bg-green-500' },
  late: { bg: 'bg-red-100', text: 'text-red-700', label: 'Late', dotColor: 'bg-red-500' },
  
  // Marks statuses
  draft: { bg: 'bg-gray-100', text: 'text-gray-600', label: 'Draft', dotColor: 'bg-gray-400' },
  under_review: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Under Review', dotColor: 'bg-yellow-500' },
  finalized: { bg: 'bg-green-100', text: 'text-green-700', label: 'Finalized', dotColor: 'bg-green-500' },
  locked: { bg: 'bg-slate-100', text: 'text-slate-700', label: 'Locked', dotColor: 'bg-slate-500' },
  
  // Request statuses
  approved: { bg: 'bg-green-100', text: 'text-green-700', label: 'Approved', dotColor: 'bg-green-500' },
  rejected: { bg: 'bg-red-100', text: 'text-red-700', label: 'Rejected', dotColor: 'bg-red-500' },
  
  // Attendance/Eligibility statuses
  eligible: { bg: 'bg-green-100', text: 'text-green-700', label: 'Eligible', dotColor: 'bg-green-500' },
  at_risk: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'At Risk', dotColor: 'bg-yellow-500' },
  not_eligible: { bg: 'bg-red-100', text: 'text-red-700', label: 'Not Eligible', dotColor: 'bg-red-500' },
  
  // General statuses
  active: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Active', dotColor: 'bg-blue-500' },
  inactive: { bg: 'bg-gray-100', text: 'text-gray-600', label: 'Inactive', dotColor: 'bg-gray-400' },
  completed: { bg: 'bg-green-100', text: 'text-green-700', label: 'Completed', dotColor: 'bg-green-500' },
  in_progress: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'In Progress', dotColor: 'bg-blue-500' },
  
  // Payment statuses
  paid: { bg: 'bg-green-100', text: 'text-green-700', label: 'Paid', dotColor: 'bg-green-500' },
  unpaid: { bg: 'bg-red-100', text: 'text-red-700', label: 'Unpaid', dotColor: 'bg-red-500' },
  partial: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Partial', dotColor: 'bg-yellow-500' },
}

export default function StatusBadge({ status, variant = 'default', className = '' }: StatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.draft
  
  if (variant === 'dot') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <span className={`w-2 h-2 rounded-full ${config.dotColor}`} />
        <span className={`text-sm font-medium ${config.text}`}>{config.label}</span>
      </div>
    )
  }
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text} ${className}`}>
      {config.label}
    </span>
  )
}
