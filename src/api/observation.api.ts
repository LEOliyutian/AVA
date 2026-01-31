import { apiClient } from './client';
import type { ApiResponse } from './index';

// 雪层数据
export interface SnowLayer {
  id?: number;
  thickness: number | null;           // 层厚度 (cm)
  start_depth?: number | null;        // 层底部深度（计算得出）
  end_depth?: number | null;          // 层顶部深度（计算得出）
  hardness: string;
  crystal_type: string;
  grain_size: string;
  wetness: string;
  notes: string;
  hardness_top?: number;
  hardness_bottom?: number;
}

// 温度测量点（独立于雪层）
export interface TemperaturePointApi {
  id?: number;
  depth: number | null;
  temperature: number | null;
}

// 稳定性测试
export interface StabilityTest {
  id?: number;
  test_type: string;
  taps?: string;
  result?: string;
  quality?: string;
  cut?: string;
  length?: string;
  propagation?: string;
  score?: string;
  notes?: string;
}

// 稳定性测试组
export interface StabilityTestGroup {
  id?: number;
  depth: number | null;
  weak_layer_type: string;
  weak_layer_grain_size: string;
  notes: string;
  tests: StabilityTest[];
}

// 观测基本信息
export interface Observation {
  id: number;
  record_id: string | null;
  location_description: string | null;
  observer: string | null;
  observation_date: string | null;
  gps_coordinates: string | null;
  elevation: string | null;
  slope_aspect: string | null;
  slope_angle: string | null;
  total_snow_depth: string | null;
  air_temperature: string | null;
  weather: string | null;
  boot_penetration: string | null;
  wind: string | null;
  blowing_snow: string | null;
  conclusion: string | null;
  diagram_x_axis_side: 'left' | 'right';
  diagram_y_axis_direction: 'up' | 'down';
  created_by: number;
  created_at: string;
  updated_at: string;
  observer_name?: string;
}

// 观测详情
export interface ObservationDetail extends Observation {
  snow_layers?: SnowLayer[];
  temperature_points?: TemperaturePointApi[];
  stability_test_groups?: StabilityTestGroup[];
}

// 观测列表项
export interface ObservationListItem {
  id: number;
  record_id: string | null;
  location_description: string | null;
  observer: string | null;
  observation_date: string | null;
  elevation: string | null;
  slope_aspect: string | null;
  total_snow_depth: string | null;
  air_temperature: string | null;
  weather: string | null;
  created_by: number;
  created_at: string;
  updated_at: string;
  observer_name?: string;
}

// 创建/更新观测请求
export interface SaveObservationRequest {
  record_id?: string;
  location_description?: string;
  observer?: string;
  observation_date?: string;
  gps_coordinates?: string;
  elevation?: string;
  slope_aspect?: string;
  slope_angle?: string;
  total_snow_depth?: string;
  air_temperature?: string;
  weather?: string;
  boot_penetration?: string;
  wind?: string;
  blowing_snow?: string;
  conclusion?: string;
  diagram_x_axis_side?: 'left' | 'right';
  diagram_y_axis_direction?: 'up' | 'down';
  snow_layers?: SnowLayer[];
  temperature_points?: TemperaturePointApi[];
  stability_test_groups?: StabilityTestGroup[];
}

// 观测API
export const observationApi = {
  // 获取观测列表
  async getList(params?: { page?: number; limit?: number; myOnly?: boolean }): Promise<
    ApiResponse<{
      observations: ObservationListItem[];
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
      if (params?.myOnly) queryParams.set('myOnly', 'true');

      const response = await apiClient.get(`/observations?${queryParams.toString()}`);
      return response;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || '获取观测列表失败',
      };
    }
  },

  // 获取单个观测详情
  async getById(id: number): Promise<ApiResponse<{ observation: ObservationDetail }>> {
    try {
      const response = await apiClient.get<{ observation: ObservationDetail }>(`/observations/${id}`);
      return response;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || '获取观测详情失败',
      };
    }
  },

  // 创建观测记录
  async create(data: SaveObservationRequest): Promise<ApiResponse<{ id: number }>> {
    try {
      // apiClient.post 已经返回完整的 ApiResponse，直接返回即可
      const response = await apiClient.post<{ id: number }>('/observations', data);
      return response;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || '创建观测记录失败',
      };
    }
  },

  // 更新观测记录
  async update(id: number, data: SaveObservationRequest): Promise<ApiResponse<{ id: number }>> {
    try {
      const response = await apiClient.put<{ id: number }>(`/observations/${id}`, data);
      return response;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || '更新观测记录失败',
      };
    }
  },

  // 删除观测记录
  async delete(id: number): Promise<ApiResponse<void>> {
    try {
      const response = await apiClient.delete<void>(`/observations/${id}`);
      return response;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || '删除观测记录失败',
      };
    }
  },

  // 获取最近的观测记录（用于首页显示）
  async getRecent(limit = 5): Promise<ApiResponse<{ observations: ObservationListItem[] }>> {
    try {
      const response = await apiClient.get<{ observations: ObservationListItem[] }>(`/observations?limit=${limit}`);
      return response;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || '获取最近观测记录失败',
      };
    }
  },
};
