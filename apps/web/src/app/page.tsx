'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import {
  Users, Shield, ArrowRight, CheckCircle, Zap, BarChart3, Clock, FileCheck, GraduationCap, Workflow, Database, LayoutDashboard, X, ChevronRight, Layers, GitBranch, Lock, AlertCircle, LayoutGrid, ArrowLeft, UserCheck, UserPlus, ClipboardList, BookOpen, GraduationCap as GradIcon, ShieldCheck, Settings, Play, Pause
} from 'lucide-react'

export default function HomePage() {
  const router = useRouter()
  const [isLoaded, setIsLoaded] = useState(false)
  const philosophyRef = useRef<HTMLDivElement>(null)
  const featuresRef = useRef<HTMLDivElement>(null)
  const visionRef = useRef<HTMLDivElement>(null)
  const [activeWorkflowStep, setActiveWorkflowStep] = useState(0)

  useEffect(() => {
    setIsLoaded(true)
    
    // Animate workflow steps - cycle through 4 stages
    const interval = setInterval(() => {
      setActiveWorkflowStep((prev) => (prev + 1) % 4)
    }, 2500)
    
    return () => clearInterval(interval)
  }, [])

  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-[var(--color-surface)]">
      {/* Navigation - Glassmorphic */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/80 border-b border-[var(--color-border-light)] shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <button 
            onClick={() => router.push('/')}
            className="flex items-center gap-3 group"
          >
            <div className="w-10 h-10 bg-[var(--color-primary)] rounded-xl flex items-center justify-center shadow-lg shadow-[var(--color-primary)]/20 group-hover:scale-105 transition-transform">
              <Layers className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg text-[var(--color-text-primary)] leading-tight">DepartmentWP</span>
              <span className="text-[10px] text-[var(--color-text-muted)] -mt-0.5">Digital Operations</span>
            </div>
          </button>
          
          <div className="hidden lg:flex items-center gap-8">
            <button onClick={() => scrollToSection(featuresRef)} className="text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors py-2">Features</button>
            <button onClick={() => scrollToSection(philosophyRef)} className="text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors py-2">Workflow Philosophy</button>
            <button onClick={() => scrollToSection(visionRef)} className="text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors py-2">Vision</button>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => router.push('/login?mode=signin')}
              className="px-5 py-2.5 text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors rounded-lg hover:bg-[var(--color-surface-subtle)]"
            >
              Sign In
            </button>
            <button
              onClick={() => router.push('/login?mode=start')}
              className="px-5 py-2.5 bg-[var(--color-primary)] text-white text-sm font-medium rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors shadow-lg shadow-[var(--color-primary)]/20"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 md:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className={`inline-flex items-center gap-2 bg-[var(--color-primary-faint)] text-[var(--color-primary)] px-3 py-1 rounded-full text-xs font-medium mb-6 ${isLoaded ? 'animate-fade-in' : 'opacity-0'}`}>
            <span className="w-1.5 h-1.5 bg-[var(--color-primary)] rounded-full animate-pulse" />
            Department Digital Operating System
          </div>
          
          <h1 className={`text-4xl md:text-5xl font-semibold text-[var(--color-text-primary)] mb-6 leading-tight ${isLoaded ? 'animate-fade-in-up' : 'opacity-0'}`}>
            Transform Departments into <br />
            <span className="text-[var(--color-primary)]">Workflow-Driven Operating Systems</span>
          </h1>
          
          <p className={`text-lg text-[var(--color-text-secondary)] mb-8 max-w-2xl mx-auto ${isLoaded ? 'animate-fade-in-up delay-150' : 'opacity-0'}`}>
            Every academic action — from attendance and assignments to governance approvals — becomes a structured workflow with clear ownership, real-time visibility, and institutional accountability.
          </p>
          
          <div className={`flex flex-col sm:flex-row items-center justify-center gap-3 ${isLoaded ? 'animate-fade-in-up delay-300' : 'opacity-0'}`}>
            <button
              onClick={() => router.push('/login')}
              className="w-full sm:w-auto bg-[var(--color-primary)] text-white px-6 py-3 rounded-lg font-medium text-sm flex items-center justify-center gap-2 hover:bg-[var(--color-primary-dark)] transition-colors shadow-lg shadow-[var(--color-primary)]/20"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button 
              onClick={() => scrollToSection(philosophyRef)}
              className="w-full sm:w-auto bg-white text-[var(--color-text-secondary)] border border-[var(--color-border)] px-6 py-3 rounded-lg font-medium text-sm hover:bg-[var(--color-surface-subtle)] transition-colors"
            >
              Learn More
            </button>
          </div>
        </div>

        {/* Department Workflow Dashboard Preview */}
        <div className={`max-w-5xl mx-auto mt-16 ${isLoaded ? 'animate-fade-in-up delay-450' : 'opacity-0'}`}>
          {/* Positioning line */}
          <p className="text-center text-sm text-[var(--color-text-muted)] mb-4">
            Built for departments that want operational clarity — not another LMS.
          </p>
          
          <div className="bg-white rounded-2xl border border-[var(--color-border)] shadow-2xl overflow-hidden">
            {/* Label above workflow */}
            <div className="bg-gradient-to-r from-[var(--color-primary-faint)] via-white to-[var(--color-primary-faint)] px-6 py-3 border-b border-[var(--color-border-light)]">
              <div className="flex items-center justify-center gap-2">
                <span className="text-xs font-medium text-[var(--color-primary)]">See Governance in Motion</span>
                <span className="text-[var(--color-text-muted)]">•</span>
                <span className="text-xs text-[var(--color-text-muted)]">Watch workflows progress automatically from submission to finalization with role-based responsibility</span>
              </div>
            </div>

            {/* White Glass Header */}
            <div className="bg-white/80 backdrop-blur-md px-6 py-4 border-b border-[var(--color-border-light)] shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="flex items-center gap-2 text-[var(--color-text-primary)]">
                  <Layers className="w-4 h-4" />
                  <span className="text-sm font-medium">Department Workflow Dashboard</span>
                  <span className="ml-2 px-2 py-0.5 bg-[var(--color-success-light)] text-[var(--color-success)] text-[10px] rounded-full font-medium animate-pulse">Live Demo</span>
                </div>
              </div>
            </div>

            {/* Animated Governance Flow Pipeline */}
            <div className="bg-gradient-to-r from-[var(--color-primary-faint)] via-white to-[var(--color-primary-faint)] px-6 py-4 border-b border-[var(--color-border-light)]">
              <div className="flex items-center justify-center gap-1">
                <AnimatedRoleNode icon={<UserPlus className="w-4 h-4" />} label="Submit" active={activeWorkflowStep === 0} completed={activeWorkflowStep > 0} />
                <AnimatedConnector active={activeWorkflowStep >= 1} completed={activeWorkflowStep > 0} />
                <AnimatedRoleNode icon={<UserCheck className="w-4 h-4" />} label="Process" active={activeWorkflowStep === 1} completed={activeWorkflowStep > 1} />
                <AnimatedConnector active={activeWorkflowStep >= 2} completed={activeWorkflowStep > 1} />
                <AnimatedRoleNode icon={<ShieldCheck className="w-4 h-4" />} label="Verify" active={activeWorkflowStep === 2} completed={activeWorkflowStep > 2} />
                <AnimatedConnector active={activeWorkflowStep >= 3} completed={activeWorkflowStep > 2} />
                <AnimatedRoleNode icon={<Lock className="w-4 h-4" />} label="Lock" active={activeWorkflowStep === 3} completed={activeWorkflowStep > 3} />
              </div>
            </div>

            {/* Live Workflow Board with Animated Cards */}
            <div className="p-6 bg-gradient-to-br from-slate-50 via-white to-blue-50 min-h-[320px] relative overflow-hidden">
              {/* Glow Line */}
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-info)] to-[var(--color-success)] animate-pulse" />

              <div className="grid grid-cols-4 gap-4">
                {/* Column 1: Created */}
                <div className={`transition-all duration-500 ${activeWorkflowStep >= 1 ? 'opacity-50' : 'opacity-100'}`}>
                  <div className="flex items-center justify-between mb-3 pb-2 border-b-2 border-slate-300">
                    <div className="flex items-center gap-2">
                      <Layers className="w-4 h-4 text-slate-500" />
                      <span className="text-xs font-semibold text-[var(--color-text-primary)]">Created</span>
                    </div>
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs font-bold rounded-full">1</span>
                  </div>
                  {activeWorkflowStep === 0 && (
                    <DemoCard title="Leave Request" type="Leave" status="created" />
                  )}
                  {activeWorkflowStep > 0 && (
                    <DemoCard title="Leave Request" type="Leave" status="moved" />
                  )}
                </div>

                {/* Column 2: In Progress */}
                <div className={`transition-all duration-500 ${activeWorkflowStep === 0 ? 'opacity-50' : activeWorkflowStep === 2 ? 'opacity-50' : 'opacity-100'}`}>
                  <div className="flex items-center justify-between mb-3 pb-2 border-b-2 border-blue-300">
                    <div className="flex items-center gap-2">
                      <GitBranch className="w-4 h-4 text-blue-500" />
                      <span className="text-xs font-semibold text-[var(--color-text-primary)]">In Progress</span>
                    </div>
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-600 text-xs font-bold rounded-full">1</span>
                  </div>
                  {activeWorkflowStep === 1 && (
                    <DemoCard title="Attendance Marking" type="Attendance" status="active" />
                  )}
                  {activeWorkflowStep > 1 && (
                    <DemoCard title="Attendance Marking" type="Attendance" status="moved" />
                  )}
                </div>

                {/* Column 3: Under Review */}
                <div className={`transition-all duration-500 ${activeWorkflowStep < 2 ? 'opacity-50' : activeWorkflowStep === 3 ? 'opacity-50' : 'opacity-100'}`}>
                  <div className="flex items-center justify-between mb-3 pb-2 border-b-2 border-amber-300">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-amber-500" />
                      <span className="text-xs font-semibold text-[var(--color-text-primary)]">Under Review</span>
                    </div>
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-600 text-xs font-bold rounded-full">1</span>
                  </div>
                  {activeWorkflowStep === 2 && (
                    <DemoCard title="IA-1 Marks" type="Marks" status="review" />
                  )}
                  {activeWorkflowStep > 2 && (
                    <DemoCard title="IA-1 Marks" type="Marks" status="moved" />
                  )}
                </div>

                {/* Column 4: Finalized */}
                <div className={`transition-all duration-500 ${activeWorkflowStep < 3 ? 'opacity-50' : 'opacity-100'}`}>
                  <div className="flex items-center justify-between mb-3 pb-2 border-b-2 border-emerald-300">
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-emerald-500" />
                      <span className="text-xs font-semibold text-[var(--color-text-primary)]">Finalized</span>
                    </div>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-600 text-xs font-bold rounded-full">1</span>
                  </div>
                  {activeWorkflowStep >= 3 && (
                    <DemoCard title="IA-1 Results" type="Marks" status="finalized" />
                  )}
                </div>
              </div>

              {/* Stats Footer */}
              <div className="mt-6 pt-4 border-t border-[var(--color-border)] flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-slate-400 animate-pulse" />
                    <span className="text-xs text-[var(--color-text-muted)]">Workflows: 18</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                    <span className="text-xs text-[var(--color-text-muted)]">Pending: 3</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="text-xs text-[var(--color-text-muted)]">Completed: 8</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
                  <span className="w-2 h-2 bg-[var(--color-success)] rounded-full animate-pulse" />
                  <span>Simulating live governance flow</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" ref={featuresRef} className="py-24 px-4 md:px-6 bg-[var(--color-surface-subtle)]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-semibold text-[var(--color-text-primary)] mb-3">
              Everything Your Department Needs
            </h2>
            <p className="text-[var(--color-text-secondary)] max-w-xl mx-auto">
              A complete digital operating system built around workflow-first governance.
            </p>
          </div>

          {/* Workflow Engine */}
          <div className="mb-10">
            <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
              <Workflow className="w-5 h-5" />
              Workflow Engine
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              <FeatureCard
                icon={<Workflow className="w-5 h-5" />}
                title="State Machine Engine"
                description="A configurable state machine that models institutional processes as governed workflows with enforceable transitions and permissions."
              />
              <FeatureCard
                icon={<ShieldCheck className="w-5 h-5" />}
                title="Role-Based Transitions"
                description="Workflows enforce proper role permissions at each stage, ensuring only authorized users can approve or modify."
              />
              <FeatureCard
                icon={<Zap className="w-5 h-5" />}
                title="Automated Escalations"
                description="Deadlines trigger automatic escalation workflows and contextual notifications to responsible parties."
              />
            </div>
          </div>

          {/* Academic Operations */}
          <div className="mb-10">
            <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Academic Operations
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              <FeatureCard
                icon={<Users className="w-5 h-5" />}
                title="Attendance Micro-Workflows"
                description="Attendance becomes an auditable workflow tracking eligibility, risk signals, and compliance automatically."
              />
              <FeatureCard
                icon={<FileCheck className="w-5 h-5" />}
                title="Assignment Lifecycle"
                description="Assignments move through governed stages — draft, review, evaluation, and archival — with transparent ownership."
              />
              <FeatureCard
                icon={<GradIcon className="w-5 h-5" />}
                title="Student Track Reports"
                description="Unified student intelligence combining attendance, performance, and eligibility signals into actionable insights."
              />
            </div>
          </div>

          {/* Institutional Governance Layer */}
          <div className="mb-10">
            <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5" />
              Institutional Governance Layer
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              <FeatureCard
                icon={<ClipboardList className="w-5 h-5" />}
                title="Leave Management"
                description="Structured approval chains from student → faculty → HOD with documentation and complete audit trail."
              />
              <FeatureCard
                icon={<LayoutGrid className="w-5 h-5" />}
                title="Task Coordination"
                description="Committee task management with workload balancing, templates, and enforceable SLA tracking."
              />
              <FeatureCard
                icon={<AlertCircle className="w-5 h-5" />}
                title="Immutable Audit Trail"
                description="Complete history of who did what and when. Tamper-evident logs for institutional accountability."
              />
            </div>
          </div>

          {/* Insights */}
          <div>
            <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Insights & Intelligence
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              <FeatureCard
                icon={<Zap className="w-5 h-5" />}
                title="Real-time Analytics"
                description="Operational dashboards revealing bottlenecks, throughput, and institutional performance trends."
              />
              <FeatureCard
                icon={<Database className="w-5 h-5" />}
                title="Single Source of Truth"
                description="A unified institutional memory replacing fragmented spreadsheets and disconnected systems."
              />
              <FeatureCard
                icon={<Settings className="w-5 h-5" />}
                title="Role-Based Access"
                description="Role-aware workflows ensuring correct visibility and responsibility across students, faculty, and administration."
              />
            </div>
          </div>
        </div>
      </section>

      {/* Workflow Philosophy Section */}
      <section id="vision" ref={philosophyRef} className="py-20 px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-semibold text-[var(--color-text-primary)] mb-3">
              Workflow-First Philosophy
            </h2>
            <p className="text-[var(--color-text-secondary)] max-w-xl mx-auto">
              Academic operations should not depend on fragmented tools or manual coordination. Every action — from student submissions to administrative governance — is treated as a structured workflow with clearly defined stages, ownership, and auditability.
            </p>
          </div>

          {/* Animated Lifecycle */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <div className="bg-white rounded-2xl border border-[var(--color-border)] p-6 shadow-sm">
                <h4 className="text-sm font-medium text-[var(--color-text-secondary)] mb-6 text-center">Workflow Lifecycle</h4>
                
                {/* Animated Steps */}
                <div className="relative">
                  {/* Animated vertical progress line */}
                  <div className="absolute left-[11px] top-3 bottom-3 w-[2px] bg-gray-100">
                    <div 
                      className="absolute top-0 left-0 w-full bg-green-500 origin-top transition-transform duration-700 ease-in-out"
                      style={{ 
                        height: activeWorkflowStep === 0 ? '0%' : 
                               activeWorkflowStep === 1 ? '33%' : 
                               activeWorkflowStep === 2 ? '66%' : '100%',
                        transform: `scaleY(${activeWorkflowStep === 0 ? 0 : 
                                           activeWorkflowStep === 1 ? 0.33 : 
                                           activeWorkflowStep === 2 ? 0.66 : 1})`
                      }} 
                    />
                  </div>
                  
                  <div className="space-y-4 relative z-10">
                    <LifecycleStep 
                      step={1} 
                      title="Create" 
                      description="Activity initiated with required metadata"
                      icon={<Layers className="w-4 h-4" />}
                      active={activeWorkflowStep === 0}
                      completed={activeWorkflowStep > 0}
                    />
                    <LifecycleStep 
                      step={2} 
                      title="Process" 
                      description="Work execution with real-time updates"
                      icon={<GitBranch className="w-4 h-4" />}
                      active={activeWorkflowStep === 1}
                      completed={activeWorkflowStep > 1}
                    />
                    <LifecycleStep 
                      step={3} 
                      title="Review" 
                      description="Structured approval and validation"
                      icon={<Clock className="w-4 h-4" />}
                      active={activeWorkflowStep === 2}
                      completed={activeWorkflowStep > 2}
                    />
                    <LifecycleStep 
                      step={4} 
                      title="Lock" 
                      description="Finalized and made immutable"
                      icon={<Lock className="w-4 h-4" />}
                      active={activeWorkflowStep === 3}
                      completed={activeWorkflowStep > 3}
                    />
                  </div>
                </div>
              </div>

              {/* Key Principles */}
              <div className="mt-8 space-y-4">
                <PrincipleItem
                  title="Defined States"
                  description="Each activity progresses through transparent stages — Created, In Progress, Under Review, and Finalized"
                />
                <PrincipleItem
                  title="Clear Ownership"
                  description="Every stage assigns responsibility explicitly, removing ambiguity about who must act next"
                />
                <PrincipleItem
                  title="Immutable History"
                  description="All transitions are recorded automatically, creating a tamper-resistant audit trail"
                />
                <PrincipleItem
                  title="Policy as Code"
                  description="Operational rules live within the workflow engine, ensuring consistency across departments"
                />
              </div>
            </div>

            {/* Right side - more explanation */}
            <div className="order-1 md:order-2 space-y-6">
              <div className="bg-[var(--color-primary-faint)] rounded-xl p-5 border border-[var(--color-primary-faint)]">
                <h4 className="font-medium text-[var(--color-text-primary)] mb-2">Why Workflow Instead of Traditional Systems?</h4>
                <p className="text-sm text-[var(--color-text-secondary)]">
                  Traditional academic systems treat data as static records. DepartmentWP treats every activity as a living process that evolves through defined states with clear ownership.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-[var(--color-primary-faint)] rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-[10px] text-[var(--color-primary)]">1</span>
                  </div>
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    <strong className="text-[var(--color-text-primary)]">Records store history.</strong> Workflows move institutions forward.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-[var(--color-primary-faint)] rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-[10px] text-[var(--color-primary)]">2</span>
                  </div>
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    <strong className="text-[var(--color-text-primary)]">Governance emerges</strong> from structured transitions, not documents.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-[var(--color-primary-faint)] rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-[10px] text-[var(--color-primary)]">3</span>
                  </div>
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    <strong className="text-[var(--color-text-primary)]">Accountability is automatic</strong> when every action has a defined next owner.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section ref={visionRef} className="py-20 px-4 md:px-6 bg-gradient-to-b from-[var(--color-surface-subtle)] to-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-semibold text-[var(--color-text-primary)] mb-4">
              Our Vision
            </h2>
          </div>
          
          <div className="space-y-6 text-center">
            <p className="text-lg text-[var(--color-text-secondary)] leading-relaxed">
              To transform academic departments into fully <strong className="text-[var(--color-primary)]">workflow-driven operating systems</strong> where every activity — from attendance to evaluation, approvals to governance — is structured, traceable, and collaborative.
            </p>
            
            <p className="text-lg text-[var(--color-text-secondary)] leading-relaxed">
              Instead of fragmented tools and manual paperwork, we aim to create a <strong className="text-[var(--color-primary)]">unified digital environment</strong> where students, faculty, HODs, administrators, and leadership operate within connected workflows.
            </p>

            <div className="bg-white rounded-xl border border-[var(--color-border)] p-6 mt-8">
              <p className="text-[var(--color-text-primary)] font-medium mb-4">DepartmentWP is not just another LMS or ERP. It is a:</p>
              <div className="grid md:grid-cols-2 gap-4 text-left">
                <VisionPoint icon={<Workflow className="w-4 h-4" />} text="Workflow-first governance framework" />
                <VisionPoint icon={<Users className="w-4 h-4" />} text="Role-connecting platform" />
                <VisionPoint icon={<ShieldCheck className="w-4 h-4" />} text="Paperless administration system" />
                <VisionPoint icon={<Database className="w-4 h-4" />} text="Institutional memory builder" />
              </div>
            </div>
            
            <p className="text-lg text-[var(--color-text-secondary)] leading-relaxed mt-6">
              Our goal is simple: <strong className="text-[var(--color-primary)]">eliminate paperwork</strong>, preserve institutional knowledge, and enable <strong className="text-[var(--color-primary)]">data-driven academic governance at scale</strong>.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-[var(--color-border)] bg-[var(--color-surface-subtle)]">
        <div className="max-w-5xl mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[var(--color-primary)] rounded-lg flex items-center justify-center shadow-md shadow-[var(--color-primary)]/20">
                <Layers className="w-4 h-4 text-white" />
              </div>
              <div>
                <span className="text-sm font-semibold text-[var(--color-text-primary)]">DepartmentWP</span>
                <p className="text-[10px] text-[var(--color-text-muted)]">Department Workflow & Academic Operations Platform</p>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="text-xs text-[var(--color-text-muted)]">v2.0.5</span>
                <span className="w-1 h-1 bg-[var(--color-success)] rounded-full"></span>
                <span className="text-xs text-[var(--color-success)]">Stable</span>
              </div>
              
              <a 
                href="https://github.com/thevanshit/department-workflow-platform" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                GitHub
              </a>
              
              <a 
                href="https://github.com/thevanshit" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors"
              >
                Built by @thevanshit
              </a>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-[var(--color-border-light)] text-center">
            <p className="text-[10px] text-[var(--color-text-muted)]">
              Built for departments that want operational clarity — not another LMS.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

// Animated components for workflow demo

function AnimatedRoleNode({ icon, label, active, completed }: { icon: React.ReactNode, label: string, active: boolean, completed: boolean }) {
  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-700 ease-in-out ${
      completed 
        ? 'bg-white shadow-md border border-green-200/50' 
        : active 
          ? 'bg-white shadow-md border border-blue-200/50'
          : 'bg-gray-50'
    }`}>
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-700 ${
        completed 
          ? 'bg-green-500 text-white' 
          : active 
            ? 'bg-[var(--color-primary)] text-white' 
            : 'bg-gray-100 text-gray-400'
      }`}>
        {completed && label === 'Lock' ? (
          <Lock className="w-4 h-4" />
        ) : (
          icon
        )}
      </div>
      <span className={`text-xs font-medium transition-all duration-700 ${
        completed 
          ? 'text-green-600' 
          : active 
            ? 'text-[var(--color-primary)]' 
            : 'text-gray-400'
      }`}>
        {label}
      </span>
    </div>
  )
}

