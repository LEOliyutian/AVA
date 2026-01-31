import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { produce, enableMapSet } from 'immer';
import type {
  ForecastState,
  ElevationBand,
  DangerTrend,
  RoseSectorKey,
  AvalancheProblemType,
  LikelihoodLevel,
  SizeLevel,
  WeatherData,
  StationObservation,
} from '../types';

// 启用 immer 对 Map 和 Set 的支持
enableMapSet();

// 格式化今天的日期
function getTodayDate(): string {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

// 默认站点观测数据
const defaultUpperStation: StationObservation = {
  elevation: 2600,
  time: '10:36',
  cloudCover: 'FEW',
  precipitation: '无',
  windDirection: 'N',
  windSpeed: 2,
  grainSize: 1,
  surfaceSnowType: 'RG',
  temp10cm: -15.4,
  tempSurface: -14.5,
  tempAir: -13.2,
  blowingSnow: '无',
  snowDepth: 171,
};

const defaultLowerStation: StationObservation = {
  elevation: 1850,
  time: '10:14',
  cloudCover: 'FEW',
  precipitation: '无',
  windDirection: 'N',
  windSpeed: 2,
  grainSize: 1,
  surfaceSnowType: 'RG',
  temp10cm: -12.4,
  tempSurface: -13.8,
  tempAir: -11.2,
  blowingSnow: '无',
  snowDepth: 109,
  hst: 0,
  h24: 0,
};

// 初始状态
const initialState: ForecastState = {
  date: getTodayDate(),
  forecaster: '',
  trends: {
    alp: 'steady',
    tl: 'steady',
    btl: 'steady',
  },
  primaryProblem: {
    type: '风板雪崩 (Wind Slab)',
    likelihood: 4,
    size: 2,
    sectors: new Set(),
    description: '强西风在背风坡产生了敏感的风板。',
  },
  secondaryProblem: {
    type: '干松状雪崩 (Loose Dry)',
    likelihood: 2,
    size: 1,
    sectors: new Set(),
    description: '陡峭地形上有轻微的干雪流。',
  },
  secondaryEnabled: true,
  weather: {
    sky: '☀️ 晴朗 CLR',
    transport: '无风雪搬运 (None)',
    tempMin: -15,
    tempMax: -8,
    windDirection: '西 W',
    windSpeed: '中等风 Moderate (12-30km/h)',
    hn24: 15,
    hst: 30,
    hs: 145,
  },
  weatherObservation: {
    date: getTodayDate(),
    recorder: '',
    tempMin: -15,
    tempMax: -8,
    upperStation: { ...defaultUpperStation },
    lowerStation: { ...defaultLowerStation },
  },
  observations: {
    snowpack: '雪层总体结合良好，但在北坡 40cm 深处存在一层多面体雪晶。',
    activity: '观察到昨天在山脊附近的东北坡自然触发了两个 1.5 级的风板雪崩。',
  },
  summary: `专家点评 (Forecaster's Note):
当前并未出现全层不稳定性，但特定地形风险（Pocket Hazard）依然致命。需警惕长陡坡上的松状雪崩因卷入效应发展为 2级，建议在安全监护下谨慎通过。虽然 CT24 测试显示深层（30-50cm）的多面体弱层触发困难，但该层作为潜在的滑动面，在升温或新载荷下仍有重新激活的可能。地形选择上，应主动避开高山带陡峭的背风坡及地形陷阱，防范前期残留风板。`,
};

// Store 操作接口
interface ForecastActions {
  // 基本信息
  setDate: (date: string) => void;
  setForecaster: (name: string) => void;

  // 趋势
  setTrend: (band: ElevationBand, trend: DangerTrend) => void;

  // 主要问题
  setPrimaryType: (type: AvalancheProblemType) => void;
  setPrimaryLikelihood: (likelihood: LikelihoodLevel) => void;
  setPrimarySize: (size: SizeLevel) => void;
  togglePrimarySector: (sector: RoseSectorKey) => void;
  setPrimaryDescription: (description: string) => void;

  // 次要问题
  setSecondaryEnabled: (enabled: boolean) => void;
  setSecondaryType: (type: AvalancheProblemType) => void;
  setSecondaryLikelihood: (likelihood: LikelihoodLevel) => void;
  setSecondarySize: (size: SizeLevel) => void;
  toggleSecondarySector: (sector: RoseSectorKey) => void;
  setSecondaryDescription: (description: string) => void;

  // 天气预报摘要
  setWeather: <K extends keyof WeatherData>(key: K, value: WeatherData[K]) => void;

  // 气象观测
  setObservationDate: (date: string) => void;
  setObservationRecorder: (recorder: string) => void;
  setObservationTempMin: (temp: number) => void;
  setObservationTempMax: (temp: number) => void;
  setUpperStation: <K extends keyof StationObservation>(key: K, value: StationObservation[K]) => void;
  setLowerStation: <K extends keyof StationObservation>(key: K, value: StationObservation[K]) => void;

  // 观测
  setSnowpack: (text: string) => void;
  setActivity: (text: string) => void;

  // 摘要
  setSummary: (text: string) => void;

  // 重置
  reset: () => void;
}

type ForecastStore = ForecastState & ForecastActions;

// 自定义序列化器处理 Set 类型
interface SerializedSet {
  __type: 'Set';
  data: string[];
}

function isSerializedSet(value: unknown): value is SerializedSet {
  return (
    value !== null &&
    typeof value === 'object' &&
    '__type' in value &&
    (value as SerializedSet).__type === 'Set' &&
    'data' in value &&
    Array.isArray((value as SerializedSet).data)
  );
}

const storage = createJSONStorage<ForecastStore>(() => localStorage, {
  reviver: (_key, value) => {
    // 检测序列化的 Set 并还原
    if (isSerializedSet(value)) {
      return new Set(value.data);
    }
    return value;
  },
  replacer: (_key, value) => {
    // 将 Set 序列化为特殊格式
    if (value instanceof Set) {
      return { __type: 'Set', data: Array.from(value) };
    }
    return value;
  },
});

export const useForecastStore = create<ForecastStore>()(
  persist(
    (set) => ({
      ...initialState,

      // 基本信息
      setDate: (date) => set({ date }),
      setForecaster: (forecaster) => set({ forecaster }),

      // 趋势
      setTrend: (band, trend) =>
        set(
          produce((state: ForecastState) => {
            state.trends[band] = trend;
          })
        ),

      // 主要问题
      setPrimaryType: (type) =>
        set(
          produce((state: ForecastState) => {
            state.primaryProblem.type = type;
          })
        ),
      setPrimaryLikelihood: (likelihood) =>
        set(
          produce((state: ForecastState) => {
            state.primaryProblem.likelihood = likelihood;
          })
        ),
      setPrimarySize: (size) =>
        set(
          produce((state: ForecastState) => {
            state.primaryProblem.size = size;
          })
        ),
      togglePrimarySector: (sector) =>
        set(
          produce((state: ForecastState) => {
            if (state.primaryProblem.sectors.has(sector)) {
              state.primaryProblem.sectors.delete(sector);
            } else {
              state.primaryProblem.sectors.add(sector);
            }
          })
        ),
      setPrimaryDescription: (description) =>
        set(
          produce((state: ForecastState) => {
            state.primaryProblem.description = description;
          })
        ),

      // 次要问题
      setSecondaryEnabled: (enabled) => set({ secondaryEnabled: enabled }),
      setSecondaryType: (type) =>
        set(
          produce((state: ForecastState) => {
            state.secondaryProblem.type = type;
          })
        ),
      setSecondaryLikelihood: (likelihood) =>
        set(
          produce((state: ForecastState) => {
            state.secondaryProblem.likelihood = likelihood;
          })
        ),
      setSecondarySize: (size) =>
        set(
          produce((state: ForecastState) => {
            state.secondaryProblem.size = size;
          })
        ),
      toggleSecondarySector: (sector) =>
        set(
          produce((state: ForecastState) => {
            if (state.secondaryProblem.sectors.has(sector)) {
              state.secondaryProblem.sectors.delete(sector);
            } else {
              state.secondaryProblem.sectors.add(sector);
            }
          })
        ),
      setSecondaryDescription: (description) =>
        set(
          produce((state: ForecastState) => {
            state.secondaryProblem.description = description;
          })
        ),

      // 天气预报摘要
      setWeather: (key, value) =>
        set(
          produce((state: ForecastState) => {
            state.weather[key] = value;
          })
        ),

      // 气象观测
      setObservationDate: (date) =>
        set(
          produce((state: ForecastState) => {
            state.weatherObservation.date = date;
          })
        ),
      setObservationRecorder: (recorder) =>
        set(
          produce((state: ForecastState) => {
            state.weatherObservation.recorder = recorder;
          })
        ),
      setObservationTempMin: (temp) =>
        set(
          produce((state: ForecastState) => {
            state.weatherObservation.tempMin = temp;
          })
        ),
      setObservationTempMax: (temp) =>
        set(
          produce((state: ForecastState) => {
            state.weatherObservation.tempMax = temp;
          })
        ),
      setUpperStation: (key, value) =>
        set(
          produce((state: ForecastState) => {
            (state.weatherObservation.upperStation[key] as typeof value) = value;
          })
        ),
      setLowerStation: (key, value) =>
        set(
          produce((state: ForecastState) => {
            (state.weatherObservation.lowerStation[key] as typeof value) = value;
          })
        ),

      // 观测
      setSnowpack: (text) =>
        set(
          produce((state: ForecastState) => {
            state.observations.snowpack = text;
          })
        ),
      setActivity: (text) =>
        set(
          produce((state: ForecastState) => {
            state.observations.activity = text;
          })
        ),

      // 摘要
      setSummary: (summary) => set({ summary }),

      // 重置
      reset: () => set(initialState),
    }),
    {
      name: 'avalanche-forecast-storage',
      storage,
    }
  )
);
