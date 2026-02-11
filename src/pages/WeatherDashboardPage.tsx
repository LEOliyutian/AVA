import { useEffect, useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { weatherApi, type WeatherObservationDetail, type StationObservationApi } from '../api/weather.api';
import './WeatherDashboardPage.css';

type DaysRange = 7 | 15 | 30;
type SortKey = 'date' | 'station' | 'temp_air' | 'snow_depth' | 'h24' | 'wind_speed';
type SortDir = 'asc' | 'desc';

const WIND_DIRS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'] as const;
const WIND_DIR_LABELS: Record<string, string> = {
  N: '北', NE: '东北', E: '东', SE: '东南',
  S: '南', SW: '西南', W: '西', NW: '西北',
};
const CLOUD_LABELS: Record<string, string> = {
  CLR: '晴', FEW: '少云', SCT: '散云', BKN: '多云', OVC: '阴', X: '—',
};

// Helper: format date string to M/D
function fmtDate(d: string) {
  const dt = new Date(d);
  return `${dt.getMonth() + 1}/${dt.getDate()}`;
}

function fmtDateFull(d: string) {
  const dt = new Date(d);
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`;
}

// Flatten records to per-station rows
interface FlatRow {
  date: string;
  station: string;
  elevation: number;
  temp_air: number;
  temp_surface: number;
  temp_10cm: number;
  snow_depth: number;
  h24: number | null;
  hst: number | null;
  wind_speed: number;
  wind_direction: string;
  cloud_cover: string;
  precipitation: string;
  temp_min: number;
  temp_max: number;
}

function flattenRecords(records: WeatherObservationDetail[], stationFilter?: string): FlatRow[] {
  const rows: FlatRow[] = [];
  for (const rec of records) {
    for (const s of rec.stations) {
      if (stationFilter && stationFilter !== '__all__' && s.name !== stationFilter) continue;
      rows.push({
        date: rec.date,
        station: s.name,
        elevation: s.elevation,
        temp_air: s.temp_air,
        temp_surface: s.temp_surface,
        temp_10cm: s.temp_10cm,
        snow_depth: s.snow_depth,
        h24: s.h24 ?? null,
        hst: s.hst ?? null,
        wind_speed: s.wind_speed,
        wind_direction: s.wind_direction,
        cloud_cover: s.cloud_cover,
        precipitation: s.precipitation,
        temp_min: rec.temp_min,
        temp_max: rec.temp_max,
      });
    }
  }
  return rows;
}

// Get per-date aggregated data for a single station
interface DatePoint {
  date: string;
  temp_air: number;
  temp_surface: number;
  temp_10cm: number;
  snow_depth: number;
  h24: number | null;
  temp_min: number;
  temp_max: number;
  wind_speed: number;
}

function getStationTimeSeries(records: WeatherObservationDetail[], station: string): DatePoint[] {
  const points: DatePoint[] = [];
  for (const rec of records) {
    const s = rec.stations.find(st => st.name === station);
    if (s) {
      points.push({
        date: rec.date,
        temp_air: s.temp_air,
        temp_surface: s.temp_surface,
        temp_10cm: s.temp_10cm,
        snow_depth: s.snow_depth,
        h24: s.h24 ?? null,
        temp_min: rec.temp_min,
        temp_max: rec.temp_max,
        wind_speed: s.wind_speed,
      });
    }
  }
  return points;
}

// ============ COMPONENT ============
export function WeatherDashboardPage() {
  const [records, setRecords] = useState<WeatherObservationDetail[]>([]);
  const [stationNames, setStationNames] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [days, setDays] = useState<DaysRange>(15);
  const [selectedStation, setSelectedStation] = useState<string>('__all__');
  const [sortKey, setSortKey] = useState<SortKey>('date');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  // Fetch data
  const fetchData = useCallback(async (d: DaysRange) => {
    setLoading(true);
    setError(null);
    const res = await weatherApi.getTrends({ days: d });
    if (res.success && res.data) {
      setRecords(res.data.records);
      setStationNames(res.data.stations);
      if (res.data.stations.length > 0 && selectedStation === '__all__') {
        // keep __all__ as default
      }
    } else {
      setError(res.error || '加载失败');
    }
    setLoading(false);
  }, [selectedStation]);

  useEffect(() => {
    fetchData(days);
  }, [days, fetchData]);

  // Derived: first station for charts when "all" selected
  const chartStation = selectedStation === '__all__'
    ? (stationNames[0] || '')
    : selectedStation;

  const timeSeries = useMemo(
    () => getStationTimeSeries(records, chartStation),
    [records, chartStation]
  );

  const flatRows = useMemo(
    () => flattenRecords(records, selectedStation),
    [records, selectedStation]
  );

  // Sort table rows
  const sortedRows = useMemo(() => {
    const sorted = [...flatRows];
    sorted.sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case 'date': cmp = a.date.localeCompare(b.date); break;
        case 'station': cmp = a.station.localeCompare(b.station); break;
        case 'temp_air': cmp = a.temp_air - b.temp_air; break;
        case 'snow_depth': cmp = a.snow_depth - b.snow_depth; break;
        case 'h24': cmp = (a.h24 ?? 0) - (b.h24 ?? 0); break;
        case 'wind_speed': cmp = a.wind_speed - b.wind_speed; break;
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return sorted;
  }, [flatRows, sortKey, sortDir]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  };

  // ===== SUMMARY CARDS DATA =====
  const summaryData = useMemo(() => {
    if (timeSeries.length === 0) return null;
    const latest = timeSeries[timeSeries.length - 1];
    const earliest = timeSeries[0];
    const tempTrend = latest.temp_air - earliest.temp_air;

    // Latest H24
    const latestH24 = latest.h24 ?? 0;
    // Cumulative H24
    const totalH24 = timeSeries.reduce((s, p) => s + (p.h24 ?? 0), 0);

    // Snow depth change
    const hsChange = latest.snow_depth - earliest.snow_depth;

    // Wind stats
    const avgWind = timeSeries.reduce((s, p) => s + p.wind_speed, 0) / timeSeries.length;
    const maxWind = Math.max(...timeSeries.map(p => p.wind_speed));

    return {
      tempLatest: latest.temp_air,
      tempTrend,
      latestH24,
      totalH24,
      hsLatest: latest.snow_depth,
      hsChange,
      avgWind: Math.round(avgWind),
      maxWind,
    };
  }, [timeSeries]);

  // ===== WIND ROSE DATA =====
  const windRoseData = useMemo(() => {
    const allStations: StationObservationApi[] = [];
    const filteredRecords = records;
    for (const rec of filteredRecords) {
      for (const s of rec.stations) {
        if (selectedStation !== '__all__' && s.name !== selectedStation) continue;
        allStations.push(s);
      }
    }
    if (allStations.length === 0) return null;

    const dirData: Record<string, { count: number; totalSpeed: number }> = {};
    for (const d of WIND_DIRS) {
      dirData[d] = { count: 0, totalSpeed: 0 };
    }
    for (const s of allStations) {
      const d = s.wind_direction;
      if (dirData[d]) {
        dirData[d].count++;
        dirData[d].totalSpeed += s.wind_speed;
      }
    }
    const maxCount = Math.max(...Object.values(dirData).map(d => d.count), 1);
    return { dirData, maxCount, total: allStations.length };
  }, [records, selectedStation]);

  // ===== HEATMAP DATA =====
  const heatmapData = useMemo(() => {
    // Get unique dates and stations (sorted by elevation desc)
    const dates = [...new Set(records.map(r => r.date))].sort();
    const stationInfo: { name: string; elevation: number }[] = [];
    const seen = new Set<string>();
    for (const rec of records) {
      for (const s of [...rec.stations].sort((a, b) => b.elevation - a.elevation)) {
        if (!seen.has(s.name)) {
          seen.add(s.name);
          stationInfo.push({ name: s.name, elevation: s.elevation });
        }
      }
    }
    stationInfo.sort((a, b) => b.elevation - a.elevation);

    // Build matrix
    const matrix: (number | null)[][] = stationInfo.map(() => dates.map(() => null));
    for (const rec of records) {
      const di = dates.indexOf(rec.date);
      for (const s of rec.stations) {
        const si = stationInfo.findIndex(st => st.name === s.name);
        if (si >= 0 && di >= 0) {
          matrix[si][di] = s.temp_air;
        }
      }
    }

    // Temp range
    const allTemps = matrix.flat().filter(v => v !== null) as number[];
    const minT = allTemps.length ? Math.min(...allTemps) : -20;
    const maxT = allTemps.length ? Math.max(...allTemps) : 5;

    return { dates, stationInfo, matrix, minT, maxT };
  }, [records]);

  // ===== RENDER =====
  return (
    <div className="weather-dashboard">
      {/* Header */}
      <header className="dash-header">
        <div className="dash-header-left">
          <Link to="/weather/list" className="dash-back-btn">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>气象记录</span>
          </Link>
          <div className="dash-title-group">
            <h1 className="dash-title">趋势分析</h1>
            <span className="dash-subtitle">Trend Analysis</span>
          </div>
        </div>
        <div className="dash-header-right">
          <div className="dash-filter-group">
            <select
              className="dash-select"
              value={selectedStation}
              onChange={e => setSelectedStation(e.target.value)}
            >
              <option value="__all__">全部站点</option>
              {stationNames.map(n => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
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
      ) : records.length === 0 ? (
        <div className="dash-empty">
          <div className="dash-empty-icon">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
              <rect x="8" y="16" width="48" height="36" rx="4" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4"/>
              <path d="M16 40L24 32L32 36L40 24L48 28" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <p>暂无趋势数据</p>
          <span>请先创建气象观测记录</span>
        </div>
      ) : (
        <div className="dash-content">
          {/* Summary Cards */}
          <section className="dash-cards">
            <SummaryCard
              label="气温趋势"
              sublabel="Temperature"
              value={summaryData ? `${summaryData.tempLatest.toFixed(1)}°C` : '—'}
              detail={summaryData ? `${summaryData.tempTrend >= 0 ? '+' : ''}${summaryData.tempTrend.toFixed(1)}°C / ${days}天` : ''}
              trend={summaryData ? (summaryData.tempTrend > 0.5 ? 'up' : summaryData.tempTrend < -0.5 ? 'down' : 'flat') : 'flat'}
              color="#f97316"
            />
            <SummaryCard
              label="24h新雪"
              sublabel="New Snow"
              value={summaryData ? `${summaryData.latestH24}cm` : '—'}
              detail={summaryData ? `累计 ${summaryData.totalH24.toFixed(0)}cm` : ''}
              trend={summaryData && summaryData.latestH24 > 10 ? 'up' : 'flat'}
              color="#a855f7"
            />
            <SummaryCard
              label="总雪深"
              sublabel="Snow Depth"
              value={summaryData ? `${summaryData.hsLatest.toFixed(0)}cm` : '—'}
              detail={summaryData ? `${summaryData.hsChange >= 0 ? '+' : ''}${summaryData.hsChange.toFixed(0)}cm` : ''}
              trend={summaryData ? (summaryData.hsChange > 5 ? 'up' : summaryData.hsChange < -5 ? 'down' : 'flat') : 'flat'}
              color="#3b82f6"
            />
            <SummaryCard
              label="风速"
              sublabel="Wind Speed"
              value={summaryData ? `${summaryData.avgWind}km/h` : '—'}
              detail={summaryData ? `最大阵风 ${summaryData.maxWind}km/h` : ''}
              trend={summaryData && summaryData.maxWind > 40 ? 'up' : 'flat'}
              color="#22d3ee"
            />
          </section>

          {/* Charts Row 1: Temperature + Snow Depth */}
          <section className="dash-charts-row">
            <div className="dash-chart-card">
              <div className="chart-card-header">
                <h3>温度变化</h3>
                <span className="chart-station-tag">{chartStation}</span>
              </div>
              <TemperatureChart data={timeSeries} />
            </div>
            <div className="dash-chart-card">
              <div className="chart-card-header">
                <h3>雪深变化</h3>
                <span className="chart-station-tag">{chartStation}</span>
              </div>
              <SnowDepthChart data={timeSeries} />
            </div>
          </section>

          {/* Charts Row 2: Heatmap + Wind Rose */}
          <section className="dash-charts-row">
            <div className="dash-chart-card dash-chart-wide">
              <div className="chart-card-header">
                <h3>温度梯度</h3>
                <span className="chart-station-tag">全站点 &times; 日期</span>
              </div>
              <HeatmapChart data={heatmapData} />
            </div>
            <div className="dash-chart-card dash-chart-narrow">
              <div className="chart-card-header">
                <h3>风向频率</h3>
                <span className="chart-station-tag">{selectedStation === '__all__' ? '全部' : selectedStation}</span>
              </div>
              {windRoseData ? <WindRoseChart data={windRoseData} /> : <div className="chart-no-data">无数据</div>}
            </div>
          </section>

          {/* Data Table */}
          <section className="dash-table-section">
            <div className="table-section-header">
              <h3>历史数据明细</h3>
              <span className="table-count">{sortedRows.length} 条记录</span>
            </div>
            <div className="dash-table-wrap">
              <table className="dash-table">
                <thead>
                  <tr>
                    <Th label="日期" sortKey="date" currentKey={sortKey} dir={sortDir} onSort={handleSort} />
                    <Th label="站点" sortKey="station" currentKey={sortKey} dir={sortDir} onSort={handleSort} />
                    <Th label="气温°C" sortKey="temp_air" currentKey={sortKey} dir={sortDir} onSort={handleSort} />
                    <th>雪面°C</th>
                    <th>10cm°C</th>
                    <Th label="雪深cm" sortKey="snow_depth" currentKey={sortKey} dir={sortDir} onSort={handleSort} />
                    <Th label="H24cm" sortKey="h24" currentKey={sortKey} dir={sortDir} onSort={handleSort} />
                    <th>风向</th>
                    <Th label="风速km/h" sortKey="wind_speed" currentKey={sortKey} dir={sortDir} onSort={handleSort} />
                    <th>云量</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedRows.map((row, i) => (
                    <tr key={`${row.date}-${row.station}-${i}`}>
                      <td className="cell-date">{fmtDateFull(row.date)}</td>
                      <td className="cell-station">
                        <span>{row.station}</span>
                        <small>{row.elevation}m</small>
                      </td>
                      <td className={`cell-mono ${Math.abs(row.temp_air) <= 1 ? 'cell-warn-temp' : ''}`}>
                        {row.temp_air.toFixed(1)}
                      </td>
                      <td className="cell-mono">{row.temp_surface.toFixed(1)}</td>
                      <td className="cell-mono">{row.temp_10cm.toFixed(1)}</td>
                      <td className="cell-mono">{row.snow_depth.toFixed(0)}</td>
                      <td className={`cell-mono ${row.h24 !== null && row.h24 > 20 ? 'cell-warn-snow' : ''}`}>
                        {row.h24 !== null ? row.h24.toFixed(0) : '—'}
                      </td>
                      <td className="cell-wind-dir">{WIND_DIR_LABELS[row.wind_direction] || row.wind_direction}</td>
                      <td className={`cell-mono ${row.wind_speed > 40 ? 'cell-warn-wind' : ''}`}>
                        {row.wind_speed.toFixed(0)}
                      </td>
                      <td className="cell-cloud">{CLOUD_LABELS[row.cloud_cover] || row.cloud_cover}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

// ============ SUB-COMPONENTS ============

function SummaryCard({ label, sublabel, value, detail, trend, color }: {
  label: string;
  sublabel: string;
  value: string;
  detail: string;
  trend: 'up' | 'down' | 'flat';
  color: string;
}) {
  const arrows = { up: '\u2197', down: '\u2198', flat: '\u2192' };
  return (
    <div className="summary-card" style={{ '--card-accent': color } as React.CSSProperties}>
      <div className="card-accent-bar" />
      <div className="card-body">
        <div className="card-label-row">
          <span className="card-label">{label}</span>
          <span className="card-sublabel">{sublabel}</span>
        </div>
        <div className="card-value-row">
          <span className="card-value">{value}</span>
          <span className={`card-trend trend-${trend}`}>{arrows[trend]}</span>
        </div>
        <div className="card-detail">{detail}</div>
      </div>
    </div>
  );
}

// Sortable TH
function Th({ label, sortKey: sk, currentKey, dir, onSort }: {
  label: string;
  sortKey: SortKey;
  currentKey: SortKey;
  dir: SortDir;
  onSort: (k: SortKey) => void;
}) {
  const active = sk === currentKey;
  return (
    <th className={`sortable ${active ? 'sort-active' : ''}`} onClick={() => onSort(sk)}>
      {label}
      {active && <span className="sort-arrow">{dir === 'asc' ? ' \u25B2' : ' \u25BC'}</span>}
    </th>
  );
}

// ============ TEMPERATURE CHART ============
function TemperatureChart({ data }: { data: DatePoint[] }) {
  if (data.length === 0) return <div className="chart-no-data">无数据</div>;

  const W = 560, H = 280;
  const ml = 50, mr = 20, mt = 20, mb = 50;
  const iw = W - ml - mr, ih = H - mt - mb;

  const allTemps = data.flatMap(d => [d.temp_air, d.temp_surface, d.temp_10cm, d.temp_min, d.temp_max]);
  const minT = Math.floor(Math.min(...allTemps) - 3);
  const maxT = Math.ceil(Math.max(...allTemps) + 3);
  const range = maxT - minT || 1;

  const x = (i: number) => ml + (i / Math.max(data.length - 1, 1)) * iw;
  const y = (t: number) => mt + ih - ((t - minT) / range) * ih;

  const makePath = (vals: number[]) => {
    return vals.map((v, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ');
  };

  // Min/Max band fill
  const bandPath = data.map((d, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(d.temp_max).toFixed(1)}`).join(' ')
    + data.map((d, i) => `L${x(data.length - 1 - i).toFixed(1)},${y(data[data.length - 1 - i].temp_min).toFixed(1)}`).join(' ')
    + 'Z';

  // Ticks
  const step = Math.ceil(range / 6);
  const ticks: number[] = [];
  for (let t = Math.ceil(minT / step) * step; t <= maxT; t += step) ticks.push(t);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="dash-svg">
      <defs>
        <linearGradient id="tempBandGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f97316" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.06" />
        </linearGradient>
      </defs>

      {/* Grid */}
      {ticks.map(t => (
        <line key={t} x1={ml} y1={y(t)} x2={W - mr} y2={y(t)}
          stroke="var(--grid-color)" strokeDasharray="3,3" />
      ))}

      {/* Zero line */}
      {minT < 0 && maxT > 0 && (
        <line x1={ml} y1={y(0)} x2={W - mr} y2={y(0)}
          stroke="#ef4444" strokeWidth="1" strokeDasharray="6,3" opacity="0.5" />
      )}

      {/* Min/Max band */}
      <path d={bandPath} fill="url(#tempBandGrad)" />

      {/* Lines */}
      <path d={makePath(data.map(d => d.temp_air))} fill="none" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d={makePath(data.map(d => d.temp_surface))} fill="none" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d={makePath(data.map(d => d.temp_10cm))} fill="none" stroke="#a855f7" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="5,3" />

      {/* Dots */}
      {data.map((d, i) => (
        <g key={i}>
          <circle cx={x(i)} cy={y(d.temp_air)} r="3.5" fill="#f97316" />
          <circle cx={x(i)} cy={y(d.temp_surface)} r="3" fill="#22d3ee" />
          <circle cx={x(i)} cy={y(d.temp_10cm)} r="2.5" fill="#a855f7" />
        </g>
      ))}

      {/* Y axis */}
      <line x1={ml} y1={mt} x2={ml} y2={mt + ih} stroke="var(--text-tertiary)" />
      {ticks.map(t => (
        <text key={`yl-${t}`} x={ml - 8} y={y(t)} textAnchor="end" dominantBaseline="middle" className="ax-label">{t}°</text>
      ))}

      {/* X axis */}
      <line x1={ml} y1={mt + ih} x2={W - mr} y2={mt + ih} stroke="var(--text-tertiary)" />
      {data.map((d, i) => {
        // Show every other label if too many
        if (data.length > 10 && i % 2 !== 0 && i !== data.length - 1) return null;
        return (
          <text key={`xl-${i}`} x={x(i)} y={H - mb + 18} textAnchor="middle" className="ax-label">{fmtDate(d.date)}</text>
        );
      })}

      {/* Legend */}
      <g transform={`translate(${ml + 8}, ${mt + 6})`}>
        <line x1="0" y1="0" x2="14" y2="0" stroke="#f97316" strokeWidth="2.5" />
        <text x="18" y="0" dominantBaseline="middle" className="ax-label" fontSize="10">气温</text>
        <line x1="50" y1="0" x2="64" y2="0" stroke="#22d3ee" strokeWidth="2" />
        <text x="68" y="0" dominantBaseline="middle" className="ax-label" fontSize="10">雪面</text>
        <line x1="100" y1="0" x2="114" y2="0" stroke="#a855f7" strokeWidth="1.5" strokeDasharray="4,2" />
        <text x="118" y="0" dominantBaseline="middle" className="ax-label" fontSize="10">10cm</text>
      </g>
    </svg>
  );
}

