'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { GraduationCap, Users, Shield, ArrowRight, Sparkles } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [selectedRole, setSelectedRole] = useState<'student' | 'teacher' | 'admin' | null>(null)
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  const handleRoleSelect = (role: 'student' | 'teacher' | 'admin') => {
    setSelectedRole(role)
    setTimeout(() => {
      router.push(`/login/${role}`)
    }, 300)
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-white">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(59,130,246,0.1),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(147,51,234,0.1),transparent_50%)]"></div>

      {/* Header */}
      <header className="relative z-10 pt-8 pb-4">
        <div className="max-w-7xl mx-auto px-6">
          <button
            onClick={() => router.push('/')}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-8"
          >
            <ArrowRight className="w-4 h-4 rotate-180 mr-2" />
            <span>Back to Home</span>
          </button>
        </div>
      </header>

      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-120px)] p-6">
        <div className="max-w-6xl w-full">
          {/* Header Section */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-2xl">
                  <GraduationCap className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center animate-pulse">
                  <Sparkles className="w-3 h-3 text-yellow-800" />
                </div>
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
              Welcome to <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">DWAOP</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose your role to access your personalized dashboard
            </p>
          </div>

          {/* Role Selection Cards */}
          <div className="grid md:grid-cols-3 gap-8">
            {/* Student Login */}
            <div
              onClick={() => handleRoleSelect('student')}
              onMouseEnter={() => setHoveredCard('student')}
              onMouseLeave={() => setHoveredCard(null)}
              className={`group relative bg-white rounded-2xl p-8 cursor-pointer transition-all duration-300 ${
                hoveredCard === 'student' 
                  ? 'shadow-2xl scale-105 border-2 border-blue-500' 
                  : 'shadow-lg hover:shadow-xl border-2 border-transparent'
              }`}
            >
              {/* Gradient Background on Hover */}
              <div className={`absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10`}></div>
              
              {/* Decorative Circle */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-200 rounded-full -mr-12 -mt-12 opacity-20 group-hover:opacity-30 transition-opacity"></div>
              
              <div className="relative">
                <div className={`w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg group-hover:shadow-xl transition-all duration-300 ${
                  hoveredCard === 'student' ? 'scale-110 rotate-3' : ''
                }`}>
                  <Users className="w-10 h-10 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold text-center mb-3 text-gray-900">Student</h3>
                <p className="text-gray-600 text-center mb-6 leading-relaxed">
                  Access your academic dashboard, track attendance, submit assignments, and view your progress in real-time.
                </p>
                
                <div className={`flex items-center justify-center font-semibold transition-all duration-300 ${
                  hoveredCard === 'student' 
                    ? 'text-blue-600' 
                    : 'text-gray-700 group-hover:text-blue-600'
                }`}>
                  <span>Login as Student</span>
                  <ArrowRight className={`w-5 h-5 ml-2 transition-transform duration-300 ${
                    hoveredCard === 'student' ? 'translate-x-2' : 'group-hover:translate-x-1'
                  }`} />
                </div>
              </div>
            </div>

            {/* Teacher Login */}
            <div
              onClick={() => handleRoleSelect('teacher')}
              onMouseEnter={() => setHoveredCard('teacher')}
              onMouseLeave={() => setHoveredCard(null)}
              className={`group relative bg-white rounded-2xl p-8 cursor-pointer transition-all duration-300 ${
                hoveredCard === 'teacher' 
                  ? 'shadow-2xl scale-105 border-2 border-purple-500' 
                  : 'shadow-lg hover:shadow-xl border-2 border-transparent'
              }`}
            >
              {/* Gradient Background on Hover */}
              <div className={`absolute inset-0 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10`}></div>
              
              {/* Decorative Circle */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-purple-200 rounded-full -mr-12 -mt-12 opacity-20 group-hover:opacity-30 transition-opacity"></div>
              
              <div className="relative">
                <div className={`w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg group-hover:shadow-xl transition-all duration-300 ${
                  hoveredCard === 'teacher' ? 'scale-110 rotate-3' : ''
                }`}>
                  <GraduationCap className="w-10 h-10 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold text-center mb-3 text-gray-900">Faculty & Teachers</h3>
                <p className="text-gray-600 text-center mb-6 leading-relaxed">
                  Manage lectures, assignments, evaluations, and departmental tasks with structured workflows and clear accountability.
                </p>
                
                <div className={`flex items-center justify-center font-semibold transition-all duration-300 ${
                  hoveredCard === 'teacher' 
                    ? 'text-purple-600' 
                    : 'text-gray-700 group-hover:text-purple-600'
                }`}>
                  <span>Login as Faculty</span>
                  <ArrowRight className={`w-5 h-5 ml-2 transition-transform duration-300 ${
                    hoveredCard === 'teacher' ? 'translate-x-2' : 'group-hover:translate-x-1'
                  }`} />
                </div>
              </div>
            </div>

            {/* Admin Login */}
            <div
              onClick={() => handleRoleSelect('admin')}
              onMouseEnter={() => setHoveredCard('admin')}
              onMouseLeave={() => setHoveredCard(null)}
              className={`group relative bg-white rounded-2xl p-8 cursor-pointer transition-all duration-300 ${
                hoveredCard === 'admin' 
                  ? 'shadow-2xl scale-105 border-2 border-pink-500' 
                  : 'shadow-lg hover:shadow-xl border-2 border-transparent'
              }`}
            >
              {/* Gradient Background on Hover */}
              <div className={`absolute inset-0 bg-gradient-to-br from-pink-50 to-pink-100 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10`}></div>
              
              {/* Decorative Circle */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-pink-200 rounded-full -mr-12 -mt-12 opacity-20 group-hover:opacity-30 transition-opacity"></div>
              
              <div className="relative">
                <div className={`w-20 h-20 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg group-hover:shadow-xl transition-all duration-300 ${
                  hoveredCard === 'admin' ? 'scale-110 rotate-3' : ''
                }`}>
                  <Shield className="w-10 h-10 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold text-center mb-3 text-gray-900">Administration</h3>
                <p className="text-gray-600 text-center mb-6 leading-relaxed">
                  Department-wide oversight, analytics, risk monitoring, and policy configuration for data-driven governance.
                </p>
                
                <div className={`flex items-center justify-center font-semibold transition-all duration-300 ${
                  hoveredCard === 'admin' 
                    ? 'text-pink-600' 
                    : 'text-gray-700 group-hover:text-pink-600'
                }`}>
                  <span>Login as Admin</span>
                  <ArrowRight className={`w-5 h-5 ml-2 transition-transform duration-300 ${
                    hoveredCard === 'admin' ? 'translate-x-2' : 'group-hover:translate-x-1'
                  }`} />
                </div>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="text-center mt-12">
            <p className="text-gray-500 text-sm">
              Secure login • Role-based access • Protected by enterprise-grade security
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
