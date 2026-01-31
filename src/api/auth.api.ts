import { apiClient } from './client';

export interface SafeUser {
  id: number;
  username: string;
  display_name: string;
  role: 'admin' | 'forecaster' | 'visitor';
  email: string | null;
  created_at: string;
  last_login: string | null;
}

export interface AuthResponse {
  user: SafeUser;
  token: string;
  refreshToken: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  display_name: string;
  email?: string;
}

export const authApi = {
  async login(data: LoginRequest) {
    const result = await apiClient.post<AuthResponse>('/auth/login', data);
    if (result.success && result.data) {
      apiClient.setToken(result.data.token);
      localStorage.setItem('refresh_token', result.data.refreshToken);
    }
    return result;
  },

  async register(data: RegisterRequest) {
    const result = await apiClient.post<AuthResponse>('/auth/register', data);
    if (result.success && result.data) {
      apiClient.setToken(result.data.token);
      localStorage.setItem('refresh_token', result.data.refreshToken);
    }
    return result;
  },

  async logout() {
    const result = await apiClient.post('/auth/logout');
    apiClient.setToken(null);
    localStorage.removeItem('refresh_token');
    return result;
  },

  async getMe() {
    return apiClient.get<{ user: SafeUser }>('/auth/me');
  },

  async refresh() {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      return { success: false, error: '无刷新令牌' };
    }
    const result = await apiClient.post<{ token: string; refreshToken: string }>(
      '/auth/refresh',
      { refreshToken }
    );
    if (result.success && result.data) {
      apiClient.setToken(result.data.token);
      localStorage.setItem('refresh_token', result.data.refreshToken);
    }
    return result;
  },
};
