'use client'

import { useState } from 'react'
import { StudentTrackReport, UserRole } from '@/types'
import { getStatusColor } from '@/lib/workflow-engine'
import {
    BarChart3,
    CheckCircle2,
    AlertCircle,
    ChevronRight,
    GraduationCap,
    TrendingUp,
    AlertTriangle,
    History,
    Lock,
    ArrowUpRight
} from 'lucide-react'

interface StudentTrackReportProps {
    report: StudentTrackReport
    userRole: UserRole
    onTransition?: (newStatus: StudentTrackReport['status']) => void
}

export default function StudentTrackReportView({ report, userRole, onTransition }: StudentTrackReportProps) {
    return (
        <div className="space-y-8 animate-fade-in">
            {/* Overview Card */}
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-blue-900/[0.03] overflow-hidden">
                <div className="p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                    <div className="flex items-center space-x-6">
                        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                            <GraduationCap className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-1">Academic Status • Sem {report.semester}</p>
                            <h2 className="text-3xl font-black text-gray-900 tracking-tight">Track Report</h2>
                            <div className="flex items-center space-x-3 mt-2">
                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusColor(report.status as any)}`}>
                                    {report.status}
                                </span>
                                <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                                <span className="text-xs font-bold text-gray-500">Updated 2h ago</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className={`
                 px-6 py-4 rounded-3xl border flex items-center space-x-4
                 ${report.eligibility === 'eligible' ? 'bg-green-50 border-green-100 text-green-700' :
                                report.eligibility === 'at_risk' ? 'bg-orange-50 border-orange-100 text-orange-700' :
                                    'bg-red-50 border-red-100 text-red-700'}
              `}>
                            <div className="p-2 bg-white rounded-xl shadow-sm">
                                {report.eligibility === 'eligible' ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-wider opacity-60">Eligibility Status</p>
                                <p className="text-sm font-bold capitalize">{report.eligibility.replace('_', ' ')}</p>
                            </div>
                        </div>

                        {userRole === 'admin' && report.status === 'finalised' && (
                            <button
                                onClick={() => onTransition?.('locked')}
                                className="btn-primary py-4 px-8 rounded-3xl flex items-center space-x-2"
                            >
                                <Lock className="w-4 h-4" />
                                <span>Seal Report</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* Quick Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 border-t border-gray-50">
                    <QuickStat label="Avg Attendance" value="84%" subValue="+2% from last month" icon={<TrendingUp className="w-4 h-4" />} />
                    <QuickStat label="Assignments" value="12/14" subValue="2 Pending Review" icon={<BarChart3 className="w-4 h-4" />} />
                    <QuickStat label="Internal Score" value="42/50" subValue="Top 15% of Batch" icon={<ArrowUpRight className="w-4 h-4" />} />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Attendance Summary */}
                <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-bold text-gray-900">Attendance Analysis</h3>
                        <button className="text-xs font-bold text-blue-600 hover:underline">View All Logs</button>
                    </div>
                    <div className="space-y-6">
                        {report.attendance.map((sub, i) => (
                            <div key={i} className="group">
                                <div className="flex justify-between items-end mb-2">
                                    <div>
                                        <p className="text-sm font-bold text-gray-900">{sub.subject}</p>
                                        <p className="text-[10px] font-medium text-gray-400">{sub.attendedClasses}/{sub.totalClasses} Lectures</p>
                                    </div>
                                    <p className={`text-sm font-black ${sub.percentage < 75 ? 'text-red-500' : 'text-blue-600'}`}>
                                        {sub.percentage}%
                                    </p>
                                </div>
                                <div className="h-2 w-full bg-gray-50 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full transition-all duration-1000 ${sub.percentage < 75 ? 'bg-red-500' : 'bg-blue-600'}`}
                                        style={{ width: `${sub.percentage}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Risks & Notifications */}
                <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-bold text-gray-900">System Signals</h3>
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    </div>
                    <div className="space-y-4">
                        {report.riskIndicators.map((risk, i) => (
                            <div key={i} className="flex items-start space-x-4 p-4 rounded-2xl bg-orange-50/50 border border-orange-100/50">
                                <AlertCircle className="w-5 h-5 text-orange-500 mt-0.5" />
                                <p className="text-sm font-bold text-orange-800 leading-tight">{risk}</p>
                            </div>
                        ))}
                        {report.riskIndicators.length === 0 && (
                            <div className="text-center py-10">
                                <CheckCircle2 className="w-12 h-12 text-blue-100 mx-auto mb-4" />
                                <p className="text-sm font-bold text-gray-400">No active risks detected</p>
                            </div>
                        )}
                    </div>
                    <div className="mt-8 pt-8 border-t border-gray-50">
                        <div className="flex items-center justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                            <span className="flex items-center"><History className="w-3 h-3 mr-1" /> Audit ID: #ST-29402</span>
                            <button className="flex items-center text-blue-600">Full Archive <ChevronRight className="w-3 h-3 ml-0.5" /></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function QuickStat({ label, value, subValue, icon }: { label: string, value: string, subValue: string, icon: React.ReactNode }) {
    return (
        <div className="p-8 flex flex-col items-center text-center border-r border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-4">
                {icon}
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] mb-1">{label}</p>
            <p className="text-3xl font-black text-gray-900 mb-1 leading-none">{value}</p>
            <p className="text-[10px] font-bold text-blue-600 uppercase transition-all group-hover:translate-x-1">{subValue}</p>
        </div>
    )
}
