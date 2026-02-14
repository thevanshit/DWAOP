'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { UserRole } from '@/types'
import { Mail, Lock, Eye, EyeOff, ArrowLeft, ArrowRight } from 'lucide-react'
import apiClient from '@/lib/api-client'

interface LoginFormProps {
  role: UserRole
  roleLabel: string
  roleIcon: React.ReactNode
}

export default function LoginForm({ role, roleLabel, roleIcon }: LoginFormProps) {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [focusedField, setFocusedField] = useState<string | null>(null)

  const getGradientColor = () => {
    if (role === 'student') return 'from-blue-500 to-blue-600'
    if (role === 'teacher') return 'from-purple-500 to-purple-600'
    return 'from-pink-500 to-pink-600'
  }

  const getBorderColor = () => {
    if (role === 'student') return 'border-blue-500'
    if (role === 'teacher') return 'border-purple-500'
    return 'border-pink-500'
  }

  const getTextColor = () => {
    if (role === 'student') return 'text-blue-600'
    if (role === 'teacher') return 'text-purple-600'
    return 'text-pink-600'
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      // Mock authentication for development
      const mockUsers = [
        { email: 'student@dwaop.com', password: 'student123', role: 'student' },
        { email: 'teacher@dwaop.com', password: 'teacher123', role: 'teacher' },
        { email: 'admin@dwaop.com', password: 'admin123', role: 'admin' }
      ]
      
      const user = mockUsers.find(u => u.email === email && u.password === password)
      
      if (user && user.role === role) {
        // Store user info in localStorage
        localStorage.setItem('userRole', role)
        localStorage.setItem('userEmail', email)
        localStorage.setItem('isLoggedIn', 'true')
        
        // Redirect to dashboard
        router.push(`/dashboard/${role}`)
      } else {
        throw new Error('Invalid credentials or role mismatch')
      }
    } catch (error) {
      console.error('Login failed:', error)
      alert('Login failed. Please check your credentials and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-8 relative overflow-hidden">
        {/* Decorative Background */}
        <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${getGradientColor()} rounded-full -mr-16 -mt-16 opacity-10`}></div>
        
        {/* Header */}
        <div className="text-center mb-8 relative">
          <div className="flex justify-center mb-4">
            <div className="relative">
              {roleIcon}
              <div className={`absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-br ${getGradientColor()} rounded-full flex items-center justify-center shadow-lg`}>
                <Lock className="w-3 h-3 text-white" />
              </div>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome Back
          </h2>
          <p className="text-gray-600">
            Login as <span className={`font-semibold ${getTextColor()}`}>{roleLabel}</span>
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors ${
                focusedField === 'email' ? getTextColor() : 'text-gray-400'
              }`} />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl transition-all duration-200 ${
                  focusedField === 'email' 
                    ? `${getBorderColor()} border-opacity-50 ring-2 ring-opacity-20 ${getBorderColor().replace('border-', 'ring-')}` 
                    : 'border-gray-200 focus:border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-opacity-20`}
                placeholder="your.email@university.edu"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors ${
                focusedField === 'password' ? getTextColor() : 'text-gray-400'
              }`} />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
                className={`w-full pl-12 pr-12 py-3 border-2 rounded-xl transition-all duration-200 ${
                  focusedField === 'password' 
                    ? `${getBorderColor()} border-opacity-50 ring-2 ring-opacity-20 ${getBorderColor().replace('border-', 'ring-')}` 
                    : 'border-gray-200 focus:border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-opacity-20`}
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between pt-2">
            <label className="flex items-center cursor-pointer group">
              <input 
                type="checkbox" 
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer" 
              />
              <span className="ml-2 text-sm text-gray-600 group-hover:text-gray-900 transition-colors">Remember me</span>
            </label>
            <a href="#" className={`text-sm font-medium ${getTextColor()} hover:underline transition-all`}>
              Forgot password?
            </a>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-gradient-to-r ${getGradientColor()} text-white py-3.5 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 group`}
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Logging in...</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        {/* Back Link */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={() => router.push('/login')}
            className="w-full flex items-center justify-center text-gray-600 hover:text-gray-900 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Back to role selection</span>
          </button>
        </div>
      </div>
    </div>
  )
}
