import { useMemo } from 'react';
import type { StationEditorState } from '../../store/weather.store';
import './WeatherChart.css';

interface WeatherChartProps {
  stations: StationEditorState[];
  tempMin: number | '';
  tempMax: number | '';
}

// 云量图标
const cloudIcons: Record<string, string> = {
  CLR: '☀️',
  FEW: '🌤',
  SCT: '⛅',
  BKN: '☁️',
  OVC: '☁️',
  X: '🌫',
};

// 降水图标
const precipIcons: Record<string, string> = {
  '无': '',
  '小雪': '❄',
  '中雪': '❄❄',
  '大雪': '❄❄❄',
  '雨': '🌧',
  '雨夹雪': '🌧❄',
  '冻雨': '🧊',
};

export function WeatherChart({ stations, tempMin, tempMax }: WeatherChartProps) {
  // 按海拔排序站点（高到低）
  const sortedStations = useMemo(() => {
    return [...stations]
      .filter((s) => s.elevation !== '')
      .sort((a, b) => (Number(b.elevation) || 0) - (Number(a.elevation) || 0));
  }, [stations]);

  // 计算数据范围
  const { minTemp, maxTemp, maxSnowDepth, maxH24 } = useMemo(() => {
    let minT = tempMin === '' ? 0 : tempMin;
    let maxT = tempMax === '' ? 0 : tempMax;
    let maxHS = 0;
    let maxH = 0;

    sortedStations.forEach((s) => {
      if (s.tempAir !== '') {
        minT = Math.min(minT, s.tempAir);
        maxT = Math.max(maxT, s.tempAir);
      }
      if (s.tempSurface !== '') {
        minT = Math.min(minT, s.tempSurface);
        maxT = Math.max(maxT, s.tempSurface);
      }
      if (s.temp10cm !== '') {
        minT = Math.min(minT, s.temp10cm);
        maxT = Math.max(maxT, s.temp10cm);
      }
      if (s.snowDepth !== '') {
        maxHS = Math.max(maxHS, s.snowDepth);
      }
      if (s.h24 !== '') {
        maxH = Math.max(maxH, s.h24);
      }
    });

    // 扩展温度范围以留出空间
    const tempPadding = Math.max(5, (maxT - minT) * 0.2);
    return {
      minTemp: Math.floor(minT - tempPadding),
      maxTemp: Math.ceil(maxT + tempPadding),
      maxSnowDepth: Math.max(100, maxHS * 1.2),
      maxH24: Math.max(30, maxH * 1.2),
    };
  }, [sortedStations, tempMin, tempMax]);

  // 图表尺寸
  const chartWidth = 600;
  const chartHeight = 400;
  const marginLeft = 60;
  const marginRight = 60;
  const marginTop = 40;
  const marginBottom = 95;
  const innerWidth = chartWidth - marginLeft - marginRight;
  const innerHeight = chartHeight - marginTop - marginBottom;

  // X 轴位置计算（按海拔分布）
  const getX = (index: number) => {
    if (sortedStations.length <= 1) return marginLeft + innerWidth / 2;
    return marginLeft + (index / (sortedStations.length - 1)) * innerWidth;
  };

  // 温度 Y 轴
  const getTempY = (temp: number) => {
    const ratio = (temp - minTemp) / (maxTemp - minTemp);
    return marginTop + innerHeight - ratio * innerHeight;
  };

  // 雪深 Y 轴（右侧）
  const getSnowY = (depth: number) => {
    const ratio = depth / maxSnowDepth;
    return marginTop + innerHeight - ratio * innerHeight;
  };

  // 温度刻度
  const tempTicks = useMemo(() => {
    const step = Math.ceil((maxTemp - minTemp) / 5);
    const ticks = [];
    for (let t = Math.ceil(minTemp / step) * step; t <= maxTemp; t += step) {
      ticks.push(t);
    }
    return ticks;
  }, [minTemp, maxTemp]);

  // 雪深刻度
  const snowTicks = useMemo(() => {
    const step = Math.ceil(maxSnowDepth / 5 / 10) * 10;
    const ticks = [];
    for (let s = 0; s <= maxSnowDepth; s += step) {
      ticks.push(s);
    }
    return ticks;
  }, [maxSnowDepth]);

  // 生成温度曲线路径
  const generateTempPath = (getValue: (s: StationEditorState) => number | '') => {
    const points = sortedStations
      .map((s, i) => {
        const val = getValue(s);
        if (val === '') return null;
        return { x: getX(i), y: getTempY(val) };
      })
      .filter((p) => p !== null) as { x: number; y: number }[];

    if (points.length < 2) return '';
    return points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  };

  const airTempPath = generateTempPath((s) => s.tempAir);
  const surfaceTempPath = generateTempPath((s) => s.tempSurface);
  const snowTempPath = generateTempPath((s) => s.temp10cm);

  if (sortedStations.length === 0) {
    return (
      <div className="weather-chart-empty">
        <div className="empty-icon">📊</div>
        <p>添加站点数据后将显示图表</p>
      </div>
    );
  }

  return (
    <div className="weather-chart">
      <div className="chart-title">气象观测数据图表</div>

      <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="chart-svg">
        {/* 背景网格 */}
        <defs>
          <linearGradient id="snowBarGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.6" />
          </linearGradient>
          <linearGradient id="h24Gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.7" />
          </linearGradient>
        </defs>

        {/* 网格线 */}
        <g className="grid-lines">
          {tempTicks.map((t) => (
            <line
              key={`grid-${t}`}
              x1={marginLeft}
              y1={getTempY(t)}
              x2={chartWidth - marginRight}
              y2={getTempY(t)}
              stroke="var(--grid-color)"
              strokeDasharray="4,4"
            />
          ))}
        </g>

        {/* 零度线 */}
        {minTemp < 0 && maxTemp > 0 && (
          <line
            x1={marginLeft}
            y1={getTempY(0)}
            x2={chartWidth - marginRight}
            y2={getTempY(0)}
            stroke="#ef4444"
            strokeWidth="1"
            strokeDasharray="6,3"
            opacity="0.6"
          />
        )}

        {/* 雪深柱状图 */}
        <g className="snow-bars">
          {sortedStations.map((s, i) => {
            const x = getX(i);
            const barWidth = Math.min(40, innerWidth / sortedStations.length - 10);

            return (
              <g key={`snow-${s.id}`}>
                {/* 总雪深 */}
                {s.snowDepth !== '' && (
                  <rect
                    x={x - barWidth / 2 - 8}
                    y={getSnowY(s.snowDepth)}
                    width={barWidth / 2}
                    height={marginTop + innerHeight - getSnowY(s.snowDepth)}
                    fill="url(#snowBarGradient)"
                    rx="3"
                  />
                )}
                {/* 24小时新雪 */}
                {s.h24 !== '' && (
                  <rect
                    x={x + 8}
                    y={getSnowY((s.h24 / maxH24) * maxSnowDepth)}
                    width={barWidth / 2}
                    height={marginTop + innerHeight - getSnowY((s.h24 / maxH24) * maxSnowDepth)}
                    fill="url(#h24Gradient)"
                    rx="3"
                  />
                )}
              </g>
            );
          })}
        </g>

        {/* 温度曲线 */}
        <g className="temp-lines">
          {/* 空气温度 */}
          {airTempPath && (
            <path
              d={airTempPath}
              fill="none"
              stroke="#f97316"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
          {/* 雪表温度 */}
          {surfaceTempPath && (
            <path
              d={surfaceTempPath}
              fill="none"
              stroke="#22d3ee"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
          {/* 10cm雪温 */}
          {snowTempPath && (
            <path
              d={snowTempPath}
              fill="none"
              stroke="#a855f7"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="6,3"
            />
          )}
        </g>

        {/* 数据点 */}
        <g className="data-points">
          {sortedStations.map((s, i) => {
            const x = getX(i);
            return (
              <g key={`points-${s.id}`}>
                {s.tempAir !== '' && (
                  <circle cx={x} cy={getTempY(s.tempAir)} r="5" fill="#f97316" />
                )}
                {s.tempSurface !== '' && (
                  <circle cx={x} cy={getTempY(s.tempSurface)} r="5" fill="#22d3ee" />
                )}
                {s.temp10cm !== '' && (
                  <circle cx={x} cy={getTempY(s.temp10cm)} r="4" fill="#a855f7" />
                )}
              </g>
            );
          })}
        </g>

        {/* 左侧Y轴 - 温度 */}
        <g className="y-axis-left">
          <line
            x1={marginLeft}
            y1={marginTop}
            x2={marginLeft}
            y2={marginTop + innerHeight}
            stroke="var(--text-tertiary)"
          />
          {tempTicks.map((t) => (
            <g key={`temp-tick-${t}`}>
              <line
                x1={marginLeft - 5}
                y1={getTempY(t)}
                x2={marginLeft}
                y2={getTempY(t)}
                stroke="var(--text-tertiary)"
              />
              <text
                x={marginLeft - 10}
                y={getTempY(t)}
                textAnchor="end"
                dominantBaseline="middle"
                className="axis-label"
              >
                {t}°
              </text>
            </g>
          ))}
          <text
            x={20}
            y={marginTop + innerHeight / 2}
            textAnchor="middle"
            dominantBaseline="middle"
            transform={`rotate(-90, 20, ${marginTop + innerHeight / 2})`}
            className="axis-title"
          >
            温度 (°C)
          </text>
        </g>

        {/* 右侧Y轴 - 雪深 */}
        <g className="y-axis-right">
          <line
            x1={chartWidth - marginRight}
            y1={marginTop}
            x2={chartWidth - marginRight}
            y2={marginTop + innerHeight}
            stroke="var(--text-tertiary)"
          />
          {snowTicks.map((s) => (
            <g key={`snow-tick-${s}`}>
              <line
                x1={chartWidth - marginRight}
                y1={getSnowY(s)}
                x2={chartWidth - marginRight + 5}
                y2={getSnowY(s)}
                stroke="var(--text-tertiary)"
              />
              <text
                x={chartWidth - marginRight + 10}
                y={getSnowY(s)}
                textAnchor="start"
                dominantBaseline="middle"
                className="axis-label"
              >
                {s}
              </text>
            </g>
          ))}
          <text
            x={chartWidth - 15}
            y={marginTop + innerHeight / 2}
            textAnchor="middle"
            dominantBaseline="middle"
            transform={`rotate(90, ${chartWidth - 15}, ${marginTop + innerHeight / 2})`}
            className="axis-title"
          >
            雪深 (cm)
          </text>
        </g>

        {/* X轴 - 站点 */}
        <g className="x-axis">
          <line
            x1={marginLeft}
            y1={marginTop + innerHeight}
            x2={chartWidth - marginRight}
            y2={marginTop + innerHeight}
            stroke="var(--text-tertiary)"
          />
          {sortedStations.map((s, i) => {
            const x = getX(i);
            return (
              <g key={`x-tick-${s.id}`}>
                <line
                  x1={x}
                  y1={marginTop + innerHeight}
                  x2={x}
                  y2={marginTop + innerHeight + 5}
                  stroke="var(--text-tertiary)"
                />
                {/* 站点名称 */}
                <text
                  x={x}
                  y={marginTop + innerHeight + 18}
                  textAnchor="middle"
                  className="station-label"
                >
                  {s.name || '未命名'}
                </text>
                {/* 海拔 */}
                <text
                  x={x}
                  y={marginTop + innerHeight + 32}
                  textAnchor="middle"
                  className="elevation-label"
                >
                  {s.elevation}m
                </text>
                {/* 天气图标 */}
                <text
                  x={x}
                  y={marginTop + innerHeight + 50}
                  textAnchor="middle"
                  className="weather-icon"
                  fontSize="18"
                >
                  {cloudIcons[s.cloudCover] || ''}
                  {precipIcons[s.precipitation] || ''}
                </text>
                {/* 降水文字标注 */}
                {s.precipitation && s.precipitation !== '无' && (
                  <text
                    x={x}
                    y={marginTop + innerHeight + 66}
                    textAnchor="middle"
                    className="precip-label"
                    fontSize="10"
                  >
                    {s.precipitation}
                  </text>
                )}
              </g>
            );
          })}
        </g>
      </svg>

      {/* 图例 */}
      <div className="chart-legend">
        <div className="legend-group">
          <span className="legend-title">温度</span>
          <div className="legend-item">
            <span className="legend-line" style={{ background: '#f97316' }} />
            <span>空气</span>
          </div>
          <div className="legend-item">
            <span className="legend-line" style={{ background: '#22d3ee' }} />
            <span>雪表</span>
          </div>
          <div className="legend-item">
            <span className="legend-line dashed" style={{ background: '#a855f7' }} />
            <span>10cm</span>
          </div>
        </div>
        <div className="legend-group">
          <span className="legend-title">雪深</span>
          <div className="legend-item">
            <span className="legend-bar" style={{ background: 'linear-gradient(to bottom, #60a5fa, #3b82f6)' }} />
            <span>HS</span>
          </div>
          <div className="legend-item">
            <span className="legend-bar" style={{ background: 'linear-gradient(to bottom, #a78bfa, #8b5cf6)' }} />
            <span>H24</span>
          </div>
        </div>
      </div>
    </div>
  );
}
