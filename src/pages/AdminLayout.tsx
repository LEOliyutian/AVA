import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store';
import './AdminLayout.css';

const NAV_ITEMS = [
  { to: '/admin/dashboard', label: '仪表板', icon: '◈' },
  { to: '/admin/audit-logs', label: '审计日志', icon: '≡' },
  { to: '/admin/review', label: '预报审核', icon: '✓' },
  { to: '/admin/users', label: '用户管理', icon: '⊕' },
  { to: '/admin/knowledge', label: '知识内容', icon: '◎' },
  { to: '/admin/settings', label: '系统配置', icon: '⚙' },
];

export function AdminLayout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="adl-root">
      {/* 左侧导航 */}
      <nav className="adl-nav">
        <div className="adl-nav-header">
          <div className="adl-logo">TaigaSnow</div>
          <div className="adl-logo-sub">管理后台</div>
        </div>

        <ul className="adl-nav-list">
          {NAV_ITEMS.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `adl-nav-link${isActive ? ' adl-nav-link--active' : ''}`
                }
              >
                <span className="adl-nav-icon">{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="adl-nav-footer">
          <div className="adl-user-info">
            <div className="adl-user-name">{user?.display_name ?? user?.username}</div>
            <div className="adl-user-role">管理员</div>
          </div>
          <button className="adl-logout-btn" onClick={handleLogout}>退出</button>
        </div>
      </nav>

      {/* 内容区 */}
      <main className="adl-content">
        <Outlet />
      </main>
    </div>
  );
}
