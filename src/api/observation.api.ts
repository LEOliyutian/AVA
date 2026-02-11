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

      const response = await apiClient.get<{
        observations: ObservationListItem[];
        pagination: {
          page: number;
          limit: number;
          total: number;
          totalPages: number;
        };
      }>(`/observations?${queryParams.toString()}`);

      // Fallback to mock data if DB is empty
      if (response.success && response.data && response.data.observations.length === 0) {
        return {
          success: true,
          data: {
            observations: MOCK_OBSERVATIONS,
            pagination: {
              page: 1,
              limit: 20,
              total: MOCK_OBSERVATIONS.length,
              totalPages: 1
            }
          }
        };
      }

      return response;
    } catch (error: any) {
      // Mock fallback for demonstration
      console.warn('API fetch failed, returning mock data');
      return {
        success: true,
        data: {
          observations: MOCK_OBSERVATIONS,
          pagination: {
            page: 1,
            limit: 20,
            total: MOCK_OBSERVATIONS.length,
            totalPages: 1
          }
        }
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

      // Fallback to mock data if DB is empty
      if (response.success && response.data && response.data.observations.length === 0) {
        return {
          success: true,
          data: {
            observations: MOCK_OBSERVATIONS.slice(0, limit),
          }
        };
      }

      return response;
    } catch (error: any) {
      // Mock fallback
      console.warn('API fetch failed, returning mock data');
      return {
        success: true,
        data: {
          observations: MOCK_OBSERVATIONS.slice(0, limit),
        }
      };
    }
  },
};

// Mock Data for Fallback
const MOCK_OBSERVATIONS: ObservationListItem[] = [
  {
    id: 101,
    record_id: 'OBS-2024-001',
    location_description: '阿尔泰山 - 这里的山',
    elevation: '2150',
    slope_aspect: 'N',
    observer: '王大力',
    observation_date: '2024-01-25',
    created_by: 1, created_at: '2024-01-25T10:00:00Z', updated_at: '2024-01-25T10:00:00Z',
    total_snow_depth: '145', air_temperature: '-15', weather: '晴'
  },
  {
    id: 102,
    record_id: 'OBS-2024-002',
    location_description: '可可托海 - 宝石沟',
    elevation: '1980',
    slope_aspect: 'NE',
    observer: '李雪',
    observation_date: '2024-01-24',
    created_by: 1, created_at: '2024-01-24T10:00:00Z', updated_at: '2024-01-24T10:00:00Z',
    total_snow_depth: '120', air_temperature: '-12', weather: '多云'
  },
  {
    id: 103,
    record_id: 'OBS-2024-003',
    location_description: '将军山 - 后山',
    elevation: '1450',
    slope_aspect: 'E',
    observer: '张三',
    observation_date: '2024-01-23',
    created_by: 1, created_at: '2024-01-23T10:00:00Z', updated_at: '2024-01-23T10:00:00Z',
    total_snow_depth: '85', air_temperature: '-8', weather: '小雪'
  },
  {
    id: 104,
    record_id: 'OBS-2024-004',
    location_description: '青河 - 查干郭勒',
    elevation: '2300',
    slope_aspect: 'NW',
    observer: 'Safety Team',
    observation_date: '2024-01-22',
    created_by: 1, created_at: '2024-01-22T10:00:00Z', updated_at: '2024-01-22T10:00:00Z',
    total_snow_depth: '180', air_temperature: '-20', weather: '大风'
  },
  {
    id: 105,
    record_id: 'OBS-2024-005',
    location_description: '禾木 - 吉克普林',
    elevation: '2600',
    slope_aspect: 'N',
    observer: 'Patrol 01',
    observation_date: '2024-01-20',
    created_by: 1, created_at: '2024-01-20T10:00:00Z', updated_at: '2024-01-20T10:00:00Z',
    total_snow_depth: '210', air_temperature: '-18', weather: '晴'
  },
];
