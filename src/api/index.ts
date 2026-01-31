export { apiClient } from './client';
export { authApi } from './auth.api';
export { forecastApi } from './forecast.api';
export { observationApi } from './observation.api';
export type { SafeUser, AuthResponse, LoginRequest, RegisterRequest } from './auth.api';
export type {
  ForecastListItem,
  ForecastDetail,
  CreateForecastRequest,
  ForecastListParams,
  PaginatedResponse,
} from './forecast.api';
export type {
  Observation,
  ObservationDetail,
  ObservationListItem,
  SnowLayer,
  StabilityTest,
  StabilityTestGroup,
  SaveObservationRequest,
} from './observation.api';

// API 响应类型
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
