import { create } from 'zustand';
import { produce } from 'immer';
import type {
  LayerRow,
  DepthGroup,
  ObservationInfo,
  TestType,
  DepthTest,
  TemperaturePoint,
} from '../types/observation';
import {
  observationApi,
  type ObservationListItem,
  type ObservationDetail,
  type SaveObservationRequest,
  type SnowLayer,
  type StabilityTestGroup,
} from '../api/observation.api';

// 分页信息
interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// 观测记录编辑状态
export interface ObservationEditorState {
  // 基本信息
  info: ObservationInfo;
  // 雪层剖面
  layerRows: LayerRow[];
  // 温度剖面（独立测量）
  temperaturePoints: TemperaturePoint[];
  // 稳定性测试
  stabilityGroups: DepthGroup[];
  // 结论
  conclusion: string;
  // 图表配置
  diagramXAxisSide: 'left' | 'right';
  diagramYAxisDirection: 'up' | 'down';
}

// Store 状态
interface ObservationStoreState {
  // 列表状态
  observations: ObservationListItem[];
  pagination: Pagination;
  isListLoading: boolean;
  listError: string | null;

  // 编辑状态
  currentId: number | null;
  editor: ObservationEditorState;
  isEditorLoading: boolean;
  isSaving: boolean;
  editorError: string | null;
  isDirty: boolean;
}

// 默认编辑状态
const defaultEditorState: ObservationEditorState = {
  info: {
    recordId: '',
    locationDescription: '',
    observer: '',
    date: new Date().toISOString().split('T')[0],
    gpsCoordinates: '',
    elevation: '',
    slopeAspect: '',
    slopeAngle: '',
    totalSnowDepth: '',
    airTemperature: '',
    weather: '',
    bootPenetration: '',
    wind: '',
    blowingSnow: '',
  },
  layerRows: [],
  temperaturePoints: [],
  stabilityGroups: [],
  conclusion: '',
  diagramXAxisSide: 'left',
  diagramYAxisDirection: 'up',
};

// Store 操作
interface ObservationStoreActions {
  // 列表操作
  fetchList: (params?: { page?: number; limit?: number; myOnly?: boolean }) => Promise<void>;

  // 编辑器操作
  loadObservation: (id: number) => Promise<void>;
  resetEditor: () => void;
  setCurrentId: (id: number | null) => void;

  // 基本信息操作
  setInfo: <K extends keyof ObservationInfo>(key: K, value: ObservationInfo[K]) => void;

  // 雪层操作
  setLayerRows: (rows: LayerRow[]) => void;
  addLayer: () => void;
  removeLayer: (id: number) => void;
  updateLayer: <K extends keyof LayerRow>(id: number, key: K, value: LayerRow[K]) => void;

  // 温度剖面操作
  setTemperaturePoints: (points: TemperaturePoint[]) => void;

  // 稳定性测试操作
  setStabilityGroups: (groups: DepthGroup[]) => void;
  addStabilityGroup: () => void;
  removeStabilityGroup: (id: number) => void;
  updateStabilityGroup: <K extends keyof DepthGroup>(
    id: number,
    key: K,
    value: DepthGroup[K]
  ) => void;
  addTestToGroup: (groupId: number) => void;
  removeTestFromGroup: (groupId: number, testId: number) => void;
  updateTest: <K extends keyof DepthTest>(
    groupId: number,
    testId: number,
    key: K,
    value: DepthTest[K]
  ) => void;

  // 其他
  setConclusion: (text: string) => void;
  setDiagramXAxisSide: (side: 'left' | 'right') => void;
  setDiagramYAxisDirection: (dir: 'up' | 'down') => void;

  // 保存
  save: () => Promise<{ success: boolean; id?: number; error?: string }>;

  // 删除
  deleteObservation: (id: number) => Promise<{ success: boolean; error?: string }>;
}

type ObservationStore = ObservationStoreState & ObservationStoreActions;

