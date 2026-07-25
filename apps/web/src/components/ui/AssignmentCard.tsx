'use client'

import { FileText, Download, Eye, Upload } from 'lucide-react'
import StatusBadge from './StatusBadge'

interface AssignmentCardProps {
    assignment: {
        id: string | number
        title: string
        subject: string
        subjectCode?: string
        description?: string
        dueDate: string
        status: 'pending' | 'submitted' | 'evaluated' | 'late'
        maxMarks: number
        marksObtained?: number
        submittedDate?: string
        feedback?: string
        attachments?: { name: string; url: string }[]
    }
    onSubmit?: () => void
    onView?: () => void
    onDownload?: () => void
    className?: string
}

export default function AssignmentCard({ assignment, onSubmit, onView, onDownload, className = '' }: AssignmentCardProps) {
    const getDaysUntilDue = () => {
        const due = new Date(assignment.dueDate)
        const now = new Date()
        const diffTime = due.getTime() - now.getTime()
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

        if (diffDays < 0) return { text: 'Overdue', color: 'text-red-600' }
        if (diffDays === 0) return { text: 'Due today', color: 'text-orange-600' }
        if (diffDays === 1) return { text: 'Due tomorrow', color: 'text-yellow-600' }
        return { text: `${diffDays} days left`, color: 'text-gray-600' }
    }

    const dueInfo = assignment.status === 'pending' ? getDaysUntilDue() : null

    return (
        <div className={`bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow ${className}`}>
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium text-blue-600">{assignment.subject}</span>
                        {assignment.subjectCode && (
                            <>
                                <span className="text-gray-300">•</span>
                                <span className="text-xs text-gray-500">{assignment.subjectCode}</span>
                            </>
                        )}
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-1">{assignment.title}</h4>
                    {assignment.description && (
                        <p className="text-sm text-gray-600 line-clamp-2">{assignment.description}</p>
                    )}
                </div>
                <StatusBadge status={assignment.status} />
            </div>

            {/* Marks Info */}
            <div className="flex items-center gap-4 mb-3 pb-3 border-b border-gray-100">
                <div>
                    <p className="text-xs text-gray-500">Max Marks</p>
                    <p className="text-sm font-semibold text-gray-900">{assignment.maxMarks}</p>
                </div>
                {assignment.marksObtained !== undefined && (
                    <div>
                        <p className="text-xs text-gray-500">Obtained</p>
                        <p className="text-sm font-semibold text-green-600">{assignment.marksObtained}/{assignment.maxMarks}</p>
                    </div>
                )}
                {dueInfo && (
                    <div className="ml-auto">
                        <p className={`text-sm font-medium ${dueInfo.color}`}>{dueInfo.text}</p>
                    </div>
                )}
            </div>

            {/* Date Info */}
            <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                <div>
                    <span className="font-medium">Due:</span> {new Date(assignment.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
                {assignment.submittedDate && (
                    <div>
                        <span className="font-medium">Submitted:</span> {new Date(assignment.submittedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                )}
            </div>

            {/* Feedback */}
            {assignment.feedback && (
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 mb-3">
                    <p className="text-xs font-medium text-blue-900 mb-1">Feedback</p>
                    <p className="text-sm text-blue-800">{assignment.feedback}</p>
                </div>
            )}

            {/* Attachments */}
            {assignment.attachments && assignment.attachments.length > 0 && (
                <div className="mb-3">
                    <p className="text-xs font-medium text-gray-700 mb-2">Attachments</p>
                    <div className="flex flex-wrap gap-2">
                        {assignment.attachments.map((file, idx) => (
                            <a
                                key={idx}
                                href={file.url}
                                className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded text-xs text-gray-700 transition-colors"
                                download
                            >
                                <FileText className="w-3 h-3" />
                                {file.name}
                            </a>
                        ))}
                    </div>
                </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-2">
                {assignment.status === 'pending' && onSubmit && (
                    <button
                        onClick={onSubmit}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <Upload className="w-4 h-4" />
                        Submit
                    </button>
                )}
                {onView && (
                    <button
                        onClick={onView}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        <Eye className="w-4 h-4" />
                        View
                    </button>
                )}
                {onDownload && (
                    <button
                        onClick={onDownload}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        <Download className="w-4 h-4" />
                        Download
                    </button>
                )}
            </div>
        </div>
    )
}
