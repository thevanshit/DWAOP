'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Award, Plus, X, ChevronRight, Lock, Unlock, Edit3,
  CheckCircle2, Clock, FileText, Save, Send
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { MARKS_ENTRIES, MARKS_ENTRIES as MARKS_DATA, StudentMarks } from '@/lib/facultyData';
import { MY_SUBJECTS, BATCHES } from '@/lib/facultyData';

export default function MarksEntryView() {
  const [selectedEntry, setSelectedEntry] = useState(MARKS_ENTRIES[0]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCell, setEditingCell] = useState<{ row: number; field: string } | null>(null);
  const [marksData, setMarksData] = useState<StudentMarks[]>(selectedEntry?.students || []);

  const handleCellEdit = (rollNumber: string, field: string, value: number) => {
    setMarksData(prev => prev.map(s => 
      s.rollNumber === rollNumber 
        ? { ...s, [field]: value, total: calculateTotal({ ...s, [field]: value }) }
        : s
    ));
  };

  const calculateTotal = (student: StudentMarks) => {
    const m1 = student.minor1 ?? 0;
    const m2 = student.minor2 ?? 0;
    const a = student.assignment ?? 0;
    return m1 + m2 + a;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-700';
      case 'under_review': return 'bg-amber-100 text-amber-700';
      case 'finalized': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Marks Entry</h2>
          <p className="text-sm text-gray-500 mt-1">Manage internal assessment marks with workflow states</p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.02 }} 
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#0052CC] to-[#0747A6] text-white rounded-xl font-semibold shadow-lg shadow-blue-500/25"
        >
          <Plus className="w-4 h-4" /> New Entry
        </motion.button>
      </div>

      {/* Workflow Status Banner */}
      <div className="bg-gradient-to-r from-[#0052CC] to-[#0747A6] rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold">Marks Workflow States</h3>
            <p className="text-blue-100 text-sm mt-1">Draft → Under Review → Finalized</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gray-300" />
              <span className="text-sm">Draft</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-400" />
              <span className="text-sm">Under Review</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-400" />
              <span className="text-sm">Finalized</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6">
        {/* Entries List */}
        <div className="col-span-1 space-y-3">
          {MARKS_ENTRIES.map((entry) => (
            <motion.button
              key={entry.id}
              whileHover={{ x: 4 }}
              onClick={() => {
                setSelectedEntry(entry);
                setMarksData(entry.students);
              }}
              className={cn(
                "w-full p-4 rounded-xl text-left transition-all",
                selectedEntry?.id === entry.id
                  ? "bg-white shadow-lg border-2 border-[#0052CC]"
                  : "bg-gray-50 hover:bg-white hover:shadow-md border border-transparent"
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center",
                  selectedEntry?.id === entry.id ? "bg-[#0052CC] text-white" : "bg-gray-200 text-gray-600"
                )}>
                  <Award className="w-4 h-4" />
                </div>
                <span className={cn("text-xs font-bold px-2 py-0.5 rounded-full capitalize", getStatusColor(entry.status))}>
                  {entry.status.replace('_', ' ')}
                </span>
              </div>
              <h3 className="font-bold text-gray-900 text-sm">{entry.subject}</h3>
              <p className="text-xs text-gray-500 mt-1">{entry.batch}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full capitalize">{entry.examType}</span>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Marks Table */}
        <div className="col-span-3">
          {selectedEntry ? (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              {/* Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{selectedEntry.subject}</h3>
                    <p className="text-sm text-gray-500 mt-1">{selectedEntry.batch} • {selectedEntry.examType.toUpperCase()} Examination</p>
                  </div>
                  <div className="flex items-center gap-3">
                    {selectedEntry.status === 'draft' ? (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-xl font-medium text-sm"
                      >
                        <Send className="w-4 h-4" /> Submit for Review
                      </motion.button>
                    ) : selectedEntry.status === 'under_review' ? (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-xl font-medium text-sm"
                      >
                        <Lock className="w-4 h-4" /> Finalize
                      </motion.button>
                    ) : (
                      <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-xl font-medium text-sm">
                        <Lock className="w-4 h-4" /> Locked
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Roll No</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Student Name</th>
                      <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase">Minor 1</th>
                      <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase">Minor 2</th>
                      <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase">Assignment</th>
                      <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {marksData.map((student, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{student.rollNumber}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{student.name}</td>
                        <td className="px-6 py-4">
                          <input
                            type="number"
                            disabled={selectedEntry.status !== 'draft'}
                            value={student.minor1 ?? ''}
                            onChange={(e) => handleCellEdit(student.rollNumber, 'minor1', parseInt(e.target.value) || 0)}
                            className={cn(
                              "w-20 text-center py-2 rounded-lg border text-sm font-medium",
                              selectedEntry.status !== 'draft' ? "bg-gray-50 border-gray-100" : "bg-white border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0052CC]/20"
                            )}
                          />
                        </td>
                        <td className="px-6 py-4">
                          <input
                            type="number"
                            disabled={selectedEntry.status !== 'draft'}
                            value={student.minor2 ?? ''}
                            onChange={(e) => handleCellEdit(student.rollNumber, 'minor2', parseInt(e.target.value) || 0)}
                            className={cn(
                              "w-20 text-center py-2 rounded-lg border text-sm font-medium",
                              selectedEntry.status !== 'draft' ? "bg-gray-50 border-gray-100" : "bg-white border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0052CC]/20"
                            )}
                          />
                        </td>
                        <td className="px-6 py-4">
                          <input
                            type="number"
                            disabled={selectedEntry.status !== 'draft'}
                            value={student.assignment ?? ''}
                            onChange={(e) => handleCellEdit(student.rollNumber, 'assignment', parseInt(e.target.value) || 0)}
                            className={cn(
                              "w-20 text-center py-2 rounded-lg border text-sm font-medium",
                              selectedEntry.status !== 'draft' ? "bg-gray-50 border-gray-100" : "bg-white border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0052CC]/20"
                            )}
                          />
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={cn(
                            "text-sm font-bold px-3 py-1 rounded-lg",
                            calculateTotal(student) >= 60 ? "bg-green-100 text-green-700" :
                            calculateTotal(student) >= 40 ? "bg-amber-100 text-amber-700" :
                            "bg-red-100 text-red-700"
                          )}>
                            {calculateTotal(student) || '-'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-12 text-center shadow-md border border-gray-100">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium">Select a marks entry to view</p>
            </div>
          )}
        </div>
      </div>

      {/* Create Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <CreateMarksModal onClose={() => setShowCreateModal(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

function CreateMarksModal({ onClose }: { onClose: () => void }) {
  const [subject, setSubject] = useState('');
  const [batch, setBatch] = useState('');
  const [examType, setExamType] = useState('minor1');

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
            <h2 className="text-xl font-bold text-gray-900">Create Marks Entry</h2>
            <button onClick={onClose} className="p-2.5 hover:bg-gray-100 rounded-xl transition-colors">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0052CC]/20"
              >
                <option value="">Select subject</option>
                {MY_SUBJECTS.map(s => (
                  <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Batch</label>
              <select
                value={batch}
                onChange={(e) => setBatch(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0052CC]/20"
              >
                <option value="">Select batch</option>
                {BATCHES.map(b => (
                  <option key={b.id} value={b.shortName}>{b.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Exam Type</label>
              <div className="flex gap-2">
                {['minor1', 'minor2', 'assignment'].map(type => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setExamType(type)}
                    className={cn(
                      "flex-1 py-2 rounded-lg text-sm font-medium capitalize transition-all",
                      examType === type 
                        ? "bg-[#0052CC] text-white" 
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    )}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 bg-gradient-to-r from-[#0052CC] to-[#0747A6] text-white rounded-xl font-semibold shadow-lg shadow-blue-500/25 mt-6"
            >
              Create Entry
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
}
