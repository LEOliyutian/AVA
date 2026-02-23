import type { StationEditorState } from '../../store/weather.store';
import type { CloudCover, WindDirectionSimple, SurfaceSnowType } from '../../types/weather.types';
import './StationSection.css';

interface StationSectionProps {
  station: StationEditorState;
  canDelete: boolean;
  onUpdate: <K extends keyof StationEditorState>(key: K, value: StationEditorState[K]) => void;
  onDelete: () => void;
}

// 云量选项
const CLOUD_COVER_OPTIONS: { value: CloudCover; label: string }[] = [
  { value: 'CLR', label: '☀️ 晴朗 CLR' },
  { value: 'FEW', label: '🌤 少云 FEW' },
  { value: 'SCT', label: '⛅ 散云 SCT' },
  { value: 'BKN', label: '☁️ 多云 BKN' },
  { value: 'OVC', label: '☁️ 阴天 OVC' },
  { value: 'X', label: '🌫 不可见 X' },
];

// 风向选项
const WIND_DIRECTION_OPTIONS: { value: WindDirectionSimple; label: string }[] = [
  { value: 'N', label: '北 N' },
  { value: 'NE', label: '东北 NE' },
  { value: 'E', label: '东 E' },
  { value: 'SE', label: '东南 SE' },
  { value: 'S', label: '南 S' },
  { value: 'SW', label: '西南 SW' },
  { value: 'W', label: '西 W' },
  { value: 'NW', label: '西北 NW' },
];

// 表面雪质类型选项
const SURFACE_SNOW_OPTIONS: { value: SurfaceSnowType; label: string }[] = [
  { value: 'PP', label: 'PP 降水颗粒' },
  { value: 'DF', label: 'DF 分解碎片' },
  { value: 'RG', label: 'RG 圆粒雪' },
  { value: 'FC', label: 'FC 棱角晶' },
  { value: 'DH', label: 'DH 深霜' },
  { value: 'SH', label: 'SH 表面霜' },
  { value: 'MF', label: 'MF 融化形态' },
  { value: 'IF', label: 'IF 冰层' },
  { value: 'CR', label: 'CR 硬壳' },
];

// 降水选项
const PRECIPITATION_OPTIONS = ['无', '小雪', '中雪', '大雪', '雨', '雨夹雪', '冻雨'];

// 风吹雪选项
const BLOWING_SNOW_OPTIONS = ['无', '轻度', '中度', '强烈'];

// 风速等级
function getWindScale(speed: number | ''): { label: string; labelEn: string } {
  if (speed === '' || speed <= 0) return { label: '平静', labelEn: 'Calm' };
  if (speed <= 1) return { label: '平静', labelEn: 'Calm' };
  if (speed <= 12) return { label: '轻风', labelEn: 'Light' };
  if (speed <= 30) return { label: '中等风', labelEn: 'Moderate' };
  if (speed <= 50) return { label: '强风', labelEn: 'Strong' };
  return { label: '极端风', labelEn: 'Extreme' };
}

