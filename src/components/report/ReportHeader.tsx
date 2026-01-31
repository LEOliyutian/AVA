import { useForecastStore } from '../../store';

export function ReportHeader() {
  const date = useForecastStore((s) => s.date);
  const forecaster = useForecastStore((s) => s.forecaster);

  return (
    <div className="rep-header">
      <div className="rep-brand">
        <h1>吉克普林 · 雪崩安全公告</h1>
        <h2>JIKEPULIN AVALANCHE ADVISORY</h2>
      </div>
      <div className="rep-meta">
        <span className="meta-date">{date}</span>
        <span className="meta-valid">24小时内有效</span>
        <div className="meta-fc">
          预报员: <span>{forecaster || '--'}</span>
        </div>
      </div>
    </div>
  );
}
