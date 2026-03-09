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
};
