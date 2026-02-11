import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { forecastApi, type ForecastDetail, type CreateForecastRequest } from '../api';
import { useForecastStore } from '../store/forecast.store';
import { useAuthStore, useCanEdit } from '../store/auth.store';
import { useTheme } from '../contexts/ThemeContext';
import { ConfirmDialog } from '../components/ui';
import { Sidebar } from '../components/sidebar';
import { ReportSheet } from '../components/report';
import { useDangerLevels } from '../store/selectors';
import './ForecastEditorPage.css';

export function ForecastEditorPage() {
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);

  const [forecast, setForecast] = useState<ForecastDetail | null>(null);
  const [isLoading, setIsLoading] = useState(isEditMode);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [saveMessage, setSaveMessage] = useState('');
  const [showPublishConfirm, setShowPublishConfirm] = useState(false);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);

  const reportRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const { user } = useAuthStore();
  const canEdit = useCanEdit(forecast?.forecaster_id);
  const store = useForecastStore();
  const dangerLevels = useDangerLevels();
  const { theme, toggleTheme } = useTheme();

  // 加载现有预报（编辑模式）
  useEffect(() => {
    if (!id) {
      store.reset();
      return;
    }

    const loadForecast = async () => {
      setIsLoading(true);
      store.reset();
      const result = await forecastApi.getById(parseInt(id, 10));

      if (result.success && result.data) {
        const f = result.data.forecast;
        setForecast(f);

        // 将数据加载到 store
        store.setDate(f.forecast_date);
        if (f.trend_alp) store.setTrend('alp', f.trend_alp as 'increasing' | 'steady' | 'decreasing');
        if (f.trend_tl) store.setTrend('tl', f.trend_tl as 'increasing' | 'steady' | 'decreasing');
        if (f.trend_btl) store.setTrend('btl', f.trend_btl as 'increasing' | 'steady' | 'decreasing');

        if (f.primary_type) store.setPrimaryType(f.primary_type as any);
        if (f.primary_likelihood) store.setPrimaryLikelihood(f.primary_likelihood as any);
        if (f.primary_size) store.setPrimarySize(f.primary_size as any);
        if (f.primary_description) store.setPrimaryDescription(f.primary_description);
        if (f.primary_sectors) {
          const sectors = JSON.parse(f.primary_sectors) as string[];
          store.setPrimarySectors(new Set(sectors as any[]));
        }

        store.setSecondaryEnabled(f.secondary_enabled);
        if (f.secondary_type) store.setSecondaryType(f.secondary_type as any);
        if (f.secondary_likelihood) store.setSecondaryLikelihood(f.secondary_likelihood as any);
        if (f.secondary_size) store.setSecondarySize(f.secondary_size as any);
        if (f.secondary_description) store.setSecondaryDescription(f.secondary_description);
        if (f.secondary_sectors) {
          const sectors = JSON.parse(f.secondary_sectors) as string[];
          store.setSecondarySectors(new Set(sectors as any[]));
        }

        if (f.snowpack_observation) store.setSnowpack(f.snowpack_observation);
        if (f.activity_observation) store.setActivity(f.activity_observation);
        if (f.summary) store.setSummary(f.summary);

        // 天气数据
        if (f.weather) {
          if (f.weather.sky_condition) store.setWeather('sky', f.weather.sky_condition as any);
          if (f.weather.transport) store.setWeather('transport', f.weather.transport as any);
          if (f.weather.temp_min != null) store.setWeather('tempMin', f.weather.temp_min);
          if (f.weather.temp_max != null) store.setWeather('tempMax', f.weather.temp_max);
          if (f.weather.wind_direction) store.setWeather('windDirection', f.weather.wind_direction as any);
          if (f.weather.wind_speed) store.setWeather('windSpeed', f.weather.wind_speed as any);
          if (f.weather.hn24 != null) store.setWeather('hn24', f.weather.hn24);
          if (f.weather.hst != null) store.setWeather('hst', f.weather.hst);
          if (f.weather.hs != null) store.setWeather('hs', f.weather.hs);
        }

        store.markClean();
      } else {
        setError(result.error || '加载失败');
      }

      setIsLoading(false);
    };

    loadForecast();
  }, [id]);

  // 构建保存数据
  const buildForecastData = (): CreateForecastRequest => {
    return {
      forecast_date: store.date,
      danger_alp: dangerLevels.alp,
      danger_tl: dangerLevels.tl,
      danger_btl: dangerLevels.btl,
      trend_alp: store.trends.alp,
      trend_tl: store.trends.tl,
      trend_btl: store.trends.btl,

      primary_type: store.primaryProblem.type,
      primary_likelihood: store.primaryProblem.likelihood,
      primary_size: store.primaryProblem.size,
      primary_sectors: Array.from(store.primaryProblem.sectors),
      primary_description: store.primaryProblem.description,

      secondary_enabled: store.secondaryEnabled,
      secondary_type: store.secondaryProblem.type,
      secondary_likelihood: store.secondaryProblem.likelihood,
      secondary_size: store.secondaryProblem.size,
      secondary_sectors: Array.from(store.secondaryProblem.sectors),
      secondary_description: store.secondaryProblem.description,

      snowpack_observation: store.observations.snowpack,
      activity_observation: store.observations.activity,
      summary: store.summary,

      weather: {
        sky_condition: store.weather.sky,
        transport: store.weather.transport,
        temp_min: store.weather.tempMin,
        temp_max: store.weather.tempMax,
        wind_direction: store.weather.windDirection,
        wind_speed: store.weather.windSpeed,
        hn24: store.weather.hn24,
        hst: store.weather.hst,
        hs: store.weather.hs,
      },

      weather_observation: {
        observation_date: store.weatherObservation.date,
        recorder: store.weatherObservation.recorder,
        temp_min: store.weatherObservation.tempMin,
        temp_max: store.weatherObservation.tempMax,
        upper_station: {
          elevation: store.weatherObservation.upperStation.elevation,
          observation_time: store.weatherObservation.upperStation.time,
          cloud_cover: store.weatherObservation.upperStation.cloudCover,
          precipitation: store.weatherObservation.upperStation.precipitation,
          wind_direction: store.weatherObservation.upperStation.windDirection,
          wind_speed: store.weatherObservation.upperStation.windSpeed,
          grain_size: store.weatherObservation.upperStation.grainSize,
          surface_snow_type: store.weatherObservation.upperStation.surfaceSnowType,
          temp_10cm: store.weatherObservation.upperStation.temp10cm,
          temp_surface: store.weatherObservation.upperStation.tempSurface,
          temp_air: store.weatherObservation.upperStation.tempAir,
          blowing_snow: store.weatherObservation.upperStation.blowingSnow,
          snow_depth: store.weatherObservation.upperStation.snowDepth,
          hst: store.weatherObservation.upperStation.hst ?? null,
          h24: store.weatherObservation.upperStation.h24 ?? null,
        },
        lower_station: {
          elevation: store.weatherObservation.lowerStation.elevation,
          observation_time: store.weatherObservation.lowerStation.time,
          cloud_cover: store.weatherObservation.lowerStation.cloudCover,
          precipitation: store.weatherObservation.lowerStation.precipitation,
          wind_direction: store.weatherObservation.lowerStation.windDirection,
          wind_speed: store.weatherObservation.lowerStation.windSpeed,
          grain_size: store.weatherObservation.lowerStation.grainSize,
          surface_snow_type: store.weatherObservation.lowerStation.surfaceSnowType,
          temp_10cm: store.weatherObservation.lowerStation.temp10cm,
          temp_surface: store.weatherObservation.lowerStation.tempSurface,
          temp_air: store.weatherObservation.lowerStation.tempAir,
          blowing_snow: store.weatherObservation.lowerStation.blowingSnow,
          snow_depth: store.weatherObservation.lowerStation.snowDepth,
          hst: store.weatherObservation.lowerStation.hst ?? null,
          h24: store.weatherObservation.lowerStation.h24 ?? null,
        },
      },
    };
  };

  // 保存草稿
  const handleSaveDraft = async () => {
    setIsSaving(true);
    setSaveMessage('');
    setError('');

    const data = buildForecastData();
    data.status = 'draft';

    let result;
    if (isEditMode && id) {
      result = await forecastApi.update(parseInt(id, 10), data);
    } else {
      result = await forecastApi.create(data);
    }

    if (result.success) {
      setSaveMessage('保存成功');
      if (!isEditMode && result.data && 'id' in result.data) {
        navigate(`/editor/${result.data.id}`, { replace: true });
      }
    } else {
      setError(result.error || '保存失败');
    }

    setIsSaving(false);
    setTimeout(() => setSaveMessage(''), 3000);
  };

  // 保存并发布
  const handlePublish = async () => {
    if (!window.confirm('确定要发布此预报吗？')) return;

    setIsSaving(true);
    setSaveMessage('');
    setError('');

    const data = buildForecastData();
    data.status = 'published';

    let result;
    if (isEditMode && id) {
      result = await forecastApi.update(parseInt(id, 10), data);
      if (result.success) {
        await forecastApi.publish(parseInt(id, 10));
      }
    } else {
      result = await forecastApi.create(data);
      if (result.success && result.data && 'id' in result.data) {
        await forecastApi.publish(result.data.id);
      }
    }

    if (result.success) {
      setSaveMessage('发布成功');
      setTimeout(() => navigate('/'), 1500);
    } else {
      setError(result.error || '发布失败');
    }

    setIsSaving(false);
  };

  if (isLoading) {
    return (
      <div className="editor-page">
        <div className="loading">加载中...</div>
      </div>
    );
  }

  if (isEditMode && !canEdit && forecast) {
    return (
      <div className="editor-page">
        <div className="error-container">
          <p>您没有权限编辑此预报</p>
          <Link to="/" className="btn btn-primary">返回首页</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="editor-page">
      {/* 顶部工具栏 */}
      <div className="editor-toolbar">
        <Link to="/" className="back-link">← 返回</Link>
        <div className="toolbar-title">
          {isEditMode ? '编辑预报' : '新建预报'}
          {forecast?.status === 'published' && (
            <span className="status-badge status-published">已发布</span>
          )}
        </div>
        <div className="toolbar-actions">
          {error && <span className="toolbar-error">{error}</span>}
          {saveMessage && <span className="toolbar-success">{saveMessage}</span>}
          <button
            onClick={handleSaveDraft}
            disabled={isSaving}
            className="btn btn-outline"
          >
            {isSaving ? '保存中...' : '保存草稿'}
          </button>
          <button
            onClick={handlePublish}
            disabled={isSaving}
            className="btn btn-primary"
          >
            {isSaving ? '处理中...' : '保存并发布'}
          </button>
        </div>
      </div>

      {/* 编辑器主体 */}
      <div className="editor-container">
        <Sidebar reportRef={reportRef} />
        <div className="preview-area">
          <ReportSheet ref={reportRef} />
        </div>
      </div>
    </div>
  );
}
