// Simplified API client for frontend development
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
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

  private async request<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.accessToken) {
      headers.Authorization = `Bearer ${this.accessToken}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await this.request<{ success: boolean; data: AuthResponse; error?: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (response.success && response.data) {
      this.saveTokensToStorage(response.data.tokens.accessToken, response.data.tokens.refreshToken);
      return response.data;
    }

    throw new Error(response.error || 'Login failed');
  }

  async logout(): Promise<void> {
    try {
      await this.request('/auth/logout', {
        method: 'POST',
        body: JSON.stringify({ refreshToken: this.refreshToken }),
      });
    } finally {
      this.clearTokens();
    }
  }

  private clearTokens(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userEmail');
      this.accessToken = null;
      this.refreshToken = null;
    }
  }

  async getWorkflows(): Promise<any[]> {
    const response = await this.request<{ success: boolean; data: any[] }>('/workflows');
    
    if (response.success && response.data) {
      return response.data;
    }

    return [];
  }

  async getAudit(): Promise<any[]> {
    const response = await this.request<{ success: boolean; data: any[] }>('/audit');
    
    if (response.success && response.data) {
      return response.data;
    }

    return [];
  }

  async getAnalytics(): Promise<Record<string, any>> {
    const response = await this.request<{ success: boolean; data: Record<string, any> }>('/dashboard/analytics');
    
    if (response.success && response.data) {
      return response.data;
    }

    return {};
  }

  async getWorkflow(id: string): Promise<Record<string, any>> {
    const response = await this.request<{ success: boolean; data: Record<string, any> }>(`/workflows/${id}`);
    
    if (response.success && response.data) {
      return response.data;
    }

    return {};
  }

  async getWorkflowTypes(): Promise<any[]> {
    const response = await this.request<{ success: boolean; data: any[] }>('/workflows/types');
    
    if (response.success && response.data) {
      return response.data;
    }

    return [];
  }

  isAuthenticated(): boolean {
    return !!this.accessToken;
  }

  getCurrentUser(): User | null {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    }
    return null;
  }
}

export const apiClient = new ApiClient();
export default apiClient;