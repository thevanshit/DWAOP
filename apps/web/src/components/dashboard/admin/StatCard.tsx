'use client'

import { cn } from '@/lib/utils'
import type { ComponentType } from 'react'

interface StatCardProps {
  label: string
  value: number | string
  icon: ComponentType<{ className?: string }>
  color: string
}

export function StatCard({ label, value, icon: Icon, color }: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-slate-500">{label}</span>
        <div className={cn(
          "w-8 h-8 rounded-lg flex items-center justify-center",
          color === 'blue' ? "bg-blue-50 text-blue-600" :
          color === 'green' ? "bg-green-50 text-green-600" :
          color === 'red' ? "bg-red-50 text-red-600" :
          color === 'purple' ? "bg-purple-50 text-purple-600" :
          "bg-amber-50 text-amber-600"
        )}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
    </div>
  )
}
