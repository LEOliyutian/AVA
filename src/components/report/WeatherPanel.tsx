import { useForecastStore, useSkyCode, useTransportCode, useTempDisplay, useWindDisplay } from '../../store';
import { WeatherObservationPanel } from './WeatherObservationPanel';

export function WeatherPanel() {
  const weather = useForecastStore((s) => s.weather);
  const skyCode = useSkyCode();
  const transportCode = useTransportCode();
  const tempDisplay = useTempDisplay();
  const windDisplay = useWindDisplay();

  return (
    <div className="col-side">
      <div className="sec-h">天气状况 (Weather)</div>

      <div className="wx-row">
        <div className="wx-tile">
          <span className="wx-big">{skyCode}</span>
          <span className="wx-sub">天空状况 Sky</span>
        </div>
        <div className="wx-tile">
          <span className="wx-big">{transportCode}</span>
          <span className="wx-sub">风雪搬运 Transport</span>
        </div>
      </div>

      <div className="wx-tile" style={{ marginBottom: 15 }}>
        <span className="wx-big">{tempDisplay}</span>
        <span className="wx-sub">气温 Temp (°C)</span>
      </div>

      <div className="wx-tile" style={{ marginBottom: 30 }}>
        <span className="wx-big">{windDisplay}</span>
        <span className="wx-sub">风况 Wind</span>
      </div>

      <div className="sec-h" style={{ fontSize: 13, marginBottom: 15 }}>
        雪层数据 Snowpack (cm)
      </div>
      <div className="sn-grid">
        <div className="sn-box">
          <strong>{weather.hn24}</strong>
          <div className="wx-sub">24h新雪</div>
        </div>
        <div className="sn-box">
          <strong>{weather.hst}</strong>
          <div className="wx-sub">暴雪量</div>
        </div>
        <div className="sn-box">
          <strong>{weather.hs}</strong>
          <div className="wx-sub">总雪深</div>
        </div>
      </div>

      <WeatherObservationPanel />
    </div>
  );
}
