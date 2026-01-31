// 用户角色
export type UserRole = 'admin' | 'forecaster' | 'visitor';

// 用户
export interface User {
  id: number;
  username: string;
  password_hash: string;
  display_name: string;
  role: UserRole;
  email: string | null;
  created_at: string;
  updated_at: string;
  last_login: string | null;
}

// 用户（不含密码）
export interface SafeUser {
  id: number;
  username: string;
  display_name: string;
  role: UserRole;
  email: string | null;
  created_at: string;
  last_login: string | null;
}

// 预报状态
export type ForecastStatus = 'draft' | 'published' | 'archived';

// 趋势方向
export type TrendDirection = 'increasing' | 'steady' | 'decreasing';

// 预报数据
export interface Forecast {
  id: number;
  forecast_date: string;
  forecaster_id: number;
  status: ForecastStatus;

  // 危险等级
  danger_alp: number;
  danger_tl: number;
  danger_btl: number;
  trend_alp: TrendDirection | null;
  trend_tl: TrendDirection | null;
  trend_btl: TrendDirection | null;

  // 主要问题
  primary_type: string | null;
  primary_likelihood: number | null;
  primary_size: number | null;
  primary_sectors: string | null; // JSON array
  primary_description: string | null;

  // 次要问题
  secondary_enabled: boolean;
  secondary_type: string | null;
  secondary_likelihood: number | null;
  secondary_size: number | null;
  secondary_sectors: string | null; // JSON array
  secondary_description: string | null;

  // 观测和摘要
  snowpack_observation: string | null;
  activity_observation: string | null;
  summary: string | null;

  created_at: string;
  updated_at: string;
  published_at: string | null;
}

// 天气数据
export interface WeatherData {
  id: number;
  forecast_id: number;
  sky_condition: string | null;
  transport: string | null;
  temp_min: number | null;
  temp_max: number | null;
  wind_direction: string | null;
  wind_speed: string | null;
  hn24: number | null;
  hst: number | null;
  hs: number | null;
}

// 气象观测记录
export interface WeatherObservation {
  id: number;
  forecast_id: number;
  observation_date: string | null;
  recorder: string | null;
  temp_min: number | null;
  temp_max: number | null;
}

// 站点观测数据
export interface StationObservation {
  id: number;
  weather_observation_id: number;
  station_type: 'upper' | 'lower';
  elevation: number;
  observation_time: string | null;
  cloud_cover: string | null;
  precipitation: string | null;
  wind_direction: string | null;
  wind_speed: number | null;
  grain_size: number | null;
  surface_snow_type: string | null;
  temp_10cm: number | null;
  temp_surface: number | null;
  temp_air: number | null;
  blowing_snow: string | null;
  snow_depth: number | null;
  hst: number | null;
  h24: number | null;
}

// JWT Payload
export interface JwtPayload {
  userId: number;
  username: string;
  role: UserRole;
}

// 创建预报请求
export interface CreateForecastRequest {
  forecast_date: string;
  status?: ForecastStatus;

  danger_alp: number;
  danger_tl: number;
  danger_btl: number;
  trend_alp?: TrendDirection;
  trend_tl?: TrendDirection;
  trend_btl?: TrendDirection;

  primary_type?: string;
  primary_likelihood?: number;
  primary_size?: number;
  primary_sectors?: string[];
  primary_description?: string;

  secondary_enabled?: boolean;
  secondary_type?: string;
  secondary_likelihood?: number;
  secondary_size?: number;
  secondary_sectors?: string[];
  secondary_description?: string;

  snowpack_observation?: string;
  activity_observation?: string;
  summary?: string;

  // 天气数据
  weather?: {
    sky_condition?: string;
    transport?: string;
    temp_min?: number;
    temp_max?: number;
    wind_direction?: string;
    wind_speed?: string;
    hn24?: number;
    hst?: number;
    hs?: number;
  };

