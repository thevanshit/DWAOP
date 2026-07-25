'use client'

import { useState } from 'react'
import { LeaveRequest, UserRole } from '@/types'
import { getNextPossibleStatuses, canTransition } from '@/lib/workflow-engine'
import {
    Calendar,
    Clock,
    CheckCircle2,
    XCircle,
    ChevronDown,
    ArrowRight,
    User,
    FileText
} from 'lucide-react'

interface LeaveWorkflowProps {
    request: LeaveRequest
    userRole: UserRole
    onTransition: (newStatus: LeaveRequest['status']) => void
}

const statusColors: Record<string, string> = {
    created: 'bg-[var(--color-surface-subtle)] text-[var(--color-text-secondary)]',
    under_review: 'bg-[var(--color-info-light)] text-[var(--color-info)]',
    approved: 'bg-[var(--color-success-light)] text-[var(--color-success)]',
    rejected: 'bg-[var(--color-error-light)] text-[var(--color-error)]',
    done: 'bg-[var(--color-success-light)] text-[var(--color-success)]',
}

export default function LeaveWorkflow({ request, userRole, onTransition }: LeaveWorkflowProps) {
    const [isExpanded, setIsExpanded] = useState(true)
    const nextStatuses = getNextPossibleStatuses('leave', request.status, userRole)

    const handleStatusChange = (status: LeaveRequest['status']) => {
        onTransition(status)
    }

    return (
        <div className="bg-white border border-[var(--color-border)] rounded-xl overflow-hidden">
            {/* Header */}
            <div className="px-5 py-4 flex items-center justify-between border-b border-[var(--color-border-light)]">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-[var(--color-primary-faint)] rounded-lg flex items-center justify-center text-[var(--color-primary)]">
                        <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="font-medium text-[var(--color-text-primary)]">{request.leaveType} Request</h3>
                        <div className="flex items-center gap-2 mt-0.5">
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${statusColors[request.status] || statusColors.created}`}>
                                {request.status.replace('_', ' ')}
                            </span>
                            <span className="text-xs text-[var(--color-text-muted)] flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {new Date(request.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                </div>
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className={`p-2 hover:bg-[var(--color-surface-subtle)] rounded-lg transition-colors ${isExpanded ? 'rotate-180' : ''}`}
                >
                    <ChevronDown className="w-4 h-4 text-[var(--color-text-muted)]" />
                </button>
            </div>

            {isExpanded && (
                <div className="p-5">
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                        {/* Details */}
                        <div>
                            <p className="text-xs font-medium text-[var(--color-text-muted)] mb-3">Request Details</p>
                            <div className="space-y-3">
                                <DetailRow 
                                    label="Duration" 
                                    value={`${new Date(request.startDate).toLocaleDateString()} — ${new Date(request.endDate).toLocaleDateString()}`} 
                                />
                                <DetailRow label="Reason" value={request.reason} />
                            </div>
                        </div>

                        {/* Approval Flow */}
                        <div className="bg-[var(--color-surface-subtle)] rounded-lg p-4">
                            <p className="text-xs font-medium text-[var(--color-text-muted)] mb-4">Approval Flow</p>
                            <div className="space-y-3">
                                <ApprovalStep
                                    name="HOD Approval"
                                    status={request.status === 'done' ? 'approved' : request.status === 'under_review' ? 'pending' : 'pending'}
                                />
                                <ApprovalStep
                                    name="Faculty Advisor"
                                    status={['under_review', 'done'].includes(request.status) ? 'approved' : 'pending'}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-[var(--color-border-light)]">
                        <div className="flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
                            <FileText className="w-4 h-4" />
                            <span>Reference: #{request.id}</span>
                        </div>

                        <div className="flex items-center gap-2">
                            {nextStatuses.map(status => (
                                <button
                                    key={status}
                                    onClick={() => handleStatusChange(status)}
                                    className="flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:bg-[var(--color-primary-dark)] transition-colors"
                                >
                                    <span>{status === 'done' ? 'Approve' : 'Submit'}</span>
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            ))}
                            {userRole !== 'student' && (
                                <button className="flex items-center gap-2 px-4 py-2 border border-[var(--color-error-light)] text-[var(--color-error)] rounded-lg text-sm font-medium hover:bg-[var(--color-error-light)] transition-colors">
                                    <XCircle className="w-4 h-4" />
                                    <span>Reject</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

function DetailRow({ label, value }: { label: string, value: string }) {
    return (
        <div>
            <p className="text-xs font-medium text-[var(--color-text-muted)]">{label}</p>
            <p className="text-sm text-[var(--color-text-primary)]">{value}</p>
        </div>
    )
}

function ApprovalStep({ name, status }: { name: string, status: 'approved' | 'pending' | 'rejected' }) {
    const statusConfig = {
        approved: { bg: 'bg-[var(--color-success-light)]', text: 'text-[var(--color-success)]', icon: <CheckCircle2 className="w-3 h-3" /> },
        pending: { bg: 'bg-[var(--color-surface-subtle)]', text: 'text-[var(--color-text-muted)]', icon: <Clock className="w-3 h-3" /> },
        rejected: { bg: 'bg-[var(--color-error-light)]', text: 'text-[var(--color-error)]', icon: <XCircle className="w-3 h-3" /> }
    }
    const config = statusConfig[status]

    return (
        <div className="flex items-center gap-3">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${config.bg} ${config.text}`}>
                {config.icon}
            </div>
            <div>
                <p className="text-sm font-medium text-[var(--color-text-primary)]">{name}</p>
                <p className={`text-xs capitalize ${config.text}`}>{status}</p>
            </div>
        </div>
    )
}
