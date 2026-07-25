'use client'

import { useState } from 'react'
import { AttendanceSession, UserRole } from '@/types'
import { getNextPossibleStatuses, getStatusColor, canTransition } from '@/lib/workflow-engine'
import {
    Users,
    Calendar,
    Clock,
    CheckCircle2,
    AlertCircle,
    Lock,
    ArrowRight,
    ChevronDown,
    History,
    MapPin
} from 'lucide-react'

interface AttendanceWorkflowProps {
    session: AttendanceSession
    userRole: UserRole
    onTransition: (newStatus: AttendanceSession['status']) => void
}

export default function AttendanceWorkflow({ session, userRole, onTransition }: AttendanceWorkflowProps) {
    const [isExpanded, setIsExpanded] = useState(true)
    const nextStatuses = getNextPossibleStatuses('attendance', session.status, userRole)

    const handleStatusChange = (status: AttendanceSession['status']) => {
        if (canTransition('attendance', session.status, status, userRole)) {
            onTransition(status)
        }
    }

    return (
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-blue-900/[0.02] overflow-hidden transition-all hover:shadow-blue-900/[0.04]">
            {/* Header */}
            <div className="p-6 flex items-center justify-between border-b border-gray-50 bg-gray-50/30">
                <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 shadow-inner">
                        <Users className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 leading-tight">{session.subject}</h3>
                        <div className="flex items-center space-x-3 mt-1">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusColor(session.status)}`}>
                                {session.status.replace('_', ' ')}
                            </span>
                            <span className="text-[11px] text-gray-400 font-bold flex items-center">
                                <Calendar className="w-3 h-3 mr-1" />
                                {new Date(session.date).toLocaleDateString()}
                            </span>
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
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <StatBox label="Enrollment" value={session.totalStudents.toString()} icon={<Users className="w-4 h-4" />} />
                        <StatBox label="Present" value={session.presentStudents.toString()} icon={<CheckCircle2 className="w-4 h-4" />} color="text-green-600" />
                        <StatBox label="Absence" value={session.absentStudents.toString()} icon={<AlertCircle className="w-4 h-4" />} color="text-red-600" />
                    </div>

                    <div className="space-y-6">
                        {/* Workflow Status Steps */}
                        <div className="relative">
                            <div className="absolute top-5 left-5 right-5 h-0.5 bg-gray-100 -z-10"></div>
                            <div className="flex justify-between">
                                <StatusStep label="Created" icon={<Clock className="w-4 h-4" />} active={['created', 'in_progress', 'finalised', 'locked'].includes(session.status)} />
                                <StatusStep label="Active" icon={<ArrowRight className="w-4 h-4" />} active={['in_progress', 'finalised', 'locked'].includes(session.status)} />
                                <StatusStep label="Verified" icon={<CheckCircle2 className="w-4 h-4" />} active={['finalised', 'locked'].includes(session.status)} />
                                <StatusStep label="Closed" icon={<Lock className="w-4 h-4" />} active={session.status === 'locked'} />
                            </div>
                        </div>

                        {/* Action Bar */}
                        <div className="bg-blue-50/50 rounded-2xl p-5 border border-blue-100/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="flex items-center space-x-3">
                                <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></div>
                                <p className="text-sm font-bold text-blue-900">
                                    {session.status === 'created' && "Ready to start session"}
                                    {session.status === 'in_progress' && "Session is active and marking is open"}
                                    {session.status === 'finalised' && "Attendance verified. Awaiting audit lock."}
                                    {session.status === 'locked' && "Workflow complete and record immutable."}
                                </p>
                            </div>

                            <div className="flex items-center space-x-2">
                                {nextStatuses.map(status => (
                                    <button
                                        key={status}
                                        onClick={() => handleStatusChange(status)}
                                        className="btn-primary flex items-center space-x-2 py-2 text-sm"
                                    >
                                        <span>Move to {status.replace('_', ' ')}</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Audit/Info Bar */}
                        <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                            <div className="flex items-center space-x-4 text-xs font-bold text-gray-400">
                                <span className="flex items-center"><MapPin className="w-3 h-3 mr-1" /> Lecture Hall 302</span>
                                <span className="flex items-center"><History className="w-3 h-3 mr-1" /> Last update: Just now</span>
                            </div>
                            {session.status === 'locked' && (
                                <div className="flex items-center text-xs font-bold text-green-600">
                                    <Lock className="w-3 h-3 mr-1" />
                                    Audited & Sealed
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

function StatBox({ label, value, icon, color = "text-blue-600" }: { label: string, value: string, icon: React.ReactNode, color?: string }) {
    return (
        <div className="bg-gray-50/50 rounded-2xl p-4 border border-gray-100 flex items-center justify-between">
            <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{label}</p>
                <p className={`text-2xl font-black ${color}`}>{value}</p>
            </div>
            <div className={`w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center ${color}`}>
                {icon}
            </div>
        </div>
    )
}

function StatusStep({ label, icon, active }: { label: string, icon: React.ReactNode, active: boolean }) {
    return (
        <div className="flex flex-col items-center space-y-2">
            <div className={`
         w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500
         ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-gray-100 text-gray-400'}
       `}>
                {icon}
            </div>
            <span className={`text-[10px] font-bold uppercase tracking-wider ${active ? 'text-blue-600' : 'text-gray-400'}`}>
                {label}
            </span>
        </div>
    )
}
