import { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { forecastApi, type ForecastDetail } from '../api';
import { useAuthStore, useCanEdit, useIsAdmin } from '../store/auth.store';
import { DANGER_CONFIG, TREND_CONFIG } from '../config';
import { RoseDiagram } from '../components/shared';
import { ConfirmDialog } from '../components/ui';
import { exportToPng, generateFilename } from '../utils';
import type { DangerLevel, DangerTrend } from '../types';
import './ForecastDetailPage.css';

export function ForecastDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [forecast, setForecast] = useState<ForecastDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [showPublishConfirm, setShowPublishConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const reportRef = useRef<HTMLDivElement>(null);
  const { user } = useAuthStore();
  const canEdit = useCanEdit(forecast?.forecaster_id);
  const isAdmin = useIsAdmin();
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;

    const loadForecast = async () => {
      setIsLoading(true);
      const result = await forecastApi.getById(parseInt(id, 10));

      if (result.success && result.data) {
        setForecast(result.data.forecast);
      } else {
        setError(result.error || '加载失败');
      }
      setIsLoading(false);
    };

    loadForecast();
  }, [id]);

  const handlePublish = async () => {
    if (!forecast) return;

    const result = await forecastApi.publish(forecast.id);
    if (result.success) {
      setForecast({ ...forecast, status: 'published', published_at: new Date().toISOString() });
    } else {
      setError(result.error || '发布失败');
    }
    setShowPublishConfirm(false);
  };

  const handleDelete = async () => {
    if (!forecast) return;

    const result = await forecastApi.delete(forecast.id);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error || '删除失败');
    }
    setShowDeleteConfirm(false);
  };

  const handleExport = async () => {
    if (!reportRef.current || !forecast) return;

    setIsExporting(true);
    try {
      await exportToPng(reportRef.current, generateFilename(forecast.forecast_date, 'png'));
    } catch (err) {
      alert('导出失败，请重试');
    }
    setIsExporting(false);
  };

  if (isLoading) {
    return (
      <div className="detail-page">
        <div className="loading">加载中...</div>
      </div>
    );
  }

  if (error || !forecast) {
    return (
      <div className="detail-page">
        <div className="error-container">
          <p>{error || '预报不存在'}</p>
          <Link to="/" className="btn btn-primary">返回首页</Link>
        </div>
      </div>
    );
  }

  const getDangerInfo = (level: number) => {
    return DANGER_CONFIG[level as DangerLevel] || { color: '#999', label: '未知', description: '', prob: '', cons: '' };
  };

  const getTrendInfo = (trend: string | null) => {
    if (!trend) return null;
    const trendMap: Record<string, DangerTrend> = {
      increasing: 'rising',
      steady: 'steady',
      decreasing: 'falling',
    };
    const mappedTrend = trendMap[trend] || trend;
    return TREND_CONFIG[mappedTrend as DangerTrend];
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const parseSectors = (sectorsJson: string | null): string[] => {
    if (!sectorsJson) return [];
    try {
      return JSON.parse(sectorsJson);
    } catch {
      return [];
    }
  };

  return (
    <div className="detail-page">
      <header className="detail-header">
        <div className="header-actions">
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="btn btn-export"
          >
            {isExporting ? '导出中...' : '导出图片'}
          </button>
          {canEdit && forecast.status === 'draft' && (
            <>
              <Link to={`/editor/${forecast.id}`} className="btn btn-outline">
                编辑
              </Link>
              <button onClick={() => setShowPublishConfirm(true)} className="btn btn-primary">
                发布
              </button>
            </>
          )}
          {canEdit && forecast.status === 'published' && (
            <Link to={`/editor/${forecast.id}`} className="btn btn-outline">
              编辑
            </Link>
          )}
          {isAdmin && (
            <button onClick={() => setShowDeleteConfirm(true)} className="btn btn-danger">
              删除
            </button>
          )}
        </div>
      </header>

      <main className="detail-main">
        <div className="report-container" ref={reportRef}>
          {/* 报告头部 */}
          <div className="rep-header">
            <div className="rep-brand">
              <h1>吉克普林滑雪场</h1>
              <h2>雪崩预报 Avalanche Forecast</h2>
            </div>
            <div className="rep-meta">
              <span className="meta-date">{formatDate(forecast.forecast_date)}</span>
              <span className="meta-valid">有效期至当日 17:00</span>
              <span className="meta-fc">预报员: {forecast.forecaster_name}</span>
            </div>
          </div>

          {/* 危险等级栏 */}
          <div className="danger-bar">
            {[
              { key: 'alp', label: '高山带', elev: '>2200m', level: forecast.danger_alp, trend: forecast.trend_alp },
              { key: 'tl', label: '林线带', elev: '1800-2200m', level: forecast.danger_tl, trend: forecast.trend_tl },
              { key: 'btl', label: '林下带', elev: '<1800m', level: forecast.danger_btl, trend: forecast.trend_btl },
            ].map(({ key, label, elev, level, trend }) => {
              const info = getDangerInfo(level);
              const trendInfo = getTrendInfo(trend);
              return (
                <div key={key} className="db-cell">
                  <div className="db-title">{label}</div>
                  <div className="db-elev">{elev}</div>
                  <div className="db-badge" style={{ backgroundColor: info.color }}>
                    {info.label}
                  </div>
                  <div className="rd-box">
                    <div className="rd-row">
                      <span className="rd-label">触发概率:</span>
                      <span className="rd-val">{info.prob}</span>
                    </div>
                    <div className="rd-row">
                      <span className="rd-label">预期后果:</span>
                      <span className="rd-val">{info.cons}</span>
                    </div>
                  </div>
                  <div className="db-desc">{info.description}</div>
                  {trendInfo && (
                    <div className="db-trend" style={{ color: trendInfo.color, background: trendInfo.background }}>
                      {trendInfo.text}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* 主要内容 */}
          <div className="rep-content">
            <div className="col-main">
              <div className="sec-h">雪崩问题 (Avalanche Problems)</div>

              {/* 主要问题 */}
              {forecast.primary_type && (
                <div className="prob-card">
                  <div className="prob-vis">
                    <span className="tag" style={{ background: '#d9534f' }}>主要问题</span>
                    <RoseDiagram
                      sectors={parseSectors(forecast.primary_sectors)}
                      variant="primary"
                      size={120}
                    />
                    <div className="rose-legend">
                      <span>内圈=高山 中圈=林线 外圈=林下</span>
                    </div>
                  </div>
                  <div className="prob-dat">
                    <h3 className="prob-type">{forecast.primary_type}</h3>
                    <div className="prob-metrics">
                      <span>可能性: <strong>{forecast.primary_likelihood}</strong>/5</span>
                      <span>规模: <strong>{forecast.primary_size}</strong>/5</span>
                    </div>
                    <p className="prob-txt">{forecast.primary_description || '暂无描述'}</p>
                  </div>
                </div>
              )}

              {/* 次要问题 */}
              {forecast.secondary_enabled && forecast.secondary_type && (
                <div className="prob-card">
                  <div className="prob-vis">
                    <span className="tag" style={{ background: '#f0ad4e' }}>次要问题</span>
                    <RoseDiagram
                      sectors={parseSectors(forecast.secondary_sectors)}
                      variant="secondary"
                      size={120}
                    />
                    <div className="rose-legend">
                      <span>内圈=高山 中圈=林线 外圈=林下</span>
                    </div>
                  </div>
                  <div className="prob-dat">
                    <h3 className="prob-type">{forecast.secondary_type}</h3>
                    <div className="prob-metrics">
                      <span>可能性: <strong>{forecast.secondary_likelihood}</strong>/5</span>
                      <span>规模: <strong>{forecast.secondary_size}</strong>/5</span>
                    </div>
                    <p className="prob-txt">{forecast.secondary_description || '暂无描述'}</p>
                  </div>
                </div>
              )}

              <div className="sec-h">详细观测信息 (Details)</div>

              <div className="obs-block">
                <div className="obs-title">雪层结构分析 (Snowpack Structure)</div>
                <div className="obs-txt">{forecast.snowpack_observation || '暂无观测数据'}</div>
              </div>

              <div className="obs-block">
                <div className="obs-title">近期雪崩活动 (Recent Avalanche Activity)</div>
                <div className="obs-txt">{forecast.activity_observation || '暂无观测数据'}</div>
              </div>

              <div className="sec-h" style={{ marginTop: 30 }}>摘要 (Summary)</div>
              <div className="sum-box">
                {forecast.summary ? (
                  forecast.summary.split('\n').map((line, i) => (
                    <p key={i} style={{ margin: '0 0 10px' }}>{line}</p>
                  ))
                ) : (
                  <p style={{ margin: 0, color: '#888' }}>暂无摘要</p>
                )}
              </div>
            </div>

            {/* 天气面板 */}
            <div className="col-side">
              <div className="sec-h">天气状况 (Weather)</div>

              {forecast.weather ? (
                <>
                  <div className="wx-row">
                    <div className="wx-tile">
                      <span className="wx-big">{forecast.weather.sky_condition || '-'}</span>
                      <span className="wx-sub">天空状况 Sky</span>
                    </div>
                    <div className="wx-tile">
                      <span className="wx-big">{forecast.weather.transport || '-'}</span>
                      <span className="wx-sub">风雪搬运 Transport</span>
                    </div>
                  </div>

                  <div className="wx-tile" style={{ marginBottom: 15 }}>
                    <span className="wx-big">
                      {forecast.weather.temp_min ?? '-'}° / {forecast.weather.temp_max ?? '-'}°
                    </span>
                    <span className="wx-sub">气温 Temp (°C)</span>
                  </div>

                  <div className="wx-tile" style={{ marginBottom: 30 }}>
                    <span className="wx-big">
                      {forecast.weather.wind_direction || '-'} @ {forecast.weather.wind_speed || '-'}
                    </span>
                    <span className="wx-sub">风况 Wind</span>
                  </div>

                  <div className="sec-h" style={{ fontSize: 13, marginBottom: 15 }}>
                    雪层数据 Snowpack (cm)
                  </div>
                  <div className="sn-grid">
                    <div className="sn-box">
                      <strong>{forecast.weather.hn24 ?? '-'}</strong>
                      <div className="wx-sub">24h新雪</div>
                    </div>
                    <div className="sn-box">
                      <strong>{forecast.weather.hst ?? '-'}</strong>
                      <div className="wx-sub">暴雪量</div>
                    </div>
                    <div className="sn-box">
                      <strong>{forecast.weather.hs ?? '-'}</strong>
                      <div className="wx-sub">总雪深</div>
                    </div>
                  </div>
                </>
              ) : (
                <p style={{ color: '#888', fontSize: 14 }}>暂无天气数据</p>
              )}

              {/* 气象观测 */}
              {forecast.weather_observation && (
                <>
                  <div className="sec-h" style={{ marginTop: 30, fontSize: 13 }}>
                    气象观测 Weather Observation
                  </div>
                  <div className="obs-meta">
                    <span>日期: {forecast.weather_observation.observation_date || '-'}</span>
                    <span>记录员: {forecast.weather_observation.recorder || '-'}</span>
                  </div>

                  {forecast.weather_observation.upper_station && (
                    <div className="station-box">
                      <div className="station-title">高海拔站 ({forecast.weather_observation.upper_station.elevation}m)</div>
                      <div className="station-grid">
                        <span>时间: {forecast.weather_observation.upper_station.observation_time || '-'}</span>
                        <span>云量: {forecast.weather_observation.upper_station.cloud_cover || '-'}</span>
                        <span>气温: {forecast.weather_observation.upper_station.temp_air ?? '-'}°C</span>
                        <span>雪深: {forecast.weather_observation.upper_station.snow_depth ?? '-'}cm</span>
                      </div>
                    </div>
                  )}

                  {forecast.weather_observation.lower_station && (
                    <div className="station-box">
                      <div className="station-title">低海拔站 ({forecast.weather_observation.lower_station.elevation}m)</div>
                      <div className="station-grid">
                        <span>时间: {forecast.weather_observation.lower_station.observation_time || '-'}</span>
                        <span>云量: {forecast.weather_observation.lower_station.cloud_cover || '-'}</span>
                        <span>气温: {forecast.weather_observation.lower_station.temp_air ?? '-'}°C</span>
                        <span>雪深: {forecast.weather_observation.lower_station.snow_depth ?? '-'}cm</span>
                        <span>24h新雪: {forecast.weather_observation.lower_station.h24 ?? '-'}cm</span>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* 页脚 */}
          <div className="rep-footer">
            <p>本预报仅供专业人员参考，不构成安全保证。进入野外雪区前请自行评估风险。</p>
            <p>This forecast is for professional reference only. Assess risks independently before backcountry travel.</p>
          </div>
        </div>
      </main>

      <ConfirmDialog
        open={showPublishConfirm}
        title="发布预报"
        message="确定要发布此预报吗？"
        confirmText="发布"
        variant="default"
        onConfirm={handlePublish}
        onCancel={() => setShowPublishConfirm(false)}
      />

      <ConfirmDialog
        open={showDeleteConfirm}
        title="删除预报"
        message="确定要删除此预报吗？此操作不可恢复。"
        confirmText="确认删除"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </div>
  );
}
