'use client';

import React from 'react';
import { Task } from '@/types';
import { PriorityBadge, StatusBadge, DueDateChip, CommitteeTag } from './Badges';
import { Avatar } from './Avatar';
import { Users, ChevronRight, MessageCircle } from 'lucide-react';

interface TeamCollaborationProps {
  tasks: Task[];
  onTaskClick?: (task: Task) => void;
}

export function TeamCollaboration({ tasks, onTaskClick }: TeamCollaborationProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-purple-50/50 to-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
            <Users className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Team Collaboration</h3>
            <p className="text-xs text-gray-500">Tasks shared with colleagues</p>
          </div>
        </div>
        <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded-full">
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
              <div className="w-10 h-10 bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-lg flex items-center justify-center shrink-0">
                <span className="text-[10px] font-bold text-purple-600">{task.id.split('-')[0]}</span>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-semibold text-gray-400">{task.id}</span>
                  {task.priority && <PriorityBadge priority={task.priority} showLabel={false} />}
                </div>
                
                <h4 className="font-medium text-gray-900 text-sm mb-2 line-clamp-1 group-hover:text-purple-600 transition-colors">
                  {task.title}
                </h4>
                
                <div className="flex items-center gap-2 flex-wrap">
                  {task.committee && <CommitteeTag committee={task.committee} />}
                  {task.dueDate && <DueDateChip dueDate={new Date(task.dueDate)} />}
                  {task.comments && task.comments.length > 0 && (
                    <div className="flex items-center gap-1 text-gray-400">
                      <MessageCircle className="w-3 h-3" />
                      <span className="text-[10px]">{task.comments.length}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex flex-col items-end gap-2">
                <StatusBadge status={task.status} />
                {task.assigneeDetails && (
                  <Avatar name={task.assigneeDetails.name} size="sm" />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Footer */}
      <div className="px-5 py-3 border-t border-gray-100 bg-gray-50/50">
        <button className="w-full text-center text-sm text-purple-600 font-medium hover:text-purple-700 transition-colors flex items-center justify-center gap-1">
          View All Team Tasks
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
