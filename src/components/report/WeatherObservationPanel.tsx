import { useForecastStore } from '../../store';
import type { StationObservation } from '../../types';
import './WeatherObservationPanel.css';

const SNOW_TYPE_LABELS: Record<string, string> = {
  PP: '降水颗粒',
  DF: '分解碎片',
  RG: '圆粒雪',
  FC: '棱角晶',
  DH: '深霜',
  SH: '表面霜',
  MF: '融化形态',
  IF: '冰层',
  CR: '硬壳',
};

const WIND_DIRECTION_LABELS: Record<string, string> = {
  N: '北风',
  NE: '东北风',
  E: '东风',
  SE: '东南风',
  S: '南风',
  SW: '西南风',
  W: '西风',
  NW: '西北风',
};

interface StationCardProps {
  station: StationObservation;
  title: string;
  showHstH24?: boolean;
}

function StationCard({ station, title, showHstH24 = false }: StationCardProps) {
  return (
    <div className="station-card">
      <div className="station-header">
        <span className="station-title">{title}</span>
        <span className="station-elev">{station.elevation}m</span>
        <span className="station-time">@{station.time}</span>
      </div>

      <div className="station-grid">
        <div className="station-row">
          <span className="station-label">云量</span>
          <span className="station-value">{station.cloudCover}</span>
        </div>
        <div className="station-row">
          <span className="station-label">降水</span>
          <span className="station-value">{station.precipitation || '~'}</span>
        </div>
        <div className="station-row">
          <span className="station-label">风况</span>
          <span className="station-value">
            {WIND_DIRECTION_LABELS[station.windDirection]} {station.windSpeed}km/h
          </span>
        </div>
        <div className="station-row">
          <span className="station-label">粒径</span>
          <span className="station-value">{station.grainSize}mm</span>
        </div>
        <div className="station-row">
          <span className="station-label">表面雪质</span>
          <span className="station-value">
            {station.surfaceSnowType} ({SNOW_TYPE_LABELS[station.surfaceSnowType]})
          </span>
        </div>
        <div className="station-row">
          <span className="station-label">风吹雪</span>
          <span className="station-value">{station.blowingSnow || '~'}</span>
        </div>
      </div>

      <div className="station-temps">
        <div className="temp-item">
          <span className="temp-value">{station.tempAir}°</span>
          <span className="temp-label">空气</span>
        </div>
        <div className="temp-item">
          <span className="temp-value">{station.tempSurface}°</span>
          <span className="temp-label">雪表</span>
        </div>
        <div className="temp-item">
          <span className="temp-value">{station.temp10cm}°</span>
          <span className="temp-label">10cm</span>
        </div>
      </div>

      <div className="station-snow">
        <div className="snow-item snow-hs">
          <span className="snow-value">{station.snowDepth}</span>
          <span className="snow-label">HS (cm)</span>
        </div>
        {showHstH24 && (
          <>
            <div className="snow-item">
              <span className="snow-value">{station.hst ?? '~'}</span>
              <span className="snow-label">HST</span>
            </div>
            <div className="snow-item">
              <span className="snow-value">{station.h24 ?? '~'}</span>
              <span className="snow-label">H24</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export function WeatherObservationPanel() {
  const observation = useForecastStore((s) => s.weatherObservation);

  return (
    <div className="weather-obs-panel">
      <div className="obs-panel-header">
        <div className="sec-h" style={{ fontSize: 13, marginBottom: 10 }}>
          气象观测 Weather Observation
        </div>
        <div className="obs-meta">
          <span>日期: {observation.date}</span>
          <span>记录员: {observation.recorder || '--'}</span>
        </div>
        <div className="obs-temp-range">
          气温: {observation.tempMin}° ~ {observation.tempMax}°C
        </div>
      </div>

      <StationCard
        station={observation.upperStation}
        title="高海拔站"
      />

      <StationCard
        station={observation.lowerStation}
        title="低海拔站"
        showHstH24
      />
    </div>
  );
}
