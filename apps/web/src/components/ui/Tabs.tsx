'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface Tab {
  id: string
  label: string
  icon?: React.ReactNode
  count?: number
  badge?: string | number
}

interface TabsProps {
  tabs: Tab[]
  activeTab: string
  onChange: (tabId: string) => void
  variant?: 'underline' | 'pills' | 'buttons'
  className?: string
}

function Tabs({ tabs, activeTab, onChange, variant = 'underline', className }: TabsProps) {
  if (variant === 'underline') {
    return (
      <div className={cn('flex border-b border-[var(--color-border)]', className)}>
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={cn(
                'relative flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors',
                isActive
                  ? 'text-[var(--color-primary)]'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]'
              )}
            >
              {tab.icon && <span className="w-4 h-4">{tab.icon}</span>}
              {tab.label}
              {tab.count !== undefined && (
                <span
                  className={cn(
                    'ml-1 px-1.5 py-0.5 text-[10px] font-medium rounded-full',
                    isActive
                      ? 'bg-[var(--color-primary-faint)] text-[var(--color-primary)]'
                      : 'bg-[var(--color-surface-subtle)] text-[var(--color-text-muted)]'
                  )}
                >
                  {tab.count}
                </span>
              )}
              {tab.badge !== undefined && (
                <span className="ml-1 px-1.5 py-0.5 text-[10px] font-medium rounded-full bg-[var(--color-error)] text-white">
                  {tab.badge}
                </span>
              )}
              {isActive && (
                <motion.div
                  layoutId="tab-underline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-primary)]"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
            </button>
          )
        })}
      </div>
    )
  }

  if (variant === 'pills') {
    return (
      <div className={cn('flex gap-1 p-1 bg-[var(--color-surface-subtle)] rounded-lg', className)}>
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={cn(
                'relative flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors',
                isActive
                  ? 'bg-white text-[var(--color-primary)] shadow-sm'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]'
              )}
            >
              {tab.icon && <span className="w-4 h-4">{tab.icon}</span>}
              {tab.label}
              {tab.count !== undefined && (
                <span
                  className={cn(
                    'ml-1 px-1.5 py-0.5 text-[10px] font-medium rounded-full',
                    isActive
                      ? 'bg-[var(--color-primary-faint)] text-[var(--color-primary)]'
                      : 'bg-[var(--color-surface-elevated)] text-[var(--color-text-muted)]'
                  )}
                >
                  {tab.count}
                </span>
              )}
            </button>
          )
        })}
      </div>
    )
  }

  // variant === 'buttons'
  return (
    <div className={cn('flex gap-2', className)}>
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border transition-all',
              isActive
                ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-sm'
                : 'bg-white text-[var(--color-text-secondary)] border-[var(--color-border)] hover:bg-[var(--color-surface-subtle)]'
            )}
          >
            {tab.icon && <span className="w-4 h-4">{tab.icon}</span>}
            {tab.label}
            {tab.count !== undefined && (
              <span
                className={cn(
                  'ml-1 px-1.5 py-0.5 text-[10px] font-medium rounded-full',
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'bg-[var(--color-surface-subtle)] text-[var(--color-text-muted)]'
                )}
              >
                {tab.count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

export { Tabs }
export default Tabs
