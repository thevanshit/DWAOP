'use client'

import { useState } from 'react'
import {
  Calendar,
  AlertTriangle,
  GraduationCap,
  FileQuestion,
  Award,
  Plus,
  Search,
  Filter,
  ChevronRight,
  CheckCircle,
  XCircle,
  Clock,
  User,
  FileText,
  MessageSquare,
  Download
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface Request {
  id: string
  type: 'leave' | 'issue' | 'permission' | 'clarification' | 'certificate'
  title: string
  description: string
  studentName: string
  studentRoll: string
  batch: string
  status: 'pending' | 'approved' | 'rejected'
  priority: 'low' | 'medium' | 'high'
  submittedDate: string
  processedDate?: string
  reviewer?: string
  subject?: string
}

const MOCK_REQUESTS: Request[] = [
  { id: '1', type: 'leave', title: 'Medical Leave - 3 Days', description: 'Medical leave for fever and cold', studentName: 'Rahul Sharma', studentRoll: 'CS-AIML-045', batch: 'CSE-AIML', status: 'pending', priority: 'high', submittedDate: '2026-02-15', subject: 'Operating Systems' },
  { id: '2', type: 'leave', title: 'Family Function', description: 'Attendance for family wedding', studentName: 'Priya Singh', studentRoll: 'CS-023', batch: 'CSE', status: 'pending', priority: 'medium', submittedDate: '2026-02-14', subject: 'Database Systems' },
  { id: '3', type: 'issue', title: 'Attendance Correction', description: 'Marked absent by mistake on Feb 10', studentName: 'Amit Kumar', studentRoll: 'IT-067', batch: 'IT', status: 'pending', priority: 'medium', submittedDate: '2026-02-13', subject: 'Computer Networks' },
  { id: '4', type: 'permission', title: 'Workshop Attendance', description: 'Permission to attend AI workshop', studentName: 'Sneha Gupta', studentRoll: 'CS-AIML-089', batch: 'CSE-AIML', status: 'approved', priority: 'low', submittedDate: '2026-02-10', processedDate: '2026-02-12', reviewer: 'Dr. Amit Kumar' },
  { id: '5', type: 'leave', title: 'Medical Emergency', description: 'Hospitalization of family member', studentName: 'Vikram Patel', studentRoll: 'CS-034', batch: 'CSE', status: 'rejected', priority: 'high', submittedDate: '2026-02-08', processedDate: '2026-02-09', reviewer: 'Dr. Suresh Kumar', subject: 'Data Structures' },
  { id: '6', type: 'clarification', title: 'Mark Clarification', description: 'Question about IA-1 mark calculation', studentName: 'Ananya Reddy', studentRoll: 'IT-012', batch: 'IT', status: 'pending', priority: 'low', submittedDate: '2026-02-14', subject: 'Operating Systems' },
  { id: '7', type: 'certificate', title: 'Bonafide Certificate', description: 'Required for internship application', studentName: 'Raj Malhotra', studentRoll: 'CS-056', batch: 'CSE', status: 'approved', priority: 'low', submittedDate: '2026-02-11', processedDate: '2026-02-13', reviewer: 'Admin' },
  { id: '8', type: 'permission', title: 'Sports Event', description: 'Inter-college sports competition', studentName: 'Kavya Nair', studentRoll: 'CS-AIML-078', batch: 'CSE-AIML', status: 'pending', priority: 'medium', submittedDate: '2026-02-15' },
]

const REQUEST_TYPES = [
  { id: 'all', label: 'All Requests', icon: FileText, count: MOCK_REQUESTS.length },
  { id: 'leave', label: 'Leave', icon: Calendar, count: MOCK_REQUESTS.filter(r => r.type === 'leave').length },
  { id: 'issue', label: 'Issues', icon: AlertTriangle, count: MOCK_REQUESTS.filter(r => r.type === 'issue').length },
  { id: 'permission', label: 'Permissions', icon: GraduationCap, count: MOCK_REQUESTS.filter(r => r.type === 'permission').length },
  { id: 'clarification', label: 'Clarifications', icon: FileQuestion, count: MOCK_REQUESTS.filter(r => r.type === 'clarification').length },
  { id: 'certificate', label: 'Certificates', icon: Award, count: MOCK_REQUESTS.filter(r => r.type === 'certificate').length },
]

export default function RequestsTab() {
  const [activeType, setActiveType] = useState('all')
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all')
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null)

  const filteredRequests = MOCK_REQUESTS.filter(r => {
    const matchesType = activeType === 'all' || r.type === activeType
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter
    return matchesType && matchesStatus
  })

  const stats = {
    total: MOCK_REQUESTS.length,
    pending: MOCK_REQUESTS.filter(r => r.status === 'pending').length,
    approved: MOCK_REQUESTS.filter(r => r.status === 'approved').length,
    rejected: MOCK_REQUESTS.filter(r => r.status === 'rejected').length,
    highPriority: MOCK_REQUESTS.filter(r => r.priority === 'high' && r.status === 'pending').length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Requests & Approvals</h2>
          <p className="text-sm text-slate-500 mt-1">Review and process student requests</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 shadow-lg shadow-blue-600/20">
          <Download className="w-4 h-4" />
          Export Report
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
              <p className="text-xs text-slate-500">Total</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-amber-600">{stats.pending}</p>
              <p className="text-xs text-slate-500">Pending</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
              <p className="text-xs text-slate-500">Approved</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
              <p className="text-xs text-slate-500">Rejected</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-600">{stats.highPriority}</p>
              <p className="text-xs text-slate-500">High Priority</p>
            </div>
          </div>
        </div>
      </div>

      {/* Type Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {REQUEST_TYPES.map(type => (
          <button
            key={type.id}
            onClick={() => setActiveType(type.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all",
              activeType === type.id
                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                : "bg-white border border-slate-200 text-slate-600 hover:border-slate-300"
            )}
          >
            <type.icon className="w-4 h-4" />
            {type.label}
            <span className={cn(
              "ml-1 px-1.5 py-0.5 rounded-full text-xs",
              activeType === type.id ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
            )}>
              {type.count}
            </span>
          </button>
        ))}
      </div>

      {/* Status Filter */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-slate-500">Status:</span>
        {(['all', 'pending', 'approved', 'rejected'] as const).map(status => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors capitalize",
              statusFilter === status
                ? status === 'approved' ? 'bg-green-600 text-white'
                : status === 'rejected' ? 'bg-red-600 text-white'
                : status === 'pending' ? 'bg-amber-600 text-white'
                : 'bg-blue-600 text-white'
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            )}
          >
            {status === 'all' ? 'All' : status}
          </button>
        ))}
      </div>

      {/* Requests List */}
      <div className="space-y-3">
        {filteredRequests.map(request => (
          <RequestCard 
            key={request.id} 
            request={request} 
            isSelected={selectedRequest === request.id}
            onSelect={() => setSelectedRequest(selectedRequest === request.id ? null : request.id)}
          />
        ))}
        {filteredRequests.length === 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-medium text-slate-600">No requests found</p>
            <p className="text-xs text-slate-400">Try adjusting your filters</p>
          </div>
        )}
      </div>
    </div>
  )
}

