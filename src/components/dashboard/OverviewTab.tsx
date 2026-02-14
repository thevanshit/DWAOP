'use client'

import { useState } from 'react'
import { Calendar, FileText, Award, CheckCircle, BookOpen, Bell, Clock, AlertCircle, Plus, Send, Target, GraduationCap, ChevronDown, ChevronUp, User, Megaphone } from 'lucide-react'
import SectionHeader from '@/components/ui/SectionHeader'
import AttendanceProgressBar from '@/components/ui/AttendanceProgressBar'
import SubjectCard from '@/components/ui/SubjectCard'
import StatusBadge from '@/components/ui/StatusBadge'

interface OverviewTabProps {
    subjects: Array<{
        id: number
        name: string
        code: string
        attendance: number
        totalClasses: number
        presentClasses: number
        assignmentCompletion: number
        readinessScore: number
        lastClass: string
        nextClass: string
    }>
    announcements: Array<{
        id: number
        title: string
        message: string
        date: string
        category: string
        priority: string
        author: string
    }>
    upcomingClasses: Array<{
        date: string
        day: string
        classes: Array<{
            time: string
            subject: string
            room: string
            faculty: string
        }>
    }>
    timetable: Array<{
        day: string
        slots: Array<{
            time: string
            subject: string
            room: string
        }>
    }>
    isCR?: boolean
}

