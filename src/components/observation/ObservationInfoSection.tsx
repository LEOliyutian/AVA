import type { ObservationInfo } from '../../types/observation';
import './ObservationInfoSection.css';

interface ObservationInfoSectionProps {
  info: ObservationInfo;
  onChange: <K extends keyof ObservationInfo>(key: K, value: ObservationInfo[K]) => void;
}

// 坡向选项
const ASPECT_OPTIONS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW', '平坦'];

// 天气选项
const WEATHER_OPTIONS = [
  '晴朗 CLR',
  '少量云 FEW',
  '散云 SCT',
  '多云 BKN',
  '阴天 OVC',
  '降雪 SN',
  '降雨 RA',
  '雾 FG',
];

// 风力选项
const WIND_OPTIONS = [
  '无风 Calm',
  '微风 Light',
  '中等风 Moderate',
  '强风 Strong',
  '极端风 Extreme',
];

// 吹雪选项
const BLOWING_SNOW_OPTIONS = ['无', '轻度', '中度', '强烈'];

export function ObservationInfoSection({ info, onChange }: ObservationInfoSectionProps) {
  return (
    <div className="observation-info-section">
      <h3 className="section-title">观测基本信息</h3>

      <div className="info-card">
        {/* 第一行：记录ID、日期、观测员 */}
        <div className="info-row">
          <div className="info-field">
            <label>记录编号</label>
            <input
              type="text"
              value={info.recordId}
              onChange={(e) => onChange('recordId', e.target.value)}
              placeholder="如: SP-2024-001"
            />
          </div>
          <div className="info-field">
            <label>观测日期 <span className="required">*</span></label>
            <input
              type="date"
              value={info.date}
              onChange={(e) => onChange('date', e.target.value)}
            />
          </div>
          <div className="info-field">
            <label>观测员 <span className="required">*</span></label>
            <input
              type="text"
              value={info.observer}
              onChange={(e) => onChange('observer', e.target.value)}
              placeholder="观测员姓名"
            />
          </div>
        </div>

        {/* 第二行：位置描述 */}
        <div className="info-row">
          <div className="info-field wide">
            <label>位置描述 <span className="required">*</span></label>
            <input
              type="text"
              value={info.locationDescription}
              onChange={(e) => onChange('locationDescription', e.target.value)}
              placeholder="如: 高山区东北坡、山脊下方50m"
            />
          </div>
        </div>

        {/* 第三行：GPS、海拔 */}
        <div className="info-row">
          <div className="info-field">
            <label>GPS 坐标</label>
            <input
              type="text"
              value={info.gpsCoordinates}
              onChange={(e) => onChange('gpsCoordinates', e.target.value)}
              placeholder="如: N43.5678, E87.1234"
            />
          </div>
          <div className="info-field">
            <label>海拔 (m)</label>
            <input
              type="text"
              value={info.elevation}
              onChange={(e) => onChange('elevation', e.target.value)}
              placeholder="海拔高度"
            />
          </div>
        </div>

        {/* 第四行：坡向、坡度 */}
        <div className="info-row">
          <div className="info-field">
            <label>坡向</label>
            <select
              value={info.slopeAspect}
              onChange={(e) => onChange('slopeAspect', e.target.value)}
            >
              <option value="">选择坡向</option>
              {ASPECT_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
          <div className="info-field">
            <label>坡度 (°)</label>
            <input
              type="text"
              value={info.slopeAngle}
              onChange={(e) => onChange('slopeAngle', e.target.value)}
              placeholder="坡度角度"
            />
          </div>
          <div className="info-field">
            <label>总雪深 (cm)</label>
            <input
              type="text"
              value={info.totalSnowDepth}
              onChange={(e) => onChange('totalSnowDepth', e.target.value)}
              placeholder="总雪深"
            />
          </div>
        </div>

        <div className="section-divider">
          <span>环境条件</span>
        </div>

        {/* 第五行：气温、天气 */}
        <div className="info-row">
          <div className="info-field">
            <label>气温 (°C)</label>
            <input
              type="text"
              value={info.airTemperature}
              onChange={(e) => onChange('airTemperature', e.target.value)}
              placeholder="气温"
            />
          </div>
          <div className="info-field">
            <label>天气状况</label>
            <select
              value={info.weather}
              onChange={(e) => onChange('weather', e.target.value)}
            >
              <option value="">选择天气</option>
              {WEATHER_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
          <div className="info-field">
            <label>靴陷深度 (cm)</label>
            <input
              type="text"
              value={info.bootPenetration}
              onChange={(e) => onChange('bootPenetration', e.target.value)}
              placeholder="靴陷深度"
            />
          </div>
        </div>

        {/* 第六行：风况、吹雪 */}
        <div className="info-row">
          <div className="info-field">
            <label>风况</label>
            <select
              value={info.wind}
              onChange={(e) => onChange('wind', e.target.value)}
            >
              <option value="">选择风力</option>
              {WIND_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
          <div className="info-field">
            <label>吹雪情况</label>
            <select
              value={info.blowingSnow}
              onChange={(e) => onChange('blowingSnow', e.target.value)}
            >
              <option value="">选择程度</option>
              {BLOWING_SNOW_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
