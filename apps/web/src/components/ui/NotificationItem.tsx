'use client'

import { FileText, Bell, Calendar, Check, AlertCircle, Trophy, Clock } from 'lucide-react'

interface NotificationItemProps {
    notification: {
        id: string | number
        type: 'announcement' | 'alert' | 'deadline' | 'marks_released' | 'leave_status' | 'assignment' | 'general'
        title: string
        message: string
        timestamp: Date | string
        read: boolean
        priority?: 'high' | 'medium' | 'low'
        actionUrl?: string
    }
    onClick?: () => void
    onMarkAsRead?: () => void
    className?: string
}

export default function NotificationItem({ notification, onClick, onMarkAsRead, className = '' }: NotificationItemProps) {
    const getIcon = () => {
        switch (notification.type) {
            case 'announcement':
                return <Bell className="w-4 h-4" />
            case 'alert':
                return <AlertCircle className="w-4 h-4" />
            case 'deadline':
            case 'assignment':
                return <FileText className="w-4 h-4" />
            case 'marks_released':
                return <Trophy className="w-4 h-4" />
            case 'leave_status':
                return <Check className="w-4 h-4" />
            default:
                return <Calendar className="w-4 h-4" />
        }
    }

    const getIconColor = () => {
        switch (notification.type) {
            case 'announcement':
                return 'bg-blue-100 text-blue-600'
            case 'alert':
                return 'bg-red-100 text-red-600'
            case 'deadline':
            case 'assignment':
                return 'bg-orange-100 text-orange-600'
            case 'marks_released':
                return 'bg-green-100 text-green-600'
            case 'leave_status':
                return 'bg-purple-100 text-purple-600'
            default:
                return 'bg-gray-100 text-gray-600'
        }
    }

    const getTimeAgo = () => {
        const now = new Date()
        const notifTime = new Date(notification.timestamp)
        const diffMs = now.getTime() - notifTime.getTime()
        const diffMins = Math.floor(diffMs / 60000)
        const diffHours = Math.floor(diffMs / 3600000)
        const diffDays = Math.floor(diffMs / 86400000)

        if (diffMins < 1) return 'Just now'
        if (diffMins < 60) return `${diffMins}m ago`
        if (diffHours < 24) return `${diffHours}h ago`
        if (diffDays < 7) return `${diffDays}d ago`
        return notifTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }

    return (
        <div
            className={`px-4 py-3.5 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-0 transition-colors ${notification.read ? '' : 'bg-blue-50/30'
                } ${className}`}
            onClick={onClick}
        >
            <div className="flex items-start gap-3">
                {/* Icon */}
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${getIconColor()}`}>
                    {getIcon()}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-sm font-medium text-gray-900 truncate">{notification.title}</p>
                        {!notification.read && <span className="w-2 h-2 bg-blue-500 rounded-full shrink-0" />}
                        {notification.priority === 'high' && (
                            <span className="w-2 h-2 bg-red-500 rounded-full shrink-0" />
                        )}
                    </div>
                    <p className="text-xs text-gray-600 line-clamp-2 mb-1">{notification.message}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                        <Clock className="w-3 h-3" />
                        <span>{getTimeAgo()}</span>
                    </div>
                </div>

                {/* Mark as read button */}
                {!notification.read && onMarkAsRead && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            onMarkAsRead()
                        }}
                        className="shrink-0 p-1 hover:bg-gray-200 rounded transition-colors"
                        title="Mark as read"
                    >
                        <Check className="w-4 h-4 text-gray-400" />
                    </button>
                )}
            </div>
        </div>
    )
}
