'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, Plus, X, ChevronRight, Send, AlertTriangle, Info,
  Calendar, Users, BookOpen, Clock, Edit3, Trash2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ANNOUNCEMENTS, Announcement } from '@/lib/facultyData';
import { BATCHES, MY_SUBJECTS } from '@/lib/facultyData';

export default function AnnouncementsPanel() {
  const [activeTab, setActiveTab] = useState<'all' | 'published' | 'draft'>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);

  const filteredAnnouncements = ANNOUNCEMENTS.filter(a => {
    if (activeTab === 'all') return true;
    if (activeTab === 'published') return a.status === 'published';
    return a.status === 'draft';
  });

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent': return <AlertTriangle className="w-4 h-4" />;
      case 'important': return <Info className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-700 border-red-200';
      case 'important': return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-blue-100 text-blue-700 border-blue-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Announcements</h2>
          <p className="text-sm text-gray-500 mt-1">Create and manage announcements for students</p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.02 }} 
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#0052CC] to-[#0747A6] text-white rounded-xl font-semibold shadow-lg shadow-blue-500/25"
        >
          <Plus className="w-4 h-4" /> New Announcement
        </motion.button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {[
          { id: 'all', label: 'All', count: ANNOUNCEMENTS.length },
          { id: 'published', label: 'Published', count: ANNOUNCEMENTS.filter(a => a.status === 'published').length },
          { id: 'draft', label: 'Drafts', count: ANNOUNCEMENTS.filter(a => a.status === 'draft').length },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all",
              activeTab === tab.id
                ? "bg-[#0052CC] text-white"
                : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
            )}
          >
            {tab.label}
            <span className={cn(
              "px-2 py-0.5 rounded-full text-xs",
              activeTab === tab.id ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600"
            )}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {filteredAnnouncements.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-md border border-gray-100">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 font-medium">No announcements found</p>
          </div>
        ) : (
          filteredAnnouncements.map((announcement) => (
            <motion.div
              key={announcement.id}
              whileHover={{ x: 4 }}
              onClick={() => setSelectedAnnouncement(announcement)}
              className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center",
                    getPriorityColor(announcement.priority)
                  )}>
                    {getPriorityIcon(announcement.priority)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-gray-900">{announcement.title}</h3>
                      {announcement.status === 'draft' && (
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">Draft</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">{announcement.message}</p>
                    <div className="flex items-center gap-4 mt-3">
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Calendar className="w-3 h-3" />
                        {new Date(announcement.createdAt).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Users className="w-3 h-3" />
                        {announcement.batches.length} batches
                      </div>
                      {announcement.subject && (
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <BookOpen className="w-3 h-3" />
                          {announcement.subject}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedAnnouncement && (
          <AnnouncementDetailModal 
            announcement={selectedAnnouncement}
            onClose={() => setSelectedAnnouncement(null)}
          />
        )}
      </AnimatePresence>

      {/* Create Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <CreateAnnouncementModal onClose={() => setShowCreateModal(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

function AnnouncementDetailModal({ announcement, onClose }: { announcement: Announcement; onClose: () => void }) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-700 border-red-200';
      case 'important': return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-blue-100 text-blue-700 border-blue-200';
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
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">ANN-{announcement.id.split('-')[1]}</span>
            <div className="flex items-center gap-2">
              <button className="p-2.5 hover:bg-gray-100 rounded-xl transition-colors">
                <Edit3 className="w-5 h-5 text-gray-500" />
              </button>
              <button onClick={onClose} className="p-2.5 hover:bg-gray-100 rounded-xl transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>

          <div className="space-y-5">
            <div className="flex items-center gap-2">
              <span className={cn("text-xs font-bold px-3 py-1.5 rounded-full capitalize border", getPriorityColor(announcement.priority))}>
                {announcement.priority}
              </span>
              <span className={cn(
                "text-xs font-bold px-3 py-1.5 rounded-full",
                announcement.status === 'published' ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
              )}>
                {announcement.status}
              </span>
            </div>

            <h2 className="text-xl font-bold text-gray-900">{announcement.title}</h2>

            <p className="text-sm text-gray-700 leading-relaxed">{announcement.message}</p>

            <div className="border-t border-gray-100 pt-5">
              <label className="block text-xs font-medium text-gray-500 mb-3">Target Batches</label>
              <div className="flex flex-wrap gap-2">
                {announcement.batches.map((batch, idx) => (
                  <span key={idx} className="px-3 py-1.5 bg-[#0052CC]/10 text-[#0052CC] text-sm font-medium rounded-full">
                    {batch}
                  </span>
                ))}
              </div>
            </div>

            {announcement.subject && (
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-2">Subject</label>
                <p className="text-sm font-medium text-gray-900">{announcement.subject}</p>
              </div>
            )}

            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                Created: {new Date(announcement.createdAt).toLocaleDateString()}
              </div>
              <div>
                By: {announcement.createdBy}
              </div>
            </div>

            {announcement.status === 'draft' && (
              <div className="flex gap-3 pt-4">
                <button className="flex-1 py-3 border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors">
                  Delete
                </button>
                <button className="flex-1 py-3 bg-[#0052CC] text-white rounded-xl font-semibold hover:bg-[#0747A6] transition-colors">
                  <Send className="w-4 h-4 inline mr-2" /> Publish
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </>
  );
}

function CreateAnnouncementModal({ onClose }: { onClose: () => void }) {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [priority, setPriority] = useState<'normal' | 'important' | 'urgent'>('normal');
  const [selectedBatches, setSelectedBatches] = useState<string[]>([]);
  const [selectedSubject, setSelectedSubject] = useState('');

  const toggleBatch = (batch: string) => {
    setSelectedBatches(prev => 
      prev.includes(batch) ? prev.filter(b => b !== batch) : [...prev, batch]
    );
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
        className="fixed right-0 top-0 bottom-0 w-[600px] bg-white rounded-l-3xl shadow-2xl z-50 overflow-y-auto"
      >
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Create Announcement</h2>
            <button onClick={onClose} className="p-2.5 hover:bg-gray-100 rounded-xl transition-colors">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter announcement title"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0052CC]/20 focus:border-[#0052CC]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter your message..."
                rows={5}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0052CC]/20 focus:border-[#0052CC] resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
              <div className="flex gap-2">
                {[
                  { id: 'normal', label: 'Normal', color: 'blue' },
                  { id: 'important', label: 'Important', color: 'amber' },
                  { id: 'urgent', label: 'Urgent', color: 'red' },
                ].map(p => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPriority(p.id as any)}
                    className={cn(
                      "flex-1 py-2 rounded-lg text-sm font-medium transition-all",
                      priority === p.id 
                        ? p.color === 'red' ? "bg-red-500 text-white" :
                          p.color === 'amber' ? "bg-amber-500 text-white" :
                          "bg-[#0052CC] text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    )}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Target Batches</label>
              <div className="flex flex-wrap gap-2">
                {BATCHES.map(b => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => toggleBatch(b.shortName)}
                    className={cn(
                      "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                      selectedBatches.includes(b.shortName)
                        ? "bg-[#0052CC] text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    )}
                  >
                    {b.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subject (Optional)</label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0052CC]/20"
              >
                <option value="">All subjects</option>
                {MY_SUBJECTS.map(s => (
                  <option key={s.id} value={s.name}>{s.name}</option>
                ))}
              </select>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 bg-gradient-to-r from-[#0052CC] to-[#0747A6] text-white rounded-xl font-semibold shadow-lg shadow-blue-500/25 mt-6"
            >
              Create & Publish
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
}
