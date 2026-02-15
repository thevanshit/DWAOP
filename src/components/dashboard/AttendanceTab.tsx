'use client'

import { useState } from 'react'
import { Calendar, TrendingDown, TrendingUp, AlertCircle, CheckCircle, Clock, BookOpen, MapPin, ChevronRight, X } from 'lucide-react'
import AttendanceProgressBar from '@/components/ui/AttendanceProgressBar'
import StatusBadge from '@/components/ui/StatusBadge'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Area, AreaChart, BarChart, Bar } from 'recharts'

interface Subject {
    id: number
    name: string
    code: string
    attendance: number
    totalClasses: number
    presentClasses: number
}

interface AttendanceRecord {
    date: string
    day: string
    status: 'present' | 'absent'
    time: string
    subject?: string
}

interface AttendanceTabProps {
    subjects: Subject[]
    attendanceData: AttendanceRecord[]
}

const WEEKLY_DATA = [
    { week: 'Week 1', total: 18, attended: 17, percentage: 94 },
    { week: 'Week 2', total: 20, attended: 18, percentage: 90 },
    { week: 'Week 3', total: 22, attended: 19, percentage: 86 },
    { week: 'Week 4', total: 18, attended: 15, percentage: 83 },
    { week: 'Week 5', total: 20, attended: 17, percentage: 85 },
    { week: 'Week 6', total: 22, attended: 20, percentage: 91 },
    { week: 'Week 7', total: 18, attended: 16, percentage: 89 },
    { week: 'Week 8', total: 20, attended: 18, percentage: 90 },
]

