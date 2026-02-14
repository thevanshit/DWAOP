'use client'

import { useState } from 'react'
import { Search, Filter, ChevronDown, ChevronUp } from 'lucide-react'
import AssignmentCard from '@/components/ui/AssignmentCard'
import SectionHeader from '@/components/ui/SectionHeader'
import StatusBadge from '@/components/ui/StatusBadge'

interface Assignment {
    id: number
    subject: string
    subjectCode?: string
    title: string
    description?: string
    dueDate: string
    status: 'pending' | 'submitted' | 'evaluated' | 'late'
    maxMarks: number
    marksObtained?: number
    submittedDate?: string
    feedback?: string
    attachments?: { name: string; url: string }[]
}

interface AssignmentsTabProps {
    assignments: Assignment[]
}

export default function AssignmentsTab({ assignments }: AssignmentsTabProps) {
    const [activeFilter, setActiveFilter] = useState<string>('all')
    const [searchQuery, setSearchQuery] = useState('')
    const [expandedSubjects, setExpandedSubjects] = useState<string[]>([])

    // Group assignments by subject
    const groupedAssignments = assignments.reduce((acc, assignment) => {
        if (!acc[assignment.subject]) {
            acc[assignment.subject] = []
        }
        acc[assignment.subject].push(assignment)
        return acc
    }, {} as Record<string, Assignment[]>)

    // Filter assignments
    const filteredAssignments = assignments.filter(assignment => {
        const matchesFilter = activeFilter === 'all' || assignment.status === activeFilter
        const matchesSearch = assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            assignment.subject.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesFilter && matchesSearch
    })

    // Group filtered assignments
    const filteredGrouped = filteredAssignments.reduce((acc, assignment) => {
        if (!acc[assignment.subject]) {
            acc[assignment.subject] = []
        }
        acc[assignment.subject].push(assignment)
        return acc
    }, {} as Record<string, Assignment[]>)

    // Calculate stats
    const stats = {
        all: assignments.length,
        pending: assignments.filter(a => a.status === 'pending').length,
        submitted: assignments.filter(a => a.status === 'submitted').length,
        evaluated: assignments.filter(a => a.status === 'evaluated').length,
        late: assignments.filter(a => a.status === 'late').length,
    }

    const toggleSubject = (subject: string) => {
        setExpandedSubjects(prev =>
            prev.includes(subject)
                ? prev.filter(s => s !== subject)
                : [...prev, subject]
        )
    }

    return (
        <div className="space-y-6">
            {/* Header with Stats */}
            <div>
                <SectionHeader
                    title="Assignments"
                    subtitle={`${filteredAssignments.length} assignment${filteredAssignments.length !== 1 ? 's' : ''}`}
                />

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-4">
                    <StatCard label="All" count={stats.all} active={activeFilter === 'all'} onClick={() => setActiveFilter('all')} />
                    <StatCard label="Pending" count={stats.pending} active={activeFilter === 'pending'} onClick={() => setActiveFilter('pending')} color="yellow" />
                    <StatCard label="Submitted" count={stats.submitted} active={activeFilter === 'submitted'} onClick={() => setActiveFilter('submitted')} color="blue" />
                    <StatCard label="Evaluated" count={stats.evaluated} active={activeFilter === 'evaluated'} onClick={() => setActiveFilter('evaluated')} color="green" />
                    <StatCard label="Late" count={stats.late} active={activeFilter === 'late'} onClick={() => setActiveFilter('late')} color="red" />
                </div>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search assignments..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                    <Filter className="w-4 h-4" />
                    Sort by Due Date
                </button>
            </div>

            {/* Subject-wise Assignments */}
            {Object.keys(filteredGrouped).length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
                    <p className="text-gray-500">No assignments found</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {Object.entries(filteredGrouped).map(([subject, subjectAssignments]) => {
                        const isExpanded = expandedSubjects.includes(subject)
                        const subjectCode = subjectAssignments[0]?.subjectCode || ''

                        return (
                            <div key={subject} className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
                                {/* Subject Header */}
                                <button
                                    onClick={() => toggleSubject(subject)}
                                    className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                                            <span className="text-sm font-bold text-blue-600">{subjectAssignments.length}</span>
                                        </div>
                                        <div className="text-left">
                                            <h3 className="font-semibold text-gray-900">{subject}</h3>
                                            {subjectCode && <p className="text-xs text-gray-500">{subjectCode}</p>}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-2">
                                            {subjectAssignments.filter(a => a.status === 'pending').length > 0 && (
                                                <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">
                                                    {subjectAssignments.filter(a => a.status === 'pending').length} pending
                                                </span>
                                            )}
                                            {subjectAssignments.filter(a => a.status === 'late').length > 0 && (
                                                <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                                                    {subjectAssignments.filter(a => a.status === 'late').length} late
                                                </span>
                                            )}
                                        </div>
                                        {isExpanded ? (
                                            <ChevronUp className="w-5 h-5 text-gray-400" />
                                        ) : (
                                            <ChevronDown className="w-5 h-5 text-gray-400" />
                                        )}
                                    </div>
                                </button>

                                {/* Assignments List */}
                                {isExpanded && (
                                    <div className="border-t border-gray-100 p-4 bg-gray-50">
                                        <div className="grid gap-4">
                                            {subjectAssignments.map(assignment => (
                                                <AssignmentCard
                                                    key={assignment.id}
                                                    assignment={assignment}
                                                    onSubmit={() => console.log('Submit', assignment.id)}
                                                    onView={() => console.log('View', assignment.id)}
                                                    onDownload={() => console.log('Download', assignment.id)}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

function StatCard({ label, count, active, onClick, color = 'gray' }: {
    label: string
    count: number
    active: boolean
    onClick: () => void
    color?: 'gray' | 'yellow' | 'blue' | 'green' | 'red'
}) {
    const colors = {
        gray: active ? 'bg-gray-100 border-gray-300' : 'bg-white border-gray-200',
        yellow: active ? 'bg-yellow-50 border-yellow-300' : 'bg-white border-gray-200',
        blue: active ? 'bg-blue-50 border-blue-300' : 'bg-white border-gray-200',
        green: active ? 'bg-green-50 border-green-300' : 'bg-white border-gray-200',
        red: active ? 'bg-red-50 border-red-300' : 'bg-white border-gray-200',
    }

    return (
        <button
            onClick={onClick}
            className={`p-3 border rounded-lg transition-all hover:shadow-sm ${colors[color]}`}
        >
            <p className="text-xs text-gray-600 mb-1">{label}</p>
            <p className="text-2xl font-bold text-gray-900">{count}</p>
        </button>
    )
}
