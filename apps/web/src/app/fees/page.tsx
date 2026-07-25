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
  CreditCard,
  CheckCircle,
  Clock,
  AlertCircle,
  Download,
  QrCode,
  ChevronRight,
  Wallet,
  Landmark,
  Calendar,
  FileText
} from 'lucide-react'

const NOTIFICATIONS = [
  { id: 1, title: 'Assignment Due Tomorrow', message: 'DBMS Assignment 3 due tomorrow', time: '2 hours ago', unread: true },
  { id: 2, title: 'Attendance Warning', message: 'Your attendance in OS is below 75%', time: '1 day ago', unread: true },
]

const STUDENT_INFO = {
  name: 'Vanshit Gaur',
  rollNumber: '240010150100',
  email: 'student@gjust.edu.in'
}

const FEE_STRUCTURE = [
  { id: 1, semester: 'Semester 1', year: '2024-25', tuition: 42000, hostel: 13550, library: 2000, exam: 1500, total: 59050, status: 'paid', paidDate: '2024-07-20', ref: 'TXN/2024/001' },
  { id: 2, semester: 'Semester 2', year: '2024-25', tuition: 42000, hostel: 13550, library: 2000, exam: 1500, total: 59050, status: 'paid', paidDate: '2024-12-15', ref: 'TXN/2024/002' },
  { id: 3, semester: 'Semester 3', year: '2025-26', tuition: 42000, hostel: 13550, library: 2000, exam: 1500, total: 59050, status: 'paid', paidDate: '2025-07-18', ref: 'TXN/2025/001' },
  { id: 4, semester: 'Semester 4', year: '2025-26', tuition: 42000, hostel: 13550, library: 2000, exam: 1500, total: 59050, status: 'pending', dueDate: '2026-02-28' },
]

const TRANSACTIONS = [
  { id: 1, date: '2024-07-20', amount: 59050, method: 'Online Transfer', reference: 'TXN/2024/001', semester: 'Semester 1' },
  { id: 2, date: '2024-12-15', amount: 59050, method: 'UPI Payment', reference: 'TXN/2024/002', semester: 'Semester 2' },
  { id: 3, date: '2025-07-18', amount: 59050, method: 'Online Transfer', reference: 'TXN/2025/001', semester: 'Semester 3' },
]

