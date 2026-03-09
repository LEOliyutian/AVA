import { apiClient } from './client';

export interface AdminOverview {
  published_this_month: number;
  drafts: number;
  pending_review: number;
  total_users: { admin: number; forecaster: number; visitor: number };
  observations_this_month: number;
}

export interface AdminStats {
  overview: AdminOverview;
  charts: {
    daily_forecasts: { date: string; count: number }[];
    danger_distribution: { level: number; count: number }[];
    top_forecasters: { name: string; count: number }[];
    problem_types: { type: string; count: number }[];
  };
}

export interface AuditLog {
  id: number;
  user_id: number;
  user_name: string;
  action: string;
  target_type: string | null;
  target_id: number | null;
  detail: string | null;
  ip_address: string | null;
  created_at: string;
}

export interface AuditLogResult {
  data: AuditLog[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface SystemSetting {
  key: string;
  value: string;
  type: string;
  label: string;
  description: string | null;
  updated_at: string;
  updated_by: number | null;
}

export interface AuditLogQuery {
  userId?: number;
  action?: string;
  targetType?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export type ForecastStatus = 'draft' | 'pending_review' | 'published' | 'rejected' | 'archived';

export interface PendingForecast {
  id: number;
  forecast_date: string;
  status: ForecastStatus;
  danger_alp: number;
  danger_tl: number;
  danger_btl: number;
  forecaster_name: string;
  reject_reason: string | null;
  created_at: string;
  published_at: string | null;
}

export interface AdminUser {
  id: number;
  username: string;
  display_name: string;
  role: 'admin' | 'forecaster' | 'visitor';
  email: string | null;
  is_active: boolean;
  created_at: string;
  last_login: string | null;
}

export interface AdminUserListResult {
  users: AdminUser[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateUserPayload {
  username: string;
  password: string;
  display_name: string;
  role: 'admin' | 'forecaster' | 'visitor';
  email?: string;
}

export interface UserListQuery {
  page?: number;
  limit?: number;
  role?: string;
  keyword?: string;
}

export const adminApi = {
  getStats: () =>
    apiClient.get<AdminStats>('/admin/stats'),

  getAuditLogs: (query: AuditLogQuery = {}) => {
    const params = new URLSearchParams();
    if (query.userId) params.set('userId', String(query.userId));
    if (query.action) params.set('action', query.action);
    if (query.targetType) params.set('targetType', query.targetType);
    if (query.startDate) params.set('startDate', query.startDate);
    if (query.endDate) params.set('endDate', query.endDate);
    if (query.page) params.set('page', String(query.page));
    if (query.limit) params.set('limit', String(query.limit));
    const qs = params.toString();
    return apiClient.get<AuditLogResult>(`/admin/audit-logs${qs ? `?${qs}` : ''}`);
  },

  getSettings: () =>
    apiClient.get<{ settings: SystemSetting[] }>('/admin/settings'),

  updateSetting: (key: string, value: string) =>
    apiClient.put<{ message: string }>(`/admin/settings/${key}`, { value }),

  // 预报审核
  getPendingForecasts: () =>
    apiClient.get<{ forecasts: PendingForecast[] }>('/admin/pending-forecasts'),

  // 用户管理
  getUsers: (query: UserListQuery = {}) => {
    const params = new URLSearchParams();
    if (query.page) params.set('page', String(query.page));
    if (query.limit) params.set('limit', String(query.limit));
    if (query.role) params.set('role', query.role);
    if (query.keyword) params.set('keyword', query.keyword);
    const qs = params.toString();
    return apiClient.get<AdminUserListResult>(`/admin/users${qs ? `?${qs}` : ''}`);
  },

  createUser: (data: CreateUserPayload) =>
    apiClient.post<{ id: number; message: string }>('/admin/users', data),

  setUserStatus: (id: number, isActive: boolean) =>
    apiClient.put<{ message: string }>(`/admin/users/${id}/status`, { is_active: isActive }),

  getUserActivity: (id: number) =>
    apiClient.get<{ activity: unknown[] }>(`/admin/users/${id}/activity`),
};
