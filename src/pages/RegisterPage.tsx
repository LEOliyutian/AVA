import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store';
import './AuthPages.css';

export function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [localError, setLocalError] = useState('');

  const { register, isLoading, error, clearError } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    clearError();
    setLocalError('');

    // 验证
    if (!username.trim() || !password.trim() || !displayName.trim()) {
      setLocalError('请填写必填项');
      return;
    }

    if (!/^[a-zA-Z0-9_]{3,50}$/.test(username)) {
      setLocalError('用户名只能包含字母、数字和下划线，长度 3-50 字符');
      return;
    }

    if (password.length < 6) {
      setLocalError('密码长度至少 6 个字符');
      return;
    }

    if (password !== confirmPassword) {
      setLocalError('两次输入的密码不一致');
      return;
    }

    const success = await register(username, password, displayName, email || undefined);
    if (success) {
      navigate('/', { replace: true });
    }
  };

  const displayError = localError || error;

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h1>雪崩预报系统</h1>
          <p>吉克普林滑雪场</p>
        </div>

        <div className="auth-card">
          <h2>用户注册</h2>

          {displayError && <div className="auth-error">{displayError}</div>}

          <form onSubmit={handleSubmit}>
            <div className="auth-field">
              <label htmlFor="username">
                用户名 <span className="required">*</span>
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="3-50位字母、数字或下划线"
                disabled={isLoading}
                autoComplete="username"
              />
            </div>

            <div className="auth-field">
              <label htmlFor="displayName">
                显示名称 <span className="required">*</span>
              </label>
              <input
                id="displayName"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="您的姓名或昵称"
                disabled={isLoading}
              />
            </div>

            <div className="auth-field">
              <label htmlFor="email">邮箱</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="可选"
                disabled={isLoading}
                autoComplete="email"
              />
            </div>

            <div className="auth-field">
              <label htmlFor="password">
                密码 <span className="required">*</span>
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="至少 6 个字符"
                disabled={isLoading}
                autoComplete="new-password"
              />
            </div>

            <div className="auth-field">
              <label htmlFor="confirmPassword">
                确认密码 <span className="required">*</span>
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="再次输入密码"
                disabled={isLoading}
                autoComplete="new-password"
              />
            </div>

            <button type="submit" className="auth-button" disabled={isLoading}>
              {isLoading ? '注册中...' : '注册'}
            </button>
          </form>

          <div className="auth-footer">
            <span>已有账户？</span>
            <Link to="/login">返回登录</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
