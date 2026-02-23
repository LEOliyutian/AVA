import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMapStore } from '../../store/map.store';
import { parseGpsString, formatCoordinates } from '../../utils/geo';
import { HARDNESS_COLORS } from '../../types/observation';
import type { SnowLayer, StabilityTestGroup, TemperaturePointApi } from '../../api/observation.api';
import './SnowpitDetailPanel.css';

export function SnowpitDetailPanel() {
  const navigate = useNavigate();
  const { selectedSnowpit, isLoadingSnowpit, setSelectedSnowpit } = useMapStore();

  const handleClose = useCallback(() => {
    setSelectedSnowpit(null);
  }, [setSelectedSnowpit]);

  // ESC to close
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    if (selectedSnowpit) {
      window.addEventListener('keydown', onKey);
      return () => window.removeEventListener('keydown', onKey);
    }
  }, [selectedSnowpit, handleClose]);

  if (!selectedSnowpit && !isLoadingSnowpit) return null;

  if (isLoadingSnowpit) {
    return (
      <div className="snowpit-detail-panel">
        <div className="snowpit-detail-header">
          <h3>雪坑观测摘要</h3>
          <button className="btn-close-editor" onClick={handleClose}>×</button>
        </div>
        <div className="snowpit-detail-body">
          <div className="snowpit-loading">加载中...</div>
        </div>
      </div>
    );
  }

  if (!selectedSnowpit) return null;

  const obs = selectedSnowpit;
  const coord = parseGpsString(obs.gps_coordinates || '');
  const layers = obs.snow_layers || [];
  const testGroups = obs.stability_test_groups || [];
  const tempPoints = obs.temperature_points || [];

  return (
    <div className="snowpit-detail-panel">
      {/* Header */}
      <div className="snowpit-detail-header">
        <h3>雪坑观测摘要</h3>
        <button className="btn-close-editor" onClick={handleClose}>×</button>
      </div>

      {/* Body */}
      <div className="snowpit-detail-body">
        {/* Basic Info */}
        <section className="snowpit-section">
          <div className="detail-field">
            <div className="detail-field-label">位置</div>
            <div className="detail-field-value">{obs.location_description || '-'}</div>
          </div>
          <div className="snowpit-info-grid">
            <div className="detail-field">
              <div className="detail-field-label">观测者</div>
              <div className="detail-field-value">{obs.observer_name || obs.observer || '-'}</div>
            </div>
            <div className="detail-field">
              <div className="detail-field-label">日期</div>
              <div className="detail-field-value">{obs.observation_date || '-'}</div>
            </div>
          </div>
          {coord && (
            <div className="detail-field">
              <div className="detail-field-label">坐标</div>
              <div className="detail-field-value">{formatCoordinates(coord.lat, coord.lng)}</div>
            </div>
          )}
          <div className="snowpit-info-grid">
            {obs.elevation && (
              <div className="detail-field">
                <div className="detail-field-label">海拔</div>
                <div className="detail-field-value">{obs.elevation}m</div>
              </div>
            )}
            {obs.slope_angle && (
              <div className="detail-field">
                <div className="detail-field-label">坡度</div>
                <div className="detail-field-value">{obs.slope_angle}°</div>
              </div>
            )}
            {obs.slope_aspect && (
              <div className="detail-field">
                <div className="detail-field-label">朝向</div>
                <div className="detail-field-value">{obs.slope_aspect}</div>
              </div>
            )}
            {obs.total_snow_depth && (
              <div className="detail-field">
                <div className="detail-field-label">总雪深</div>
                <div className="detail-field-value">{obs.total_snow_depth}cm</div>
              </div>
            )}
          </div>
          <div className="snowpit-info-grid">
            {obs.air_temperature && (
              <div className="detail-field">
                <div className="detail-field-label">气温</div>
                <div className="detail-field-value">{obs.air_temperature}°C</div>
              </div>
            )}
            {obs.weather && (
              <div className="detail-field">
                <div className="detail-field-label">天气</div>
                <div className="detail-field-value">{obs.weather}</div>
              </div>
            )}
          </div>
        </section>

        {/* Snow Profile */}
        <section className="snowpit-section">
          <div className="snowpit-section-title">雪层剖面</div>
          {layers.length === 0 ? (
            <div className="snowpit-empty">暂无雪层数据</div>
          ) : (
            <SnowProfileChart layers={layers} />
          )}
        </section>

        {/* Stability Tests */}
        <section className="snowpit-section">
          <div className="snowpit-section-title">稳定性测试</div>
          {testGroups.length === 0 ? (
            <div className="snowpit-empty">暂无稳定性测试数据</div>
          ) : (
            <StabilityTestSummary groups={testGroups} />
          )}
        </section>

        {/* Temperature Profile */}
        {tempPoints.length > 0 && (
          <section className="snowpit-section">
            <div className="snowpit-section-title">温度剖面</div>
            <TemperatureChart points={tempPoints} />
          </section>
        )}

        {/* Conclusion */}
        {obs.conclusion && (
          <section className="snowpit-section">
            <div className="snowpit-section-title">结论</div>
            <div className="snowpit-conclusion">{obs.conclusion}</div>
          </section>
        )}
      </div>

      {/* Footer */}
      <div className="snowpit-detail-footer">
        <button
          className="btn-view-full"
          onClick={() => {
            handleClose();
            navigate(`/observations/${obs.id}`);
          }}
        >
          查看完整记录
        </button>
      </div>
    </div>
  );
}

