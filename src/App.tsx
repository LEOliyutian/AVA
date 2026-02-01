import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/auth.store';
import { ProtectedRoute } from './components/auth';
import { ToastContainer } from './components/ui/Toast';
import { useToast } from './hooks';
import {
  LoginPage,
  RegisterPage,
  HomePage,
  ForecastDetailPage,
  ForecastEditorPage,
  ObservationListPage,
  ObservationEditorPage,
} from './pages';

function App() {
  const isLoading = useAuthStore((state) => state.isLoading);
  const { toasts } = useToast();

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner" />
        <p>加载中...</p>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* 公开路由 */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* 首页 - 公开可访问 */}
        <Route path="/" element={<HomePage />} />

        {/* 预报详情 - 公开可访问 */}
        <Route path="/forecast/:id" element={<ForecastDetailPage />} />

        {/* 编辑器 - 需要预报员权限 */}
        <Route
          path="/editor"
          element={
            <ProtectedRoute requiredRole="forecaster">
              <ForecastEditorPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/editor/:id"
          element={
            <ProtectedRoute requiredRole="forecaster">
              <ForecastEditorPage />
            </ProtectedRoute>
          }
        />

        {/* 雪层观测记录 - 公开访问 */}
        <Route path="/observations" element={<ObservationListPage />} />
        <Route path="/observations/new" element={<ObservationEditorPage />} />
        <Route path="/observations/:id" element={<ObservationEditorPage />} />

        {/* 404 重定向 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      
      {/* 全局Toast容器 */}
      <ToastContainer toasts={toasts} />
    </BrowserRouter>
  );
}

export default App;
