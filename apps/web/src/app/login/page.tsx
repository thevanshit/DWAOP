'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { GraduationCap, ArrowRight, Shield, Mail, Lock, Eye, EyeOff, Layers, UserCheck, UserPlus, ShieldCheck, AlertCircle, CheckCircle, ArrowLeft, Loader2, User } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'

interface UserAccount {
  email: string
  password: string
  role: 'student' | 'teacher' | 'admin'
}

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const mode = searchParams.get('mode') || 'signin'
  const { login, user, isAuthenticated } = useAuth()

  const [role, setRole] = useState<'student' | 'teacher' | 'admin'>('student')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [emailFocused, setEmailFocused] = useState(false)
  const [passwordFocused, setPasswordFocused] = useState(false)
  const [forgotPassword, setForgotPassword] = useState(false)
  const [resetEmail, setResetEmail] = useState('')
  const [resetSent, setResetSent] = useState(false)
  const [cardVisible, setCardVisible] = useState(false)
  const [isRegisterMode, setIsRegisterMode] = useState(false)
  const [confirmPassword, setConfirmPassword] = useState('')
  const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false)
  const [name, setName] = useState('')
  const [nameFocused, setNameFocused] = useState(false)

  const isSignIn = mode === 'signin'
  const isLoginFlow = isSignIn && !isRegisterMode

  useEffect(() => {
    setCardVisible(true)
  }, [])

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      router.push(`/dashboard/${user.role}`)
    }
  }, [isAuthenticated, user, router])

  const validateEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(edu\.in|edu)$/
    return emailRegex.test(email)
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email.trim()) {
      setError('Please enter your email address')
      return
    }

    if (!password) {
      setError('Please enter your password')
      return
    }

    setIsSubmitting(true)

    try {
      await login({ email, password })
      // Auth context will handle token storage and redirect
      router.push(`/dashboard/${role}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid email or password')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!name.trim()) {
      setError('Please enter your name')
      return
    }

    if (!email.trim()) {
      setError('Please enter your email address')
      return
    }

    if (!validateEmail(email)) {
      setError('Please use your institutional email (@campus.edu or @cse.edu.in)')
      return
    }

    if (!password) {
      setError('Please enter a password')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setIsSubmitting(true)

    try {
      // Registration - goes to backend
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, firstName: name.split(' ')[0], lastName: name.split(' ').slice(1).join(' ') || '', role }),
      })

      if (res.ok) {
        // Auto-login after registration
        await login({ email, password })
        router.push(`/dashboard/${role}`)
      } else {
        const data = await res.json()
        setError(data.error || 'Registration failed. Please try again.')
      }
    } catch {
      setError('Registration failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateEmail(resetEmail)) {
      return
    }
    setIsSubmitting(true)
    
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail }),
      })
      if (res.ok) {
        setResetSent(true)
      } else {
        setError('Failed to send reset email. Please try again.')
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const roles = [
    { id: 'student', label: 'Student', icon: <UserPlus className="w-4 h-4" /> },
    { id: 'teacher', label: 'Faculty', icon: <UserCheck className="w-4 h-4" /> },
    { id: 'admin', label: 'Admin', icon: <ShieldCheck className="w-4 h-4" /> },
  ]

  return (
    <div className="min-h-screen bg-[var(--color-surface)] flex items-center justify-center p-4">
      {/* Background */}
      <div className="fixed inset-0 bg-dots opacity-20 pointer-events-none" />
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-blue-50/50 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-indigo-50/50 rounded-full blur-[120px] pointer-events-none" />
      
      {/* Main Card */}
      <div className={`w-full max-w-md relative z-10 transition-all duration-500 ease-out ${cardVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        
        {/* Logo & Back */}
        <div className="mb-6">
          <button 
            onClick={() => router.push('/')}
            className="inline-flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="px-8 pt-8 pb-6 text-center border-b border-gray-50">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-[var(--color-primary)] to-blue-600 rounded-xl mb-4 shadow-lg shadow-blue-500/20">
              <Layers className="w-6 h-6 text-white" />
            </div>
            
            {forgotPassword ? (
              <>
                <h1 className="text-xl font-semibold text-gray-900 mb-1">Reset Password</h1>
                <p className="text-sm text-gray-500">Enter your email to receive reset instructions</p>
              </>
            ) : isLoginFlow ? (
              <>
                <h1 className="text-xl font-semibold text-gray-900 mb-1">Access workspace</h1>
                <p className="text-sm text-gray-500">Sign in to continue to DepartmentWP</p>
              </>
            ) : (
              <>
                <h1 className="text-xl font-semibold text-gray-900 mb-1">Create account</h1>
                <p className="text-sm text-gray-500">Register to join DepartmentWP</p>
              </>
            )}
          </div>

          {/* Form */}
          <div className="p-8">
            {forgotPassword ? (
              <form onSubmit={handleResetPassword} className="space-y-5">
                {!resetSent ? (
                  <>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-2">Institutional Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="email"
                          placeholder="you@campus.edu"
                          value={resetEmail}
                          onChange={(e) => setResetEmail(e.target.value)}
                          className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all duration-200"
                        />
                      </div>
                    </div>
                    {error && (
                      <div className="flex items-center gap-2 text-sm text-red-500">
                        <AlertCircle className="w-4 h-4" />
                        {error}
                      </div>
                    )}
                    <button
                      type="submit"
                      disabled={isSubmitting || !resetEmail}
                      className="w-full bg-[var(--color-primary)] text-white py-3 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all duration-200 hover:bg-[var(--color-primary-dark)] hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                    >
                      {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Send Reset Link'}
                    </button>
                  </>
                ) : (
                  <div className="text-center py-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-green-50 rounded-full mb-4">
                      <CheckCircle className="w-8 h-8 text-green-500" />
                    </div>
                    <h3 className="font-medium text-gray-900 mb-2">Check your email</h3>
                    <p className="text-sm text-gray-500 mb-6">We sent password reset instructions to {resetEmail}</p>
                    <button type="button" onClick={() => { setForgotPassword(false); setResetSent(false); setResetEmail(''); setError(''); }} className="text-sm text-[var(--color-primary)] hover:underline">
                      Back to sign in
                    </button>
                  </div>
                )}
              </form>
            ) : isLoginFlow ? (
              <form onSubmit={handleLogin} className="space-y-5">
                {/* Role Tabs */}
                <div className="flex bg-gray-100 p-1 rounded-xl">
                  {roles.map((r) => (
                    <button key={r.id} type="button" onClick={() => setRole(r.id as typeof role)} className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${role === r.id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                      {r.icon}
                      <span>{r.label}</span>
                    </button>
                  ))}
                </div>

                {/* Email Field */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-2">Institutional Email</label>
                  <div className="relative">
                    <Mail className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${emailFocused ? 'text-[var(--color-primary)]' : 'text-gray-400'}`} />
                    <input
                      type="email"
                      placeholder="you@campus.edu"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setEmailFocused(true)}
                      onBlur={() => setEmailFocused(false)}
                      className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-medium text-gray-600">Password</label>
                    <button type="button" onClick={() => setForgotPassword(true)} className="text-xs text-[var(--color-primary)] hover:underline">Forgot?</button>
                  </div>
                  <div className="relative">
                    <Lock className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${passwordFocused ? 'text-[var(--color-primary)]' : 'text-gray-400'}`} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setPasswordFocused(true)}
                      onBlur={() => setPasswordFocused(false)}
                      className="w-full pl-11 pr-11 py-3 border border-gray-200 rounded-xl bg-gray-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all duration-200"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-sm text-red-500 bg-red-50/50 px-3 py-2 rounded-lg">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {error}
                  </div>
                )}

                <button type="submit" disabled={isSubmitting} className="w-full bg-[var(--color-primary)] text-white py-3 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all duration-200 hover:bg-[var(--color-primary-dark)] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 shadow-lg shadow-blue-500/20">
                  {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" /><span>Signing in...</span></> : <><span>Sign in</span><ArrowRight className="w-4 h-4" /></>}
                </button>

                <p className="text-center text-sm text-gray-500">
                  New to DepartmentWP?{' '}
                  <button type="button" onClick={() => setIsRegisterMode(true)} className="text-[var(--color-primary)] hover:underline font-medium">
                    Create account
                  </button>
                </p>
              </form>
            ) : (
              /* Registration Mode */
              <form onSubmit={handleRegister} className="space-y-4">
                {/* Role Tabs */}
                <div className="flex bg-gray-100 p-1 rounded-xl">
                  {roles.map((r) => (
                    <button key={r.id} type="button" onClick={() => setRole(r.id as typeof role)} className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${role === r.id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                      {r.icon}
                      <span>{r.label}</span>
                    </button>
                  ))}
                </div>

                {/* Name Field */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-2">Full Name</label>
                  <div className="relative">
                    <User className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${nameFocused ? 'text-[var(--color-primary)]' : 'text-gray-400'}`} />
                    <input
                      type="text"
                      placeholder="Your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      onFocus={() => setNameFocused(true)}
                      onBlur={() => setNameFocused(false)}
                      className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-2">Institutional Email</label>
                  <div className="relative">
                    <Mail className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${emailFocused ? 'text-[var(--color-primary)]' : 'text-gray-400'}`} />
                    <input
                      type="email"
                      placeholder="you@campus.edu"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setEmailFocused(true)}
                      onBlur={() => setEmailFocused(false)}
                      className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-2">Password</label>
                  <div className="relative">
                    <Lock className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${passwordFocused ? 'text-[var(--color-primary)]' : 'text-gray-400'}`} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create a password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setPasswordFocused(true)}
                      onBlur={() => setPasswordFocused(false)}
                      className="w-full pl-11 pr-11 py-3 border border-gray-200 rounded-xl bg-gray-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all duration-200"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password Field */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-2">Confirm Password</label>
                  <div className="relative">
                    <Lock className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${confirmPasswordFocused ? 'text-[var(--color-primary)]' : 'text-gray-400'}`} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      onFocus={() => setConfirmPasswordFocused(true)}
                      onBlur={() => setConfirmPasswordFocused(false)}
                      className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all duration-200"
                    />
                  </div>
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-sm text-red-500 bg-red-50/50 px-3 py-2 rounded-lg">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {error}
                  </div>
                )}

                <button type="submit" disabled={isSubmitting} className="w-full bg-[var(--color-primary)] text-white py-3 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all duration-200 hover:bg-[var(--color-primary-dark)] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 shadow-lg shadow-blue-500/20">
                  {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" /><span>Creating account...</span></> : <><span>Create account</span><ArrowRight className="w-4 h-4" /></>}
                </button>

                <p className="text-center text-sm text-gray-500">
                  Already have an account?{' '}
                  <button type="button" onClick={() => setIsRegisterMode(false)} className="text-[var(--color-primary)] hover:underline font-medium">
                    Sign in
                  </button>
                </p>
              </form>
            )}
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 mt-6 flex items-center justify-center gap-2">
          <Shield className="w-3 h-3" />
          Secure institutional access • DWAOP v2.0.5
        </p>
      </div>
    </div>
  )
}

function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="animate-pulse flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
          <div className="h-4 w-20 bg-gray-200 rounded"></div>
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}

export default LoginPage
