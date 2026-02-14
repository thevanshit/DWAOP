'use client'

import { ReactNode, useState, useEffect, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import {
  Layers,
  Home,
  Menu,
  X,
  Bell,
  ChevronDown,
  LogOut,
  Settings,
  User,
  FileText,
  Calendar,
  Award,
  ClipboardList,
  TrendingUp,
  CreditCard,
  Building,
  LogOut as LogoutIcon,
  Check,
  UserCircle,
  Receipt,
  Building2,
  Trophy
} from 'lucide-react'
import { UserRole } from '@/types'

interface DashboardLayoutProps {
  children: ReactNode
  role: UserRole
  roleLabel: string
  navItems: {
    label: string
    icon: ReactNode
    href: string
    badge?: number
    section?: string
  }[]
  title?: string
}

const NOTIFICATIONS = [
  { id: 1, title: 'Assignment Due Tomorrow', message: 'DBMS Assignment 3 due tomorrow', time: '2 hours ago', unread: true, icon: 'file' },
  { id: 2, title: 'Attendance Warning', message: 'Your attendance in OS is below 75%', time: '1 day ago', unread: true, icon: 'alert' },
  { id: 3, title: 'Marks Released', message: 'Internal 1 marks have been finalized', time: '2 days ago', unread: false, icon: 'check' },
  { id: 4, title: 'Holiday Tomorrow', message: 'College will remain closed', time: '3 days ago', unread: false, icon: 'calendar' },
]

export default function DashboardLayout({ children, role, roleLabel, navItems, title }: DashboardLayoutProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [currentHash, setCurrentHash] = useState('')
  const [isScrolled, setIsScrolled] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const notifRef = useRef<HTMLDivElement>(null)
  const profileRef = useRef<HTMLDivElement>(null)

  const userEmail = typeof window !== 'undefined' ? localStorage.getItem('userEmail') || 'student@gjust.edu.in' : 'student@gjust.edu.in'
  const userName = userEmail.split('@')[0]
  const unreadCount = NOTIFICATIONS.filter(n => n.unread).length

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentHash(window.location.hash || '#overview')
      const handleHashChange = () => {
        setCurrentHash(window.location.hash || '#overview')
      }
      window.addEventListener('hashchange', handleHashChange)

      const handleScroll = () => {
        setIsScrolled(window.scrollY > 10)
      }
      window.addEventListener('scroll', handleScroll)

      return () => {
        window.removeEventListener('hashchange', handleHashChange)
        window.removeEventListener('scroll', handleScroll)
      }
    }
  }, [])

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
    return name.charAt(0).toUpperCase()
  }

  const navItemsBottom = [
    { label: 'Settings', icon: <Settings className="w-4 h-4" />, href: '/settings' },
  ]

  const handleNavClick = (href: string, isExternal?: boolean) => {
    if (isExternal) {
      router.push(href)
    } else {
      if (typeof window !== 'undefined') {
        window.location.hash = href
        setCurrentHash(href)
        if (window.innerWidth < 1024) setSidebarOpen(false)
      }
    }
  }

  return (
    <div className="min-h-screen bg-[var(--color-surface-subtle)]">
      {/* Top Navigation - Fixed at top */}
      <header className={`
        fixed top-0 left-0 right-0 z-50 h-16 transition-all duration-200
        ${isScrolled ? 'bg-white/90 backdrop-blur-xl border-b border-gray-200 shadow-sm' : 'bg-white/80 backdrop-blur-md border-b border-gray-100'}
      `}>
        <div className="h-full max-w-[1600px] mx-auto px-3 md:px-5 flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <button
              onClick={() => router.push('/')}
              className="flex items-center gap-2"
            >
              <div className="w-9 h-9 bg-gradient-to-br from-[var(--color-primary)] to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Layers className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg text-gray-900 hidden sm:block">DWAOP</span>
            </button>
          </div>

          <div className="flex items-center gap-1 md:gap-2">
            {/* Notifications */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => { setNotificationsOpen(!notificationsOpen); setProfileOpen(false); }}
                className="relative p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <Bell className="w-5 h-5 text-gray-600" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
                )}
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-blue-50 to-white">
                    <h3 className="font-semibold text-gray-900">Notifications</h3>
                    {unreadCount > 0 && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">{unreadCount} new</span>}
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {NOTIFICATIONS.map((notif) => (
                      <div key={notif.id} className={`px-5 py-4 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-0 transition-colors ${notif.unread ? 'bg-blue-50/30' : ''}`}>
                        <div className="flex items-start gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${notif.icon === 'file' ? 'bg-orange-100 text-orange-600' :
                            notif.icon === 'alert' ? 'bg-red-100 text-red-600' :
                              notif.icon === 'check' ? 'bg-green-100 text-green-600' :
                                'bg-blue-100 text-blue-600'
                            }`}>
                            {notif.icon === 'file' ? <FileText className="w-5 h-5" /> :
                              notif.icon === 'alert' ? <Bell className="w-5 h-5" /> :
                                notif.icon === 'check' ? <Check className="w-5 h-5" /> :
                                  <Calendar className="w-5 h-5" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-semibold text-gray-900 truncate">{notif.title}</p>
                              {notif.unread && <span className="w-2 h-2 bg-blue-500 rounded-full shrink-0" />}
                            </div>
                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">{notif.message}</p>
                            <p className="text-xs text-gray-400 mt-2">{notif.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="px-4 py-3 border-t border-gray-100 bg-gray-50/50">
                    <button className="w-full text-center text-sm text-[var(--color-primary)] hover:underline font-medium py-1">View all notifications</button>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => { setProfileOpen(!profileOpen); setNotificationsOpen(false); }}
                className="flex items-center gap-2 pl-2 hover:bg-gray-50 rounded-xl transition-colors"
              >
                <div className="w-9 h-9 bg-gradient-to-br from-[var(--color-primary)] to-blue-600 rounded-xl flex items-center justify-center text-white font-semibold text-sm shadow-md shadow-blue-500/20">
                  {getInitials(userName)}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-semibold text-gray-900 capitalize">{userName}</p>
                  <p className="text-xs text-gray-500 capitalize">{role}</p>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400 hidden md:block" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-white">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-[var(--color-primary)] to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md">
                        {getInitials(userName)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900 capitalize">{userName}</p>
                        <p className="text-xs text-gray-500">{userEmail}</p>
                      </div>
                    </div>
                  </div>
                  <div className="py-2">
                    <button onClick={() => router.push('/student-report')} className="w-full flex items-center gap-3 px-5 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                      <UserCircle className="w-5 h-5 text-gray-400" />
                      My Profile
                    </button>
                    <button onClick={() => router.push('/fees')} className="w-full flex items-center gap-3 px-5 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                      <Receipt className="w-5 h-5 text-gray-400" />
                      Fee Submission
                    </button>
                    <button onClick={() => router.push('/hostel')} className="w-full flex items-center gap-3 px-5 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                      <Building2 className="w-5 h-5 text-gray-400" />
                      Hostel
                    </button>
                    <button className="w-full flex items-center gap-3 px-5 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                      <Trophy className="w-5 h-5 text-gray-400" />
                      Sports Registration
                    </button>
                  </div>
                  <div className="py-2 border-t border-gray-100">
                    <button onClick={() => router.push('/settings')} className="w-full flex items-center gap-3 px-5 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                      <Settings className="w-5 h-5 text-gray-400" />
                      Settings
                    </button>
                  </div>
                  <div className="py-2 border-t border-gray-100">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-5 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogoutIcon className="w-5 h-5" />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar + Main Content Container */}
      <div className="flex pt-16">
        {/* Sidebar - Fixed on mobile, sticky on desktop */}
        <aside
          className={`
            fixed lg:sticky top-16 z-40
            w-72 h-[calc(100vh-64px)] transition-transform duration-300 ease-in-out
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}
        >
          <div className="h-full bg-white border-r border-[var(--color-border-light)] flex flex-col shadow-xl lg:shadow-none">
            {/* User Profile Card */}
            <div className="p-4 border-b border-[var(--color-border-light)] bg-gradient-to-br from-[var(--color-primary-faint)] via-white to-white">
              <div className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm border border-[var(--color-border-light)]">
                <div className="w-12 h-12 bg-gradient-to-br from-[var(--color-primary)] to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-500/20">
                  {getInitials(userName)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[var(--color-text-primary)] capitalize truncate">{userName}</p>
                  <p className="text-xs text-[var(--color-text-muted)] capitalize">{role}</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-3 space-y-6 overflow-y-auto">
              {(() => {
                const sections: { [key: string]: typeof navItems } = {}
                navItems.forEach(item => {
                  const section = item.section || 'Main'
                  if (!sections[section]) sections[section] = []
                  sections[section].push(item)
                })
                
                return Object.entries(sections).map(([sectionName, items]) => (
                  <div key={sectionName}>
                    <div className="px-3 py-2">
                      <span className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">{sectionName}</span>
                    </div>
                    <div className="space-y-1">
                      {items.map((item) => {
                        const isActive = currentHash === item.href || (item.href === '#overview' && (!currentHash || currentHash === ''))

                        return (
                          <button
                            key={item.href}
                            onClick={() => handleNavClick(item.href)}
                            className={`
                              group w-full text-left relative overflow-hidden
                              transition-all duration-200
                              ${isActive
                                ? ''
                                : ''
                              }
                            `}
                          >
                            {/* Card-like styling for nav item */}
                            <div className={`
                              flex items-center gap-3 px-4 py-3.5 rounded-xl border transition-all duration-200
                              ${isActive
                                ? 'bg-gradient-to-r from-[var(--color-primary)] to-blue-600 text-white shadow-lg shadow-blue-500/20 border-transparent'
                                : 'bg-white border-[var(--color-border-light)] hover:border-[var(--color-primary)] hover:shadow-md hover:-translate-y-0.5 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                              }
                            `}>
                              {/* Active indicator */}
                              {isActive && (
                                <div className="absolute left-0 top-2 bottom-2 w-1 bg-white rounded-r-full" />
                              )}
                              
                              {/* Icon container */}
                              <div className={`
                                w-10 h-10 rounded-lg flex items-center justify-center shrink-0
                                ${isActive 
                                  ? 'bg-white/20 text-white' 
                                  : 'bg-[var(--color-surface-subtle)] text-[var(--color-text-muted)] group-hover:text-[var(--color-primary)] group-hover:bg-[var(--color-primary-faint)]'
                                }
                                transition-all duration-200
                              `}>
                                {item.icon}
                              </div>
                              
                              {/* Label */}
                              <span className="flex-1 text-sm font-medium">
                                {item.label}
                              </span>
                              
                              {/* Badge */}
                              {item.badge !== undefined && item.badge > 0 && (
                                <span className={`
                                  px-2.5 py-1 rounded-full text-xs font-semibold
                                  ${isActive 
                                    ? 'bg-white/20 text-white' 
                                    : 'bg-red-500 text-white'
                                  }
                                `}>
                                  {item.badge}
                                </span>
                              )}
                              
                              {/* Chevron for inactive */}
                              {!isActive && (
                                <ChevronDown className="w-4 h-4 text-[var(--color-text-muted)] opacity-0 group-hover:opacity-100 -rotate-90 group-hover:rotate-0 transition-all duration-200" />
                              )}
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))
              })()}
            </nav>

            {/* Bottom Actions */}
            <div className="p-3 border-t border-[var(--color-border-light)] space-y-2">
              <button
                onClick={() => router.push('/settings')}
                className="group w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border border-[var(--color-border-light)] bg-white hover:border-[var(--color-primary)] hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
              >
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[var(--color-surface-subtle)] text-[var(--color-text-muted)] group-hover:text-[var(--color-primary)] group-hover:bg-[var(--color-primary-faint)] transition-all duration-200">
                  <Settings className="w-5 h-5" />
                </div>
                <span className="flex-1 text-sm font-medium">Settings</span>
              </button>
              <button
                onClick={handleLogout}
                className="group w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border border-red-100 bg-red-50 hover:bg-red-100 transition-all duration-200 text-red-600"
              >
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-red-100 text-red-600 group-hover:bg-red-200 transition-all duration-200">
                  <LogOut className="w-5 h-5" />
                </div>
                <span className="flex-1 text-sm font-medium">Sign out</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-h-[calc(100vh-64px)] p-4 md:p-6 lg:p-8 w-full max-w-[1600px] lg:ml-72">
          {children}
        </main>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}
