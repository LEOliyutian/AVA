import { useAuthStore } from '../../store';
import { useToast } from '../../hooks';

export function DebugInfo() {
  const { user, isAuthenticated, login } = useAuthStore();
  const { success, error, warning, info } = useToast();

  const handleQuickLogin = async () => {
    await login('admin', 'admin123');
  };

  const handleTestToast = () => {
    success('这是一个成功提示！');
    setTimeout(() => warning('这是一个警告提示！'), 1000);
    setTimeout(() => error('这是一个错误提示！'), 2000);
    setTimeout(() => info('这是一个信息提示！'), 3000);
  };

  // 移除自动调用，避免无限循环

  if (import.meta.env.PROD) {
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      background: 'rgba(0,0,0,0.8)',
      color: 'white',
      padding: '10px',
      borderRadius: '5px',
      fontSize: '12px',
      zIndex: 9999,
      maxWidth: '300px'
    }}>
      <h4>Debug Info</h4>
      <div><strong>已登录:</strong> {isAuthenticated ? '是' : '否'}</div>
      <div><strong>用户名:</strong> {user?.username || '无'}</div>
      <div><strong>角色:</strong> {user?.role || '无'}</div>
      <div><strong>用户ID:</strong> {user?.id || '无'}</div>
      <div><strong>Token:</strong> {localStorage.getItem('auth_token') ? '存在' : '不存在'}</div>
      {!isAuthenticated ? (
        <button 
          onClick={handleQuickLogin}
          style={{
            marginTop: '10px',
            padding: '5px 10px',
            background: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '3px',
            cursor: 'pointer'
          }}
        >
          快速登录 (admin)
        </button>
      ) : (
        <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <button 
            onClick={handleTestToast}
            style={{
              padding: '5px 10px',
              background: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '3px',
              cursor: 'pointer',
              fontSize: '11px'
            }}
          >
            测试提示
          </button>
        </div>
      )}
    </div>
  );
}