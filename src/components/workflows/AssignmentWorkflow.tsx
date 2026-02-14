'use client'

import { useState } from 'react'
import { Assignment, UserRole } from '@/types'
import { getNextPossibleStatuses, getStatusColor, canTransition } from '@/lib/workflow-engine'
import {
    FileText,
    Calendar,
    Clock,
    CheckCircle2,
    AlertCircle,
    ArrowRight,
    ChevronDown,
    Upload,
    MessageSquare,
    BarChart,
    History,
    AlertTriangle
} from 'lucide-react'

interface AssignmentWorkflowProps {
    assignment: Assignment
    userRole: UserRole
    onTransition: (newStatus: Assignment['status']) => void
}

export default function AssignmentWorkflow({ assignment, userRole, onTransition }: AssignmentWorkflowProps) {
    const [isExpanded, setIsExpanded] = useState(true)
    const nextStatuses = getNextPossibleStatuses('assignment', assignment.status, userRole)

    const handleStatusChange = (status: Assignment['status']) => {
        onTransition(status)
    }

    const isLate = assignment.deadline && new Date() > new Date(assignment.deadline)

    return (
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-blue-900/[0.02] overflow-hidden transition-all hover:shadow-blue-900/[0.04]">
            {/* Header */}
            <div className="p-6 flex items-center justify-between border-b border-gray-50 bg-gray-50/30">
                <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-inner">
                        <FileText className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 leading-tight">{assignment.title}</h3>
                        <div className="flex items-center space-x-3 mt-1">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusColor(assignment.status)}`}>
                                {assignment.status.replace('_', ' ')}
                            </span>
                            <span className="text-[11px] text-gray-400 font-bold flex items-center">
                                <Calendar className="w-3 h-3 mr-1" />
                                {new Date(assignment.deadline).toLocaleDateString()}
                            </span>
                            {isLate && !assignment.submitted && (
                                <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest flex items-center">
                                    <AlertTriangle className="w-3 h-3 mr-1" /> Overdue
                                </span>
                            )}
                        </div>
                    </div>
                </div>
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className={`p-2 hover:bg-white rounded-xl transition-all ${isExpanded ? 'rotate-180' : ''}`}
                >
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                </button>
            </div>

            {isExpanded && (
                <div className="p-6 animate-fade-in">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                        <MiniStat label="Max Marks" value={assignment.maxMarks.toString()} />
                        <MiniStat label="Your Grade" value={assignment.marks?.toString() || '--'} color={assignment.marks ? 'text-blue-600' : 'text-gray-300'} />
                        <MiniStat label="Status" value={assignment.submitted ? 'Submitted' : 'Pending'} color={assignment.submitted ? 'text-green-600' : 'text-red-500'} />
                        <MiniStat label="Weight" value="20%" />
                    </div>

                    <div className="space-y-6">
                        {/* Timeline */}
                        <div className="flex items-start space-x-4">
                            <div className="flex flex-col items-center space-y-1">
                                <div className={`w-3 h-3 rounded-full ${assignment.status === 'created' ? 'bg-blue-600 ring-4 ring-blue-100' : 'bg-gray-200'}`}></div>
                                <div className="w-0.5 h-12 bg-gray-100"></div>
                                <div className={`w-3 h-3 rounded-full ${assignment.status === 'in_progress' ? 'bg-blue-600 ring-4 ring-blue-100' : 'bg-gray-200'}`}></div>
                                <div className="w-0.5 h-12 bg-gray-100"></div>
                                <div className={`w-3 h-3 rounded-full ${['under_review', 'done'].includes(assignment.status) ? 'bg-blue-600 ring-4 ring-blue-100' : 'bg-gray-200'}`}></div>
                            </div>
                            <div className="flex-1 space-y-7 pt-[-4px]">
                                <TimelineItem title="Assigned by Faculty" time="Feb 10, 2026" active={['created', 'in_progress', 'under_review', 'done'].includes(assignment.status)} />
                                <TimelineItem title="In Progress" time="Due: Feb 20" active={['in_progress', 'under_review', 'done'].includes(assignment.status)} />
                                <TimelineItem title="Evaluated & Returned" time="Awaiting" active={['done'].includes(assignment.status)} />
                            </div>
                        </div>

                        {/* Action Bar */}
                        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center border border-gray-100 shadow-sm">
                                        <Upload className="w-5 h-5 text-gray-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-900">Submission Hub</p>
                                        <p className="text-xs text-gray-500 font-medium">Upload PDF/DOCX (Max 10MB)</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3">
                                    <button className="btn-secondary py-2 text-sm flex items-center space-x-2">
                                        <MessageSquare className="w-4 h-4" />
                                        <span>Clarification</span>
                                    </button>
                                    {nextStatuses.map(status => (
                                        <button
                                            key={status}
                                            onClick={() => handleStatusChange(status)}
                                            className="btn-primary py-2 text-sm flex items-center space-x-2"
                                        >
                                            <span>
                                                {status === 'under_review' && 'Submit Assignment'}
                                                {status === 'done' && 'Mark Evaluated'}
                                                {status !== 'under_review' && status !== 'done' && `Move to ${status}`}
                                            </span>
                                            <ArrowRight className="w-4 h-4" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Footer Info */}
                        <div className="flex items-center justify-between pt-4 border-t border-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                            <div className="flex items-center space-x-6">
                                <span className="flex items-center"><BarChart className="w-3 h-3 mr-1.5 text-blue-500" /> Rubric Attached</span>
                                <span className="flex items-center"><History className="w-3 h-3 mr-1.5 text-blue-500" /> 2 Versions Tracked</span>
                            </div>
                            <div className="flex items-center text-blue-600 hover:text-blue-700 cursor-pointer">
                                View Full Audit Trail <ChevronDown className="w-3 h-3 ml-1 -rotate-90" />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

function MiniStat({ label, value, color = "text-gray-900" }: { label: string, value: string, color?: string }) {
    return (
        <div className="px-5 py-3 bg-gray-50/50 rounded-xl border border-gray-100 text-center">
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.1em] mb-1">{label}</p>
            <p className={`text-base font-black ${color}`}>{value}</p>
        </div>
    )
}

function TimelineItem({ title, time, active }: { title: string, time: string, active: boolean }) {
    return (
        <div className={`transition-all duration-300 ${active ? 'opacity-100' : 'opacity-30'}`}>
            <h4 className="text-sm font-bold text-gray-900 leading-none mb-1">{title}</h4>
            <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wider">{time}</p>
        </div>
    )
}
