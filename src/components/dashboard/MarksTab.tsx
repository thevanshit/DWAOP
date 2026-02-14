'use client'

import { Award, TrendingUp, ChevronDown, ChevronUp } from 'lucide-react'
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

    // Calculate internal marks breakdown (out of 30)
    const getInternalBreakdown = (mark: typeof marks[0]) => {
        // Minor 1: 10 marks (20-mark exam scaled to 10)
        const minor1Internal = mark.minor1 ? (mark.minor1 / 20) * 10 : null
        // Minor 2: 10 marks (20-mark exam scaled to 10)
        const minor2Internal = mark.minor2 ? (mark.minor2 / 20) * 10 : null
        // Assignments: 10 marks total
        const assignmentInternal = mark.assignment ? (mark.assignment / 100) * 10 : null

        const totalInternal = (minor1Internal || 0) + (minor2Internal || 0) + (assignmentInternal || 0)

        return {
            minor1: minor1Internal,
            minor2: minor2Internal,
            assignment: assignmentInternal,
            total: totalInternal
        }
    }

    const getPerformanceColor = (percentage: number) => {
        if (percentage >= 80) return 'text-green-600'
        if (percentage >= 60) return 'text-yellow-600'
        return 'text-red-600'
    }

    const getPerformanceBg = (percentage: number) => {
        if (percentage >= 80) return 'bg-green-500'
        if (percentage >= 60) return 'bg-yellow-500'
        return 'bg-red-500'
    }

    return (
        <div className="space-y-6">
            <SectionHeader
                title="Internal Marks"
                subtitle="Your internal assessment scores (out of 30)"
            />

            {/* Summary Cards */}
            <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Average Score</span>
                        <Award className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-1">
                        {(marks.reduce((sum, m) => sum + (getInternalBreakdown(m).total || 0), 0) / marks.length).toFixed(1)}
                        <span className="text-lg text-gray-500">/30</span>
                    </div>
                    <div className="text-xs text-gray-500">
                        {((marks.reduce((sum, m) => sum + (getInternalBreakdown(m).total || 0), 0) / marks.length / 30) * 100).toFixed(1)}%
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Subjects Evaluated</span>
                        <TrendingUp className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-1">
                        {marks.filter(m => m.status === 'finalized').length}
                        <span className="text-lg text-gray-500">/{marks.length}</span>
                    </div>
                    <div className="text-xs text-gray-500">Finalized marks</div>
                </div>

                <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Highest Score</span>
                        <Award className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-1">
                        {Math.max(...marks.map(m => getInternalBreakdown(m).total || 0)).toFixed(1)}
                        <span className="text-lg text-gray-500">/30</span>
                    </div>
                    <div className="text-xs text-gray-500">
                        {((Math.max(...marks.map(m => getInternalBreakdown(m).total || 0)) / 30) * 100).toFixed(1)}%
                    </div>
                </div>
            </div>

            {/* Subject-wise Marks */}
            <div className="space-y-3">
                {marks.map((mark) => {
                    const isExpanded = expandedSubjects.includes(mark.subject)
                    const breakdown = getInternalBreakdown(mark)
                    const percentage = (breakdown.total / 30) * 100

                    return (
                        <div key={mark.subject} className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
                            {/* Subject Header */}
                            <button
                                onClick={() => toggleSubject(mark.subject)}
                                className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex items-center gap-4 flex-1">
                                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                                        <span className="text-lg font-bold text-blue-600">
                                            {breakdown.total?.toFixed(1) || '-'}
                                        </span>
                                    </div>
                                    <div className="text-left flex-1">
                                        <h3 className="font-semibold text-gray-900">{mark.subject}</h3>
                                        {mark.subjectCode && <p className="text-xs text-gray-500">{mark.subjectCode}</p>}
                                        <div className="flex items-center gap-3 mt-2">
                                            <div className="flex-1 max-w-xs">
                                                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full ${getPerformanceBg(percentage)}`}
                                                        style={{ width: `${percentage}%` }}
                                                    />
                                                </div>
                                            </div>
                                            <span className={`text-sm font-semibold ${getPerformanceColor(percentage)}`}>
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
                                <div className="border-t border-gray-100 p-5 bg-gray-50">
                                    <h4 className="text-sm font-semibold text-gray-900 mb-4">Internal Marks Breakdown (Out of 30)</h4>

                                    <div className="grid md:grid-cols-3 gap-4 mb-4">
                                        {/* Minor 1 */}
                                        <div className="bg-white rounded-lg p-4 border border-gray-200">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-xs text-gray-600">Minor 1</span>
                                                <span className="text-xs font-medium text-gray-500">10 marks</span>
                                            </div>
                                            <div className="text-2xl font-bold text-gray-900 mb-1">
                                                {breakdown.minor1?.toFixed(1) || '-'}
                                                <span className="text-sm text-gray-500">/10</span>
                                            </div>
                                            {mark.minor1 && (
                                                <p className="text-xs text-gray-500">
                                                    From exam: {mark.minor1}/20
                                                </p>
                                            )}
                                        </div>

                                        {/* Minor 2 */}
                                        <div className="bg-white rounded-lg p-4 border border-gray-200">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-xs text-gray-600">Minor 2</span>
                                                <span className="text-xs font-medium text-gray-500">10 marks</span>
                                            </div>
                                            <div className="text-2xl font-bold text-gray-900 mb-1">
                                                {breakdown.minor2?.toFixed(1) || '-'}
                                                <span className="text-sm text-gray-500">/10</span>
                                            </div>
                                            {mark.minor2 && (
                                                <p className="text-xs text-gray-500">
                                                    From exam: {mark.minor2}/20
                                                </p>
                                            )}
                                        </div>

                                        {/* Assignments */}
                                        <div className="bg-white rounded-lg p-4 border border-gray-200">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-xs text-gray-600">Assignments</span>
                                                <span className="text-xs font-medium text-gray-500">10 marks</span>
                                            </div>
                                            <div className="text-2xl font-bold text-gray-900 mb-1">
                                                {breakdown.assignment?.toFixed(1) || '-'}
                                                <span className="text-sm text-gray-500">/10</span>
                                            </div>
                                            {mark.assignment && (
                                                <p className="text-xs text-gray-500">
                                                    From total: {mark.assignment}/100
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Total */}
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-semibold text-blue-900">Total Internal Marks</span>
                                            <div className="text-right">
                                                <div className="text-2xl font-bold text-blue-900">
                                                    {breakdown.total.toFixed(1)}
                                                    <span className="text-lg text-blue-700">/30</span>
                                                </div>
                                                <div className="text-xs text-blue-700">{percentage.toFixed(1)}%</div>
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
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
                <h4 className="font-semibold text-blue-900 mb-2">Internal Marks Structure</h4>
                <div className="text-sm text-blue-800 space-y-1">
                    <p>• <strong>Minor 1:</strong> 10 marks (scaled from 20-mark exam)</p>
                    <p>• <strong>Minor 2:</strong> 10 marks (scaled from 20-mark exam)</p>
                    <p>• <strong>Assignments:</strong> 10 marks (includes assignment marks + teacher discretion)</p>
                    <p className="pt-2 border-t border-blue-200 mt-2"><strong>Total:</strong> 30 marks</p>
                </div>
            </div>
        </div>
    )
}