export default function OverviewTab({ subjects, announcements, upcomingClasses, timetable, isCR = false }: OverviewTabProps) {
    const [expandedDays, setExpandedDays] = useState<string[]>(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'])
    
    const totalClasses = subjects.reduce((sum, s) => sum + s.totalClasses, 0)
    const totalPresent = subjects.reduce((sum, s) => sum + s.presentClasses, 0)
    const overallAttendance = Math.round((totalPresent / totalClasses) * 100)

    const riskSubjects = subjects.filter(s => s.attendance < 75)

    const getClassesNeeded = (present: number, total: number) => {
        const targetPercentage = 75
        const needed = Math.ceil((targetPercentage * total - present * 100) / (100 - targetPercentage))
        return Math.max(0, needed)
    }

    const getEligibilityStatus = () => {
        if (overallAttendance >= 75) return { status: 'eligible', label: 'Eligible for Exams', color: 'text-green-600', bgColor: 'bg-green-50', borderColor: 'border-green-200' }
        if (overallAttendance >= 65) return { status: 'at_risk', label: 'At Risk', color: 'text-yellow-600', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200' }
        return { status: 'not_eligible', label: 'Not Eligible', color: 'text-red-600', bgColor: 'bg-red-50', borderColor: 'border-red-200' }
    }

    const eligibility = getEligibilityStatus()
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' })

    const getCategoryColor = (category: string) => {
        const colors: Record<string, string> = {
            exam: 'bg-red-100 text-red-700',
            holiday: 'bg-green-100 text-green-700',
            academic: 'bg-blue-100 text-blue-700',
            general: 'bg-gray-100 text-gray-700'
        }
        return colors[category] || colors.general
    }

    const toggleDay = (day: string) => {
        setExpandedDays(prev => 
            prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
        )
    }

    return (
        <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <QuickStatCard
                    label="Overall Attendance"
                    value={`${overallAttendance}%`}
                    icon={<Calendar className="w-5 h-5" />}
                    color={overallAttendance >= 75 ? 'green' : overallAttendance >= 65 ? 'yellow' : 'red'}
                />
                <QuickStatCard
                    label="Subjects at Risk"
                    value={riskSubjects.length.toString()}
                    icon={<AlertCircle className="w-5 h-5" />}
                    color={riskSubjects.length === 0 ? 'green' : 'red'}
                />
                <QuickStatCard
                    label="Avg Readiness"
                    value={`${Math.round(subjects.reduce((sum, s) => sum + s.readinessScore, 0) / subjects.length)}%`}
                    icon={<Target className="w-5 h-5" />}
                    color="blue"
                />
                <QuickStatCard
                    label="Eligibility"
                    value={eligibility.label.split(' ')[0]}
                    icon={<GraduationCap className="w-5 h-5" />}
                    color={overallAttendance >= 75 ? 'green' : overallAttendance >= 65 ? 'yellow' : 'red'}
                />
            </div>

            {/* Attendance Overview Card */}
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow">
                <SectionHeader title="Attendance Overview" subtitle="Track your attendance and eligibility status" />

                <div className="grid lg:grid-cols-3 gap-6 mt-4">
                    <div className={`${eligibility.bgColor} rounded-xl p-5 border ${eligibility.borderColor}`}>
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-medium text-gray-600">Overall Attendance</span>
                            <StatusBadge status={eligibility.status} />
                        </div>
                        <div className={`text-5xl font-bold ${eligibility.color} mb-2`}>{overallAttendance}%</div>
                        <p className="text-sm text-gray-600">{totalPresent} out of {totalClasses} classes attended</p>
                    </div>

                    <div className="lg:col-span-2">
                        <h4 className="text-sm font-semibold text-gray-900 mb-3">Subjects Below 75%</h4>
                        {riskSubjects.length === 0 ? (
                            <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl border border-green-100">
                                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-green-600">
                                    <CheckCircle className="w-5 h-5" />
                                </div>
                                <p className="text-sm text-green-700 font-medium">Great! All subjects have attendance above 75%</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {riskSubjects.map(subject => {
                                    const needed = getClassesNeeded(subject.presentClasses, subject.totalClasses)
                                    return (
                                        <div key={subject.id} className="p-4 bg-red-50 rounded-xl border border-red-100">
                                            <div className="flex items-center justify-between mb-2">
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-900">{subject.name}</p>
                                                    <p className="text-xs text-gray-500">{subject.code}</p>
                                                </div>
                                                <span className="text-lg font-bold text-red-600">{subject.attendance}%</span>
                                            </div>
                                            <AttendanceProgressBar
                                                percentage={subject.attendance}
                                                total={subject.totalClasses}
                                                present={subject.presentClasses}
                                                size="sm"
                                            />
                                            <p className="text-xs text-red-700 mt-2 font-medium">
                                                Attend <span className="font-bold">{needed} more consecutive classes</span> to reach 75%
                                            </p>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Timetable Section - Full Week View */}
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <div>
                        <h3 className="font-semibold text-gray-900">Weekly Timetable</h3>
                        <p className="text-sm text-gray-500">Your complete class schedule</p>
                    </div>
                </div>
                <div className="divide-y divide-gray-100">
                    {timetable.map((day) => (
                        <div key={day.day}>
                            <button 
                                onClick={() => toggleDay(day.day)}
                                className="w-full px-6 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${day.day === today ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}>
                                        <Calendar className="w-5 h-5" />
                                    </div>
                                    <div className="text-left">
                                        <p className={`text-sm font-semibold ${day.day === today ? 'text-blue-600' : 'text-gray-900'}`}>
                                            {day.day} {day.day === today && <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full ml-2">Today</span>}
                                        </p>
                                        <p className="text-xs text-gray-500">{day.slots.length} classes</p>
                                    </div>
                                </div>
                                {expandedDays.includes(day.day) ? (
                                    <ChevronUp className="w-5 h-5 text-gray-400" />
                                ) : (
                                    <ChevronDown className="w-5 h-5 text-gray-400" />
                                )}
                            </button>
                            {expandedDays.includes(day.day) && (
                                <div className="px-6 pb-4 bg-gray-50/50">
                                    {day.slots.length > 0 ? (
                                        <div className="grid gap-2">
                                            {day.slots.map((slot, idx) => (
                                                <div key={idx} className="flex items-center gap-4 p-3 bg-white rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
                                                    <div className="w-20 shrink-0">
                                                        <p className="text-sm font-semibold text-gray-900">{slot.time.split('-')[0]}</p>
                                                        <p className="text-xs text-gray-500">{slot.time.split('-')[1]}</p>
                                                    </div>
                                                    <div className="flex-1 border-l border-gray-200 pl-4">
                                                        <p className="text-sm font-medium text-gray-900">{slot.subject}</p>
                                                        <p className="text-xs text-gray-500">Room: {slot.room}</p>
                                                    </div>
                                                    <Clock className="w-4 h-4 text-gray-400" />
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-500 text-center py-4">No classes scheduled</p>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Announcements - Role Based */}
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600">
                            <Megaphone className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900">
                                {isCR ? 'Class Announcements' : 'Announcements'}
                            </h3>
                            <p className="text-sm text-gray-500">
                                {isCR ? 'Create and forward announcements to your class' : 'Stay updated with latest notices'}
                            </p>
                        </div>
                    </div>
                    {isCR && (
                        <button className="flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] text-white text-sm font-medium rounded-xl hover:bg-[var(--color-primary-dark)] transition-colors">
                            <Plus className="w-4 h-4" />
                            Create
                        </button>
                    )}
                </div>
                <div className="divide-y divide-gray-100 max-h-80 overflow-y-auto">
                    {announcements.slice(0, 5).map((ann) => (
                        <div key={ann.id} className="p-5 hover:bg-gray-50 transition-colors cursor-pointer">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <p className="text-sm font-semibold text-gray-900">{ann.title}</p>
                                        {ann.priority === 'high' && (
                                            <span className="w-2 h-2 bg-red-500 rounded-full" />
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">{ann.message}</p>
                                    <div className="flex items-center gap-3">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getCategoryColor(ann.category)}`}>
                                            {ann.category}
                                        </span>
                                        <span className="text-xs text-gray-400">By {ann.author}</span>
                                        <span className="text-xs text-gray-400">{ann.date}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                {isCR && (
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                        <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-xl transition-colors">
                            <Send className="w-4 h-4" />
                            Forward to Students
                        </button>
                    </div>
                )}
            </div>

            {/* Subject-wise Readiness */}
            <div>
                <SectionHeader
                    title="Subject-wise Readiness"
                    subtitle="Your performance across all subjects"
                />
                <div className="grid md:grid-cols-2 gap-4 mt-4">
                    {subjects.map(subject => (
                        <SubjectCard key={subject.id} subject={subject} />
                    ))}
                </div>
            </div>

            {/* Upcoming Classes */}
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="px-6 py-4 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-900">Upcoming Classes</h3>
                    <p className="text-sm text-gray-500">Next 3 days schedule</p>
                </div>
                <div className="divide-y divide-gray-100">
                    {upcomingClasses.slice(0, 3).map((day, idx) => (
                        <div key={idx} className="p-5">
                            <div className="flex items-center gap-2 mb-3">
                                <span className={`text-sm font-semibold ${day.day === 'Today' ? 'text-blue-600' : 'text-gray-900'}`}>
                                    {day.day}
                                </span>
                                <span className="text-xs text-gray-400">{day.date}</span>
                            </div>
                            <div className="grid md:grid-cols-2 gap-2">
                                {day.classes.map((cls, clsIdx) => (
                                    <div key={clsIdx} className={`p-3 rounded-lg border ${day.day === 'Today' ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-100'}`}>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">{cls.subject}</p>
                                                <p className="text-xs text-gray-500 mt-0.5">{cls.faculty} • {cls.room}</p>
                                            </div>
                                            <span className="text-xs font-medium text-gray-600 bg-white px-2 py-1 rounded">{cls.time}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

function QuickStatCard({ label, value, icon, color = 'blue' }: { label: string; value: string; icon: React.ReactNode; color?: 'blue' | 'green' | 'yellow' | 'red' }) {
    const colorStyles = {
        blue: 'bg-blue-50 text-blue-600',
        green: 'bg-green-50 text-green-600',
        yellow: 'bg-yellow-50 text-yellow-600',
        red: 'bg-red-50 text-red-600'
    }

    return (
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-500 font-medium">{label}</span>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${colorStyles[color]}`}>
                    {icon}
                </div>
            </div>
            <span className="text-2xl font-bold text-gray-900">{value}</span>
        </div>
    )
}
