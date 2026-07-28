// src/lib/api-client.ts
// Fetch-based API client with JWT token handling for the department workflow platform

// Types
interface ApiClientConfig {
  baseUrl: string
  accessTokenKey: string
  refreshTokenKey: string
}

interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
  warning?: string
}

interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: any
  params?: Record<string, string>
  skipAuth?: boolean
}

// Default config
const DEFAULT_CONFIG: ApiClientConfig = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || '/api',
  accessTokenKey: 'deptwp_access_token',
  refreshTokenKey: 'deptwp_refresh_token',
}

class ApiClient {
  private config: ApiClientConfig

  constructor(config?: Partial<ApiClientConfig>) {
    this.config = { ...DEFAULT_CONFIG, ...config }
  }

  // Get stored tokens
  private getAccessToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem(this.config.accessTokenKey)
  }

  private getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem(this.config.refreshTokenKey)
  }

  // Store tokens
  setTokens(accessToken: string, refreshToken: string): void {
    if (typeof window === 'undefined') return
    localStorage.setItem(this.config.accessTokenKey, accessToken)
    localStorage.setItem(this.config.refreshTokenKey, refreshToken)
  }

  // Clear tokens (logout)
  clearTokens(): void {
    if (typeof window === 'undefined') return
    localStorage.removeItem(this.config.accessTokenKey)
    localStorage.removeItem(this.config.refreshTokenKey)
    localStorage.removeItem('userRole')
    localStorage.removeItem('userEmail')
  }

  // Check if authenticated
  isAuthenticated(): boolean {
    return !!this.getAccessToken()
  }

  // Refresh the access token
  private async refreshAccessToken(): Promise<boolean> {
    const refreshToken = this.getRefreshToken()
    if (!refreshToken) return false

    try {
      const response = await fetch(`${this.config.baseUrl}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      })

      if (!response.ok) {
        this.clearTokens()
        return false
      }

      const result = await response.json()
      if (result.success && result.data?.tokens) {
        this.setTokens(result.data.tokens.accessToken, result.data.tokens.refreshToken)
        return true
      }

      return false
    } catch {
      this.clearTokens()
      return false
    }
  }

    // Token refresh lock to prevent concurrent refresh calls
  private refreshPromise: Promise<boolean> | null = null

  // Main request method
  async request<T = any>(
    endpoint: string,
    options: RequestOptions & { signal?: AbortSignal } = {}
  ): Promise<ApiResponse<T>> {
    const { body, params, skipAuth, signal, ...fetchOptions } = options

    // Build URL with query params
    let url = `${this.config.baseUrl}${endpoint}`
    if (params) {
      const searchParams = new URLSearchParams()
      Object.entries(params).forEach(([key, value]) => {
        if (value) searchParams.set(key, value)
      })
      const qs = searchParams.toString()
      if (qs) url += `?${qs}`
    }

    // Build headers
    const headers: Record<string, string> = {
      ...(fetchOptions.headers as Record<string, string>),
    }

    // Set content type for non-FormData
    if (!(body instanceof FormData)) {
      headers['Content-Type'] = 'application/json'
    }

    // Attach auth token
    if (!skipAuth) {
      const token = this.getAccessToken()
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }
    }

    // Build request
    const requestInit: RequestInit = {
      ...fetchOptions,
      headers,
      method: fetchOptions.method || (body ? 'POST' : 'GET'),
      signal,
    }

    // Attach body
    if (body) {
      requestInit.body = body instanceof FormData ? body : JSON.stringify(body)
    }

    try {
      let response = await fetch(url, requestInit)

      // If 401, try to refresh token
      if (response.status === 401 && !skipAuth) {
        // Use a singleton promise to prevent concurrent refresh calls
        if (!this.refreshPromise) {
          this.refreshPromise = this.refreshAccessToken().finally(() => {
            this.refreshPromise = null
          })
        }
        const refreshed = await this.refreshPromise
        if (refreshed) {
          // Retry with new token - rebuild headers to avoid stale references
          const retryHeaders: Record<string, string> = {
            ...(fetchOptions.headers as Record<string, string>),
          }
          if (!(body instanceof FormData)) {
            retryHeaders['Content-Type'] = 'application/json'
          }
          retryHeaders['Authorization'] = `Bearer ${this.getAccessToken()}`
          response = await fetch(url, { ...requestInit, headers: retryHeaders })
        } else {
          // Token refresh failed
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('auth:logout'))
          }
          return { success: false, error: 'Session expired. Please login again.' }
        }
      }

      // Parse response
      let result: any = {}
      try {
        result = await response.json()
      } catch {
        // Non-JSON response or empty body
        if (response.ok) {
          return { success: true }
        }
      }

      if (!response.ok) {
        return {
          success: false,
          error: result.error || result.message || `Request failed with status ${response.status}`,
        }
      }

      return { success: true, ...result }
    } catch (error: unknown) {
      // Don't treat aborted requests as errors
      if (error instanceof DOMException && error.name === 'AbortError') {
        return { success: false, error: 'Request was cancelled' }
      }
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      }
    }
  }

  // Convenience methods - strip nullish signal from options to avoid type conflicts
  async get<T = any>(endpoint: string, options?: RequestOptions) {
    const { signal, ...rest } = options || {}
    return this.request<T>(endpoint, { ...rest, method: 'GET', signal: signal || undefined })
  }

  async post<T = any>(endpoint: string, body?: any, options?: RequestOptions) {
    const { signal, ...rest } = options || {}
    return this.request<T>(endpoint, { ...rest, method: 'POST', body, signal: signal || undefined })
  }

  async put<T = any>(endpoint: string, body?: any, options?: RequestOptions) {
    const { signal, ...rest } = options || {}
    return this.request<T>(endpoint, { ...rest, method: 'PUT', body, signal: signal || undefined })
  }

  async patch<T = any>(endpoint: string, body?: any, options?: RequestOptions) {
    const { signal, ...rest } = options || {}
    return this.request<T>(endpoint, { ...rest, method: 'PATCH', body, signal: signal || undefined })
  }

  async delete<T = any>(endpoint: string, options?: RequestOptions) {
    const { signal, ...rest } = options || {}
    return this.request<T>(endpoint, { ...rest, method: 'DELETE', signal: signal || undefined })
  }
}

// Singleton instance
export const apiClient = new ApiClient()

export default ApiClient
