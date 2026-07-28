'use client'

import { useState, useMemo } from 'react'
import { Download, FileText, Clock, CheckCircle, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAdminDashboardContext } from './AdminDashboardProvider'
import { StatCard } from './StatCard'

export function RequestsView() {
  const { requests } = useAdminDashboardContext()
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all')

  const filteredRequests = useMemo(() =>
    requests.filter(r => {
      const matchesType = typeFilter === 'all' || r.type === typeFilter
      const matchesStatus = statusFilter === 'all' || r.status === statusFilter
      return matchesType && matchesStatus
    }),
    [requests, typeFilter, statusFilter]
  )

  const stats = useMemo(() => ({
    total: requests.length,
    pending: requests.filter(r => r.status === 'pending').length,
    approved: requests.filter(r => r.status === 'approved').length,
    rejected: requests.filter(r => r.status === 'rejected').length,
  }), [requests])

  const handleApprove = async (id: string, title: string) => {
    try {
      // TODO: Integrate with API
      console.log(`Approving request ${id}: ${title}`)
      alert(`Request "${title}" approved successfully`)
    } catch (err) {
      alert('Failed to approve request')
    }
  }

  const handleReject = async (id: string, title: string) => {
    try {
      // TODO: Integrate with API
      console.log(`Rejecting request ${id}: ${title}`)
      alert(`Request "${title}" rejected`)
    } catch (err) {
      alert('Failed to reject request')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Requests & Approvals</h2>
          <p className="text-sm text-slate-500 mt-1">Review and process student requests</p>
        </div>
        <button type="button" className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 shadow-lg shadow-blue-600/20">
          <Download className="w-4 h-4" /> Export Report
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Requests" value={stats.total} icon={FileText} color="blue" />
        <StatCard label="Pending" value={stats.pending} icon={Clock} color="amber" />
        <StatCard label="Approved" value={stats.approved} icon={CheckCircle} color="green" />
        <StatCard label="Rejected" value={stats.rejected} icon={XCircle} color="red" />
      </div>

      <div className="flex flex-wrap gap-2">
        <span className="text-xs text-slate-500 mr-2">Type:</span>
        <button onClick={() => setTypeFilter('all')} type="button" className={cn("px-3 py-1.5 rounded-lg text-xs font-medium", typeFilter === 'all' ? "bg-slate-800 text-white" : "bg-white text-slate-600 border border-slate-200")}>All</button>
        <button onClick={() => setTypeFilter('leave')} type="button" className={cn("px-3 py-1.5 rounded-lg text-xs font-medium", typeFilter === 'leave' ? "bg-blue-600 text-white" : "bg-white text-slate-600 border border-slate-200")}>Leave</button>
        <button onClick={() => setTypeFilter('issue')} type="button" className={cn("px-3 py-1.5 rounded-lg text-xs font-medium", typeFilter === 'issue' ? "bg-blue-600 text-white" : "bg-white text-slate-600 border border-slate-200")}>Issue</button>
        <button onClick={() => setTypeFilter('permission')} type="button" className={cn("px-3 py-1.5 rounded-lg text-xs font-medium", typeFilter === 'permission' ? "bg-blue-600 text-white" : "bg-white text-slate-600 border border-slate-200")}>Permission</button>
        <button onClick={() => setTypeFilter('certificate')} type="button" className={cn("px-3 py-1.5 rounded-lg text-xs font-medium", typeFilter === 'certificate' ? "bg-blue-600 text-white" : "bg-white text-slate-600 border border-slate-200")}>Certificate</button>
        <div className="border-l border-slate-200 mx-2" />
        <span className="text-xs text-slate-500 mr-2">Status:</span>
        <button onClick={() => setStatusFilter('all')} type="button" className={cn("px-3 py-1.5 rounded-lg text-xs font-medium", statusFilter === 'all' ? "bg-slate-800 text-white" : "bg-white text-slate-600 border border-slate-200")}>All</button>
        <button onClick={() => setStatusFilter('pending')} type="button" className={cn("px-3 py-1.5 rounded-lg text-xs font-medium", statusFilter === 'pending' ? "bg-amber-600 text-white" : "bg-white text-slate-600 border border-slate-200")}>Pending</button>
        <button onClick={() => setStatusFilter('approved')} type="button" className={cn("px-3 py-1.5 rounded-lg text-xs font-medium", statusFilter === 'approved' ? "bg-green-600 text-white" : "bg-white text-slate-600 border border-slate-200")}>Approved</button>
        <button onClick={() => setStatusFilter('rejected')} type="button" className={cn("px-3 py-1.5 rounded-lg text-xs font-medium", statusFilter === 'rejected' ? "bg-red-600 text-white" : "bg-white text-slate-600 border border-slate-200")}>Rejected</button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left text-xs font-semibold text-slate-600 px-4 py-3">Student</th>
                <th className="text-left text-xs font-semibold text-slate-600 px-4 py-3">Type</th>
                <th className="text-left text-xs font-semibold text-slate-600 px-4 py-3">Title</th>
                <th className="text-center text-xs font-semibold text-slate-600 px-4 py-3">Priority</th>
                <th className="text-center text-xs font-semibold text-slate-600 px-4 py-3">Date</th>
                <th className="text-center text-xs font-semibold text-slate-600 px-4 py-3">Status</th>
                <th className="text-center text-xs font-semibold text-slate-600 px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRequests.map((req) => (
                <tr key={req.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-slate-900">{req.student}</p>
                      <p className="text-[10px] text-slate-500">{req.roll} • {req.batch}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs capitalize text-slate-600">{req.type}</span>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-slate-700">{req.title}</p>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={cn(
                      "text-[10px] font-medium px-2 py-0.5 rounded-full",
                      req.priority === 'high' ? "bg-red-100 text-red-700" :
                      req.priority === 'medium' ? "bg-amber-100 text-amber-700" :
                      "bg-slate-100 text-slate-600"
                    )}>{req.priority}</span>
                  </td>
                  <td className="px-4 py-3 text-center text-sm text-slate-600">{req.date}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={cn(
                      "text-xs font-medium px-2 py-1 rounded-full",
                      req.status === 'pending' ? "bg-amber-100 text-amber-700" :
                      req.status === 'approved' ? "bg-green-100 text-green-700" :
                      "bg-red-100 text-red-700"
                    )}>{req.status}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {req.status === 'pending' && (
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => handleApprove(req.id, req.title)}
                          type="button"
                          aria-label={`Approve ${req.title}`}
                          className="p-1.5 rounded hover:bg-green-50 text-green-600"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleReject(req.id, req.title)}
                          type="button"
                          aria-label={`Reject ${req.title}`}
                          className="p-1.5 rounded hover:bg-red-50 text-red-600"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