function AnimatedConnector({ active, completed }: { active: boolean, completed: boolean }) {
  return (
    <div className="flex items-center">
      <div className={`w-8 h-0.5 transition-all duration-700 ease-in-out ${
        completed ? 'bg-green-400' : active ? 'bg-[var(--color-primary)]' : 'bg-gray-200'
      }`}>
        <div className={`h-full transition-all duration-700 ${
          completed ? 'bg-green-400' : 'bg-[var(--color-primary)]'
        }`} style={{ width: completed ? '100%' : active ? '100%' : '0%', opacity: completed ? 0.5 : active ? 0.5 : 0 }} />
      </div>
      <ChevronRight className={`w-3 h-3 -ml-1 transition-all duration-700 ${
        completed ? 'text-green-400' : active ? 'text-[var(--color-primary)]' : 'text-gray-300'
      }`} style={{ opacity: completed ? 0.7 : active ? 0.7 : 0.5 }} />
    </div>
  )
}

function DemoCard({ title, type, status }: { title: string, type: string, status: string }) {
  const typeStyles: Record<string, string> = {
    Leave: 'bg-gray-100 text-gray-600',
    Assignment: 'bg-gray-100 text-gray-600',
    Attendance: 'bg-gray-100 text-gray-600',
    Task: 'bg-gray-100 text-gray-600',
    Marks: 'bg-gray-100 text-gray-600'
  }
  
  const statusBadgeColors: Record<string, string> = {
    created: 'bg-gray-100 text-gray-500',
    active: 'bg-blue-50 text-blue-600',
    review: 'bg-amber-50 text-amber-600',
    moved: 'bg-gray-100 text-gray-500',
    finalized: 'bg-emerald-50 text-emerald-600'
  }

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-3 transition-all duration-700 ease-in-out ${
      status === 'active' ? 'shadow-md' : 'shadow-sm hover:shadow-md'
    }`}>
      <div className="flex items-center justify-between mb-2">
        <span className={`text-[9px] px-1.5 py-0.5 rounded font-medium ${typeStyles[type] || 'bg-gray-100 text-gray-600'}`}>
          {type}
        </span>
        {status === 'active' && (
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500" style={{ opacity: 0.7 }} />
        )}
        {status === 'finalized' && (
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        )}
      </div>
      <h5 className="text-xs font-semibold text-[var(--color-text-primary)] truncate">{title}</h5>
      {status === 'active' && (
        <div className="mt-2 flex items-center gap-1">
          <div className="h-0.5 flex-1 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-blue-400" style={{ width: '60%', opacity: 0.6, transition: 'width 2s ease-in-out' }} />
          </div>
        </div>
      )}
    </div>
  )
}

function RoleBadge({ icon, label, active }: { icon: React.ReactNode, label: string, active: boolean }) {
  return (
    <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${active ? 'bg-white text-[var(--color-primary)] shadow-sm' : 'text-[var(--color-text-muted)]'}`}>
      {icon}
      <span>{label}</span>
    </div>
  )
}

