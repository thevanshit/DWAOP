'use client'

import LoginForm from '@/components/auth/LoginForm'
import { GraduationCap } from 'lucide-react'

export default function TeacherLoginPage() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-white flex items-center justify-center p-6">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(147,51,234,0.15),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(236,72,153,0.1),transparent_50%)]"></div>
      
      <div className="relative z-10">
        <LoginForm
          role="teacher"
          roleLabel="Faculty & Teacher"
          roleIcon={
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
              <GraduationCap className="w-10 h-10 text-white" />
            </div>
          }
        />
      </div>
    </div>
  )
}
