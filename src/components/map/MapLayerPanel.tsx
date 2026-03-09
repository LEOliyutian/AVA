import { useState } from 'react';
import { useMapStore, type AnalysisLayer, type BaseMap } from '../../store/map.store';
import './MapLayerPanel.css';

const ANALYSIS_LAYERS: { value: AnalysisLayer; label: string; swatchClass: string }[] = [
  { value: 'none',           label: '无叠加',   swatchClass: 'swatch-none' },
  { value: 'slope',          label: '坡度',     swatchClass: 'swatch-slope' },
  { value: 'aspect',         label: '朝向',     swatchClass: 'swatch-aspect' },
  { value: 'avalanche-zone', label: '雪崩区域', swatchClass: 'swatch-avzone' },
];

const BASE_MAPS: { value: BaseMap; label: string; desc: string; swatchClass: string }[] = [
  { value: 'satellite', label: '卫星', desc: '高清影像', swatchClass: 'swatch-satellite' },
  { value: 'winter',    label: '冬季', desc: '地形图',   swatchClass: 'swatch-winter' },
];

const ASPECT_SECTORS = [
  { label: 'N',  angle: 0,   color: '#1a56ff' },
  { label: 'NE', angle: 45,  color: '#42aaff' },
  { label: 'E',  angle: 90,  color: '#c8e6ff' },
  { label: 'SE', angle: 135, color: '#ffd966' },
  { label: 'S',  angle: 180, color: '#ff6200' },
  { label: 'SW', angle: 225, color: '#cc2200' },
  { label: 'W',  angle: 270, color: '#7b3fa0' },
  { label: 'NW', angle: 315, color: '#2a4ccc' },
];

