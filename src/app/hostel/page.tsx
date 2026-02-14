'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Layers, 
  Bell, 
  ChevronDown, 
  LogOut, 
  Settings, 
  UserCircle, 
  Receipt, 
  Building2, 
  ArrowLeft,
  Bed,
  Users,
  Utensils,
  History,
  Home,
  Phone
} from 'lucide-react'

const NOTIFICATIONS = [
  { id: 1, title: 'Assignment Due Tomorrow', message: 'DBMS Assignment 3 due tomorrow', time: '2 hours ago', unread: true },
]

const STUDENT_INFO = {
  name: 'Vanshit Gaur',
  rollNumber: '240010150100',
  email: 'student@gjust.edu.in'
}

const CURRENT_HOSTEL = {
  name: 'Vivekanand Hostel',
  block: 'BH4 (Boys Hostel 4)',
  roomNumber: '2A Wing, 318',
  floor: '3rd Floor',
  bedType: '4 Sharing',
  messType: 'Vegetarian',
  warden: 'Dr. O.P. Sangwan (Chief Warden)',
  wardens: ['Mr. Shardul', 'Mr. Manoj Yadav'],
  contact: '+91 1800 123 4567',
  image: ''
}

const HOSTEL_HISTORY = [
  { year: '2025-26', semester: 'Semester 4', hostel: 'Vivekanand Hostel', block: 'BH4', room: '318', status: 'current' },
  { year: '2025-26', semester: 'Semester 3', hostel: 'Vivekanand Hostel', block: 'BH4', room: '215', status: 'previous' },
  { year: '2024-25', semester: 'Semester 2', hostel: 'Vivekanand Hostel', block: 'BH4', room: '112', status: 'previous' },
  { year: '2024-25', semester: 'Semester 1', hostel: 'Vivekanand Hostel', block: 'BH4', room: '108', status: 'previous' },
]

export default function HostelPage() {
  const router = useRouter()
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
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
                      <Settings className="w-4 h-4" /> Settings
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
      <main className="pt-14 pb-10 px-3 md:px-4 max-w-4xl mx-auto">
        <button 
          onClick={() => router.push('/dashboard/student')}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        {/* Header */}
        <div className="mb-4">
          <h1 className="text-xl font-semibold text-gray-900">Hostel Details</h1>
          <p className="text-sm text-gray-500">Your current hostel information and history</p>
        </div>

        {/* Current Hostel Card */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-4">
          <div className="h-20 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
          <div className="px-5 pb-5">
            <div className="flex items-center gap-4 -mt-10 mb-4">
              <div className="w-16 h-16 bg-white rounded-xl shadow-lg flex items-center justify-center">
                <Building2 className="w-8 h-8 text-blue-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-bold text-gray-900">{CURRENT_HOSTEL.name}</h2>
                <p className="text-sm text-gray-500">{CURRENT_HOSTEL.block}</p>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">Current</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                  <Home className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-500">Room Number</p>
                  <p className="text-sm font-semibold text-gray-900">{CURRENT_HOSTEL.roomNumber}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <div className="w-9 h-9 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600">
                  <Bed className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-500">Bed Type</p>
                  <p className="text-sm font-semibold text-gray-900">{CURRENT_HOSTEL.bedType}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <div className="w-9 h-9 bg-amber-100 rounded-lg flex items-center justify-center text-amber-600">
                  <Utensils className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-500">Mess Type</p>
                  <p className="text-sm font-semibold text-gray-900">{CURRENT_HOSTEL.messType}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <div className="w-9 h-9 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-500">Floor</p>
                  <p className="text-sm font-semibold text-gray-900">{CURRENT_HOSTEL.floor}</p>
                </div>
              </div>
            </div>

            {/* Wardens */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <h4 className="text-xs font-medium text-gray-500 mb-2">Warden Contact</h4>
              <p className="text-sm font-medium text-gray-900">{CURRENT_HOSTEL.warden}</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {CURRENT_HOSTEL.wardens.map((w, i) => (
                  <span key={i} className="text-xs text-gray-600">{w}</span>
                ))}
              </div>
              <a href={`tel:${CURRENT_HOSTEL.contact}`} className="inline-flex items-center gap-1 text-xs text-[var(--color-primary)] mt-1 hover:underline">
                <Phone className="w-3 h-3" /> {CURRENT_HOSTEL.contact}
              </a>
            </div>
          </div>
        </div>

        {/* Hostel History */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900 text-sm flex items-center gap-2">
              <History className="w-4 h-4" />
              Hostel History
            </h3>
          </div>
          <div className="divide-y divide-gray-100">
            {HOSTEL_HISTORY.map((history, idx) => (
              <div key={idx} className="px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    history.status === 'current' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'
                  }`}>
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{history.hostel}</p>
                    <p className="text-xs text-gray-500">Block {history.block} • Room {history.room}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    history.status === 'current' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {history.semester}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
