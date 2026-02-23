// 天空状况/云量
export type SkyCondition =
  | '☀️ 晴朗 CLR'
  | '🌤 少量云 FEW'
  | '⛅ 散云 SCT'
  | '☁️ 多云 BKN'
  | '☁️ 阴天 OVC'
  | '🌫 无法观测 X';

// 云量代码
export type CloudCover = 'CLR' | 'FEW' | 'SCT' | 'BKN' | 'OVC' | 'X';

// 风雪搬运
export type SnowTransport =
  | '无风雪搬运 (None)'
  | ' 轻度搬运 (Light)'
  | ' 中度搬运 (Moderate)'
  | ' 强烈搬运 (Intense)';

// 风向
export type WindDirection =
  | '北 N'
  | '东北 NE'
  | '东 E'
  | '东南 SE'
  | '南 S'
  | '西南 SW'
  | '西 W'
  | '西北 NW';

// 简化风向
export type WindDirectionSimple = 'N' | 'NE' | 'E' | 'SE' | 'S' | 'SW' | 'W' | 'NW';

// 风速
export type WindSpeed =
  | '平静 Calm (0-1km/h)'
  | '轻风 Light (1-12km/h)'
  | '中等风 Moderate (12-30km/h)'
  | '强风 Strong (30-50km/h)'
  | '极端风 Extreme (>50km/h)';

// 表面雪质类型 (International Classification)
export type SurfaceSnowType =
  | 'PP'  // Precipitation Particles 降水颗粒
  | 'DF'  // Decomposing and Fragmented 分解碎片
  | 'RG'  // Rounded Grains 圆粒雪
  | 'FC'  // Faceted Crystals 棱角晶
  | 'DH'  // Depth Hoar 深霜
  | 'SH'  // Surface Hoar 表面霜
  | 'MF'  // Melt Forms 融化形态
  | 'IF'  // Ice Formations 冰层
  | 'CR'  // Crust 硬壳;

// 降水类型
export type PrecipitationType =
  | '无 None'
  | '小雪 Light Snow'
  | '中雪 Moderate Snow'
  | '大雪 Heavy Snow'
  | '雨 Rain'
  | '雨夹雪 Sleet';

// 单个站点的气象观测数据
export interface StationObservation {
  id?: number;                // 站点ID（用于编辑）
  name: string;               // 站点名称/地点描述
  elevation: number;          // 海拔 (m)
  time: string;               // 观测时间 (如 "10:36")
  cloudCover: CloudCover;     // 云量
  precipitation: string;      // 降水情况
  windDirection: WindDirectionSimple; // 风向
  windSpeed: number;          // 风速 (km/h)
  grainSize: number;          // 粒径 (mm)
  surfaceSnowType: SurfaceSnowType; // 表面雪质
  temp10cm: number;           // 10cm雪深温度 (°C)
  tempSurface: number;        // 雪表温度 (°C)
  tempAir: number;            // 空气温度 (°C)
  blowingSnow: string;        // 风吹雪情况 (HIN)
  snowDepth: number;          // 雪深 HS (cm)
  hst?: number;               // 暴雪总量
  h24?: number;               // 24小时新雪
  hin?: number;               // 观测间隔新雪
  footPenetration?: number;   // 踏陷深度
}

// 气象观测记录（支持动态站点列表）
export interface WeatherObservation {
  date: string;               // 观测日期
  recorder: string;           // 记录员
  tempMin: number;            // 最低气温
  tempMax: number;            // 最高气温
  upperStation: StationObservation;
  lowerStation: StationObservation;
}

// 天气数据 (用于预报显示)
export interface WeatherData {
  sky: SkyCondition;
  transport: SnowTransport;
  tempMin: number;
  tempMax: number;
  windDirection: WindDirection;
  windSpeed: WindSpeed;
  hn24: number; // 24h新雪
  hst: number;  // 暴雪总量
  hs: number;   // 积雪总厚
}
