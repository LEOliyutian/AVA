import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from './store/auth.store';
import { ProtectedRoute } from './components/auth';
import { ToastContainer } from './components/ui/Toast';
import { AppHeader } from './components/layout';
import {
  LoginPage,
  RegisterPage,
  HomePage,
  ForecastDetailPage,
  ForecastEditorPage,
  ForecastListPage,
  ForecastDashboardPage,
  ObservationListPage,
  ObservationEditorPage,
  WeatherListPage,
  WeatherEditorPage,
  WeatherDashboardPage,
} from './pages';

function isEditorPath(pathname: string): boolean {
  // Match /editor, /editor/:id, /observations/new, /observations/:id, /weather/new, /weather/:id
  if (pathname === '/editor' || pathname.startsWith('/editor/')) return true;
  if (pathname === '/observations/new' || /^\/observations\/\d+$/.test(pathname)) return true;
  if (pathname === '/weather/new' || /^\/weather\/\d+$/.test(pathname)) return true;
  return false;
}

function isAuthPath(pathname: string): boolean {
  return pathname === '/login' || pathname === '/register';
}

function AppRouterContent() {
  const location = useLocation();
  const showHeader = !isEditorPath(location.pathname) && !isAuthPath(location.pathname);

  return (
    <>
      {showHeader && <AppHeader />}
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Home - public */}
        <Route path="/" element={<HomePage />} />

        {/* Forecast detail - public */}
        <Route path="/forecast/:id" element={<ForecastDetailPage />} />

        {/* Editor - requires forecaster role */}
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

        {/* Snow observations - public */}
        <Route path="/observations" element={<ObservationListPage />} />
        <Route path="/observations/new" element={<ObservationEditorPage />} />
        <Route path="/observations/:id" element={<ObservationEditorPage />} />

        {/* Forecast list & dashboard - public */}
        <Route path="/forecasts" element={<ForecastDashboardPage />} />
        <Route path="/forecasts/list" element={<ForecastListPage />} />

        {/* Weather observations - public (dashboard first) */}
        <Route path="/weather" element={<WeatherDashboardPage />} />
        <Route path="/weather/list" element={<WeatherListPage />} />
        <Route path="/weather/dashboard" element={<Navigate to="/weather" replace />} />
        <Route path="/weather/new" element={<WeatherEditorPage />} />
        <Route path="/weather/:id" element={<WeatherEditorPage />} />

        {/* 404 redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Global Toast container */}
      <ToastContainer />
    </>
  );
}

function App() {
  const isLoading = useAuthStore((state) => state.isLoading);

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
      <AppRouterContent />
    </BrowserRouter>
  );
}

export default App;
