import { useEffect, useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { forecastApi, type ForecastListItem } from '../api';
import { useIsForecaster } from '../store/auth.store';
import { DANGER_CONFIG } from '../config';
import './ForecastListPage.css';

export function ForecastListPage() {
  const navigate = useNavigate();
  const isForecaster = useIsForecaster();
  const [forecasts, setForecasts] = useState<ForecastListItem[]>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchList = useCallback(async (page: number) => {
    setIsLoading(true);
    setError(null);
    const result = await forecastApi.getList({ page, limit: 20, status: 'published' });
    if (result.success && result.data) {
      setForecasts(result.data.data);
      setPagination(result.data.pagination);
    } else {
      setError(result.error || '加载失败');
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchList(1);
  }, [fetchList]);

  const getDangerColor = (level: number) => {
    return DANGER_CONFIG[level as keyof typeof DANGER_CONFIG]?.color || '#94a3b8';
  };

  const getDangerLabel = (level: number) => {
    const labels: Record<number, string> = {
      1: '低风险', 2: '中等', 3: '显著', 4: '高危', 5: '极端',
    };
    return labels[level] || '未知';
  };

  const getMaxDanger = (f: ForecastListItem) => Math.max(f.danger_alp, f.danger_tl, f.danger_btl);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('zh-CN');
  };

  return (
    <div className="forecast-list-page">
      <div className="list-header-redesigned">
        <div className="header-brand-area">
          <Link to="/" className="back-link-simple">← 首页</Link>
          <h1 className="page-title">雪崩预报记录</h1>
        </div>
        <div className="header-actions-area">
          <button className="trend-btn" onClick={() => navigate('/forecasts')}>
            趋势分析
          </button>
          {isForecaster && (
            <button className="new-record-btn-primary" onClick={() => navigate('/editor')}>
              <span className="icon">+</span> 新建预报
            </button>
          )}
        </div>
      </div>

      <div className="filter-bar">
        <div className="filter-info">共 {pagination.total} 条记录</div>
      </div>

      <div className="list-content">
        {isLoading ? (
          <div className="loading-state">
            <div className="loading-spinner" />
            <p>加载中...</p>
          </div>
        ) : error ? (
          <div className="error-state">
            <p>{error}</p>
            <button onClick={() => fetchList(1)}>重试</button>
          </div>
        ) : forecasts.length === 0 ? (
          <div className="empty-state">
            <p>暂无预报记录</p>
            {isForecaster && (
              <button onClick={() => navigate('/editor')}>创建第一个预报</button>
            )}
          </div>
        ) : (
          <>
            <table className="forecast-list-table">
              <thead>
                <tr>
                  <th>预报日期</th>
                  <th>综合等级</th>
                  <th>高山 / 林线 / 林下</th>
                  <th>预报员</th>
                  <th>发布时间</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {forecasts.map((f) => {
                  const maxD = getMaxDanger(f);
                  return (
                    <tr key={f.id} onClick={() => navigate(`/forecast/${f.id}`)}>
                      <td className="date-cell">
                        <span className="date-icon">📅</span>
                        {formatDate(f.forecast_date)}
                      </td>
                      <td>
                        <span className="level-badge" style={{ backgroundColor: getDangerColor(maxD) }}>
                          {maxD} - {getDangerLabel(maxD)}
                        </span>
                      </td>
                      <td>
                        <div className="zone-badges">
                          <span className="mini-badge" style={{ backgroundColor: getDangerColor(f.danger_alp) }}>{f.danger_alp}</span>
                          <span className="mini-badge" style={{ backgroundColor: getDangerColor(f.danger_tl) }}>{f.danger_tl}</span>
                          <span className="mini-badge" style={{ backgroundColor: getDangerColor(f.danger_btl) }}>{f.danger_btl}</span>
                        </div>
                      </td>
                      <td className="forecaster-cell">{f.forecaster_name}</td>
                      <td className="meta-cell">{f.published_at ? formatDate(f.published_at) : '-'}</td>
                      <td className="actions">
                        <button
                          className="action-btn view"
                          onClick={(e) => { e.stopPropagation(); navigate(`/forecast/${f.id}`); }}
                        >
                          查看
                        </button>
                        {isForecaster && (
                          <button
                            className="action-btn edit"
                            onClick={(e) => { e.stopPropagation(); navigate(`/editor/${f.id}`); }}
                          >
                            编辑
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {pagination.totalPages > 1 && (
              <div className="pagination">
                <button className="page-btn" disabled={pagination.page <= 1} onClick={() => fetchList(pagination.page - 1)}>上一页</button>
                <span className="page-info">{pagination.page} / {pagination.totalPages}</span>
                <button className="page-btn" disabled={pagination.page >= pagination.totalPages} onClick={() => fetchList(pagination.page + 1)}>下一页</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