// ============ SNOW DEPTH CHART ============
function SnowDepthChart({ data }: { data: DatePoint[] }) {
  if (data.length === 0) return <div className="chart-no-data">无数据</div>;

  const W = 560, H = 280;
  const ml = 50, mr = 50, mt = 20, mb = 50;
  const iw = W - ml - mr, ih = H - mt - mb;

  const maxHS = Math.max(...data.map(d => d.snow_depth), 50) * 1.15;
  const maxH24 = Math.max(...data.map(d => d.h24 ?? 0), 10) * 1.3;

  const x = (i: number) => ml + (i / Math.max(data.length - 1, 1)) * iw;
  const yHS = (v: number) => mt + ih - (v / maxHS) * ih;
  const yH24 = (v: number) => mt + ih - (v / maxH24) * ih;

  const barW = Math.min(24, iw / data.length - 4);

  // HS line path
  const hsPath = data.map((d, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${yHS(d.snow_depth).toFixed(1)}`).join(' ');

  // HS ticks
  const hsStep = Math.ceil(maxHS / 5 / 10) * 10;
  const hsTicks: number[] = [];
  for (let v = 0; v <= maxHS; v += hsStep) hsTicks.push(v);

  // H24 ticks
  const h24Step = Math.ceil(maxH24 / 4 / 5) * 5;
  const h24Ticks: number[] = [];
  for (let v = 0; v <= maxH24; v += h24Step) h24Ticks.push(v);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="dash-svg">
      <defs>
        <linearGradient id="h24BarGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.6" />
        </linearGradient>
        <linearGradient id="hsAreaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.02" />
        </linearGradient>
      </defs>

      {/* Grid */}
      {hsTicks.map(v => (
        <line key={`g-${v}`} x1={ml} y1={yHS(v)} x2={W - mr} y2={yHS(v)}
          stroke="var(--grid-color)" strokeDasharray="3,3" />
      ))}

      {/* H24 bars */}
      {data.map((d, i) => {
        if (d.h24 === null || d.h24 === 0) return null;
        const bx = x(i) - barW / 2;
        const by = yH24(d.h24);
        const bh = mt + ih - by;
        return (
          <g key={`bar-${i}`}>
            <rect x={bx} y={by} width={barW} height={bh} fill="url(#h24BarGrad)" rx="3" />
            {d.h24 > 5 && (
              <text x={x(i)} y={by - 4} textAnchor="middle" className="ax-label" fontSize="9">{d.h24.toFixed(0)}</text>
            )}
          </g>
        );
      })}

      {/* HS area fill */}
      <path
        d={hsPath + `L${x(data.length - 1).toFixed(1)},${(mt + ih).toFixed(1)} L${ml.toFixed(1)},${(mt + ih).toFixed(1)}Z`}
        fill="url(#hsAreaGrad)"
      />
      {/* HS line */}
      <path d={hsPath} fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* HS dots */}
      {data.map((d, i) => (
        <circle key={`hsd-${i}`} cx={x(i)} cy={yHS(d.snow_depth)} r="3" fill="#3b82f6" />
      ))}

      {/* Left Y axis - HS */}
      <line x1={ml} y1={mt} x2={ml} y2={mt + ih} stroke="var(--text-tertiary)" />
      {hsTicks.map(v => (
        <text key={`hst-${v}`} x={ml - 8} y={yHS(v)} textAnchor="end" dominantBaseline="middle" className="ax-label">{v}</text>
      ))}
      <text x={14} y={mt + ih / 2} textAnchor="middle" dominantBaseline="middle"
        transform={`rotate(-90, 14, ${mt + ih / 2})`} className="ax-title">HS (cm)</text>

      {/* Right Y axis - H24 */}
      <line x1={W - mr} y1={mt} x2={W - mr} y2={mt + ih} stroke="var(--text-tertiary)" />
      {h24Ticks.map(v => (
        <text key={`h24t-${v}`} x={W - mr + 8} y={yH24(v)} textAnchor="start" dominantBaseline="middle" className="ax-label">{v}</text>
      ))}
      <text x={W - 10} y={mt + ih / 2} textAnchor="middle" dominantBaseline="middle"
        transform={`rotate(90, ${W - 10}, ${mt + ih / 2})`} className="ax-title">H24 (cm)</text>

      {/* X axis */}
      <line x1={ml} y1={mt + ih} x2={W - mr} y2={mt + ih} stroke="var(--text-tertiary)" />
      {data.map((d, i) => {
        if (data.length > 10 && i % 2 !== 0 && i !== data.length - 1) return null;
        return (
          <text key={`sx-${i}`} x={x(i)} y={H - mb + 18} textAnchor="middle" className="ax-label">{fmtDate(d.date)}</text>
        );
      })}

      {/* Legend */}
      <g transform={`translate(${ml + 8}, ${mt + 6})`}>
        <rect x="0" y="-5" width="10" height="10" rx="2" fill="url(#h24BarGrad)" />
        <text x="14" y="0" dominantBaseline="middle" className="ax-label" fontSize="10">H24</text>
        <line x1="42" y1="0" x2="56" y2="0" stroke="#3b82f6" strokeWidth="2.5" />
        <text x="60" y="0" dominantBaseline="middle" className="ax-label" fontSize="10">HS</text>
      </g>
    </svg>
  );
}

// ============ HEATMAP CHART ============
function HeatmapChart({ data }: { data: { dates: string[]; stationInfo: { name: string; elevation: number }[]; matrix: (number | null)[][]; minT: number; maxT: number } }) {
  const { dates, stationInfo, matrix, minT, maxT } = data;
  if (dates.length === 0 || stationInfo.length === 0) return <div className="chart-no-data">无数据</div>;

  const cellW = Math.min(40, 600 / dates.length);
  const cellH = 36;
  const labelW = 100;
  const topH = 30;
  const W = labelW + dates.length * cellW + 60; // extra for color bar
  const H = topH + stationInfo.length * cellH + 10;

  function tempColor(t: number | null): string {
    if (t === null) return 'transparent';
    const ratio = Math.max(0, Math.min(1, (t - minT) / (maxT - minT || 1)));
    // Blue (cold) -> White (mid) -> Red (warm)
    if (ratio < 0.5) {
      const r2 = ratio * 2;
      const r = Math.round(60 + r2 * 195);
      const g = Math.round(100 + r2 * 155);
      const b = Math.round(220 - r2 * 20);
      return `rgb(${r},${g},${b})`;
    } else {
      const r2 = (ratio - 0.5) * 2;
      const r = Math.round(255);
      const g = Math.round(255 - r2 * 175);
      const b = Math.round(200 - r2 * 180);
      return `rgb(${r},${g},${b})`;
    }
  }

  return (
    <div className="heatmap-container">
      <svg viewBox={`0 0 ${W} ${H}`} className="dash-svg heatmap-svg">
        {/* Date labels */}
        {dates.map((d, di) => (
          <text key={`hd-${di}`} x={labelW + di * cellW + cellW / 2} y={topH - 6}
            textAnchor="middle" className="ax-label" fontSize="9">{fmtDate(d)}</text>
        ))}

        {/* Station labels + cells */}
        {stationInfo.map((st, si) => (
          <g key={`hs-${si}`}>
            <text x={labelW - 6} y={topH + si * cellH + cellH / 2}
              textAnchor="end" dominantBaseline="middle" className="ax-label" fontSize="10">
              {st.name} {st.elevation}m
            </text>
            {dates.map((_, di) => {
              const val = matrix[si][di];
              return (
                <g key={`cell-${si}-${di}`}>
                  <rect
                    x={labelW + di * cellW + 1}
                    y={topH + si * cellH + 1}
                    width={cellW - 2}
                    height={cellH - 2}
                    rx="4"
                    fill={tempColor(val)}
                    opacity={val === null ? 0.1 : 0.85}
                  />
                  {val !== null && cellW >= 28 && (
                    <text
                      x={labelW + di * cellW + cellW / 2}
                      y={topH + si * cellH + cellH / 2}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize="10"
                      fontWeight="600"
                      fill={Math.abs(val - (minT + maxT) / 2) > (maxT - minT) * 0.3 ? '#fff' : '#1a202c'}
                    >
                      {val.toFixed(0)}°
                    </text>
                  )}
                </g>
              );
            })}
          </g>
        ))}

        {/* Color legend bar */}
        <defs>
          <linearGradient id="heatGrad" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="rgb(60,100,220)" />
            <stop offset="50%" stopColor="rgb(255,255,200)" />
            <stop offset="100%" stopColor="rgb(255,80,20)" />
          </linearGradient>
        </defs>
        <rect x={W - 40} y={topH} width={14} height={stationInfo.length * cellH}
          rx="4" fill="url(#heatGrad)" />
        <text x={W - 22} y={topH + 4} className="ax-label" fontSize="9" dominantBaseline="hanging">{maxT.toFixed(0)}°</text>
        <text x={W - 22} y={topH + stationInfo.length * cellH - 2} className="ax-label" fontSize="9" dominantBaseline="auto">{minT.toFixed(0)}°</text>
      </svg>
    </div>
  );
}

// ============ WIND ROSE CHART ============
function WindRoseChart({ data }: { data: { dirData: Record<string, { count: number; totalSpeed: number }>; maxCount: number; total: number } }) {
  const { dirData, maxCount, total } = data;
  const size = 240;
  const cx = size / 2, cy = size / 2;
  const maxR = size / 2 - 36;

  const angles: Record<string, number> = {
    N: -90, NE: -45, E: 0, SE: 45, S: 90, SW: 135, W: 180, NW: -135,
  };

  return (
    <div className="wind-rose-wrap">
      <svg viewBox={`0 0 ${size} ${size}`} className="dash-svg wind-rose-svg">
        {/* Concentric circles */}
        {[0.25, 0.5, 0.75, 1].map(r => (
          <circle key={r} cx={cx} cy={cy} r={maxR * r}
            fill="none" stroke="var(--grid-color)" strokeDasharray={r < 1 ? '2,3' : 'none'} />
        ))}

        {/* Direction lines */}
        {WIND_DIRS.map(d => {
          const a = (angles[d] * Math.PI) / 180;
          return (
            <line key={`l-${d}`}
              x1={cx} y1={cy}
              x2={cx + Math.cos(a) * maxR} y2={cy + Math.sin(a) * maxR}
              stroke="var(--grid-color)" />
          );
        })}

        {/* Petals */}
        {WIND_DIRS.map(d => {
          const { count, totalSpeed } = dirData[d];
          if (count === 0) return null;
          const a = (angles[d] * Math.PI) / 180;
          const r = (count / maxCount) * maxR;
          const avgSpeed = totalSpeed / count;
          // Petal as a triangle-ish shape
          const halfAngle = Math.PI / 12; // 15 degrees width
          const x1 = cx + Math.cos(a - halfAngle) * r * 0.4;
          const y1 = cy + Math.sin(a - halfAngle) * r * 0.4;
          const x2 = cx + Math.cos(a) * r;
          const y2 = cy + Math.sin(a) * r;
          const x3 = cx + Math.cos(a + halfAngle) * r * 0.4;
          const y3 = cy + Math.sin(a + halfAngle) * r * 0.4;

          const opacity = 0.4 + Math.min(avgSpeed / 50, 0.6);
          const color = avgSpeed > 40 ? '#f97316' : avgSpeed > 25 ? '#22d3ee' : '#60a5fa';

          return (
            <g key={`p-${d}`}>
              <path
                d={`M${cx},${cy} L${x1.toFixed(1)},${y1.toFixed(1)} L${x2.toFixed(1)},${y2.toFixed(1)} L${x3.toFixed(1)},${y3.toFixed(1)} Z`}
                fill={color}
                opacity={opacity}
                stroke={color}
                strokeWidth="1"
              />
              {count > 0 && (
                <text
                  x={cx + Math.cos(a) * (r + 10)}
                  y={cy + Math.sin(a) * (r + 10)}
                  textAnchor="middle" dominantBaseline="middle"
                  className="ax-label" fontSize="8"
                >
                  {((count / total) * 100).toFixed(0)}%
                </text>
              )}
            </g>
          );
        })}

        {/* Direction labels */}
        {WIND_DIRS.map(d => {
          const a = (angles[d] * Math.PI) / 180;
          const lr = maxR + 20;
          return (
            <text key={`dl-${d}`}
              x={cx + Math.cos(a) * lr} y={cy + Math.sin(a) * lr}
              textAnchor="middle" dominantBaseline="middle"
              className="ax-label wind-dir-label" fontSize="11" fontWeight="600">
              {WIND_DIR_LABELS[d]}
            </text>
          );
        })}

        {/* Center dot */}
        <circle cx={cx} cy={cy} r="3" fill="var(--text-muted)" />
      </svg>
      <div className="wind-rose-legend">
        <div className="wr-leg-item">
          <span className="wr-dot" style={{ background: '#60a5fa' }} />
          <span>&lt;25 km/h</span>
        </div>
        <div className="wr-leg-item">
          <span className="wr-dot" style={{ background: '#22d3ee' }} />
          <span>25-40 km/h</span>
        </div>
        <div className="wr-leg-item">
          <span className="wr-dot" style={{ background: '#f97316' }} />
          <span>&gt;40 km/h</span>
        </div>
      </div>
    </div>
  );
}
