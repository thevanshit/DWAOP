'use client'

import { ReactNode, useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { 
  GraduationCap, 
  Home, 
  Calendar, 
  FileText, 
  Users, 
  Settings, 
  LogOut,
  Menu,
  X,
  Bell,
  Search
} from 'lucide-react'
import { UserRole } from '@/types'

interface DashboardLayoutProps {
  children: ReactNode
  role: UserRole
  roleLabel: string
  navItems: {
    label: string
    icon: ReactNode
    href: string
  }[]
  activeTab?: string
}

export default function DashboardLayout({ children, role, roleLabel, navItems, activeTab }: DashboardLayoutProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [currentHash, setCurrentHash] = useState('')
  const userEmail = typeof window !== 'undefined' ? localStorage.getItem('userEmail') || 'user@university.edu' : 'user@university.edu'

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentHash(window.location.hash || '#overview')
      const handleHashChange = () => {
        setCurrentHash(window.location.hash || '#overview')
      }
      window.addEventListener('hashchange', handleHashChange)
      return () => window.removeEventListener('hashchange', handleHashChange)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('userRole')
    localStorage.removeItem('userEmail')
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-jira-gray-50">
      {/* Top Navigation */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-md">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-sm font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">DWAOP</h1>
                <p className="text-xs text-gray-600">{roleLabel}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="hidden md:flex items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 w-64 hover:border-gray-300 transition-colors focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20">
              <Search className="w-4 h-4 text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent border-none outline-none text-sm flex-1 text-gray-700 placeholder-gray-400"
              />
            </div>

            {/* Notifications */}
            <button className="p-2.5 hover:bg-gray-100 rounded-xl relative transition-colors group">
              <Bell className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
            </button>

            {/* User Menu */}
            <div className="flex items-center space-x-3">
              <div className="hidden md:block text-right">
                <p className="text-sm font-semibold text-gray-900">{userEmail}</p>
                <p className="text-xs text-gray-500">{roleLabel}</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-md hover:shadow-lg transition-shadow cursor-pointer">
                {userEmail.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`
            fixed lg:static inset-y-0 left-0 z-40
            w-72 bg-gradient-to-b from-gray-50 via-white to-gray-50 border-r border-gray-200
            transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            transition-transform duration-300 ease-in-out
            pt-20 lg:pt-0
            shadow-lg lg:shadow-none
          `}
        >
          {/* Sidebar Header - Decorative only */}
          <div className="p-4 border-b border-gray-200">
            <div className="h-1 w-20 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full mx-auto"></div>
          </div>

          {/* Navigation */}
          <nav className="p-4 space-y-1 overflow-y-auto" style={{ height: 'calc(100vh - 240px)' }}>
            {navItems.map((item, index) => {
              const isActive = currentHash === item.href || (item.href === '#overview' && (!currentHash || currentHash === ''))
              const handleClick = (e: React.MouseEvent) => {
                e.preventDefault()
                if (typeof window !== 'undefined') {
                  window.location.hash = item.href
                  setCurrentHash(item.href)
                }
              }
              
              return (
                <button
                  key={item.href}
                  onClick={handleClick}
                  className={`
                    group relative flex items-center space-x-3 px-4 py-3 rounded-xl w-full text-left
                    transition-all duration-200
                    ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/30 scale-[1.02]'
                        : 'text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-600 hover:scale-[1.01]'
                    }
                  `}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full shadow-sm"></div>
                  )}
                  
                  {/* Icon */}
                  <div className={`
                    flex items-center justify-center transition-transform duration-200
                    ${isActive ? 'text-white scale-110' : 'text-gray-500 group-hover:text-blue-600 group-hover:scale-110'}
                  `}>
                    {item.icon}
                  </div>
                  
                  {/* Label */}
                  <span className={`font-semibold text-sm transition-colors ${isActive ? 'text-white' : 'text-gray-700 group-hover:text-blue-600'}`}>
                    {item.label}
                  </span>
                  
                  {/* Hover effect */}
                  {!isActive && (
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/0 to-purple-600/0 group-hover:from-blue-500/5 group-hover:to-purple-600/5 transition-all duration-200"></div>
                  )}
                  
                  {/* Active glow effect */}
                  {isActive && (
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400/20 to-purple-400/20 blur-xl"></div>
                  )}
                </button>
              )
            })}
            
            {/* Divider */}
            <div className="pt-6 pb-2">
              <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
            </div>
            
            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="group relative flex items-center space-x-3 px-4 py-3 rounded-xl w-full text-left transition-all duration-200 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 text-gray-700 hover:text-red-600"
            >
              <div className="flex items-center justify-center text-gray-500 group-hover:text-red-600 transition-colors">
                <LogOut className="w-5 h-5" />
              </div>
              <span className="font-semibold text-sm group-hover:text-red-600 transition-colors">Logout</span>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-red-500/0 to-pink-600/0 group-hover:from-red-500/5 group-hover:to-pink-600/5 transition-all duration-200"></div>
            </button>
          </nav>

          {/* Sidebar Footer */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-gradient-to-b from-white/90 to-white backdrop-blur-md">
            <div className="flex items-center space-x-3 p-3 rounded-xl bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 border border-blue-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 rounded-lg flex items-center justify-center text-white font-bold shadow-lg">
                {userEmail.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{userEmail}</p>
                <p className="text-xs text-gray-600 truncate">{roleLabel}</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}