// 辅助函数：将 API 数据转换为编辑器状态
function apiToEditorState(data: ObservationDetail): ObservationEditorState {
  return {
    info: {
      recordId: data.record_id || '',
      locationDescription: data.location_description || '',
      observer: data.observer || '',
      date: data.observation_date || new Date().toISOString().split('T')[0],
      gpsCoordinates: data.gps_coordinates || '',
      elevation: data.elevation || '',
      slopeAspect: data.slope_aspect || '',
      slopeAngle: data.slope_angle || '',
      totalSnowDepth: data.total_snow_depth || '',
      airTemperature: data.air_temperature || '',
      weather: data.weather || '',
      bootPenetration: data.boot_penetration || '',
      wind: data.wind || '',
      blowingSnow: data.blowing_snow || '',
    },
    layerRows: (data.snow_layers || []).map((layer, index) => {
      // 使用 end_depth 作为 topDepth（层顶深度）
      return {
        id: layer.id || index + 1,
        topDepth: layer.end_depth ?? '',
        hardness: layer.hardness || 'F',
        type: layer.crystal_type || 'PP',
        grainSize: layer.grain_size || '',
        wetness: layer.wetness || 'D',
        notes: layer.notes || '',
        hardnessTop: layer.hardness_top,
        hardnessBottom: layer.hardness_bottom,
      };
    }),
    temperaturePoints: (data.temperature_points || []).map((pt, index) => ({
      id: pt.id || index + 1,
      depth: pt.depth ?? '',
      temperature: pt.temperature ?? '',
    })),
    stabilityGroups: (data.stability_test_groups || []).map((group, gIndex) => ({
      id: group.id || gIndex + 1,
      depth: group.depth ?? '',
      addType: 'CT' as TestType,
      weakLayerType: group.weak_layer_type || '',
      weakLayerGrainSize: group.weak_layer_grain_size || '',
      notes: group.notes || '',
      tests: (group.tests || []).map((test, tIndex) => ({
        id: test.id || tIndex + 1,
        type: (test.test_type || 'CT') as TestType,
        taps: test.taps || '',
        result: test.result || '',
        quality: test.quality || '',
        cut: test.cut || '',
        length: test.length || '',
        propagation: test.propagation || '',
        score: test.score || '',
        notes: test.notes || '',
      })),
    })),
    conclusion: data.conclusion || '',
    diagramXAxisSide: data.diagram_x_axis_side || 'left',
    diagramYAxisDirection: data.diagram_y_axis_direction || 'down',
  };
}

