import { useRef, useMemo, useCallback, useEffect, useState } from 'react';
import type { LayerRow, TemperaturePoint } from '../../types/observation';
import {
  HARDNESS_OPTIONS,
  CRYSTAL_TYPE_OPTIONS,
  WETNESS_OPTIONS,
  HARDNESS_COLORS,
  CRYSTAL_TYPE_COLORS,
  getHardnessWidth,
  getHardnessByWidth,
} from '../../types/observation';
import './SnowProfileSection.css';

interface TestMarker {
  depth: number;
  label: string;
}

interface SnowProfileSectionProps {
  layerRows: LayerRow[];
  onLayerRowsChange: (rows: LayerRow[]) => void;
  temperaturePoints: TemperaturePoint[];
  onTemperaturePointsChange: (points: TemperaturePoint[]) => void;
  xAxisSide: 'left' | 'right';
  onXAxisSideChange: (side: 'left' | 'right') => void;
  yAxisDirection: 'up' | 'down';
  onYAxisDirectionChange: (dir: 'up' | 'down') => void;
  testMarkers?: TestMarker[];
  totalSnowDepth?: number | string;  // 总雪深 (cm)
}

export function SnowProfileSection({
  layerRows,
  onLayerRowsChange,
  temperaturePoints,
  onTemperaturePointsChange,
  xAxisSide,
  onXAxisSideChange,
  yAxisDirection,
  onYAxisDirectionChange,
  testMarkers = [],
  totalSnowDepth = 0,
}: SnowProfileSectionProps) {
  const chartAreaRef = useRef<HTMLDivElement>(null);
  const [chartWidthPx, setChartWidthPx] = useState(1);
  const depthScalePx = 8;

  // 解析总雪深
  const totalHS = useMemo(() => {
    const parsed = Number(totalSnowDepth);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
  }, [totalSnowDepth]);

  // 根据 topDepth（分层数值）自动计算每层的 startDepth, endDepth, thickness
  // 用户输入的是层底部距地表的高度，从雪面往下记录
  // 例如：总雪深150，输入140 → 层范围 140-150（雪面），厚度 10cm
  const layersWithDepth = useMemo(() => {
    // 按 topDepth 降序排序（从雪面往下）
    const sortedRows = [...layerRows].sort((a, b) => {
      const aTop = Number(a.topDepth) || 0;
      const bTop = Number(b.topDepth) || 0;
      return bTop - aTop; // 降序，大的在前（靠近雪面）
    });

    // 使用总雪深作为起点，如果没有则用最大的 topDepth
    const maxInput = sortedRows.length > 0 ? Math.max(...sortedRows.map(r => Number(r.topDepth) || 0)) : 0;
    let previousBottom = totalHS > 0 ? totalHS : maxInput; // 从雪面开始

    return sortedRows.map((row) => {
      const bottomDepth = Number(row.topDepth) || 0; // 用户输入的是层底部高度
      const startDepth = bottomDepth;      // 层底（较小值）
      const endDepth = previousBottom;     // 层顶（较大值，靠近雪面）
      const thickness = Math.max(0, endDepth - startDepth);
      previousBottom = bottomDepth; // 下一层的顶部 = 这一层的底部
      return {
        ...row,
        startDepth,
        endDepth,
        thickness,
      };
    });
  }, [layerRows, totalHS]);

  // 计算最低层底和剩余深度（到地表还有多少）
  const { minDepth, remainingDepth, isOverflow } = useMemo(() => {
    const min = layersWithDepth.length > 0
      ? Math.min(...layersWithDepth.map(r => r.startDepth || 0))
      : (totalHS > 0 ? totalHS : 0);
    const maxEnd = layersWithDepth.length > 0
      ? Math.max(...layersWithDepth.map(r => r.endDepth || 0))
      : 0;
    return {
      minDepth: min,
      remainingDepth: min, // 到地表还剩多少
      isOverflow: maxEnd > totalHS && totalHS > 0,
    };
  }, [layersWithDepth, totalHS]);

  // 监听图表区域大小变化
  useEffect(() => {
    if (!chartAreaRef.current) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        setChartWidthPx(entry.contentRect.width);
      }
    });

    observer.observe(chartAreaRef.current);
    return () => observer.disconnect();
  }, []);

  // 计算深度刻度
  const depthTicks = useMemo(() => {
    const depths = layersWithDepth
      .flatMap((row) => [row.startDepth, row.endDepth])
      .filter((value): value is number => Number.isFinite(value));
    const maxVal = totalHS > 0 ? totalHS : (depths.length > 0 ? Math.max(...depths) : 100);
    const unique = Array.from(new Set([0, ...depths, maxVal]));
    return unique.sort((a, b) => a - b);
  }, [layersWithDepth, totalHS]);

  const maxDepthValue = useMemo(() => Math.max(0, ...depthTicks), [depthTicks]);
  const chartHeightPx = useMemo(() => Math.max(44, maxDepthValue * depthScalePx), [maxDepthValue]);

  // 深度百分比计算
  // yAxisDirection === 'down' 表示从高到低（雪面在上，地表在下）
  // 此时：最大深度（雪面）在顶部(0%)，0（地表）在底部(100%)
  const resolveDepthPercent = useCallback(
    (value: number) => {
      if (maxDepthValue === 0) return 0;
      const normalized = (value / maxDepthValue) * 100;
      // down: 大值在上(0%), 小值在下(100%) → 100 - normalized
      // up: 小值在上(0%), 大值在下(100%) → normalized
      return yAxisDirection === 'down' ? 100 - normalized : normalized;
    },
    [maxDepthValue, yAxisDirection]
  );

  const resolveDepthPx = useCallback(
    (value: number) => (resolveDepthPercent(value) / 100) * chartHeightPx,
    [resolveDepthPercent, chartHeightPx]
  );

  // 硬度位置计算
  const resolveAxisPosition = useCallback(
    (position: number) => (xAxisSide === 'right' ? 100 - position : position),
    [xAxisSide]
  );

  // 硬度刻度
  const hardnessScale = useMemo(() => {
    return HARDNESS_OPTIONS.map((key) => {
      const basePosition = getHardnessWidth(key);
      const position = resolveAxisPosition(basePosition);
      const isFirst = position <= 0;
      const isLast = position >= 100;
      return {
        key,
        label: key,
        color: HARDNESS_COLORS[key] || '#f5f5f5',
        position,
        transform: isFirst ? 'translateX(0)' : isLast ? 'translateX(-100%)' : 'translateX(-50%)',
      };
    });
  }, [resolveAxisPosition]);

  // 温度相关
  const temperatureTicks = [-0, -5, -10, -15, -20, -25];
  const temperatureTickPosition = useCallback(
    (tick: number) => {
      const minTemp = -25;
      const maxTemp = 0;
      const range = maxTemp - minTemp || 1;
      const normalized = ((tick - minTemp) / range) * 100;
      const clamped = Math.max(0, Math.min(100, normalized));
      return xAxisSide === 'right' ? clamped : 100 - clamped;
    },
    [xAxisSide]
  );

  // 图层计算
  const diagramLayers = useMemo(() => {
    const normalizedRows = layersWithDepth.map((row) => {
      const start = row.startDepth ?? 0;
      const end = row.endDepth ?? 0;
      return { row, start, end };
    });

    return normalizedRows
      .sort((a, b) => a.start - b.start)
      .map(({ row, start, end }) => {
        const defaultWidth = getHardnessWidth(row.hardness);
        const topWidth = Math.max(0, Math.min(100, Number(row.hardnessTop ?? defaultWidth)));
        const bottomWidth = Math.max(0, Math.min(100, Number(row.hardnessBottom ?? defaultWidth)));
        const depthStartPx = resolveDepthPx(start);
        const depthEndPx = resolveDepthPx(end);
        const topPx = Math.min(depthStartPx, depthEndPx);
        const heightPx = Math.abs(depthEndPx - depthStartPx);
        const baseColor = CRYSTAL_TYPE_COLORS[row.type] || HARDNESS_COLORS[row.hardness] || '#f5f5f5';
        const fillColor = `color-mix(in srgb, ${baseColor} 40%, transparent)`;
        const adjustedHeightPx = Math.max(4, heightPx);
        const showLabel = adjustedHeightPx >= 16;
        const showDetail = adjustedHeightPx >= 24;
        const labelParts = [row.hardness, row.type];
        if (showDetail && row.grainSize) {
          labelParts.push(`${row.grainSize}mm`);
        }
        const label = labelParts.filter(Boolean).join(' ');

        return {
          id: row.id,
          topPx: Math.max(0, Math.min(chartHeightPx, topPx)),
          heightPx: Math.min(chartHeightPx, adjustedHeightPx),
          topWidth,
          bottomWidth,
          color: fillColor,
          borderColor: baseColor,
          showLabel,
          label,
        };
      });
  }, [layersWithDepth, chartHeightPx, resolveDepthPx]);

  // SVG 多边形
  const layerPolygons = useMemo(() => {
    const width = Math.max(1, chartWidthPx);
    return diagramLayers.map((layer) => {
      const topWidthPx = Math.max(0, Math.min(width, (layer.topWidth / 100) * width));
      const bottomWidthPx = Math.max(0, Math.min(width, (layer.bottomWidth / 100) * width));
      const topY = Math.max(0, Math.min(chartHeightPx, layer.topPx));
      const bottomY = Math.max(0, Math.min(chartHeightPx, layer.topPx + layer.heightPx));
      const points =
        xAxisSide === 'right'
          ? [
              `${width - topWidthPx},${topY}`,
              `${width},${topY}`,
              `${width},${bottomY}`,
              `${width - bottomWidthPx},${bottomY}`,
            ].join(' ')
          : [
              `0,${topY}`,
              `${topWidthPx},${topY}`,
              `${bottomWidthPx},${bottomY}`,
              `0,${bottomY}`,
            ].join(' ');
      return {
        id: layer.id,
        points,
        color: layer.color,
        borderColor: layer.borderColor,
      };
    });
  }, [diagramLayers, chartWidthPx, chartHeightPx, xAxisSide]);

  // 温度曲线（基于独立的温度测量点）
  // 温度深度和雪层一样，是距地表的高度（150=雪面，0=地表）
  const temperaturePolyline = useMemo(() => {
    if (temperaturePoints.length === 0) return '';

    const minTemp = -25;
    const maxTemp = 0;
    const range = maxTemp - minTemp || 1;

    // 按高度排序（从低到高）
    const sortedPoints = [...temperaturePoints]
      .map((pt) => ({
        height: Number(pt.depth), // 距地表的高度
        temp: Number(pt.temperature)
      }))
      .filter((pt) => Number.isFinite(pt.height) && Number.isFinite(pt.temp))
      .sort((a, b) => a.height - b.height);

    if (sortedPoints.length === 0) return '';

    return sortedPoints
      .map((pt) => {
        const normalized = ((pt.temp - minTemp) / range) * 100;
        const clamped = Math.max(0, Math.min(100, normalized));
        const x = xAxisSide === 'right' ? clamped : 100 - clamped;
        const y = resolveDepthPercent(pt.height);
        return `${x},${y}`;
      })
      .join(' ');
  }, [temperaturePoints, xAxisSide, resolveDepthPercent]);

  // 温度点（用于显示标签）
  // 温度深度是从雪面往下的深度
  const temperatureMarkers = useMemo(() => {
    const minTemp = -25;
    const maxTemp = 0;
    const range = maxTemp - minTemp || 1;

    return temperaturePoints
      .map((pt) => {
        const depthFromSurface = Number(pt.depth); // 从雪面往下的深度
        const temp = Number(pt.temperature);
        if (!Number.isFinite(depthFromSurface) || !Number.isFinite(temp)) return null;

        const normalized = ((temp - minTemp) / range) * 100;
        const clamped = Math.max(0, Math.min(100, normalized));
        const x = xAxisSide === 'right' ? clamped : 100 - clamped;
        // 转换：从雪面往下的深度 → 距地表高度
        const heightFromGround = totalHS - depthFromSurface;
        const y = resolveDepthPercent(Math.max(0, heightFromGround));

        return {
          id: pt.id,
          x,
          y,
          label: `${temp}°C`,
        };
      })
      .filter((pt): pt is NonNullable<typeof pt> => pt !== null);
  }, [temperaturePoints, xAxisSide, resolveDepthPercent, totalHS]);

  // 测试标记
  const resolvedTestMarkers = useMemo(() => {
    return testMarkers
      .map((marker) => ({
        ...marker,
        yPercent: resolveDepthPercent(marker.depth),
      }))
      .filter((marker) => Number.isFinite(marker.yPercent));
  }, [testMarkers, resolveDepthPercent]);

  // 层标签
  const layerLabels = useMemo(() => {
    const width = Math.max(1, chartWidthPx);
    return diagramLayers
      .filter((layer) => layer.showLabel)
      .map((layer) => {
        const x = xAxisSide === 'right' ? width - (layer.topWidth / 100) * width + 6 : 6;
        return {
          id: layer.id,
          x,
          y: layer.topPx + 4,
          text: layer.label,
        };
      });
  }, [diagramLayers, chartWidthPx, xAxisSide]);

  // 手柄
  const layerHandles = useMemo(() => {
    const width = Math.max(1, chartWidthPx);
    return diagramLayers.flatMap((layer) => {
      const topY = layer.topPx;
      const bottomY = layer.topPx + layer.heightPx;
      const topOuter = (layer.topWidth / 100) * width;
      const bottomOuter = (layer.bottomWidth / 100) * width;
      const topOuterX = xAxisSide === 'right' ? width - topOuter : topOuter;
      const bottomOuterX = xAxisSide === 'right' ? width - bottomOuter : bottomOuter;
      const clampX = (value: number) => Math.max(0, Math.min(width, value));
      const clampY = (value: number) => Math.max(0, Math.min(chartHeightPx, value));
      return [
        {
          key: `${layer.id}-top`,
          layerId: layer.id,
          edge: 'top' as const,
          x: clampX(topOuterX),
          y: clampY(topY),
          fill: layer.color,
          stroke: layer.borderColor,
        },
        {
          key: `${layer.id}-bottom`,
          layerId: layer.id,
          edge: 'bottom' as const,
          x: clampX(bottomOuterX),
          y: clampY(bottomY),
          fill: layer.color,
          stroke: layer.borderColor,
        },
      ];
    });
  }, [diagramLayers, chartWidthPx, chartHeightPx, xAxisSide]);

  // 手柄拖动
  const handleLayerHandleDown = useCallback(
    (layerId: number, edge: 'top' | 'bottom', event: React.PointerEvent) => {
      event.preventDefault();
      const target = event.currentTarget as HTMLElement;
      target.setPointerCapture(event.pointerId);

      const resolveWidthFromClientX = (clientX: number) => {
        const rect = chartAreaRef.current?.getBoundingClientRect();
        if (!rect || rect.width === 0) return 50;
        const clampedX = Math.max(0, Math.min(rect.width, clientX - rect.left));
        const ratio = (clampedX / rect.width) * 100;
        return Math.max(0, Math.min(100, xAxisSide === 'right' ? 100 - ratio : ratio));
      };

      const updateWidth = (clientX: number) => {
        const width = resolveWidthFromClientX(clientX);
        const newRows = layerRows.map((row) => {
          if (row.id === layerId) {
            return {
              ...row,
              [edge === 'top' ? 'hardnessTop' : 'hardnessBottom']: width,
            };
          }
          return row;
        });
        onLayerRowsChange(newRows);
      };

      updateWidth(event.clientX);

      const handleMove = (moveEvent: PointerEvent) => updateWidth(moveEvent.clientX);
      const handleUp = () => {
        window.removeEventListener('pointermove', handleMove);
        window.removeEventListener('pointerup', handleUp);
        target.releasePointerCapture(event.pointerId);

        // 更新硬度
        const row = layerRows.find((r) => r.id === layerId);
        if (row && row.hardnessTop !== undefined && row.hardnessBottom !== undefined) {
          const minWidth = Math.min(row.hardnessTop, row.hardnessBottom);
          const nextHardness = getHardnessByWidth(minWidth);
          if (nextHardness && nextHardness !== row.hardness) {
            const newRows = layerRows.map((r) =>
              r.id === layerId ? { ...r, hardness: nextHardness } : r
            );
            onLayerRowsChange(newRows);
          }
        }
      };

      window.addEventListener('pointermove', handleMove);
      window.addEventListener('pointerup', handleUp);
    },
    [layerRows, onLayerRowsChange, xAxisSide]
  );

  // 添加层
  const addLayer = useCallback(() => {
    const nextId = Math.max(0, ...layerRows.map((row) => row.id)) + 1;
    const newRow: LayerRow = {
      id: nextId,
      topDepth: '',
      hardness: 'F',
      type: 'PP',
      grainSize: '',
      wetness: 'D',
      notes: '',
    };
    onLayerRowsChange([...layerRows, newRow]);
  }, [layerRows, onLayerRowsChange]);

  // 删除层
  const removeLayer = useCallback(
    (id: number) => {
      onLayerRowsChange(layerRows.filter((row) => row.id !== id));
    },
    [layerRows, onLayerRowsChange]
  );

  // 更新单个层的字段
  const updateLayerField = useCallback(
    (id: number, field: keyof LayerRow, value: any) => {
      const newRows = layerRows.map((row) => {
        if (row.id === id) {
          const updated = { ...row, [field]: value };
          // 如果硬度改变，重置宽度
          if (field === 'hardness') {
            delete updated.hardnessTop;
            delete updated.hardnessBottom;
          }
          return updated;
        }
        return row;
      });
      onLayerRowsChange(newRows);
    },
    [layerRows, onLayerRowsChange]
  );

  // 带深度信息的层列表（按输入顺序，从雪面往下）
  const sortedLayerRows = useMemo(() => {
    return layersWithDepth;
  }, [layersWithDepth]);

  // 排序后的温度点（按高度，从大到小，雪面在上地表在下）
  const sortedTempPoints = useMemo(() => {
    return [...temperaturePoints].sort((a, b) => {
      const aDepth = Number(a.depth);
      const bDepth = Number(b.depth);
      const aValue = Number.isFinite(aDepth) ? aDepth : -1;
      const bValue = Number.isFinite(bDepth) ? bDepth : -1;
      return bValue - aValue; // 从大到小（雪面在上）
    });
  }, [temperaturePoints]);

  // 添加温度测量点
  const addTempPoint = useCallback(() => {
    const nextId = Math.max(0, ...temperaturePoints.map((pt) => pt.id)) + 1;
    const newPoint: TemperaturePoint = {
      id: nextId,
      depth: '',
      temperature: '',
    };
    onTemperaturePointsChange([...temperaturePoints, newPoint]);
  }, [temperaturePoints, onTemperaturePointsChange]);

  // 回车新增雪层
  const handleLayerKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addLayer();
    }
  }, [addLayer]);

  // 回车新增温度点
  const handleTempKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTempPoint();
    }
  }, [addTempPoint]);

  // 删除温度测量点
  const removeTempPoint = useCallback(
    (id: number) => {
      onTemperaturePointsChange(temperaturePoints.filter((pt) => pt.id !== id));
    },
    [temperaturePoints, onTemperaturePointsChange]
  );

  // 更新温度测量点
  const updateTempPoint = useCallback(
    (id: number, field: keyof TemperaturePoint, value: any) => {
      const newPoints = temperaturePoints.map((pt) =>
        pt.id === id ? { ...pt, [field]: value } : pt
      );
      onTemperaturePointsChange(newPoints);
    },
    [temperaturePoints, onTemperaturePointsChange]
  );

  return (
    <div className="snow-profile-section">
      <h3 className="section-title">雪层剖面信息</h3>

      <div className="profile-card">
        {/* 轴控制 */}
        <div className="axis-controls">
          <div className="axis-group">
            <span className="axis-label">横轴</span>
            <button
              className={`axis-btn ${xAxisSide === 'left' ? 'active' : ''}`}
              onClick={() => onXAxisSideChange('left')}
            >
              左侧
            </button>
            <button
              className={`axis-btn ${xAxisSide === 'right' ? 'active' : ''}`}
              onClick={() => onXAxisSideChange('right')}
            >
              右侧
            </button>
          </div>
          <div className="axis-group">
            <span className="axis-label">纵轴</span>
            <button
              className={`axis-btn ${yAxisDirection === 'down' ? 'active' : ''}`}
              onClick={() => onYAxisDirectionChange('down')}
            >
              从高到低
            </button>
            <button
              className={`axis-btn ${yAxisDirection === 'up' ? 'active' : ''}`}
              onClick={() => onYAxisDirectionChange('up')}
            >
              从低到高
            </button>
          </div>
        </div>

        {/* 图表区域 */}
        <div className="chart-container">
          {/* 温度刻度 */}
          <div className="temp-scale">
            <div className="temp-label">温度 (°C)</div>
            <div className="temp-ticks">
              {temperatureTicks.map((tick, index) => (
                <span
                  key={tick}
                  className="temp-tick"
                  style={{
                    left: `${temperatureTickPosition(tick)}%`,
                    transform:
                      index === 0
                        ? 'translateX(0)'
                        : index === temperatureTicks.length - 1
                          ? 'translateX(-100%)'
                          : 'translateX(-50%)',
                  }}
                >
                  {tick}°C
                </span>
              ))}
            </div>
          </div>

          {/* 主图表 */}
          <div className="chart-main">
            {/* 左侧深度刻度 */}
            <div className="depth-scale left" style={{ height: chartHeightPx }}>
              <span className="depth-label">深度 (cm)</span>
              {depthTicks.map((tick) => (
                <span
                  key={tick}
                  className="depth-tick"
                  style={{ top: `${resolveDepthPercent(tick)}%` }}
                >
                  {tick}
                </span>
              ))}
            </div>

            {/* 图表区域 */}
            <div ref={chartAreaRef} className="chart-area" style={{ height: chartHeightPx }}>
              {/* 网格线 */}
              <div className="grid-lines">
                {depthTicks.map((tick) => (
                  <div
                    key={`h-${tick}`}
                    className="grid-line horizontal"
                    style={{ top: `${resolveDepthPercent(tick)}%` }}
                  />
                ))}
                {hardnessScale.map((item) => (
                  <div
                    key={`v-${item.key}`}
                    className="grid-line vertical"
                    style={{ left: `${item.position}%` }}
                  />
                ))}
              </div>

              {/* 层 SVG */}
              <svg
                className="layer-svg"
                viewBox={`0 0 ${chartWidthPx} ${chartHeightPx}`}
                preserveAspectRatio="none"
              >
                {layerPolygons.map((layer) => (
                  <polygon
                    key={layer.id}
                    points={layer.points}
                    fill={layer.color}
                    stroke={layer.borderColor}
                    strokeWidth={1}
                    vectorEffect="non-scaling-stroke"
                  />
                ))}
              </svg>

              {/* 温度曲线 */}
              <svg className="temp-curve-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
                <polyline
                  points={temperaturePolyline}
                  fill="none"
                  stroke="#888"
                  strokeWidth={1}
                  vectorEffect="non-scaling-stroke"
                />
              </svg>

              {/* 温度点标签 */}
              {temperatureMarkers.map((point) => (
                <span
                  key={point.id}
                  className="temp-point-label"
                  style={{ left: `calc(${point.x}% + 6px)`, top: `${point.y}%` }}
                >
                  {point.label}
                </span>
              ))}

              {/* 层标签 */}
              {layerLabels.map((label) => (
                <span
                  key={label.id}
                  className="layer-label"
                  style={{ left: label.x, top: label.y }}
                >
                  {label.text}
                </span>
              ))}

              {/* 测试标记 */}
              {resolvedTestMarkers.map((marker) => (
                <div
                  key={`${marker.depth}-${marker.label}`}
                  className="test-marker"
                  style={{ top: `calc(${marker.yPercent}% - 1px)` }}
                >
                  <div className="test-marker-line" />
                  <span
                    className="test-marker-label"
                    style={xAxisSide === 'right' ? { right: 96 } : { left: 96 }}
                  >
                    {marker.label}
                  </span>
                </div>
              ))}

              {/* 拖动手柄 */}
              {layerHandles.map((handle) => (
                <button
                  key={handle.key}
                  className="layer-handle"
                  style={{
                    left: handle.x,
                    top: handle.y,
                    backgroundColor: handle.fill,
                    borderColor: handle.stroke,
                  }}
                  onPointerDown={(e) => handleLayerHandleDown(handle.layerId, handle.edge, e)}
                />
              ))}
            </div>

            {/* 右侧深度刻度 */}
            <div className="depth-scale right" style={{ height: chartHeightPx }}>
              {depthTicks.map((tick) => (
                <span
                  key={tick}
                  className="depth-tick"
                  style={{ top: `${resolveDepthPercent(tick)}%` }}
                >
                  {tick}
                </span>
              ))}
            </div>
          </div>

          {/* 硬度刻度 */}
          <div className="hardness-scale">
            {hardnessScale.map((item) => (
              <span
                key={item.key}
                className="hardness-tick"
                style={{ left: `${item.position}%`, transform: item.transform }}
              >
                <span className="hardness-dot" style={{ backgroundColor: item.color }} />
                {item.label}
              </span>
            ))}
          </div>

          {/* 图例 */}
          <div className="chart-legend">
            <span>晶型: PP DF RG FC DH SH MF CR</span>
            <span>湿度: D M W V S</span>
          </div>
        </div>

        {/* 雪层数据表格 */}
        <div className="layer-table-wrapper">
          <div className="table-title">
            雪层记录 (从雪面往下，输入层底高度)
            {totalHS > 0 && (
              <span className="depth-info">
                总雪深: {totalHS}cm
                {remainingDepth > 0 && <span className="remaining"> | 距地表: {remainingDepth}cm</span>}
                {isOverflow && <span className="overflow"> | 超出雪面!</span>}
              </span>
            )}
          </div>
          <table className="layer-table">
            <thead>
              <tr>
                <th>层底高度 (cm)</th>
                <th>层范围</th>
                <th>厚度</th>
                <th>硬度</th>
                <th>晶型</th>
                <th>粒径 (mm)</th>
                <th>湿度</th>
                <th>备注</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {sortedLayerRows.map((row) => (
                <tr key={row.id}>
                  <td>
                    <input
                      type="number"
                      value={row.topDepth}
                      onChange={(e) => updateLayerField(row.id, 'topDepth', e.target.value)}
                      onKeyDown={handleLayerKeyDown}
                      className="table-input"
                      placeholder="如: 140"
                      min="0"
                    />
                  </td>
                  <td className="depth-range">
                    {row.endDepth !== undefined && row.startDepth !== undefined
                      ? `${row.startDepth} → ${row.endDepth}`
                      : '--'}
                  </td>
                  <td className="thickness-cell">
                    {row.thickness !== undefined && row.thickness > 0 ? `${row.thickness}cm` : '--'}
                  </td>
                  <td>
                    <select
                      value={row.hardness}
                      onChange={(e) => updateLayerField(row.id, 'hardness', e.target.value)}
                      className="table-select"
                    >
                      {HARDNESS_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <select
                      value={row.type}
                      onChange={(e) => updateLayerField(row.id, 'type', e.target.value)}
                      className="table-select"
                    >
                      {CRYSTAL_TYPE_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <input
                      type="text"
                      value={row.grainSize}
                      onChange={(e) => updateLayerField(row.id, 'grainSize', e.target.value)}
                      className="table-input narrow"
                    />
                  </td>
                  <td>
                    <select
                      value={row.wetness}
                      onChange={(e) => updateLayerField(row.id, 'wetness', e.target.value)}
                      className="table-select"
                    >
                      {WETNESS_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <input
                      type="text"
                      value={row.notes}
                      onChange={(e) => updateLayerField(row.id, 'notes', e.target.value)}
                      className="table-input wide"
                    />
                  </td>
                  <td>
                    <button className="remove-btn" onClick={() => removeLayer(row.id)}>
                      ×
                    </button>
                  </td>
                </tr>
              ))}
              {sortedLayerRows.length === 0 && (
                <tr>
                  <td colSpan={8} className="empty-row">
                    暂无数据
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="table-actions">
          <button className="add-layer-btn" onClick={addLayer}>
            + 新增一层
          </button>
        </div>

        {/* 温度剖面记录 */}
        <div className="layer-table-wrapper temperature-table">
          <div className="table-title">温度剖面 (从雪面往下，0=雪面)</div>
          <table className="layer-table">
            <thead>
              <tr>
                <th>深度 (cm)</th>
                <th>温度 (°C)</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {sortedTempPoints.map((pt) => (
                <tr key={pt.id}>
                  <td>
                    <input
                      type="number"
                      value={pt.depth}
                      onChange={(e) => updateTempPoint(pt.id, 'depth', e.target.value)}
                      onKeyDown={handleTempKeyDown}
                      className="table-input"
                      placeholder="如: 10"
                      min="0"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      step="0.1"
                      value={pt.temperature}
                      onChange={(e) => updateTempPoint(pt.id, 'temperature', e.target.value)}
                      onKeyDown={handleTempKeyDown}
                      className="table-input"
                      placeholder="如: -5"
                    />
                  </td>
                  <td>
                    <button className="remove-btn" onClick={() => removeTempPoint(pt.id)}>
                      ×
                    </button>
                  </td>
                </tr>
              ))}
              {sortedTempPoints.length === 0 && (
                <tr>
                  <td colSpan={3} className="empty-row">
                    暂无温度数据
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="table-actions">
          <button className="add-layer-btn" onClick={addTempPoint}>
            + 新增温度点
          </button>
        </div>
      </div>
    </div>
  );
}
