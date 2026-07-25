'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, Users, AlertTriangle, TrendingUp, TrendingDown,
  Filter, Download, Calendar, BookOpen, Award
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { STUDENT_ANALYTICS, BATCHES } from '@/lib/facultyData';

export default function StudentAnalyticsView() {
  const [selectedBatch, setSelectedBatch] = useState('all');

  const filteredAnalytics = selectedBatch === 'all' 
    ? STUDENT_ANALYTICS 
    : STUDENT_ANALYTICS.filter(a => a.batch === selectedBatch);

  const totalStudents = filteredAnalytics.reduce((sum, a) => sum + a.totalStudents, 0);
  const avgAttendance = Math.round(filteredAnalytics.reduce((sum, a) => sum + a.avgAttendance, 0) / filteredAnalytics.length);
  const atRiskStudents = filteredAnalytics.reduce((sum, a) => sum + a.atRiskStudents, 0);
  const avgMarks = Math.round(filteredAnalytics.reduce((sum, a) => sum + a.avgMarks, 0) / filteredAnalytics.length);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Student Analytics</h2>
          <p className="text-sm text-gray-500 mt-1">Monitor attendance, performance, and at-risk students</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedBatch}
            onChange={(e) => setSelectedBatch(e.target.value)}
            className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0052CC]/20"
          >
            <option value="all">All Batches</option>
            {BATCHES.map(b => (
              <option key={b.id} value={b.shortName}>{b.name}</option>
            ))}
          </select>
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50"
          >
            <Download className="w-4 h-4" /> Export
          </motion.button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-4 gap-4">
        <motion.div whileHover={{ y: -4 }} className="bg-white rounded-2xl p-5 shadow-md border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-500">Total Students</span>
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{totalStudents}</p>
        </motion.div>

        <motion.div whileHover={{ y: -4 }} className="bg-white rounded-2xl p-5 shadow-md border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-500">Avg Attendance</span>
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{avgAttendance}%</p>
          <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +2.3% from last month
          </p>
        </motion.div>

        <motion.div whileHover={{ y: -4 }} className="bg-white rounded-2xl p-5 shadow-md border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-500">At Risk</span>
            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{atRiskStudents}</p>
          <p className="text-xs text-gray-500 mt-1">Students below 75%</p>
        </motion.div>

        <motion.div whileHover={{ y: -4 }} className="bg-white rounded-2xl p-5 shadow-md border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-500">Avg Marks</span>
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <Award className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{avgMarks}%</p>
          <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +1.8% from last exam
          </p>
        </motion.div>
      </div>

      {/* Attendance Chart */}
      <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-[#0052CC]" />
          Attendance by Batch & Subject
        </h3>
        
        <div className="space-y-4">
          {filteredAnalytics.map((analytics, idx) => (
            <div key={idx} className="flex items-center gap-4">
              <div className="w-32">
                <p className="text-sm font-medium text-gray-900">{analytics.batch}</p>
                <p className="text-xs text-gray-500">{analytics.subject}</p>
              </div>
              <div className="flex-1">
                <div className="h-8 bg-gray-100 rounded-lg overflow-hidden relative">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${analytics.avgAttendance}%` }}
                    transition={{ duration: 0.8, delay: idx * 0.1 }}
                    className={cn(
                      "h-full rounded-lg",
                      analytics.avgAttendance >= 75 ? "bg-green-500" :
                      analytics.avgAttendance >= 65 ? "bg-amber-500" :
                      "bg-red-500"
                    )}
                  />
                </div>
              </div>
              <div className="w-16 text-right">
                <p className="text-sm font-bold text-gray-900">{analytics.avgAttendance}%</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* At Risk Students */}
      <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-red-500" />
          At-Risk Students (&lt; 75% Attendance)
        </h3>
        
        <div className="grid grid-cols-2 gap-4">
          {filteredAnalytics.filter(a => a.atRiskStudents > 0).map((analytics, idx) => (
            <div key={idx} className="p-4 bg-red-50 rounded-xl border border-red-100">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="font-semibold text-gray-900">{analytics.batch}</p>
                  <p className="text-xs text-gray-500">{analytics.subject}</p>
                </div>
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <span className="text-sm font-bold text-red-600">{analytics.atRiskStudents}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-red-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-red-500 rounded-full" 
                    style={{ width: `${(analytics.atRiskStudents / analytics.totalStudents) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-red-600 font-medium">
                  {Math.round((analytics.atRiskStudents / analytics.totalStudents) * 100)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#0052CC]" />
            Subject Performance
          </h3>
          
          <div className="space-y-3">
            {filteredAnalytics.map((analytics, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div>
                  <p className="text-sm font-medium text-gray-900">{analytics.subject}</p>
                  <p className="text-xs text-gray-500">{analytics.batch}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">{analytics.avgMarks}%</p>
                  <p className="text-xs text-gray-500">{analytics.topPerformers} top performers</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#0052CC]" />
            Quick Actions
          </h3>
          
          <div className="space-y-3">
            <button className="w-full flex items-center justify-between p-4 bg-amber-50 rounded-xl hover:bg-amber-100 transition-colors">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <span className="font-medium text-gray-900">Send Warning to At-Risk</span>
              </div>
            </button>
            
            <button className="w-full flex items-center justify-between p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-gray-900">View All At-Risk Students</span>
              </div>
            </button>
            
            <button className="w-full flex items-center justify-between p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors">
              <div className="flex items-center gap-3">
                <Award className="w-5 h-5 text-green-600" />
                <span className="font-medium text-gray-900">Generate Performance Report</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
