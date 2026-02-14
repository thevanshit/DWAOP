'use client'

import { TrendingUp, Award, Calendar, BarChart3 } from 'lucide-react'
import SectionHeader from '@/components/ui/SectionHeader'

interface TrackReportTabProps {
    reports: Array<{
        semester: string
        sgpa: number
        cgpa: number
        attendance: number
        assignments: number
        rank?: number
    }>
}

export default function TrackReportTab({ reports }: TrackReportTabProps) {
    const latestReport = reports[reports.length - 1]
    const previousReport = reports[reports.length - 2]

    const getTrend = (current: number, previous: number) => {
        if (!previous) return 'neutral'
        return current > previous ? 'up' : current < previous ? 'down' : 'neutral'
    }

    return (
        <div className="space-y-6">
            <SectionHeader
                title="Academic Track Report"
                subtitle="Your semester-wise performance analysis"
            />

            {/* Current Semester Summary */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 text-white shadow-lg">
                <h3 className="text-lg font-semibold mb-4 opacity-90">Current Semester Performance</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Award className="w-4 h-4 opacity-75" />
                            <span className="text-sm opacity-75">SGPA</span>
                        </div>
                        <div className="text-3xl font-bold">{latestReport.sgpa.toFixed(2)}</div>
                        {previousReport && (
                            <div className={`text-xs mt-1 flex items-center gap-1 ${getTrend(latestReport.sgpa, previousReport.sgpa) === 'up' ? 'text-green-300' :
                                    getTrend(latestReport.sgpa, previousReport.sgpa) === 'down' ? 'text-red-300' : 'text-white/60'
                                }`}>
                                {getTrend(latestReport.sgpa, previousReport.sgpa) === 'up' && '↑'}
                                {getTrend(latestReport.sgpa, previousReport.sgpa) === 'down' && '↓'}
                                {getTrend(latestReport.sgpa, previousReport.sgpa) === 'neutral' && '→'}
                                {' '}{Math.abs(latestReport.sgpa - previousReport.sgpa).toFixed(2)}
                            </div>
                        )}
                    </div>

                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <TrendingUp className="w-4 h-4 opacity-75" />
                            <span className="text-sm opacity-75">CGPA</span>
                        </div>
                        <div className="text-3xl font-bold">{latestReport.cgpa.toFixed(2)}</div>
                        {previousReport && (
                            <div className={`text-xs mt-1 flex items-center gap-1 ${getTrend(latestReport.cgpa, previousReport.cgpa) === 'up' ? 'text-green-300' :
                                    getTrend(latestReport.cgpa, previousReport.cgpa) === 'down' ? 'text-red-300' : 'text-white/60'
                                }`}>
                                {getTrend(latestReport.cgpa, previousReport.cgpa) === 'up' && '↑'}
                                {getTrend(latestReport.cgpa, previousReport.cgpa) === 'down' && '↓'}
                                {getTrend(latestReport.cgpa, previousReport.cgpa) === 'neutral' && '→'}
                                {' '}{Math.abs(latestReport.cgpa - previousReport.cgpa).toFixed(2)}
                            </div>
                        )}
                    </div>

                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Calendar className="w-4 h-4 opacity-75" />
                            <span className="text-sm opacity-75">Attendance</span>
                        </div>
                        <div className="text-3xl font-bold">{latestReport.attendance}%</div>
                        {previousReport && (
                            <div className={`text-xs mt-1 flex items-center gap-1 ${getTrend(latestReport.attendance, previousReport.attendance) === 'up' ? 'text-green-300' :
                                    getTrend(latestReport.attendance, previousReport.attendance) === 'down' ? 'text-red-300' : 'text-white/60'
                                }`}>
                                {getTrend(latestReport.attendance, previousReport.attendance) === 'up' && '↑'}
                                {getTrend(latestReport.attendance, previousReport.attendance) === 'down' && '↓'}
                                {getTrend(latestReport.attendance, previousReport.attendance) === 'neutral' && '→'}
                                {' '}{Math.abs(latestReport.attendance - previousReport.attendance)}%
                            </div>
                        )}
                    </div>

                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <BarChart3 className="w-4 h-4 opacity-75" />
                            <span className="text-sm opacity-75">Assignments</span>
                        </div>
                        <div className="text-3xl font-bold">{latestReport.assignments}%</div>
                        {previousReport && (
                            <div className={`text-xs mt-1 flex items-center gap-1 ${getTrend(latestReport.assignments, previousReport.assignments) === 'up' ? 'text-green-300' :
                                    getTrend(latestReport.assignments, previousReport.assignments) === 'down' ? 'text-red-300' : 'text-white/60'
                                }`}>
                                {getTrend(latestReport.assignments, previousReport.assignments) === 'up' && '↑'}
                                {getTrend(latestReport.assignments, previousReport.assignments) === 'down' && '↓'}
                                {getTrend(latestReport.assignments, previousReport.assignments) === 'neutral' && '→'}
                                {' '}{Math.abs(latestReport.assignments - previousReport.assignments)}%
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* CGPA Trend Chart */}
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-4">CGPA Progression</h3>
                <div className="flex items-end justify-between gap-3 h-64">
                    {reports.map((report, idx) => {
                        const height = (report.cgpa / 10) * 100
                        return (
                            <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                                <div className="w-full bg-gray-100 rounded-t relative" style={{ height: '100%' }}>
                                    <div
                                        className="absolute bottom-0 w-full rounded-t bg-gradient-to-t from-blue-600 to-blue-400 transition-all"
                                        style={{ height: `${height}%` }}
                                    >
                                        <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-semibold text-gray-700">
                                            {report.cgpa.toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                                <span className="text-xs text-gray-600 font-medium">{report.semester}</span>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Semester-wise Comparison Table */}
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-900">Semester-wise Breakdown</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Semester</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">SGPA</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">CGPA</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Attendance</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Assignments</th>
                                {reports.some(r => r.rank) && (
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Rank</th>
                                )}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {reports.map((report, idx) => (
                                <tr key={idx} className={`hover:bg-gray-50 ${idx === reports.length - 1 ? 'bg-blue-50' : ''}`}>
                                    <td className="px-6 py-4">
                                        <span className="text-sm font-medium text-gray-900">{report.semester}</span>
                                        {idx === reports.length - 1 && (
                                            <span className="ml-2 px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full">Current</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="text-sm font-semibold text-gray-900">{report.sgpa.toFixed(2)}</span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="text-sm font-semibold text-gray-900">{report.cgpa.toFixed(2)}</span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`text-sm font-medium ${report.attendance >= 75 ? 'text-green-600' : report.attendance >= 65 ? 'text-yellow-600' : 'text-red-600'
                                            }`}>
                                            {report.attendance}%
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="text-sm font-medium text-gray-900">{report.assignments}%</span>
                                    </td>
                                    {reports.some(r => r.rank) && (
                                        <td className="px-6 py-4 text-center">
                                            <span className="text-sm font-medium text-gray-900">{report.rank || '-'}</span>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Performance Insights */}
            <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-green-50 border border-green-200 rounded-xl p-5">
                    <h4 className="font-semibold text-green-900 mb-2">Strengths</h4>
                    <ul className="text-sm text-green-800 space-y-1">
                        <li>• Consistent CGPA above {Math.min(...reports.map(r => r.cgpa)).toFixed(2)}</li>
                        <li>• {reports.filter(r => r.attendance >= 75).length} semesters with 75%+ attendance</li>
                        <li>• Strong assignment completion rate</li>
                    </ul>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
                    <h4 className="font-semibold text-amber-900 mb-2">Areas for Improvement</h4>
                    <ul className="text-sm text-amber-800 space-y-1">
                        {latestReport.attendance < 75 && <li>• Focus on improving attendance to 75%+</li>}
                        {latestReport.assignments < 80 && <li>• Complete more assignments on time</li>}
                        {previousReport && latestReport.cgpa < previousReport.cgpa && <li>• Work on improving CGPA</li>}
                    </ul>
                </div>
            </div>
        </div>
    )
}
