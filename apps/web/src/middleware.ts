import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Routes that don't require authentication
const publicRoutes = [
  '/',
  '/login',
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/refresh',
  '/api/auth/forgot-password',
  '/api/auth/reset-password',
  '/health',
]

// Routes accessible by specific roles
const roleBasedRoutes: Record<string, string[]> = {
  student: ['/dashboard/student'],
  teacher: ['/dashboard/teacher', '/dashboard/faculty'],
  admin: ['/dashboard/admin', '/dashboard/faculty'],
  hod: ['/dashboard/admin', '/dashboard/faculty'],
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow public routes
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next()
  }

  // Allow static files and Next.js internals
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.startsWith('/favicon') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // Check authentication via token in cookies or Authorization header
  const authToken = request.cookies.get('deptwp_access_token')?.value ||
                    request.headers.get('Authorization')?.replace('Bearer ', '')

  if (!authToken) {
    // Check if this is an API route
    if (pathname.startsWith('/api/')) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }
    // Redirect to login for page routes
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // For API routes, validate the token
  if (pathname.startsWith('/api/')) {
    try {
      // Basic JWT validation - check if token is present and looks valid
      const tokenParts = authToken.split('.')
      if (tokenParts.length !== 3) {
        return NextResponse.json(
          { success: false, error: 'Invalid token format' },
          { status: 401 }
        )
      }

      // Decode payload to check expiration
      const payload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString())
      if (payload.exp && payload.exp * 1000 < Date.now()) {
        return NextResponse.json(
          { success: false, error: 'Token expired' },
          { status: 401 }
        )
      }

      // Store user role in request header for downstream use
      const requestHeaders = new Headers(request.headers)
      requestHeaders.set('x-user-role', payload.role || '')
      requestHeaders.set('x-user-id', payload.sub || payload.userId || '')

      return NextResponse.next({
        request: { headers: requestHeaders },
      })
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      )
    }
  }

  // For page routes, check role-based access
  const roleMatch = pathname.match(/\/dashboard\/(\w+)/)
  if (roleMatch) {
    const dashboardRole = roleMatch[1]
    // Try to decode role from token
    try {
      const tokenParts = authToken.split('.')
      if (tokenParts.length === 3) {
        const payload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString())
        const userRole = (payload.role || '').toLowerCase()

        // Check if user has access to this dashboard
        const allowedRoutes = roleBasedRoutes[userRole] || []
        const hasAccess = allowedRoutes.some(route => pathname.startsWith(route))

        if (!hasAccess) {
          // Redirect to user's own dashboard
          const userDashboard = roleBasedRoutes[userRole]?.[0] || '/login'
          return NextResponse.redirect(new URL(userDashboard, request.url))
        }
      }
    } catch {
      // Token decode failed - redirect to login
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // Match all routes except static files
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
