import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useObservationStore, useAuthStore } from '../store';
import { useToast } from '../hooks';
import './ObservationListPage.css';

export function ObservationListPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
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

  const canEdit = user?.role === 'admin' || user?.role === 'forecaster';

  return (
    <div className="observation-list-page">
      {/* 顶部导航 */}
      <div className="list-header">
        <div className="header-left">
          <Link to="/" className="back-link">
            ← 返回首页
          </Link>
          <h1>雪层观测记录</h1>
        </div>
        <div className="header-right">
          {canEdit && (
            <button
              className="new-btn"
              onClick={() => navigate('/observations/new')}
            >
              + 新建观测
            </button>
          )}
        </div>
      </div>

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
            {canEdit && (
              <button onClick={() => navigate('/observations/new')}>
                创建第一条记录
              </button>
            )}
          </div>
        ) : (
          <>
            <table className="observation-table">
              <thead>
                <tr>
                  <th>记录编号</th>
                  <th>观测日期</th>
                  <th>位置描述</th>
                  <th>海拔</th>
                  <th>坡向</th>
                  <th>总雪深</th>
                  <th>观测员</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {observations.map((obs) => (
                  <tr key={obs.id}>
                    <td className="record-id">
                      {obs.record_id || `#${obs.id}`}
                    </td>
                    <td>{formatDate(obs.observation_date)}</td>
                    <td className="location">
                      {obs.location_description || '-'}
                    </td>
                    <td>{obs.elevation || '-'}</td>
                    <td>{obs.slope_aspect || '-'}</td>
                    <td>{obs.total_snow_depth ? `${obs.total_snow_depth} cm` : '-'}</td>
                    <td>{obs.observer || obs.observer_name || '-'}</td>
                    <td className="actions">
                      <button
                        className="action-btn view"
                        onClick={() => navigate(`/observations/${obs.id}`)}
                      >
                        查看
                      </button>
                      {canEdit && (
                        <>
                          <button
                            className="action-btn edit"
                            onClick={() => navigate(`/observations/${obs.id}`)}
                          >
                            编辑
                          </button>
                          <button
                            className="action-btn delete"
                            onClick={() => setDeleteConfirmId(obs.id)}
                          >
                            删除
                          </button>
                        </>
                      )}
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

      {/* 删除确认对话框 */}
      {deleteConfirmId !== null && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>确认删除</h3>
            <p>确定要删除这条观测记录吗？此操作不可撤销。</p>
            <div className="modal-actions">
              <button
                className="modal-btn cancel"
                onClick={() => setDeleteConfirmId(null)}
              >
                取消
              </button>
              <button
                className="modal-btn confirm"
                onClick={() => handleDelete(deleteConfirmId)}
              >
                确认删除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
