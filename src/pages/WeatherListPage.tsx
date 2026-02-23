import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWeatherStore } from '../store';
import { useToast } from '../hooks';
import { ConfirmDialog } from '../components/ui';
import './WeatherListPage.css';

export function WeatherListPage() {
  const navigate = useNavigate();
  const { success, error: showError } = useToast();
  const {
    observations,
    pagination,
    isListLoading,
    listError,
    fetchList,
    deleteObservation,
  } = useWeatherStore();

  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  // 加载列表
  useEffect(() => {
    fetchList({ page: 1, limit: 20 });
  }, [fetchList]);

  // 翻页
  const handlePageChange = (page: number) => {
    fetchList({ page, limit: pagination.limit });
  };

  // 删除确认
  const handleDelete = async (id: number) => {
    const result = await deleteObservation(id);
    if (result.success) {
      setDeleteConfirmId(null);
      success('气象观测记录删除成功');
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

  // 格式化温度
  const formatTemp = (min: number, max: number) => {
    return `${min}°C ~ ${max}°C`;
  };

  return (
    <div className="weather-list-page">
      {/* 顶部导航 */}
      <div className="list-header-redesigned">
        <div className="header-brand-area">
          <h1 className="page-title">气象观测记录</h1>
        </div>
        <div className="header-actions-area">
          <button
            className="trend-btn"
            onClick={() => navigate('/weather')}
          >
            趋势分析
          </button>
          <button
            className="new-record-btn-primary"
            onClick={() => navigate('/weather/new')}
          >
            <span className="icon">+</span> 新建观测
          </button>
        </div>
      </div>

      {/* 悬浮按钮 */}
      <button
        className="fab-new-record"
        onClick={() => navigate('/weather/new')}
        title="新建气象观测记录"
      >
        +
      </button>

      {/* 筛选栏 */}
      <div className="filter-bar">
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
            <button onClick={() => fetchList({ page: 1 })}>重试</button>
          </div>
        ) : observations.length === 0 ? (
          <div className="empty-state">
            <p>暂无气象观测记录</p>
            <button onClick={() => navigate('/weather/new')}>
              创建第一条记录
            </button>
          </div>
        ) : (
          <>
            <table className="weather-table">
              <thead>
                <tr>
                  <th>观测日期</th>
                  <th>记录员</th>
                  <th>温度范围</th>
                  <th>创建时间</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {observations.map((obs) => (
                  <tr
                    key={obs.id}
                    onClick={() => navigate(`/weather/${obs.id}`)}
                  >
                    <td className="date-cell">
                      <span className="date-icon">📅</span>
                      {formatDate(obs.date)}
                    </td>
                    <td>{obs.recorder || '-'}</td>
                    <td className="temp-cell">
                      {formatTemp(obs.temp_min, obs.temp_max)}
                    </td>
                    <td className="meta-cell">
                      {formatDate(obs.created_at)}
                    </td>
                    <td className="actions">
                      <button
                        className="action-btn edit"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/weather/${obs.id}`);
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
        message="确定要删除这条气象观测记录吗？此操作不可撤销。"
        confirmText="确认删除"
        variant="danger"
        onConfirm={() => deleteConfirmId !== null && handleDelete(deleteConfirmId)}
        onCancel={() => setDeleteConfirmId(null)}
      />
    </div>
  );
}
