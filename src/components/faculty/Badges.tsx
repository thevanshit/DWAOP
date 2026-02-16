'use client';

import React from 'react';
import { AlertCircle, ArrowUp, ArrowUpRight, Minus, Clock } from 'lucide-react';

interface PriorityBadgeProps {
  priority: 'low' | 'medium' | 'high' | 'critical';
  showLabel?: boolean;
  className?: string;
}

export function PriorityBadge({ priority, showLabel = true, className = '' }: PriorityBadgeProps) {
  const config = {
    critical: {
      bg: 'bg-red-50',
      text: 'text-red-600',
      border: 'border-red-100',
      icon: <AlertCircle className="w-3 h-3" />,
      label: 'Critical',
    },
    high: {
      bg: 'bg-orange-50',
      text: 'text-orange-600',
      border: 'border-orange-100',
      icon: <ArrowUp className="w-3 h-3" />,
      label: 'High',
    },
    medium: {
      bg: 'bg-blue-50',
      text: 'text-blue-600',
      border: 'border-blue-100',
      icon: <ArrowUpRight className="w-3 h-3" />,
      label: 'Medium',
    },
    low: {
      bg: 'bg-gray-50',
      text: 'text-gray-500',
      border: 'border-gray-100',
      icon: <Minus className="w-3 h-3" />,
      label: 'Low',
    },
  };
  
  const { bg, text, border, icon, label } = config[priority];
  
  return (
    <span className={`
      inline-flex items-center gap-1
      px-2 py-0.5 
      rounded-md 
      text-[10px] font-semibold
      ${bg} ${text} ${border}
      ${className}
    `}>
      {icon}
      {showLabel && <span className="uppercase tracking-wide">{label}</span>}
    </span>
  );
}

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const config: Record<string, { bg: string; text: string; dot: string }> = {
    created: { bg: 'bg-gray-100', text: 'text-gray-600', dot: 'bg-gray-500' },
    in_progress: { bg: 'bg-blue-100', text: 'text-blue-600', dot: 'bg-blue-500' },
    under_review: { bg: 'bg-amber-100', text: 'text-amber-600', dot: 'bg-amber-500' },
    done: { bg: 'bg-green-100', text: 'text-green-600', dot: 'bg-green-500' },
    delayed: { bg: 'bg-red-100', text: 'text-red-600', dot: 'bg-red-500' },
    finalised: { bg: 'bg-purple-100', text: 'text-purple-600', dot: 'bg-purple-500' },
    locked: { bg: 'bg-indigo-100', text: 'text-indigo-600', dot: 'bg-indigo-500' },
  };
  
  const { bg, text, dot } = config[status] || config.created;
  const label = status.replace('_', ' ');
  
  return (
    <span className={`
      inline-flex items-center gap-1.5
      px-2 py-0.5 
      rounded-full
      text-[10px] font-medium
      ${bg} ${text}
      ${className}
    `}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      <span className="capitalize">{label}</span>
    </span>
  );
}

interface CommitteeTagProps {
  committee: string;
  className?: string;
}

const committeeColors: Record<string, string> = {
  'Academic Board': 'bg-purple-50 text-purple-600 border-purple-100',
  'Exam Committee': 'bg-amber-50 text-amber-600 border-amber-100',
  'Events Committee': 'bg-pink-50 text-pink-600 border-pink-100',
  'Accreditation Team': 'bg-cyan-50 text-cyan-600 border-cyan-100',
  'Research Committee': 'bg-green-50 text-green-600 border-green-100',
  'Curriculum': 'bg-blue-50 text-blue-600 border-blue-100',
  'Teaching': 'bg-indigo-50 text-indigo-600 border-indigo-100',
  'Administration': 'bg-gray-50 text-gray-600 border-gray-100',
};

export function CommitteeTag({ committee, className = '' }: CommitteeTagProps) {
  const colorClass = committeeColors[committee] || 'bg-gray-50 text-gray-600 border-gray-100';
  
  return (
    <span className={`
      inline-flex items-center
      px-2 py-0.5
      rounded-md
      text-[10px] font-medium
      border
      ${colorClass}
      ${className}
    `}>
      {committee}
    </span>
  );
}

interface DueDateChipProps {
  dueDate: Date;
  className?: string;
}

export function DueDateChip({ dueDate, className = '' }: DueDateChipProps) {
  const now = new Date();
  const diff = dueDate.getTime() - now.getTime();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  
  let config = { bg: 'bg-gray-50', text: 'text-gray-500', icon: <Clock className="w-3 h-3" /> };
  
  if (days < 0) {
    config = { bg: 'bg-red-50', text: 'text-red-600', icon: <AlertCircle className="w-3 h-3" /> };
  } else if (days === 0) {
    config = { bg: 'bg-orange-50', text: 'text-orange-600', icon: <Clock className="w-3 h-3" /> };
  } else if (days <= 2) {
    config = { bg: 'bg-amber-50', text: 'text-amber-600', icon: <Clock className="w-3 h-3" /> };
  } else if (days <= 7) {
    config = { bg: 'bg-blue-50', text: 'text-blue-600', icon: <Clock className="w-3 h-3" /> };
  }
  
  const dateStr = days < 0 
    ? `${Math.abs(days)}d overdue` 
    : days === 0 
      ? 'Today' 
      : `${days}d left`;
  
  return (
    <span className={`
      inline-flex items-center gap-1
      px-1.5 py-0.5 
      rounded
      text-[10px] font-medium
      ${config.bg} ${config.text}
      ${className}
    `}>
      {config.icon}
      {dateStr}
    </span>
  );
}
