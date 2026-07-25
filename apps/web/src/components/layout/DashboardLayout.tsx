'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import {
  Bell,
  ChevronDown,
  ChevronRight,
  LogOut,
  Menu,
  PanelLeft,
  PanelLeftClose,
  User,
  X,
  Settings,
  LayoutDashboard,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useAuth } from '@/lib/auth-context'

// ─── Types ───────────────────────────────────────────────────────────────────

interface NavItem {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  href?: string
  badge?: string | number
  children?: NavItem[]
}

interface NavSection {
  label?: string
  items: NavItem[]
}

interface DashboardLayoutProps {
  children: React.ReactNode
  navigation: NavSection[]
  currentPath?: string
  onNavigate?: (path: string) => void
  breadcrumbs?: { label: string; href?: string }[]
}

// ─── Constants ───────────────────────────────────────────────────────────────

const SIDEBAR_EXPANDED = 256  // w-64
const SIDEBAR_COLLAPSED = 64  // w-16
const APP_VERSION = 'v1.0.0'

// ─── Component ───────────────────────────────────────────────────────────────

export default function DashboardLayout({
  children,
  navigation,
  currentPath: propCurrentPath,
  onNavigate,
  breadcrumbs,
}: DashboardLayoutProps) {
  const router = useRouter()
  const pathname = usePathname()
  const currentPath = propCurrentPath ?? pathname

  const { user, logout, loading } = useAuth()

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)

  const notifRef = useRef<HTMLDivElement>(null)
  const profileRef = useRef<HTMLDivElement>(null)

  // ── Responsive default state ───────────────────────────────────────────
  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth
      if (w < 768) {
        setSidebarCollapsed(false)
        setMobileSidebarOpen(false)
      } else if (w < 1024) {
        setSidebarCollapsed(true)
      } else {
        setSidebarCollapsed(false)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // ── Click-outside for dropdowns ────────────────────────────────────────
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false)
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // ── Handlers ───────────────────────────────────────────────────────────
  const handleNavClick = useCallback(
    (href?: string) => {
      if (!href) return
      onNavigate?.(href)
      router.push(href)
      setMobileSidebarOpen(false)
    },
    [onNavigate, router],
  )

  const handleLogout = useCallback(() => {
    logout()
    router.push('/login')
  }, [logout, router])

  const isActive = useCallback(
    (href?: string) => {
      if (!href || !currentPath) return false
      if (href === '/') return currentPath === '/'
      return currentPath.startsWith(href)
    },
    [currentPath],
  )

  // ── Render: navigation items ──────────────────────────────────────────
  const renderNavItems = (collapsed: boolean) =>
    navigation.map((section, idx) => (
      <div key={section.label ?? idx}>
        {section.label && !collapsed && (
          <p className="px-2 mb-2 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
            {section.label}
          </p>
        )}
        <div className="space-y-0.5">
          {section.items.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.href)}
                title={collapsed ? item.label : undefined}
                className={cn(
                  'flex items-center w-full rounded-lg transition-all duration-200 group',
                  collapsed
                    ? 'justify-center p-2.5'
                    : 'px-3 py-2 gap-3',
                  active
                    ? 'bg-[var(--color-primary)] text-white shadow-md shadow-blue-500/20'
                    : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-subtle)] hover:text-[var(--color-text-primary)]',
                )}
              >
                <Icon
                  className={cn(
                    'w-5 h-5 shrink-0',
                    active
                      ? 'text-white'
                      : 'text-[var(--color-text-muted)] group-hover:text-[var(--color-primary)]',
                  )}
                />

                {!collapsed && (
                  <>
                    <span className="flex-1 text-sm font-medium text-left truncate">
                      {item.label}
                    </span>
                    {item.badge ? (
                      <span
                        className={cn(
                          'text-xs font-bold px-1.5 py-0.5 rounded-full',
                          active
                            ? 'bg-white/20 text-white'
                            : 'bg-[var(--color-primary-faint)] text-[var(--color-primary)]',
                        )}
                      >
                        {item.badge}
                      </span>
                    ) : null}
                  </>
                )}
              </button>
            )
          })}
        </div>
      </div>
    ))

  // ── Render: sidebar content (shared between desktop & mobile) ─────────
  const renderSidebarContent = (collapsed: boolean) => (
    <>
      {/* Logo / Brand */}
      <div
        className={cn(
          'flex items-center h-14 border-b border-[var(--color-border-light)] shrink-0',
          collapsed ? 'justify-center px-2' : 'px-4 gap-3',
        )}
      >
        <div className="w-8 h-8 bg-gradient-to-br from-[var(--color-primary)] to-blue-600 rounded-lg flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0">
          <LayoutDashboard className="w-4 h-4 text-white" />
        </div>
        <AnimatePresence initial={false}>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2 }}
              className="font-bold text-base text-[var(--color-text-primary)] whitespace-nowrap overflow-hidden"
            >
              DeptWP
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-4 scrollbar-hide">
        <div className="space-y-6">{renderNavItems(collapsed)}</div>
      </nav>

      {/* Bottom section */}
      <div className="border-t border-[var(--color-border-light)] p-3 space-y-2 shrink-0">
        {/* Collapse toggle (desktop only) */}
        <button
          onClick={() => setSidebarCollapsed(!collapsed)}
          className={cn(
            'hidden md:flex items-center w-full rounded-lg transition-colors',
            'text-[var(--color-text-muted)] hover:bg-[var(--color-surface-subtle)] hover:text-[var(--color-text-primary)]',
            collapsed ? 'justify-center p-2.5' : 'px-3 py-2 gap-3',
          )}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? (
            <PanelLeft className="w-5 h-5 shrink-0" />
          ) : (
            <>
              <PanelLeftClose className="w-5 h-5 shrink-0" />
              <span className="text-sm font-medium">Collapse</span>
            </>
          )}
        </button>

        {/* User info */}
        {!loading && (
          <div
            className={cn(
              'flex items-center rounded-lg',
              collapsed ? 'justify-center p-2' : 'px-3 py-2 gap-3',
            )}
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--color-primary)] to-blue-600 flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-md shadow-blue-500/20">
              {user ? (user.firstName?.charAt(0)?.toUpperCase() ?? 'U') : 'U'}
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[var(--color-text-primary)] truncate">
                  {user ? `${user.firstName} ${user.lastName}` : 'User'}
                </p>
                <p className="text-xs text-[var(--color-text-muted)] truncate">
                  {user?.email ?? ''}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Logout */}
        {!collapsed && (
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Sign out</span>
          </button>
        )}

        {/* Version badge */}
        {!collapsed && (
          <div className="px-3 pt-1">
            <span className="text-[10px] text-[var(--color-text-muted)]">
              {APP_VERSION}
            </span>
          </div>
        )}
      </div>
    </>
  )

  // ── Render: profile dropdown ──────────────────────────────────────────
  const renderProfileDropdown = () => (
    <motion.div
      initial={{ opacity: 0, y: -4, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -4, scale: 0.96 }}
      transition={{ duration: 0.15 }}
      className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-[var(--color-border)] overflow-hidden origin-top-right"
    >
      <div className="px-4 py-3 border-b border-[var(--color-border-light)]">
        <p className="text-sm font-semibold text-[var(--color-text-primary)]">
          {user ? `${user.firstName} ${user.lastName}` : 'User'}
        </p>
        <p className="text-xs text-[var(--color-text-muted)]">
          {user?.email ?? ''}
        </p>
      </div>
      <div className="py-1">
        <button
          onClick={() => {
            handleNavClick('/profile')
            setProfileOpen(false)
          }}
          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-subtle)] transition-colors"
        >
          <User className="w-4 h-4 text-[var(--color-text-muted)]" />
          Profile
        </button>
        <button
          onClick={() => {
            handleNavClick('/settings')
            setProfileOpen(false)
          }}
          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-subtle)] transition-colors"
        >
          <Settings className="w-4 h-4 text-[var(--color-text-muted)]" />
          Settings
        </button>
      </div>
      <div className="border-t border-[var(--color-border-light)] py-1">
        <button
          onClick={() => {
            handleLogout()
            setProfileOpen(false)
          }}
          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
      </div>
    </motion.div>
  )

  // ── Render: notifications dropdown ────────────────────────────────────
  const renderNotificationsDropdown = () => (
    <motion.div
      initial={{ opacity: 0, y: -4, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -4, scale: 0.96 }}
      transition={{ duration: 0.15 }}
      className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-[var(--color-border)] overflow-hidden origin-top-right"
    >
      <div className="px-4 py-3 border-b border-[var(--color-border-light)]">
        <p className="text-sm font-semibold text-[var(--color-text-primary)]">
          Notifications
        </p>
      </div>
      <div className="px-4 py-8 text-sm text-[var(--color-text-muted)] text-center">
        No new notifications
      </div>
    </motion.div>
  )

  // ── Render: JSX ───────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[var(--color-surface-subtle)]">
      {/* ═══ Header ═════════════════════════════════════════════════════ */}
      <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-white/80 backdrop-blur-md border-b border-[var(--color-border-light)]">
        <div className="h-full px-4 md:px-6 flex items-center justify-between">
          {/* Left */}
          <div className="flex items-center gap-3">
            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="md:hidden p-2 hover:bg-[var(--color-surface-subtle)] rounded-lg transition-colors"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5 text-[var(--color-text-secondary)]" />
            </button>

            {/* Breadcrumbs */}
            {breadcrumbs && breadcrumbs.length > 0 && (
              <nav className="hidden sm:flex items-center gap-1.5 text-sm">
                {breadcrumbs.map((crumb, idx) => (
                  <span key={idx} className="flex items-center gap-1.5">
                    {idx > 0 && (
                      <ChevronRight className="w-4 h-4 text-[var(--color-text-muted)]" />
                    )}
                    {crumb.href ? (
                      <button
                        onClick={() => handleNavClick(crumb.href)}
                        className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
                      >
                        {crumb.label}
                      </button>
                    ) : (
                      <span className="text-[var(--color-text-primary)] font-medium">
                        {crumb.label}
                      </span>
                    )}
                  </span>
                ))}
              </nav>
            )}
          </div>

          {/* Right */}
          <div className="flex items-center gap-2">
            {/* Notifications */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => {
                  setNotificationsOpen(!notificationsOpen)
                  setProfileOpen(false)
                }}
                className="relative p-2 hover:bg-[var(--color-surface-subtle)] rounded-lg transition-colors"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5 text-[var(--color-text-secondary)]" />
              </button>
              <AnimatePresence>
                {notificationsOpen && renderNotificationsDropdown()}
              </AnimatePresence>
            </div>

            {/* Profile dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => {
                  setProfileOpen(!profileOpen)
                  setNotificationsOpen(false)
                }}
                className="flex items-center gap-2 p-1.5 hover:bg-[var(--color-surface-subtle)] rounded-lg transition-colors"
                aria-label="User menu"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--color-primary)] to-blue-600 flex items-center justify-center text-white text-xs font-bold shadow-md shadow-blue-500/20">
                  {user ? (user.firstName?.charAt(0)?.toUpperCase() ?? 'U') : 'U'}
                </div>
                <ChevronDown className="w-4 h-4 text-[var(--color-text-muted)] hidden md:block" />
              </button>
              <AnimatePresence>
                {profileOpen && renderProfileDropdown()}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </header>

      {/* ═══ Body ════════════════════════════════════════════════════════ */}
      <div className="flex pt-14 min-h-screen">
        {/* ─── Desktop sidebar ───────────────────────────────────────── */}
        <motion.aside
          animate={{ width: sidebarCollapsed ? SIDEBAR_COLLAPSED : SIDEBAR_EXPANDED }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="hidden md:flex flex-col fixed left-0 top-14 h-[calc(100vh-56px)] z-40 bg-white border-r border-[var(--color-border-light)] overflow-hidden"
        >
          {renderSidebarContent(sidebarCollapsed)}
        </motion.aside>

        {/* ─── Mobile sidebar overlay ────────────────────────────────── */}
        <AnimatePresence>
          {mobileSidebarOpen && (
            <div className="fixed inset-0 z-50 md:hidden">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-black/40"
                onClick={() => setMobileSidebarOpen(false)}
              />

              {/* Panel */}
              <motion.aside
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                className="fixed left-0 top-0 h-full w-64 bg-white shadow-2xl z-10 flex flex-col"
              >
                {/* Close button bar */}
                <div className="flex items-center justify-end h-14 px-4 border-b border-[var(--color-border-light)] shrink-0">
                  <button
                    onClick={() => setMobileSidebarOpen(false)}
                    className="p-2 hover:bg-[var(--color-surface-subtle)] rounded-lg transition-colors"
                    aria-label="Close sidebar"
                  >
                    <X className="w-5 h-5 text-[var(--color-text-secondary)]" />
                  </button>
                </div>
                {renderSidebarContent(false)}
              </motion.aside>
            </div>
          )}
        </AnimatePresence>

        {/* ─── Main content area ─────────────────────────────────────── */}
        <main
          className={cn(
            'flex-1 min-h-[calc(100vh-56px)] transition-all duration-300 ease-in-out',
            sidebarCollapsed ? 'md:ml-16' : 'md:ml-64',
            'ml-0',
          )}
        >
          <div className="p-4 md:p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </div>
  )
}
