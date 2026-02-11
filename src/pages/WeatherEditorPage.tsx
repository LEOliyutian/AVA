import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useWeatherStore } from '../store';
import { useToast } from '../hooks';
import { useTheme } from '../contexts/ThemeContext';
import { ConfirmDialog } from '../components/ui';
import { exportToPng } from '../utils';
import {
  WeatherInfoSection,
  StationSection,
  WeatherPreview,
} from '../components/weather';
import './WeatherEditorPage.css';

export function WeatherEditorPage() {
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
    setDate,
    setRecorder,
    setTempMin,
    setTempMax,
    addStation,
    removeStation,
    updateStation,
    save,
  } = useWeatherStore();

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
  }, [id, loadObservation, resetEditor]);

  // 验证表单
  const validateForm = (): string[] => {
    const errors: string[] = [];
    if (!editor.date) errors.push('请选择观测日期');
    if (!editor.recorder) errors.push('请填写记录员');
    if (editor.stations.length === 0) errors.push('请至少添加一个观测站点');

    // 验证每个站点
    editor.stations.forEach((s, i) => {
      if (!s.name && s.elevation === '') {
        errors.push(`站点 ${i + 1}: 请填写站点名称或海拔`);
      }
    });

    return errors;
  };

  // 保存处理
  const handleSave = async () => {
    const errors = validateForm();
    if (errors.length > 0) {
      error(errors[0]);
      return;
    }

    try {
      const result = await save();
      if (result.success && result.id) {
        const message = id ? '气象观测记录更新成功！' : '气象观测记录创建成功！';
        success(message);

        if (!id) {
          setTimeout(() => {
            navigate(`/weather/${result.id}`, { replace: true });
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
      navigate('/weather');
    }
  };

  // 导出为 PNG
  const handleExport = async () => {
    if (!reportRef.current) return;

    setIsExporting(true);
    try {
      const filename = `气象观测_${editor.date || 'unknown'}_${editor.recorder || 'unknown'}.png`;
      await exportToPng(reportRef.current, filename);
      success('导出成功！');
    } catch (err) {
      error('导出失败，请重试');
    }
    setIsExporting(false);
  };

  if (isEditorLoading) {
    return (
      <div className="weather-editor-page">
        <div className="loading-state">
          <div className="loading-spinner" />
          <p>加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`weather-editor-page ${showPreview ? 'preview-mode' : ''}`}>
      {/* 浮动工具栏 */}
      <div className="floating-toolbar">
        <button className="toolbar-btn back" onClick={handleBack} title="返回列表">
          ←
        </button>
        <div className="toolbar-title">
          {id ? '编辑' : '新建'}气象观测
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
            disabled={isSaving}
            title="保存"
          >
            {isSaving ? '...' : '✓'}
          </button>
        </div>
      </div>

      {/* 主要内容区 */}
      {showPreview ? (
        /* 预览模式 */
        <div className="preview-container">
          <div ref={reportRef}>
            <WeatherPreview data={editor} />
          </div>
        </div>
      ) : (
        /* 编辑模式 */
        <div className="editor-content">
          {/* 主区域 - 预览 */}
          <div className="editor-main">
            <WeatherPreview data={editor} />
          </div>

          {/* 可收起侧栏 */}
          <div className={`editor-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
            <div className="sidebar-content">
              {/* 基本信息 */}
              <WeatherInfoSection
                date={editor.date}
                recorder={editor.recorder}
                tempMin={editor.tempMin}
                tempMax={editor.tempMax}
                onDateChange={setDate}
                onRecorderChange={setRecorder}
                onTempMinChange={setTempMin}
                onTempMaxChange={setTempMax}
              />

              {/* 站点列表 */}
              {editor.stations.map((station) => (
                <StationSection
                  key={station.id}
                  station={station}
                  canDelete={editor.stations.length > 1}
                  onUpdate={(key, value) => updateStation(station.id, key, value)}
                  onDelete={() => removeStation(station.id)}
                />
              ))}

              {/* 添加站点按钮 */}
              <div className="add-station-section">
                <button className="add-station-btn" onClick={addStation}>
                  <span className="add-icon">+</span>
                  添加观测站点
                </button>
              </div>
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
        onConfirm={() => navigate('/weather')}
        onCancel={() => setShowLeaveConfirm(false)}
      />
    </div>
  );
}
