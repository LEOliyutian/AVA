import { useState } from 'react';
import { useMapStore, type AnalysisLayer, type BaseMap } from '../../store/map.store';
import './MapLayerPanel.css';

const ANALYSIS_LAYERS: { value: AnalysisLayer; label: string; legendClass: string }[] = [
  { value: 'none', label: '无叠加', legendClass: '' },
  { value: 'slope', label: '坡度分析', legendClass: 'slope-legend' },
  { value: 'aspect', label: '朝向分析', legendClass: 'aspect-legend' },
  { value: 'avalanche-zone', label: '雪崩区域 (25-45)', legendClass: 'avalanche-zone-legend' },
  { value: 'contour', label: '等高线 (100m)', legendClass: 'contour-legend' },
  { value: 'slope-contour', label: '坡度 + 等高线', legendClass: 'slope-contour-legend' },
];

const BASE_MAPS: { value: BaseMap; label: string; desc: string }[] = [
  { value: 'arcgis', label: 'ArcGIS', desc: '卫星影像' },
  { value: 'google', label: 'Google', desc: '高清卫星' },
  { value: 'tianditu', label: '天地图', desc: '国产卫星' },
  { value: 'topo', label: 'Topo', desc: '等高线地形' },
];

export function MapLayerPanel() {
  const [collapsed, setCollapsed] = useState(false);
  const {
    activeAnalysisLayer,
    baseMap,
    showAvalancheEvents,
    showSnowPits,
    showSkiRuns,
    terrainExaggeration,
    editMode,
    setActiveLayer,
    setBaseMap,
    toggleEventVisibility,
    toggleSnowPitVisibility,
    toggleSkiRunVisibility,
    setTerrainExaggeration,
    setEditMode,
  } = useMapStore();

  return (
    <>
      {/* 编辑模式提示 */}
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
            {/* 底图切换 */}
            <div className="panel-section-title">底图</div>
            <div className="basemap-grid">
              {BASE_MAPS.map((bm) => (
                <button
                  key={bm.value}
                  className={`basemap-btn${baseMap === bm.value ? ' active' : ''}`}
                  onClick={() => setBaseMap(bm.value)}
                  title={bm.desc}
                >
                  <span className="basemap-label">{bm.label}</span>
                  <span className="basemap-desc">{bm.desc}</span>
                </button>
              ))}
            </div>

            <div className="panel-divider" />

            {/* 分析图层（互斥单选） */}
            <div className="panel-section-title">分析图层</div>
            {ANALYSIS_LAYERS.map((layer) => (
              <label key={layer.value} className={`panel-option${activeAnalysisLayer === layer.value ? ' active' : ''}`}>
                <input
                  type="radio"
                  name="analysis-layer"
                  checked={activeAnalysisLayer === layer.value}
                  onChange={() => setActiveLayer(layer.value)}
                />
                <span>{layer.label}</span>
                {layer.legendClass && (
                  <span className={`panel-legend ${layer.legendClass}`} />
                )}
              </label>
            ))}

            {/* 坡度详细图例 */}
            {(activeAnalysisLayer === 'slope' || activeAnalysisLayer === 'slope-contour') && (
              <div className="legend-detail slope-legend-detail">
                <div className="legend-gradient-bar slope-gradient-bar" />
                <div className="legend-ticks">
                  <span>0°</span><span>20°</span><span>35°</span><span>45°</span><span>90°</span>
                </div>
                <div className="legend-labels">
                  <span className="legend-safe">安全</span>
                  <span className="legend-caution">注意</span>
                  <span className="legend-danger">高危</span>
                  <span className="legend-extreme">极陡</span>
                </div>
              </div>
            )}

            {/* 朝向详细图例（SVG 指南针） */}
            {activeAnalysisLayer === 'aspect' && (
              <div className="legend-detail aspect-legend-detail">
                <svg viewBox="0 0 100 100" className="aspect-compass">
                  {/* 8 方向扇区 */}
                  {[
                    { label: 'N', angle: 0, color: '#0064ff' },
                    { label: 'NE', angle: 45, color: '#64c8ff' },
                    { label: 'E', angle: 90, color: '#f0f0f0' },
                    { label: 'SE', angle: 135, color: '#ffc896' },
                    { label: 'S', angle: 180, color: '#ff8c00' },
                    { label: 'SW', angle: 225, color: '#a05028' },
                    { label: 'W', angle: 270, color: '#3c3c3c' },
                    { label: 'NW', angle: 315, color: '#283ca0' },
                  ].map(({ label, angle, color }) => {
                    const r = 40;
                    const cx = 50, cy = 50;
                    const startAngle = (angle - 22.5 - 90) * Math.PI / 180;
                    const endAngle = (angle + 22.5 - 90) * Math.PI / 180;
                    const x1 = cx + r * Math.cos(startAngle);
                    const y1 = cy + r * Math.sin(startAngle);
                    const x2 = cx + r * Math.cos(endAngle);
                    const y2 = cy + r * Math.sin(endAngle);
                    const textR = 33;
                    const textAngle = (angle - 90) * Math.PI / 180;
                    const tx = cx + textR * Math.cos(textAngle);
                    const ty = cy + textR * Math.sin(textAngle);
                    return (
                      <g key={label}>
                        <path
                          d={`M${cx},${cy} L${x1},${y1} A${r},${r} 0 0,1 ${x2},${y2} Z`}
                          fill={color}
                          stroke="#fff"
                          strokeWidth="0.5"
                          opacity="0.85"
                        />
                        <text
                          x={tx} y={ty}
                          textAnchor="middle"
                          dominantBaseline="central"
                          fill={['E', 'SE', 'NE'].includes(label) ? '#333' : '#fff'}
                          fontSize="7"
                          fontWeight="bold"
                        >
                          {label}
                        </text>
                      </g>
                    );
                  })}
                  {/* 指北标识 */}
                  <polygon points="50,8 47,16 53,16" fill="#ff3c3c" />
                </svg>
              </div>
            )}

            <div className="panel-divider" />

            {/* 数据图层（可叠加多选） */}
            <div className="panel-section-title">数据图层</div>
            <label className={`panel-option${showAvalancheEvents ? ' active' : ''}`}>
              <input
                type="checkbox"
                checked={showAvalancheEvents}
                onChange={toggleEventVisibility}
              />
              <span>雪崩事件</span>
            </label>
            <label className={`panel-option${showSnowPits ? ' active' : ''}`}>
              <input
                type="checkbox"
                checked={showSnowPits}
                onChange={toggleSnowPitVisibility}
              />
              <span>雪坑位置</span>
            </label>
            <label className={`panel-option${showSkiRuns ? ' active' : ''}`}>
              <input
                type="checkbox"
                checked={showSkiRuns}
                onChange={toggleSkiRunVisibility}
              />
              <span>雪道 / 缆车</span>
            </label>

            <div className="panel-divider" />

            {/* 地形夸张滑块 */}
            <div className="panel-slider-group">
              <div className="panel-slider-label">
                <span>地形夸张</span>
                <span>{terrainExaggeration.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                className="panel-slider"
                min="1"
                max="3"
                step="0.1"
                value={terrainExaggeration}
                onChange={(e) => setTerrainExaggeration(parseFloat(e.target.value))}
              />
            </div>

            <div className="panel-divider" />

            {/* 编辑操作 */}
            <div className="panel-edit-buttons">
              {editMode === 'none' ? (
                <>
                  <button
                    className="btn-edit-mode"
                    onClick={() => setEditMode('add-event')}
                  >
                    + 添加雪崩事件
                  </button>
                  <button
                    className="btn-edit-mode"
                    onClick={() => setEditMode('add-snowpit')}
                  >
                    + 添加雪坑位置
                  </button>
                </>
              ) : (
                <button
                  className="btn-edit-mode cancel"
                  onClick={() => setEditMode('none')}
                >
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