function RequestCard({ request, isSelected, onSelect }: { 
  request: Request; 
  isSelected: boolean;
  onSelect: () => void;
}) {
  const typeIcons = {
    leave: Calendar,
    issue: AlertTriangle,
    permission: GraduationCap,
    clarification: FileQuestion,
    certificate: Award,
  }
  
  const TypeIcon = typeIcons[request.type]
  
  const statusStyles = {
    pending: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Pending' },
    approved: { bg: 'bg-green-100', text: 'text-green-700', label: 'Approved' },
    rejected: { bg: 'bg-red-100', text: 'text-red-700', label: 'Rejected' },
  }
  
  const style = statusStyles[request.status]

  const priorityStyles = {
    low: 'bg-slate-100 text-slate-600',
    medium: 'bg-blue-100 text-blue-700',
    high: 'bg-red-100 text-red-700',
  }

  return (
    <div className={cn(
      "bg-white rounded-2xl border transition-all overflow-hidden",
      isSelected ? "border-blue-300 shadow-md" : "border-slate-200 hover:border-slate-300"
    )}>
      <div 
        onClick={onSelect}
        className="p-5 cursor-pointer"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
              <TypeIcon className="w-5 h-5 text-slate-600" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <p className="text-sm font-semibold text-slate-900">{request.title}</p>
                <span className={cn("px-2 py-0.5 rounded text-[10px] font-medium uppercase", priorityStyles[request.priority])}>
                  {request.priority}
                </span>
              </div>
              <p className="text-xs text-slate-500 mb-2">{request.description}</p>
              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  {request.studentName} ({request.studentRoll})
                </span>
                <span>•</span>
                <span>{request.batch}</span>
                {request.subject && (
                  <>
                    <span>•</span>
                    <span>{request.subject}</span>
                  </>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <span className={cn("px-2.5 py-1 rounded-lg text-xs font-medium", style.bg, style.text)}>
              {style.label}
            </span>
            <ChevronRight className={cn("w-4 h-4 text-slate-400 transition-transform", isSelected && "rotate-90")} />
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
          <span className="text-xs text-slate-400">Submitted: {request.submittedDate}</span>
          {request.processedDate && (
            <span className="text-xs text-slate-400">Processed: {request.processedDate}</span>
          )}
        </div>
      </div>

      {/* Expanded Actions */}
      {isSelected && (
        <div className="px-5 py-4 bg-slate-50 border-t border-slate-200">
          {request.status === 'pending' ? (
            <div className="flex items-center gap-3">
              <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700">
                <CheckCircle className="w-4 h-4" />
                Approve
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700">
                <XCircle className="w-4 h-4" />
                Reject
              </button>
              <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-50">
                <MessageSquare className="w-4 h-4" />
                Ask Details
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div>
                {request.reviewer && (
                  <p className="text-xs text-slate-500">
                    Reviewed by: <span className="font-medium text-slate-700">{request.reviewer}</span>
                  </p>
                )}
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-50">
                <Download className="w-4 h-4" />
                Download Copy
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
