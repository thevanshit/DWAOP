'use client'

import { useState } from 'react'
import {
  CheckCircle,
  Clock,
  Wallet,
  CalendarDays,
  AlertCircle,
  CreditCard,
  Download,
  ChevronRight,
  QrCode,
  Landmark,
  XCircle,
  Building2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { FEE_STRUCTURE, TRANSACTIONS } from './data'

export default function FeesTab() {
  const [showQR, setShowQR] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)

  const totalPending = FEE_STRUCTURE.filter(f => f.status === 'pending').reduce((sum, f) => sum + f.total, 0)
  const totalPaid = FEE_STRUCTURE.filter(f => f.status === 'paid').reduce((sum, f) => sum + f.total, 0)
  const pendingFee = FEE_STRUCTURE.find(f => f.status === 'pending')

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-slate-900">Fee Submission</h2>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-slate-500">Total Paid</span>
            <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-green-600">₹{totalPaid.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-slate-500">Pending</span>
            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-amber-600">₹{totalPending.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-slate-500">Per Semester</span>
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900">₹59,050</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-slate-500">Next Due</span>
            <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
              <CalendarDays className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900">Feb 28</p>
        </div>
      </div>

      {pendingFee && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/50 rounded-2xl p-6">
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
              </div>
            </div>
            <button
              onClick={() => setShowPaymentModal(true)}
              className="px-5 py-2.5 bg-amber-600 text-white font-medium rounded-xl hover:bg-amber-700 inline-flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all hover:scale-105"
            >
              <CreditCard className="w-4 h-4" />
              Pay Now
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="font-semibold text-slate-900">Fee Structure</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left text-[10px] font-semibold text-slate-500 uppercase px-4 py-3">Semester</th>
                <th className="text-right text-[10px] font-semibold text-slate-500 uppercase px-4 py-3">Tuition</th>
                <th className="text-right text-[10px] font-semibold text-slate-500 uppercase px-4 py-3">Hostel</th>
                <th className="text-right text-[10px] font-semibold text-slate-500 uppercase px-4 py-3">Total</th>
                <th className="text-center text-[10px] font-semibold text-slate-500 uppercase px-4 py-3">Status</th>
                <th className="text-center text-[10px] font-semibold text-slate-500 uppercase px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {FEE_STRUCTURE.map((fee) => (
                <tr key={fee.id} className="hover:bg-slate-50">
                  <td className="px-4 py-4">
                    <p className="text-sm font-semibold text-slate-900">{fee.semester}</p>
                    <p className="text-xs text-slate-500">{fee.year}</p>
                  </td>
                  <td className="px-4 py-4 text-sm text-right text-slate-600">₹{fee.tuition.toLocaleString()}</td>
                  <td className="px-4 py-4 text-sm text-right text-slate-600">₹{fee.hostel.toLocaleString()}</td>
                  <td className="px-4 py-4 text-sm font-bold text-slate-900 text-right">₹{fee.total.toLocaleString()}</td>
                  <td className="px-4 py-4 text-center">
                    <span className={cn("px-3 py-1.5 rounded-full text-xs font-semibold", fee.status === 'paid' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600')}>
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
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium inline-flex items-center gap-1"
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

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-semibold text-slate-900">Transaction History</h3>
          <button className="text-sm text-blue-600 hover:underline flex items-center gap-1 font-medium">
            <Download className="w-4 h-4" /> Download All
          </button>
        </div>
        <div className="divide-y divide-slate-100">
          {TRANSACTIONS.map((txn) => (
            <div key={txn.id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">₹{txn.amount.toLocaleString()}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-slate-500">{txn.method}</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-xs text-slate-500">{txn.reference}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-slate-900">{txn.semester}</p>
                <p className="text-xs text-slate-500">{txn.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-1">Select Payment Method</h3>
              <p className="text-slate-500 text-sm">Amount: ₹59,050</p>
            </div>
            <div className="space-y-3">
              <button
                onClick={() => { setShowPaymentModal(false); setShowQR(true); }}
                className="w-full flex items-center gap-4 p-4 border border-slate-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                  <QrCode className="w-6 h-6" />
                </div>
                <div className="text-left flex-1">
                  <p className="font-semibold text-slate-900">UPI / QR Code</p>
                  <p className="text-xs text-slate-500">Scan & Pay via any UPI app</p>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </button>
              <button className="w-full flex items-center gap-4 p-4 border border-slate-200 rounded-xl hover:border-green-300 hover:bg-green-50 transition-all">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600">
                  <Landmark className="w-6 h-6" />
                </div>
                <div className="text-left flex-1">
                  <p className="font-semibold text-slate-900">Net Banking</p>
                  <p className="text-xs text-slate-500">Direct bank transfer</p>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </button>
              <button className="w-full flex items-center gap-4 p-4 border border-slate-200 rounded-xl hover:border-purple-300 hover:bg-purple-50 transition-all">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600">
                  <CreditCard className="w-6 h-6" />
                </div>
                <div className="text-left flex-1">
                  <p className="font-semibold text-slate-900">Debit / Credit Card</p>
                  <p className="text-xs text-slate-500">Visa, Mastercard, RuPay</p>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <button
              onClick={() => setShowPaymentModal(false)}
              className="w-full mt-4 px-4 py-2.5 border border-slate-200 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {showQR && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <div className="text-center">
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mx-auto mb-4">
                <QrCode className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-1">Scan to Pay</h3>
              <p className="text-slate-500 mb-4">Amount: <span className="font-bold text-slate-900">₹59,050</span></p>
              <div className="bg-slate-100 rounded-xl p-4 mb-4">
                <div className="w-40 h-40 bg-white mx-auto rounded-lg flex items-center justify-center border-2 border-dashed border-slate-300">
                  <QrCode className="w-24 h-24 text-slate-400" />
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowQR(false)}
                  className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-50"
                >
                  Cancel
                </button>
                <a
                  href="upi://pay?pa=college@upi&pn=DeptWP&am=59050"
                  className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium text-center hover:bg-blue-700"
                >
                  Open UPI
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
