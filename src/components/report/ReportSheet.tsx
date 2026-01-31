import { forwardRef } from 'react';
import { ReportHeader } from './ReportHeader';
import { DangerBar } from './DangerBar';
import { ProblemCard } from './ProblemCard';
import { WeatherPanel } from './WeatherPanel';
import { LegalFooter } from './LegalFooter';
import { useForecastStore } from '../../store';
import './ReportSheet.css';

export const ReportSheet = forwardRef<HTMLDivElement>((_props, ref) => {
  const primaryProblem = useForecastStore((s) => s.primaryProblem);
  const secondaryProblem = useForecastStore((s) => s.secondaryProblem);
  const secondaryEnabled = useForecastStore((s) => s.secondaryEnabled);
  const observations = useForecastStore((s) => s.observations);
  const summary = useForecastStore((s) => s.summary);

  return (
    <div className="report-sheet" ref={ref}>
      <ReportHeader />
      <DangerBar />

      <div className="rep-content">
        <div className="col-main">
          <div className="sec-h">雪崩问题 (Avalanche Problems)</div>

          <ProblemCard problem={primaryProblem} variant="primary" />

          {secondaryEnabled && (
            <ProblemCard problem={secondaryProblem} variant="secondary" />
          )}

          <div className="sec-h">详细观测信息 (Details)</div>

          <div className="obs-block">
            <div className="obs-title">雪层结构分析 (Snowpack Structure)</div>
            <div className="obs-txt">{observations.snowpack}</div>
          </div>

          <div className="obs-block">
            <div className="obs-title">近期雪崩活动 (Recent Avalanche Activity)</div>
            <div className="obs-txt">{observations.activity}</div>
          </div>

          <div className="sec-h" style={{ marginTop: 30 }}>
            摘要 (Summary)
          </div>
          <div className="sum-box">
            <p style={{ margin: 0 }}>{summary}</p>
          </div>
        </div>

        <WeatherPanel />
      </div>

      <LegalFooter />
    </div>
  );
});

ReportSheet.displayName = 'ReportSheet';
