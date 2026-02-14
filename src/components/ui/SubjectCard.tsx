'use client'

import { BookOpen } from 'lucide-react'
import AttendanceProgressBar from './AttendanceProgressBar'
import StatusBadge from './StatusBadge'

interface SubjectCardProps {
    subject: {
        id: string | number
        name: string
        code: string
        attendance: number
        totalClasses: number
        presentClasses: number
        assignmentCompletion?: number
        lastClass?: string
        nextClass?: string
        readinessScore?: number
    }
    onClick?: () => void
    className?: string
}

export default function SubjectCard({ subject, onClick, className = '' }: SubjectCardProps) {
    const getEligibilityStatus = (attendance: number) => {
        if (attendance >= 75) return 'eligible'
        if (attendance >= 65) return 'at_risk'
        return 'not_eligible'
    }

    const eligibilityStatus = getEligibilityStatus(subject.attendance)

    return (
        <div
            className={`bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all ${onClick ? 'cursor-pointer' : ''
                } ${className}`}
            onClick={onClick}
        >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
                        <BookOpen className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-900">{subject.name}</h4>
                        <p className="text-xs text-gray-500">{subject.code}</p>
                    </div>
                </div>
                <StatusBadge status={eligibilityStatus} />
            </div>

            {/* Attendance Progress */}
            <div className="mb-4">
                <AttendanceProgressBar
                    percentage={subject.attendance}
                    total={subject.totalClasses}
                    present={subject.presentClasses}
                />
            </div>

            {/* Additional Info */}
            {(subject.assignmentCompletion !== undefined || subject.readinessScore !== undefined) && (
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-100">
                    {subject.assignmentCompletion !== undefined && (
                        <div>
                            <p className="text-xs text-gray-500 mb-1">Assignments</p>
                            <p className="text-sm font-semibold text-gray-900">{subject.assignmentCompletion}%</p>
                        </div>
                    )}
                    {subject.readinessScore !== undefined && (
                        <div>
                            <p className="text-xs text-gray-500 mb-1">Readiness</p>
                            <p className="text-sm font-semibold text-gray-900">{subject.readinessScore}%</p>
                        </div>
                    )}
                </div>
            )}

            {/* Class Schedule */}
            {(subject.lastClass || subject.nextClass) && (
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-100 mt-3">
                    {subject.lastClass && (
                        <div>
                            <p className="text-xs text-gray-500 mb-0.5">Last Class</p>
                            <p className="text-xs font-medium text-gray-700">{subject.lastClass}</p>
                        </div>
                    )}
                    {subject.nextClass && (
                        <div>
                            <p className="text-xs text-gray-500 mb-0.5">Next Class</p>
                            <p className="text-xs font-medium text-gray-700">{subject.nextClass}</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
