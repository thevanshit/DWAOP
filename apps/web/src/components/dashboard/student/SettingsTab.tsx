'use client'

import { Settings } from 'lucide-react'

export default function SettingsTab() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-slate-900">Settings</h2>
      <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
        <Settings className="w-12 h-12 text-slate-400 mx-auto mb-4" />
        <p className="text-slate-500">Settings page coming soon</p>
      </div>
    </div>
  )
}
