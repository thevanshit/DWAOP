'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CalendarDays, CheckCircle2, XCircle, Clock, AlertTriangle,
  MessageSquare, ChevronRight, Filter, Search, User, FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { LEAVE_REQUESTS, LeaveRequest } from '@/lib/facultyData';

export default function LeaveApprovalView() {
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRequests = LEAVE_REQUESTS.filter(r => {
    const matchesSearch = r.studentName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          r.rollNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = activeTab === 'pending' ? r.status === 'created' || r.status === 'under_review' :
                         activeTab === 'approved' ? r.status === 'approved' :
                         r.status === 'rejected';
    return matchesSearch && matchesStatus;
  });

  const pendingCount = LEAVE_REQUESTS.filter(r => r.status === 'created' || r.status === 'under_review').length;
  const approvedCount = LEAVE_REQUESTS.filter(r => r.status === 'approved').length;
  const rejectedCount = LEAVE_REQUESTS.filter(r => r.status === 'rejected').length;

  const getLeaveTypeColor = (type: string) => {
    switch (type) {
      case 'medical': return 'bg-red-100 text-red-700';
      case 'academic': return 'bg-blue-100 text-blue-700';
      case 'personal': return 'bg-purple-100 text-purple-700';
      case 'emergency': return 'bg-amber-100 text-amber-700';
      case 'official': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Leave Approvals</h2>
          <p className="text-sm text-gray-500 mt-1">Review and process student leave requests</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          onClick={() => setActiveTab('pending')}
          className={cn(
            "p-5 rounded-2xl border transition-all text-left",
            activeTab === 'pending' 
              ? "bg-white shadow-lg border-amber-300 border-2" 
              : "bg-white shadow-md border-gray-100 hover:border-gray-200"
          )}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-500">Pending</span>
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{pendingCount}</p>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          onClick={() => setActiveTab('approved')}
          className={cn(
            "p-5 rounded-2xl border transition-all text-left",
            activeTab === 'approved' 
              ? "bg-white shadow-lg border-green-300 border-2" 
              : "bg-white shadow-md border-gray-100 hover:border-gray-200"
          )}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-500">Approved</span>
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{approvedCount}</p>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          onClick={() => setActiveTab('rejected')}
          className={cn(
            "p-5 rounded-2xl border transition-all text-left",
            activeTab === 'rejected' 
              ? "bg-white shadow-lg border-red-300 border-2" 
              : "bg-white shadow-md border-gray-100 hover:border-gray-200"
          )}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-500">Rejected</span>
            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{rejectedCount}</p>
        </motion.button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by student name or roll number..."
          className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0052CC]/20 focus:border-[#0052CC]"
        />
      </div>

      {/* Request List */}
      <div className="space-y-3">
        {filteredRequests.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-md border border-gray-100">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 font-medium">No leave requests found</p>
          </div>
        ) : (
          filteredRequests.map((request) => (
            <motion.div
              key={request.id}
              whileHover={{ x: 4 }}
              onClick={() => setSelectedRequest(request)}
              className="bg-white rounded-xl p-5 shadow-md border border-gray-100 hover:shadow-lg transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#0052CC] to-[#0747A6] rounded-xl flex items-center justify-center text-white font-bold">
                    {request.studentName.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-bold text-gray-900">{request.studentName}</p>
                      <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full capitalize", getLeaveTypeColor(request.leaveType))}>
                        {request.leaveType}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">{request.rollNumber} • {request.batch}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <CalendarDays className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={cn(
                    "text-xs font-bold px-3 py-1 rounded-full",
                    request.status === 'approved' ? "bg-green-100 text-green-700" :
                    request.status === 'rejected' ? "bg-red-100 text-red-700" :
                    "bg-amber-100 text-amber-700"
                  )}>
                    {request.status === 'created' ? 'Pending' : request.status.replace('_', ' ')}
                  </span>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-3 pl-16 line-clamp-2">{request.reason}</p>
            </motion.div>
          ))
        )}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedRequest && (
          <LeaveDetailModal 
            request={selectedRequest} 
            onClose={() => setSelectedRequest(null)}
            onApprove={() => setShowApproveModal(true)}
          />
        )}
      </AnimatePresence>

      {/* Approve Modal */}
      <AnimatePresence>
        {showApproveModal && selectedRequest && (
          <ApproveModal 
            request={selectedRequest}
            onClose={() => {
              setShowApproveModal(false);
              setSelectedRequest(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function LeaveDetailModal({ request, onClose, onApprove }: { request: LeaveRequest; onClose: () => void; onApprove: () => void }) {
  const getLeaveTypeColor = (type: string) => {
    switch (type) {
      case 'medical': return 'bg-red-100 text-red-700';
      case 'academic': return 'bg-blue-100 text-blue-700';
      case 'personal': return 'bg-purple-100 text-purple-700';
      case 'emergency': return 'bg-amber-100 text-amber-700';
      case 'official': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <>
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50" 
        onClick={onClose}
      />
      <motion.div 
        initial={{ x: '100%' }} 
        animate={{ x: 0 }} 
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 30 }}
        className="fixed right-0 top-0 bottom-0 w-[500px] bg-white rounded-l-3xl shadow-2xl z-50 overflow-y-auto"
      >
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">LEAVE-{request.id.split('-')[1]}</span>
            <button onClick={onClose} className="p-2.5 hover:bg-gray-100 rounded-xl transition-colors">
              <XCircle className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 bg-gradient-to-br from-[#0052CC] to-[#0747A6] rounded-2xl flex items-center justify-center text-white font-bold text-lg">
              {request.studentName.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{request.studentName}</h2>
              <p className="text-sm text-gray-500">{request.rollNumber} • {request.batch}</p>
            </div>
          </div>

          <div className="flex gap-2 mb-6">
            <span className={cn("text-xs font-bold px-3 py-1.5 rounded-full capitalize", getLeaveTypeColor(request.leaveType))}>
              {request.leaveType} Leave
            </span>
            <span className={cn(
              "text-xs font-bold px-3 py-1.5 rounded-full",
              request.status === 'approved' ? "bg-green-100 text-green-700" :
              request.status === 'rejected' ? "bg-red-100 text-red-700" :
              "bg-amber-100 text-amber-700"
            )}>
              {request.status === 'created' ? 'Pending Review' : request.status.replace('_', ' ')}
            </span>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Leave Period</label>
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl">
                <CalendarDays className="w-5 h-5 text-gray-400" />
                <span className="font-medium text-gray-900">
                  {new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Reason</label>
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-700">{request.reason}</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Applied On</label>
              <p className="text-sm text-gray-700">{new Date(request.appliedDate).toLocaleDateString()}</p>
            </div>

            {request.comments && (
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Review Comments</label>
                <div className="p-4 bg-blue-50 rounded-xl">
                  <p className="text-sm text-gray-700">{request.comments}</p>
                  {request.reviewedBy && (
                    <p className="text-xs text-gray-500 mt-2">By: {request.reviewedBy} • {request.reviewedDate?.toLocaleDateString()}</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {request.status === 'created' || request.status === 'under_review' ? (
            <div className="flex gap-3 mt-8">
              <button
                onClick={onClose}
                className="flex-1 py-3 border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
              >
                Reject
              </button>
              <button
                onClick={onApprove}
                className="flex-1 py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-colors shadow-lg shadow-green-500/25"
              >
                Approve
              </button>
            </div>
          ) : null}
        </div>
      </motion.div>
    </>
  );
}

function ApproveModal({ request, onClose }: { request: LeaveRequest; onClose: () => void }) {
  const [comment, setComment] = useState('');

  return (
    <>
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-[60]" 
        onClick={onClose}
      />
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }} 
        exit={{ scale: 0.9, opacity: 0 }}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] bg-white rounded-2xl shadow-2xl z-[60] p-6"
      >
        <h3 className="text-lg font-bold text-gray-900 mb-2">Approve Leave Request</h3>
        <p className="text-sm text-gray-500 mb-4">Add any comments for the student (optional)</p>
        
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Enter approval comments..."
          rows={3}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0052CC]/20 focus:border-[#0052CC] resize-none mb-4"
        />
        
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-colors"
          >
            Approve
          </button>
        </div>
      </motion.div>
    </>
  );
}
