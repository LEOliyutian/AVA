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
  totalSnowDepth?: number | string;
  previewMode?: boolean;
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
  previewMode = false,
}: SnowProfileSectionProps) {
  const chartAreaRef = useRef<HTMLDivElement>(null);
  const chartMainRef = useRef<HTMLDivElement>(null);
  const [chartWidthPx, setChartWidthPx] = useState(1);
  const [chartHeightPx, setChartHeightPx] = useState(300);

  // 拖拽排序状态
  const [draggedLayerId, setDraggedLayerId] = useState<number | null>(null);
  const [dragOverLayerId, setDragOverLayerId] = useState<number | null>(null);

  // 表格切换状态：'layers' | 'temperature'
  const [activeTable, setActiveTable] = useState<'layers' | 'temperature'>('layers');

  // 解析总雪深
  const totalHS = useMemo(() => {
    const parsed = Number(totalSnowDepth);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
  }, [totalSnowDepth]);

  // 根据 topDepth 自动计算每层的 startDepth, endDepth, thickness
  const layersWithDepth = useMemo(() => {
    const validRows = layerRows.filter(r => r.topDepth !== '' && Number.isFinite(Number(r.topDepth)));
    const sortedRows = [...validRows].sort((a, b) => {
      const aTop = Number(a.topDepth) || 0;
      const bTop = Number(b.topDepth) || 0;
      return bTop - aTop;
    });

    const maxInput = sortedRows.length > 0 ? Math.max(...sortedRows.map(r => Number(r.topDepth) || 0)) : 0;
    let previousBottom = totalHS > 0 ? totalHS : maxInput;

    const result = sortedRows.map((row) => {
      const bottomDepth = Number(row.topDepth) || 0;
      const startDepth = bottomDepth;
      const endDepth = previousBottom;
      const thickness = Math.max(0, endDepth - startDepth);
      previousBottom = bottomDepth;
      return { ...row, startDepth, endDepth, thickness };
    });

    return result.filter(r => r.thickness > 0);
  }, [layerRows, totalHS]);

  // 计算最低层底和剩余深度
  const { minDepth, remainingDepth, isOverflow } = useMemo(() => {
    const min = layersWithDepth.length > 0
      ? Math.min(...layersWithDepth.map(r => r.startDepth || 0))
      : (totalHS > 0 ? totalHS : 0);
    const maxEnd = layersWithDepth.length > 0
      ? Math.max(...layersWithDepth.map(r => r.endDepth || 0))
      : 0;
    return {
      minDepth: min,
      remainingDepth: min,
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
        setChartHeightPx(entry.contentRect.height);
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

  // 深度百分比计算
  const resolveDepthPercent = useCallback(
    (value: number) => {
      if (maxDepthValue === 0) return 0;
      const normalized = (value / maxDepthValue) * 100;
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
  const { minTemp, maxTemp, temperatureTicks } = useMemo(() => {
    const temps = temperaturePoints
      .map((pt) => Number(pt.temperature))
      .filter((t) => Number.isFinite(t));
    const dataMinTemp = temps.length > 0 ? Math.min(...temps) : -25;
    const minT = Math.min(-25, Math.floor(dataMinTemp / 5) * 5 - 5);
    const maxT = 0;
    const ticks: number[] = [];
    for (let t = maxT; t >= minT; t -= 5) {
      ticks.push(t);
    }
    return { minTemp: minT, maxTemp: maxT, temperatureTicks: ticks };
  }, [temperaturePoints]);

  const temperatureTickPosition = useCallback(
    (tick: number) => {
      const range = maxTemp - minTemp || 1;
      const normalized = ((tick - minTemp) / range) * 100;
      const clamped = Math.max(0, Math.min(100, normalized));
      return xAxisSide === 'right' ? clamped : 100 - clamped;
    },
    [xAxisSide, minTemp, maxTemp]
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
      return { id: layer.id, points, color: layer.color, borderColor: layer.borderColor };
    });
  }, [diagramLayers, chartWidthPx, chartHeightPx, xAxisSide]);

  // 温度曲线
  const temperaturePolyline = useMemo(() => {
    if (temperaturePoints.length === 0) return '';
    const range = maxTemp - minTemp || 1;
    const sortedPoints = [...temperaturePoints]
      .map((pt) => ({ height: Number(pt.depth), temp: Number(pt.temperature) }))
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
  }, [temperaturePoints, xAxisSide, resolveDepthPercent, minTemp, maxTemp]);

  // 温度点标记
  const temperatureMarkers = useMemo(() => {
    const range = maxTemp - minTemp || 1;
    return temperaturePoints
      .map((pt) => {
        const height = Number(pt.depth);
        const temp = Number(pt.temperature);
        if (!Number.isFinite(height) || !Number.isFinite(temp)) return null;
        const normalized = ((temp - minTemp) / range) * 100;
        const clamped = Math.max(0, Math.min(100, normalized));
        const x = xAxisSide === 'right' ? clamped : 100 - clamped;
        const y = resolveDepthPercent(height);
        return { id: pt.id, x, y, label: `${temp}°C` };
      })
      .filter((pt): pt is NonNullable<typeof pt> => pt !== null);
  }, [temperaturePoints, xAxisSide, resolveDepthPercent, minTemp, maxTemp]);

  // 测试标记
  const resolvedTestMarkers = useMemo(() => {
    return testMarkers
      .map((marker) => ({ ...marker, yPercent: resolveDepthPercent(marker.depth) }))
      .filter((marker) => Number.isFinite(marker.yPercent));
  }, [testMarkers, resolveDepthPercent]);

  // 层标签
  const layerLabels = useMemo(() => {
    const width = Math.max(1, chartWidthPx);
    return diagramLayers
      .filter((layer) => layer.showLabel)
      .map((layer) => {
        const x = xAxisSide === 'right' ? width - (layer.topWidth / 100) * width + 6 : 6;
        return { id: layer.id, x, y: layer.topPx + 4, text: layer.label };
      });
  }, [diagramLayers, chartWidthPx, xAxisSide]);

  // 图表手柄
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
        { key: `${layer.id}-top`, layerId: layer.id, edge: 'top' as const, x: clampX(topOuterX), y: clampY(topY), fill: layer.color, stroke: layer.borderColor },
        { key: `${layer.id}-bottom`, layerId: layer.id, edge: 'bottom' as const, x: clampX(bottomOuterX), y: clampY(bottomY), fill: layer.color, stroke: layer.borderColor },
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
            return { ...row, [edge === 'top' ? 'hardnessTop' : 'hardnessBottom']: width };
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

  // === 拖拽排序功能 ===
  const handleDragStart = useCallback((e: React.DragEvent, layerId: number) => {
    setDraggedLayerId(layerId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(layerId));
    // 添加拖拽样式
    const target = e.currentTarget as HTMLElement;
    setTimeout(() => target.classList.add('dragging'), 0);
  }, []);

  const handleDragEnd = useCallback((e: React.DragEvent) => {
    setDraggedLayerId(null);
    setDragOverLayerId(null);
    const target = e.currentTarget as HTMLElement;
    target.classList.remove('dragging');
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, layerId: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (draggedLayerId !== null && draggedLayerId !== layerId) {
      setDragOverLayerId(layerId);
    }
  }, [draggedLayerId]);

  const handleDragLeave = useCallback(() => {
    setDragOverLayerId(null);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, targetLayerId: number) => {
    e.preventDefault();
    if (draggedLayerId === null || draggedLayerId === targetLayerId) {
      setDragOverLayerId(null);
      return;
    }

    const draggedIndex = layerRows.findIndex(r => r.id === draggedLayerId);
    const targetIndex = layerRows.findIndex(r => r.id === targetLayerId);

    if (draggedIndex === -1 || targetIndex === -1) {
      setDragOverLayerId(null);
      return;
    }

    // 重新排序
    const newRows = [...layerRows];
    const [removed] = newRows.splice(draggedIndex, 1);
    newRows.splice(targetIndex, 0, removed);
    onLayerRowsChange(newRows);

    setDraggedLayerId(null);
    setDragOverLayerId(null);
  }, [draggedLayerId, layerRows, onLayerRowsChange]);

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
    (id: number, field: keyof LayerRow, value: unknown) => {
      const newRows = layerRows.map((row) => {
        if (row.id === id) {
          const updated = { ...row, [field]: value };
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

  // 带深度信息的层列表
  const sortedLayerRows = useMemo(() => {
    const depthMap = new Map(layersWithDepth.map(r => [r.id, r]));
    return [...layerRows]
      .sort((a, b) => {
        const aTop = Number(a.topDepth) || 0;
        const bTop = Number(b.topDepth) || 0;
        return bTop - aTop;
      })
      .map(row => {
        const calculated = depthMap.get(row.id);
        return { ...row, startDepth: calculated?.startDepth, endDepth: calculated?.endDepth, thickness: calculated?.thickness };
      });
  }, [layerRows, layersWithDepth]);

  // 排序后的温度点
  const sortedTempPoints = useMemo(() => {
    return [...temperaturePoints].sort((a, b) => {
      const aDepth = Number(a.depth);
      const bDepth = Number(b.depth);
      const aValue = Number.isFinite(aDepth) ? aDepth : -1;
      const bValue = Number.isFinite(bDepth) ? bDepth : -1;
      return bValue - aValue;
    });
  }, [temperaturePoints]);

  // 添加温度测量点
  const addTempPoint = useCallback(() => {
    const nextId = Math.max(0, ...temperaturePoints.map((pt) => pt.id)) + 1;
    const newPoint: TemperaturePoint = { id: nextId, depth: '', temperature: '' };
    onTemperaturePointsChange([...temperaturePoints, newPoint]);
  }, [temperaturePoints, onTemperaturePointsChange]);

  // 回车新增
  const handleLayerKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addLayer();
    }
  }, [addLayer]);

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
    (id: number, field: keyof TemperaturePoint, value: unknown) => {
      const newPoints = temperaturePoints.map((pt) =>
        pt.id === id ? { ...pt, [field]: value } : pt
      );
      onTemperaturePointsChange(newPoints);
    },
    [temperaturePoints, onTemperaturePointsChange]
  );

  // 预览模式渲染
  if (previewMode) {
    return (
      <div className="snow-profile-section preview-mode">
        <div className="preview-layout">
          <div className="preview-chart-area">
            <div className="temp-scale">
              <div className="temp-ticks">
                {temperatureTicks.map((tick, index) => (
                  <span
                    key={tick}
                    className="temp-tick"
                    style={{
                      left: `${temperatureTickPosition(tick)}%`,
                      transform: index === 0 ? 'translateX(0)' : index === temperatureTicks.length - 1 ? 'translateX(-100%)' : 'translateX(-50%)',
                    }}
                  >
                    {tick}°
                  </span>
                ))}
              </div>
            </div>

            <div className="chart-main" ref={chartMainRef}>
              <div className="depth-scale left">
                <span className="depth-label">cm</span>
                {depthTicks.map((tick) => (
                  <span key={tick} className="depth-tick" style={{ top: `${resolveDepthPercent(tick)}%` }}>
                    {tick}
                  </span>
                ))}
              </div>

              <div ref={chartAreaRef} className="chart-area">
                <div className="grid-lines">
                  {depthTicks.map((tick) => (
                    <div key={`h-${tick}`} className="grid-line horizontal" style={{ top: `${resolveDepthPercent(tick)}%` }} />
                  ))}
                  {hardnessScale.map((item) => (
                    <div key={`v-${item.key}`} className="grid-line vertical" style={{ left: `${item.position}%` }} />
                  ))}
                </div>

                <svg className="layer-svg" viewBox={`0 0 ${chartWidthPx} ${chartHeightPx}`} preserveAspectRatio="none">
                  {layerPolygons.map((layer) => (
                    <polygon key={layer.id} points={layer.points} fill={layer.color} stroke={layer.borderColor} strokeWidth={1} vectorEffect="non-scaling-stroke" />
                  ))}
                </svg>

                <svg className="temp-curve-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <polyline points={temperaturePolyline} fill="none" stroke="var(--temp-color)" strokeWidth={2} vectorEffect="non-scaling-stroke" />
                </svg>

                {resolvedTestMarkers.map((marker) => (
                  <div key={`${marker.depth}-${marker.label}`} className="test-marker" style={{ top: `calc(${marker.yPercent}% - 1px)` }}>
                    <div className="test-marker-line" />
                    <span className="test-marker-label" style={xAxisSide === 'right' ? { right: 4 } : { left: 4 }}>
                      {marker.label}
                    </span>
                  </div>
                ))}
              </div>

              <div className="depth-scale right">
                {depthTicks.map((tick) => (
                  <span key={tick} className="depth-tick" style={{ top: `${resolveDepthPercent(tick)}%` }}>
                    {tick}
                  </span>
                ))}
              </div>
            </div>

            <div className="hardness-scale">
              {hardnessScale.map((item) => (
                <span key={item.key} className="hardness-tick" style={{ left: `${item.position}%`, transform: item.transform }}>
                  {item.label}
                </span>
              ))}
            </div>
          </div>

          <div className="preview-data-area">
            <table className="preview-table">
              <thead>
                <tr>
                  <th>深度</th>
                  <th>厚度</th>
                  <th>硬度</th>
                  <th>晶型</th>
                  <th>粒径</th>
                  <th>湿度</th>
                </tr>
              </thead>
              <tbody>
                {sortedLayerRows.map((row) => (
                  <tr key={row.id}>
                    <td>{row.startDepth}–{row.endDepth}</td>
                    <td>{row.thickness}cm</td>
                    <td>{row.hardness}</td>
                    <td>{row.type}</td>
                    <td>{row.grainSize || '-'}</td>
                    <td>{row.wetness}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {sortedTempPoints.length > 0 && (
              <table className="preview-table temp-table">
                <thead>
                  <tr>
                    <th>高度</th>
                    <th>温度</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedTempPoints.map((pt) => (
                    <tr key={pt.id}>
                      <td>{pt.depth}cm</td>
                      <td>{pt.temperature}°C</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 编辑模式渲染
  return (
    <div className="snow-profile-section">
      <h3 className="section-title">雪层剖面信息</h3>

      <div className="profile-card">
        <div className="axis-controls">
          <div className="axis-group">
            <span className="axis-label">横轴</span>
            <button className={`axis-btn ${xAxisSide === 'left' ? 'active' : ''}`} onClick={() => onXAxisSideChange('left')}>
              左侧
            </button>
            <button className={`axis-btn ${xAxisSide === 'right' ? 'active' : ''}`} onClick={() => onXAxisSideChange('right')}>
              右侧
            </button>
          </div>
          <div className="axis-group">
            <span className="axis-label">纵轴</span>
            <button className={`axis-btn ${yAxisDirection === 'down' ? 'active' : ''}`} onClick={() => onYAxisDirectionChange('down')}>
              从高到低
            </button>
            <button className={`axis-btn ${yAxisDirection === 'up' ? 'active' : ''}`} onClick={() => onYAxisDirectionChange('up')}>
              从低到高
            </button>
          </div>
        </div>

        <div className="profile-main-layout">
          <div className="profile-tables-panel">
            {/* 切换按钮 */}
            <div className="table-tabs">
              <button
                className={`tab-btn ${activeTable === 'layers' ? 'active' : ''}`}
                onClick={() => setActiveTable('layers')}
              >
                雪层记录
                {layerRows.length > 0 && <span className="tab-count">{layerRows.length}</span>}
              </button>
              <button
                className={`tab-btn ${activeTable === 'temperature' ? 'active' : ''}`}
                onClick={() => setActiveTable('temperature')}
              >
                温度剖面
                {temperaturePoints.length > 0 && <span className="tab-count">{temperaturePoints.length}</span>}
              </button>
            </div>

            {/* 雪层记录表格 */}
            {activeTable === 'layers' && (
              <div className="table-section layers active">
                <div className="layer-table-wrapper in-panel">
                  <div className="table-title">
                    <span className="table-hint">拖拽 ⋮⋮ 调整顺序</span>
                    {totalHS > 0 && (
                      <span className="depth-info">
                        HS: {totalHS}cm
                        {remainingDepth > 0 && <span className="remaining"> | 底部: {remainingDepth}cm</span>}
                        {isOverflow && <span className="overflow"> | 超限!</span>}
                      </span>
                    )}
                  </div>
                  <table className="layer-table compact-cols">
                    <thead>
                      <tr>
                        <th className="col-drag"></th>
                        <th className="col-depth">高度</th>
                        <th className="col-range">范围</th>
                        <th className="col-select">硬度</th>
                        <th className="col-select">晶型</th>
                        <th className="col-num">粒径</th>
                        <th className="col-select">湿度</th>
                        <th className="col-action"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {layerRows.map((row) => {
                        const calculated = layersWithDepth.find(l => l.id === row.id);
                        const isDragging = draggedLayerId === row.id;
                        const isDragOver = dragOverLayerId === row.id;
                        return (
                          <tr
                            key={row.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, row.id)}
                            onDragEnd={handleDragEnd}
                            onDragOver={(e) => handleDragOver(e, row.id)}
                            onDragLeave={handleDragLeave}
                            onDrop={(e) => handleDrop(e, row.id)}
                            className={`${isDragging ? 'dragging' : ''} ${isDragOver ? 'drag-over' : ''}`}
                          >
                            <td className="drag-handle">
                              <span className="drag-icon">⋮⋮</span>
                            </td>
                            <td>
                              <input
                                type="number"
                                value={row.topDepth}
                                onChange={(e) => updateLayerField(row.id, 'topDepth', e.target.value)}
                                onKeyDown={handleLayerKeyDown}
                                className="table-input"
                                placeholder="cm"
                                min="0"
                              />
                            </td>
                            <td className="depth-range">
                              {calculated ? `${calculated.startDepth}→${calculated.endDepth}` : '--'}
                            </td>
                            <td>
                              <select value={row.hardness} onChange={(e) => updateLayerField(row.id, 'hardness', e.target.value)} className="table-select">
                                {HARDNESS_OPTIONS.map((opt) => (
                                  <option key={opt} value={opt}>{opt}</option>
                                ))}
                              </select>
                            </td>
                            <td>
                              <select value={row.type} onChange={(e) => updateLayerField(row.id, 'type', e.target.value)} className="table-select">
                                {CRYSTAL_TYPE_OPTIONS.map((opt) => (
                                  <option key={opt} value={opt}>{opt}</option>
                                ))}
                              </select>
                            </td>
                            <td>
                              <input
                                type="number"
                                step="0.1"
                                value={row.grainSize}
                                onChange={(e) => updateLayerField(row.id, 'grainSize', e.target.value)}
                                className="table-input"
                                placeholder="mm"
                              />
                            </td>
                            <td>
                              <select value={row.wetness} onChange={(e) => updateLayerField(row.id, 'wetness', e.target.value)} className="table-select">
                                {WETNESS_OPTIONS.map((opt) => (
                                  <option key={opt} value={opt}>{opt}</option>
                                ))}
                              </select>
                            </td>
                            <td>
                              <button className="remove-btn" onClick={() => removeLayer(row.id)}>×</button>
                            </td>
                          </tr>
                        );
                      })}
                      {layerRows.length === 0 && (
                        <tr>
                          <td colSpan={8} className="empty-row">点击下方按钮添加雪层</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="table-actions compact">
                  <button className="add-layer-btn" onClick={addLayer}>+ 新增雪层 (Enter)</button>
                </div>
              </div>
            )}

            {/* 温度剖面表格 */}
            {activeTable === 'temperature' && (
              <div className="table-section temperature active">
                <div className="layer-table-wrapper temperature-table in-panel">
                  <div className="table-title">
                    <span className="table-hint">高度 = 距地表距离</span>
                  </div>
                  <table className="layer-table">
                    <thead>
                      <tr>
                        <th>高度 (cm)</th>
                        <th>温度 (°C)</th>
                        <th className="col-action"></th>
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
                              placeholder="150"
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
                              placeholder="-5"
                            />
                          </td>
                          <td>
                            <button className="remove-btn" onClick={() => removeTempPoint(pt.id)}>×</button>
                          </td>
                        </tr>
                      ))}
                      {sortedTempPoints.length === 0 && (
                        <tr>
                          <td colSpan={3} className="empty-row">点击下方按钮添加温度点</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="table-actions compact">
                  <button className="add-layer-btn" onClick={addTempPoint}>+ 新增温度点 (Enter)</button>
                </div>
              </div>
            )}
          </div>

          <div className="profile-chart-panel">
            <div className="chart-container">
              <div className="temp-scale">
                <div className="temp-label">温度 (°C)</div>
                <div className="temp-ticks">
                  {temperatureTicks.map((tick, index) => (
                    <span
                      key={tick}
                      className="temp-tick"
                      style={{
                        left: `${temperatureTickPosition(tick)}%`,
                        transform: index === 0 ? 'translateX(0)' : index === temperatureTicks.length - 1 ? 'translateX(-100%)' : 'translateX(-50%)',
                      }}
                    >
                      {tick}°
                    </span>
                  ))}
                </div>
              </div>

              <div className="chart-main" ref={chartMainRef}>
                <div className="depth-scale left">
                  <span className="depth-label">高度 (cm)</span>
                  {depthTicks.map((tick) => (
                    <span key={tick} className="depth-tick" style={{ top: `${resolveDepthPercent(tick)}%` }}>
                      {tick}
                    </span>
                  ))}
                </div>

                <div ref={chartAreaRef} className="chart-area">
                  <div className="grid-lines">
                    {depthTicks.map((tick) => (
                      <div key={`h-${tick}`} className="grid-line horizontal" style={{ top: `${resolveDepthPercent(tick)}%` }} />
                    ))}
                    {hardnessScale.map((item) => (
                      <div key={`v-${item.key}`} className="grid-line vertical" style={{ left: `${item.position}%` }} />
                    ))}
                  </div>

                  <svg className="layer-svg" viewBox={`0 0 ${chartWidthPx} ${chartHeightPx}`} preserveAspectRatio="none">
                    {layerPolygons.map((layer) => (
                      <polygon key={layer.id} points={layer.points} fill={layer.color} stroke={layer.borderColor} strokeWidth={1} vectorEffect="non-scaling-stroke" />
                    ))}
                  </svg>

                  <svg className="temp-curve-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <polyline points={temperaturePolyline} fill="none" stroke="var(--temp-color)" strokeWidth={2} vectorEffect="non-scaling-stroke" />
                  </svg>

                  {temperatureMarkers.map((point) => (
                    <span key={point.id} className="temp-point-label" style={{ left: `calc(${point.x}% + 6px)`, top: `${point.y}%` }}>
                      {point.label}
                    </span>
                  ))}

                  {layerLabels.map((label) => (
                    <span key={label.id} className="layer-label" style={{ left: label.x, top: label.y }}>
                      {label.text}
                    </span>
                  ))}

                  {resolvedTestMarkers.map((marker) => (
                    <div key={`${marker.depth}-${marker.label}`} className="test-marker" style={{ top: `calc(${marker.yPercent}% - 1px)` }}>
                      <div className="test-marker-line" />
                      <span className="test-marker-label" style={xAxisSide === 'right' ? { right: 96 } : { left: 96 }}>
                        {marker.label}
                      </span>
                    </div>
                  ))}

                  {layerHandles.map((handle) => (
                    <button
                      key={handle.key}
                      className="layer-handle"
                      style={{ left: handle.x, top: handle.y, backgroundColor: handle.fill, borderColor: handle.stroke }}
                      onPointerDown={(e) => handleLayerHandleDown(handle.layerId, handle.edge, e)}
                      title="拖动调整硬度宽度"
                    />
                  ))}
                </div>

                <div className="depth-scale right">
                  {depthTicks.map((tick) => (
                    <span key={tick} className="depth-tick" style={{ top: `${resolveDepthPercent(tick)}%` }}>
                      {tick}
                    </span>
                  ))}
                </div>
              </div>

              <div className="hardness-scale">
                {hardnessScale.map((item) => (
                  <span key={item.key} className="hardness-tick" style={{ left: `${item.position}%`, transform: item.transform }}>
                    <span className="hardness-dot" style={{ backgroundColor: item.color }} />
                    {item.label}
                  </span>
                ))}
              </div>

              <div className="chart-legend">
                <span>晶型: PP DF RG FC DH SH MF CR</span>
                <span>湿度: D M W V S</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
