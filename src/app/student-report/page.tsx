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
  Download,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Award,
  Home,
  BookOpen,
  User,
  CreditCard
} from 'lucide-react'

const NOTIFICATIONS = [
  { id: 1, title: 'Assignment Due Tomorrow', message: 'DBMS Assignment 3 due tomorrow', time: '2 hours ago', unread: true },
  { id: 2, title: 'Attendance Warning', message: 'Your attendance in OS is below 75%', time: '1 day ago', unread: true },
]

const STUDENT = {
  name: 'Vanshit Gaur',
  rollNumber: '240010150100',
  enrollment: '2024/CS/001',
  email: 'student@gjust.edu.in',
  personalEmail: 'vanshitgaur@gmail.com',
  phone: '+91 9876543210',
  dob: '15 August 2005',
  gender: 'Male',
  category: 'General',
  aadhar: '1234 5678 9012 3456',
  bloodGroup: 'B+',
  fatherName: 'Rajendra Gaur',
  motherName: 'Sunita Gaur',
  address: '42, Civil Lines, Jaipur, Rajasthan - 302006',
  branch: 'Computer Science and Engineering',
  year: 'Second Year',
  section: 'A',
  cgpa: 8.3,
  attendance: 79
}

const SEMISTERS = [
  { sem: 1, year: '2024-25', cgpa: 8.08 },
  { sem: 2, year: '2024-25', cgpa: 8.79 },
  { sem: 3, year: '2025-26', cgpa: 8.05 },
  { sem: 4, year: '2025-26', cgpa: '-' },
]

