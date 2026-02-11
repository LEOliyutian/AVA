import type { WeatherEditorState, StationEditorState } from '../../store/weather.store';
import { WeatherChart } from './WeatherChart';
import './WeatherPreview.css';

interface WeatherPreviewProps {
  data: WeatherEditorState;
}

// 云量图标映射
const cloudCoverIcons: Record<string, string> = {
  CLR: '☀️',
  FEW: '🌤',
  SCT: '⛅',
  BKN: '☁️',
  OVC: '☁️',
  X: '🌫',
};

// 云量标签
const cloudCoverLabels: Record<string, string> = {
  CLR: '晴朗',
  FEW: '少云',
  SCT: '散云',
  BKN: '多云',
  OVC: '阴天',
  X: '不可见',
};

// 格式化数字
function formatNum(val: number | '' | undefined, suffix = ''): string {
  if (val === '' || val === undefined) return '-';
  return `${val}${suffix}`;
}

// 站点数据卡片
function StationCard({ station }: { station: StationEditorState }) {
  return (
    <div className="station-preview-card">
      <div className="station-header">
        <span className="station-name">{station.name || '未命名站点'}</span>
        <span className="station-elevation">{station.elevation || '?'}m</span>
        {station.time && <span className="station-time">{station.time}</span>}
      </div>

      <div className="station-grid">
        {/* 天气状况 */}
        <div className="data-block weather-block">
          <div className="weather-icon">{cloudCoverIcons[station.cloudCover] || '?'}</div>
          <div className="weather-label">{cloudCoverLabels[station.cloudCover] || station.cloudCover}</div>
          {station.precipitation && station.precipitation !== '无' && (
            <div className="precipitation-tag">{station.precipitation}</div>
          )}
        </div>

        {/* 风况 */}
        <div className="data-block">
          <div className="data-label">风况</div>
          <div className="data-value">
            <span className="wind-direction">{station.windDirection}</span>
            <span className="wind-speed">{formatNum(station.windSpeed, ' km/h')}</span>
          </div>
          {station.blowingSnow && station.blowingSnow !== '无' && (
            <div className="blowing-tag">风吹雪: {station.blowingSnow}</div>
          )}
        </div>

        {/* 温度 */}
        <div className="data-block temp-block">
          <div className="data-label">温度</div>
          <div className="temp-grid">
            <div className="temp-item">
              <span className="temp-type">空气</span>
              <span className="temp-value">{formatNum(station.tempAir, '°')}</span>
            </div>
            <div className="temp-item">
              <span className="temp-type">雪面</span>
              <span className="temp-value">{formatNum(station.tempSurface, '°')}</span>
            </div>
            <div className="temp-item">
              <span className="temp-type">10cm</span>
              <span className="temp-value">{formatNum(station.temp10cm, '°')}</span>
            </div>
          </div>
        </div>

        {/* 雪面 */}
        <div className="data-block">
          <div className="data-label">雪面</div>
          <div className="snow-info">
            <span className="snow-type">{station.surfaceSnowType}</span>
            {station.grainSize !== '' && (
              <span className="grain-size">{station.grainSize}mm</span>
            )}
          </div>
        </div>

        {/* 雪深 */}
        <div className="data-block snow-depth-block">
          <div className="data-label">雪深</div>
          <div className="snow-depth-value">
            <span className="hs-value">{formatNum(station.snowDepth)}</span>
            <span className="hs-unit">cm</span>
          </div>
          <div className="snow-extra">
            {station.hst !== '' && station.hst !== undefined && (
              <span>HST: {station.hst}cm</span>
            )}
            {station.h24 !== '' && station.h24 !== undefined && (
              <span>H24: {station.h24}cm</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function WeatherPreview({ data }: WeatherPreviewProps) {
  // 按海拔排序站点（高到低）
  const sortedStations = [...data.stations]
    .filter((s) => s.name || s.elevation !== '')
    .sort((a, b) => (Number(b.elevation) || 0) - (Number(a.elevation) || 0));

  return (
    <div className="weather-preview">
      {/* 报告头部 */}
      <div className="weather-report-header">
        <div className="header-left">
          <div className="resort-name">吉克普林滑雪场</div>
          <div className="report-title">气象观测记录</div>
        </div>
        <div className="header-right">
          <div className="report-date">{data.date || '-'}</div>
          <div className="report-recorder">记录员: {data.recorder || '-'}</div>
        </div>
      </div>

      {/* 温度概览 */}
      <div className="temp-overview">
        <div className="temp-range">
          <span className="temp-min">{formatNum(data.tempMin, '°C')}</span>
          <span className="temp-sep">~</span>
          <span className="temp-max">{formatNum(data.tempMax, '°C')}</span>
        </div>
        <div className="temp-label">日温度范围</div>
      </div>

      {/* 图表 */}
      <WeatherChart
        stations={data.stations}
        tempMin={data.tempMin}
        tempMax={data.tempMax}
      />

      {/* 站点数据 */}
      <div className="stations-section">
        <div className="stations-header">
          <span className="stations-title">观测站点</span>
          <span className="stations-count">{sortedStations.length} 个站点</span>
        </div>
        <div className="stations-container">
          {sortedStations.length > 0 ? (
            sortedStations.map((station) => (
              <StationCard key={station.id} station={station} />
            ))
          ) : (
            <div className="no-stations">暂无站点数据</div>
          )}
        </div>
      </div>

      {/* 报告页脚 */}
      <div className="weather-report-footer">
        <span>Weather Observation</span>
        <span>·</span>
        <span>Jikepulin Ski Resort</span>
      </div>
    </div>
  );
}
