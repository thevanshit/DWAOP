'use client'

import { Award, TrendingUp, ChevronDown, ChevronUp, FileText, CheckCircle, Clock, Edit3, AlertCircle } from 'lucide-react'
import { useState } from 'react'
import SectionHeader from '@/components/ui/SectionHeader'
import StatusBadge from '@/components/ui/StatusBadge'

interface MarksTabProps {
    marks: Array<{
        subject: string
        subjectCode?: string
        minor1: number | null
        minor2: number | null
        assignment: number | null
        total: number | null
        status: string
    }>
}

export default function MarksTab({ marks }: MarksTabProps) {
    const [expandedSubjects, setExpandedSubjects] = useState<string[]>([])

    const toggleSubject = (subject: string) => {
        setExpandedSubjects(prev =>
            prev.includes(subject) ? prev.filter(s => s !== subject) : [...prev, subject]
        )
    }

    const getInternalBreakdown = (mark: typeof marks[0]) => {
        const minor1Internal = mark.minor1 || 0
        const minor2Internal = mark.minor2 || 0
        const assignmentInternal = mark.assignment || 0

        const totalInternal = minor1Internal + minor2Internal + assignmentInternal

        return {
            minor1: minor1Internal,
            minor2: minor2Internal,
            assignment: assignmentInternal,
            total: totalInternal
        }
    }

    const getPerformanceColor = (percentage: number) => {
        if (percentage >= 80) return { text: 'text-green-600', bg: 'bg-green-500', light: 'bg-green-50', border: 'border-green-200' }
        if (percentage >= 60) return { text: 'text-amber-600', bg: 'bg-amber-500', light: 'bg-amber-50', border: 'border-amber-200' }
        return { text: 'text-red-600', bg: 'bg-red-500', light: 'bg-red-50', border: 'border-red-200' }
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'finalized': return <CheckCircle className="w-4 h-4" />
            case 'draft': return <Edit3 className="w-4 h-4" />
            case 'under_review': return <Clock className="w-4 h-4" />
            default: return <AlertCircle className="w-4 h-4" />
        }
    }

    const totalInternal = marks.reduce((sum, m) => sum + getInternalBreakdown(m).total, 0)
    const maxInternal = marks.length * 30
    const averageScore = (totalInternal / marks.length).toFixed(1)
    const highestScore = Math.max(...marks.map(m => getInternalBreakdown(m).total))
    const finalizedCount = marks.filter(m => m.status === 'finalized').length

    return (
        <div className="space-y-6">
            <SectionHeader
                title="Internal Marks"
                subtitle="Your internal assessment scores (out of 30 per subject)"
            />

            {/* Summary Cards - Card Style with white/gray/minimal theme */}
            <div className="grid md:grid-cols-3 gap-4">
                <div className="
                    bg-white rounded-2xl border border-black/[0.04]
                    shadow-[0_1px_3px_rgba(0,0,0,0.02),0_4px_12px_rgba(0,0,0,0.02)]
                    p-6
                ">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-medium text-[var(--color-text-muted)]">Average Score</span>
                        <div className="w-10 h-10 rounded-xl bg-[var(--color-primary-faint)] flex items-center justify-center">
                            <Award className="w-5 h-5 text-[var(--color-primary)]" />
                        </div>
                    </div>
                    <div className="text-3xl font-bold text-[var(--color-text-primary)] mb-1">
                        {averageScore}
                        <span className="text-lg text-[var(--color-text-muted)]">/30</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden mt-3">
                        <div 
                            className="h-full bg-[var(--color-primary)] rounded-full"
                            style={{ width: `${(parseFloat(averageScore) / 30) * 100}%` }}
                        />
                    </div>
                    <p className="text-xs text-[var(--color-text-muted)] mt-2">
                        {((parseFloat(averageScore) / 30) * 100).toFixed(1)}% of 30
                    </p>
                </div>

                <div className="
                    bg-white rounded-2xl border border-black/[0.04]
                    shadow-[0_1px_3px_rgba(0,0,0,0.02),0_4px_12px_rgba(0,0,0,0.02)]
                    p-6
                ">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-medium text-[var(--color-text-muted)]">Subjects Evaluated</span>
                        <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                            <TrendingUp className="w-5 h-5 text-green-600" />
                        </div>
                    </div>
                    <div className="text-3xl font-bold text-[var(--color-text-primary)] mb-1">
                        {finalizedCount}
                        <span className="text-lg text-[var(--color-text-muted)]">/{marks.length}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                        <div className="flex items-center gap-1 px-2 py-1 bg-green-50 rounded-lg">
                            <CheckCircle className="w-3 h-3 text-green-600" />
                            <span className="text-xs font-medium text-green-700">Finalized</span>
                        </div>
                        <div className="flex items-center gap-1 px-2 py-1 bg-amber-50 rounded-lg">
                            <Edit3 className="w-3 h-3 text-amber-600" />
                            <span className="text-xs font-medium text-amber-700">Draft</span>
                        </div>
                    </div>
                </div>

                <div className="
                    bg-white rounded-2xl border border-black/[0.04]
                    shadow-[0_1px_3px_rgba(0,0,0,0.02),0_4px_12px_rgba(0,0,0,0.02)]
                    p-6
                ">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-medium text-[var(--color-text-muted)]">Total Internal</span>
                        <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                            <FileText className="w-5 h-5 text-purple-600" />
                        </div>
                    </div>
                    <div className="text-3xl font-bold text-[var(--color-text-primary)] mb-1">
                        {totalInternal}
                        <span className="text-lg text-[var(--color-text-muted)]">/{maxInternal}</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden mt-3">
                        <div 
                            className="h-full bg-purple-500 rounded-full"
                            style={{ width: `${(totalInternal / maxInternal) * 100}%` }}
                        />
                    </div>
                    <p className="text-xs text-[var(--color-text-muted)] mt-2">
                        Across {marks.length} subjects
                    </p>
                </div>
            </div>

            {/* Subject-wise Marks - Card Style */}
            <div className="space-y-4">
                {marks.map((mark) => {
                    const isExpanded = expandedSubjects.includes(mark.subject)
                    const breakdown = getInternalBreakdown(mark)
                    const percentage = (breakdown.total / 30) * 100
                    const colors = getPerformanceColor(percentage)

                    return (
                        <div 
                            key={mark.subject} 
                            className="
                                bg-white rounded-2xl border border-black/[0.04]
                                shadow-[0_1px_3px_rgba(0,0,0,0.02),0_4px_12px_rgba(0,0,0,0.02)]
                                overflow-hidden hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)] transition-all duration-200
                            "
                        >
                            {/* Subject Header */}
                            <button
                                onClick={() => toggleSubject(mark.subject)}
                                className="w-full flex items-center justify-between p-5 hover:bg-gray-50/50 transition-colors"
                            >
                                <div className="flex items-center gap-4 flex-1">
                                    <div className={`
                                        w-14 h-14 rounded-xl flex items-center justify-center
                                        ${colors.light}
                                    `}>
                                        <span className={`text-xl font-bold ${colors.text}`}>
                                            {breakdown.total || '-'}
                                        </span>
                                    </div>
                                    <div className="text-left flex-1">
                                        <h3 className="font-semibold text-[var(--color-text-primary)]">{mark.subject}</h3>
                                        {mark.subjectCode && <p className="text-xs text-[var(--color-text-muted)]">{mark.subjectCode}</p>}
                                        <div className="flex items-center gap-3 mt-3">
                                            <div className="flex-1 max-w-xs">
                                                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full ${colors.bg}`}
                                                        style={{ width: `${percentage}%` }}
                                                    />
                                                </div>
                                            </div>
                                            <span className={`text-sm font-semibold ${colors.text}`}>
                                                {percentage.toFixed(1)}%
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <StatusBadge status={mark.status} />
                                    {isExpanded ? (
                                        <ChevronUp className="w-5 h-5 text-gray-400" />
                                    ) : (
                                        <ChevronDown className="w-5 h-5 text-gray-400" />
                                    )}
                                </div>
                            </button>

                            {/* Detailed Breakdown */}
                            {isExpanded && (
                                <div className="border-t border-black/[0.04] p-5 bg-gray-50/50">
                                    <h4 className="text-sm font-semibold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
                                        <FileText className="w-4 h-4" />
                                        Internal Marks Breakdown (Out of 30)
                                    </h4>

                                    <div className="grid md:grid-cols-3 gap-4 mb-6">
                                        {/* Minor 1 - 10 marks */}
                                        <div className="bg-white rounded-xl border border-black/[0.04] p-4 shadow-sm">
                                            <div className="flex items-center justify-between mb-3">
                                                <span className="text-xs font-medium text-[var(--color-text-muted)]">Minor 1</span>
                                                <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full">10 marks</span>
                                            </div>
                                            <div className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">
                                                {breakdown.minor1}
                                                <span className="text-sm text-[var(--color-text-muted)]">/10</span>
                                            </div>
                                            {mark.minor1 !== null ? (
                                                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                    <div 
                                                        className="h-full bg-blue-500 rounded-full"
                                                        style={{ width: `${(breakdown.minor1 / 10) * 100}%` }}
                                                    />
                                                </div>
                                            ) : (
                                                <p className="text-xs text-[var(--color-text-muted)]">Not yet evaluated</p>
                                            )}
                                        </div>

                                        {/* Minor 2 - 10 marks */}
                                        <div className="bg-white rounded-xl border border-black/[0.04] p-4 shadow-sm">
                                            <div className="flex items-center justify-between mb-3">
                                                <span className="text-xs font-medium text-[var(--color-text-muted)]">Minor 2</span>
                                                <span className="text-xs px-2 py-0.5 bg-purple-50 text-purple-600 rounded-full">10 marks</span>
                                            </div>
                                            <div className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">
                                                {breakdown.minor2}
                                                <span className="text-sm text-[var(--color-text-muted)]">/10</span>
                                            </div>
                                            {mark.minor2 !== null ? (
                                                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                    <div 
                                                        className="h-full bg-purple-500 rounded-full"
                                                        style={{ width: `${(breakdown.minor2 / 10) * 100}%` }}
                                                    />
                                                </div>
                                            ) : (
                                                <p className="text-xs text-[var(--color-text-muted)]">Not yet evaluated</p>
                                            )}
                                        </div>

                                        {/* Assignments - 10 marks */}
                                        <div className="bg-white rounded-xl border border-black/[0.04] p-4 shadow-sm">
                                            <div className="flex items-center justify-between mb-3">
                                                <span className="text-xs font-medium text-[var(--color-text-muted)]">Assignments</span>
                                                <span className="text-xs px-2 py-0.5 bg-green-50 text-green-600 rounded-full">10 marks</span>
                                            </div>
                                            <div className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">
                                                {breakdown.assignment}
                                                <span className="text-sm text-[var(--color-text-muted)]">/10</span>
                                            </div>
                                            {mark.assignment !== null ? (
                                                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                    <div 
                                                        className="h-full bg-green-500 rounded-full"
                                                        style={{ width: `${(breakdown.assignment / 10) * 100}%` }}
                                                    />
                                                </div>
                                            ) : (
                                                <p className="text-xs text-[var(--color-text-muted)]">Pending</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Total */}
                                    <div className={`
                                        rounded-xl p-4 border
                                        ${colors.light} ${colors.border}
                                    `}>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-semibold text-[var(--color-text-primary)]">Total Internal Marks</span>
                                            <div className="text-right">
                                                <div className="text-2xl font-bold text-[var(--color-text-primary)]">
                                                    {breakdown.total}
                                                    <span className="text-lg text-[var(--color-text-muted)]">/30</span>
                                                </div>
                                                <div className={`text-xs font-medium ${colors.text}`}>{percentage.toFixed(1)}%</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>

            {/* Info Box */}
            <div className="
                bg-gradient-to-br from-blue-50 to-indigo-50 
                border border-blue-200/50 
                rounded-2xl p-5
            ">
                <h4 className="font-semibold text-[var(--color-text-primary)] mb-3 flex items-center gap-2">
                    <Award className="w-5 h-5 text-[var(--color-primary)]" />
                    Internal Marks Structure
                </h4>
                <div className="grid md:grid-cols-4 gap-4 text-sm">
                    <div className="bg-white/80 rounded-xl p-3 border border-blue-200/30">
                        <div className="flex items-center gap-2 mb-1">
                            <FileText className="w-4 h-4 text-blue-600" />
                            <span className="font-medium text-blue-900">Minor 1</span>
                        </div>
                        <p className="text-xs text-blue-700">10 marks</p>
                    </div>
                    <div className="bg-white/80 rounded-xl p-3 border border-blue-200/30">
                        <div className="flex items-center gap-2 mb-1">
                            <FileText className="w-4 h-4 text-purple-600" />
                            <span className="font-medium text-purple-900">Minor 2</span>
                        </div>
                        <p className="text-xs text-purple-700">10 marks</p>
                    </div>
                    <div className="bg-white/80 rounded-xl p-3 border border-blue-200/30">
                        <div className="flex items-center gap-2 mb-1">
                            <FileText className="w-4 h-4 text-green-600" />
                            <span className="font-medium text-green-900">Assignments</span>
                        </div>
                        <p className="text-xs text-green-700">10 marks</p>
                    </div>
                    <div className="bg-white/80 rounded-xl p-3 border border-blue-200/30">
                        <div className="flex items-center gap-2 mb-1">
                            <Award className="w-4 h-4 text-[var(--color-primary)]" />
                            <span className="font-medium text-[var(--color-text-primary)]">Total</span>
                        </div>
                        <p className="text-xs text-[var(--color-text-muted)]">30 marks</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