export default function StudentProfilePage() {
  const router = useRouter()
  const [notifOpen, setNotifOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const notifRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false)
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('userRole')
    localStorage.removeItem('userEmail')
    router.push('/')
  }

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => router.push('/dashboard/student')} className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
                <Layers className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-gray-900">DeptWP</span>
            </button>
          </div>
          <div className="flex items-center gap-2">
            <div ref={notifRef} className="relative">
              <button onClick={() => { setNotifOpen(!notifOpen); setMenuOpen(false) }} className="p-2 hover:bg-gray-100 rounded-lg">
                <Bell className="w-4 h-4 text-gray-600" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
              </button>
              {notifOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="font-semibold text-sm">Notifications</p>
                  </div>
                  {NOTIFICATIONS.map(n => (
                    <div key={n.id} className="px-4 py-3 hover:bg-gray-50 cursor-pointer">
                      <p className="text-sm font-medium">{n.title}</p>
                      <p className="text-xs text-gray-500">{n.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div ref={menuRef} className="relative">
              <button onClick={() => { setMenuOpen(!menuOpen); setNotifOpen(false) }} className="flex items-center gap-2 pl-2 hover:bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center text-white text-xs font-bold">
                  {getInitials(STUDENT.name)}
                </div>
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="font-semibold text-sm">{STUDENT.name}</p>
                    <p className="text-xs text-gray-500">{STUDENT.rollNumber}</p>
                  </div>
                  <div className="py-1">
                    <button onClick={() => router.push('/student-report')} className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"><UserCircle className="w-4" /> My Profile</button>
                    <button onClick={() => router.push('/fees')} className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"><Receipt className="w-4" /> Fee</button>
                    <button onClick={() => router.push('/hostel')} className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"><Building2 className="w-4" /> Hostel</button>
                    <button onClick={() => router.push('/settings')} className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"><Settings className="w-4" /> Settings</button>
                  </div>
                  <div className="border-t border-gray-100 py-1">
                    <button onClick={handleLogout} className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"><LogOut className="w-4" /> Sign out</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6">
        <button onClick={() => router.push('/dashboard/student')} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-4">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-6">
          <div className="h-24 bg-gray-900"></div>
          <div className="px-6 pb-6">
            <div className="flex flex-col sm:flex-row items-end gap-4 -mt-12">
              <div className="w-20 h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center overflow-hidden border-4 border-white">
                <div className="w-full h-full bg-gray-800 flex items-center justify-center text-white text-2xl font-bold">
                  {getInitials(STUDENT.name)}
                </div>
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900">{STUDENT.name}</h1>
                <p className="text-gray-500">{STUDENT.branch}</p>
                <div className="flex gap-2 mt-1">
                  <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-full">{STUDENT.year}</span>
                  <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-full">Section {STUDENT.section}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="text-center px-4 py-2 bg-gray-100 rounded-xl">
                  <p className="text-xl font-bold text-gray-900">{STUDENT.cgpa}</p>
                  <p className="text-xs text-gray-500">CGPA</p>
                </div>
                <div className="text-center px-4 py-2 bg-gray-100 rounded-xl">
                  <p className="text-xl font-bold text-gray-900">{STUDENT.attendance}%</p>
                  <p className="text-xs text-gray-500">Attendance</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Roll Number Banner */}
        <div className="bg-gray-900 rounded-xl p-4 mb-6 text-white">
            <div className="flex items-center justify-between">
            <div>
              <p className="text-xs opacity-80">Roll Number</p>
              <p className="text-xl font-bold">{STUDENT.rollNumber}</p>
            </div>
            <CreditCard className="w-8 h-8 opacity-50" />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {/* Personal Info */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><User className="w-4 h-4" /> Personal Information</h3>
            <div className="space-y-3">
              <InfoRow label="Full Name" value={STUDENT.name} />
              <InfoRow label="Date of Birth" value={STUDENT.dob} />
              <InfoRow label="Gender" value={STUDENT.gender} />
              <InfoRow label="Category" value={STUDENT.category} />
              <InfoRow label="Blood Group" value={STUDENT.bloodGroup} />
            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><Mail className="w-4 h-4" /> Contact Information</h3>
            <div className="space-y-3">
              <InfoRow icon={<Mail className="w-3 h-3" />} label="Institutional Email" value={STUDENT.email} />
              <InfoRow icon={<Mail className="w-3 h-3" />} label="Personal Email" value={STUDENT.personalEmail} />
              <InfoRow icon={<Phone className="w-3 h-3" />} label="Phone" value={STUDENT.phone} />
              <InfoRow icon={<MapPin className="w-3 h-3" />} label="Address" value={STUDENT.address} />
            </div>
          </div>

          {/* Parent Info */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><User className="w-4 h-4" /> Parent Information</h3>
            <div className="space-y-3">
              <InfoRow label="Father's Name" value={STUDENT.fatherName} />
              <InfoRow label="Mother's Name" value={STUDENT.motherName} />
            </div>
          </div>

          {/* ID Details */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><CreditCard className="w-4 h-4" /> ID Details</h3>
            <div className="space-y-3">
              <InfoRow label="Enrollment Number" value={STUDENT.enrollment} />
              <InfoRow label="Roll Number" value={STUDENT.rollNumber} />
              <InfoRow label="Aadhaar Card" value={STUDENT.aadhar} />
            </div>
          </div>
        </div>

        {/* Academic Performance */}
        <div className="bg-white rounded-xl border border-gray-200 mt-4 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2"><BookOpen className="w-4 h-4" /> Academic Performance</h3>
            <button className="text-xs text-gray-600 hover:text-gray-900 flex items-center gap-1"><Download className="w-3 h-3" /> Download</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-500">Semester</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-500">Year</th>
                  <th className="px-5 py-3 text-center text-xs font-medium text-gray-500">CGPA</th>
                  <th className="px-5 py-3 text-center text-xs font-medium text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {SEMISTERS.map(s => (
                  <tr key={s.sem} className="hover:bg-gray-50">
                    <td className="px-5 py-3 text-sm font-medium text-gray-900">Semester {s.sem}</td>
                    <td className="px-5 py-3 text-sm text-gray-600">{s.year}</td>
                    <td className="px-5 py-3 text-sm text-center font-semibold text-gray-900">{s.cgpa}</td>
                    <td className="px-5 py-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${s.cgpa === '-' ? 'bg-gray-100 text-gray-700' : 'bg-gray-100 text-gray-700'}`}>
                        {s.cgpa === '-' ? 'In Progress' : 'Completed'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}

function InfoRow({ label, value, icon }: { label: string, value: string, icon?: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2">
      {icon && <span className="text-gray-400 mt-0.5">{icon}</span>}
      <div>
        <p className="text-[10px] text-gray-400">{label}</p>
        <p className="text-sm text-gray-900">{value}</p>
      </div>
    </div>
  )
}
