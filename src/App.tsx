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
  SafetyHomePage,
  ProblemTypesPage,
  DangerScalePage,
  TerrainGuidePage,
  CrystalTypesPage,
  RescuePage,
  DecisionFrameworkPage,
  AvalancheMapPage,
  QuizHubPage,
  QuizSessionPage,
  QuizResultPage,
  AdminDashboardPage,
  AuditLogPage,
} from './pages';

function isFullscreenPath(pathname: string): boolean {
  return pathname === '/map';
}

function isEditorPath(pathname: string): boolean {
  // Match /editor, /editor/:id, /observations/new, /observations/:id, /weather/new, /weather/:id
  if (pathname === '/editor' || pathname.startsWith('/editor/')) return true;
  if (pathname === '/observations/new' || /^\/observations\/\d+$/.test(pathname)) return true;
  if (pathname === '/weather/new' || /^\/weather\/\d+$/.test(pathname)) return true;
  // Quiz session and result pages are fullscreen (no header)
  if (pathname === '/safety/quiz/session' || pathname === '/safety/quiz/result') return true;
  return false;
}

function isAuthPath(pathname: string): boolean {
  return pathname === '/login' || pathname === '/register';
}

function AppRouterContent() {
  const location = useLocation();
  const showHeader = !isEditorPath(location.pathname) && !isAuthPath(location.pathname) && !isFullscreenPath(location.pathname);

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

        {/* 3D Avalanche Map - public */}
        <Route path="/map" element={<AvalancheMapPage />} />

        {/* Safety knowledge - public */}
        <Route path="/safety" element={<SafetyHomePage />} />
        <Route path="/safety/problem-types" element={<ProblemTypesPage />} />
        <Route path="/safety/danger-scale" element={<DangerScalePage />} />
        <Route path="/safety/terrain" element={<TerrainGuidePage />} />
        <Route path="/safety/crystal-types" element={<CrystalTypesPage />} />
        <Route path="/safety/rescue" element={<RescuePage />} />
        <Route path="/safety/decision" element={<DecisionFrameworkPage />} />

        {/* Quiz - public */}
        <Route path="/safety/quiz" element={<QuizHubPage />} />
        <Route path="/safety/quiz/session" element={<QuizSessionPage />} />
        <Route path="/safety/quiz/result" element={<QuizResultPage />} />

        {/* Admin routes - requires admin role */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/audit-logs"
          element={
            <ProtectedRoute requiredRole="admin">
              <AuditLogPage />
            </ProtectedRoute>
          }
        />

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
