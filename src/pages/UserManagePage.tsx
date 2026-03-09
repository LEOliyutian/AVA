import { useEffect, useState, useCallback } from 'react';
import { adminApi, type AdminUser, type CreateUserPayload } from '../api/admin.api';
import './UserManagePage.css';

const ROLE_LABELS: Record<string, string> = {
  admin: '管理员',
  forecaster: '预报员',
  visitor: '访客',
};

interface CreateModalProps {
  onClose: () => void;
  onDone: () => void;
}

function CreateUserModal({ onClose, onDone }: CreateModalProps) {
  const [form, setForm] = useState<CreateUserPayload>({
    username: '',
    password: '',
    display_name: '',
    role: 'visitor',
    email: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (k: keyof CreateUserPayload, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    if (!form.username || !form.password || !form.display_name) {
      setError('用户名、密码、显示名为必填项');
      return;
    }
    if (form.password.length < 6) {
      setError('密码至少 6 位');
      return;
    }
    setLoading(true);
    const res = await adminApi.createUser(form);
    setLoading(false);
    if (res.success) {
      onDone();
    } else {
      setError(res.error || '创建失败');
    }
  };

  return (
    <div className="ump-modal-overlay" onClick={onClose}>
      <div className="ump-modal" onClick={(e) => e.stopPropagation()}>
        <h3 className="ump-modal-title">新建用户</h3>

        <div className="ump-form-grid">
          <label className="ump-label">
            用户名 *
            <input
              className="ump-input"
              value={form.username}
              onChange={(e) => set('username', e.target.value)}
              placeholder="用于登录"
              autoFocus
            />
          </label>
          <label className="ump-label">
            显示名 *
            <input
              className="ump-input"
              value={form.display_name}
              onChange={(e) => set('display_name', e.target.value)}
              placeholder="界面显示的名字"
            />
          </label>
          <label className="ump-label">
            初始密码 *
            <input
              className="ump-input"
              type="password"
              value={form.password}
              onChange={(e) => set('password', e.target.value)}
              placeholder="至少 6 位"
            />
          </label>
          <label className="ump-label">
            角色 *
            <select
              className="ump-select"
              value={form.role}
              onChange={(e) => set('role', e.target.value)}
            >
              <option value="visitor">访客</option>
              <option value="forecaster">预报员</option>
              <option value="admin">管理员</option>
            </select>
          </label>
          <label className="ump-label ump-label--full">
            邮箱（可选）
            <input
              className="ump-input"
              type="email"
              value={form.email}
              onChange={(e) => set('email', e.target.value)}
              placeholder="example@example.com"
            />
          </label>
        </div>

        {error && <div className="ump-modal-error">{error}</div>}

        <div className="ump-modal-actions">
          <button className="ump-btn ump-btn--ghost" onClick={onClose} disabled={loading}>
            取消
          </button>
          <button className="ump-btn ump-btn--primary" onClick={handleSubmit} disabled={loading}>
            {loading ? '创建中...' : '创建用户'}
          </button>
        </div>
      </div>
    </div>
  );
}

export function UserManagePage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');
  const [showCreate, setShowCreate] = useState(false);

  const [filterRole, setFilterRole] = useState('');
  const [filterKeyword, setFilterKeyword] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const load = useCallback(async (p = page, role = filterRole, keyword = filterKeyword) => {
    setLoading(true);
    const res = await adminApi.getUsers({ page: p, limit: 20, role: role || undefined, keyword: keyword || undefined });
    if (res.success && res.data) {
      setUsers(res.data.users);
      setTotalPages(res.data.pagination.totalPages);
      setTotal(res.data.pagination.total);
    } else {
      setError(res.error || '加载失败');
    }
    setLoading(false);
  }, []);

  useEffect(() => { load(1); }, []);

  const handleSearch = () => {
    setPage(1);
    load(1, filterRole, filterKeyword);
  };

  const handleReset = () => {
    setFilterRole('');
    setFilterKeyword('');
    setPage(1);
    load(1, '', '');
  };

  const handleToggleActive = async (user: AdminUser) => {
    const action = user.is_active ? '禁用' : '启用';
    if (!window.confirm(`确定要${action}用户「${user.display_name}」吗？`)) return;
    const res = await adminApi.setUserStatus(user.id, !user.is_active);
    if (res.success) {
      showToast(`已${action}用户「${user.display_name}」`);
      load(page, filterRole, filterKeyword);
    } else {
      setError(res.error || '操作失败');
    }
  };

  return (
    <div className="ump-container">
      <div className="ump-header">
        <h1 className="ump-title">用户管理</h1>
        <button className="ump-btn ump-btn--primary" onClick={() => setShowCreate(true)}>
          + 新建用户
        </button>
      </div>

      {/* 筛选栏 */}
      <div className="ump-filter-bar">
        <select
          className="ump-filter-select"
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
        >
          <option value="">全部角色</option>
          <option value="admin">管理员</option>
          <option value="forecaster">预报员</option>
          <option value="visitor">访客</option>
        </select>
        <input
          className="ump-filter-input"
          placeholder="搜索用户名或显示名"
          value={filterKeyword}
          onChange={(e) => setFilterKeyword(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button className="ump-btn ump-btn--outline" onClick={handleSearch}>搜索</button>
        <button className="ump-btn ump-btn--ghost" onClick={handleReset}>重置</button>
        <span className="ump-filter-total">共 {total} 人</span>
      </div>

      {error && <div className="ump-error">{error}</div>}
      {toast && <div className="ump-toast">{toast}</div>}

      {/* 用户表格 */}
      <div className="ump-table-wrap">
        <table className="ump-table">
          <thead>
            <tr>
              <th>用户名</th>
              <th>显示名</th>
              <th>角色</th>
              <th>状态</th>
              <th>注册时间</th>
              <th>最后登录</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="ump-center">加载中...</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan={7} className="ump-center">暂无用户</td></tr>
            ) : (
              users.map((u) => (
                <tr key={u.id} className={!u.is_active ? 'ump-row--disabled' : ''}>
                  <td className="ump-td-username">{u.username}</td>
                  <td>{u.display_name}</td>
                  <td>
                    <span className={`ump-role-badge ump-role-badge--${u.role}`}>
                      {ROLE_LABELS[u.role]}
                    </span>
                  </td>
                  <td>
                    {u.is_active
                      ? <span className="ump-status ump-status--active">启用</span>
                      : <span className="ump-status ump-status--disabled">已禁用</span>
                    }
                  </td>
                  <td className="ump-td-time">{u.created_at.slice(0, 10)}</td>
                  <td className="ump-td-time">{u.last_login ? u.last_login.slice(0, 16).replace('T', ' ') : '—'}</td>
                  <td>
                    <div className="ump-action-group">
                      <button
                        className={`ump-action-btn ${u.is_active ? 'ump-action-btn--warn' : 'ump-action-btn--ok'}`}
                        onClick={() => handleToggleActive(u)}
                      >
                        {u.is_active ? '禁用' : '启用'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 分页 */}
      {totalPages > 1 && (
        <div className="ump-pagination">
          <button
            className="ump-page-btn"
            disabled={page <= 1}
            onClick={() => { setPage(page - 1); load(page - 1, filterRole, filterKeyword); }}
          >
            上一页
          </button>
          <span className="ump-page-info">第 {page} / {totalPages} 页</span>
          <button
            className="ump-page-btn"
            disabled={page >= totalPages}
            onClick={() => { setPage(page + 1); load(page + 1, filterRole, filterKeyword); }}
          >
            下一页
          </button>
        </div>
      )}

      {showCreate && (
        <CreateUserModal
          onClose={() => setShowCreate(false)}
          onDone={() => { setShowCreate(false); showToast('用户创建成功'); load(1, filterRole, filterKeyword); }}
        />
      )}
    </div>
  );
}
