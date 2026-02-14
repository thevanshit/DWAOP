'use client'

import { Calendar, TrendingDown, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react'
import SectionHeader from '@/components/ui/SectionHeader'
import AttendanceProgressBar from '@/components/ui/AttendanceProgressBar'
import StatusBadge from '@/components/ui/StatusBadge'

interface AttendanceTabProps {
    subjects: Array<{
        id: number
        name: string
        code: string
        attendance: number
        totalClasses: number
        presentClasses: number
    }>
    attendanceData: Array<{
        date: string
        day: string
        status: 'present' | 'absent'
        time: string
    }>
}

export default function AttendanceTab({ subjects, attendanceData }: AttendanceTabProps) {
    // Calculate weekly attendance
    const getWeeklyData = () => {
        const weeks = []
        for (let i = 0; i < 12; i++) {
            const weekAttendance = 70 + Math.random() * 25
            weeks.push({
                week: `Week ${i + 1}`,
                attendance: Math.round(weekAttendance)
            })
        }
        return weeks
    }

    const weeklyData = getWeeklyData()

    // Get calendar data for current month
    const getCalendarData = () => {
        const days = []
        for (let i = 1; i <= 28; i++) {
            const status = Math.random() > 0.25 ? 'present' : Math.random() > 0.5 ? 'absent' : 'holiday'
            days.push({ day: i, status })
        }
        return days
    }

    const calendarData = getCalendarData()

    // Risk analysis
    const riskSubjects = subjects.filter(s => s.attendance < 75)
    const overallAttendance = Math.round(
        (subjects.reduce((sum, s) => sum + s.presentClasses, 0) /
            subjects.reduce((sum, s) => sum + s.totalClasses, 0)) *
        100
    )

    return (
        <div className="space-y-6">
            <SectionHeader title="Attendance Tracking" subtitle="Monitor your class attendance and eligibility" />

            {/* Weekly Breakdown Chart */}
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-4">Weekly Attendance Trend</h3>
                <div className="flex items-end justify-between gap-2 h-48">
                    {weeklyData.map((week, idx) => (
                        <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                            <div className="w-full bg-gray-100 rounded-t relative" style={{ height: '100%' }}>
                                <div
                                    className={`absolute bottom-0 w-full rounded-t transition-all ${week.attendance >= 75
                                            ? 'bg-green-500'
                                            : week.attendance >= 65
                                                ? 'bg-yellow-500'
                                                : 'bg-red-500'
                                        }`}
                                    style={{ height: `${week.attendance}%` }}
                                >
                                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-medium text-gray-700">
                                        {week.attendance}%
                                    </span>
                                </div>
                            </div>
                            <span className="text-xs text-gray-500">{week.week.replace('Week ', 'W')}</span>
                        </div>
                    ))}
                </div>
                <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded" />
                        <span className="text-xs text-gray-600">≥75% (Eligible)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-yellow-500 rounded" />
                        <span className="text-xs text-gray-600">65-74% (At Risk)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded" />
                        <span className="text-xs text-gray-600">&lt;65% (Not Eligible)</span>
                    </div>
                </div>
            </div>

            {/* Subject-wise Attendance Table */}
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-900">Subject-wise Breakdown</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subject</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Present</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Total</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Percentage</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {subjects.map((subject) => (
                                <tr key={subject.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{subject.name}</p>
                                            <p className="text-xs text-gray-500">{subject.code}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center text-sm text-gray-900">{subject.presentClasses}</td>
                                    <td className="px-6 py-4 text-center text-sm text-gray-900">{subject.totalClasses}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col items-center gap-2">
                                            <span className={`text-sm font-semibold ${subject.attendance >= 75 ? 'text-green-600' : subject.attendance >= 65 ? 'text-yellow-600' : 'text-red-600'
                                                }`}>
                                                {subject.attendance}%
                                            </span>
                                            <AttendanceProgressBar
                                                percentage={subject.attendance}
                                                total={subject.totalClasses}
                                                present={subject.presentClasses}
                                                showDetails={false}
                                                size="sm"
                                                className="w-24"
                                            />
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <StatusBadge status={subject.attendance >= 75 ? 'eligible' : subject.attendance >= 65 ? 'at_risk' : 'not_eligible'} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Calendar View */}
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-4">Monthly Calendar</h3>
                <div className="grid grid-cols-7 gap-2">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                        <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
                            {day}
                        </div>
                    ))}
                    {calendarData.map((day) => (
                        <div
                            key={day.day}
                            className={`aspect-square rounded-lg flex items-center justify-center text-sm font-medium ${day.status === 'present'
                                    ? 'bg-green-100 text-green-700'
                                    : day.status === 'absent'
                                        ? 'bg-red-100 text-red-700'
                                        : 'bg-gray-100 text-gray-400'
                                }`}
                        >
                            {day.day}
                        </div>
                    ))}
                </div>
                <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-100 rounded" />
                        <span className="text-xs text-gray-600">Present</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-100 rounded" />
                        <span className="text-xs text-gray-600">Absent</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-gray-100 rounded" />
                        <span className="text-xs text-gray-600">Holiday</span>
                    </div>
                </div>
            </div>

            {/* Risk Analysis */}
            {riskSubjects.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
                        <div className="flex-1">
                            <h3 className="font-semibold text-red-900 mb-2">Attendance Risk Alert</h3>
                            <p className="text-sm text-red-700 mb-4">
                                You have {riskSubjects.length} subject{riskSubjects.length > 1 ? 's' : ''} with attendance below 75%.
                                Immediate action required to maintain eligibility.
                            </p>
                            <div className="space-y-2">
                                {riskSubjects.map((subject) => {
                                    const needed = Math.ceil((75 * subject.totalClasses - subject.presentClasses * 100) / 25)
                                    return (
                                        <div key={subject.id} className="bg-white rounded-lg p-3 border border-red-200">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-medium text-gray-900">{subject.name}</span>
                                                <span className="text-sm font-bold text-red-600">{subject.attendance}%</span>
                                            </div>
                                            <p className="text-xs text-red-700 mt-1">
                                                Attend <span className="font-bold">{Math.max(0, needed)} more consecutive classes</span> to reach 75%
                                            </p>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
