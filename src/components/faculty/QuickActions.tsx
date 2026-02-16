'use client';

import React from 'react';
import { 
  ClipboardList, 
  FileText, 
  Award, 
  Calendar, 
  Clock, 
  BarChart3,
  Plus,
  ArrowRight
} from 'lucide-react';

interface QuickActionsProps {
  onAction?: (actionId: string) => void;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  ClipboardList,
  FileText,
  Award,
  Calendar,
  Clock,
  BarChart3,
};

export function QuickActions({ onAction }: QuickActionsProps) {
  const actions = [
    { id: 'qa-1', label: 'Take Attendance', icon: 'ClipboardList', description: 'Open attendance session', color: 'bg-blue-50 text-blue-600 border-blue-100 hover:border-blue-300' },
    { id: 'qa-2', label: 'Create Assignment', icon: 'FileText', description: 'Post new assignment', color: 'bg-green-50 text-green-600 border-green-100 hover:border-green-300' },
    { id: 'qa-3', label: 'Enter Marks', icon: 'Award', description: 'Submit internal marks', color: 'bg-purple-50 text-purple-600 border-purple-100 hover:border-purple-300' },
    { id: 'qa-4', label: 'Schedule Event', icon: 'Calendar', description: 'Create event/meeting', color: 'bg-amber-50 text-amber-600 border-amber-100 hover:border-amber-300' },
    { id: 'qa-5', label: 'Leave Request', icon: 'Clock', description: 'Submit leave application', color: 'bg-pink-50 text-pink-600 border-pink-100 hover:border-pink-300' },
    { id: 'qa-6', label: 'Task Report', icon: 'BarChart3', description: 'View analytics', color: 'bg-cyan-50 text-cyan-600 border-cyan-100 hover:border-cyan-300' },
  ];
  
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-gray-900">Quick Actions</h3>
          <p className="text-xs text-gray-500">Frequently used operations</p>
        </div>
      </div>
      
      {/* Actions Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {actions.map((action, idx) => {
          const Icon = iconMap[action.icon];
          
          return (
            <button
              key={action.id}
              onClick={() => onAction?.(action.id)}
              style={{ animationDelay: `${idx * 50}ms` }}
              className={`
                relative
                p-4 
                rounded-xl 
                border border-dashed
                ${action.color}
                hover:shadow-md 
                hover:-translate-y-0.5
                transition-all duration-200
                group
                text-left
                animate-fade-in-up
                overflow-hidden
              `}
            >
              {/* Background decoration */}
              <div className="absolute -right-4 -bottom-4 w-16 h-16 rounded-full opacity-10 group-hover:scale-150 transition-transform duration-300" 
                style={{ backgroundColor: action.color.split(' ')[1].replace('text-', '').replace('-600', '') }}
              />
              
              <div className="relative">
                <div className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  {Icon && <Icon className="w-5 h-5" />}
                </div>
                
                <h4 className="font-semibold text-gray-900 text-sm mb-0.5">
                  {action.label}
                </h4>
                <p className="text-[10px] text-gray-500 leading-tight">
                  {action.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (task: any) => void;
  defaultStatus?: string;
}

export function CreateTaskModal({ isOpen, onClose, onSubmit, defaultStatus }: CreateTaskModalProps) {
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [priority, setPriority] = React.useState('medium');
  const [committee, setCommittee] = React.useState('Teaching');
  const [category, setCategory] = React.useState('teaching');
  
  if (!isOpen) return null;
  
  const handleSubmit = () => {
    onSubmit?.({ title, description, priority, committee, category, status: defaultStatus || 'created' });
    onClose();
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg animate-scale-in overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-blue-50 to-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Plus className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Create New Task</h3>
              <p className="text-xs text-gray-500">Add a new task to your board</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500"
          >
            ×
          </button>
        </div>
        
        {/* Form */}
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title..."
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the task..."
              rows={3}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Committee</label>
              <select
                value={committee}
                onChange={(e) => setCommittee(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              >
                <option value="Teaching">Teaching</option>
                <option value="Academic Board">Academic Board</option>
                <option value="Exam Committee">Exam Committee</option>
                <option value="Events Committee">Events Committee</option>
                <option value="Accreditation Team">Accreditation Team</option>
                <option value="Research Committee">Research Committee</option>
              </select>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors font-medium text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium text-sm flex items-center gap-2"
          >
            Create Task
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
