import { useForecastStore } from './forecast.store';
import { calculateRisk } from '../utils';
import type { DangerLevel, ElevationBand } from '../types';

/**
 * 获取计算后的危险等级
 */
export function useCalculatedRisks(): Record<ElevationBand, DangerLevel> {
  const primaryProblem = useForecastStore((state) => state.primaryProblem);
  const secondaryProblem = useForecastStore((state) => state.secondaryProblem);
  const secondaryEnabled = useForecastStore((state) => state.secondaryEnabled);

  return calculateRisk(primaryProblem, secondaryProblem, secondaryEnabled);
}

// 别名，供编辑器页面使用
export const useDangerLevels = useCalculatedRisks;

/**
 * 获取格式化的天空状况（中英对照）
 * 例如: "☀️ 晴朗 CLR" -> "晴朗 CLR"
 */
export function useSkyCode(): string {
  const sky = useForecastStore((state) => state.weather.sky);
  // 移除开头的 emoji，保留中英文
  return sky.replace(/^[^\u4e00-\u9fa5]+/, '').trim() || sky;
}

/**
 * 获取格式化的风雪搬运（中英对照）
 * 例如: "无风雪搬运 (None)" -> "无 None"
 */
export function useTransportCode(): string {
  const transport = useForecastStore((state) => state.weather.transport);
  // 提取中文部分和英文代码
  const chineseMatch = transport.match(/^[\s]*([\u4e00-\u9fa5]+)/);
  const englishMatch = transport.match(/\(([^)]+)\)/);
  const chinese = chineseMatch ? chineseMatch[1].charAt(0) : '';
  const english = englishMatch ? englishMatch[1] : '';
  return `${chinese} ${english}`.trim() || transport;
}

/**
 * 获取格式化的温度字符串
 */
export function useTempDisplay(): string {
  const tempMin = useForecastStore((state) => state.weather.tempMin);
  const tempMax = useForecastStore((state) => state.weather.tempMax);
  return `${tempMin}° / ${tempMax}°`;
}

/**
 * 获取格式化的风况字符串（中英对照）
 * 例如: "北 N" + "轻风 Light (1-12km/h)" -> "北 N @ 轻风 Light"
 */
export function useWindDisplay(): string {
  const direction = useForecastStore((state) => state.weather.windDirection);
  const speed = useForecastStore((state) => state.weather.windSpeed);

  // 风向保持原样 "北 N"
  const dirDisplay = direction;
  // 风速提取中文和英文部分 "轻风 Light"
  const speedMatch = speed.match(/^([\u4e00-\u9fa5]+)\s*(\w+)/);
  const speedDisplay = speedMatch ? `${speedMatch[1]} ${speedMatch[2]}` : speed.split(' ')[0];

  return `${dirDisplay} @ ${speedDisplay}`;
}
