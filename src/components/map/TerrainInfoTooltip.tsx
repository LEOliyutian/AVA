import { useEffect, useCallback } from 'react';
import { useMapStore } from '../../store/map.store';
import { formatCoordinates } from '../../utils/geo';
import './TerrainInfoTooltip.css';

export function TerrainInfoTooltip() {
  const terrainInfo = useMapStore((s) => s.terrainInfo);
  const setTerrainInfo = useMapStore((s) => s.setTerrainInfo);

  // ESC 或再次点击空白关闭
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') setTerrainInfo(null);
    },
    [setTerrainInfo]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (!terrainInfo) return null;

  // 朝向角度格式化
  const aspectStr =
    terrainInfo.aspect < 0
      ? '平坦'
      : `${terrainInfo.aspectLabel} (${terrainInfo.aspect.toFixed(1)}°)`;

  // 浮窗定位：避免超出视口
  const tooltipWidth = 220;
  const tooltipHeight = 160;
  const margin = 16;
  let left = terrainInfo.screenX + margin;
  let top = terrainInfo.screenY - tooltipHeight / 2;

  if (left + tooltipWidth > window.innerWidth - margin) {
    left = terrainInfo.screenX - tooltipWidth - margin;
  }
  if (top < margin) top = margin;
  if (top + tooltipHeight > window.innerHeight - margin) {
    top = window.innerHeight - tooltipHeight - margin;
  }

  return (
    <div
      className="terrain-info-tooltip"
      style={{ left, top }}
    >
      <div className="terrain-info-header">
        <span>地形查询</span>
        <button className="terrain-info-close" onClick={() => setTerrainInfo(null)}>
          ×
        </button>
      </div>
      <div className="terrain-info-body">
        <div className="terrain-info-row">
          <span className="terrain-info-label">坐标</span>
          <span className="terrain-info-value">
            {formatCoordinates(terrainInfo.lat, terrainInfo.lng)}
          </span>
        </div>
        <div className="terrain-info-row">
          <span className="terrain-info-label">海拔</span>
          <span className="terrain-info-value">{Math.round(terrainInfo.elevation)}m</span>
        </div>
        <div className="terrain-info-row">
          <span className="terrain-info-label">坡度</span>
          <span className="terrain-info-value terrain-slope-value">
            {terrainInfo.slope.toFixed(1)}°
            {terrainInfo.slope >= 25 && terrainInfo.slope <= 45 && (
              <span className="terrain-danger-badge">雪崩区</span>
            )}
          </span>
        </div>
        <div className="terrain-info-row">
          <span className="terrain-info-label">朝向</span>
          <span className="terrain-info-value">{aspectStr}</span>
        </div>
      </div>
    </div>
  );
}