export function MapLayerPanel() {
  const [collapsed, setCollapsed] = useState(false);
  const {
    activeAnalysisLayer,
    baseMap,
    showAvalancheEvents,
    showSnowPits,
    showSkiRuns,
    editMode,
    setActiveLayer,
    setBaseMap,
    toggleEventVisibility,
    toggleSnowPitVisibility,
    toggleSkiRunVisibility,
    setEditMode,
  } = useMapStore();

  return (
    <>
      {editMode !== 'none' && (
        <div className="edit-mode-banner">
          {editMode === 'add-event' ? '点击地图添加雪崩事件' : '点击地图添加雪坑位置'}
          <span className="esc-hint">按 ESC 取消</span>
        </div>
      )}

      <div className={`map-layer-panel${collapsed ? ' collapsed' : ''}`}>
        <button className="panel-toggle" onClick={() => setCollapsed(!collapsed)}>
          <span>图层控制</span>
          <span className={`panel-toggle-icon${collapsed ? ' collapsed' : ''}`}>▾</span>
        </button>

        {!collapsed && (
          <div className="panel-body">

            {/* 底图 */}
            <div className="panel-section-title">底图</div>
            <div className="layer-card-grid">
              {BASE_MAPS.map((bm) => (
                <button
                  key={bm.value}
                  className={`layer-card${baseMap === bm.value ? ' active' : ''}`}
                  onClick={() => setBaseMap(bm.value)}
                >
                  <span className={`layer-swatch ${bm.swatchClass}`} />
                  <span className="layer-card-text">
                    <span className="layer-card-label">{bm.label}</span>
                    <span className="layer-card-desc">{bm.desc}</span>
                  </span>
                </button>
              ))}
            </div>

            <div className="panel-divider" />

            {/* 分析图层 */}
            <div className="panel-section-title">分析图层</div>
            <div className="layer-card-grid">
              {ANALYSIS_LAYERS.map((layer) => (
                <button
                  key={layer.value}
                  className={`layer-card${activeAnalysisLayer === layer.value ? ' active' : ''}`}
                  onClick={() => setActiveLayer(layer.value)}
                >
                  <span className={`layer-swatch ${layer.swatchClass}`} />
                  <span className="layer-card-text">
                    <span className="layer-card-label">{layer.label}</span>
                  </span>
                </button>
              ))}
            </div>

            {/* 坡度详细图例 */}
            {activeAnalysisLayer === 'slope' && (
              <div className="legend-detail">
                <div className="legend-gradient-bar slope-gradient-bar" />
                <div className="legend-ticks">
                  <span>0°</span><span>25°</span><span>35°</span><span>45°</span><span>90°</span>
                </div>
                <div className="legend-labels">
                  <span className="legend-safe">安全</span>
                  <span className="legend-caution">注意</span>
                  <span className="legend-danger">高危</span>
                  <span className="legend-extreme">极陡</span>
                </div>
              </div>
            )}

            {/* 朝向指南针图例 */}
            {activeAnalysisLayer === 'aspect' && (
              <div className="legend-detail aspect-legend-detail">
                <svg viewBox="0 0 100 100" className="aspect-compass">
                  <circle cx="50" cy="50" r="46" fill="rgba(0,0,0,0.25)" />
                  {ASPECT_SECTORS.map(({ label, angle, color }) => {
                    const r = 44, cx = 50, cy = 50;
                    const sa = (angle - 22.5 - 90) * Math.PI / 180;
                    const ea = (angle + 22.5 - 90) * Math.PI / 180;
                    const x1 = cx + r * Math.cos(sa), y1 = cy + r * Math.sin(sa);
                    const x2 = cx + r * Math.cos(ea), y2 = cy + r * Math.sin(ea);
                    const ta = (angle - 90) * Math.PI / 180;
                    const tx = cx + 32 * Math.cos(ta), ty = cy + 32 * Math.sin(ta);
                    return (
                      <g key={label}>
                        <path
                          d={`M${cx},${cy} L${x1},${y1} A${r},${r} 0 0,1 ${x2},${y2} Z`}
                          fill={color}
                          stroke="rgba(0,0,0,0.3)"
                          strokeWidth="0.8"
                        />
                        <text
                          x={tx} y={ty}
                          textAnchor="middle" dominantBaseline="central"
                          fill={['E', 'SE'].includes(label) ? '#1a1a2e' : '#fff'}
                          fontSize="7" fontWeight="bold"
                        >
                          {label}
                        </text>
                      </g>
                    );
                  })}
                  <circle cx="50" cy="50" r="6" fill="rgba(10,14,24,0.95)" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
                  <polygon points="50,4 46,13 54,13" fill="#ff3030" stroke="rgba(0,0,0,0.4)" strokeWidth="0.8" />
                </svg>
              </div>
            )}

            <div className="panel-divider" />

            {/* 数据图层 */}
            <div className="panel-section-title">数据图层</div>
            <label className={`panel-check${showAvalancheEvents ? ' active' : ''}`}>
              <input type="checkbox" checked={showAvalancheEvents} onChange={toggleEventVisibility} />
              <span className="check-dot dot-event" />
              <span>雪崩事件</span>
            </label>
            <label className={`panel-check${showSnowPits ? ' active' : ''}`}>
              <input type="checkbox" checked={showSnowPits} onChange={toggleSnowPitVisibility} />
              <span className="check-dot dot-pit" />
              <span>雪坑位置</span>
            </label>
            <label className={`panel-check${showSkiRuns ? ' active' : ''}`}>
              <input type="checkbox" checked={showSkiRuns} onChange={toggleSkiRunVisibility} />
              <span className="check-dot dot-ski" />
              <span>雪道 / 缆车</span>
            </label>

            <div className="panel-divider" />

            {/* 编辑操作 */}
            <div className="panel-edit-buttons">
              {editMode === 'none' ? (
                <>
                  <button className="btn-edit-mode" onClick={() => setEditMode('add-event')}>
                    + 添加雪崩事件
                  </button>
                  <button className="btn-edit-mode" onClick={() => setEditMode('add-snowpit')}>
                    + 添加雪坑位置
                  </button>
                </>
              ) : (
                <button className="btn-edit-mode cancel" onClick={() => setEditMode('none')}>
                  取消编辑
                </button>
              )}
            </div>

          </div>
        )}
      </div>
    </>
  );
}
