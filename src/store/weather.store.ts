import { create } from 'zustand';
import { produce } from 'immer';
import type {
  CloudCover,
  WindDirectionSimple,
  SurfaceSnowType,
} from '../types/weather.types';
import {
  weatherApi,
  type WeatherObservationListItem,
  type WeatherObservationDetail,
  type SaveWeatherObservationRequest,
  type StationObservationApi,
} from '../api/weather.api';

// 分页信息
interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// 编辑器中的站点状态
export interface StationEditorState {
  id: number; // 本地编辑器ID
  name: string;
  elevation: number | '';
  time: string;
  cloudCover: CloudCover;
  precipitation: string;
  windDirection: WindDirectionSimple;
  windSpeed: number | '';
  grainSize: number | '';
  surfaceSnowType: SurfaceSnowType;
  temp10cm: number | '';
  tempSurface: number | '';
  tempAir: number | '';
  blowingSnow: string;
  snowDepth: number | '';
  hst: number | '';
  h24: number | '';
}

// 气象观测编辑器状态
export interface WeatherEditorState {
  date: string;
  recorder: string;
  tempMin: number | '';
  tempMax: number | '';
  stations: StationEditorState[];
}

// Store 状态
interface WeatherStoreState {
  // 列表状态
  observations: WeatherObservationListItem[];
  pagination: Pagination;
  isListLoading: boolean;
  listError: string | null;

  // 编辑器状态
  currentId: number | null;
  editor: WeatherEditorState;
  isEditorLoading: boolean;
  isSaving: boolean;
  editorError: string | null;
  isDirty: boolean;
}

// 创建默认站点
function createDefaultStation(id: number): StationEditorState {
  return {
    id,
    name: '',
    elevation: '',
    time: '',
    cloudCover: 'CLR',
    precipitation: '',
    windDirection: 'N',
    windSpeed: '',
    grainSize: '',
    surfaceSnowType: 'PP',
    temp10cm: '',
    tempSurface: '',
    tempAir: '',
    blowingSnow: '',
    snowDepth: '',
    hst: '',
    h24: '',
  };
}

// 默认编辑器状态
const defaultEditorState: WeatherEditorState = {
  date: new Date().toISOString().split('T')[0],
  recorder: '',
  tempMin: '',
  tempMax: '',
  stations: [createDefaultStation(1)],
};

// Store 操作
interface WeatherStoreActions {
  // 列表操作
  fetchList: (params?: { page?: number; limit?: number }) => Promise<void>;

  // 编辑器操作
  loadObservation: (id: number) => Promise<void>;
  resetEditor: () => void;
  setCurrentId: (id: number | null) => void;

  // 基本信息操作
  setDate: (date: string) => void;
  setRecorder: (recorder: string) => void;
  setTempMin: (temp: number | '') => void;
  setTempMax: (temp: number | '') => void;

  // 站点操作
  addStation: () => void;
  removeStation: (stationId: number) => void;
  updateStation: <K extends keyof StationEditorState>(
    stationId: number,
    key: K,
    value: StationEditorState[K]
  ) => void;

  // 保存
  save: () => Promise<{ success: boolean; id?: number; error?: string }>;

  // 删除
  deleteObservation: (id: number) => Promise<{ success: boolean; error?: string }>;
}

type WeatherStore = WeatherStoreState & WeatherStoreActions;

// 辅助函数：将 API 数据转换为编辑器状态
function apiToEditorState(data: WeatherObservationDetail): WeatherEditorState {
  return {
    date: data.date || new Date().toISOString().split('T')[0],
    recorder: data.recorder || '',
    tempMin: data.temp_min ?? '',
    tempMax: data.temp_max ?? '',
    stations: (data.stations || []).map((s, index) => ({
      id: s.id || index + 1,
      name: s.name || '',
      elevation: s.elevation ?? '',
      time: s.time || '',
      cloudCover: s.cloud_cover || 'CLR',
      precipitation: s.precipitation || '',
      windDirection: s.wind_direction || 'N',
      windSpeed: s.wind_speed ?? '',
      grainSize: s.grain_size ?? '',
      surfaceSnowType: s.surface_snow_type || 'PP',
      temp10cm: s.temp_10cm ?? '',
      tempSurface: s.temp_surface ?? '',
      tempAir: s.temp_air ?? '',
      blowingSnow: s.blowing_snow || '',
      snowDepth: s.snow_depth ?? '',
      hst: s.hst ?? '',
      h24: s.h24 ?? '',
    })),
  };
}