const SUBJECT_WEEKLY_DATA: Record<number, Array<{ week: string; day: string; date: string; status: 'present' | 'absent'; time: string }[]>> = {
    1: [
        [{ week: 'Week 1', day: 'Mon', date: '2026-01-06', status: 'present', time: '09:00' }, { week: 'Week 1', day: 'Mon', date: '2026-01-06', status: 'present', time: '10:00' }, { week: 'Week 1', day: 'Tue', date: '2026-01-07', status: 'present', time: '09:00' }, { week: 'Week 1', day: 'Wed', date: '2026-01-08', status: 'present', time: '10:00' }, { week: 'Week 1', day: 'Thu', date: '2026-01-09', status: 'absent', time: '09:00' }, { week: 'Week 1', day: 'Fri', date: '2026-01-10', status: 'present', time: '10:00' }],
        [{ week: 'Week 2', day: 'Mon', date: '2026-01-13', status: 'present', time: '09:00' }, { week: 'Week 2', day: 'Mon', date: '2026-01-13', status: 'present', time: '10:00' }, { week: 'Week 2', day: 'Tue', date: '2026-01-14', status: 'present', time: '09:00' }, { week: 'Week 2', day: 'Wed', date: '2026-01-15', status: 'present', time: '10:00' }, { week: 'Week 2', day: 'Thu', date: '2026-01-16', status: 'absent', time: '09:00' }, { week: 'Week 2', day: 'Fri', date: '2026-01-17', status: 'present', time: '10:00' }],
        [{ week: 'Week 3', day: 'Mon', date: '2026-01-20', status: 'present', time: '09:00' }, { week: 'Week 3', day: 'Mon', date: '2026-01-20', status: 'present', time: '10:00' }, { week: 'Week 3', day: 'Tue', date: '2026-01-21', status: 'present', time: '09:00' }, { week: 'Week 3', day: 'Wed', date: '2026-01-22', status: 'absent', time: '10:00' }, { week: 'Week 3', day: 'Thu', date: '2026-01-23', status: 'present', time: '09:00' }, { week: 'Week 3', day: 'Fri', date: '2026-01-24', status: 'present', time: '10:00' }],
    ],
    2: [
        [{ week: 'Week 1', day: 'Mon', date: '2026-01-06', status: 'present', time: '10:00' }, { week: 'Week 1', day: 'Tue', date: '2026-01-07', status: 'present', time: '10:00' }, { week: 'Week 1', day: 'Wed', date: '2026-01-08', status: 'present', time: '09:00' }, { week: 'Week 1', day: 'Thu', date: '2026-01-09', status: 'present', time: '10:00' }, { week: 'Week 1', day: 'Fri', date: '2026-01-10', status: 'present', time: '11:00' }],
        [{ week: 'Week 2', day: 'Mon', date: '2026-01-13', status: 'present', time: '10:00' }, { week: 'Week 2', day: 'Tue', date: '2026-01-14', status: 'present', time: '10:00' }, { week: 'Week 2', day: 'Wed', date: '2026-01-15', status: 'absent', time: '09:00' }, { week: 'Week 2', day: 'Thu', date: '2026-01-16', status: 'present', time: '10:00' }, { week: 'Week 2', day: 'Fri', date: '2026-01-17', status: 'present', time: '11:00' }],
    ],
    3: [
        [{ week: 'Week 1', day: 'Mon', date: '2026-01-06', status: 'present', time: '11:00' }, { week: 'Week 1', day: 'Tue', date: '2026-01-07', status: 'present', time: '09:00' }, { week: 'Week 1', day: 'Wed', date: '2026-01-08', status: 'present', time: '10:00' }, { week: 'Week 1', day: 'Thu', date: '2026-01-09', status: 'present', time: '11:00' }, { week: 'Week 1', day: 'Fri', date: '2026-01-10', status: 'present', time: '09:00' }],
    ],
    4: [
        [{ week: 'Week 1', day: 'Mon', date: '2026-01-06', status: 'present', time: '14:00' }, { week: 'Week 1', day: 'Tue', date: '2026-01-07', status: 'present', time: '11:00' }, { week: 'Week 1', day: 'Wed', date: '2026-01-08', status: 'present', time: '14:00' }, { week: 'Week 1', day: 'Thu', date: '2026-01-09', status: 'present', time: '09:00' }, { week: 'Week 1', day: 'Fri', date: '2026-01-10', status: 'present', time: '10:00' }],
    ],
    5: [
        [{ week: 'Week 1', day: 'Mon', date: '2026-01-06', status: 'absent', time: '09:00' }, { week: 'Week 1', day: 'Tue', date: '2026-01-07', status: 'present', time: '10:00' }, { week: 'Week 1', day: 'Wed', date: '2026-01-08', status: 'present', time: '11:00' }, { week: 'Week 1', day: 'Thu', date: '2026-01-09', status: 'absent', time: '10:00' }, { week: 'Week 1', day: 'Fri', date: '2026-01-10', status: 'present', time: '11:00' }],
    ],
    6: [
        [{ week: 'Week 1', day: 'Mon', date: '2026-01-06', status: 'present', time: '14:00' }, { week: 'Week 1', day: 'Tue', date: '2026-01-07', status: 'present', time: '14:00' }, { week: 'Week 1', day: 'Wed', date: '2026-01-08', status: 'present', time: '11:00' }, { week: 'Week 1', day: 'Thu', date: '2026-01-09', status: 'present', time: '11:00' }, { week: 'Week 1', day: 'Fri', date: '2026-01-10', status: 'present', time: '11:00' }],
    ],
}

