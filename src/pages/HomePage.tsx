import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { forecastApi, type ForecastListItem, type ForecastDetail } from '../api/forecast.api';
import { observationApi, type ObservationListItem } from '../api/observation.api';
import { useIsForecaster } from '../store/auth.store';
import { DANGER_CONFIG } from '../config';
import { RoseDiagram } from '../components/shared/RoseDiagram/RoseDiagram';
import { Modal } from '../components/ui';
import './HomePage.css';

export function HomePage() {
  const [recentForecasts, setRecentForecasts] = useState<ForecastListItem[]>([]);
  const [latestForecast, setLatestForecast] = useState<ForecastListItem | null>(null);
  const [forecastDetail, setForecastDetail] = useState<ForecastDetail | null>(null);
  const [recentObservations, setRecentObservations] = useState<ObservationListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showRiskModal, setShowRiskModal] = useState(false);

  const isForecaster = useIsForecaster();

  const loadForecasts = useCallback(async () => {
    setIsLoading(true);
    // Parallel fetch
    const [forecastResult, observationResult] = await Promise.all([
      forecastApi.getList({ page: 1, limit: 5 }),
      observationApi.getRecent(5)
    ]);

    // Handle Forecasts
    if (forecastResult.success && forecastResult.data) {
      const forecasts = forecastResult.data.data;
      if (forecasts.length > 0) {
        setLatestForecast(forecasts[0]);
        setRecentForecasts(forecasts.slice(1, 5));
        // Fetch detail for rose diagram
        const detailResult = await forecastApi.getById(forecasts[0].id);
        if (detailResult.success && detailResult.data) {
          setForecastDetail(detailResult.data.forecast);
        }
      }
    }

    // Handle Observations
    if (observationResult.success && observationResult.data) {
      setRecentObservations(observationResult.data.observations);
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadForecasts();
  }, [loadForecasts]);

  // Helper to get stability string (Mock simulation since API doesn't have it)
  const getStability = (id: number) => {
    const statuses = ['Good', 'Fair', 'Poor'];
    return statuses[id % 3];
  };

  const getDangerColor = (level: number) => {
    return DANGER_CONFIG[level as keyof typeof DANGER_CONFIG]?.color || '#94a3b8';
  };

  const getDangerLabel = (level: number) => {
    const config = DANGER_CONFIG[level as keyof typeof DANGER_CONFIG];
    if (!config) return { cn: '未知', en: 'Unknown' };
    const labels: Record<number, { cn: string; en: string }> = {
      1: { cn: '低风险', en: 'Low' },
      2: { cn: '中等风险', en: 'Moderate' },
      3: { cn: '显著危险', en: 'Considerable' },
      4: { cn: '高危', en: 'High' },
      5: { cn: '极端危险', en: 'Extreme' },
    };
    return labels[level] || { cn: '未知', en: 'Unknown' };
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).replace(/\//g, '.');
  };

  const parseSectors = (sectorsJson: string | null): string[] => {
    if (!sectorsJson) return [];
    try {
      return JSON.parse(sectorsJson);
    } catch {
      return [];
    }
  };

  const getMaxDanger = (forecast: ForecastListItem) => {
    return Math.max(forecast.danger_alp, forecast.danger_tl, forecast.danger_btl);
  };

  const getProblemImage = (type: string | null): string => {
    const base = 'https://avalanche.state.co.us/sites/default/files/2022-10';
    if (!type) return '';
    if (type.includes('Wind Slab')) return `${base}/Wind.Slabs_.png`;
    if (type.includes('Storm Slab')) return `${base}/Storm.Slabs_.png`;
    if (type.includes('Deep Persistent')) return `${base}/Deep.Persistent.Slabs_.png`;
    if (type.includes('Persistent Slab')) return `${base}/Persistent.Slabs_.png`;
    if (type.includes('Loose Dry')) return `${base}/Loose.Dry_.png`;
    if (type.includes('Loose Wet')) return `${base}/Loose.Wet_.png`;
    if (type.includes('Wet Slab')) return `${base}/Wet.Slabs_.png`;
    return '';
  };

  const getProblemShortName = (type: string) => type.split(' (')[0];

  return (
    <div className="taiga-page">
      {/* 主内容区 */}
      <main className="taiga-main">
        {/* Hero 区域 */}
        <section className="hero-section">
          <div className="hero-bg">
            <img
              src="https://images.unsplash.com/photo-1491002052546-bf38f186af56?w=1600&q=80"
              alt="Snow Mountains"
            />
          </div>
          <div className="hero-gradient"></div>

          <div className="hero-content">
            {isLoading ? (
              <div className="hero-loading">
                <div className="loading-spinner"></div>
                <span>加载预报数据...</span>
              </div>
            ) : latestForecast ? (
              <>
                <div className="hero-meta">
                  <span className="section-tag">区域综合风险评分</span>
                  <span className="update-time">{formatDate(latestForecast.forecast_date)} 更新</span>
                </div>

                <div className="danger-display">
                  <div
                    className="danger-level-box"
                    style={{ backgroundColor: getDangerColor(getMaxDanger(latestForecast)) }}
                  >
                    <span className="level-number">{getMaxDanger(latestForecast)}</span>
                    <span className="level-label">Level</span>
                  </div>
                  <div className="danger-text">
                    <h2 className="danger-title">{getDangerLabel(getMaxDanger(latestForecast)).cn}</h2>
                    <p className="danger-subtitle">{getDangerLabel(getMaxDanger(latestForecast)).en} Danger</p>
                  </div>
                </div>

                {forecastDetail?.summary && (
                  <p className="hero-summary">{forecastDetail.summary}</p>
                )}

                <div className="hero-info">
                  <span>{latestForecast.forecaster_name}</span>
                  <span className="info-dot"></span>
                  <span>{formatDate(latestForecast.forecast_date)}</span>
                </div>

                <div className="hero-actions">
                  <Link to={`/forecast/${latestForecast.id}`} className="btn-primary">
                    <span>查看完整预报报告</span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </>
            ) : (
              <div className="hero-empty">
                <p>暂无发布的预报数据</p>
                {isForecaster && (
                  <Link to="/editor" className="btn-primary">创建第一个预报</Link>
                )}
              </div>
            )}
          </div>

          {/* 右侧海拔带面板 */}
          {latestForecast && (
            <div className="elevation-panel">
              <div className="panel-card">
                <h4 className="panel-title">
                  <span>各海拔带风险等级</span>
                  <span>当前区域</span>
                </h4>
                <div className="elevation-zones">
                  <div className="zone-item">
                    <div className="zone-badge" style={{ backgroundColor: getDangerColor(latestForecast.danger_alp) }}>
                      {latestForecast.danger_alp}
                    </div>
                    <div className="zone-info">
                      <span className="zone-name">高山带 Alpine</span>
                      <span className="zone-elev">&gt;2200m</span>
                    </div>
                    <span className="zone-label">{getDangerLabel(latestForecast.danger_alp).cn}</span>
                  </div>
                  <div className="zone-item">
                    <div className="zone-badge" style={{ backgroundColor: getDangerColor(latestForecast.danger_tl) }}>
                      {latestForecast.danger_tl}
                    </div>
                    <div className="zone-info">
                      <span className="zone-name">林线带 Treeline</span>
                      <span className="zone-elev">1800-2200m</span>
                    </div>
                    <span className="zone-label">{getDangerLabel(latestForecast.danger_tl).cn}</span>
                  </div>
                  <div className="zone-item">
                    <div className="zone-badge" style={{ backgroundColor: getDangerColor(latestForecast.danger_btl) }}>
                      {latestForecast.danger_btl}
                    </div>
                    <div className="zone-info">
                      <span className="zone-name">林下带 Below TL</span>
                      <span className="zone-elev">&lt;1800m</span>
                    </div>
                    <span className="zone-label">{getDangerLabel(latestForecast.danger_btl).cn}</span>
                  </div>
                </div>
                {forecastDetail && parseSectors(forecastDetail.primary_sectors).length > 0 && (
                  <div className="panel-rose-section">
                    <div className="rose-section-title">
                      <span>雪崩问题</span>
                      <span className="rose-section-sub">Avalanche Problems</span>
                    </div>
                    <div className="panel-rose-diagrams">
                      <div className="panel-rose-item">
                        <div className="problem-visual">
                          {forecastDetail.primary_type && (
                            <>
                              <img
                                src={getProblemImage(forecastDetail.primary_type)}
                                alt={forecastDetail.primary_type}
                                className="problem-image"
                              />
                              <span className="problem-name">
                                <span className="problem-label">主要</span>
                                {getProblemShortName(forecastDetail.primary_type)}
                              </span>
                            </>
                          )}
                        </div>
                        <div className="problem-visual">
                          <RoseDiagram
                            sectors={parseSectors(forecastDetail.primary_sectors)}
                            variant="primary"
                            size={150}
                          />
                        </div>
                      </div>
                      {forecastDetail.secondary_enabled && parseSectors(forecastDetail.secondary_sectors).length > 0 && (
                        <div className="panel-rose-item">
                          <div className="problem-visual">
                            {forecastDetail.secondary_type && (
                              <>
                                <img
                                  src={getProblemImage(forecastDetail.secondary_type)}
                                  alt={forecastDetail.secondary_type}
                                  className="problem-image"
                                />
                                <span className="problem-name">
                                  <span className="problem-label">次要</span>
                                  {getProblemShortName(forecastDetail.secondary_type)}
                                </span>
                              </>
                            )}
                          </div>
                          <div className="problem-visual">
                            <RoseDiagram
                              sectors={parseSectors(forecastDetail.secondary_sectors)}
                              variant="secondary"
                              size={150}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="rose-legend">
                      <span className="rose-legend-label">由内至外</span>
                      <span className="rose-legend-band">高山带</span>
                      <span className="rose-legend-arrow">›</span>
                      <span className="rose-legend-band">林线带</span>
                      <span className="rose-legend-arrow">›</span>
                      <span className="rose-legend-band">林下带</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </section>

        {/* 近期预报 (Moved from below) */}
        <section className="forecasts-section" style={{ marginBottom: '64px' }}>
          <div className="section-header-row" style={{ justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
              <h3 className="section-title-sm">近期预报记录</h3>
              <div className="header-line"></div>
            </div>
            <button
              className="btn-secondary"
              onClick={() => setShowRiskModal(true)}
              style={{ padding: '8px 16px', fontSize: '13px' }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '6px', width: '16px', height: '16px' }}>
                <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              风险等级说明
            </button>
          </div>

          {recentForecasts.length > 0 ? (
            <div className="bento-card">
              <table className="forecast-table">
                <thead>
                  <tr>
                    <th>预报日期</th>
                    <th>危险等级</th>
                    <th>高山/林线/林下</th>
                    <th>预报员</th>
                    <th className="text-right">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {recentForecasts.map((forecast) => (
                    <tr key={forecast.id}>
                      <td>
                        <div className="date-cell">
                          <span className="date-day">{new Date(forecast.forecast_date).getDate()}</span>
                          <span className="date-month">
                            {new Date(forecast.forecast_date).toLocaleDateString('zh-CN', { month: 'short', year: 'numeric' })}
                          </span>
                        </div>
                      </td>
                      <td>
                        <div className="level-badge" style={{ backgroundColor: getDangerColor(getMaxDanger(forecast)) }}>
                          {getMaxDanger(forecast)} - {getDangerLabel(getMaxDanger(forecast)).cn}
                        </div>
                      </td>
                      <td>
                        <div className="zone-badges">
                          <span className="mini-badge" style={{ backgroundColor: getDangerColor(forecast.danger_alp) }}>{forecast.danger_alp}</span>
                          <span className="mini-badge" style={{ backgroundColor: getDangerColor(forecast.danger_tl) }}>{forecast.danger_tl}</span>
                          <span className="mini-badge" style={{ backgroundColor: getDangerColor(forecast.danger_btl) }}>{forecast.danger_btl}</span>
                        </div>
                      </td>
                      <td>
                        <span className="forecaster-name">{forecast.forecaster_name}</span>
                      </td>
                      <td className="text-right">
                        <Link to={`/forecast/${forecast.id}`} className="table-link">
                          查看详情
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bento-card empty-state">
              <p>暂无更多预报记录</p>
            </div>
          )}
        </section>

        {/* 双栏布局 */}
        <div className="content-grid">
          {/* 左侧主内容 */}
          <div className="main-content">

            {/* 雪层观测记录 (Mock Data) */}
            <section className="observations-section" style={{ marginTop: '48px' }}>
              <div className="section-header-row">
                <h3 className="section-title-sm">最新雪层观测</h3>
                <div className="header-line"></div>
              </div>

              <div className="bento-card">
                <table className="forecast-table">
                  <thead>
                    <tr>
                      <th>观测日期</th>
                      <th>区域/地点</th>
                      <th>海拔/朝向</th>
                      <th>观测员</th>
                      <th>稳定性评估</th>
                      <th className="text-right">详情</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentObservations.map((obs) => (
                      <tr key={obs.id}>
                        <td>{obs.observation_date}</td>
                        <td style={{ fontWeight: 600 }}>{obs.location_description || '-'}</td>
                        <td>{obs.elevation || '-'} / {obs.slope_aspect || '-'}</td>
                        <td>{obs.observer || obs.observer_name || '-'}</td>
                        <td>
                          <span className={`status-badge status-${getStability(obs.id).toLowerCase()}`}>
                            {getStability(obs.id)}
                          </span>
                        </td>
                        <td className="text-right">
                          <Link to={`/observations/${obs.id}`} className="table-link">查看</Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* 安全教育 - 横向卡片设计 */}
            <section className="education-section" style={{ marginTop: '48px' }}>
              <div className="edu-card-horizontal">
                <div className="edu-image">
                  <img
                    src="https://images.unsplash.com/photo-1551524559-8af4e6624178?w=800&q=80"
                    alt="Avalanche Safety Training"
                  />
                  <div className="edu-overlay">
                    <span className="card-tag">教育课程</span>
                  </div>
                </div>
                <div className="edu-content">
                  <div>
                    <h4 className="edu-title">雪崩安全知识在线学习平台</h4>
                    <p className="edu-desc">
                      专为滑雪爱好者设计的系统化雪崩安全培训课程。包含以下模块：
                    </p>
                    <ul className="edu-list">
                      <li>雪崩地形识别与评估</li>
                      <li>雪层不稳定性测试方法</li>
                      <li>救援设备使用实操指南 (Beacon/Probe/Shovel)</li>
                    </ul>
                  </div>
                  <div className="edu-actions">
                    <button className="btn-primary" disabled style={{ padding: '12px 24px', fontSize: '14px' }}>
                      平台即将上线
                    </button>
                    <span className="edu-note">预计 2024 冬季开放</span>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* 右侧边栏 */}
          <div className="sidebar">
            {/* 安全检查清单 */}
            <div className="sidebar-card checklist-card">
              <h4 className="checklist-title">
                <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
                </svg>
                出发前安全自查
              </h4>
              <div className="checklist-items">
                <div className="check-item">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="check-icon">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                  <div className="check-content">
                    <p className="check-title">收发器电池</p>
                    <p className="check-desc">确保电量在 70% 以上且功能正常</p>
                  </div>
                </div>
                <div className="check-item">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="check-icon">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                  <div className="check-content">
                    <p className="check-title">行程计划共享</p>
                    <p className="check-desc">告知留守人员详细的进山与回程时间</p>
                  </div>
                </div>
                <div className="check-item">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="check-icon">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                  <div className="check-content">
                    <p className="check-title">救援三件套</p>
                    <p className="check-desc">探测杆与雪铲应在背囊中处于易取位置</p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA 卡片 */}
            <div className="sidebar-card cta-card">
              <div className="cta-bg-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                </svg>
              </div>
              <h4>专业机构对接</h4>
              <p>为雪场及滑雪俱乐部提供专业级雪崩安全管理咨询与数据支持。</p>
              <button className="btn-cta">联系专业团队</button>
            </div>
          </div>
        </div>
      </main>

      <Modal
        isOpen={showRiskModal}
        onClose={() => setShowRiskModal(false)}
        title="国际雪崩危险等级标准"
        maxWidth="1000px"
      >
        <div className="levels-section" style={{ margin: 0, padding: 0, border: 'none', boxShadow: 'none' }}>
          <p className="section-desc" style={{ textAlign: 'center', marginBottom: '32px' }}>了解各等级含义，做出明智的野外决策</p>

          {/* 彩色危险轴 */}
          <div className="danger-scale">
            <div className="scale-bar">
              {[1, 2, 3, 4, 5].map((level) => (
                <div
                  key={level}
                  className="scale-segment"
                  style={{ backgroundColor: getDangerColor(level) }}
                >
                  <span className="segment-num">{level}</span>
                </div>
              ))}
            </div>
            <div className="scale-labels">
              <span className="scale-label-start">低风险</span>
              <span className="scale-label-end">极端危险</span>
            </div>
          </div>

          {/* 等级详细解释 */}
          <div className="levels-explanation">
            {[1, 2, 3, 4, 5].map((level) => (
              <div key={level} className="level-explain-card" style={{ '--level-color': getDangerColor(level) } as React.CSSProperties}>
                <div className="explain-header">
                  <div className="explain-badge" style={{ backgroundColor: getDangerColor(level) }}>{level}</div>
                  <div className="explain-titles">
                    <h4>{getDangerLabel(level).cn} <span>{getDangerLabel(level).en}</span></h4>
                  </div>
                </div>
                <div className="explain-content">
                  <p className="explain-main">
                    {level === 1 && "雪层整体稳定，自然触发和人为触发的可能性都很低。"}
                    {level === 2 && "特定地形特征处雪层稳定性降低，人为触发可能性增加。"}
                    {level === 3 && "多数陡峭坡面雪层不稳定，人为触发概率显著上升。"}
                    {level === 4 && "大多数陡峭地形非常不稳定，自然触发雪崩可能性大。"}
                    {level === 5 && "广泛的自然雪崩活动，雪层极度不稳定，大规模雪崩随时可能发生。"}
                  </p>
                  <div className="explain-details">
                    {level === 1 && (
                      <>
                        <div className="detail-row"><span className="detail-icon">⛷️</span><span>适合各类野外活动，但仍需保持基本警惕</span></div>
                        <div className="detail-row"><span className="detail-icon">📍</span><span>极陡峭地形仍可能存在孤立风险点</span></div>
                      </>
                    )}
                    {level === 2 && (
                      <>
                        <div className="detail-row"><span className="detail-icon">⚠️</span><span>在陡峭坡面需谨慎评估，避免触发点</span></div>
                        <div className="detail-row"><span className="detail-icon">🏔️</span><span>关注背风坡和凸起地形的风板堆积</span></div>
                      </>
                    )}
                    {level === 3 && (
                      <>
                        <div className="detail-row"><span className="detail-icon">🚨</span><span>需要丰富的雪崩判断经验和保守的地形选择</span></div>
                        <div className="detail-row"><span className="detail-icon">👥</span><span>避免群体同时进入危险区域，保持安全间距</span></div>
                      </>
                    )}
                    {level === 4 && (
                      <>
                        <div className="detail-row"><span className="detail-icon">🛑</span><span>强烈建议避开所有雪崩地形，包括径流区</span></div>
                        <div className="detail-row"><span className="detail-icon">🌨️</span><span>通常伴随大量降雪、强风或快速升温</span></div>
                      </>
                    )}
                    {level === 5 && (
                      <>
                        <div className="detail-row"><span className="detail-icon">⛔</span><span>禁止一切野外活动，远离所有雪崩路径</span></div>
                        <div className="detail-row"><span className="detail-icon">🏠</span><span>此等级罕见，通常由极端天气事件引发</span></div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Modal>

      {/* 页脚 */}
      <footer className="taiga-footer">
        <div className="footer-container">
          <div className="footer-brand">
            <div className="footer-logo">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 19h20L12 2zm0 3.3L19.07 17H4.93L12 5.3zM11 10h2v4h-2v-4zm0 5h2v2h-2v-2z" />
              </svg>
              <span>TaigaSnow</span>
            </div>
            <p className="footer-desc">
              专业雪崩安全助手平台。我们结合高精度实地观测与专业分析，致力于提高野外滑雪的安全性。
            </p>
            <p className="footer-copyright">© 2024 TaigaSnow</p>
          </div>

          <div className="footer-nav">
            <h4>数据与预报</h4>
            <nav>
              <Link to="/">最新预报</Link>
              <Link to="/weather">气象观察</Link>
              <Link to="/observations">雪层观测</Link>
            </nav>
          </div>

          <div className="footer-nav">
            <h4>安全中心</h4>
            <nav>
              <a href="#levels">风险等级说明</a>
              <a href="#">救援操作指南</a>
            </nav>
          </div>

          <div className="footer-nav">
            <h4>联系我们</h4>
            <nav>
              <a href="#">技术支持</a>
              <a href="#">意见反馈</a>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}