function WorkflowColumn({ title, count, color, active, children }: { title: string, count: number, color: string, active: boolean, children: React.ReactNode }) {
  const colors = {
    gray: { bg: 'bg-gray-50', text: 'text-gray-500', border: 'border-gray-200' },
    blue: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200' },
    yellow: { bg: 'bg-yellow-50', text: 'text-yellow-600', border: 'border-yellow-200' },
    green: { bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-200' }
  }
  const c = colors[color as keyof typeof colors]
  
  return (
    <div className={`${active ? 'transition-all duration-700' : ''}`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-[var(--color-text-secondary)]">{title}</span>
        <span className={`w-5 h-5 ${c.bg} ${c.text} rounded text-xs flex items-center justify-center font-medium`}>{count}</span>
      </div>
      <div className="space-y-2">
        {children}
      </div>
    </div>
  )
}

function WorkflowCard({ title, subtitle, status, type, assignee }: { title: string, subtitle: string, status: string, type: string, assignee: string }) {
  const statusColors: Record<string, string> = {
    created: 'bg-gray-100 text-gray-600',
    in_progress: 'bg-blue-100 text-blue-600',
    under_review: 'bg-yellow-100 text-yellow-600',
    finalized: 'bg-green-100 text-green-600'
  }

  return (
    <div className="bg-white rounded-lg border border-[var(--color-border)] p-3 hover:shadow-md transition-all cursor-pointer hover:-translate-y-0.5">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] text-[var(--color-primary)] font-medium">{type}</span>
        <span className={`text-[9px] px-1.5 py-0.5 rounded ${statusColors[status]}`}>
          {status.replace('_', ' ')}
        </span>
      </div>
      <h5 className="text-xs font-medium text-[var(--color-text-primary)] truncate">{title}</h5>
      <p className="text-[10px] text-[var(--color-text-muted)] truncate">{subtitle}</p>
      <div className="mt-2 pt-2 border-t border-[var(--color-border-light)] flex items-center justify-between">
        <span className="text-[9px] text-[var(--color-text-muted)]">{assignee}</span>
      </div>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="bg-white rounded-xl border border-[var(--color-border)] p-5 hover:shadow-md transition-shadow">
      <div className="w-10 h-10 bg-[var(--color-primary-faint)] rounded-lg flex items-center justify-center text-[var(--color-primary)] mb-3">
        {icon}
      </div>
      <h3 className="font-medium text-[var(--color-text-primary)] mb-2">{title}</h3>
      <p className="text-sm text-[var(--color-text-secondary)]">{description}</p>
    </div>
  )
}

function LifecycleStep({ step, title, description, icon, active, completed }: { step: number, title: string, description: string, icon: React.ReactNode, active: boolean, completed: boolean }) {
  return (
    <div className={`flex items-start gap-3 transition-all ${active ? 'scale-105' : ''}`}>
      <div className={`
        w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all
        ${completed ? 'bg-[var(--color-success)] text-white' : active ? 'bg-[var(--color-primary)] text-white' : 'bg-[var(--color-surface-subtle)] text-[var(--color-text-muted)]'}
      `}>
        {completed ? <CheckCircle className="w-4 h-4" /> : icon}
      </div>
      <div>
        <p className={`text-sm font-medium ${active ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-primary)]'}`}>{title}</p>
        <p className="text-xs text-[var(--color-text-muted)]">{description}</p>
      </div>
    </div>
  )
}

function PrincipleItem({ title, description }: { title: string, description: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-5 h-5 bg-[var(--color-success-light)] rounded-full flex items-center justify-center shrink-0 mt-0.5">
        <CheckCircle className="w-3 h-3 text-[var(--color-success)]" />
      </div>
      <div>
        <h4 className="text-sm font-medium text-[var(--color-text-primary)]">{title}</h4>
        <p className="text-xs text-[var(--color-text-muted)]">{description}</p>
      </div>
    </div>
  )
}

function VisionPoint({ icon, text }: { icon: React.ReactNode, text: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-6 h-6 bg-[var(--color-primary-faint)] rounded flex items-center justify-center text-[var(--color-primary)]">
        {icon}
      </div>
      <span className="text-sm text-[var(--color-text-secondary)]">{text}</span>
    </div>
  )
}

// New animated dashboard components

function FlowingRoleIcon({ icon, label, delay }: { icon: React.ReactNode, label: string, delay: number }) {
  return (
    <div className={`flex items-center gap-2 px-3 py-2 bg-white rounded-xl shadow-sm border border-[var(--color-border)] animate-fade-in-up`} style={{ animationDelay: `${delay * 100}ms` }}>
      <div className="w-8 h-8 bg-[var(--color-primary-faint)] rounded-lg flex items-center justify-center text-[var(--color-primary)]">
        {icon}
      </div>
      <span className="text-sm font-medium text-[var(--color-text-primary)]">{label}</span>
    </div>
  )
}

function FlowingArrow() {
  return (
    <div className="relative">
      <div className="w-8 h-0.5 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary)] opacity-30" />
      <ChevronRight className="w-4 h-4 text-[var(--color-primary)] absolute -right-2 -top-2 animate-pulse" />
    </div>
  )
}

function WorkflowStage({ title, icon, count, color, delay, children }: { title: string, icon: React.ReactNode, count: number, color: string, delay: number, children: React.ReactNode }) {
  const colors: Record<string, { bg: string, text: string, border: string, icon: string }> = {
    slate: { bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-200', icon: 'text-slate-500' },
    blue: { bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-200', icon: 'text-blue-500' },
    amber: { bg: 'bg-amber-100', text: 'text-amber-600', border: 'border-amber-200', icon: 'text-amber-500' },
    emerald: { bg: 'bg-emerald-100', text: 'text-emerald-600', border: 'border-emerald-200', icon: 'text-emerald-500' }
  }
  const c = colors[color]
  
  return (
    <div className={`animate-fade-in-up`} style={{ animationDelay: `${delay * 150}ms` }}>
      <div className="flex items-center justify-between mb-4 pb-3 border-b-2" style={{ borderColor: c.border.split(' ')[1] }}>
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 ${c.bg} rounded-lg flex items-center justify-center ${c.icon}`}>
            {icon}
          </div>
          <span className="text-sm font-semibold text-[var(--color-text-primary)]">{title}</span>
        </div>
        <span className={`px-2 py-1 ${c.bg} ${c.text} text-xs font-bold rounded-full`}>{count}</span>
      </div>
      <div className="space-y-3">
        {children}
      </div>
    </div>
  )
}

function AnimatedCard({ title, subtitle, type, status, assignee }: { title: string, subtitle: string, type: string, status: string, assignee: string }) {
  const typeColors: Record<string, string> = {
    Leave: 'bg-purple-100 text-purple-600',
    Assignment: 'bg-blue-100 text-blue-600',
    Attendance: 'bg-green-100 text-green-600',
    Task: 'bg-orange-100 text-orange-600',
    Marks: 'bg-indigo-100 text-indigo-600'
  }
  
  const statusGradients: Record<string, string> = {
    created: 'from-slate-50 to-slate-100',
    in_progress: 'from-blue-50 to-blue-100',
    under_review: 'from-amber-50 to-amber-100',
    finalized: 'from-emerald-50 to-emerald-100'
  }
  
  return (
    <div className={`bg-gradient-to-br ${statusGradients[status]} rounded-lg border border-[var(--color-border)] p-3 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group`}>
      <div className="flex items-center justify-between mb-2">
        <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${typeColors[type] || 'bg-gray-100 text-gray-600'}`}>
          {type}
        </span>
        <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" style={{ color: status === 'created' ? '#64748b' : status === 'in_progress' ? '#3b82f6' : status === 'under_review' ? '#f59e0b' : '#10b981' }} />
      </div>
      <h5 className="text-xs font-semibold text-[var(--color-text-primary)] truncate group-hover:text-[var(--color-primary)] transition-colors">{title}</h5>
      <p className="text-[10px] text-[var(--color-text-muted)] truncate mt-1">{subtitle}</p>
      <div className="mt-2 pt-2 border-t border-[var(--color-border-light)] flex items-center justify-between">
        <span className="text-[9px] text-[var(--color-text-muted)] flex items-center gap-1">
          <Users className="w-3 h-3" />
          {assignee}
        </span>
        <ArrowRight className="w-3 h-3 text-[var(--color-text-muted)] opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </div>
  )
}

function EmptyState({ type }: { type: string }) {
  const messages: Record<string, string> = {
    created: 'New requests appear here',
    in_progress: 'Active workflows',
    under_review: 'Awaiting approval',
    finalized: 'Completed items'
  }
  
  return (
    <div className="h-24 rounded-lg border border-dashed border-[var(--color-border)] flex flex-col items-center justify-center text-center p-4">
      <div className="w-8 h-8 bg-[var(--color-surface-subtle)] rounded-full flex items-center justify-center mb-2">
        <Layers className="w-4 h-4 text-[var(--color-text-muted)]" />
      </div>
      <p className="text-xs text-[var(--color-text-muted)]">{messages[type]}</p>
    </div>
  )
}
