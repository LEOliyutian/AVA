import { apiClient } from './client';
import type { ApiResponse } from './index';
import type { AvalancheEvent } from '../types/avalanche-event';

export interface AvalancheEventListParams {
  page?: number;
  limit?: number;
  // bbox 过滤：west,south,east,north
  bbox?: string;
  start_date?: string;
  end_date?: string;
}

export interface CreateAvalancheEventData {
  latitude: number;
  longitude: number;
  elevation?: number;
  event_date: string;
  avalanche_type: string;
  trigger: string;
  size: string;
  aspect?: string;
  slope_angle?: number;
  start_elevation?: number;
  vertical_fall?: number;
  width?: number;
  description?: string;
  reported_by: string;
}

export const avalancheEventApi = {
  async getList(params?: AvalancheEventListParams): Promise<
    ApiResponse<{
      events: AvalancheEvent[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
      };
    }>
  > {
    try {
      const q = new URLSearchParams();
      if (params?.page) q.set('page', params.page.toString());
      if (params?.limit) q.set('limit', params.limit.toString());
      if (params?.bbox) q.set('bbox', params.bbox);
      if (params?.start_date) q.set('start_date', params.start_date);
      if (params?.end_date) q.set('end_date', params.end_date);
      return await apiClient.get(`/avalanche-events?${q.toString()}`);
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : '获取雪崩事件列表失败';
      return { success: false, error: msg };
    }
  },

  async getById(id: number): Promise<ApiResponse<{ event: AvalancheEvent }>> {
    try {
      return await apiClient.get(`/avalanche-events/${id}`);
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : '获取雪崩事件详情失败';
      return { success: false, error: msg };
    }
  },

  async create(
    data: CreateAvalancheEventData,
    photos: File[]
  ): Promise<ApiResponse<{ id: number }>> {
    try {
      const formData = new FormData();
      formData.append('eventData', JSON.stringify(data));
      photos.forEach((file) => {
        formData.append('photos', file);
      });
      return await apiClient.postFormData('/avalanche-events', formData);
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : '创建雪崩事件失败';
      return { success: false, error: msg };
    }
  },

  async update(
    id: number,
    data: Partial<AvalancheEvent>
  ): Promise<ApiResponse<{ id: number }>> {
    try {
      return await apiClient.put(`/avalanche-events/${id}`, data);
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : '更新雪崩事件失败';
      return { success: false, error: msg };
    }
  },

  async delete(id: number): Promise<ApiResponse<void>> {
    try {
      return await apiClient.delete(`/avalanche-events/${id}`);
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : '删除雪崩事件失败';
      return { success: false, error: msg };
    }
  },
};
