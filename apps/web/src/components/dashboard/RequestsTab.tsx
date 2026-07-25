'use client'

import { useState } from 'react'
import { FileText, AlertCircle, HelpCircle, Calendar as CalendarIcon, Plus } from 'lucide-react'
import SectionHeader from '@/components/ui/SectionHeader'
import StatusBadge from '@/components/ui/StatusBadge'

interface Request {
    id: number
    type: 'leave' | 'issue' | 'permission' | 'clarification'
    subject: string
    date: string
    status: 'pending' | 'approved' | 'rejected'
    description: string
}

interface RequestsTabProps {
    requests: Request[]
}

export default function RequestsTab({ requests }: RequestsTabProps) {
    const [activeTab, setActiveTab] = useState<'leave' | 'issue' | 'permission' | 'clarification'>('leave')

    const filteredRequests = requests.filter(r => r.type === activeTab)

    const tabs = [
        { id: 'leave', label: 'Leave Applications', icon: <CalendarIcon className="w-4 h-4" />, count: requests.filter(r => r.type === 'leave').length },
        { id: 'issue', label: 'Issue Reports', icon: <AlertCircle className="w-4 h-4" />, count: requests.filter(r => r.type === 'issue').length },
        { id: 'permission', label: 'Permissions', icon: <FileText className="w-4 h-4" />, count: requests.filter(r => r.type === 'permission').length },
        { id: 'clarification', label: 'Clarifications', icon: <HelpCircle className="w-4 h-4" />, count: requests.filter(r => r.type === 'clarification').length },
    ]

    return (
        <div className="space-y-6">
            <SectionHeader
                title="Requests & Applications"
                subtitle="Manage your leave applications, issues, and clarifications"
                action={{
                    label: 'New Request',
                    onClick: () => console.log('New request'),
                    icon: <Plus className="w-4 h-4" />
                }}
            />

            {/* Tab Navigation */}
            <div className="bg-white rounded-xl border border-gray-100 p-2 shadow-sm">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id
                                    ? 'bg-blue-600 text-white shadow-sm'
                                    : 'text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            {tab.icon}
                            <span className="hidden sm:inline">{tab.label}</span>
                            <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                            {tab.count > 0 && (
                                <span className={`ml-1 px-1.5 py-0.5 rounded-full text-xs ${activeTab === tab.id ? 'bg-white/20' : 'bg-gray-100'
                                    }`}>
                                    {tab.count}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Requests List */}
            {filteredRequests.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-100 p-12 text-center shadow-sm">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        {tabs.find(t => t.id === activeTab)?.icon}
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">No {tabs.find(t => t.id === activeTab)?.label}</h3>
                    <p className="text-sm text-gray-500 mb-4">You haven't submitted any {activeTab} requests yet.</p>
                    <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                        Create New Request
                    </button>
                </div>
            ) : (
                <div className="space-y-3">
                    {filteredRequests.map((request) => (
                        <div key={request.id} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="font-semibold text-gray-900">{request.subject}</h3>
                                        <StatusBadge status={request.status} />
                                    </div>
                                    <p className="text-sm text-gray-600 mb-2">{request.description}</p>
                                    <div className="flex items-center gap-4 text-xs text-gray-500">
                                        <span>Submitted: {request.date}</span>
                                        <span>•</span>
                                        <span className="capitalize">{request.type}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                                    View Details
                                </button>
                                {request.status === 'pending' && (
                                    <>
                                        <span className="text-gray-300">•</span>
                                        <button className="text-sm text-gray-600 hover:text-gray-700 font-medium">
                                            Edit
                                        </button>
                                        <span className="text-gray-300">•</span>
                                        <button className="text-sm text-red-600 hover:text-red-700 font-medium">
                                            Cancel
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Quick Actions */}
            <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 border border-blue-200">
                    <h3 className="font-semibold text-blue-900 mb-2">Need to Apply for Leave?</h3>
                    <p className="text-sm text-blue-700 mb-4">Submit your leave application with supporting documents</p>
                    <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                        Apply for Leave
                    </button>
                </div>

                <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-5 border border-amber-200">
                    <h3 className="font-semibold text-amber-900 mb-2">Report an Issue</h3>
                    <p className="text-sm text-amber-700 mb-4">Facing any academic or administrative issues?</p>
                    <button className="px-4 py-2 bg-amber-600 text-white text-sm font-medium rounded-lg hover:bg-amber-700 transition-colors">
                        Report Issue
                    </button>
                </div>
            </div>
        </div>
    )
}
