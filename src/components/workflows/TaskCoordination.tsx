'use client'

import { useState } from 'react'
import { Task, UserRole } from '@/types'
import { getStatusColor } from '@/lib/workflow-engine'
import {
    CheckSquare,
    Clock,
    Users,
    AlertCircle,
    MoreVertical,
    Plus,
    MessageCircle,
    Paperclip,
    Calendar,
    Filter,
    Search,
    LayoutGrid,
    List as ListIcon
} from 'lucide-react'

interface TaskCoordinationProps {
    tasks: Task[]
    userRole: UserRole
    onAddTask?: () => void
    onUpdateTask?: (taskId: string, newStatus: Task['status']) => void
}

export default function TaskCoordination({ tasks, userRole, onAddTask, onUpdateTask }: TaskCoordinationProps) {
    const [view, setView] = useState<'kanban' | 'list'>('kanban')

    const columns: { label: string, status: Task['status'] }[] = [
        { label: 'To Do', status: 'created' },
        { label: 'In Progress', status: 'in_progress' },
        { label: 'Review', status: 'under_review' },
        { label: 'Completed', status: 'done' }
    ]

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Search & Filter Header */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center space-x-2 w-full md:w-auto">
                    <div className="relative flex-1 md:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search tasks, committees..."
                            className="w-full bg-white border border-gray-100 pl-11 pr-4 py-2.5 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all shadow-sm"
                        />
                    </div>
                    <button className="p-2.5 bg-white border border-gray-100 rounded-2xl hover:bg-gray-50 transition-all shadow-sm">
                        <Filter className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                <div className="flex items-center space-x-3 w-full md:w-auto">
                    <div className="bg-white border border-gray-100 rounded-2xl p-1 flex shadow-sm">
                        <button
                            onClick={() => setView('kanban')}
                            className={`p-2 rounded-xl transition-all ${view === 'kanban' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-gray-400 hover:bg-gray-50'}`}
                        >
                            <LayoutGrid className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setView('list')}
                            className={`p-2 rounded-xl transition-all ${view === 'list' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-gray-400 hover:bg-gray-50'}`}
                        >
                            <ListIcon className="w-4 h-4" />
                        </button>
                    </div>

                    <button
                        onClick={onAddTask}
                        className="btn-primary py-2.5 px-6 rounded-2xl flex items-center space-x-2 shadow-xl shadow-blue-600/10"
                    >
                        <Plus className="w-4 h-4" />
                        <span>New Task</span>
                    </button>
                </div>
            </div>

            {view === 'kanban' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {columns.map(col => (
                        <div key={col.status} className="flex flex-col space-y-4">
                            <div className="flex items-center justify-between px-2">
                                <div className="flex items-center space-x-2">
                                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">{col.label}</h3>
                                    <span className="w-5 h-5 bg-gray-100 rounded flex items-center justify-center text-[10px] font-bold text-gray-500">
                                        {tasks.filter(t => t.status === col.status).length}
                                    </span>
                                </div>
                                <button className="p-1 hover:bg-gray-100 rounded text-gray-400">
                                    <MoreVertical className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="flex-1 min-h-[500px] bg-gray-50/50 rounded-[2rem] border border-gray-100 border-dashed p-4 space-y-4">
                                {tasks.filter(t => t.status === col.status).map(task => (
                                    <TaskCard key={task.id} task={task} />
                                ))}
                                <button className="w-full py-4 rounded-2xl border border-gray-100 border-dashed text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:bg-white hover:text-blue-600 transition-all">
                                    Drop to Add
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                                <th className="px-8 py-5">Task</th>
                                <th className="px-8 py-5">Assignee</th>
                                <th className="px-8 py-5">Status</th>
                                <th className="px-8 py-5">Due Date</th>
                                <th className="px-8 py-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {tasks.map(task => (
                                <tr key={task.id} className="hover:bg-blue-50/20 transition-colors">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                                                <CheckSquare className="w-4 h-4" />
                                            </div>
                                            <span className="text-sm font-bold text-gray-900">{task.title}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center space-x-2">
                                            <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold text-blue-600">
                                                {task.assignee?.charAt(0).toUpperCase() || '?'}
                                            </div>
                                            <span className="text-xs font-bold text-gray-500">{task.assignee || 'Unassigned'}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusColor(task.status)}`}>
                                            {task.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className="text-xs font-bold text-gray-500">{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}</span>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <button className="p-2 hover:bg-gray-100 rounded-xl text-gray-400">
                                            <MoreVertical className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}

function TaskCard({ task }: { task: Task }) {
    return (
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-blue-900/[0.04] transition-all group cursor-pointer border-l-4 border-l-blue-600/10 hover:border-l-blue-600">
            <div className="flex items-center justify-between mb-4">
                <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded-full">
                    {task.committee || 'General'}
                </span>
                <div className="w-6 h-6 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-[10px] font-black text-gray-400 overflow-hidden shadow-sm">
                    {task.assignee?.charAt(0).toUpperCase() || '?'}
                </div>
            </div>

            <h4 className="text-sm font-bold text-gray-900 leading-tight mb-3 group-hover:text-blue-600 transition-colors">
                {task.title}
            </h4>

            <p className="text-xs text-gray-400 font-medium line-clamp-2 mb-6 leading-relaxed">
                {task.description}
            </p>

            <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                <div className="flex items-center space-x-3 text-gray-300">
                    <span className="flex items-center text-[10px] font-bold">
                        <MessageCircle className="w-3 h-3 mr-1" /> 2
                    </span>
                    <span className="flex items-center text-[10px] font-bold">
                        <Paperclip className="w-3 h-3 mr-1" /> 1
                    </span>
                </div>
                {task.dueDate && (
                    <div className="flex items-center text-[10px] font-bold text-gray-400">
                        <Clock className="w-3 h-3 mr-1" />
                        {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                )}
            </div>
        </div>
    )
}
