'use client'

import { useState } from 'react'
import {
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  Clock,
  FileText,
  Users,
  Calendar,
  ChevronRight,
  Filter,
  Eye,
  MessageSquare,
  Shield,
  Activity
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface RiskItem {
  id: string
  type: 'attendance' | 'marks' | 'assignment' | 'leave'
  studentId: string
  studentName: string
  rollNumber: string
  batch: string
  subject?: string
  risk: 'low' | 'medium' | 'high'
  value: number
  threshold: number
  description: string
  trend?: 'up' | 'down' | 'stable'
  daysUntilDeadline?: number
}

interface AtRiskAnalyticsPanelProps {
  students?: RiskItem[]
}

const MOCK_AT_RISK_STUDENTS: RiskItem[] = [
  { id: '1', type: 'attendance', studentId: 'S001', studentName: 'Rahul Sharma', rollNumber: 'CS-AIML-045', batch: 'CSE-AIML', subject: 'Operating Systems', risk: 'high', value: 58, threshold: 75, description: 'Attendance below 60% threshold', trend: 'down', daysUntilDeadline: 5 },
  { id: '2', type: 'attendance', studentId: 'S002', studentName: 'Priya Singh', rollNumber: 'CS-023', batch: 'CSE', subject: 'Database Systems', risk: 'high', value: 62, threshold: 75, description: 'Attendance below 65% - borderline', trend: 'down', daysUntilDeadline: 8 },
  { id: '3', type: 'marks', studentId: 'S003', studentName: 'Amit Kumar', rollNumber: 'IT-067', batch: 'IT', subject: 'Computer Networks', risk: 'medium', value: 45, threshold: 50, description: 'IA-1 marks below average', trend: 'stable', daysUntilDeadline: 12 },
  { id: '4', type: 'assignment', studentId: 'S004', studentName: 'Sneha Gupta', rollNumber: 'CS-AIML-089', batch: 'CSE-AIML', subject: 'Operating Systems', risk: 'medium', value: 2, threshold: 3, description: '2 pending assignments', trend: 'up', daysUntilDeadline: 3 },
  { id: '5', type: 'attendance', studentId: 'S005', studentName: 'Vikram Patel', rollNumber: 'CS-034', batch: 'CSE', subject: 'Operating Systems', risk: 'low', value: 70, threshold: 75, description: 'Near attendance threshold', trend: 'up', daysUntilDeadline: 15 },
  { id: '6', type: 'leave', studentId: 'S006', studentName: 'Ananya Reddy', rollNumber: 'IT-012', batch: 'IT', risk: 'low', value: 4, threshold: 5, description: 'Multiple leave requests this month', trend: 'stable' },
]

const MOCK_BOTTLENECKS = [
  { id: '1', type: 'marks', title: 'IA-1 Marks Pending', count: 24, severity: 'high', description: 'Marks not submitted by 6 faculty members' },
  { id: '2', type: 'assignment', title: 'Assignment Evaluations Delayed', count: 15, severity: 'medium', description: 'Pending evaluations for 3+ days' },
  { id: '3', type: 'attendance', title: 'Attendance Not Finalized', count: 8, severity: 'low', description: 'Sessions from last week pending finalization' },
]

export default function AtRiskAnalyticsPanel({ students = MOCK_AT_RISK_STUDENTS }: AtRiskAnalyticsPanelProps) {
  const [activeTab, setActiveTab] = useState<'students' | 'bottlenecks'>('students')
  const [filterRisk, setFilterRisk] = useState<'all' | 'high' | 'medium' | 'low'>('all')

  const filteredStudents = students.filter(s => 
    filterRisk === 'all' || s.risk === filterRisk
  )

  const highRiskCount = students.filter(s => s.risk === 'high').length
  const mediumRiskCount = students.filter(s => s.risk === 'medium').length
  const lowRiskCount = students.filter(s => s.risk === 'low').length

  const riskTrend = highRiskCount > 5 ? 'up' : highRiskCount > 2 ? 'stable' : 'down'

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-200 bg-slate-50/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900">At-Risk Analytics</h3>
              <p className="text-xs text-slate-500">Students requiring attention</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={cn("flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium",
              riskTrend === 'up' ? 'bg-red-100 text-red-700' :
              riskTrend === 'down' ? 'bg-green-100 text-green-700' :
              'bg-slate-100 text-slate-600'
            )}>
              {riskTrend === 'up' ? <TrendingUp className="w-3 h-3" /> : riskTrend === 'down' ? <TrendingDown className="w-3 h-3" /> : <Activity className="w-3 h-3" />}
              {highRiskCount} High Risk
            </span>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-px bg-slate-200">
        <div className="bg-slate-50 p-4 text-center">
          <p className="text-2xl font-bold text-red-600">{highRiskCount}</p>
          <p className="text-xs font-medium text-slate-500">High Risk</p>
        </div>
        <div className="bg-slate-50 p-4 text-center">
          <p className="text-2xl font-bold text-amber-600">{mediumRiskCount}</p>
          <p className="text-xs font-medium text-slate-500">Medium Risk</p>
        </div>
        <div className="bg-slate-50 p-4 text-center">
          <p className="text-2xl font-bold text-slate-600">{lowRiskCount}</p>
          <p className="text-xs font-medium text-slate-500">Low Risk</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('students')}
          className={cn(
            "flex-1 px-4 py-3 text-sm font-medium transition-colors",
            activeTab === 'students' 
              ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/50" 
              : "text-slate-500 hover:text-slate-700"
          )}
        >
          <Users className="w-4 h-4 inline-block mr-2" />
          At-Risk Students
        </button>
        <button
          onClick={() => setActiveTab('bottlenecks')}
          className={cn(
            "flex-1 px-4 py-3 text-sm font-medium transition-colors",
            activeTab === 'bottlenecks' 
              ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/50" 
              : "text-slate-500 hover:text-slate-700"
          )}
        >
          <Clock className="w-4 h-4 inline-block mr-2" />
          Bottlenecks
        </button>
      </div>

      {/* Filter */}
      <div className="px-5 py-3 border-b border-slate-100">
        <div className="flex gap-2">
          {(['all', 'high', 'medium', 'low'] as const).map(risk => (
            <button
              key={risk}
              onClick={() => setFilterRisk(risk)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors capitalize",
                filterRisk === risk 
                  ? risk === 'high' ? 'bg-red-600 text-white' 
                  : risk === 'medium' ? 'bg-amber-500 text-white'
                  : risk === 'low' ? 'bg-slate-600 text-white'
                  : 'bg-blue-600 text-white'
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              )}
            >
              {risk === 'all' ? 'All' : risk}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-h-[400px] overflow-y-auto">
        {activeTab === 'students' ? (
          <div className="divide-y divide-slate-100">
            {filteredStudents.map(student => (
              <RiskStudentRow key={student.id} student={student} />
            ))}
            {filteredStudents.length === 0 && (
              <div className="p-8 text-center">
                <Shield className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <p className="text-sm font-medium text-slate-600">No students at risk</p>
                <p className="text-xs text-slate-400">All students are performing well</p>
              </div>
            )}
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {MOCK_BOTTLENECKS.map(bottleneck => (
              <BottleneckRow key={bottleneck.id} bottleneck={bottleneck} />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-slate-200 bg-slate-50/50">
        <button className="w-full text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center justify-center gap-1">
          View All {activeTab === 'students' ? 'Students' : 'Bottlenecks'}
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

function RiskStudentRow({ student }: { student: RiskItem }) {
  const riskColors = {
    high: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', badge: 'bg-red-100' },
    medium: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', badge: 'bg-amber-100' },
    low: { bg: 'bg-slate-50', border: 'border-slate-200', text: 'text-slate-600', badge: 'bg-slate-100' },
  }
  
  const colors = riskColors[student.risk]
  const typeIcons = {
    attendance: Calendar,
    marks: FileText,
    assignment: FileText,
    leave: Calendar,
  }
  const TypeIcon = typeIcons[student.type]

  return (
    <div className={cn("px-5 py-4 hover:bg-slate-50 transition-colors cursor-pointer", colors.bg)}>
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", colors.badge)}>
            <TypeIcon className={cn("w-4 h-4", colors.text)} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-slate-900">{student.studentName}</p>
              <span className={cn("px-1.5 py-0.5 rounded text-[9px] font-medium uppercase", colors.badge, colors.text)}>
                {student.risk}
              </span>
            </div>
            <p className="text-xs text-slate-500">{student.rollNumber} • {student.batch}</p>
            {student.subject && (
              <p className="text-xs text-slate-400 mt-1">{student.subject}</p>
            )}
          </div>
        </div>
        
        <div className="text-right">
          <div className="flex items-center gap-1 justify-end">
            {student.trend && (
              student.trend === 'down' ? <TrendingDown className="w-3 h-3 text-red-500" /> :
              student.trend === 'up' ? <TrendingUp className="w-3 h-3 text-green-500" /> :
              <Activity className="w-3 h-3 text-slate-400" />
            )}
            <span className="text-sm font-bold text-slate-900">{student.value}%</span>
          </div>
          <p className="text-xs text-slate-500">Threshold: {student.threshold}%</p>
          {student.daysUntilDeadline && (
            <p className="text-[10px] text-slate-400 mt-1">{student.daysUntilDeadline} days to act</p>
          )}
        </div>
      </div>
      
      <div className="mt-2 ml-11">
        <p className="text-xs text-slate-500">{student.description}</p>
        <div className="flex gap-2 mt-2">
          <button className="flex items-center gap-1 px-2 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-medium text-slate-600 hover:bg-slate-50">
            <Eye className="w-3 h-3" /> View
          </button>
          <button className="flex items-center gap-1 px-2 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-medium text-slate-600 hover:bg-slate-50">
            <MessageSquare className="w-3 h-3" /> Contact
          </button>
        </div>
      </div>
    </div>
  )
}

function BottleneckRow({ bottleneck }: { bottleneck: { id: string; type: string; title: string; count: number; severity: string; description: string } }) {
  const severityColors = {
    high: { bg: 'bg-red-100', text: 'text-red-700' },
    medium: { bg: 'bg-amber-100', text: 'text-amber-700' },
    low: { bg: 'bg-slate-100', text: 'text-slate-600' },
  }
  
  const colors = severityColors[bottleneck.severity as keyof typeof severityColors]

  return (
    <div className="px-5 py-4 hover:bg-slate-50 transition-colors cursor-pointer">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-slate-900">{bottleneck.title}</p>
            <span className={cn("px-1.5 py-0.5 rounded text-[9px] font-medium uppercase", colors.bg, colors.text)}>
              {bottleneck.severity}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">{bottleneck.description}</p>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-slate-900">{bottleneck.count}</p>
          <p className="text-[10px] text-slate-500">items</p>
        </div>
      </div>
    </div>
  )
}