// 辅助函数：将编辑器状态转换为 API 请求
function editorStateToApi(state: ObservationEditorState): SaveObservationRequest {
  return {
    record_id: state.info.recordId || undefined,
    location_description: state.info.locationDescription || undefined,
    observer: state.info.observer || '测试用户',
    observation_date: state.info.date || new Date().toISOString().split('T')[0],
    gps_coordinates: state.info.gpsCoordinates || undefined,
    elevation: state.info.elevation || undefined,
    slope_aspect: state.info.slopeAspect || undefined,
    slope_angle: state.info.slopeAngle || undefined,
    total_snow_depth: state.info.totalSnowDepth || undefined,
    air_temperature: state.info.airTemperature || undefined,
    weather: state.info.weather || undefined,
    boot_penetration: state.info.bootPenetration || undefined,
    wind: state.info.wind || undefined,
    blowing_snow: state.info.blowingSnow || undefined,
    conclusion: state.conclusion || undefined,
    diagram_x_axis_side: state.diagramXAxisSide,
    diagram_y_axis_direction: state.diagramYAxisDirection,
    snow_layers: state.layerRows.length > 0 ? (() => {
      // 获取总雪深
      const totalHS = Number(state.info.totalSnowDepth) || 0;

      // 按 topDepth 降序排序（从雪面往下）
      const sorted = [...state.layerRows].sort((a, b) => {
        const aTop = Number(a.topDepth) || 0;
        const bTop = Number(b.topDepth) || 0;
        return bTop - aTop; // 降序
      });

      // 计算最大输入值作为起点
      const maxInput = sorted.length > 0 ? Math.max(...sorted.map(r => Number(r.topDepth) || 0)) : 0;
      let previousBottom = totalHS > 0 ? totalHS : maxInput;

      return sorted.map((row): SnowLayer => {
        const bottomDepth = Number(row.topDepth) || 0; // 用户输入的是层底高度
        const startDepth = bottomDepth;
        const endDepth = previousBottom;
        const thickness = endDepth - startDepth;
        previousBottom = bottomDepth;
        return {
          thickness: thickness > 0 ? thickness : null,
          start_depth: startDepth,
          end_depth: endDepth,
          hardness: row.hardness,
          crystal_type: row.type,
          grain_size: row.grainSize,
          wetness: row.wetness,
          notes: row.notes,
          hardness_top: row.hardnessTop,
          hardness_bottom: row.hardnessBottom,
        };
      });
    })() : undefined,
    temperature_points: state.temperaturePoints.length > 0 ? state.temperaturePoints.map((pt) => ({
      depth: pt.depth === '' ? null : Number(pt.depth),
      temperature: pt.temperature === '' ? null : Number(pt.temperature),
    })) : undefined,
    stability_test_groups: state.stabilityGroups.length > 0 ? state.stabilityGroups.map((group): StabilityTestGroup => ({
      depth: group.depth === '' ? null : Number(group.depth),
      weak_layer_type: group.weakLayerType,
      weak_layer_grain_size: group.weakLayerGrainSize,
      notes: group.notes,
      tests: group.tests.map((test) => ({
        test_type: test.type,
        taps: test.taps ? String(test.taps) : undefined,
        result: test.result || undefined,
        quality: test.quality || undefined,
        cut: test.cut ? String(test.cut) : undefined,
        length: test.length ? String(test.length) : undefined,
        propagation: test.propagation || undefined,
        score: test.score ? String(test.score) : undefined,
        notes: test.notes || undefined,
      })),
    })) : undefined,
  };
}

