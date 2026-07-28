'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Save, Bell, Shield, Eye, Moon } from 'lucide-react'
import { cn } from '@/lib/utils'

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
}

export function SettingsView() {
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    attendanceReminders: true,
    assignmentUpdates: true,
    taskDeadlines: true,
  })

  const [privacy, setPrivacy] = useState({
    showProfile: true,
    showEmail: false,
    showPhone: false,
  })

  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    // Save settings to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('teacher_settings', JSON.stringify({ notifications, privacy }))
    }
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">Settings</h2>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
        >
          <Save className="w-4 h-4" /> Save Settings
        </button>
      </div>

      {saved && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-4 py-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700 font-medium"
        >
          Settings saved successfully!
        </motion.div>
      )}

      {/* Notifications Settings */}
      <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-slate-900">Notification Preferences</h3>
          </div>
        </div>
        <div className="p-6 space-y-4">
          {[
            { key: 'emailAlerts', label: 'Email Alerts', desc: 'Receive email notifications for important updates' },
            { key: 'attendanceReminders', label: 'Attendance Reminders', desc: 'Get reminded to mark attendance for pending sessions' },
            { key: 'assignmentUpdates', label: 'Assignment Updates', desc: 'Notifications for assignment submissions and evaluations' },
            { key: 'taskDeadlines', label: 'Task Deadlines', desc: 'Reminders before task deadlines expire' },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium text-slate-900">{item.label}</p>
                <p className="text-xs text-slate-500">{item.desc}</p>
              </div>
              <button
                onClick={() => setNotifications(prev => ({ ...prev, [item.key]: !prev[item.key as keyof typeof notifications] }))}
                className={cn(
                  "relative w-11 h-6 rounded-full transition-colors",
                  notifications[item.key as keyof typeof notifications] ? "bg-blue-600" : "bg-slate-300"
                )}
              >
                <span className={cn(
                  "absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform",
                  notifications[item.key as keyof typeof notifications] ? "translate-x-[22px]" : "translate-x-0.5"
                )} />
              </button>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Privacy Settings */}
      <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-slate-900">Privacy Settings</h3>
          </div>
        </div>
        <div className="p-6 space-y-4">
          {[
            { key: 'showProfile', label: 'Show Profile', desc: 'Display your profile in the faculty directory' },
            { key: 'showEmail', label: 'Show Email', desc: 'Allow others to see your email address' },
            { key: 'showPhone', label: 'Show Phone', desc: 'Allow others to see your phone number' },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium text-slate-900">{item.label}</p>
                <p className="text-xs text-slate-500">{item.desc}</p>
              </div>
              <button
                onClick={() => setPrivacy(prev => ({ ...prev, [item.key]: !prev[item.key as keyof typeof privacy] }))}
                className={cn(
                  "relative w-11 h-6 rounded-full transition-colors",
                  privacy[item.key as keyof typeof privacy] ? "bg-blue-600" : "bg-slate-300"
                )}
              >
                <span className={cn(
                  "absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform",
                  privacy[item.key as keyof typeof privacy] ? "translate-x-[22px]" : "translate-x-0.5"
                )} />
              </button>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Display Settings (placeholder) */}
      <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-slate-900">Display Preferences</h3>
          </div>
        </div>
        <div className="p-6">
          <p className="text-sm text-slate-500">Display customization options will be available in a future update.</p>
        </div>
      </motion.div>
    </div>
  )
}
