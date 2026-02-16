'use client';

import React from 'react';
import { Task } from '@/types';
import { PriorityBadge, StatusBadge, DueDateChip, CommitteeTag } from './Badges';
import { Avatar } from './Avatar';
import { Building2, ChevronRight, Clock, User, MoreHorizontal } from 'lucide-react';

interface AdminTasksPanelProps {
  tasks: Task[];
  onTaskClick?: (task: Task) => void;
}

export function AdminTasksPanel({ tasks, onTaskClick }: AdminTasksPanelProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-amber-50/50 to-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
            <Building2 className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Admin Assigned Tasks</h3>
            <p className="text-xs text-gray-500">Tasks from HOD and Administration</p>
          </div>
        </div>
        <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full">
          {tasks.length} Tasks
        </span>
      </div>
      
      {/* Task List */}
      <div className="divide-y divide-gray-50">
        {tasks.map((task, idx) => (
          <div 
            key={task.id}
            onClick={() => onTaskClick?.(task)}
            style={{ animationDelay: `${idx * 50}ms` }}
            className="
              p-4 
              hover:bg-gray-50/80 
              cursor-pointer 
              group
              transition-colors
              animate-fade-in
            "
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-lg flex items-center justify-center shrink-0">
                <span className="text-[10px] font-bold text-amber-600">{task.id.split('-')[0]}</span>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-semibold text-gray-400">{task.id}</span>
                  {task.priority && <PriorityBadge priority={task.priority} showLabel={false} />}
                </div>
                
                <h4 className="font-medium text-gray-900 text-sm mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
                  {task.title}
                </h4>
                
                <div className="flex items-center gap-2 flex-wrap">
                  {task.committee && <CommitteeTag committee={task.committee} />}
                  {task.dueDate && <DueDateChip dueDate={new Date(task.dueDate)} />}
                </div>
              </div>
              
              <div className="flex flex-col items-end gap-2">
                <StatusBadge status={task.status} />
                {task.assigneeDetails && (
                  <div className="flex items-center gap-1 text-gray-400">
                    <User className="w-3 h-3" />
                    <span className="text-[10px]">{task.assigneeDetails.assignedBy}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Footer */}
      <div className="px-5 py-3 border-t border-gray-100 bg-gray-50/50">
        <button className="w-full text-center text-sm text-blue-600 font-medium hover:text-blue-700 transition-colors flex items-center justify-center gap-1">
          View All Admin Tasks
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
