import { DangerBadge } from '../../shared';
import { useForecastStore } from '../../../store';
import {
  DANGER_DESCRIPTIONS,
  RISK_DEFINITIONS,
  TREND_CONFIG,
} from '../../../config';
import type { DangerLevel, ElevationBand } from '../../../types';
import './DangerCell.css';

interface DangerCellProps {
  band: ElevationBand;
  title: string;
  elevation: string;
  dangerLevel: DangerLevel;
}

export function DangerCell({ band, title, elevation, dangerLevel }: DangerCellProps) {
  const trends = useForecastStore((s) => s.trends);
  const trend = trends[band];
  const trendConfig = TREND_CONFIG[trend];
  const riskDef = RISK_DEFINITIONS[dangerLevel];

  return (
    <div className="db-cell">
      <div className="db-title">{title}</div>
      <div className="db-elev">{elevation}</div>
      <DangerBadge level={dangerLevel} />

      <div className="rd-box">
        <div className="rd-row">
          <span className="rd-label">触发概率:</span>
          <span className="rd-val">{riskDef.prob}</span>
        </div>
        <div className="rd-row">
          <span className="rd-label">预期后果:</span>
          <span className="rd-val">{riskDef.cons}</span>
        </div>
      </div>

      <div className="db-desc">{DANGER_DESCRIPTIONS[dangerLevel]}</div>

      <div
        className="db-trend"
        style={{
          color: trendConfig.color,
          background: trendConfig.background,
        }}
      >
        {trendConfig.text}
      </div>
    </div>
  );
}
