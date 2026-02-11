import { useEffect, useState, useMemo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { forecastApi, type ForecastListItem } from '../api';
import { DANGER_CONFIG } from '../config';
import './ForecastDashboardPage.css';

type DaysRange = 7 | 15 | 30;

const DANGER_LABELS: Record<number, { cn: string; en: string }> = {
  1: { cn: '低风险', en: 'Low' },
  2: { cn: '中等', en: 'Moderate' },
  3: { cn: '显著', en: 'Considerable' },
  4: { cn: '高危', en: 'High' },
  5: { cn: '极端', en: 'Extreme' },
};

function fmtDate(d: string) {
  const dt = new Date(d);
  return `${dt.getMonth() + 1}/${dt.getDate()}`;
}

function fmtDateFull(d: string) {
  const dt = new Date(d);
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`;
}

function getDangerColor(level: number) {
  return DANGER_CONFIG[level as keyof typeof DANGER_CONFIG]?.color || '#94a3b8';
}

export function ForecastDashboardPage() {
  const navigate = useNavigate();
  const [forecasts, setForecasts] = useState<ForecastListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [days, setDays] = useState<DaysRange>(15);

  const fetchData = useCallback(async (d: DaysRange) => {
    setLoading(true);
    setError(null);
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - d);

    const result = await forecastApi.getList({
      limit: 50,
      status: 'published',
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
    });

    if (result.success && result.data) {
      // Sort by date ascending for charts
      const sorted = [...result.data.data].sort((a, b) =>
        a.forecast_date.localeCompare(b.forecast_date)
      );
      setForecasts(sorted);
    } else {
      setError(result.error || '加载失败');
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData(days);
  }, [days, fetchData]);

  // Summary data
  const summaryData = useMemo(() => {
    if (forecasts.length === 0) return null;
    const latest = forecasts[forecasts.length - 1];
    const maxDanger = Math.max(latest.danger_alp, latest.danger_tl, latest.danger_btl);

    // Trend: compare latest vs previous
    let trendDir: 'up' | 'down' | 'flat' = 'flat';
    if (forecasts.length >= 2) {
      const prev = forecasts[forecasts.length - 2];
      const prevMax = Math.max(prev.danger_alp, prev.danger_tl, prev.danger_btl);
      if (maxDanger > prevMax) trendDir = 'up';
      else if (maxDanger < prevMax) trendDir = 'down';
    }

    // Average danger
    const avgDanger = forecasts.reduce((s, f) => s + Math.max(f.danger_alp, f.danger_tl, f.danger_btl), 0) / forecasts.length;

    // Peak danger
    const peakDanger = Math.max(...forecasts.map(f => Math.max(f.danger_alp, f.danger_tl, f.danger_btl)));

    return {
      latestDate: latest.forecast_date,
      maxDanger,
      trendDir,
      avgDanger,
      peakDanger,
      forecaster: latest.forecaster_name,
      totalForecasts: forecasts.length,
    };
  }, [forecasts]);

  return (
    <div className="forecast-dashboard">
      {/* Header */}
      <header className="dash-header">
        <div className="dash-header-left">
          <Link to="/forecasts/list" className="dash-back-btn">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>预报记录</span>
          </Link>
          <div className="dash-title-group">
            <h1 className="dash-title">趋势分析</h1>
            <span className="dash-subtitle">Danger Trends</span>
          </div>
        </div>
        <div className="dash-header-right">
          <div className="dash-filter-group">
            <div className="dash-range-btns">
              {([7, 15, 30] as DaysRange[]).map(d => (
                <button
                  key={d}
                  className={`range-btn ${days === d ? 'active' : ''}`}
                  onClick={() => setDays(d)}
                >
                  {d}天
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {loading ? (
        <div className="dash-loading">
          <div className="dash-spinner" />
          <p>正在加载趋势数据...</p>
        </div>
      ) : error ? (
        <div className="dash-error">
          <p>{error}</p>
          <button onClick={() => fetchData(days)}>重试</button>
        </div>
      ) : forecasts.length === 0 ? (
        <div className="dash-empty">
          <div className="dash-empty-icon">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
              <rect x="8" y="16" width="48" height="36" rx="4" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4"/>
              <path d="M16 40L24 32L32 36L40 24L48 28" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <p>暂无趋势数据</p>
          <span>所选时间范围内无已发布的预报</span>
        </div>
      ) : (
        <div className="dash-content">
          {/* Summary Cards */}
          <section className="dash-cards">
            <div className="summary-card" style={{ '--card-accent': getDangerColor(summaryData?.maxDanger || 1) } as React.CSSProperties}>
              <div className="card-accent-bar" />
              <div className="card-body-inner">
                <div className="card-label-row">
                  <span className="card-label">当前危险等级</span>
                  <span className="card-sublabel">Danger Level</span>
                </div>
                <div className="card-value-row">
                  <span className="card-value" style={{ color: getDangerColor(summaryData?.maxDanger || 1) }}>
                    {summaryData?.maxDanger || '-'}
                  </span>
                  <span className="card-danger-label">
                    {DANGER_LABELS[summaryData?.maxDanger || 1]?.cn}
                  </span>
                </div>
                <div className="card-detail">{summaryData?.latestDate ? fmtDateFull(summaryData.latestDate) : ''}</div>
              </div>
            </div>

            <div className="summary-card" style={{ '--card-accent': summaryData?.trendDir === 'up' ? '#ef4444' : summaryData?.trendDir === 'down' ? '#22c55e' : '#94a3b8' } as React.CSSProperties}>
              <div className="card-accent-bar" />
              <div className="card-body-inner">
                <div className="card-label-row">
                  <span className="card-label">趋势方向</span>
                  <span className="card-sublabel">Trend</span>
                </div>
                <div className="card-value-row">
                  <span className={`card-trend-icon trend-${summaryData?.trendDir || 'flat'}`}>
                    {summaryData?.trendDir === 'up' ? '↗' : summaryData?.trendDir === 'down' ? '↘' : '→'}
                  </span>
                  <span className="card-trend-label">
                    {summaryData?.trendDir === 'up' ? '上升' : summaryData?.trendDir === 'down' ? '下降' : '持平'}
                  </span>
                </div>
                <div className="card-detail">较前日预报</div>
              </div>
            </div>

            <div className="summary-card" style={{ '--card-accent': '#f97316' } as React.CSSProperties}>
              <div className="card-accent-bar" />
              <div className="card-body-inner">
                <div className="card-label-row">
                  <span className="card-label">平均等级</span>
                  <span className="card-sublabel">Average</span>
                </div>
                <div className="card-value-row">
                  <span className="card-value">{summaryData?.avgDanger.toFixed(1) || '-'}</span>
                </div>
                <div className="card-detail">近 {days} 天平均最高等级</div>
              </div>
            </div>

            <div className="summary-card" style={{ '--card-accent': getDangerColor(summaryData?.peakDanger || 1) } as React.CSSProperties}>
              <div className="card-accent-bar" />
              <div className="card-body-inner">
                <div className="card-label-row">
                  <span className="card-label">峰值等级</span>
                  <span className="card-sublabel">Peak</span>
                </div>
                <div className="card-value-row">
                  <span className="card-value" style={{ color: getDangerColor(summaryData?.peakDanger || 1) }}>
                    {summaryData?.peakDanger || '-'}
                  </span>
                  <span className="card-danger-label">
                    {DANGER_LABELS[summaryData?.peakDanger || 1]?.cn}
                  </span>
                </div>
                <div className="card-detail">近 {days} 天最高</div>
              </div>
            </div>
          </section>

          {/* Danger Level Trend Chart */}
          <section className="dash-charts-row">
            <div className="dash-chart-card dash-chart-full">
              <div className="chart-card-header">
                <h3>危险等级趋势</h3>
                <span className="chart-station-tag">3 个海拔带</span>
              </div>
              <DangerTrendChart data={forecasts} />
            </div>
          </section>

          {/* Data Table */}
          <section className="dash-table-section">
            <div className="table-section-header">
              <h3>预报记录明细</h3>
              <span className="table-count">{forecasts.length} 条记录</span>
            </div>
            <div className="dash-table-wrap">
              <table className="dash-table">
                <thead>
                  <tr>
                    <th>日期</th>
                    <th>综合</th>
                    <th>高山带</th>
                    <th>林线带</th>
                    <th>林下带</th>
                    <th>预报员</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  {[...forecasts].reverse().map((f) => {
                    const maxD = Math.max(f.danger_alp, f.danger_tl, f.danger_btl);
                    return (
                      <tr key={f.id}>
                        <td className="cell-date">{fmtDateFull(f.forecast_date)}</td>
                        <td>
                          <span className="table-danger-badge" style={{ backgroundColor: getDangerColor(maxD) }}>
                            {maxD}
                          </span>
                        </td>
                        <td>
                          <span className="table-danger-dot" style={{ backgroundColor: getDangerColor(f.danger_alp) }}>
                            {f.danger_alp}
                          </span>
                        </td>
                        <td>
                          <span className="table-danger-dot" style={{ backgroundColor: getDangerColor(f.danger_tl) }}>
                            {f.danger_tl}
                          </span>
                        </td>
                        <td>
                          <span className="table-danger-dot" style={{ backgroundColor: getDangerColor(f.danger_btl) }}>
                            {f.danger_btl}
                          </span>
                        </td>
                        <td className="cell-forecaster">{f.forecaster_name}</td>
                        <td>
                          <button className="table-view-btn" onClick={() => navigate(`/forecast/${f.id}`)}>
                            查看
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

// ============ DANGER TREND CHART ============
function DangerTrendChart({ data }: { data: ForecastListItem[] }) {
  if (data.length === 0) return <div className="chart-no-data">无数据</div>;

  const W = 700, H = 300;
  const ml = 50, mr = 20, mt = 30, mb = 50;
  const iw = W - ml - mr, ih = H - mt - mb;

  const minLevel = 0.5, maxLevel = 5.5;
  const range = maxLevel - minLevel;

  const x = (i: number) => ml + (i / Math.max(data.length - 1, 1)) * iw;
  const y = (level: number) => mt + ih - ((level - minLevel) / range) * ih;

  const makePath = (vals: number[]) =>
    vals.map((v, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ');

  // Background bands for danger levels
  const bands = [
    { level: 1, color: getDangerColor(1), label: '低' },
    { level: 2, color: getDangerColor(2), label: '中' },
    { level: 3, color: getDangerColor(3), label: '显著' },
    { level: 4, color: getDangerColor(4), label: '高' },
    { level: 5, color: getDangerColor(5), label: '极端' },
  ];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="dash-svg">
      {/* Danger level background bands */}
      {bands.map(b => (
        <rect
          key={b.level}
          x={ml}
          y={y(b.level + 0.5)}
          width={iw}
          height={y(b.level - 0.5) - y(b.level + 0.5)}
          fill={b.color}
          opacity="0.08"
        />
      ))}

      {/* Grid lines at each level */}
      {[1, 2, 3, 4, 5].map(level => (
        <line key={level} x1={ml} y1={y(level)} x2={W - mr} y2={y(level)}
          stroke="var(--grid-color)" strokeDasharray="3,3" />
      ))}

      {/* Lines: ALP, TL, BTL */}
      <path d={makePath(data.map(d => d.danger_alp))} fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d={makePath(data.map(d => d.danger_tl))} fill="none" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d={makePath(data.map(d => d.danger_btl))} fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="6,3" />

      {/* Dots */}
      {data.map((d, i) => (
        <g key={i}>
          <circle cx={x(i)} cy={y(d.danger_alp)} r="4" fill="#ef4444" />
          <circle cx={x(i)} cy={y(d.danger_tl)} r="3.5" fill="#f97316" />
          <circle cx={x(i)} cy={y(d.danger_btl)} r="3" fill="#3b82f6" />
        </g>
      ))}

      {/* Y axis */}
      <line x1={ml} y1={mt} x2={ml} y2={mt + ih} stroke="var(--text-tertiary)" />
      {[1, 2, 3, 4, 5].map(level => (
        <g key={`yl-${level}`}>
          <text x={ml - 8} y={y(level)} textAnchor="end" dominantBaseline="middle" className="ax-label">
            {level}
          </text>
          <text x={ml - 26} y={y(level)} textAnchor="end" dominantBaseline="middle"
            fontSize="8" fill={getDangerColor(level)} fontWeight="600">
            {bands.find(b => b.level === level)?.label}
          </text>
        </g>
      ))}

      {/* X axis */}
      <line x1={ml} y1={mt + ih} x2={W - mr} y2={mt + ih} stroke="var(--text-tertiary)" />
      {data.map((d, i) => {
        if (data.length > 12 && i % 2 !== 0 && i !== data.length - 1) return null;
        return (
          <text key={`xl-${i}`} x={x(i)} y={H - mb + 18} textAnchor="middle" className="ax-label">
            {fmtDate(d.forecast_date)}
          </text>
        );
      })}

      {/* Legend */}
      <g transform={`translate(${ml + 8}, ${mt - 10})`}>
        <circle cx="4" cy="0" r="4" fill="#ef4444" />
        <text x="12" y="0" dominantBaseline="middle" className="ax-label" fontSize="11" fontWeight="600">高山带</text>
        <circle cx="70" cy="0" r="3.5" fill="#f97316" />
        <text x="78" y="0" dominantBaseline="middle" className="ax-label" fontSize="11" fontWeight="600">林线带</text>
        <circle cx="136" cy="0" r="3" fill="#3b82f6" />
        <text x="144" y="0" dominantBaseline="middle" className="ax-label" fontSize="11" fontWeight="600">林下带</text>
      </g>
    </svg>
  );
}
