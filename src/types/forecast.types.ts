import type { DangerTrend } from './danger.types';
import type { AvalancheProblem } from './avalanche-problem.types';
import type { WeatherData, WeatherObservation } from './weather.types';

// 海拔带
export type ElevationBand = 'alp' | 'tl' | 'btl';

// 方位
export type Direction = 'N' | 'NE' | 'E' | 'SE' | 'S' | 'SW' | 'W' | 'NW';

// 风玫瑰扇区键
export type RoseSectorKey = `${ElevationBand}_${Direction}`;

// 预报状态
export interface ForecastState {
  // 基本信息
  date: string;
  forecaster: string;

  // 危险趋势
  trends: {
    alp: DangerTrend;
    tl: DangerTrend;
    btl: DangerTrend;
  };

  // 雪崩问题
  primaryProblem: AvalancheProblem;
  secondaryProblem: AvalancheProblem;
  secondaryEnabled: boolean;

  // 天气预报摘要
  weather: WeatherData;

  // 详细气象观测
  weatherObservation: WeatherObservation;

  // 观测
  observations: {
    snowpack: string;
    activity: string;
  };

  // 摘要
  summary: string;
}
