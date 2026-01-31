// 危险等级 1-5
export type DangerLevel = 1 | 2 | 3 | 4 | 5;

// 危险趋势
export type DangerTrend = 'steady' | 'rising' | 'falling';

// 危险等级配置
export interface DangerConfig {
  color: string;
  label: string;
  description: string;
  prob: string;
  cons: string;
}

// 趋势配置
export interface TrendConfig {
  text: string;
  color: string;
  background: string;
}
