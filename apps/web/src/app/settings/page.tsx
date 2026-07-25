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
  User,
  Shield,
  Moon,
  Globe,
  Smartphone,
  Loader2,
} from 'lucide-react'
import { useAuth } from '@/lib/auth-context'

const NOTIFICATIONS = [
  { id: 1, title: 'Assignment Due Tomorrow', message: 'DBMS Assignment 3 due tomorrow', time: '2 hours ago', unread: true },
]

export default function SettingsPage() {
  const router = useRouter()
  const { user, isAuthenticated, loading: authLoading, logout } = useAuth()

  const STUDENT_INFO = {
    name: user?.firstName + ' ' + user?.lastName || 'Student',
    rollNumber: user?.email?.split('@')[0]?.toUpperCase() || '240010150100',
    email: user?.email || 'student@campus.edu',
    phone: '+91 9876543210'
  }
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

  // Auth guard
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [authLoading, isAuthenticated, router])

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

  const handleLogout = async () => {
    await logout()
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
    { id: 'preferences', label: 'Preferences', icon: <SettingsIcon className="w-4 h-4" /> },
  ]

  return (
    <div className="min-h-screen bg-[var(--color-surface)]">
      {/* Top Navigation - Glassmorphism */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-[var(--color-border-light)] py-2">
        <div className="max-w-7xl mx-auto px-3 md:px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/dashboard/student')}
              className="flex items-center gap-2"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-[var(--color-primary)] to-blue-600 rounded-lg flex items-center justify-center shadow-md">
                <Layers className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-gray-900 text-sm hidden sm:block">DeptWP</span>
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
                    <button onClick={() => router.push('/profile')} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
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
          className="flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-[var(--color-text-primary)]">Settings</h1>
          <p className="text-[var(--color-text-muted)] mt-1">Manage your account preferences</p>
        </div>

        {/* Section Tabs */}
        <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                activeSection === section.id
                  ? 'bg-[var(--color-primary)] text-white shadow-md'
                  : 'bg-white border border-black/[0.04] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:shadow-sm'
              }`}
            >
              {section.icon}
              {section.label}
            </button>
          ))}
        </div>

        {/* Profile Section */}
        {activeSection === 'profile' && (
          <div className="
            bg-white rounded-2xl border border-black/[0.04]
            shadow-[0_1px_3px_rgba(0,0,0,0.02),0_4px_12px_rgba(0,0,0,0.02)]
            p-6 space-y-6
          ">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-[var(--color-primary)] to-blue-600 rounded-xl flex items-center justify-center text-white text-xl font-bold">
                {getInitials(STUDENT_INFO.name)}
              </div>
              <div>
                <button className="text-sm text-[var(--color-primary)] hover:underline">Change Photo</button>
                <p className="text-xs text-[var(--color-text-muted)]">JPG, PNG. Max 2MB</p>
              </div>
            </div>
            
            <div className="grid gap-4">
              <div>
                <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-2">Full Name</label>
                <input 
                  type="text" 
                  defaultValue={STUDENT_INFO.name}
                  className="w-full px-4 py-3 border border-black/[0.04] rounded-xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-2">Phone</label>
                <input 
                  type="tel" 
                  defaultValue={STUDENT_INFO.phone}
                  className="w-full px-4 py-3 border border-black/[0.04] rounded-xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-2">Email</label>
                <input 
                  type="email" 
                  defaultValue={STUDENT_INFO.email}
                  className="w-full px-4 py-3 border border-black/[0.04] rounded-xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all"
                />
              </div>
            </div>
          </div>
        )}

        {/* Notifications Section */}
        {activeSection === 'notifications' && (
          <div className="
            bg-white rounded-2xl border border-black/[0.04]
            shadow-[0_1px_3px_rgba(0,0,0,0.02),0_4px_12px_rgba(0,0,0,0.02)]
            p-6 space-y-4
          ">
            <h3 className="font-medium text-[var(--color-text-primary)] text-sm mb-4 flex items-center gap-2">
              <BellIcon className="w-4 h-4" />
              Notification Preferences
            </h3>
            {[
              { key: 'email', label: 'Email Notifications', desc: 'Receive updates via email', icon: Mail },
              { key: 'push', label: 'Push Notifications', desc: 'Receive browser notifications', icon: Globe },
              { key: 'assignments', label: 'Assignment Alerts', desc: 'Due dates and submissions', icon: Bell },
              { key: 'attendance', label: 'Attendance Warnings', desc: 'Low attendance notifications', icon: Bell },
              { key: 'marks', label: 'Marks Updates', desc: 'When marks are released', icon: Bell },
            ].map((item) => {
              const Icon = item.icon
              return (
                <div key={item.key} className="flex items-center justify-between py-3 border-b border-black/[0.04] last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[var(--color-primary-faint)] flex items-center justify-center text-[var(--color-primary)]">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[var(--color-text-primary)]">{item.label}</p>
                      <p className="text-xs text-[var(--color-text-muted)]">{item.desc}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setNotifications({...notifications, [item.key]: !notifications[item.key as keyof typeof notifications]})}
                    className={`w-12 h-7 rounded-full transition-colors ${notifications[item.key as keyof typeof notifications] ? 'bg-[var(--color-primary)]' : 'bg-gray-200'}`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${notifications[item.key as keyof typeof notifications] ? 'translate-x-5' : 'translate-x-1'}`} />
                  </button>
                </div>
              )
            })}
          </div>
        )}

        {/* Security Section */}
        {activeSection === 'security' && (
          <div className="
            bg-white rounded-2xl border border-black/[0.04]
            shadow-[0_1px_3px_rgba(0,0,0,0.02),0_4px_12px_rgba(0,0,0,0.02)]
            p-6 space-y-4
          ">
            <h3 className="font-medium text-[var(--color-text-primary)] text-sm mb-4 flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Change Password
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-2">Current Password</label>
                <input 
                  type="password" 
                  placeholder="Enter current password"
                  className="w-full px-4 py-3 border border-black/[0.04] rounded-xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-2">New Password</label>
                <input 
                  type="password" 
                  placeholder="Enter new password"
                  className="w-full px-4 py-3 border border-black/[0.04] rounded-xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-2">Confirm Password</label>
                <input 
                  type="password" 
                  placeholder="Confirm new password"
                  className="w-full px-4 py-3 border border-black/[0.04] rounded-xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all"
                />
              </div>
            </div>
          </div>
        )}

        {/* Preferences Section */}
        {activeSection === 'preferences' && (
          <div className="
            bg-white rounded-2xl border border-black/[0.04]
            shadow-[0_1px_3px_rgba(0,0,0,0.02),0_4px_12px_rgba(0,0,0,0.02)]
            p-6 space-y-4
          ">
            <h3 className="font-medium text-[var(--color-text-primary)] text-sm mb-4 flex items-center gap-2">
              <SettingsIcon className="w-4 h-4" />
              App Preferences
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-black/[0.04]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                    <Moon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[var(--color-text-primary)]">Dark Mode</p>
                    <p className="text-xs text-[var(--color-text-muted)]">Switch between light and dark theme</p>
                  </div>
                </div>
                <button className="w-12 h-7 rounded-full bg-gray-200 transition-colors">
                  <div className="w-5 h-5 bg-white rounded-full shadow translate-x-1" />
                </button>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-black/[0.04]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[var(--color-text-primary)]">Language</p>
                    <p className="text-xs text-[var(--color-text-muted)]">Select your preferred language</p>
                  </div>
                </div>
                <select className="px-3 py-2 border border-black/[0.04] rounded-lg text-sm bg-gray-50 focus:outline-none">
                  <option>English</option>
                  <option>Hindi</option>
                </select>
              </div>
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[var(--color-text-primary)]">Mobile Data</p>
                    <p className="text-xs text-[var(--color-text-muted)]">Sync data only on WiFi</p>
                  </div>
                </div>
                <button className="w-12 h-7 rounded-full bg-[var(--color-primary)] transition-colors">
                  <div className="w-5 h-5 bg-white rounded-full shadow translate-x-5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Save Button */}
        <div className="flex items-center justify-end gap-3 mt-6">
          {saved && (
            <span className="text-sm text-green-600 flex items-center gap-1">
              <CheckCircle className="w-4 h-4" /> Saved
            </span>
          )}
          <button 
            onClick={handleSave}
            className="px-6 py-3 bg-[var(--color-primary)] text-white text-sm font-medium rounded-xl hover:bg-[var(--color-primary-dark)] flex items-center gap-2 shadow-lg shadow-blue-500/20 transition-all hover:scale-105"
          >
            <Save className="w-4 h-4" /> Save Changes
          </button>
        </div>
      </main>
    </div>
  )
}