// 创建 Store
export const useObservationStore = create<ObservationStore>((set, get) => ({
  // 初始状态
  observations: [],
  pagination: { page: 1, limit: 20, total: 0, totalPages: 0 },
  isListLoading: false,
  listError: null,

  currentId: null,
  editor: { ...defaultEditorState },
  isEditorLoading: false,
  isSaving: false,
  editorError: null,
  isDirty: false,

  // 列表操作
  fetchList: async (params) => {
    set({ isListLoading: true, listError: null });
    const result = await observationApi.getList(params);
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
    const result = await observationApi.getById(id);
    if (result.success && result.data) {
      set({
        editor: apiToEditorState(result.data.observation),
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
      editor: { ...defaultEditorState },
      editorError: null,
      isDirty: false,
    });
  },

  setCurrentId: (id) => set({ currentId: id }),

  // 基本信息操作
  setInfo: (key, value) =>
    set(
      produce((state: ObservationStoreState) => {
        state.editor.info[key] = value;
        state.isDirty = true;
      })
    ),

  // 雪层操作
  setLayerRows: (rows) =>
    set(
      produce((state: ObservationStoreState) => {
        state.editor.layerRows = rows;
        state.isDirty = true;
      })
    ),

  addLayer: () =>
    set(
      produce((state: ObservationStoreState) => {
        const rows = state.editor.layerRows;
        const nextId = Math.max(0, ...rows.map((r) => r.id)) + 1;
        rows.push({
          id: nextId,
          topDepth: '',
          hardness: 'F',
          type: 'PP',
          grainSize: '',
          wetness: 'D',
          notes: '',
        });
        state.isDirty = true;
      })
    ),

  removeLayer: (id) =>
    set(
      produce((state: ObservationStoreState) => {
        state.editor.layerRows = state.editor.layerRows.filter((r) => r.id !== id);
        state.isDirty = true;
      })
    ),

  updateLayer: (id, key, value) =>
    set(
      produce((state: ObservationStoreState) => {
        const row = state.editor.layerRows.find((r) => r.id === id);
        if (row) {
          (row[key] as typeof value) = value;
          // 如果硬度改变，重置宽度
          if (key === 'hardness') {
            delete row.hardnessTop;
            delete row.hardnessBottom;
          }
        }
        state.isDirty = true;
      })
    ),

  // 温度剖面操作
  setTemperaturePoints: (points) =>
    set(
      produce((state: ObservationStoreState) => {
        state.editor.temperaturePoints = points;
        state.isDirty = true;
      })
    ),

  // 稳定性测试操作
  setStabilityGroups: (groups) =>
    set(
      produce((state: ObservationStoreState) => {
        state.editor.stabilityGroups = groups;
        state.isDirty = true;
      })
    ),

  addStabilityGroup: () =>
    set(
      produce((state: ObservationStoreState) => {
        const groups = state.editor.stabilityGroups;
        const nextId = Math.max(0, ...groups.map((g) => g.id)) + 1;
        groups.push({
          id: nextId,
          depth: '',
          addType: 'CT',
          weakLayerType: '',
          weakLayerGrainSize: '',
          notes: '',
          tests: [],
        });
        state.isDirty = true;
      })
    ),

  removeStabilityGroup: (id) =>
    set(
      produce((state: ObservationStoreState) => {
        state.editor.stabilityGroups = state.editor.stabilityGroups.filter(
          (g) => g.id !== id
        );
        state.isDirty = true;
      })
    ),

  updateStabilityGroup: (id, key, value) =>
    set(
      produce((state: ObservationStoreState) => {
        const group = state.editor.stabilityGroups.find((g) => g.id === id);
        if (group) {
          (group[key] as typeof value) = value;
        }
        state.isDirty = true;
      })
    ),

  addTestToGroup: (groupId) =>
    set(
      produce((state: ObservationStoreState) => {
        const group = state.editor.stabilityGroups.find((g) => g.id === groupId);
        if (group) {
          const nextId = Math.max(0, ...group.tests.map((t) => t.id)) + 1;
          group.tests.push({
            id: nextId,
            type: group.addType,
            taps: '',
            result: '',
            quality: '',
            cut: '',
            length: '',
            propagation: '',
            score: '',
            notes: '',
          });
        }
        state.isDirty = true;
      })
    ),

  removeTestFromGroup: (groupId, testId) =>
    set(
      produce((state: ObservationStoreState) => {
        const group = state.editor.stabilityGroups.find((g) => g.id === groupId);
        if (group) {
          group.tests = group.tests.filter((t) => t.id !== testId);
        }
        state.isDirty = true;
      })
    ),

  updateTest: (groupId, testId, key, value) =>
    set(
      produce((state: ObservationStoreState) => {
        const group = state.editor.stabilityGroups.find((g) => g.id === groupId);
        if (group) {
          const test = group.tests.find((t) => t.id === testId);
          if (test) {
            (test[key] as typeof value) = value;
          }
        }
        state.isDirty = true;
      })
    ),

  // 其他
  setConclusion: (text) =>
    set(
      produce((state: ObservationStoreState) => {
        state.editor.conclusion = text;
        state.isDirty = true;
      })
    ),

  setDiagramXAxisSide: (side) =>
    set(
      produce((state: ObservationStoreState) => {
        state.editor.diagramXAxisSide = side;
        state.isDirty = true;
      })
    ),

  setDiagramYAxisDirection: (dir) =>
    set(
      produce((state: ObservationStoreState) => {
        state.editor.diagramYAxisDirection = dir;
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
        result = await observationApi.update(state.currentId, data);
      } else {
        result = await observationApi.create(data);
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
    const result = await observationApi.delete(id);
    if (result.success) {
      // 刷新列表
      get().fetchList();
      return { success: true };
    }
    return { success: false, error: result.error };
  },
}));
