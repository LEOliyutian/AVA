// 雪崩事件数据模型（参考 NAADS 标准）

export type AvalancheType = 'Slab' | 'Loose' | 'Cornice' | 'Unknown';

export type AvalancheTrigger =
  | 'Natural'
  | 'Skier'
  | 'Snowmobile'
  | 'Explosive'
  | 'Cornice Fall'
  | 'Unknown';

export type AvalancheSize =
  | 'D1' | 'D1.5' | 'D2' | 'D2.5'
  | 'D3' | 'D3.5' | 'D4' | 'D4.5' | 'D5';

export interface AvalancheEvent {
  id: number;
  latitude: number;
  longitude: number;
  elevation?: number;
  event_date: string;
  avalanche_type: AvalancheType;
  trigger: AvalancheTrigger;
  size: AvalancheSize;
  aspect?: string;
  slope_angle?: number;
  start_elevation?: number;
  vertical_fall?: number;
  width?: number;
  description?: string;
  photos?: string[];
  reported_by: string;
  created_at: string;
  updated_at: string;
}

// 雪崩规模等级颜色映射
export const AVALANCHE_SIZE_COLORS: Record<AvalancheSize, string> = {
  'D1':   '#5cb85c',
  'D1.5': '#8cc63f',
  'D2':   '#f0ad4e',
  'D2.5': '#f39c12',
  'D3':   '#ff9800',
  'D3.5': '#e67e22',
  'D4':   '#d9534f',
  'D4.5': '#c0392b',
  'D5':   '#292b2c',
};

// 雪崩类型选项
export const AVALANCHE_TYPE_OPTIONS: { value: AvalancheType; label: string }[] = [
  { value: 'Slab', label: '板状雪崩 Slab' },
  { value: 'Loose', label: '松散雪崩 Loose' },
  { value: 'Cornice', label: '雪檐崩塌 Cornice' },
  { value: 'Unknown', label: '未知 Unknown' },
];

// 触发方式选项
export const AVALANCHE_TRIGGER_OPTIONS: { value: AvalancheTrigger; label: string }[] = [
  { value: 'Natural', label: '自然触发 Natural' },
  { value: 'Skier', label: '滑雪者触发 Skier' },
  { value: 'Snowmobile', label: '雪地摩托触发 Snowmobile' },
  { value: 'Explosive', label: '爆破触发 Explosive' },
  { value: 'Cornice Fall', label: '雪檐坠落 Cornice Fall' },
  { value: 'Unknown', label: '未知 Unknown' },
];

// 规模等级选项
export const AVALANCHE_SIZE_OPTIONS: { value: AvalancheSize; label: string }[] = [
  { value: 'D1', label: 'D1 - 相对无害' },
  { value: 'D1.5', label: 'D1.5' },
  { value: 'D2', label: 'D2 - 可埋人' },
  { value: 'D2.5', label: 'D2.5' },
  { value: 'D3', label: 'D3 - 可埋车/毁建筑' },
  { value: 'D3.5', label: 'D3.5' },
  { value: 'D4', label: 'D4 - 可毁铁路/大型车辆' },
  { value: 'D4.5', label: 'D4.5' },
  { value: 'D5', label: 'D5 - 最大规模' },
];

// 朝向选项
export const ASPECT_OPTIONS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
