'use client';

import React, { useState, useCallback } from 'react';
import { Task } from '@/types';
import { TaskCard } from './TaskCard';
import { Search, Filter, Plus, MoreVertical, LayoutGrid, List } from 'lucide-react';

interface KanbanBoardProps {
  tasks: Task[];
  onTaskMove?: (taskId: string, newStatus: Task['status']) => void;
  onTaskClick?: (task: Task) => void;
  onAddTask?: (status: Task['status']) => void;
}

export function KanbanBoard({ tasks, onTaskMove, onTaskClick, onAddTask }: KanbanBoardProps) {
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterAssignee, setFilterAssignee] = useState<string>('all');
  const [draggedTask, setDraggedTask] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
  
  const columns = [
    { id: 'created', label: 'To Do', color: '#5E6C84' },
    { id: 'in_progress', label: 'In Progress', color: '#0052CC' },
    { id: 'under_review', label: 'In Review', color: '#FFAB00' },
    { id: 'done', label: 'Done', color: '#36B37E' },
    { id: 'delayed', label: 'Delayed', color: '#FF5630' },
  ];
  
  const filteredTasks = tasks.filter(task => {
    if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (filterPriority !== 'all' && task.priority !== filterPriority) {
      return false;
    }
    return true;
  });
  
  const handleDragStart = (taskId: string) => {
    setDraggedTask(taskId);
  };
  
  const handleDragOver = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    setDragOverColumn(columnId);
  };
  
  const handleDragLeave = () => {
    setDragOverColumn(null);
  };
  
  const handleDrop = (e: React.DragEvent, status: string) => {
    e.preventDefault();
    if (draggedTask && onTaskMove) {
      onTaskMove(draggedTask, status as Task['status']);
    }
    setDraggedTask(null);
    setDragOverColumn(null);
  };
  
  return (
    <div className="space-y-4">
      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="
                w-full 
                bg-white 
                border border-gray-200 
                pl-10 pr-4 py-2 
                rounded-xl 
                text-sm font-medium
                placeholder:text-gray-400
                focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
                transition-all
              "
            />
          </div>
          
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="
              bg-white 
              border border-gray-200 
              px-3 py-2 
              rounded-xl 
              text-sm font-medium
              focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
              cursor-pointer
            "
          >
            <option value="all">All Priority</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
        
        <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end">
          <div className="bg-white border border-gray-200 rounded-xl p-1 flex">
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded-lg transition-all ${viewMode === 'kanban' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-400 hover:bg-gray-50'}`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-400 hover:bg-gray-50'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
          
          <button className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
            <Filter className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>
      
      {/* Kanban Columns */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {columns.map(column => (
            <div 
              key={column.id}
              className={`
                flex flex-col 
                bg-gray-50/50 
                rounded-2xl 
                border border-dashed border-gray-200
                min-h-[400px]
                transition-all duration-200
                ${dragOverColumn === column.id ? 'bg-blue-50/50 border-blue-300 border-solid' : ''}
              `}
              onDragOver={(e) => handleDragOver(e, column.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, column.id)}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between p-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <span 
                    className="w-2 h-2 rounded-full" 
                    style={{ backgroundColor: column.color }}
                  />
                  <h3 className="font-semibold text-gray-700 text-sm">
                    {column.label}
                  </h3>
                  <span className="w-5 h-5 bg-gray-200 rounded-full text-[10px] font-bold text-gray-600 flex items-center justify-center">
                    {filteredTasks.filter(t => t.status === column.id).length}
                  </span>
                </div>
                
                <button className="p-1 hover:bg-gray-200 rounded text-gray-400 hover:text-gray-600 transition-colors">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
              
              {/* Column Content */}
              <div className="flex-1 p-2 space-y-2 overflow-y-auto">
                {filteredTasks
                  .filter(task => task.status === column.id)
                  .map((task, idx) => (
                    <div 
                      key={task.id}
                      style={{ animationDelay: `${idx * 50}ms` }}
                      className="animate-fade-in-up"
                    >
                      <TaskCard 
                        task={task}
                        onDragStart={() => handleDragStart(task.id)}
                        onClick={() => onTaskClick?.(task)}
                        isDragging={draggedTask === task.id}
                      />
                    </div>
                  ))}
                
                {/* Add Task Button */}
                <button 
                  onClick={() => onAddTask?.(column.id as Task['status'])}
                  className="
                    w-full 
                    py-3 
                    border-2 border-dashed border-gray-200 
                    rounded-xl 
                    text-gray-400 
                    text-xs font-semibold 
                    uppercase tracking-wider
                    hover:border-blue-300 
                    hover:text-blue-500 
                    hover:bg-blue-50/30
                    transition-all
                    flex items-center justify-center gap-1
                  "
                >
                  <Plus className="w-4 h-4" />
                  Add Task
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="divide-y divide-gray-50">
            {filteredTasks.map((task, idx) => (
              <div 
                key={task.id}
                style={{ animationDelay: `${idx * 30}ms` }}
                className="animate-fade-in"
              >
                <TaskRow task={task} onClick={() => onTaskClick?.(task)} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface TaskRowProps {
  task: Task;
  onClick?: () => void;
}

function TaskRow({ task, onClick }: TaskRowProps) {
  return (
    <div 
      onClick={onClick}
      className="flex items-center gap-4 p-4 hover:bg-gray-50/80 transition-colors cursor-pointer group"
    >
      <div className="w-10 h-10 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-lg flex items-center justify-center">
        <span className="text-[10px] font-bold text-blue-600">{task.id.split('-')[0]}</span>
      </div>
      
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-gray-900 text-sm truncate group-hover:text-blue-600 transition-colors">
          {task.title}
        </h4>
        <div className="flex items-center gap-2 mt-1">
          {task.committee && (
            <span className="px-2 py-0.5 bg-gray-100 rounded text-[10px] font-medium text-gray-600">
              {task.committee}
            </span>
          )}
          {task.priority && (
            <span className={`px-2 py-0.5 rounded text-[10px] font-medium uppercase ${
              task.priority === 'critical' ? 'bg-red-50 text-red-600' :
              task.priority === 'high' ? 'bg-orange-50 text-orange-600' :
              task.priority === 'medium' ? 'bg-blue-50 text-blue-600' :
              'bg-gray-50 text-gray-500'
            }`}>
              {task.priority}
            </span>
          )}
        </div>
      </div>
      
      <div className="text-right">
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
          task.status === 'done' ? 'bg-green-50 text-green-600' :
          task.status === 'in_progress' ? 'bg-blue-50 text-blue-600' :
          task.status === 'under_review' ? 'bg-amber-50 text-amber-600' :
          task.status === 'delayed' ? 'bg-red-50 text-red-600' :
          'bg-gray-50 text-gray-600'
        }`}>
          {task.status.replace('_', ' ')}
        </span>
        {task.dueDate && (
          <p className="text-[10px] text-gray-400 mt-1">
            Due {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </p>
        )}
      </div>
    </div>
  );
}
