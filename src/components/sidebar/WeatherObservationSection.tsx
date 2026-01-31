import { FormGroup, Input, Select } from '../ui';
import { useForecastStore } from '../../store';
import type {
  CloudCover,
  WindDirectionSimple,
  SurfaceSnowType,
  StationObservation,
} from '../../types';

const CLOUD_COVER_OPTIONS: { value: CloudCover; label: string }[] = [
  { value: 'CLR', label: 'CLR 晴朗' },
  { value: 'FEW', label: 'FEW 少云' },
  { value: 'SCT', label: 'SCT 散云' },
  { value: 'BKN', label: 'BKN 多云' },
  { value: 'OVC', label: 'OVC 阴天' },
  { value: 'X', label: 'X 无法观测' },
];

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

const SNOW_TYPE_OPTIONS: { value: SurfaceSnowType; label: string }[] = [
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

interface StationInputProps {
  title: string;
  station: StationObservation;
  onUpdate: <K extends keyof StationObservation>(key: K, value: StationObservation[K]) => void;
  showHstH24?: boolean;
}

function StationInput({ title, station, onUpdate, showHstH24 = false }: StationInputProps) {
  return (
    <div style={{ background: '#f8f9fa', padding: 10, borderRadius: 4, marginBottom: 10 }}>
      <div style={{ fontWeight: 700, fontSize: 11, marginBottom: 8, color: '#2c3e50' }}>
        {title} ({station.elevation}m)
      </div>

      <div className="input-row">
        <Input
          type="text"
          label="观测时间"
          value={station.time}
          onChange={(e) => onUpdate('time', e.target.value)}
        />
        <Select
          label="云量"
          options={CLOUD_COVER_OPTIONS}
          value={station.cloudCover}
          onChange={(v) => onUpdate('cloudCover', v as CloudCover)}
        />
      </div>

      <div className="input-row">
        <Input
          type="text"
          label="降水情况"
          value={station.precipitation}
          onChange={(e) => onUpdate('precipitation', e.target.value)}
        />
        <Select
          label="风向"
          options={WIND_DIRECTION_OPTIONS}
          value={station.windDirection}
          onChange={(v) => onUpdate('windDirection', v as WindDirectionSimple)}
        />
        <Input
          type="number"
          label="风速(km/h)"
          value={station.windSpeed}
          onChange={(e) => onUpdate('windSpeed', Number(e.target.value))}
        />
      </div>

      <div className="input-row">
        <Input
          type="number"
          label="粒径(mm)"
          value={station.grainSize}
          onChange={(e) => onUpdate('grainSize', Number(e.target.value))}
        />
        <Select
          label="表面雪质"
          options={SNOW_TYPE_OPTIONS}
          value={station.surfaceSnowType}
          onChange={(v) => onUpdate('surfaceSnowType', v as SurfaceSnowType)}
        />
      </div>

      <div className="input-row">
        <Input
          type="number"
          label="10cm温度(°C)"
          value={station.temp10cm}
          step="0.1"
          onChange={(e) => onUpdate('temp10cm', Number(e.target.value))}
        />
        <Input
          type="number"
          label="雪表温度(°C)"
          value={station.tempSurface}
          step="0.1"
          onChange={(e) => onUpdate('tempSurface', Number(e.target.value))}
        />
        <Input
          type="number"
          label="空气温度(°C)"
          value={station.tempAir}
          step="0.1"
          onChange={(e) => onUpdate('tempAir', Number(e.target.value))}
        />
      </div>

      <div className="input-row">
        <Input
          type="text"
          label="风吹雪(HIN)"
          value={station.blowingSnow}
          onChange={(e) => onUpdate('blowingSnow', e.target.value)}
        />
        <Input
          type="number"
          label="雪深HS(cm)"
          value={station.snowDepth}
          onChange={(e) => onUpdate('snowDepth', Number(e.target.value))}
        />
      </div>

      {showHstH24 && (
        <div className="input-row">
          <Input
            type="number"
            label="暴雪量HST(cm)"
            value={station.hst ?? 0}
            onChange={(e) => onUpdate('hst', Number(e.target.value))}
          />
          <Input
            type="number"
            label="24h新雪H24(cm)"
            value={station.h24 ?? 0}
            onChange={(e) => onUpdate('h24', Number(e.target.value))}
          />
        </div>
      )}
    </div>
  );
}

export function WeatherObservationSection() {
  const observation = useForecastStore((s) => s.weatherObservation);
  const setObservationDate = useForecastStore((s) => s.setObservationDate);
  const setObservationRecorder = useForecastStore((s) => s.setObservationRecorder);
  const setObservationTempMin = useForecastStore((s) => s.setObservationTempMin);
  const setObservationTempMax = useForecastStore((s) => s.setObservationTempMax);
  const setUpperStation = useForecastStore((s) => s.setUpperStation);
  const setLowerStation = useForecastStore((s) => s.setLowerStation);

  return (
    <FormGroup title="4b. 详细气象观测 (Weather Observation)" borderColor="#17a2b8">
      <div className="input-row">
        <Input
          type="text"
          label="观测日期"
          placeholder="如: 0130"
          value={observation.date}
          onChange={(e) => setObservationDate(e.target.value)}
        />
        <Input
          type="text"
          label="记录员"
          value={observation.recorder}
          onChange={(e) => setObservationRecorder(e.target.value)}
        />
      </div>

      <div className="input-row">
        <Input
          type="number"
          label="最低气温(°C)"
          value={observation.tempMin}
          onChange={(e) => setObservationTempMin(Number(e.target.value))}
        />
        <Input
          type="number"
          label="最高气温(°C)"
          value={observation.tempMax}
          onChange={(e) => setObservationTempMax(Number(e.target.value))}
        />
      </div>

      <StationInput
        title="高海拔站点"
        station={observation.upperStation}
        onUpdate={setUpperStation}
      />

      <StationInput
        title="低海拔站点"
        station={observation.lowerStation}
        onUpdate={setLowerStation}
        showHstH24
      />
    </FormGroup>
  );
}
