import { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { forecastApi, observationApi, type ForecastListItem, type PaginatedResponse, type ObservationListItem } from '../api';
import { useAuthStore, useIsForecaster } from '../store/auth.store';
import { DANGER_CONFIG } from '../config';
import './HomePage.css';

type ForecastStatus = 'draft' | 'published' | 'archived' | '';

export function HomePage() {
  const [forecasts, setForecasts] = useState<ForecastListItem[]>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });
  const [status, setStatus] = useState<ForecastStatus>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [recentObservations, setRecentObservations] = useState<ObservationListItem[]>([]);
  const [observationsLoading, setObservationsLoading] = useState(false);

  const { user, logout } = useAuthStore();
  const isForecaster = useIsForecaster();
  const navigate = useNavigate();

  const loadForecasts = useCallback(async (page = 1) => {
    setIsLoading(true);
    setError('');

    const result = await forecastApi.getList({
      page,
      limit: 10,
      status: status || undefined,
    });

    if (result.success && result.data) {
      setForecasts(result.data.data);
      setPagination(result.data.pagination);
    } else {
      setError(result.error || '加载失败');
    }

    setIsLoading(false);
  }, [status]);

  useEffect(() => {
    loadForecasts(1);
    // 加载最近观测记录
    if (user) {
      loadRecentObservations();
    }
  }, [loadForecasts, user]);

  const loadRecentObservations = async () => {
    setObservationsLoading(true);
    const result = await observationApi.getRecent(3);
    if (result.success && result.data) {
      setRecentObservations(result.data.observations);
    }
    setObservationsLoading(false);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  const getDangerColor = (level: number) => {
    return DANGER_CONFIG[level as keyof typeof DANGER_CONFIG]?.color || '#999';
  };

  const getDangerLabel = (level: number) => {
    const config = DANGER_CONFIG[level as keyof typeof DANGER_CONFIG];
    if (!config) return `${level}`;
    // 从 "1 低风险 Low" 提取 "低风险"
    const match = config.label.match(/\d\s+([\u4e00-\u9fa5]+)/);
    return match ? match[1] : config.label;
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      draft: '草稿',
      published: '已发布',
      archived: '已归档',
    };
    return labels[status] || status;
  };

  const getStatusClass = (status: string) => {
    return `status-${status}`;
  };

  return (
    <div className="home-page">
      {/* 顶部导航 */}
      <header className="home-header">
        <div className="header-brand">
          <h1>雪崩预报系统</h1>
          <span>吉克普林滑雪场</span>
        </div>
        <div className="header-actions">
          {user ? (
            <>
              <span className="user-info">
                {user.display_name}
                <span className="user-role">({getRoleLabel(user.role)})</span>
              </span>
              <Link to="/observations" className="btn btn-secondary">
                雪层观测
              </Link>
              {isForecaster && (
                <Link to="/editor" className="btn btn-primary">
                  新建预报
                </Link>
              )}
              <button onClick={handleLogout} className="btn btn-outline">
                退出
              </button>
            </>
          ) : (
            <Link to="/login" className="btn btn-primary">
              登录
            </Link>
          )}
        </div>
      </header>

      {/* 主内容 */}
      <main className="home-main">
        <div className="home-container">
          {/* 筛选栏 */}
          <div className="filter-bar">
            <h2>历史预报</h2>
            {isForecaster && (
              <div className="filter-controls">
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as ForecastStatus)}
                >
                  <option value="">全部状态</option>
                  <option value="published">已发布</option>
                  <option value="draft">草稿</option>
                  <option value="archived">已归档</option>
                </select>
              </div>
            )}
          </div>

          {/* 列表 */}
          {error && <div className="error-message">{error}</div>}

          {isLoading ? (
            <div className="loading">加载中...</div>
          ) : forecasts.length === 0 ? (
            <div className="empty-state">
              <p>暂无预报数据</p>
              {isForecaster && (
                <Link to="/editor" className="btn btn-primary">
                  创建第一个预报
                </Link>
              )}
            </div>
          ) : (
            <>
              <div className="forecast-list">
                {forecasts.map((forecast) => (
                  <Link
                    key={forecast.id}
                    to={`/forecast/${forecast.id}`}
                    className="forecast-card"
                  >
                    <div className="card-date">
                      <span className="date-day">
                        {new Date(forecast.forecast_date).getDate()}
                      </span>
                      <span className="date-month">
                        {new Date(forecast.forecast_date).toLocaleDateString('zh-CN', {
                          month: 'short',
                        })}
                      </span>
                    </div>

                    <div className="card-content">
                      <div className="card-header">
                        <span className="forecast-date">
                          {formatDate(forecast.forecast_date)}
                        </span>
                        <span className={`status-badge ${getStatusClass(forecast.status)}`}>
                          {getStatusLabel(forecast.status)}
                        </span>
                      </div>

                      <div className="danger-levels">
                        <div
                          className="danger-item"
                          style={{ backgroundColor: getDangerColor(forecast.danger_alp) }}
                        >
                          <span className="level-label">高山</span>
                          <span className="level-value">{forecast.danger_alp}</span>
                          <span className="level-text">{getDangerLabel(forecast.danger_alp)}</span>
                        </div>
                        <div
                          className="danger-item"
                          style={{ backgroundColor: getDangerColor(forecast.danger_tl) }}
                        >
                          <span className="level-label">林线</span>
                          <span className="level-value">{forecast.danger_tl}</span>
                          <span className="level-text">{getDangerLabel(forecast.danger_tl)}</span>
                        </div>
                        <div
                          className="danger-item"
                          style={{ backgroundColor: getDangerColor(forecast.danger_btl) }}
                        >
                          <span className="level-label">林下</span>
                          <span className="level-value">{forecast.danger_btl}</span>
                          <span className="level-text">{getDangerLabel(forecast.danger_btl)}</span>
                        </div>
                      </div>

                      <div className="card-footer">
                        <span className="forecaster">预报员: {forecast.forecaster_name}</span>
                        {forecast.published_at && (
                          <span className="published-time">
                            发布于 {formatDate(forecast.published_at)}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* 分页 */}
              {pagination.totalPages > 1 && (
                <div className="pagination">
                  <button
                    disabled={pagination.page <= 1}
                    onClick={() => loadForecasts(pagination.page - 1)}
                  >
                    上一页
                  </button>
                  <span>
                    {pagination.page} / {pagination.totalPages}
                  </span>
                  <button
                    disabled={pagination.page >= pagination.totalPages}
                    onClick={() => loadForecasts(pagination.page + 1)}
                  >
                    下一页
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* 最近观测记录 */}
      {user && recentObservations.length > 0 && (
        <div className="home-observations">
          <div className="home-container">
            <div className="observations-header">
              <h3>最近观测记录</h3>
              <Link to="/observations" className="view-all-link">
                查看全部
              </Link>
            </div>
            <div className="observations-preview">
              {recentObservations.map((obs) => (
                <div key={obs.id} className="observation-card">
                  <div className="observation-date">
                    {obs.observation_date ? new Date(obs.observation_date).toLocaleDateString('zh-CN') : '未设置日期'}
                  </div>
                  <div className="observation-info">
                    <div className="observation-location">
                      {obs.location_description || '未设置地点'}
                    </div>
                    <div className="observation-meta">
                      <span>观测者: {obs.observer || '未知'}</span>
                      <span>海拔: {obs.elevation || '未知'}m</span>
                    </div>
                  </div>
                  <Link to={`/observations/${obs.id}`} className="observation-link">
                    查看详情
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function getRoleLabel(role: string) {
  const labels: Record<string, string> = {
    admin: '管理员',
    forecaster: '预报员',
    visitor: '访客',
  };
  return labels[role] || role;
}