export default function AttendanceTab({ subjects, attendanceData }: AttendanceTabProps) {
    const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null)
    const [selectedWeek, setSelectedWeek] = useState<number>(0)

    const riskSubjects = subjects.filter(s => s.attendance < 75)
    const overallAttendance = Math.round(
        (subjects.reduce((sum, s) => sum + s.presentClasses, 0) /
            subjects.reduce((sum, s) => sum + s.totalClasses, 0)) *
        100
    )

    const getSubjectWeeklyStats = (subjectId: number) => {
        const data = SUBJECT_WEEKLY_DATA[subjectId] || []
        return data.map(weekData => {
            const attended = weekData.filter(d => d.status === 'present').length
            const total = weekData.length
            return {
                week: weekData[0]?.week || '',
                attended,
                total,
                percentage: total > 0 ? Math.round((attended / total) * 100) : 0,
                data: weekData
            }
        })
    }

    const getDayWiseData = (subjectId: number, weekIndex: number) => {
        const data = SUBJECT_WEEKLY_DATA[subjectId] || []
        return data[weekIndex] || []
    }

    const weeklyStats = getSubjectWeeklyStats(selectedSubject?.id || 1)
    const dayWiseData = selectedSubject ? getDayWiseData(selectedSubject.id, selectedWeek) : []

    return (
        <div className="space-y-6">
            {/* Weekly Attendance Trend - Main Chart */}
            <div className="
                bg-gradient-to-br from-white via-[var(--color-primary-faint)]/30 to-white 
                rounded-2xl border border-black/[0.04]
                shadow-[0_1px_3px_rgba(0,0,0,0.02),0_4px_12px_rgba(0,0,0,0.02)]
                p-6 md:p-8
            ">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
                            Weekly Attendance Trend
                        </h3>
                        <p className="text-sm text-[var(--color-text-muted)] mt-1">
                            Classes attended out of total scheduled per week
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-lg">
                            <TrendingUp className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-medium text-green-700">+3%</span>
                        </div>
                        <div className="text-right">
                            <p className="text-2xl font-bold text-[var(--color-primary)]">{overallAttendance}%</p>
                            <p className="text-xs text-[var(--color-text-muted)]">Overall</p>
                        </div>
                    </div>
                </div>

                <div className="h-[280px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={WEEKLY_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorAttended" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" opacity={0.15} vertical={false} />
                            <XAxis 
                                dataKey="week" 
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }}
                            />
                            <YAxis 
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }}
                                domain={[0, 'dataMax + 2']}
                            />
                            <Tooltip 
                                contentStyle={{
                                    backgroundColor: 'white',
                                    border: '1px solid rgba(0,0,0,0.06)',
                                    borderRadius: '12px',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                                }}
                                formatter={(value: number, name: string) => [
                                    name === 'attended' ? `${value} attended` : `${value} classes`,
                                    name === 'attended' ? 'Attended' : 'Total Scheduled'
                                ]}
                            />
                            <Area
                                type="monotone"
                                dataKey="total"
                                stroke="transparent"
                                fill="var(--color-primary-faint)"
                            />
                            <Line
                                type="monotone"
                                dataKey="attended"
                                stroke="var(--color-primary)"
                                strokeWidth={3}
                                dot={{ r: 5, fill: 'var(--color-primary)', strokeWidth: 2, stroke: 'white' }}
                                activeDot={{ r: 7, fill: 'var(--color-primary)' }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-black/[0.04]">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-[var(--color-primary)] rounded-full" />
                        <span className="text-xs text-[var(--color-text-muted)]">Classes Attended</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-[var(--color-primary-faint)] rounded-full" />
                        <span className="text-xs text-[var(--color-text-muted)]">Total Scheduled</span>
                    </div>
                </div>
            </div>

            {/* Subject-wise Breakdown */}
            <div className="
                bg-gradient-to-br from-white via-[var(--color-primary-faint)]/30 to-white 
                rounded-2xl border border-black/[0.04]
                shadow-[0_1px_3px_rgba(0,0,0,0.02),0_4px_12px_rgba(0,0,0,0.02)]
                p-6 md:p-8
            ">
                <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-6">
                    Subject-wise Breakdown
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {subjects.map((subject) => (
                        <button 
                            key={subject.id}
                            onClick={() => {
                                setSelectedSubject(subject)
                                setSelectedWeek(0)
                            }}
                            className={`
                                bg-white rounded-xl border p-5 text-left transition-all duration-200
                                ${selectedSubject?.id === subject.id 
                                    ? 'border-[var(--color-primary)] shadow-[0_4px_12px_rgba(59,130,246,0.15)]' 
                                    : 'border-black/[0.04] hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)]'
                                }
                            `}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <p className="font-medium text-[var(--color-text-primary)]">{subject.name}</p>
                                    <p className="text-xs text-[var(--color-text-muted)]">{subject.code}</p>
                                </div>
                                <StatusBadge 
                                    status={subject.attendance >= 75 ? 'eligible' : subject.attendance >= 65 ? 'at_risk' : 'not_eligible'} 
                                />
                            </div>

                            <div className="space-y-3">
                                <AttendanceProgressBar
                                    percentage={subject.attendance}
                                    total={subject.totalClasses}
                                    present={subject.presentClasses}
                                    showDetails={true}
                                    size="md"
                                />
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Subject Detailed View Modal */}
            {selectedSubject && (
                <div className="
                    bg-gradient-to-br from-white via-[var(--color-primary-faint)]/30 to-white 
                    rounded-2xl border border-black/[0.04]
                    shadow-[0_1px_3px_rgba(0,0,0,0.02),0_4px_12px_rgba(0,0,0,0.02)]
                    p-6 md:p-8
                ">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <button 
                                onClick={() => setSelectedSubject(null)}
                                className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                            >
                                <X className="w-4 h-4 text-gray-600" />
                            </button>
                            <div>
                                <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
                                    {selectedSubject.name} - Day-wise Attendance
                                </h3>
                                <p className="text-sm text-[var(--color-text-muted)]">
                                    {selectedSubject.code} • Click on a subject above to view details
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Week Selector */}
                    <div className="flex gap-2 overflow-x-auto pb-4 mb-6">
                        {weeklyStats.map((stat, idx) => (
                            <button
                                key={idx}
                                onClick={() => setSelectedWeek(idx)}
                                className={`
                                    px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all
                                    ${selectedWeek === idx
                                        ? 'bg-[var(--color-primary)] text-white shadow-md'
                                        : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300'
                                    }
                                `}
                            >
                                {stat.week} ({stat.attended}/{stat.total})
                            </button>
                        ))}
                    </div>

                    {/* Day-wise Bar Chart */}
                    <div className="h-[200px] mb-6">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart 
                                data={dayWiseData.map(d => ({
                                    day: d.day,
                                    status: d.status === 'present' ? 1 : 0
                                }))}
                                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" opacity={0.15} vertical={false} />
                                <XAxis 
                                    dataKey="day" 
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }}
                                />
                                <YAxis 
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }}
                                    domain={[0, 1]}
                                    ticks={[0, 1]}
                                    tickFormatter={(val) => val === 0 ? 'Absent' : 'Present'}
                                />
                                <Tooltip 
                                    contentStyle={{
                                        backgroundColor: 'white',
                                        border: '1px solid rgba(0,0,0,0.06)',
                                        borderRadius: '12px',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                                    }}
                                    formatter={(value: number, name: string) => [
                                        value === 1 ? 'Present' : 'Absent',
                                        'Status'
                                    ]}
                                />
                                <Bar 
                                    dataKey="status" 
                                    fill="var(--color-primary)"
                                    radius={[4, 4, 0, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Day-wise List */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                        {dayWiseData.map((day, idx) => (
                            <div 
                                key={idx}
                                className={`
                                    p-3 rounded-xl border text-center
                                    ${day.status === 'present'
                                        ? 'bg-green-50 border-green-200'
                                        : 'bg-red-50 border-red-200'
                                    }
                                `}
                            >
                                <p className="text-xs font-medium text-gray-600">{day.day}</p>
                                <p className="text-xs text-gray-500 mt-0.5">{day.date}</p>
                                <div className={`
                                    mt-2 px-2 py-1 rounded-full text-xs font-medium
                                    ${day.status === 'present'
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-red-100 text-red-700'
                                    }
                                `}>
                                    {day.status === 'present' ? 'Present' : 'Absent'}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Risk Analysis Alert */}
            {riskSubjects.length > 0 && (
                <div className="bg-red-50/80 border border-red-200/50 rounded-2xl p-6">
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center shrink-0 mt-0.5">
                            <AlertCircle className="w-5 h-5 text-red-600" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-semibold text-red-900 mb-2">Attendance Risk Alert</h3>
                            <p className="text-sm text-red-700 mb-4">
                                You have {riskSubjects.length} subject{riskSubjects.length > 1 ? 's' : ''} with attendance below 75%. 
                                Immediate action required to maintain eligibility.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {riskSubjects.map((subject) => {
                                    const needed = Math.ceil((75 * subject.totalClasses - subject.presentClasses * 100) / 25)
                                    return (
                                        <div key={subject.id} className="bg-white/80 rounded-lg p-3 border border-red-200/50">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-sm font-medium text-gray-900">{subject.name}</span>
                                                <span className="text-sm font-bold text-red-600">{subject.attendance}%</span>
                                            </div>
                                            <p className="text-xs text-red-700">
                                                Attend <span className="font-bold">{Math.max(0, needed)} more</span> classes to reach 75%
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
