'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Layers, 
  Bell, 
  ChevronDown, 
  LogOut, 
  Settings as SettingsIcon, 
  UserCircle, 
  Receipt, 
  Building2, 
  ArrowLeft,
  Save,
  CheckCircle,
  Mail,
  Lock,
  Bell as BellIcon,
  User
} from 'lucide-react'

const NOTIFICATIONS = [
  { id: 1, title: 'Assignment Due Tomorrow', message: 'DBMS Assignment 3 due tomorrow', time: '2 hours ago', unread: true },
]

const STUDENT_INFO = {
  name: 'Vanshit Gaur',
  rollNumber: '240010150100',
  email: 'student@gjust.edu.in',
  phone: '+91 9876543210'
}

export default function SettingsPage() {
  const router = useRouter()
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [saved, setSaved] = useState(false)
  const [activeSection, setActiveSection] = useState('profile')
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    assignments: true,
    attendance: true,
    marks: true
  })
  const notifRef = useRef<HTMLDivElement>(null)
  const profileRef = useRef<HTMLDivElement>(null)
  
  const unreadCount = NOTIFICATIONS.filter(n => n.unread).length

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false)
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('userRole')
    localStorage.removeItem('userEmail')
    router.push('/')
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const sections = [
    { id: 'profile', label: 'Profile', icon: <User className="w-4 h-4" /> },
    { id: 'notifications', label: 'Notifications', icon: <BellIcon className="w-4 h-4" /> },
    { id: 'security', label: 'Security', icon: <Lock className="w-4 h-4" /> },
  ]

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Top Navigation - Glassmorphism */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-xl border-b border-gray-100/50 py-2">
        <div className="max-w-7xl mx-auto px-3 md:px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/dashboard/student')}
              className="flex items-center gap-2"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-[var(--color-primary)] to-blue-600 rounded-lg flex items-center justify-center shadow-md">
                <Layers className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-gray-900 text-sm hidden sm:block">DWAOP</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative" ref={notifRef}>
              <button 
                onClick={() => { setNotificationsOpen(!notificationsOpen); setProfileOpen(false); }}
                className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Bell className="w-4 h-4 text-gray-600" />
                {unreadCount > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />}
              </button>
              
              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-900 text-sm">Notifications</h3>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {NOTIFICATIONS.map((notif) => (
                      <div key={notif.id} className="px-4 py-3 hover:bg-gray-50 cursor-pointer">
                        <p className="text-sm font-medium text-gray-900">{notif.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{notif.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="relative" ref={profileRef}>
              <button 
                onClick={() => { setProfileOpen(!profileOpen); setNotificationsOpen(false); }}
                className="flex items-center gap-2 pl-2 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-[var(--color-primary)] to-blue-600 rounded-lg flex items-center justify-center text-white text-xs font-bold">
                  {getInitials(STUDENT_INFO.name)}
                </div>
                <ChevronDown className="w-3 h-3 text-gray-400 hidden sm:block" />
              </button>
              
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-900">{STUDENT_INFO.name}</p>
                    <p className="text-xs text-gray-500">{STUDENT_INFO.rollNumber}</p>
                  </div>
                  <div className="py-1">
                    <button onClick={() => router.push('/student-report')} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      <UserCircle className="w-4 h-4" /> My Profile
                    </button>
                    <button onClick={() => router.push('/fees')} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      <Receipt className="w-4 h-4" /> Fee Submission
                    </button>
                    <button onClick={() => router.push('/hostel')} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      <Building2 className="w-4 h-4" /> Hostel
                    </button>
                    <button onClick={() => router.push('/settings')} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      <SettingsIcon className="w-4 h-4" /> Settings
                    </button>
                  </div>
                  <div className="py-1 border-t border-gray-100">
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                      <LogOut className="w-4 h-4" /> Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-14 pb-10 px-3 md:px-4 max-w-3xl mx-auto">
        <button 
          onClick={() => router.push('/dashboard/student')}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        {/* Header */}
        <div className="mb-4">
          <h1 className="text-xl font-semibold text-gray-900">Settings</h1>
          <p className="text-sm text-gray-500">Manage your account preferences</p>
        </div>

        <div className="flex gap-3 mb-4 overflow-x-auto pb-2">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                activeSection === section.id
                  ? 'bg-[var(--color-primary)] text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              {section.icon}
              {section.label}
            </button>
          ))}
        </div>

        {/* Profile Section */}
        {activeSection === 'profile' && (
          <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-[var(--color-primary)] to-blue-600 rounded-xl flex items-center justify-center text-white text-xl font-bold">
                {getInitials(STUDENT_INFO.name)}
              </div>
              <div>
                <button className="text-sm text-[var(--color-primary)] hover:underline">Change Photo</button>
                <p className="text-xs text-gray-500">JPG, PNG. Max 2MB</p>
              </div>
            </div>
            
            <div className="grid gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Full Name</label>
                <input 
                  type="text" 
                  defaultValue={STUDENT_INFO.name}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Phone</label>
                <input 
                  type="tel" 
                  defaultValue={STUDENT_INFO.phone}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Notifications Section */}
        {activeSection === 'notifications' && (
          <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4">
            <h3 className="font-medium text-gray-900 text-sm mb-3">Notification Preferences</h3>
            {[
              { key: 'email', label: 'Email Notifications', desc: 'Receive updates via email' },
              { key: 'push', label: 'Push Notifications', desc: 'Receive browser notifications' },
              { key: 'assignments', label: 'Assignment Alerts', desc: 'Due dates and submissions' },
              { key: 'attendance', label: 'Attendance Warnings', desc: 'Low attendance notifications' },
              { key: 'marks', label: 'Marks Updates', desc: 'When marks are released' },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-medium text-gray-900">{item.label}</p>
                  <p className="text-xs text-gray-500">{item.desc}</p>
                </div>
                <button 
                  onClick={() => setNotifications({...notifications, [item.key]: !notifications[item.key as keyof typeof notifications]})}
                  className={`w-10 h-6 rounded-full transition-colors ${notifications[item.key as keyof typeof notifications] ? 'bg-blue-600' : 'bg-gray-200'}`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${notifications[item.key as keyof typeof notifications] ? 'translate-x-4' : 'translate-x-0.5'}`} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Security Section */}
        {activeSection === 'security' && (
          <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4">
            <h3 className="font-medium text-gray-900 text-sm mb-3">Change Password</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Current Password</label>
                <input 
                  type="password" 
                  placeholder="Enter current password"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">New Password</label>
                <input 
                  type="password" 
                  placeholder="Enter new password"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Confirm Password</label>
                <input 
                  type="password" 
                  placeholder="Confirm new password"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Save Button */}
        <div className="flex items-center justify-end gap-3 mt-4">
          {saved && (
            <span className="text-sm text-green-600 flex items-center gap-1">
              <CheckCircle className="w-4 h-4" /> Saved
            </span>
          )}
          <button 
            onClick={handleSave}
            className="px-4 py-2 bg-[var(--color-primary)] text-white text-sm font-medium rounded-lg hover:bg-[var(--color-primary-dark)] flex items-center gap-2"
          >
            <Save className="w-4 h-4" /> Save Changes
          </button>
        </div>
      </main>
    </div>
  )
}
