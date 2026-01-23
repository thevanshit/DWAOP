'use client'

import LoginForm from '@/components/auth/LoginForm'
import { Users } from 'lucide-react'

export default function StudentLoginPage() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-white flex items-center justify-center p-6">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(59,130,246,0.15),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(147,51,234,0.1),transparent_50%)]"></div>
      
      <div className="relative z-10">
        <LoginForm
          role="student"
          roleLabel="Student"
          roleIcon={
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-xl">
              <Users className="w-10 h-10 text-white" />
            </div>
          }
        />
      </div>
    </div>
  )
}
