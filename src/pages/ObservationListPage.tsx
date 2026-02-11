import { useEffect, useState, useRef, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useObservationStore } from '../store';
import { useToast } from '../hooks';
import { ConfirmDialog } from '../components/ui';
import { observationApi, type ObservationDetail } from '../api/observation.api';
import { exportToPng } from '../utils';
import { SnowProfileSection } from '../components/observation';
import './ObservationListPage.css';

// 简易雪层缩略图组件
function SnowDepthThumbnail({ depth }: { depth: string | null }) {
  const depthNum = depth ? parseInt(depth) : 0;
  const maxHeight = 40;
  const barHeight = Math.min(maxHeight, Math.max(4, (depthNum / 200) * maxHeight));

  return (
    <div className="snow-thumbnail">
      <div
        className="snow-bar"
        style={{ height: barHeight }}
        title={depth ? `${depth} cm` : '未知'}
      />
      <span className="snow-depth-label">{depth || '-'}</span>
    </div>
  );
}

export function ObservationListPage() {
  const navigate = useNavigate();
  const { success, error: showError } = useToast();
  const {
    observations,
    pagination,
    isListLoading,
    listError,
    fetchList,
    deleteObservation,
  } = useObservationStore();

  const [myOnly, setMyOnly] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  // 批量选择状态
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [batchDeleteConfirm, setBatchDeleteConfirm] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState({ current: 0, total: 0 });

  // 用于批量导出的隐藏报告容器
  const hiddenReportRef = useRef<HTMLDivElement>(null);
  const [exportData, setExportData] = useState<ObservationDetail | null>(null);

  // 加载列表
  useEffect(() => {
    fetchList({ page: 1, limit: 20, myOnly });
  }, [fetchList, myOnly]);

  // 翻页
  const handlePageChange = (page: number) => {
    fetchList({ page, limit: pagination.limit, myOnly });
  };

  // 删除确认
  const handleDelete = async (id: number) => {
    const result = await deleteObservation(id);
    if (result.success) {
      setDeleteConfirmId(null);
      success('观测记录删除成功');
    } else {
      showError(result.error || '删除失败');
    }
  };

  // 格式化日期
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('zh-CN');
  };

  // 全选/取消全选
  const handleSelectAll = () => {
    if (selectedIds.size === observations.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(observations.map((obs) => obs.id)));
    }
  };

  // 单个选择
  const handleSelect = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // 批量删除
  const handleBatchDelete = async () => {
    const ids = Array.from(selectedIds);
    let successCount = 0;
    for (const id of ids) {
      const result = await deleteObservation(id);
      if (result.success) successCount++;
    }
    setBatchDeleteConfirm(false);
    setSelectedIds(new Set());
    if (successCount === ids.length) {
      success(`成功删除 ${successCount} 条记录`);
    } else {
      showError(`删除完成，成功 ${successCount} 条，失败 ${ids.length - successCount} 条`);
    }
  };

  // 生成测试摘要标签
  const formatTestLabel = (test: { type: string; taps?: string; result?: string; quality?: string; cut?: string; length?: string; propagation?: string; score?: string }) => {
    switch (test.type) {
      case 'CT':
        return `CT${test.taps || ''}${test.quality || ''}`;
      case 'ECT':
        const ectResult = test.result?.replace('ECT', '') || '';
        return `ECT${ectResult}${test.taps || ''}`;
      case 'PST':
        const pstInfo = test.cut && test.length ? `${test.cut}/${test.length}` : '';
        return `PST${pstInfo}${test.propagation || ''}`;
      case 'RB':
        return `${test.score || 'RB'}${test.quality || ''}`;
      case 'DTT':
        return `DTT${test.result || ''}`;
      case '槽口测试':
        return `槽口${test.result || ''}`;
      default:
        return test.type;
    }
  };

  // 从 ObservationDetail 转换为编辑器格式的辅助函数
  const convertToEditorFormat = (data: ObservationDetail) => {
    return {
      info: {
        recordId: data.record_id || '',
        locationDescription: data.location_description || '',
        observer: data.observer || '',
        date: data.observation_date || '',
        gpsCoordinates: data.gps_coordinates || '',
        elevation: data.elevation || '',
        slopeAspect: data.slope_aspect || '',
        slopeAngle: data.slope_angle || '',
        totalSnowDepth: data.total_snow_depth || '',
        airTemperature: data.air_temperature || '',
        weather: data.weather || '',
        bootPenetration: data.boot_penetration || '',
        wind: data.wind || '',
        blowingSnow: data.blowing_snow || '',
      },
      layerRows: (data.snow_layers || []).map((layer, index) => ({
        id: layer.id || index + 1,
        topDepth: layer.end_depth ?? '',
        hardness: layer.hardness || 'F',
        type: layer.crystal_type || 'PP',
        grainSize: layer.grain_size || '',
        wetness: layer.wetness || 'D',
        notes: layer.notes || '',
        hardnessTop: layer.hardness_top,
        hardnessBottom: layer.hardness_bottom,
      })),
      temperaturePoints: (data.temperature_points || []).map((pt, index) => ({
        id: pt.id || index + 1,
        depth: pt.depth ?? '',
        temperature: pt.temperature ?? '',
      })),
      stabilityGroups: (data.stability_test_groups || []).map((group, gIndex) => ({
        id: group.id || gIndex + 1,
        depth: group.depth ?? '',
        weakLayerType: group.weak_layer_type || '',
        weakLayerGrainSize: group.weak_layer_grain_size || '',
        notes: group.notes || '',
        tests: (group.tests || []).map((test, tIndex) => ({
          id: test.id || tIndex + 1,
          type: test.test_type || 'CT',
          taps: test.taps || '',
          result: test.result || '',
          quality: test.quality || '',
          cut: test.cut || '',
          length: test.length || '',
          propagation: test.propagation || '',
          score: test.score || '',
          notes: test.notes || '',
        })),
      })),
      conclusion: data.conclusion || '',
      diagramXAxisSide: data.diagram_x_axis_side || 'left',
      diagramYAxisDirection: data.diagram_y_axis_direction || 'down',
    };
  };

  // 批量导出
  const handleBatchExport = async (format: 'png' | 'pdf') => {
    const ids = Array.from(selectedIds);
    setIsExporting(true);
    setExportProgress({ current: 0, total: ids.length });

    for (let i = 0; i < ids.length; i++) {
      const id = ids[i];
      setExportProgress({ current: i + 1, total: ids.length });

      // 获取完整观测数据
      const result = await observationApi.getById(id);
      if (!result.success || !result.data) continue;

      const obs = result.data.observation;
      setExportData(obs);

      // 等待渲染完成
      await new Promise((resolve) => setTimeout(resolve, 300));

      // 导出
      if (hiddenReportRef.current) {
        const filename = `雪坑观测_${obs.observation_date || 'unknown'}_${obs.observer || id}.${format}`;
        try {
          await exportToPng(hiddenReportRef.current, filename);
        } catch (e) {
          console.error('导出失败:', e);
        }
      }
    }

    setExportData(null);
    setIsExporting(false);
    success(`成功导出 ${ids.length} 条记录`);
  };

  // 计算当前导出数据的 testMarkers
  const exportTestMarkers = useMemo(() => {
    if (!exportData) return [];
    const editor = convertToEditorFormat(exportData);
    return editor.stabilityGroups
      .filter((g) => g.depth !== '' && Number.isFinite(Number(g.depth)))
      .map((g) => ({
        depth: Number(g.depth),
        label: g.tests.map(formatTestLabel).join('/') || '测试',
      }));
  }, [exportData]);

  return (
    <div className="observation-list-page">
      {/* 顶部导航 */}
      {/* 顶部导航 - 重构为更稳固的布局 */}
      <div className="list-header-redesigned">
        <div className="header-brand-area">
          <Link to="/" className="back-link-simple">
            ← 首页
          </Link>
          <h1 className="page-title">雪层观测记录</h1>
        </div>
        <div className="header-actions-area">
          <button
            className="new-record-btn-primary"
            onClick={() => navigate('/observations/new')}
          >
            <span className="icon">+</span> 新建观测
          </button>
        </div>
      </div>

      {/* 额外的悬浮按钮 (Floating Action Button) - 双保险 */}
      <button
        className="fab-new-record"
        onClick={() => navigate('/observations/new')}
        title="新建观测记录"
      >
        +
      </button>

      {/* 筛选栏 */}
      <div className="filter-bar">
        <label className="filter-checkbox">
          <input
            type="checkbox"
            checked={myOnly}
            onChange={(e) => setMyOnly(e.target.checked)}
          />
          <span>仅显示我的记录</span>
        </label>
        <div className="filter-info">
          共 {pagination.total} 条记录
        </div>
      </div>

      {/* 列表内容 */}
      <div className="list-content">
        {isListLoading ? (
          <div className="loading-state">
            <div className="loading-spinner" />
            <p>加载中...</p>
          </div>
        ) : listError ? (
          <div className="error-state">
            <p>{listError}</p>
            <button onClick={() => fetchList({ page: 1, myOnly })}>
              重试
            </button>
          </div>
        ) : observations.length === 0 ? (
          <div className="empty-state">
            <p>暂无观测记录</p>
            <button onClick={() => navigate('/observations/new')}>
              创建第一条记录
            </button>
          </div>
        ) : (
          <>
            {/* 批量操作工具栏 */}
            {selectedIds.size > 0 && (
              <div className="batch-toolbar">
                <span className="batch-count">已选择 {selectedIds.size} 项</span>
                <div className="batch-actions">
                  <button
                    className="batch-btn export"
                    onClick={() => handleBatchExport('png')}
                    disabled={isExporting}
                  >
                    📷 批量导出PNG
                  </button>
                  <button
                    className="batch-btn delete"
                    onClick={() => setBatchDeleteConfirm(true)}
                    disabled={isExporting}
                  >
                    🗑️ 批量删除
                  </button>
                  <button
                    className="batch-btn cancel"
                    onClick={() => setSelectedIds(new Set())}
                  >
                    取消选择
                  </button>
                </div>
              </div>
            )}

            {/* 导出进度显示 */}
            {isExporting && (
              <div className="export-progress">
                <div className="export-progress-bar">
                  <div
                    className="export-progress-fill"
                    style={{ width: `${(exportProgress.current / exportProgress.total) * 100}%` }}
                  />
                </div>
                <span>正在导出 {exportProgress.current}/{exportProgress.total}</span>
              </div>
            )}

            <table className="observation-table">
              <thead>
                <tr>
                  <th className="checkbox-cell">
                    <input
                      type="checkbox"
                      checked={selectedIds.size === observations.length && observations.length > 0}
                      onChange={handleSelectAll}
                      title="全选/取消全选"
                    />
                  </th>
                  <th>雪深</th>
                  <th>记录编号</th>
                  <th>观测日期</th>
                  <th>位置描述</th>
                  <th>海拔</th>
                  <th>坡向</th>
                  <th>观测员</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {observations.map((obs) => (
                  <tr
                    key={obs.id}
                    onClick={() => navigate(`/observations/${obs.id}`)}
                    className={selectedIds.has(obs.id) ? 'selected-row' : ''}
                  >
                    <td className="checkbox-cell" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selectedIds.has(obs.id)}
                        onChange={() => {}}
                        onClick={(e) => handleSelect(obs.id, e)}
                      />
                    </td>
                    <td className="thumbnail-cell">
                      <SnowDepthThumbnail depth={obs.total_snow_depth} />
                    </td>
                    <td className="record-id">
                      {obs.record_id || `#${obs.id}`}
                    </td>
                    <td>{formatDate(obs.observation_date)}</td>
                    <td className="location">
                      {obs.location_description || '-'}
                    </td>
                    <td>{obs.elevation || '-'}</td>
                    <td>{obs.slope_aspect || '-'}</td>
                    <td>{obs.observer || obs.observer_name || '-'}</td>
                    <td className="actions">
                      <button
                        className="action-btn edit"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/observations/${obs.id}`);
                        }}
                      >
                        编辑
                      </button>
                      <button
                        className="action-btn delete"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteConfirmId(obs.id);
                        }}
                      >
                        删除
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* 分页 */}
            {pagination.totalPages > 1 && (
              <div className="pagination">
                <button
                  className="page-btn"
                  disabled={pagination.page <= 1}
                  onClick={() => handlePageChange(pagination.page - 1)}
                >
                  上一页
                </button>
                <span className="page-info">
                  {pagination.page} / {pagination.totalPages}
                </span>
                <button
                  className="page-btn"
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => handlePageChange(pagination.page + 1)}
                >
                  下一页
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <ConfirmDialog
        open={deleteConfirmId !== null}
        title="确认删除"
        message="确定要删除这条观测记录吗？此操作不可撤销。"
        confirmText="确认删除"
        variant="danger"
        onConfirm={() => deleteConfirmId !== null && handleDelete(deleteConfirmId)}
        onCancel={() => setDeleteConfirmId(null)}
      />

      <ConfirmDialog
        open={batchDeleteConfirm}
        title="批量删除确认"
        message={`确定要删除选中的 ${selectedIds.size} 条观测记录吗？此操作不可撤销。`}
        confirmText="确认删除"
        variant="danger"
        onConfirm={handleBatchDelete}
        onCancel={() => setBatchDeleteConfirm(false)}
      />

      {/* 隐藏的报告容器用于批量导出 */}
      {exportData && (
        <div className="hidden-export-container">
          <div ref={hiddenReportRef} className="export-report-wrapper">
            <div className="export-report-header">
              <h2>雪坑观测报告</h2>
              <div className="export-meta">
                <span>日期: {exportData.observation_date || '-'}</span>
                <span>位置: {exportData.location_description || '-'}</span>
                <span>观测员: {exportData.observer || '-'}</span>
              </div>
            </div>
            <SnowProfileSection
              layerRows={convertToEditorFormat(exportData).layerRows}
              onLayerRowsChange={() => {}}
              temperaturePoints={convertToEditorFormat(exportData).temperaturePoints}
              onTemperaturePointsChange={() => {}}
              xAxisSide={convertToEditorFormat(exportData).diagramXAxisSide as 'left' | 'right'}
              onXAxisSideChange={() => {}}
              yAxisDirection={convertToEditorFormat(exportData).diagramYAxisDirection as 'up' | 'down'}
              onYAxisDirectionChange={() => {}}
              testMarkers={exportTestMarkers}
              totalSnowDepth={exportData.total_snow_depth || '0'}
              previewMode={true}
            />
            {exportData.conclusion && (
              <div className="export-conclusion">
                <h4>结论</h4>
                <p>{exportData.conclusion}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
