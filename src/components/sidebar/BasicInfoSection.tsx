import { FormGroup, Input, Select } from '../ui';
import { DangerBadge } from '../shared';
import { useForecastStore, useCalculatedRisks } from '../../store';
import type { ElevationBand, DangerTrend } from '../../types';

const TREND_OPTIONS = [
  { value: 'steady', label: '持平' },
  { value: 'rising', label: '增加' },
  { value: 'falling', label: '下降' },
];

const BANDS: { id: ElevationBand; labelZh: string; labelEn: string; suffix: 'h' | 'm' | 'l' }[] = [
  { id: 'alp', labelZh: '高山带', labelEn: 'High Alpine (>2200m)', suffix: 'h' },
  { id: 'tl', labelZh: '林线', labelEn: 'Treeline (1800-2200m)', suffix: 'm' },
  { id: 'btl', labelZh: '林线下', labelEn: 'Below TL (<1800m)', suffix: 'l' },
];

export function BasicInfoSection() {
  const date = useForecastStore((s) => s.date);
  const forecaster = useForecastStore((s) => s.forecaster);
  const trends = useForecastStore((s) => s.trends);
  const setDate = useForecastStore((s) => s.setDate);
  const setForecaster = useForecastStore((s) => s.setForecaster);
  const setTrend = useForecastStore((s) => s.setTrend);

  const risks = useCalculatedRisks();

  return (
    <FormGroup title="1. 基本信息 (Info & Risk)">
      <div className="input-row">
        <Input
          type="date"
          label="发布日期 Date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <Input
          type="text"
          label="预报员 Forecaster"
          placeholder="请输入姓名"
          value={forecaster}
          onChange={(e) => setForecaster(e.target.value)}
        />
      </div>

      <div className="monitor-box">
        <div style={{ fontWeight: 700, marginBottom: 8, fontSize: 11 }}>
          自动计算危险等级 (AUTO-CALCULATED):
        </div>
        {BANDS.map((band) => (
          <div key={band.id} className="monitor-row">
            <span>
              {band.labelZh} {band.labelEn}
            </span>
            <DangerBadge level={risks[band.id]} variant="mini" />
          </div>
        ))}
      </div>

      <label>危险趋势 (Trend)</label>
      <div className="input-row">
        {BANDS.map((band) => (
          <Select
            key={band.id}
            options={TREND_OPTIONS.map((opt) => ({
              value: opt.value,
              label: `${band.labelZh}: ${opt.label}`,
            }))}
            value={trends[band.id]}
            onChange={(value) => setTrend(band.id, value as DangerTrend)}
          />
        ))}
      </div>
    </FormGroup>
  );
}
