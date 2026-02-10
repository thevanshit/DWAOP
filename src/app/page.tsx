'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { AnimatedCounter } from '@/components/ui/AnimatedCounter'
import { 
  Users, Shield, ArrowRight, CheckCircle, Zap, Lock, BarChart3, Clock, FileCheck, TrendingUp, Sparkles 
} from 'lucide-react'

export default function HomePage() {
  const router = useRouter()
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%,rgba(147,51,234,0.1))]" />
      <div className="absolute inset-0">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-1 h-1 bg-blue-400 rounded-full opacity-20 animate-float`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: '3s'
            }}
          />
        ))}
      </div>

      {/* Hero Content */}
      <div className="relative max-w-7xl mx-auto px-6 py-16">
        <div className="text-center">
          {/* Animated Badge */}
          <div className="inline-flex items-center space-x-2 mb-8">
            <div className="relative w-14 h-14 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <Zap className="w-6 h-6 text-yellow-400" />
              <div className="absolute inset-0 w-14 h-14 bg-yellow-400 rounded-full opacity-30 animate-pulse" />
            </div>
            <div className="text-sm font-medium text-gray-700">AI-Powered Workflow</div>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Workflow-Driven Academic Management
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Bring structure and transparency to academic processes with state machine-driven workflows, immutable audit trails, and enterprise-grade security.
          </p>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-16">
            <div className="relative bg-gradient-to-br from-blue-50 to-purple-50 border border-gray-200 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-center mb-4">
                <FileCheck className="w-12 h-12 text-blue-600" />
              </div>
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {isLoaded ? '100' : '0'}%
              </div>
              <div className="text-sm text-gray-700 mt-2">Process Efficiency</div>
            </div>

            <div className="relative bg-gradient-to-br from-purple-50 to-pink-50 border border-gray-200 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-center mb-4">
                <Shield className="w-12 h-12 text-purple-600" />
              </div>
              <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {isLoaded ? '24/7' : '0'}
              </div>
              <div className="text-sm text-gray-700 mt-2">Security Monitoring</div>
            </div>

            <div className="relative bg-gradient-to-br from-green-50 to-emerald-50 border border-gray-200 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-center mb-4">
                <TrendingUp className="w-12 h-12 text-green-600" />
              </div>
              <div className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                {isLoaded ? '99.9' : '0'}%
              </div>
              <div className="text-sm text-gray-700 mt-2">Uptime Guarantee</div>
            </div>
          </div>
        </div>

        {/* Key Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {[
            {
              icon: Lock,
              title: 'Security First',
              description: 'Enterprise-grade security with RBAC and JWT authentication',
              color: 'from-blue-500 to-purple-600',
              items: ['Role-based access', 'JWT tokens', 'Request validation', 'File management']
            },
            {
              icon: Zap,
              title: 'Workflow Engine',
              description: 'State machine-driven process management with configurable rules',
              color: 'from-purple-500 to-purple-600',
              items: ['State machines', 'Transitions', 'Automation', 'Audit trails']
            },
            {
              icon: BarChart3,
              title: 'Real-time Analytics',
              description: 'Live dashboards and actionable insights',
              color: 'from-green-500 to-emerald-600',
              items: ['Role-based metrics', 'Live data', 'Predictive analytics']
            },
            {
              icon: FileCheck,
              title: 'File Management',
              description: 'Secure document storage with validation and compression',
              color: 'from-pink-500 to-rose-600',
              items: ['Cloud storage', 'Upload validation', 'File compression']
            },
            {
              icon: Shield,
              title: 'Audit System',
              description: 'Immutable logging with complete audit trails',
              color: 'from-indigo-500 to-indigo-600',
              items: ['Change tracking', 'Compliance reports', 'Security monitoring']
            }
          ].map((feature, index) => (
            <div key={index} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow duration-300">
              <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-4`}>
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 mb-4">
                {feature.description}
              </p>
              <div className="space-y-2">
                {feature.items.map((item, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="fixed bottom-8 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-200 p-6">
        <div className="max-w-7xl mx-auto px-6">
          <button
            onClick={() => router.push('/login')}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3.5 rounded-xl font-semibold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center space-x-3 mx-auto"
          >
            <span>Get Started Now</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}