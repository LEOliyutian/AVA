import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useObservationStore } from '../store';
import { useToast } from '../hooks';
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
      if (window.confirm('有未保存的更改，确定要离开吗？')) {
        navigate('/observations');
      }
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
    <div className="observation-editor-page">
      {/* 顶部导航栏 */}
      <div className="editor-header">
        <div className="header-left">
          <button className="back-btn" onClick={handleBack}>
            ← 返回列表
          </button>
          <h1>{id ? '编辑观测记录' : '新建观测记录'}</h1>
          {isDirty && <span className="dirty-indicator">*</span>}
        </div>
        <div className="header-right">
          {editorError && <span className="error-msg">{editorError}</span>}
          {validationErrors.length > 0 && (
            <span className="validation-hint">
              有 {validationErrors.length} 个必填项未完成
            </span>
          )}
          <button
            className="preview-btn"
            onClick={() => setShowPreview(!showPreview)}
          >
            {showPreview ? '返回编辑' : '预览报告'}
          </button>
          {showPreview && (
            <button
              className="export-btn"
              onClick={handleExport}
              disabled={isExporting}
            >
              {isExporting ? '导出中...' : '导出PNG'}
            </button>
          )}
        </div>
      </div>

      {/* 主要内容区 */}
      {showPreview ? (
        /* 预览模式 - 可导出的报告 */
        <div className="preview-container">
          <div className="observation-report" ref={reportRef}>
            {/* 报告头部 */}
            <div className="report-header">
              <div className="report-brand">
                <h1>吉克普林滑雪场</h1>
                <h2>雪坑观测记录 Snow Pit Observation</h2>
              </div>
              <div className="report-meta">
                <div className="meta-row">
                  <span>观测日期: {editor.info.date}</span>
                  <span>观测员: {editor.info.observer}</span>
                </div>
                <div className="meta-row">
                  <span>地点: {editor.info.locationDescription}</span>
                  {editor.info.elevation && <span>海拔: {editor.info.elevation}m</span>}
                </div>
                <div className="meta-row">
                  {editor.info.slopeAspect && <span>坡向: {editor.info.slopeAspect}</span>}
                  {editor.info.slopeAngle && <span>坡度: {editor.info.slopeAngle}°</span>}
                  {editor.info.totalSnowDepth && <span>总雪深: {editor.info.totalSnowDepth}cm</span>}
                </div>
                <div className="meta-row">
                  {editor.info.airTemperature && <span>气温: {editor.info.airTemperature}°C</span>}
                  {editor.info.weather && <span>天气: {editor.info.weather}</span>}
                  {editor.info.wind && <span>风: {editor.info.wind}</span>}
                </div>
              </div>
            </div>

            {/* 雪层剖面图 */}
            <div className="report-profile">
              <SnowProfileSection
                layerRows={editor.layerRows}
                onLayerRowsChange={() => {}}
                temperaturePoints={editor.temperaturePoints}
                totalSnowDepth={editor.info.totalSnowDepth}
                onTemperaturePointsChange={() => {}}
                xAxisSide={editor.diagramXAxisSide}
                onXAxisSideChange={() => {}}
                yAxisDirection={editor.diagramYAxisDirection}
                onYAxisDirectionChange={() => {}}
                testMarkers={testMarkers}
              />
            </div>

            {/* 稳定性测试摘要 */}
            {editor.stabilityGroups.length > 0 && (
              <div className="report-tests">
                <h3>稳定性测试 Stability Tests</h3>
                <div className="tests-summary">
                  {editor.stabilityGroups.map((group, idx) => (
                    <div key={group.id} className="test-summary-item">
                      <span className="test-depth">{group.depth}cm</span>
                      <span className="test-results">
                        {group.tests.map(formatTestLabel).join(', ')}
                      </span>
                      {group.weakLayerType && (
                        <span className="weak-layer">弱层: {group.weakLayerType} {group.weakLayerGrainSize}mm</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 结论 */}
            {editor.conclusion && (
              <div className="report-conclusion">
                <h3>结论 Conclusion</h3>
                <p>{editor.conclusion}</p>
              </div>
            )}

            {/* 报告页脚 */}
            <div className="report-footer">
              <p>本记录仅供专业人员参考。Snow pit observation for professional reference only.</p>
            </div>
          </div>
        </div>
      ) : (
        /* 编辑模式 */
        <div className="editor-content">
          <div className="editor-sidebar">
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

          <div className="editor-main">
            {/* 雪层剖面 */}
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
        </div>
      )}

      {/* 底部操作栏 */}
      <div className="editor-footer">
        <div className="footer-info">
          {currentId && <span>记录 ID: {currentId}</span>}
        </div>
        <div className="footer-actions">
          <button className="cancel-btn" onClick={handleBack}>
            取消
          </button>
          <button
            className="save-btn primary"
            onClick={handleSave}
            disabled={isSaving || validationErrors.length > 0}
          >
            {isSaving ? '保存中...' : '保存记录'}
          </button>
        </div>
      </div>
    </div>
  );
}
