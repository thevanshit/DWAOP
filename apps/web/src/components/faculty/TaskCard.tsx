'use client';

import React, { useState } from 'react';
import { Task } from '@/types';
import { PriorityBadge, StatusBadge, CommitteeTag, DueDateChip } from './Badges';
import { Avatar } from './Avatar';
import { 
  MoreHorizontal, 
  MessageCircle, 
  Paperclip, 
  Clock, 
  CheckSquare,
  GripVertical,
  Calendar,
  User,
  Flag
} from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onDragStart?: () => void;
  onClick?: () => void;
  isDragging?: boolean;
}

export function TaskCard({ task, onDragStart, onClick, isDragging }: TaskCardProps) {
  const [showActions, setShowActions] = useState(false);
  
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onClick={onClick}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      className={`
        group
        bg-white 
        rounded-xl 
        border border-gray-100
        shadow-sm
        hover:shadow-lg 
        hover:shadow-gray-900/[0.06]
        hover:border-blue-200/50
        transition-all duration-200
        cursor-grab active:cursor-grabbing
        ${isDragging ? 'opacity-50 rotate-2 scale-105' : ''}
      `}
    >
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-semibold text-gray-400 uppercase tracking-wider">
              {task.id}
            </span>
            {task.priority && <PriorityBadge priority={task.priority} showLabel={false} />}
          </div>
          
          <div className="flex items-center gap-1">
            <button 
              className={`
                p-1 rounded
                text-gray-400 hover:text-gray-600 hover:bg-gray-100
                opacity-0 group-hover:opacity-100
                transition-all duration-150
              `}
            >
              <GripVertical className="w-4 h-4" />
            </button>
            <button 
              className={`
                p-1 rounded
                text-gray-400 hover:text-gray-600 hover:bg-gray-100
                opacity-0 group-hover:opacity-100
                transition-all duration-150
              `}
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        {/* Title */}
        <h4 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2 leading-snug">
          {task.title}
        </h4>
        
        {/* Description */}
        {task.description && (
          <p className="text-xs text-gray-500 mb-3 line-clamp-2 leading-relaxed">
            {task.description}
          </p>
        )}
        
        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {task.committee && <CommitteeTag committee={task.committee} />}
          {task.category && (
            <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-gray-50 text-gray-500 capitalize">
              {task.category}
            </span>
          )}
        </div>
        
        {/* Subtasks indicator */}
        {task.subtasks && task.subtasks.length > 0 && (
          <div className="flex items-center gap-1.5 mb-3 text-xs text-gray-500">
            <CheckSquare className="w-3.5 h-3.5" />
            <span>
              {task.subtasks.filter(s => s.status === 'done').length}/{task.subtasks.length} subtasks
            </span>
          </div>
        )}
        
        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-50">
          <div className="flex items-center gap-3">
            {task.dueDate && <DueDateChip dueDate={new Date(task.dueDate)} />}
            
            {task.assigneeDetails && (
              <div className="flex items-center gap-1 text-gray-400">
                <User className="w-3.5 h-3.5" />
                <span className="text-[10px] font-medium truncate max-w-[80px]">
                  {task.assigneeDetails.name}
                </span>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2 text-gray-400">
            {task.comments && task.comments.length > 0 && (
              <div className="flex items-center gap-1">
                <MessageCircle className="w-3.5 h-3.5" />
                <span className="text-[10px]">{task.comments.length}</span>
              </div>
            )}
            {task.attachments && task.attachments.length > 0 && (
              <div className="flex items-center gap-1">
                <Paperclip className="w-3.5 h-3.5" />
                <span className="text-[10px]">{task.attachments.length}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface TaskRowProps {
  task: Task;
  onClick?: () => void;
}

export function TaskRow({ task, onClick }: TaskRowProps) {
  return (
    <div 
      onClick={onClick}
      className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50/80 transition-colors cursor-pointer group"
    >
      <div className="w-10 h-10 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-lg flex items-center justify-center">
        <CheckSquare className="w-5 h-5 text-blue-600" />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-semibold text-gray-400">{task.id}</span>
          {task.priority && <PriorityBadge priority={task.priority} showLabel={false} />}
        </div>
        <h4 className="font-medium text-gray-900 text-sm truncate">{task.title}</h4>
        <div className="flex items-center gap-2 mt-1">
          {task.committee && <CommitteeTag committee={task.committee} />}
          {task.dueDate && <DueDateChip dueDate={new Date(task.dueDate)} />}
        </div>
      </div>
      
      <StatusBadge status={task.status} />
      
      {task.assigneeDetails && (
        <Avatar name={task.assigneeDetails.name} size="sm" />
      )}
    </div>
  );
}
