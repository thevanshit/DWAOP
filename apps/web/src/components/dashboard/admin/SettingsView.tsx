'use client'

export function SettingItem({ label, value, description }: { label: string; value: string; description: string }) {
  return (
    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
      <div>
        <p className="text-sm font-medium text-slate-700">{label}</p>
        <p className="text-xs text-slate-500">{description}</p>
      </div>
      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium">
        {value}
      </span>
    </div>
  )
}

export function SettingsView() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Settings</h2>
        <p className="text-sm text-slate-500 mt-1">Configure department policies and system settings</p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">Policy Configuration</h3>
          <div className="space-y-4">
            <SettingItem label="Attendance Threshold" value="75%" description="Minimum attendance required for exam eligibility" />
            <SettingItem label="Grace Period" value="15 mins" description="Late arrival tolerance for attendance" />
            <SettingItem label="Leave Approval" value="Auto" description="Auto-approve leaves under 2 days" />
            <SettingItem label="Mark Review Window" value="7 days" description="Time for students to review marks" />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">System Settings</h3>
          <div className="space-y-4">
            <SettingItem label="Notifications" value="Enabled" description="Email and in-app notifications" />
            <SettingItem label="Audit Logs" value="90 days" description="Retention period for audit trails" />
            <SettingItem label="Data Export" value="CSV, PDF" description="Available export formats" />
            <SettingItem label="Session Timeout" value="30 mins" description="Auto-logout after inactivity" />
          </div>
        </div>
      </div>
    </div>
  )
}