  // 气象观测
  weather_observation?: {
    observation_date?: string;
    recorder?: string;
    temp_min?: number;
    temp_max?: number;
    upper_station?: Omit<StationObservation, 'id' | 'weather_observation_id'>;
    lower_station?: Omit<StationObservation, 'id' | 'weather_observation_id'>;
  };
}

// 预报列表响应
export interface ForecastListItem {
  id: number;
  forecast_date: string;
  status: ForecastStatus;
  danger_alp: number;
  danger_tl: number;
  danger_btl: number;
  forecaster_name: string;
  created_at: string;
  published_at: string | null;
}

// 预报详情响应
export interface ForecastDetail extends Forecast {
  forecaster_name: string;
  weather: WeatherData | null;
  weather_observation: (WeatherObservation & {
    upper_station: StationObservation | null;
    lower_station: StationObservation | null;
  }) | null;
}

// 分页参数
export interface PaginationParams {
  page?: number;
  limit?: number;
  status?: ForecastStatus;
  startDate?: string;
  endDate?: string;
}

// 分页响应
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// API 响应
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

// 登录请求
export interface LoginRequest {
  username: string;
  password: string;
}

// 注册请求
export interface RegisterRequest {
  username: string;
  password: string;
  display_name: string;
  email?: string;
}

// 认证响应
export interface AuthResponse {
  user: SafeUser;
  token: string;
  refreshToken: string;
}

// ==================== 雪层观测相关类型 ====================

// 雪层观测基本信息
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

// 雪层数据
export interface SnowLayer {
  id: number;
  observation_id: number;
  start_depth: number | null;
  end_depth: number | null;
  hardness: string | null;
  crystal_type: string | null;
  grain_size: string | null;
  wetness: string | null;
  notes: string | null;
  hardness_top: number | null;
  hardness_bottom: number | null;
  sort_order: number;
}

// 温度测量点（独立于雪层）
export interface TemperaturePoint {
  id: number;
  observation_id: number;
  depth: number | null;
  temperature: number | null;
  sort_order: number;
}

// 稳定性测试
export interface StabilityTest {
  id: number;
  group_id: number;
  test_type: string | null;
  taps: string | null;
  result: string | null;
  quality: string | null;
  cut: string | null;
  length: string | null;
  propagation: string | null;
  score: string | null;
  notes: string | null;
  sort_order: number;
}

// 稳定性测试组
export interface StabilityTestGroup {
  id: number;
  observation_id: number;
  depth: number | null;
  weak_layer_type: string | null;
  weak_layer_grain_size: string | null;
  notes: string | null;
  sort_order: number;
  tests?: StabilityTest[];
}

// 观测照片
export interface ObservationPhoto {
  id: number;
  observation_id: number;
  name: string | null;
  file_path: string | null;
  sort_order: number;
  created_at: string;
}

// 观测详情（包含关联数据）
export interface ObservationDetail extends Observation {
  snow_layers?: SnowLayer[];
  temperature_points?: TemperaturePoint[];
  stability_test_groups?: StabilityTestGroup[];
  photos?: ObservationPhoto[];
}

// 创建观测请求
export interface CreateObservationRequest {
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

  snow_layers?: Array<{
    start_depth?: number;
    end_depth?: number;
    hardness?: string;
    crystal_type?: string;
    grain_size?: string;
    wetness?: string;
    notes?: string;
    hardness_top?: number;
    hardness_bottom?: number;
  }>;

  temperature_points?: Array<{
    depth?: number;
    temperature?: number;
  }>;

  stability_test_groups?: Array<{
    depth?: number;
    weak_layer_type?: string;
    weak_layer_grain_size?: string;
    notes?: string;
    tests?: Array<{
      test_type?: string;
      taps?: string;
      result?: string;
      quality?: string;
      cut?: string;
      length?: string;
      propagation?: string;
      score?: string;
      notes?: string;
    }>;
  }>;
}