// 辅助函数：将编辑器状态转换为 API 请求
function editorStateToApi(state: WeatherEditorState): SaveWeatherObservationRequest {
  return {
    date: state.date,
    recorder: state.recorder || '未知',
    temp_min: state.tempMin === '' ? 0 : state.tempMin,
    temp_max: state.tempMax === '' ? 0 : state.tempMax,
    stations: state.stations.map((s): StationObservationApi => ({
      name: s.name || '未命名站点',
      elevation: s.elevation === '' ? 0 : s.elevation,
      time: s.time,
      cloud_cover: s.cloudCover,
      precipitation: s.precipitation,
      wind_direction: s.windDirection,
      wind_speed: s.windSpeed === '' ? 0 : s.windSpeed,
      grain_size: s.grainSize === '' ? 0 : s.grainSize,
      surface_snow_type: s.surfaceSnowType,
      temp_10cm: s.temp10cm === '' ? 0 : s.temp10cm,
      temp_surface: s.tempSurface === '' ? 0 : s.tempSurface,
      temp_air: s.tempAir === '' ? 0 : s.tempAir,
      blowing_snow: s.blowingSnow,
      snow_depth: s.snowDepth === '' ? 0 : s.snowDepth,
      hst: s.hst === '' ? undefined : s.hst,
      h24: s.h24 === '' ? undefined : s.h24,
    })),
  };
}

// 创建 Store
export const useWeatherStore = create<WeatherStore>((set, get) => ({
  // 初始状态
  observations: [],
  pagination: { page: 1, limit: 20, total: 0, totalPages: 0 },
  isListLoading: false,
  listError: null,

  currentId: null,
  editor: { ...defaultEditorState, stations: [createDefaultStation(1)] },
  isEditorLoading: false,
  isSaving: false,
  editorError: null,
  isDirty: false,

  // 列表操作
  fetchList: async (params) => {
    set({ isListLoading: true, listError: null });
    const result = await weatherApi.getList(params);
    if (result.success && result.data) {
      set({
        observations: result.data.observations,
        pagination: result.data.pagination,
        isListLoading: false,
      });
    } else {
      set({ listError: result.error || '获取列表失败', isListLoading: false });
    }
  },

  // 编辑器操作
  loadObservation: async (id) => {
    set({ isEditorLoading: true, editorError: null, currentId: id });
    const result = await weatherApi.getById(id);
    if (result.success && result.data) {
      const editorState = apiToEditorState(result.data.observation);
      // 确保至少有一个站点
      if (editorState.stations.length === 0) {
        editorState.stations = [createDefaultStation(1)];
      }
      set({
        editor: editorState,
        isEditorLoading: false,
        isDirty: false,
      });
    } else {
      set({ editorError: result.error || '加载失败', isEditorLoading: false });
    }
  },

  resetEditor: () => {
    set({
      currentId: null,
      editor: {
        ...defaultEditorState,
        stations: [createDefaultStation(1)],
      },
      editorError: null,
      isDirty: false,
    });
  },

  setCurrentId: (id) => set({ currentId: id }),

  // 基本信息操作
  setDate: (date) =>
    set(
      produce((state: WeatherStoreState) => {
        state.editor.date = date;
        state.isDirty = true;
      })
    ),

  setRecorder: (recorder) =>
    set(
      produce((state: WeatherStoreState) => {
        state.editor.recorder = recorder;
        state.isDirty = true;
      })
    ),

  setTempMin: (temp) =>
    set(
      produce((state: WeatherStoreState) => {
        state.editor.tempMin = temp;
        state.isDirty = true;
      })
    ),

  setTempMax: (temp) =>
    set(
      produce((state: WeatherStoreState) => {
        state.editor.tempMax = temp;
        state.isDirty = true;
      })
    ),

  // 站点操作
  addStation: () =>
    set(
      produce((state: WeatherStoreState) => {
        const maxId = Math.max(0, ...state.editor.stations.map((s) => s.id));
        state.editor.stations.push(createDefaultStation(maxId + 1));
        state.isDirty = true;
      })
    ),

  removeStation: (stationId) =>
    set(
      produce((state: WeatherStoreState) => {
        state.editor.stations = state.editor.stations.filter((s) => s.id !== stationId);
        state.isDirty = true;
      })
    ),

  updateStation: (stationId, key, value) =>
    set(
      produce((state: WeatherStoreState) => {
        const station = state.editor.stations.find((s) => s.id === stationId);
        if (station) {
          (station[key] as typeof value) = value;
        }
        state.isDirty = true;
      })
    ),

  // 保存
  save: async () => {
    const state = get();
    set({ isSaving: true, editorError: null });

    const data = editorStateToApi(state.editor);
    let result;

    try {
      if (state.currentId) {
        result = await weatherApi.update(state.currentId, data);
      } else {
        result = await weatherApi.create(data);
      }

      if (result.success && result.data) {
        set({
          isSaving: false,
          isDirty: false,
          currentId: result.data.id,
        });
        return { success: true, id: result.data.id };
      } else {
        const errorMessage = result.error || '保存失败';
        set({ isSaving: false, editorError: errorMessage });
        return { success: false, error: errorMessage };
      }
    } catch (err) {
      const errorMessage = '保存过程中发生网络错误';
      set({ isSaving: false, editorError: errorMessage });
      return { success: false, error: errorMessage };
    }
  },

  // 删除
  deleteObservation: async (id) => {
    const result = await weatherApi.delete(id);
    if (result.success) {
      get().fetchList();
      return { success: true };
    }
    return { success: false, error: result.error };
  },
}));
