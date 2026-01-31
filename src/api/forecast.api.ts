import { apiClient } from './client';

export interface ForecastListItem {
  id: number;
  forecast_date: string;
  status: 'draft' | 'published' | 'archived';
  danger_alp: number;
  danger_tl: number;
  danger_btl: number;
  forecaster_name: string;
  created_at: string;
  published_at: string | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ForecastDetail {
  id: number;
  forecast_date: string;
  forecaster_id: number;
  forecaster_name: string;
  status: 'draft' | 'published' | 'archived';

  danger_alp: number;
  danger_tl: number;
  danger_btl: number;
  trend_alp: string | null;
  trend_tl: string | null;
  trend_btl: string | null;

  primary_type: string | null;
  primary_likelihood: number | null;
  primary_size: number | null;
  primary_sectors: string | null;
  primary_description: string | null;

  secondary_enabled: boolean;
  secondary_type: string | null;
  secondary_likelihood: number | null;
  secondary_size: number | null;
  secondary_sectors: string | null;
  secondary_description: string | null;

  snowpack_observation: string | null;
  activity_observation: string | null;
  summary: string | null;

  created_at: string;
  updated_at: string;
  published_at: string | null;

  weather: {
    sky_condition: string | null;
    transport: string | null;
    temp_min: number | null;
    temp_max: number | null;
    wind_direction: string | null;
    wind_speed: string | null;
    hn24: number | null;
    hst: number | null;
    hs: number | null;
  } | null;

  weather_observation: {
    observation_date: string | null;
    recorder: string | null;
    temp_min: number | null;
    temp_max: number | null;
    upper_station: StationObservation | null;
    lower_station: StationObservation | null;
  } | null;
}

export interface StationObservation {
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

export interface CreateForecastRequest {
  forecast_date: string;
  status?: 'draft' | 'published';

  danger_alp: number;
  danger_tl: number;
  danger_btl: number;
  trend_alp?: string;
  trend_tl?: string;
  trend_btl?: string;

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

  weather_observation?: {
    observation_date?: string;
    recorder?: string;
    temp_min?: number;
    temp_max?: number;
    upper_station?: Omit<StationObservation, 'station_type'>;
    lower_station?: Omit<StationObservation, 'station_type'>;
  };
}

export interface ForecastListParams {
  page?: number;
  limit?: number;
  status?: 'draft' | 'published' | 'archived';
  startDate?: string;
  endDate?: string;
}

export const forecastApi = {
  async getList(params: ForecastListParams = {}) {
    const query = new URLSearchParams();
    if (params.page) query.set('page', params.page.toString());
    if (params.limit) query.set('limit', params.limit.toString());
    if (params.status) query.set('status', params.status);
    if (params.startDate) query.set('startDate', params.startDate);
    if (params.endDate) query.set('endDate', params.endDate);

    const queryStr = query.toString();
    return apiClient.get<PaginatedResponse<ForecastListItem>>(
      `/forecasts${queryStr ? `?${queryStr}` : ''}`
    );
  },

  async getById(id: number) {
    return apiClient.get<{ forecast: ForecastDetail }>(`/forecasts/${id}`);
  },

  async getLatest() {
    return apiClient.get<{ forecast: ForecastDetail }>('/forecasts/latest');
  },

  async create(data: CreateForecastRequest) {
    return apiClient.post<{ id: number }>('/forecasts', data);
  },

  async update(id: number, data: Partial<CreateForecastRequest>) {
    return apiClient.put<{ message: string }>(`/forecasts/${id}`, data);
  },

  async delete(id: number) {
    return apiClient.delete<{ message: string }>(`/forecasts/${id}`);
  },

  async publish(id: number) {
    return apiClient.post<{ message: string }>(`/forecasts/${id}/publish`);
  },
};
