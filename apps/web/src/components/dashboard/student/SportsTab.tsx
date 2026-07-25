'use client'

import { useState } from 'react'
import {
  Dumbbell, CheckCircle, CalendarDays, MapPin,
  Trophy, Medal, ClipboardList, XCircle,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { SPORTS_FACILITIES, SPORTS_EVENTS, SPORTS_ACHIEVEMENTS } from './data'

export default function SportsTab() {
  const [activeSection, setActiveSection] = useState<'facilities' | 'events' | 'achievements' | 'registrations'>('facilities')
  const [showRegisterModal, setShowRegisterModal] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<any>(null)

  const myRegistrations = SPORTS_EVENTS.filter(e => e.registered)

  const openRegisterModal = (event: any) => {
    setSelectedEvent(event)
    setShowRegisterModal(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white border border-slate-200 rounded-xl flex items-center justify-center shadow-sm">
            <Dumbbell className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Sports & Recreation</h2>
            <p className="text-sm text-slate-500">Facilities, events & achievements</p>
          </div>
        </div>
      </div>

      {/* Section Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <button onClick={() => setActiveSection('facilities')} className={cn("px-4 py-2.5 rounded-xl text-sm font-medium transition-all", activeSection === 'facilities' ? "bg-blue-600 text-white shadow-sm" : "bg-white border border-slate-200 text-slate-600 hover:border-slate-300")}>Facilities</button>
        <button onClick={() => setActiveSection('events')} className={cn("px-4 py-2.5 rounded-xl text-sm font-medium transition-all", activeSection === 'events' ? "bg-blue-600 text-white shadow-sm" : "bg-white border border-slate-200 text-slate-600 hover:border-slate-300")}>Events</button>
        <button onClick={() => setActiveSection('registrations')} className={cn("px-4 py-2.5 rounded-xl text-sm font-medium transition-all", activeSection === 'registrations' ? "bg-blue-600 text-white shadow-sm" : "bg-white border border-slate-200 text-slate-600 hover:border-slate-300")}>My Registrations</button>
        <button onClick={() => setActiveSection('achievements')} className={cn("px-4 py-2.5 rounded-xl text-sm font-medium transition-all", activeSection === 'achievements' ? "bg-blue-600 text-white shadow-sm" : "bg-white border border-slate-200 text-slate-600 hover:border-slate-300")}>Achievements</button>
      </div>

      {activeSection === 'facilities' && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {SPORTS_FACILITIES.map((facility) => (
            <div key={facility.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-3xl mb-3">{facility.icon}</div>
              <h3 className="font-semibold text-slate-900">{facility.name}</h3>
              <p className="text-xs text-slate-500 mt-1">{facility.timing}</p>
              <div className="flex items-center gap-2 mt-3">
                <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Available
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeSection === 'events' && (
        <div className="space-y-4">
          {SPORTS_EVENTS.map((event) => (
            <div key={event.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center text-2xl">
                    {event.sport === 'Basketball' ? '🏀' : event.sport === 'Badminton' ? '🏸' : event.sport === 'Cricket' ? '🏏' : '🏓'}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">{event.name}</h3>
                    <p className="text-sm text-slate-500">{event.sport} • {event.type}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                      <span className="flex items-center gap-1"><CalendarDays className="w-3 h-3" /> {event.date}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {event.venue}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded">Deadline: {event.registrationDeadline}</span>
                      {event.teams && <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded">{event.teams} Teams</span>}
                      {event.participants && <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded">{event.participants} Participants</span>}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  {event.registered ? (
                    <span className="px-3 py-1.5 bg-green-50 text-green-600 text-xs font-medium rounded-full">Registered</span>
                  ) : (
                    <button 
                      onClick={() => openRegisterModal(event)}
                      className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
                    >
                      Register
                    </button>
                  )}
                  <p className="text-xs text-slate-500 mt-2">₹{event.fee}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeSection === 'registrations' && (
        <div className="space-y-4">
          {myRegistrations.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
              <ClipboardList className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-500 font-medium">No registrations yet</p>
              <p className="text-sm text-slate-400 mt-1">Browse events to register</p>
            </div>
          ) : (
            myRegistrations.map((event) => (
              <div key={event.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">{event.name}</h3>
                      <p className="text-sm text-slate-500">{event.sport} • {event.date}</p>
                      <p className="text-xs text-green-600 mt-1">Registration Confirmed</p>
                    </div>
                  </div>
                  <button className="text-sm text-blue-600 hover:underline">View Details</button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeSection === 'achievements' && (
        <div className="space-y-4">
          {SPORTS_ACHIEVEMENTS.map((achievement) => (
            <div key={achievement.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center">
                  <Trophy className="w-7 h-7 text-amber-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900">{achievement.event}</h3>
                  <p className="text-sm text-slate-500">{achievement.sport} • {achievement.date}</p>
                  <p className="text-xs text-slate-400 mt-1">Student: {achievement.student}</p>
                </div>
                <div className="text-right">
                  <span className={cn("px-3 py-1.5 rounded-full text-xs font-medium", 
                    achievement.position === 'Winner' ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-600"
                  )}>
                    {achievement.position}
                  </span>
                </div>
              </div>
            </div>
          ))}
          {SPORTS_ACHIEVEMENTS.length === 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
              <Medal className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-500">No achievements yet. Start participating!</p>
            </div>
          )}
        </div>
      )}

      {/* Registration Modal */}
      {showRegisterModal && selectedEvent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">Event Registration</h3>
              <button onClick={() => setShowRegisterModal(false)} className="text-slate-400 hover:text-slate-600">
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-xl">
                <h4 className="font-semibold text-slate-900">{selectedEvent.name}</h4>
                <p className="text-sm text-slate-500">{selectedEvent.sport} • {selectedEvent.date}</p>
                <p className="text-sm text-slate-500">{selectedEvent.venue}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Team Name (optional)</label>
                <input type="text" placeholder="Enter team name for team events" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Player Names (for team events)</label>
                <textarea placeholder="Enter player names separated by comma" rows={2} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
              </div>
              <div className="flex items-center justify-between p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <span className="text-sm text-slate-700">Registration Fee</span>
                <span className="font-bold text-slate-900">₹{selectedEvent.fee}</span>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowRegisterModal(false)} className="flex-1 px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50">Cancel</button>
                <button onClick={() => setShowRegisterModal(false)} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">Confirm & Pay</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
