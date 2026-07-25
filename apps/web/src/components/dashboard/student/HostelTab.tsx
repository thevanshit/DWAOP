'use client'

import { useState } from 'react'
import {
  Building2,
  AlertTriangle,
  Home,
  Bed,
  Utensils,
  MapPin,
  Phone,
  Clock,
  Coffee,
  Star,
  Moon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  CURRENT_HOSTEL,
  HOSTEL_AMENITIES,
  HOSTEL_HISTORY,
  MESS_MENU,
  HOSTEL_EMERGENCY,
} from './data'

export default function HostelTab() {
  const [activeTab, setActiveTab] = useState<'details' | 'mess' | 'emergency'>('details')

  const getStatusStyle = (status: string) => {
    return status === 'current'
      ? { bg: 'bg-blue-50 text-blue-600', label: 'Current' }
      : { bg: 'bg-slate-100 text-slate-600', label: 'Previous' }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white border border-slate-200 rounded-xl flex items-center justify-center shadow-sm">
            <Building2 className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Hostel Details</h2>
            <p className="text-sm text-slate-500">Your accommodation information</p>
          </div>
        </div>
        <button className="px-4 py-2.5 bg-white border border-slate-200 text-slate-700 text-sm font-medium rounded-xl hover:bg-slate-50 flex items-center gap-2 shadow-sm">
          <AlertTriangle className="w-4 h-4" />
          Report Issue
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab('details')}
          className={cn(
            'px-4 py-2.5 rounded-xl text-sm font-medium transition-all',
            activeTab === 'details'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300',
          )}
        >
          Details
        </button>
        <button
          onClick={() => setActiveTab('mess')}
          className={cn(
            'px-4 py-2.5 rounded-xl text-sm font-medium transition-all',
            activeTab === 'mess'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300',
          )}
        >
          Mess Menu
        </button>
        <button
          onClick={() => setActiveTab('emergency')}
          className={cn(
            'px-4 py-2.5 rounded-xl text-sm font-medium transition-all',
            activeTab === 'emergency'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300',
          )}
        >
          Emergency Contacts
        </button>
      </div>

      {activeTab === 'details' && (
        <>
          {/* Main Hostel Card */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="h-16 bg-slate-50 border-b border-slate-100"></div>
            <div className="px-6 pb-6">
              <div className="flex items-center gap-4 -mt-10 mb-4">
                <div className="w-16 h-16 bg-white border border-slate-200 rounded-xl shadow-sm flex items-center justify-center">
                  <Building2 className="w-8 h-8 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-bold text-slate-900">{CURRENT_HOSTEL.name}</h2>
                  <p className="text-sm text-slate-500">{CURRENT_HOSTEL.block}</p>
                </div>
                <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-full">
                  Current
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                    <Home className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500">Room Number</p>
                    <p className="text-sm font-semibold text-slate-900">
                      {CURRENT_HOSTEL.roomNumber}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                  <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center text-purple-600">
                    <Bed className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500">Bed Type</p>
                    <p className="text-sm font-semibold text-slate-900">
                      {CURRENT_HOSTEL.bedType}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                  <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center text-amber-600">
                    <Utensils className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500">Mess Type</p>
                    <p className="text-sm font-semibold text-slate-900">
                      {CURRENT_HOSTEL.messType}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                  <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-green-600">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500">Floor</p>
                    <p className="text-sm font-semibold text-slate-900">
                      {CURRENT_HOSTEL.floor}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100">
                <h4 className="text-xs font-medium text-slate-500 mb-2">Warden Contact</h4>
                <p className="text-sm font-semibold text-slate-900">{CURRENT_HOSTEL.warden}</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {CURRENT_HOSTEL.wardens.map((w, i) => (
                    <span key={i} className="text-xs text-slate-500">
                      {w}
                    </span>
                  ))}
                </div>
                <a
                  href={`tel:${CURRENT_HOSTEL.contact}`}
                  className="inline-flex items-center gap-1 text-xs text-blue-600 mt-1 hover:underline"
                >
                  <Phone className="w-3 h-3" /> {CURRENT_HOSTEL.contact}
                </a>
              </div>
            </div>
          </div>

          {/* Amenities Grid */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <h3 className="font-semibold text-slate-900 mb-4">Hostel Amenities</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {HOSTEL_AMENITIES.map((amenity) => (
                <div
                  key={amenity.id}
                  className="p-4 bg-slate-50 rounded-xl text-center hover:bg-slate-100 transition-colors"
                >
                  <div className="w-10 h-10 bg-white rounded-lg shadow-sm flex items-center justify-center mx-auto mb-2">
                    <amenity.icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <p className="text-xs font-semibold text-slate-800">{amenity.name}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{amenity.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Hostel History */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-slate-100">
              <h3 className="font-semibold text-slate-900 text-sm flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Hostel History
              </h3>
            </div>
            <div className="divide-y divide-slate-100">
              {HOSTEL_HISTORY.map((history, idx) => (
                <div
                  key={idx}
                  className="px-6 py-4 flex items-center justify-between hover:bg-slate-50"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={cn(
                        'w-10 h-10 rounded-xl flex items-center justify-center',
                        getStatusStyle(history.status).bg,
                      )}
                    >
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">{history.hostel}</p>
                      <p className="text-xs text-slate-500">
                        Block {history.block} • Room {history.room}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={cn(
                        'text-xs font-medium px-2 py-1 rounded-full',
                        getStatusStyle(history.status).bg,
                      )}
                    >
                      {history.semester}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {activeTab === 'mess' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <h3 className="font-semibold text-slate-900 mb-4">Weekly Mess Menu</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(MESS_MENU).map(([meal, items]) => (
              <div key={meal} className="p-4 bg-slate-50 rounded-xl">
                <h4 className="text-sm font-semibold text-slate-800 capitalize mb-3 flex items-center gap-2">
                  {meal === 'breakfast' && <Coffee className="w-4 h-4 text-amber-500" />}
                  {meal === 'lunch' && <Utensils className="w-4 h-4 text-green-500" />}
                  {meal === 'snacks' && <Star className="w-4 h-4 text-orange-500" />}
                  {meal === 'dinner' && <Moon className="w-4 h-4 text-indigo-500" />}
                  {meal}
                </h4>
                <ul className="space-y-1.5">
                  {items.map((item, idx) => (
                    <li key={idx} className="text-xs text-slate-600 flex items-center gap-2">
                      <span className="w-1 h-1 bg-slate-300 rounded-full" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-xs text-amber-800">
              Mess timings: Breakfast 7:00-9:00 AM | Lunch 12:00-2:00 PM | Snacks 4:30-5:30 PM |
              Dinner 7:00-9:00 PM
            </p>
          </div>
        </div>
      )}

      {activeTab === 'emergency' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <h3 className="font-semibold text-slate-900 mb-4">Emergency Contacts</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {HOSTEL_EMERGENCY.map((contact) => (
              <div
                key={contact.id}
                className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-900">{contact.name}</p>
                  <p className="text-xs text-slate-500 mt-0.5">Available: {contact.available}</p>
                </div>
                <a
                  href={`tel:${contact.phone}`}
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  <Phone className="w-4 h-4" />
                  Call
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
