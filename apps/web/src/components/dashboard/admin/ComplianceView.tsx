'use client'

export function ComplianceView() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Compliance</h2>
        <p className="text-sm text-slate-500 mt-1">System compliance & audit status</p>
      </div>
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-slate-900">Compliance Score</h3>
          <span className="text-2xl font-bold text-green-600">94%</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-3">
          <div className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full" style={{ width: '94%' }} />
        </div>
      </div>
    </div>
  )
}
