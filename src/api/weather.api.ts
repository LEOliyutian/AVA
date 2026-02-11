import { apiClient } from './client';
import type { ApiResponse } from './index';
import type {
  CloudCover,
  WindDirectionSimple,
  SurfaceSnowType,
} from '../types/weather.types';

// 气象观测列表项
export interface WeatherObservationListItem {
  id: number;
  date: string;
  recorder: string;
  temp_min: number;
  temp_max: number;
  station_count: number;
  created_at: string;
  updated_at: string;
}

// 站点观测数据（API 格式）
export interface StationObservationApi {
  id?: number;
  name: string;
  elevation: number;
  time: string;
  cloud_cover: CloudCover;
  precipitation: string;
  wind_direction: WindDirectionSimple;
  wind_speed: number;
  grain_size: number;
  surface_snow_type: SurfaceSnowType;
  temp_10cm: number;
  temp_surface: number;
  temp_air: number;
  blowing_snow: string;
  snow_depth: number;
  hst?: number;
  h24?: number;
}

// 气象观测详情（API 响应格式）
export interface WeatherObservationDetail {
  id: number;
  date: string;
  recorder: string;
  temp_min: number;
  temp_max: number;
  stations: StationObservationApi[];
  created_at: string;
  updated_at: string;
}

// 创建/更新气象观测请求
export interface SaveWeatherObservationRequest {
  date: string;
  recorder: string;
  temp_min: number;
  temp_max: number;
  stations: StationObservationApi[];
}

// 气象观测 API
export const weatherApi = {
  // 获取气象观测列表
  async getList(params?: { page?: number; limit?: number }): Promise<
    ApiResponse<{
      observations: WeatherObservationListItem[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
      };
    }>
  > {
    try {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.set('page', params.page.toString());
      if (params?.limit) queryParams.set('limit', params.limit.toString());

      const response = await apiClient.get(`/weather-observations?${queryParams.toString()}`);
      return response;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || '获取气象观测列表失败',
      };
    }
  },

  // 获取单个气象观测详情
  async getById(id: number): Promise<ApiResponse<{ observation: WeatherObservationDetail }>> {
    try {
      const response = await apiClient.get<{ observation: WeatherObservationDetail }>(
        `/weather-observations/${id}`
      );
      return response;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || '获取气象观测详情失败',
      };
    }
  },

  // 创建气象观测记录
  async create(data: SaveWeatherObservationRequest): Promise<ApiResponse<{ id: number }>> {
    try {
      const response = await apiClient.post<{ id: number }>('/weather-observations', data);
      return response;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || '创建气象观测记录失败',
      };
    }
  },

  // 更新气象观测记录
  async update(
    id: number,
    data: SaveWeatherObservationRequest
  ): Promise<ApiResponse<{ id: number }>> {
    try {
      const response = await apiClient.put<{ id: number }>(`/weather-observations/${id}`, data);
      return response;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || '更新气象观测记录失败',
      };
    }
  },

  // 删除气象观测记录
  async delete(id: number): Promise<ApiResponse<void>> {
    try {
      const response = await apiClient.delete<void>(`/weather-observations/${id}`);
      return response;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || '删除气象观测记录失败',
      };
    }
  },

  // 获取趋势数据
  async getTrends(params?: { days?: number; station?: string }): Promise<
    ApiResponse<{
      records: WeatherObservationDetail[];
      stations: string[];
    }>
  > {
    try {
      const queryParams = new URLSearchParams();
      if (params?.days) queryParams.set('days', params.days.toString());
      if (params?.station) queryParams.set('station', params.station);

      const response = await apiClient.get(`/weather-observations/trends?${queryParams.toString()}`);
      return response;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || '获取趋势数据失败',
      };
    }
  },

  // 获取最近的气象观测记录
  async getRecent(limit = 5): Promise<ApiResponse<{ observations: WeatherObservationListItem[] }>> {
    try {
      const response = await apiClient.get<{ observations: WeatherObservationListItem[] }>(
        `/weather-observations?limit=${limit}`
      );
      return response;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || '获取最近气象观测记录失败',
      };
    }
  },
};
