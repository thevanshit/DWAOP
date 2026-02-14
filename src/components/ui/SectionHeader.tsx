'use client'

import { ReactNode } from 'react'

interface SectionHeaderProps {
    title: string
    subtitle?: string
    action?: {
        label: string
        onClick: () => void
        icon?: ReactNode
    }
    className?: string
}

export default function SectionHeader({ title, subtitle, action, className = '' }: SectionHeaderProps) {
    return (
        <div className={`flex items-center justify-between mb-4 ${className}`}>
            <div>
                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
            </div>
            {action && (
                <button
                    onClick={action.onClick}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                >
                    {action.icon}
                    {action.label}
                </button>
            )}
        </div>
    )
}
