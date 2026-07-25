'use client'

import { useState } from 'react'
import {
  ClipboardList, Plus, CheckCircle, Clock, XCircle, ChevronRight,
  CalendarDays, AlertTriangle, Send, Paperclip
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useStudentDashboardData } from './StudentDashboardProvider'

export default function RequestsTab() {
  const { raw } = useStudentDashboardData()
  const [activeRequestTab, setActiveRequestTab] = useState('leave')
  const [showNewRequestModal, setShowNewRequestModal] = useState(false)
  const [requestType, setRequestType] = useState<'leave' | 'issue'>('leave')
  
  const apiLeaveRequests = (raw.leaveRequests || []).map((lr, i) => ({
    id: i + 100,
    type: 'leave' as const,
    subject: `${lr.leave_type} Leave`,
    date: lr.start_date,
    status: lr.status === 'created' || lr.status === 'under_review' ? 'pending' : lr.status === 'approved' ? 'approved' : 'rejected',
    description: lr.reason,
    appliedDate: new Date(lr.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    priority: 'medium' as const,
  }))

  const requestTabs = [
    { id: 'leave', label: 'Leave Application', icon: CalendarDays, count: apiLeaveRequests.filter(r => r.status === 'pending').length || 1 },
    { id: 'issue', label: 'Report Issue', icon: AlertTriangle, count: 1 },
  ]

  const allRequests = [
    ...apiLeaveRequests,
    { id: 2, type: 'issue' as const, subject: 'Attendance Correction', date: '2026-02-08', status: 'pending' as const, description: 'Missed class on 6th Feb due to medical emergency', appliedDate: 'Feb 8, 2026', priority: 'medium' as const },
    { id: 3, type: 'issue' as const, subject: 'ID Card Replacement', date: '2026-01-25', status: 'approved' as const, description: 'Request for new ID card', appliedDate: 'Jan 25, 2026', priority: 'low' as const },
  ]

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'approved': return { bg: 'bg-blue-50 text-blue-600', icon: CheckCircle }
      case 'pending': return { bg: 'bg-amber-50 text-amber-600', icon: Clock }
      case 'rejected': return { bg: 'bg-red-50 text-red-600', icon: XCircle }
      default: return { bg: 'bg-slate-100 text-slate-600', icon: Clock }
    }
  }

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-50 text-red-600'
      case 'medium': return 'bg-amber-50 text-amber-600'
      case 'low': return 'bg-slate-100 text-slate-600'
      default: return 'bg-slate-100 text-slate-600'
    }
  }

  const openNewRequest = (type: 'leave' | 'issue') => {
    setRequestType(type)
    setShowNewRequestModal(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white border border-slate-200 rounded-xl flex items-center justify-center shadow-sm">
            <ClipboardList className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Requests & Applications</h2>
            <p className="text-sm text-slate-500">Manage your applications & issues</p>
          </div>
        </div>
        <button 
          onClick={() => openNewRequest(activeRequestTab as 'leave' | 'issue')}
          className="px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 flex items-center gap-2 shadow-lg shadow-blue-600/20"
        >
          <Plus className="w-4 h-4" />
          New Request
        </button>
      </div>

      {/* Request Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-50 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{allRequests.filter(r => r.status === 'pending').length}</p>
              <p className="text-xs text-slate-500">Pending</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{allRequests.filter(r => r.status === 'approved').length}</p>
              <p className="text-xs text-slate-500">Approved</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{allRequests.filter(r => r.status === 'rejected').length}</p>
              <p className="text-xs text-slate-500">Rejected</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {requestTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveRequestTab(tab.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all",
              activeRequestTab === tab.id
                ? "bg-blue-600 text-white shadow-md"
                : "bg-white border border-slate-200 text-slate-600 hover:border-slate-300"
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
            {tab.count > 0 && (
              <span className="ml-1 px-1.5 py-0.5 rounded-full text-xs bg-white/20">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Request List */}
      <div className="space-y-4">
        {allRequests.filter(r => r.type === activeRequestTab).length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-100 p-12 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ClipboardList className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-slate-500 font-medium">No requests in this category</p>
            <button onClick={() => openNewRequest(activeRequestTab as 'leave' | 'issue')} className="mt-4 text-sm text-blue-600 hover:underline">Create a new request</button>
          </div>
        ) : (
          allRequests.filter(r => r.type === activeRequestTab).map((req) => (
            <div key={req.id} className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <p className="text-sm font-semibold text-slate-900">{req.subject}</p>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusStyle(req.status).bg}`}>
                      {req.status}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${getPriorityStyle(req.priority)}`}>
                      {req.priority}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mb-2">{req.description}</p>
                  <div className="flex items-center gap-4 text-xs text-slate-400">
                    <span>Applied on: {req.appliedDate}</span>
                    <span>•</span>
                    <span>For: {req.date}</span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </div>
              
              {/* Status Timeline */}
              {req.status === 'pending' && (
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
                    <span>Awaiting review from administration</span>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* New Request Modal */}
      {showNewRequestModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">
                {requestType === 'leave' ? 'New Leave Application' : 'Report an Issue'}
              </h3>
              <button onClick={() => setShowNewRequestModal(false)} className="text-slate-400 hover:text-slate-600">
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            {/* Type Selector */}
            <div className="flex gap-2 mb-4">
              <button onClick={() => setRequestType('leave')} className={cn("flex-1 py-2 rounded-lg text-sm font-medium transition-colors", requestType === 'leave' ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600")}>Leave Application</button>
              <button onClick={() => setRequestType('issue')} className={cn("flex-1 py-2 rounded-lg text-sm font-medium transition-colors", requestType === 'issue' ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600")}>Report Issue</button>
            </div>

            <div className="space-y-4">
              {requestType === 'leave' ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Subject *</label>
                    <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm">
                      <option>Medical Leave</option>
                      <option>Family Function</option>
                      <option>Personal Work</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">From Date *</label>
                      <input type="date" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">To Date *</label>
                      <input type="date" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Reason *</label>
                    <textarea rows={3} placeholder="Describe the reason for leave..." className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Attach Document (Optional)</label>
                    <div className="border-2 border-dashed border-slate-200 rounded-lg p-4 text-center">
                      <Paperclip className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                      <p className="text-xs text-slate-500">Upload medical certificate or supporting document</p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Issue Category *</label>
                    <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm">
                      <option>Attendance Correction</option>
                      <option>Fee Related</option>
                      <option>Hostel Issue</option>
                      <option>Academic Issue</option>
                      <option>Technical Issue</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Subject *</label>
                    <input type="text" placeholder="Brief subject of the issue" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Description *</label>
                    <textarea rows={3} placeholder="Describe the issue in detail..." className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Priority</label>
                    <div className="flex gap-2">
                      <button className="px-3 py-1.5 text-xs bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200">Low</button>
                      <button className="px-3 py-1.5 text-xs bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200">Medium</button>
                      <button className="px-3 py-1.5 text-xs bg-red-100 text-red-700 rounded-lg hover:bg-red-200">High</button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Attach Image (Optional)</label>
                    <div className="border-2 border-dashed border-slate-200 rounded-lg p-4 text-center">
                      <Paperclip className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                      <p className="text-xs text-slate-500">Upload a photo of the issue (max 5MB)</p>
                    </div>
                  </div>
                </>
              )}
              
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowNewRequestModal(false)} className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-sm font-medium hover:bg-slate-50">Cancel</button>
                <button onClick={() => setShowNewRequestModal(false)} className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 flex items-center justify-center gap-2">
                  <Send className="w-4 h-4" />
                  Submit Request
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