// --- Snow Profile Chart (SVG) ---

function SnowProfileChart({ layers }: { layers: SnowLayer[] }) {
  const validLayers = layers.filter(
    (l) => l.start_depth != null && l.end_depth != null && l.thickness != null && l.thickness > 0
  );
  if (validLayers.length === 0) {
    return <div className="snowpit-empty">暂无有效雪层数据</div>;
  }

  const maxDepth = Math.max(...validLayers.map((l) => l.end_depth ?? 0));
  if (maxDepth <= 0) return <div className="snowpit-empty">暂无有效雪层数据</div>;

  const chartWidth = 280;
  const chartHeight = Math.min(300, Math.max(150, validLayers.length * 30));
  const leftMargin = 40;
  const rightMargin = 8;
  const barWidth = chartWidth - leftMargin - rightMargin;

  return (
    <svg
      width={chartWidth}
      height={chartHeight}
      viewBox={`0 0 ${chartWidth} ${chartHeight}`}
      className="snowpit-profile-svg"
    >
      {validLayers.map((layer, i) => {
        const startY = ((layer.start_depth ?? 0) / maxDepth) * chartHeight;
        const endY = ((layer.end_depth ?? 0) / maxDepth) * chartHeight;
        // Draw from top (surface = maxDepth) downward (ground = 0)
        const y = chartHeight - endY;
        const h = endY - startY;
        const color = HARDNESS_COLORS[layer.hardness] || '#e5e5e5';

        return (
          <g key={i}>
            <rect
              x={leftMargin}
              y={y}
              width={barWidth}
              height={Math.max(h, 2)}
              fill={color}
              stroke="#999"
              strokeWidth={0.5}
            />
            {/* Depth label (left) */}
            <text
              x={leftMargin - 4}
              y={y + Math.max(h, 2) / 2}
              textAnchor="end"
              dominantBaseline="middle"
              fontSize={9}
              fill="var(--text-muted)"
            >
              {layer.start_depth ?? 0}-{layer.end_depth ?? 0}
            </text>
            {/* Hardness + crystal type (inside bar) */}
            {h >= 12 && (
              <text
                x={leftMargin + 4}
                y={y + Math.max(h, 2) / 2}
                dominantBaseline="middle"
                fontSize={9}
                fill="var(--text-primary)"
                fontWeight={500}
              >
                {layer.hardness} {layer.crystal_type}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

// --- Stability Test Summary ---

function StabilityTestSummary({ groups }: { groups: StabilityTestGroup[] }) {
  return (
    <div className="snowpit-test-list">
      {groups.map((group, gi) => (
        <div key={gi} className="snowpit-test-group">
          <div className="snowpit-test-group-header">
            <span className="snowpit-test-depth">{group.depth != null ? `${group.depth}cm` : '-'}</span>
            {group.weak_layer_type && (
              <span className="snowpit-test-weak-layer">{group.weak_layer_type}</span>
            )}
          </div>
          <div className="snowpit-test-items">
            {group.tests.map((test, ti) => {
              let label = test.test_type;
              if (test.test_type === 'CT' && test.taps) {
                label = `CT${test.taps}`;
                if (test.quality) label += ` ${test.quality}`;
              } else if (test.test_type === 'ECT') {
                if (test.result) label = `${test.result}${test.taps || ''}`;
              } else if (test.test_type === 'PST') {
                label = `PST ${test.cut || '?'}/${test.length || '?'} ${test.propagation || ''}`;
              } else if (test.test_type === 'RB' && test.score) {
                label = `RB${test.score}`;
              }
              return (
                <span key={ti} className="snowpit-test-badge">{label}</span>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

// --- Temperature Chart (SVG) ---

function TemperatureChart({ points }: { points: TemperaturePointApi[] }) {
  const valid = points.filter(
    (p) => p.depth != null && p.temperature != null
  ).sort((a, b) => (a.depth ?? 0) - (b.depth ?? 0));

  if (valid.length < 2) {
    return <div className="snowpit-empty">温度数据不足</div>;
  }

  const chartWidth = 280;
  const chartHeight = 120;
  const margin = { top: 10, right: 10, bottom: 20, left: 40 };
  const w = chartWidth - margin.left - margin.right;
  const h = chartHeight - margin.top - margin.bottom;

  const maxDepth = Math.max(...valid.map((p) => p.depth ?? 0));
  const temps = valid.map((p) => p.temperature ?? 0);
  const minTemp = Math.min(...temps);
  const maxTemp = Math.max(...temps);
  const tempRange = maxTemp - minTemp || 1;

  const scaleX = (temp: number) => margin.left + ((temp - minTemp) / tempRange) * w;
  const scaleY = (depth: number) => margin.top + (depth / (maxDepth || 1)) * h;

  const pathD = valid
    .map((p, i) => {
      const x = scaleX(p.temperature ?? 0);
      const y = scaleY(p.depth ?? 0);
      return `${i === 0 ? 'M' : 'L'}${x},${y}`;
    })
    .join(' ');

  return (
    <svg
      width={chartWidth}
      height={chartHeight}
      viewBox={`0 0 ${chartWidth} ${chartHeight}`}
      className="snowpit-temp-svg"
    >
      {/* X axis label */}
      <text
        x={chartWidth / 2}
        y={chartHeight - 2}
        textAnchor="middle"
        fontSize={9}
        fill="var(--text-muted)"
      >
        温度 (°C)
      </text>
      {/* Y axis label */}
      <text
        x={8}
        y={chartHeight / 2}
        textAnchor="middle"
        fontSize={9}
        fill="var(--text-muted)"
        transform={`rotate(-90, 8, ${chartHeight / 2})`}
      >
        深度 (cm)
      </text>
      {/* Temperature line */}
      <path d={pathD} fill="none" stroke="#3b82f6" strokeWidth={1.5} />
      {/* Data points */}
      {valid.map((p, i) => (
        <circle
          key={i}
          cx={scaleX(p.temperature ?? 0)}
          cy={scaleY(p.depth ?? 0)}
          r={3}
          fill="#3b82f6"
        />
      ))}
      {/* Min/Max labels */}
      <text x={margin.left} y={chartHeight - 8} fontSize={8} fill="var(--text-muted)">
        {minTemp}°
      </text>
      <text x={chartWidth - margin.right} y={chartHeight - 8} textAnchor="end" fontSize={8} fill="var(--text-muted)">
        {maxTemp}°
      </text>
    </svg>
  );
}