export function StationSection({
  station,
  canDelete,
  onUpdate,
  onDelete,
}: StationSectionProps) {
  return (
    <div className="station-section">
      <div className="section-title-bar">
        <h3 className="section-title">
          观测站点
          {station.elevation && (
            <span className="elevation-badge">{station.elevation}m</span>
          )}
        </h3>
        {canDelete && (
          <button className="delete-station-btn" onClick={onDelete} title="删除此站点">
            ×
          </button>
        )}
      </div>

      <div className="station-card">
        {/* 站点基本信息 */}
        <div className="station-row">
          <div className="station-field wide">
            <label>站点名称/地点 <span className="required">*</span></label>
            <input
              type="text"
              value={station.name}
              onChange={(e) => onUpdate('name', e.target.value)}
              placeholder="如：山顶气象站、C1缆车站"
            />
          </div>
          <div className="station-field">
            <label>海拔 (m) <span className="required">*</span></label>
            <input
              type="number"
              value={station.elevation}
              onChange={(e) =>
                onUpdate('elevation', e.target.value === '' ? '' : Number(e.target.value))
              }
              placeholder="2600"
            />
          </div>
          <div className="station-field">
            <label>观测时间</label>
            <input
              type="time"
              value={station.time}
              onChange={(e) => onUpdate('time', e.target.value)}
            />
          </div>
        </div>

        <div className="section-divider">
          <span>天气状况</span>
        </div>

        {/* 天气状况 */}
        <div className="station-row">
          <div className="station-field">
            <label>云量</label>
            <select
              value={station.cloudCover}
              onChange={(e) => onUpdate('cloudCover', e.target.value as CloudCover)}
            >
              {CLOUD_COVER_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div className="station-field">
            <label>降水情况</label>
            <select
              value={station.precipitation}
              onChange={(e) => onUpdate('precipitation', e.target.value)}
            >
              <option value="">选择</option>
              {PRECIPITATION_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 风况 */}
        <div className="station-row">
          <div className="station-field">
            <label>风向</label>
            <select
              value={station.windDirection}
              onChange={(e) => onUpdate('windDirection', e.target.value as WindDirectionSimple)}
            >
              {WIND_DIRECTION_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div className="station-field">
            <label>风速 (km/h)</label>
            <input
              type="number"
              value={station.windSpeed}
              onChange={(e) =>
                onUpdate('windSpeed', e.target.value === '' ? '' : Number(e.target.value))
              }
              placeholder="0"
            />
            {station.windSpeed !== '' && (
              <span className="field-hint">{getWindScale(station.windSpeed).label} {getWindScale(station.windSpeed).labelEn}</span>
            )}
          </div>
          <div className="station-field">
            <label>风吹雪</label>
            <select
              value={station.blowingSnow}
              onChange={(e) => onUpdate('blowingSnow', e.target.value)}
            >
              <option value="">选择</option>
              {BLOWING_SNOW_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="section-divider">
          <span>雪面信息</span>
        </div>

        {/* 雪面信息 */}
        <div className="station-row">
          <div className="station-field">
            <label>表面雪质</label>
            <select
              value={station.surfaceSnowType}
              onChange={(e) => onUpdate('surfaceSnowType', e.target.value as SurfaceSnowType)}
            >
              {SURFACE_SNOW_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div className="station-field">
            <label>粒径 (mm)</label>
            <input
              type="number"
              step="0.1"
              value={station.grainSize}
              onChange={(e) =>
                onUpdate('grainSize', e.target.value === '' ? '' : Number(e.target.value))
              }
              placeholder="1.0"
            />
          </div>
        </div>

        <div className="section-divider">
          <span>温度</span>
        </div>

        {/* 温度数据 */}
        <div className="station-row">
          <div className="station-field">
            <label>空气温度 (°C)</label>
            <input
              type="number"
              step="0.1"
              value={station.tempAir}
              onChange={(e) =>
                onUpdate('tempAir', e.target.value === '' ? '' : Number(e.target.value))
              }
              placeholder="-5"
            />
          </div>
          <div className="station-field">
            <label>雪表温度 (°C)</label>
            <input
              type="number"
              step="0.1"
              value={station.tempSurface}
              onChange={(e) =>
                onUpdate('tempSurface', e.target.value === '' ? '' : Number(e.target.value))
              }
              placeholder="-8"
            />
          </div>
          <div className="station-field">
            <label>10cm雪温 (°C)</label>
            <input
              type="number"
              step="0.1"
              value={station.temp10cm}
              onChange={(e) =>
                onUpdate('temp10cm', e.target.value === '' ? '' : Number(e.target.value))
              }
              placeholder="-10"
            />
          </div>
        </div>

        <div className="section-divider">
          <span>雪深</span>
        </div>

        {/* 雪深数据 */}
        <div className="station-row">
          <div className="station-field">
            <label title="HS = Height of Snow (总雪深)">总雪深 HS (cm)</label>
            <input
              type="number"
              value={station.snowDepth}
              onChange={(e) =>
                onUpdate('snowDepth', e.target.value === '' ? '' : Number(e.target.value))
              }
              placeholder="150"
            />
          </div>
          <div className="station-field">
            <label title="HST = Height of Storm snow Total (暴雪总量)">暴雪总量 HST (cm)</label>
            <input
              type="number"
              value={station.hst}
              onChange={(e) =>
                onUpdate('hst', e.target.value === '' ? '' : Number(e.target.value))
              }
              placeholder="30"
            />
          </div>
          <div className="station-field">
            <label title="H24 = 24-hour New Snow (24小时新雪)">24h新雪 H24 (cm)</label>
            <input
              type="number"
              value={station.h24}
              onChange={(e) =>
                onUpdate('h24', e.target.value === '' ? '' : Number(e.target.value))
              }
              placeholder="15"
            />
          </div>
          <div className="station-field">
            <label title="HIN = Height of New snow Interval (观测间隔新雪)">间隔新雪 HIN (cm)</label>
            <input
              type="number"
              value={station.hin}
              onChange={(e) =>
                onUpdate('hin', e.target.value === '' ? '' : Number(e.target.value))
              }
              placeholder="5"
            />
          </div>
        </div>

        {/* 踏陷深度 */}
        <div className="station-row">
          <div className="station-field">
            <label title="Foot Penetration (踏陷深度)">踏陷深度 (cm)</label>
            <input
              type="number"
              value={station.footPenetration}
              onChange={(e) =>
                onUpdate('footPenetration', e.target.value === '' ? '' : Number(e.target.value))
              }
              placeholder="20"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
