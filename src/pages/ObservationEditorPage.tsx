import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useObservationStore } from '../store';
import { useToast } from '../hooks';
import { useTheme } from '../contexts/ThemeContext';
import { ConfirmDialog } from '../components/ui';
import { validateObservation } from '../utils/validation';
import { exportToPng } from '../utils';
import {
  ObservationInfoSection,
  SnowProfileSection,
  StabilityTestSection,
  ConclusionSection,
} from '../components/observation';
import './ObservationEditorPage.css';

export function ObservationEditorPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { success, error } = useToast();
  const { theme, toggleTheme } = useTheme();

  const {
    currentId,
    editor,
    isEditorLoading,
    isSaving,
    editorError,
    isDirty,
    loadObservation,
    resetEditor,
    setInfo,
    setLayerRows,
    setTemperaturePoints,
    setStabilityGroups,
    addStabilityGroup,
    removeStabilityGroup,
    updateStabilityGroup,
    addTestToGroup,
    removeTestFromGroup,
    updateTest,
    setConclusion,
    setDiagramXAxisSide,
    setDiagramYAxisDirection,
    save,
  } = useObservationStore();

  const reportRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);

  // 加载数据
  useEffect(() => {
    if (id) {
      loadObservation(parseInt(id));
    } else {
      resetEditor();
    }

    return () => {
      // 组件卸载时清理
    };
  }, [id, loadObservation, resetEditor]);

  // 生成测试摘要标签（如 "CT13Q1", "ECTP12"）
  const formatTestLabel = (test: typeof editor.stabilityGroups[0]['tests'][0]) => {
    switch (test.type) {
      case 'CT':
        // CT + 敲击次数 + 剪切质量 -> "CT13Q1"
        return `CT${test.taps || ''}${test.quality || ''}`;
      case 'ECT':
        // ECT + 结果(去掉ECT前缀) + 敲击次数 -> "ECTP12"
        const ectResult = test.result?.replace('ECT', '') || '';
        return `ECT${ectResult}${test.taps || ''}`;
      case 'PST':
        // PST + 切入长度/柱长 + 传播 -> "PST20/100END"
        const pstInfo = test.cut && test.length ? `${test.cut}/${test.length}` : '';
        return `PST${pstInfo}${test.propagation || ''}`;
      case 'RB':
        // RB评分 + 剪切质量 -> "RB3Q2"
        return `${test.score || 'RB'}${test.quality || ''}`;
      case 'DTT':
        return `DTT${test.result || ''}`;
      case '槽口测试':
        return `槽口${test.result || ''}`;
      default:
        return test.type;
    }
  };

  // 测试标记（用于在雪层剖面图上显示测试深度和完整摘要）
  const testMarkers = useMemo(() => {
    return editor.stabilityGroups
      .filter((g) => g.depth !== '' && Number.isFinite(Number(g.depth)))
      .map((g) => ({
        depth: Number(g.depth),
        label: g.tests.map(formatTestLabel).join('/') || '测试',
      }));
  }, [editor.stabilityGroups]);

  // 验证表单并获取错误
  const validationErrors = validateObservation(editor);

  // 保存处理
  const handleSave = async () => {
    // 首先验证表单数据
    const errors = validateObservation(editor);

    if (errors.length > 0) {
      const firstError = errors[0];
      error(firstError.message);
      return;
    }

    try {
      const result = await save();

      if (result.success && result.id) {
        const message = id ? '观测记录更新成功！' : '观测记录创建成功！';
        success(message);

        // 如果是新建，跳转到编辑页面
        if (!id) {
          setTimeout(() => {
            navigate(`/observations/${result.id}`, { replace: true });
          }, 1500);
        }
      } else {
        error(result.error || '保存失败，请重试');
      }
    } catch (err) {
      error('保存过程中发生错误，请重试');
    }
  };

  // 返回列表
  const handleBack = () => {
    if (isDirty) {
      setShowLeaveConfirm(true);
    } else {
      navigate('/observations');
    }
  };

  // 导出为 PNG
  const handleExport = async () => {
    if (!reportRef.current) return;

    setIsExporting(true);
    try {
      const filename = `雪坑观测_${editor.info.date || 'unknown'}_${editor.info.observer || 'unknown'}.png`;
      await exportToPng(reportRef.current, filename);
      success('导出成功！');
    } catch (err) {
      error('导出失败，请重试');
    }
    setIsExporting(false);
  };

  if (isEditorLoading) {
    return (
      <div className="observation-editor-page">
        <div className="loading-state">
          <div className="loading-spinner" />
          <p>加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`observation-editor-page ${showPreview ? 'preview-mode' : ''}`}>
      {/* 浮动工具栏 */}
      <div className="floating-toolbar">
        <button className="toolbar-btn back" onClick={handleBack} title="返回列表">
          ←
        </button>
        <div className="toolbar-title">
          {id ? '编辑' : '新建'}
          {isDirty && <span className="dirty-dot">●</span>}
        </div>
        <div className="toolbar-actions">
          <button
            className="toolbar-btn theme-toggle"
            onClick={toggleTheme}
            title={theme === 'dark' ? '切换亮色模式' : '切换深色模式'}
          >
            {theme === 'dark' ? '☀' : '☾'}
          </button>
          {!showPreview && (
            <button
              className={`toolbar-btn toggle-sidebar ${sidebarOpen ? 'active' : ''}`}
              onClick={() => setSidebarOpen(!sidebarOpen)}
              title={sidebarOpen ? '收起侧栏' : '展开侧栏'}
            >
              ☰
            </button>
          )}
          <button
            className={`toolbar-btn preview ${showPreview ? 'active' : ''}`}
            onClick={() => setShowPreview(!showPreview)}
            title={showPreview ? '返回编辑' : '预览'}
          >
            {showPreview ? '✎' : '⎙'}
          </button>
          {showPreview && (
            <button
              className="toolbar-btn export"
              onClick={handleExport}
              disabled={isExporting}
              title="导出PNG"
            >
              ↓
            </button>
          )}
          <button
            className="toolbar-btn save"
            onClick={handleSave}
            disabled={isSaving || validationErrors.length > 0}
            title="保存"
          >
            {isSaving ? '...' : '✓'}
          </button>
        </div>
      </div>

      {/* 主要内容区 */}
      {showPreview ? (
        /* 预览模式 - 可导出的报告 */
        <div className="preview-container">
          <div className="observation-report" ref={reportRef}>
            {/* 报告头部 - 紧凑专业布局 */}
            <div className="report-header">
              <div className="header-top">
                <div className="brand-title">
                  <span className="brand-name">吉克普林滑雪场</span>
                  <span className="report-type">雪坑观测记录</span>
                </div>
                <div className="header-date">
                  <span className="date-value">{editor.info.date}</span>
                  <span className="observer-value">{editor.info.observer}</span>
                </div>
              </div>
              <div className="header-info">
                <div className="info-item">
                  <span className="info-label">位置</span>
                  <span className="info-value">{editor.info.locationDescription}</span>
                </div>
                {editor.info.elevation && (
                  <div className="info-item">
                    <span className="info-label">海拔</span>
                    <span className="info-value">{editor.info.elevation}m</span>
                  </div>
                )}
                {editor.info.slopeAspect && (
                  <div className="info-item">
                    <span className="info-label">坡向</span>
                    <span className="info-value">{editor.info.slopeAspect}</span>
                  </div>
                )}
                {editor.info.slopeAngle && (
                  <div className="info-item">
                    <span className="info-label">坡度</span>
                    <span className="info-value">{editor.info.slopeAngle}°</span>
                  </div>
                )}
                {editor.info.totalSnowDepth && (
                  <div className="info-item highlight">
                    <span className="info-label">HS</span>
                    <span className="info-value">{editor.info.totalSnowDepth}cm</span>
                  </div>
                )}
                {editor.info.airTemperature && (
                  <div className="info-item">
                    <span className="info-label">气温</span>
                    <span className="info-value">{editor.info.airTemperature}°C</span>
                  </div>
                )}
                {editor.info.weather && (
                  <div className="info-item">
                    <span className="info-label">天气</span>
                    <span className="info-value">{editor.info.weather}</span>
                  </div>
                )}
                {editor.info.wind && (
                  <div className="info-item">
                    <span className="info-label">风</span>
                    <span className="info-value">{editor.info.wind}</span>
                  </div>
                )}
              </div>
            </div>

            {/* 雪层剖面图 */}
            <div className="report-profile">
              <SnowProfileSection
                layerRows={editor.layerRows}
                onLayerRowsChange={() => { }}
                temperaturePoints={editor.temperaturePoints}
                totalSnowDepth={editor.info.totalSnowDepth}
                onTemperaturePointsChange={() => { }}
                xAxisSide={editor.diagramXAxisSide}
                onXAxisSideChange={() => { }}
                yAxisDirection={editor.diagramYAxisDirection}
                onYAxisDirectionChange={() => { }}
                testMarkers={testMarkers}
                previewMode={true}
              />
            </div>

            {/* 底部信息区 */}
            <div className="report-bottom">
              {/* 稳定性测试摘要 */}
              {editor.stabilityGroups.length > 0 && (
                <div className="report-tests">
                  <div className="section-header">稳定性测试</div>
                  <div className="tests-grid">
                    {editor.stabilityGroups.map((group) => (
                      <div key={group.id} className="test-item">
                        <span className="test-depth">{group.depth}cm</span>
                        <span className="test-code">{group.tests.map(formatTestLabel).join(' / ')}</span>
                        {group.weakLayerType && (
                          <span className="weak-layer">{group.weakLayerType}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 结论 */}
              {editor.conclusion && (
                <div className="report-conclusion">
                  <div className="section-header">观测结论</div>
                  <p className="conclusion-text">{editor.conclusion}</p>
                </div>
              )}
            </div>

            {/* 报告页脚 */}
            <div className="report-footer">
              <span>Snow Pit Observation</span>
              <span>·</span>
              <span>Professional Reference Only</span>
            </div>
          </div>
        </div>
      ) : (
        /* 编辑模式 */
        <div className="editor-content">
          {/* 主区域 - 雪层剖面 */}
          <div className="editor-main">
            <SnowProfileSection
              layerRows={editor.layerRows}
              onLayerRowsChange={setLayerRows}
              temperaturePoints={editor.temperaturePoints}
              onTemperaturePointsChange={setTemperaturePoints}
              xAxisSide={editor.diagramXAxisSide}
              onXAxisSideChange={setDiagramXAxisSide}
              yAxisDirection={editor.diagramYAxisDirection}
              onYAxisDirectionChange={setDiagramYAxisDirection}
              testMarkers={testMarkers}
              totalSnowDepth={editor.info.totalSnowDepth}
            />
          </div>

          {/* 可收起侧栏 */}
          <div className={`editor-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
            <div className="sidebar-content">
              {/* 基本信息 */}
              <ObservationInfoSection info={editor.info} onChange={setInfo} />

              {/* 稳定性测试 */}
              <StabilityTestSection
                groups={editor.stabilityGroups}
                onAddGroup={addStabilityGroup}
                onRemoveGroup={removeStabilityGroup}
                onUpdateGroup={updateStabilityGroup}
                onAddTest={addTestToGroup}
                onRemoveTest={removeTestFromGroup}
                onUpdateTest={updateTest}
              />

              {/* 结论 */}
              <ConclusionSection
                conclusion={editor.conclusion}
                onChange={setConclusion}
              />
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={showLeaveConfirm}
        title="未保存的更改"
        message="有未保存的更改，确定要离开吗？"
        confirmText="离开"
        cancelText="继续编辑"
        variant="warning"
        onConfirm={() => navigate('/observations')}
        onCancel={() => setShowLeaveConfirm(false)}
      />
    </div>
  );
}
