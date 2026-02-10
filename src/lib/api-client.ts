// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  details?: any;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  departmentId?: string;
  attributes?: Record<string, any>;
}

class ApiClient {
  private baseURL: string;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
    this.loadTokensFromStorage();
  }

  private loadTokensFromStorage(): void {
    if (typeof window !== 'undefined') {
      this.accessToken = localStorage.getItem('accessToken');
      this.refreshToken = localStorage.getItem('refreshToken');
    }
  }

  private saveTokensToStorage(accessToken: string, refreshToken: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      this.accessToken = accessToken;
      this.refreshToken = refreshToken;
    }
  }

  private clearTokensFromStorage(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userEmail');
      this.accessToken = null;
      this.refreshToken = null;
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const headers: any = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`;
    }

    const config: RequestInit = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401 && this.refreshToken) {
          const refreshSuccess = await this.refreshTokens();
          if (refreshSuccess) {
            return this.request<T>(endpoint, options);
          }
        }
        throw new Error(data.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  private async refreshTokens(): Promise<boolean> {
    if (!this.refreshToken) return false;

    try {
      const response = await fetch(`${this.baseURL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: this.refreshToken }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const tokens = (data.data as any).tokens;
        this.saveTokensToStorage(tokens.accessToken, tokens.refreshToken);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Token refresh failed:', error);
      return false;
    }
  }

  async login(credentials: LoginCredentials): Promise<{ user: User; tokens: AuthTokens }> {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (response.success && response.data) {
      const result = response.data as { user: User; tokens: AuthTokens };
      this.saveTokensToStorage(result.tokens.accessToken, result.tokens.refreshToken);
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('userRole', result.user.role);
        localStorage.setItem('userEmail', result.user.email);
      }

      return result;
    }

    throw new Error(response.error || 'Login failed');
  }

  async logout(): Promise<void> {
    if (this.refreshToken) {
      try {
        await this.request('/auth/logout', {
          method: 'POST',
          body: JSON.stringify({ refreshToken: this.refreshToken }),
        });
      } catch (error) {
        console.error('Logout request failed:', error);
      }
    }

    this.clearTokensFromStorage();
  }

  async getCurrentUser(): Promise<User> {
    const response = await this.request('/auth/me');
    
    if (response.success && response.data) {
      return (response.data as any).user;
    }

    throw new Error(response.error || 'Failed to get user profile');
  }

  async getDashboardStats(): Promise<any> {
    const response = await this.request('/dashboard/stats');
    
    if (response.success && response.data) {
      return (response.data as any).stats;
    }

    throw new Error(response.error || 'Failed to get dashboard stats');
  }

  async getDashboardWorkflows(params?: any): Promise<any[]> {
    const queryParams = new URLSearchParams();
    if (params?.type) queryParams.append('type', params.type);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    const endpoint = `/dashboard/workflows${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await this.request(endpoint);
    
    if (response.success && response.data) {
      return (response.data as any).workflows;
    }

    throw new Error(response.error || 'Failed to get dashboard workflows');
  }

  async getDashboardAnalytics(): Promise<any> {
    const response = await this.request('/dashboard/analytics');
    
    if (response.success && response.data) {
      return (response.data as any).analytics;
    }

    throw new Error(response.error || 'Failed to get dashboard analytics');
  }

  async getWorkflows(params?: any): Promise<any> {
    const queryParams = new URLSearchParams();
    if (params?.type) queryParams.append('type', params.type);
    if (params?.assigneeId) queryParams.append('assigneeId', params.assigneeId);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.priority) queryParams.append('priority', params.priority);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    const endpoint = `/workflows${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await this.request(endpoint);
    
    return response.data;
  }

  async createWorkflow(workflowData: any): Promise<any> {
    const response = await this.request('/workflows', {
      method: 'POST',
      body: JSON.stringify(workflowData),
    });
    
    if (response.success && response.data) {
      return (response.data as any).workflow;
    }

    throw new Error(response.error || 'Failed to create workflow');
  }

  async getWorkflow(id: string): Promise<any> {
    const response = await this.request(`/workflows/${id}`);
    
    if (response.success && response.data) {
      return (response.data as any).workflow;
    }

    throw new Error(response.error || 'Failed to get workflow');
  }

  async transitionWorkflow(id: string, toState: string, reason?: string): Promise<any> {
    const response = await this.request(`/workflows/${id}/transition`, {
      method: 'POST',
      body: JSON.stringify({ toState, reason }),
    });
    
    if (response.success && response.data) {
      return (response.data as any).workflow;
    }

    throw new Error(response.error || 'Failed to transition workflow');
  }

  async getWorkflowTypes(): Promise<any[]> {
    const response = await this.request('/workflows/types');
    
    if (response.success && response.data) {
      return (response.data as any).workflowTypes;
    }

    throw new Error(response.error || 'Failed to get workflow types');
  }

  isAuthenticated(): boolean {
    return !!this.accessToken;
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }
}

export const apiClient = new ApiClient();
export default apiClient;