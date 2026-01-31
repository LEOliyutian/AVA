import { FormGroup, Select, Input } from '../ui';
import { useForecastStore } from '../../store';
import type {
  SkyCondition,
  SnowTransport,
  WindDirection,
  WindSpeed,
} from '../../types';

const SKY_OPTIONS: SkyCondition[] = [
  '☀️ 晴朗 CLR',
  '🌤 少量云 FEW',
  '⛅ 散云 SCT',
  '☁️ 多云 BKN',
  '☁️ 阴天 OVC',
  '🌫 无法观测 X',
];

const TRANSPORT_OPTIONS: SnowTransport[] = [
  '无风雪搬运 (None)',
  ' 轻度搬运 (Light)',
  ' 中度搬运 (Moderate)',
  ' 强烈搬运 (Intense)',
];

const WIND_DIRECTION_OPTIONS: WindDirection[] = [
  '北 N',
  '东北 NE',
  '东 E',
  '东南 SE',
  '南 S',
  '西南 SW',
  '西 W',
  '西北 NW',
];

const WIND_SPEED_OPTIONS: WindSpeed[] = [
  '平静 Calm (0-1km/h)',
  '轻风 Light (1-12km/h)',
  '中等风 Moderate (12-30km/h)',
  '强风 Strong (30-50km/h)',
  '极端风 Extreme (>50km/h)',
];

export function WeatherSection() {
  const weather = useForecastStore((s) => s.weather);
  const setWeather = useForecastStore((s) => s.setWeather);

  return (
    <FormGroup title="4. 天气数据 (Weather)">
      <div className="input-row">
        <Select
          options={SKY_OPTIONS.map((s) => ({ value: s, label: s }))}
          value={weather.sky}
          onChange={(value) => setWeather('sky', value as SkyCondition)}
        />
        <Select
          options={TRANSPORT_OPTIONS.map((t) => ({ value: t, label: t }))}
          value={weather.transport}
          onChange={(value) => setWeather('transport', value as SnowTransport)}
        />
      </div>

      <div className="input-row">
        <Input
          type="number"
          placeholder="最低温"
          value={weather.tempMin}
          onChange={(e) => setWeather('tempMin', Number(e.target.value))}
        />
        <Input
          type="number"
          placeholder="最高温"
          value={weather.tempMax}
          onChange={(e) => setWeather('tempMax', Number(e.target.value))}
        />
      </div>

      <div className="input-row">
        <Select
          options={WIND_DIRECTION_OPTIONS.map((d) => ({ value: d, label: d }))}
          value={weather.windDirection}
          onChange={(value) => setWeather('windDirection', value as WindDirection)}
        />
        <Select
          options={WIND_SPEED_OPTIONS.map((s) => ({ value: s, label: s }))}
          value={weather.windSpeed}
          onChange={(value) => setWeather('windSpeed', value as WindSpeed)}
        />
      </div>

      <div className="input-row">
        <Input
          type="number"
          label="24h新雪 HN24"
          value={weather.hn24}
          onChange={(e) => setWeather('hn24', Number(e.target.value))}
        />
        <Input
          type="number"
          label="暴雪总量 HST"
          value={weather.hst}
          onChange={(e) => setWeather('hst', Number(e.target.value))}
        />
        <Input
          type="number"
          label="积雪总厚 HS"
          value={weather.hs}
          onChange={(e) => setWeather('hs', Number(e.target.value))}
        />
      </div>
    </FormGroup>
  );
}
