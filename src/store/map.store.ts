import { create } from 'zustand';
import { avalancheEventApi } from '../api/avalanche-event.api';
import { observationApi } from '../api/observation.api';
import type { ObservationDetail } from '../api/observation.api';
import type { CreateAvalancheEventData } from '../api/avalanche-event.api';
import type { AvalancheEvent } from '../types/avalanche-event';

export interface SnowpitLocation {
  id: number;
  location?: string | null;
  observer?: string | null;
  date?: string | null;
  gps_coordinates?: string | null;
}

export type AnalysisLayer = 'none' | 'slope' | 'aspect' | 'avalanche-zone';
export type BaseMap = 'satellite' | 'winter';
export type EditMode = 'none' | 'add-event' | 'add-snowpit';

interface MapState {
  // 图层状态
  activeAnalysisLayer: AnalysisLayer;
  baseMap: BaseMap;
  showAvalancheEvents: boolean;
  showSnowPits: boolean;
  showSkiRuns: boolean;
  terrainExaggeration: number;

  // 数据
  avalancheEvents: AvalancheEvent[];
  snowpitLocations: SnowpitLocation[];
  isLoading: boolean;

  // 编辑状态
  editMode: EditMode;
  selectedEvent: AvalancheEvent | null;
  pendingCoordinate: { lat: number; lng: number; elevation?: number; slopeAngle?: number; aspect?: string } | null;

  // 雪坑详情
  selectedSnowpit: ObservationDetail | null;
  isLoadingSnowpit: boolean;

  // 地形查询信息（非编辑模式点击时显示）
  terrainInfo: {
    lat: number;
    lng: number;
    elevation: number;
    slope: number;
    aspect: number;
    aspectLabel: string;
    screenX: number;
    screenY: number;
  } | null;
}

interface MapActions {
  setActiveLayer: (layer: AnalysisLayer) => void;
  setBaseMap: (map: BaseMap) => void;
  toggleEventVisibility: () => void;
  toggleSnowPitVisibility: () => void;
  toggleSkiRunVisibility: () => void;
  setTerrainExaggeration: (value: number) => void;
  fetchEvents: (bbox?: string) => Promise<void>;
  createEvent: (event: CreateAvalancheEventData, photos: File[]) => Promise<boolean>;
  deleteEvent: (id: number) => Promise<boolean>;
  fetchSnowpits: () => Promise<void>;
  createSnowpit: (data: {
    lat: number;
    lng: number;
    elevation?: number;
    slopeAngle?: number;
    aspect?: string;
    locationName?: string;
    observer: string;
    date: string;
  }) => Promise<boolean>;
  setEditMode: (mode: EditMode) => void;
  setSelectedEvent: (event: AvalancheEvent | null) => void;
  setPendingCoordinate: (coord: { lat: number; lng: number; elevation?: number; slopeAngle?: number; aspect?: string } | null) => void;
  setSelectedSnowpit: (obs: ObservationDetail | null) => void;
  fetchSnowpitDetail: (id: number) => Promise<void>;
  setTerrainInfo: (info: MapState['terrainInfo']) => void;
}

export type MapStore = MapState & MapActions;

export const useMapStore = create<MapStore>((set, get) => ({
  // 初始状态
  activeAnalysisLayer: 'none',
  baseMap: 'satellite',
  showAvalancheEvents: true,
  showSnowPits: true,
  showSkiRuns: true,
  terrainExaggeration: 1.0,
  avalancheEvents: [],
  snowpitLocations: [],
  isLoading: false,
  editMode: 'none',
  selectedEvent: null,
  selectedSnowpit: null,
  isLoadingSnowpit: false,
  pendingCoordinate: null,
  terrainInfo: null,

  setActiveLayer: (layer) => set({ activeAnalysisLayer: layer }),

  setBaseMap: (map) => set({ baseMap: map }),

  toggleEventVisibility: () =>
    set((s) => ({ showAvalancheEvents: !s.showAvalancheEvents })),

  toggleSnowPitVisibility: () =>
    set((s) => ({ showSnowPits: !s.showSnowPits })),

  toggleSkiRunVisibility: () =>
    set((s) => ({ showSkiRuns: !s.showSkiRuns })),

  setTerrainExaggeration: (value) => set({ terrainExaggeration: value }),

  fetchEvents: async (bbox) => {
    set({ isLoading: true });
    const result = await avalancheEventApi.getList(bbox ? { bbox } : undefined);
    if (result.success && result.data) {
      set({ avalancheEvents: result.data.events, isLoading: false });
    } else {
      set({ isLoading: false });
    }
  },

  createEvent: async (event, photos) => {
    const result = await avalancheEventApi.create(event, photos);
    if (result.success) {
      // 重新加载事件列表
      await get().fetchEvents();
      return true;
    }
    return false;
  },

  deleteEvent: async (id) => {
    const result = await avalancheEventApi.delete(id);
    if (result.success) {
      set((s) => ({
        avalancheEvents: s.avalancheEvents.filter((e) => e.id !== id),
        selectedEvent:
          s.selectedEvent?.id === id ? null : s.selectedEvent,
      }));
      return true;
    }
    return false;
  },

  fetchSnowpits: async () => {
    const result = await observationApi.getList({ limit: 200 });
    if (result.success && result.data) {
      const locations: SnowpitLocation[] = result.data.observations
        .filter((obs) => obs.gps_coordinates)
        .map((obs) => ({
          id: obs.id,
          location: obs.location_description,
          observer: obs.observer_name || obs.observer,
          date: obs.observation_date,
          gps_coordinates: obs.gps_coordinates,
        }));
      set({ snowpitLocations: locations });
    }
  },

  createSnowpit: async (data) => {
    const gps = `${data.lat.toFixed(6)},${data.lng.toFixed(6)}`;
    const result = await observationApi.create({
      gps_coordinates: gps,
      elevation: data.elevation != null ? String(Math.round(data.elevation)) : undefined,
      slope_angle: data.slopeAngle != null ? String(Math.round(data.slopeAngle)) : undefined,
      slope_aspect: data.aspect || undefined,
      location_description: data.locationName || undefined,
      observer: data.observer,
      observation_date: data.date,
    });
    if (result.success) {
      await get().fetchSnowpits();
      return true;
    }
    return false;
  },

  setEditMode: (mode) =>
    set({
      editMode: mode,
      selectedEvent: mode === 'none' ? null : undefined,
      pendingCoordinate: mode === 'none' ? null : undefined,
      selectedSnowpit: mode !== 'none' ? null : undefined,
    }),

  setSelectedEvent: (event) => set({ selectedEvent: event }),

  setPendingCoordinate: (coord) => set({ pendingCoordinate: coord }),

  setSelectedSnowpit: (obs) => set({ selectedSnowpit: obs }),

  fetchSnowpitDetail: async (id) => {
    set({ isLoadingSnowpit: true });
    const result = await observationApi.getById(id);
    if (result.success && result.data) {
      set({ selectedSnowpit: result.data.observation, isLoadingSnowpit: false });
    } else {
      set({ isLoadingSnowpit: false });
    }
  },

  setTerrainInfo: (info) => set({ terrainInfo: info }),
}));
