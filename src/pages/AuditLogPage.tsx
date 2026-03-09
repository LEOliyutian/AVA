import { useEffect, useState, useCallback } from 'react';
import { adminApi, type AuditLog, type AuditLogQuery } from '../api/admin.api';
import './AuditLogPage.css';

const ACTION_LABELS: Record<string, string> = {
  'user.login': '用户登录',
  'user.logout': '用户登出',
  'user.create': '创建用户',
  'user.role_change': '修改角色',
  'user.delete': '删除用户',
  'user.password_reset': '重置密码',
  'user.disable': '禁用账号',
  'user.enable': '启用账号',
  'forecast.create': '创建预报',
  'forecast.update': '更新预报',
  'forecast.submit': '提交审核',
  'forecast.approve': '审核通过',
  'forecast.reject': '审核驳回',
  'forecast.publish': '发布预报',
  'forecast.archive': '归档预报',
  'forecast.delete': '删除预报',
  'observation.create': '创建观测',
  'observation.delete': '删除观测',
  'settings.update': '修改系统配置',
};

const ACTION_TYPES = Object.keys(ACTION_LABELS);

function formatDetail(detail: string | null): string {
  if (!detail) return '';
  try {
    const obj = JSON.parse(detail);
    return Object.entries(obj)
      .map(([k, v]) => `${k}: ${v}`)
      .join(' | ');
  } catch {
    return detail;
  }
}

function formatTime(dt: string): string {
  return dt.replace('T', ' ').slice(0, 19);
}

export function AuditLogPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 50, total: 0, totalPages: 1 });

  const [query, setQuery] = useState<AuditLogQuery>({ page: 1, limit: 50 });

  const fetchLogs = useCallback((q: AuditLogQuery) => {
    setLoading(true);
    adminApi.getAuditLogs(q).then((res) => {
      if (res.success && res.data) {
        setLogs(res.data.data);
        setPagination(res.data.pagination);
      } else {
        setError(res.error || '获取日志失败');
      }
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    fetchLogs(query);
  }, []);

  function handleSearch() {
    const newQuery = { ...query, page: 1 };
    setQuery(newQuery);
    fetchLogs(newQuery);
  }

  function handlePage(page: number) {
    const newQuery = { ...query, page };
    setQuery(newQuery);
    fetchLogs(newQuery);
  }

  return (
    <div className="alp-container">
      <h1 className="alp-title">操作审计日志</h1>

      {/* 筛选栏 */}
      <div className="alp-filter-bar">
        <select
          className="alp-filter-select"
          value={query.action ?? ''}
          onChange={(e) => setQuery((q) => ({ ...q, action: e.target.value || undefined }))}
        >
          <option value="">全部操作</option>
          {ACTION_TYPES.map((a) => (
            <option key={a} value={a}>{ACTION_LABELS[a]}</option>
          ))}
        </select>

        <select
          className="alp-filter-select"
          value={query.targetType ?? ''}
          onChange={(e) => setQuery((q) => ({ ...q, targetType: e.target.value || undefined }))}
        >
          <option value="">全部对象</option>
          <option value="user">用户</option>
          <option value="forecast">预报</option>
          <option value="observation">观测</option>
          <option value="setting">系统配置</option>
        </select>

        <input
          type="date"
          className="alp-filter-input"
          value={query.startDate ?? ''}
          onChange={(e) => setQuery((q) => ({ ...q, startDate: e.target.value || undefined }))}
          placeholder="开始日期"
        />
        <input
          type="date"
          className="alp-filter-input"
          value={query.endDate ?? ''}
          onChange={(e) => setQuery((q) => ({ ...q, endDate: e.target.value || undefined }))}
          placeholder="结束日期"
        />

        <button className="alp-filter-btn" onClick={handleSearch}>
          筛选
        </button>
        <button
          className="alp-filter-btn alp-filter-btn--reset"
          onClick={() => {
            const reset = { page: 1, limit: 50 };
            setQuery(reset);
            fetchLogs(reset);
          }}
        >
          重置
        </button>
      </div>

      {error && <div className="alp-error">{error}</div>}

      {/* 日志表格 */}
      <div className="alp-table-wrap">
        <table className="alp-table">
          <thead>
            <tr>
              <th>时间</th>
              <th>操作人</th>
              <th>操作</th>
              <th>对象</th>
              <th>详情</th>
              <th>IP</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="alp-center">加载中...</td>
              </tr>
            ) : logs.length === 0 ? (
              <tr>
                <td colSpan={6} className="alp-center">暂无日志</td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id}>
                  <td className="alp-td-time">{formatTime(log.created_at)}</td>
                  <td className="alp-td-user">{log.user_name}</td>
                  <td>
                    <span className={`alp-action-badge alp-action-badge--${log.action.split('.')[0]}`}>
                      {ACTION_LABELS[log.action] ?? log.action}
                    </span>
                  </td>
                  <td className="alp-td-target">
                    {log.target_type && log.target_id
                      ? `${log.target_type} #${log.target_id}`
                      : log.target_type ?? '—'}
                  </td>
                  <td className="alp-td-detail">{formatDetail(log.detail) || '—'}</td>
                  <td className="alp-td-ip">{log.ip_address ?? '—'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 分页 */}
      {pagination.totalPages > 1 && (
        <div className="alp-pagination">
          <button
            className="alp-page-btn"
            disabled={pagination.page <= 1}
            onClick={() => handlePage(pagination.page - 1)}
          >
            上一页
          </button>
          <span className="alp-page-info">
            第 {pagination.page} / {pagination.totalPages} 页，共 {pagination.total} 条
          </span>
          <button
            className="alp-page-btn"
            disabled={pagination.page >= pagination.totalPages}
            onClick={() => handlePage(pagination.page + 1)}
          >
            下一页
          </button>
        </div>
      )}
    </div>
  );
}