export default function FeesPage() {
  const router = useRouter()
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [showQR, setShowQR] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const notifRef = useRef<HTMLDivElement>(null)
  const profileRef = useRef<HTMLDivElement>(null)
  
  const userEmail = typeof window !== 'undefined' ? localStorage.getItem('userEmail') || 'student@gjust.edu.in' : 'student@gjust.edu.in'
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

  const totalPending = FEE_STRUCTURE.filter(f => f.status === 'pending').reduce((sum, f) => sum + f.total, 0)
  const totalPaid = FEE_STRUCTURE.filter(f => f.status === 'paid').reduce((sum, f) => sum + f.total, 0)
  const pendingFee = FEE_STRUCTURE.find(f => f.status === 'pending')

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
      <main className="pt-14 pb-10 px-3 md:px-4 max-w-5xl mx-auto">
        <button 
          onClick={() => router.push('/dashboard/student')}
          className="flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-[var(--color-text-primary)]">Fee Submission</h1>
          <p className="text-[var(--color-text-muted)] mt-1">Manage your tuition and hostel fees</p>
        </div>

        {/* Quick Stats - Card Style */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="
            bg-white rounded-2xl border border-black/[0.04]
            shadow-[0_1px_3px_rgba(0,0,0,0.02),0_4px_12px_rgba(0,0,0,0.02)]
            p-5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)] transition-all duration-200
          ">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-[var(--color-text-muted)]">Total Paid</span>
              <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                <CheckCircle className="w-5 h-5" />
              </div>
            </div>
            <p className="text-2xl font-bold text-green-600">₹{totalPaid.toLocaleString()}</p>
          </div>
          <div className="
            bg-white rounded-2xl border border-black/[0.04]
            shadow-[0_1px_3px_rgba(0,0,0,0.02),0_4px_12px_rgba(0,0,0,0.02)]
            p-5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)] transition-all duration-200
          ">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-[var(--color-text-muted)]">Pending</span>
              <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
                <Clock className="w-5 h-5" />
              </div>
            </div>
            <p className="text-2xl font-bold text-amber-600">₹{totalPending.toLocaleString()}</p>
          </div>
          <div className="
            bg-white rounded-2xl border border-black/[0.04]
            shadow-[0_1px_3px_rgba(0,0,0,0.02),0_4px_12px_rgba(0,0,0,0.02)]
            p-5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)] transition-all duration-200
          ">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-[var(--color-text-muted)]">Per Semester</span>
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                <Wallet className="w-5 h-5" />
              </div>
            </div>
            <p className="text-2xl font-bold text-[var(--color-text-primary)]">₹59,050</p>
          </div>
          <div className="
            bg-white rounded-2xl border border-black/[0.04]
            shadow-[0_1px_3px_rgba(0,0,0,0.02),0_4px_12px_rgba(0,0,0,0.02)]
            p-5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)] transition-all duration-200
          ">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-[var(--color-text-muted)]">Next Due</span>
              <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
                <Calendar className="w-5 h-5" />
              </div>
            </div>
            <p className="text-2xl font-bold text-[var(--color-text-primary)]">Feb 28</p>
          </div>
        </div>

        {/* Pending Fee Alert */}
        {pendingFee && (
          <div className="
            bg-gradient-to-r from-amber-50 to-orange-50 
            border border-amber-200/50 rounded-2xl p-6 mb-6 
            shadow-[0_1px_3px_rgba(0,0,0,0.02)]
          ">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex items-start gap-4 flex-1">
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600 shrink-0">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-amber-900 text-lg">Pending Fee Payment</h3>
                  <p className="text-amber-700 mt-1">
                    You have <span className="font-bold text-amber-900">₹{pendingFee.total.toLocaleString()}</span> pending for {pendingFee.semester} ({pendingFee.year})
                  </p>
                  <p className="text-sm text-amber-600 mt-1">Due Date: February 28, 2026</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowQR(true)}
                  className="px-5 py-2.5 bg-amber-600 text-white font-medium rounded-xl hover:bg-amber-700 inline-flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all hover:scale-105"
                >
                  <CreditCard className="w-4 h-4" />
                  Pay Now
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Fee Structure - Card Style */}
        <div className="
          bg-white rounded-2xl border border-black/[0.04]
          shadow-[0_1px_3px_rgba(0,0,0.0.02),0_4px_12px_rgba(0,0,0,0.02)]
          overflow-hidden mb-6
        ">
          <div className="px-6 py-4 border-b border-black/[0.04] flex items-center justify-between">
            <h3 className="font-semibold text-[var(--color-text-primary)]">Fee Structure</h3>
            <span className="text-sm text-[var(--color-text-muted)]">All amounts in INR (₹)</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Semester</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-[var(--color-text-muted)] uppercase">Tuition</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-[var(--color-text-muted)] uppercase">Hostel</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-[var(--color-text-muted)] uppercase">Library</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-[var(--color-text-muted)] uppercase">Exam</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-[var(--color-text-muted)] uppercase">Total</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-[var(--color-text-muted)] uppercase">Status</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-[var(--color-text-muted)] uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/[0.04]">
                {FEE_STRUCTURE.map((fee) => (
                  <tr key={fee.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-semibold text-[var(--color-text-primary)]">{fee.semester}</p>
                        <p className="text-xs text-[var(--color-text-muted)]">{fee.year}</p>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-right text-[var(--color-text-muted)]">₹{fee.tuition.toLocaleString()}</td>
                    <td className="px-4 py-4 text-sm text-right text-[var(--color-text-muted)]">₹{fee.hostel.toLocaleString()}</td>
                    <td className="px-4 py-4 text-sm text-right text-[var(--color-text-muted)]">₹{fee.library.toLocaleString()}</td>
                    <td className="px-4 py-4 text-sm text-right text-[var(--color-text-muted)]">₹{fee.exam.toLocaleString()}</td>
                    <td className="px-4 py-4 text-sm font-bold text-[var(--color-text-primary)] text-right">₹{fee.total.toLocaleString()}</td>
                    <td className="px-4 py-4 text-center">
                      <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                        fee.status === 'paid' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'
                      }`}>
                        {fee.status === 'paid' ? 'Paid' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      {fee.status === 'paid' ? (
                        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium inline-flex items-center gap-1">
                          <Download className="w-4 h-4" /> Receipt
                        </button>
                      ) : (
                        <button 
                          onClick={() => setShowPaymentModal(true)}
                          className="text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] text-sm font-medium inline-flex items-center gap-1"
                        >
                          Pay <ChevronRight className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Transaction History - Card Style */}
        <div className="
          bg-white rounded-2xl border border-black/[0.04]
          shadow-[0_1px_3px_rgba(0,0,0,0.02),0_4px_12px_rgba(0,0,0,0.02)]
          overflow-hidden
        ">
          <div className="px-6 py-4 border-b border-black/[0.04] flex items-center justify-between">
            <h3 className="font-semibold text-[var(--color-text-primary)]">Transaction History</h3>
            <button className="text-sm text-[var(--color-primary)] hover:underline flex items-center gap-1 font-medium">
              <Download className="w-4 h-4" /> Download All
            </button>
          </div>
          <div className="divide-y divide-black/[0.04]">
            {TRANSACTIONS.map((txn) => (
              <div key={txn.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[var(--color-text-primary)]">₹{txn.amount.toLocaleString()}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-[var(--color-text-muted)]">{txn.method}</span>
                      <span className="text-gray-300">•</span>
                      <span className="text-xs text-[var(--color-text-muted)]">{txn.reference}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-[var(--color-text-primary)]">{txn.semester}</p>
                  <p className="text-xs text-[var(--color-text-muted)]">{txn.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* QR Modal */}
        {showQR && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
              <div className="text-center">
                <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mx-auto mb-4">
                  <QrCode className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Scan to Pay</h3>
                <p className="text-gray-500 mb-4">Amount: <span className="font-bold text-gray-900">₹59,050</span></p>
                <div className="bg-gray-100 rounded-xl p-4 mb-4">
                  <div className="w-40 h-40 bg-white mx-auto rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                    <QrCode className="w-24 h-24 text-gray-400" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setShowQR(false)}
                    className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <a 
                    href="upi://pay?pa=college@upi&pn=DeptWP&am=59050"
                    className="flex-1 px-4 py-2.5 bg-[var(--color-primary)] text-white rounded-xl text-sm font-medium text-center hover:bg-[var(--color-primary-dark)]"
                  >
                    Open UPI
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Payment Modal */}
        {showPaymentModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Select Payment Method</h3>
                <p className="text-gray-500 text-sm">Amount: ₹59,050</p>
              </div>
              <div className="space-y-3">
                <button 
                  onClick={() => { setShowPaymentModal(false); setShowQR(true); }}
                  className="w-full flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all"
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                    <QrCode className="w-6 h-6" />
                  </div>
                  <div className="text-left flex-1">
                    <p className="font-semibold text-gray-900">UPI / QR Code</p>
                    <p className="text-xs text-gray-500">Scan & Pay via any UPI app</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
                <button className="w-full flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:border-green-300 hover:bg-green-50 transition-all">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600">
                    <Landmark className="w-6 h-6" />
                  </div>
                  <div className="text-left flex-1">
                    <p className="font-semibold text-gray-900">Net Banking</p>
                    <p className="text-xs text-gray-500">Direct bank transfer</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
                <button className="w-full flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:border-purple-300 hover:bg-purple-50 transition-all">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600">
                    <CreditCard className="w-6 h-6" />
                  </div>
                  <div className="text-left flex-1">
                    <p className="font-semibold text-gray-900">Debit / credit Card</p>
                    <p className="text-xs text-gray-500">Visa, Mastercard, RuPay</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
              </div>
              <button 
                onClick={() => setShowPaymentModal(false)}
                className="w-full mt-4 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
