import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore, useIsForecaster } from '../../store/auth.store';
import './AppHeader.css';

export function AppHeader() {
  const { user, logout } = useAuthStore();
  const isForecaster = useIsForecaster();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    // "雪崩预报" nav includes /forecasts, /forecast/:id, and /editor
    if (path === '/forecasts') {
      return location.pathname.startsWith('/forecasts') ||
        location.pathname.startsWith('/forecast/') ||
        location.pathname.startsWith('/editor');
    }
    return location.pathname.startsWith(path);
  };

  return (
    <header className="taiga-header">
      <div className="header-container">
        <div className="header-left">
          <Link to="/" className="brand">
            <div className="brand-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 19h20L12 2zm0 3.3L19.07 17H4.93L12 5.3zM11 10h2v4h-2v-4zm0 5h2v2h-2v-2z" />
              </svg>
            </div>
            <div className="brand-text">
              <h1>TaigaSnow</h1>
            </div>
          </Link>

          <nav className="main-nav">
            <Link to="/" className={`nav-item${isActive('/') ? ' active' : ''}`}>首页</Link>
            <Link to="/forecasts" className={`nav-item${isActive('/forecasts') ? ' active' : ''}`}>雪崩预报</Link>
            <Link to="/weather" className={`nav-item${isActive('/weather') ? ' active' : ''}`}>气象观察</Link>
            <Link to="/observations" className={`nav-item${isActive('/observations') ? ' active' : ''}`}>雪层观测</Link>
          </nav>
        </div>

        <div className="header-right">
          {user ? (
            <div className="user-area">
              <span className="user-name">{user.display_name}</span>
              <button onClick={handleLogout} className="btn-lang">退出</button>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn-lang">登录</Link>
              <Link to="/register" className="btn-primary-sm">注册</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
