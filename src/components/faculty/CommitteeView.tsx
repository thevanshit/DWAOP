'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Plus, X, ChevronRight, Briefcase, CheckCircle2, 
  Clock, AlertCircle, Calendar, FileText, UserPlus
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { COMMITTEES, COMMITTEE_MEMBERS, FACULTY_DIRECTORY, TASKS } from '@/lib/facultyData';

interface CommitteeMember {
  id: string;
  name: string;
  avatar: string;
  role: string;
  isOnline?: boolean;
}

export default function CommitteeView() {
  const [selectedCommittee, setSelectedCommittee] = useState(COMMITTEES[0]);
  const [showTaskModal, setShowTaskModal] = useState(false);

  const getCommitteeMembers = (committeeId: string): CommitteeMember[] => {
    const memberIds = COMMITTEE_MEMBERS[committeeId] || [];
    return FACULTY_DIRECTORY
      .filter(f => memberIds.includes(f.id))
      .map(f => ({
        id: f.id,
        name: f.name,
        avatar: f.avatar,
        role: f.role,
        isOnline: f.isOnline,
      }));
  };

  const getCommitteeTasks = (committeeName: string) => {
    return TASKS.filter(t => t.committee === committeeName);
  };

  const members = getCommitteeMembers(selectedCommittee.id);
  const tasks = getCommitteeTasks(selectedCommittee.name);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Committee Management</h2>
          <p className="text-sm text-gray-500 mt-1">Manage committees and assign tasks to faculty</p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.02 }} 
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowTaskModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#0052CC] to-[#0747A6] text-white rounded-xl font-semibold shadow-lg shadow-blue-500/25"
        >
          <Plus className="w-4 h-4" /> Assign Task
        </motion.button>
      </div>

      <div className="grid grid-cols-5 gap-6">
        {/* Committee List */}
        <div className="col-span-1 space-y-3">
          {COMMITTEES.map((committee) => (
            <motion.button
              key={committee.id}
              whileHover={{ x: 4 }}
              onClick={() => setSelectedCommittee(committee)}
              className={cn(
                "w-full p-4 rounded-xl text-left transition-all",
                selectedCommittee.id === committee.id
                  ? "bg-white shadow-lg border-2 border-[#0052CC]"
                  : "bg-gray-50 hover:bg-white hover:shadow-md border border-transparent"
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center",
                  selectedCommittee.id === committee.id ? "bg-[#0052CC] text-white" : "bg-gray-200 text-gray-600"
                )}>
                  <Briefcase className="w-4 h-4" />
                </div>
                <ChevronRight className={cn(
                  "w-4 h-4",
                  selectedCommittee.id === committee.id ? "text-[#0052CC]" : "text-gray-400"
                )} />
              </div>
              <h3 className="font-bold text-gray-900 text-sm">{committee.name}</h3>
              <p className="text-xs text-gray-500 mt-1">{committee.memberCount} members</p>
              <div className="flex items-center gap-1 mt-2">
                <div className="w-2 h-2 rounded-full bg-amber-500" />
                <span className="text-xs text-amber-600 font-medium">{committee.activeTasks} active</span>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Committee Details */}
        <div className="col-span-4 space-y-6">
          {/* Header */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{selectedCommittee.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{selectedCommittee.description}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-[#0052CC]">{selectedCommittee.memberCount}</p>
                  <p className="text-xs text-gray-500">Members</p>
                </div>
                <div className="w-px h-12 bg-gray-200" />
                <div className="text-center">
                  <p className="text-2xl font-bold text-amber-500">{selectedCommittee.activeTasks}</p>
                  <p className="text-xs text-gray-500">Active Tasks</p>
                </div>
              </div>
            </div>
          </div>

          {/* Members Grid */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-[#0052CC]" />
              Committee Members
            </h4>
            <div className="grid grid-cols-4 gap-4">
              {members.map((member) => (
                <div key={member.id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#0052CC] to-[#0747A6] rounded-xl flex items-center justify-center text-white font-bold text-sm">
                      {member.avatar}
                    </div>
                    {member.isOnline && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{member.name}</p>
                    <p className="text-xs text-gray-500 truncate">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Committee Tasks */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#0052CC]" />
              Committee Tasks
            </h4>
            <div className="space-y-3">
              {tasks.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No tasks assigned to this committee</p>
              ) : (
                tasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center",
                        task.status === 'done' ? "bg-green-100 text-green-600" :
                        task.status === 'in_progress' ? "bg-blue-100 text-blue-600" :
                        task.status === 'under_review' ? "bg-amber-100 text-amber-600" :
                        "bg-gray-100 text-gray-600"
                      )}>
                        {task.status === 'done' ? <CheckCircle2 className="w-5 h-5" /> :
                         task.status === 'in_progress' ? <Clock className="w-5 h-5" /> :
                         <FileText className="w-5 h-5" />}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{task.title}</p>
                        <p className="text-xs text-gray-500">Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={cn(
                        "text-xs font-bold px-3 py-1 rounded-full",
                        task.priority === 'critical' ? "bg-red-100 text-red-700" :
                        task.priority === 'high' ? "bg-amber-100 text-amber-700" :
                        task.priority === 'medium' ? "bg-blue-100 text-blue-700" :
                        "bg-gray-100 text-gray-700"
                      )}>
                        {(task.priority || 'medium').toUpperCase()}
                      </span>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Assign Task Modal */}
      <AnimatePresence>
        {showTaskModal && (
          <AssignTaskModal onClose={() => setShowTaskModal(false)} committee={selectedCommittee.name} />
        )}
      </AnimatePresence>
    </div>
  );
}

function AssignTaskModal({ onClose, committee }: { onClose: () => void; committee: string }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignee, setAssignee] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('medium');

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
            <div>
              <h2 className="text-xl font-bold text-gray-900">Assign New Task</h2>
              <p className="text-sm text-gray-500">{committee}</p>
            </div>
            <button onClick={onClose} className="p-2.5 hover:bg-gray-100 rounded-xl transition-colors">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Task Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter task title"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0052CC]/20 focus:border-[#0052CC]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the task..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0052CC]/20 focus:border-[#0052CC] resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Assign To</label>
                <select
                  value={assignee}
                  onChange={(e) => setAssignee(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0052CC]/20 focus:border-[#0052CC]"
                >
                  <option value="">Select faculty</option>
                  {FACULTY_DIRECTORY.map(f => (
                    <option key={f.id} value={f.id}>{f.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0052CC]/20 focus:border-[#0052CC]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
              <div className="flex gap-2">
                {['low', 'medium', 'high', 'critical'].map(p => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={cn(
                      "flex-1 py-2 rounded-lg text-xs font-medium capitalize transition-all",
                      priority === p 
                        ? p === 'critical' ? "bg-red-500 text-white" :
                          p === 'high' ? "bg-amber-500 text-white" :
                          p === 'medium' ? "bg-blue-500 text-white" :
                          "bg-gray-500 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    )}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 bg-gradient-to-r from-[#0052CC] to-[#0747A6] text-white rounded-xl font-semibold shadow-lg shadow-blue-500/25 mt-6"
            >
              Assign Task
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
}
