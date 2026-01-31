// 雪层行数据（不含温度，温度单独记录）
// 深度：地表=0，往上递增，输入层顶深度，自动计算厚度
export interface LayerRow {
  id: number;
  topDepth: number | string;    // 层顶部深度（用户输入的分层数值）
  // 以下为自动计算的只读字段
  startDepth?: number;          // 层底部深度（较小值，靠近地表）
  endDepth?: number;            // 层顶部深度（较大值，靠近雪面）= topDepth
  thickness?: number;           // 层厚度（自动计算）
  hardness: string;
  type: string;                 // 晶型
  grainSize: string;
  wetness: string;
  notes: string;
  hardnessTop?: number;         // 图表拖动用
  hardnessBottom?: number;      // 图表拖动用
}

// 温度测量点（单独记录）
export interface TemperaturePoint {
  id: number;
  depth: number | string;       // 测量深度
  temperature: number | string; // 温度值
}

// 稳定性测试类型
export type TestType = 'CT' | 'ECT' | 'PST' | 'DTT' | 'RB' | '槽口测试';

// 测试中的单个反应/断裂记录（一个隔离柱测试可能在多个深度有反应）
export interface TestReaction {
  id: number;
  depth: number | string;       // 反应/断裂深度
  taps?: number | string;       // CT/ECT 敲击次数
  result?: string;              // 结果 (CTE/CTM/CTH/CTN 或 ECTP/ECTN/ECTX)
  quality?: string;             // 剪切质量 Q1/Q2/Q3
  weakLayerType?: string;       // 弱层晶型
  weakLayerGrainSize?: string;  // 弱层粒径
  notes?: string;
}

// 隔离柱测试（一个测试 = 一个隔离柱）
export interface IsolationColumnTest {
  id: number;
  type: TestType;
  // PST 特有字段
  columnLength?: number | string;  // 柱长 (cm)
  cut?: number | string;           // 切入长度 (cm)
  propagation?: string;            // 传播结果 END/ARR
  // RB 特有字段
  score?: string;                  // RB评分
  // 通用字段
  notes?: string;                  // 测试备注
  reactions: TestReaction[];       // 反应记录（可能多个深度）
}

// 稳定性测试状态（保留旧接口兼容）
export interface DepthTest {
  id: number;
  type: TestType;
  taps?: number | string;
  result?: string;
  quality?: string;
  cut?: number | string;
  length?: number | string;
  propagation?: string;
  score?: number | string;
  notes?: string;
}

export interface DepthGroup {
  id: number;
  depth: number | string;
  addType: TestType;
  tests: DepthTest[];
  weakLayerType: string;
  weakLayerGrainSize: string;
  notes: string;
}

export interface StabilityTestsState {
  groups: DepthGroup[];
}

// 观测信息
export interface ObservationInfo {
  recordId: string;
  locationDescription: string;
  observer: string;
  date: string;
  gpsCoordinates: string;
  elevation: string;
  slopeAspect: string;
  slopeAngle: string;
  totalSnowDepth: string;
  airTemperature: string;
  weather: string;
  bootPenetration: string;
  wind: string;
  blowingSnow: string;
}

// 配置常量
export const HARDNESS_OPTIONS = ['F', '4F', '1F', 'P', 'K', 'I'];
export const CRYSTAL_TYPE_OPTIONS = ['PP', 'DF', 'RG', 'FC', 'DH', 'SH', 'MF', 'CR'];
export const WETNESS_OPTIONS = ['D', 'M', 'W', 'V', 'S'];
export const TEST_TYPE_OPTIONS: TestType[] = ['CT', 'ECT', 'PST', 'DTT', 'RB', '槽口测试'];
export const SHEAR_QUALITY_OPTIONS = ['Q1', 'Q2', 'Q3'];
export const ECT_RESULT_OPTIONS = ['PV', 'ECTP', 'ECTN', 'ECTX'];
export const PST_PROPAGATION_OPTIONS = ['END', 'ARR'];

// 硬度颜色映射
export const HARDNESS_COLORS: Record<string, string> = {
  F: '#f5f5f5',
  '4F': '#e5e5e5',
  '1F': '#d5d5d5',
  P: '#dbeafe',
  K: '#bfdbfe',
  I: '#93c5fd',
};

// 晶型颜色映射
export const CRYSTAL_TYPE_COLORS: Record<string, string> = {
  PP: '#a5f3fc',
  DF: '#bae6fd',
  RG: '#c7d2fe',
  FC: '#fde68a',
  DH: '#fca5a5',
  SH: '#f9a8d4',
  MF: '#d9f99d',
  CR: '#e5e7eb',
};

// 硬度顺序和宽度映射
export const HARDNESS_ORDER = ['F', '4F', '1F', 'P', 'K', 'I'];
export const HARDNESS_STEP = 100 / HARDNESS_ORDER.length;
export const HARDNESS_WIDTH_MAP = Object.fromEntries(
  HARDNESS_ORDER.map((key, index) => [key, (index + 1) * HARDNESS_STEP])
);

// 获取硬度宽度
export function getHardnessWidth(key: string): number {
  return HARDNESS_WIDTH_MAP[key] ?? 50;
}

// 根据宽度获取硬度
export function getHardnessByWidth(width: number): string | null {
  const candidate = [...HARDNESS_ORDER]
    .sort((a, b) => getHardnessWidth(a) - getHardnessWidth(b))
    .filter((key) => width >= getHardnessWidth(key))
    .pop();
  return candidate ?? null;
}
