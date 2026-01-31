import { getDatabase } from '../config/database.js';
import type {
  Forecast,
  ForecastListItem,
  ForecastDetail,
  CreateForecastRequest,
  PaginationParams,
  PaginatedResponse,
  WeatherData,
  WeatherObservation,
  StationObservation,
  ForecastStatus,
} from '../types/index.js';

export class ForecastService {
  // 获取预报列表（支持分页和筛选）
  getForecasts(params: PaginationParams = {}): PaginatedResponse<ForecastListItem> {
    const db = getDatabase();
    const { page = 1, limit = 10, status, startDate, endDate } = params;
    const offset = (page - 1) * limit;

    // 构建查询条件
    const conditions: string[] = [];
    const queryParams: (string | number)[] = [];

    if (status) {
      conditions.push('f.status = ?');
      queryParams.push(status);
    }

    if (startDate) {
      conditions.push('f.forecast_date >= ?');
      queryParams.push(startDate);
    }

    if (endDate) {
      conditions.push('f.forecast_date <= ?');
      queryParams.push(endDate);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // 获取总数
    const countQuery = `SELECT COUNT(*) as total FROM forecasts f ${whereClause}`;
    const countResult = db.prepare(countQuery).get(...queryParams) as { total: number };
    const total = countResult.total;

    // 获取数据
    const dataQuery = `
      SELECT
        f.id, f.forecast_date, f.status,
        f.danger_alp, f.danger_tl, f.danger_btl,
        f.created_at, f.published_at,
        u.display_name as forecaster_name
      FROM forecasts f
      LEFT JOIN users u ON f.forecaster_id = u.id
      ${whereClause}
      ORDER BY f.forecast_date DESC, f.created_at DESC
      LIMIT ? OFFSET ?
    `;

    const data = db.prepare(dataQuery).all(...queryParams, limit, offset) as ForecastListItem[];

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // 获取单个预报详情
  getForecastById(id: number): ForecastDetail | null {
    const db = getDatabase();

    // 获取预报基本信息
    const forecastQuery = `
      SELECT f.*, u.display_name as forecaster_name
      FROM forecasts f
      LEFT JOIN users u ON f.forecaster_id = u.id
      WHERE f.id = ?
    `;
    const forecast = db.prepare(forecastQuery).get(id) as (Forecast & { forecaster_name: string }) | undefined;

    if (!forecast) {
      return null;
    }

    // 获取天气数据
    const weather = db.prepare('SELECT * FROM weather_data WHERE forecast_id = ?').get(id) as WeatherData | undefined;

    // 获取气象观测
    const weatherObservation = db.prepare('SELECT * FROM weather_observations WHERE forecast_id = ?').get(id) as WeatherObservation | undefined;

    let upperStation: StationObservation | null = null;
    let lowerStation: StationObservation | null = null;

    if (weatherObservation) {
      upperStation = db.prepare(
        "SELECT * FROM station_observations WHERE weather_observation_id = ? AND station_type = 'upper'"
      ).get(weatherObservation.id) as StationObservation | null;

      lowerStation = db.prepare(
        "SELECT * FROM station_observations WHERE weather_observation_id = ? AND station_type = 'lower'"
      ).get(weatherObservation.id) as StationObservation | null;
    }

    return {
      ...forecast,
      weather: weather || null,
      weather_observation: weatherObservation
        ? {
            ...weatherObservation,
            upper_station: upperStation,
            lower_station: lowerStation,
          }
        : null,
    };
  }

  // 创建预报
  createForecast(data: CreateForecastRequest, forecasterId: number): number {
    const db = getDatabase();

    const insertForecast = db.prepare(`
      INSERT INTO forecasts (
        forecast_date, forecaster_id, status,
        danger_alp, danger_tl, danger_btl,
        trend_alp, trend_tl, trend_btl,
        primary_type, primary_likelihood, primary_size, primary_sectors, primary_description,
        secondary_enabled, secondary_type, secondary_likelihood, secondary_size, secondary_sectors, secondary_description,
        snowpack_observation, activity_observation, summary
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = insertForecast.run(
      data.forecast_date,
      forecasterId,
      data.status || 'draft',
      data.danger_alp,
      data.danger_tl,
      data.danger_btl,
      data.trend_alp || null,
      data.trend_tl || null,
      data.trend_btl || null,
      data.primary_type || null,
      data.primary_likelihood || null,
      data.primary_size || null,
      data.primary_sectors ? JSON.stringify(data.primary_sectors) : null,
      data.primary_description || null,
      data.secondary_enabled ? 1 : 0,
      data.secondary_type || null,
      data.secondary_likelihood || null,
      data.secondary_size || null,
      data.secondary_sectors ? JSON.stringify(data.secondary_sectors) : null,
      data.secondary_description || null,
      data.snowpack_observation || null,
      data.activity_observation || null,
      data.summary || null
    );

    const forecastId = result.lastInsertRowid as number;

    // 插入天气数据
    if (data.weather) {
      db.prepare(`
        INSERT INTO weather_data (
          forecast_id, sky_condition, transport, temp_min, temp_max,
          wind_direction, wind_speed, hn24, hst, hs
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        forecastId,
        data.weather.sky_condition || null,
        data.weather.transport || null,
        data.weather.temp_min ?? null,
        data.weather.temp_max ?? null,
        data.weather.wind_direction || null,
        data.weather.wind_speed || null,
        data.weather.hn24 ?? null,
        data.weather.hst ?? null,
        data.weather.hs ?? null
      );
    }

    // 插入气象观测
    if (data.weather_observation) {
      const obsResult = db.prepare(`
        INSERT INTO weather_observations (
          forecast_id, observation_date, recorder, temp_min, temp_max
        ) VALUES (?, ?, ?, ?, ?)
      `).run(
        forecastId,
        data.weather_observation.observation_date || null,
        data.weather_observation.recorder || null,
        data.weather_observation.temp_min ?? null,
        data.weather_observation.temp_max ?? null
      );

      const weatherObsId = obsResult.lastInsertRowid as number;

      // 插入站点观测
      if (data.weather_observation.upper_station) {
        this.insertStationObservation(weatherObsId, 'upper', data.weather_observation.upper_station);
      }
      if (data.weather_observation.lower_station) {
        this.insertStationObservation(weatherObsId, 'lower', data.weather_observation.lower_station);
      }
    }

    return forecastId;
  }

  // 更新预报
  updateForecast(id: number, data: Partial<CreateForecastRequest>): boolean {
    const db = getDatabase();

    const updates: string[] = [];
    const params: (string | number | null)[] = [];

    // 构建动态更新语句
    if (data.forecast_date !== undefined) {
      updates.push('forecast_date = ?');
      params.push(data.forecast_date);
    }
    if (data.status !== undefined) {
      updates.push('status = ?');
      params.push(data.status);
      if (data.status === 'published') {
        updates.push('published_at = CURRENT_TIMESTAMP');
      }
    }
    if (data.danger_alp !== undefined) {
      updates.push('danger_alp = ?');
      params.push(data.danger_alp);
    }
    if (data.danger_tl !== undefined) {
      updates.push('danger_tl = ?');
      params.push(data.danger_tl);
    }
    if (data.danger_btl !== undefined) {
      updates.push('danger_btl = ?');
      params.push(data.danger_btl);
    }
    if (data.trend_alp !== undefined) {
      updates.push('trend_alp = ?');
      params.push(data.trend_alp || null);
    }
    if (data.trend_tl !== undefined) {
      updates.push('trend_tl = ?');
      params.push(data.trend_tl || null);
    }
    if (data.trend_btl !== undefined) {
      updates.push('trend_btl = ?');
      params.push(data.trend_btl || null);
    }
    if (data.primary_type !== undefined) {
      updates.push('primary_type = ?');
      params.push(data.primary_type || null);
    }
    if (data.primary_likelihood !== undefined) {
      updates.push('primary_likelihood = ?');
      params.push(data.primary_likelihood ?? null);
    }
    if (data.primary_size !== undefined) {
      updates.push('primary_size = ?');
      params.push(data.primary_size ?? null);
    }
    if (data.primary_sectors !== undefined) {
      updates.push('primary_sectors = ?');
      params.push(data.primary_sectors ? JSON.stringify(data.primary_sectors) : null);
    }
    if (data.primary_description !== undefined) {
      updates.push('primary_description = ?');
      params.push(data.primary_description || null);
    }
    if (data.secondary_enabled !== undefined) {
      updates.push('secondary_enabled = ?');
      params.push(data.secondary_enabled ? 1 : 0);
    }
    if (data.secondary_type !== undefined) {
      updates.push('secondary_type = ?');
      params.push(data.secondary_type || null);
    }
    if (data.secondary_likelihood !== undefined) {
      updates.push('secondary_likelihood = ?');
      params.push(data.secondary_likelihood ?? null);
    }
    if (data.secondary_size !== undefined) {
      updates.push('secondary_size = ?');
      params.push(data.secondary_size ?? null);
    }
    if (data.secondary_sectors !== undefined) {
      updates.push('secondary_sectors = ?');
      params.push(data.secondary_sectors ? JSON.stringify(data.secondary_sectors) : null);
    }
    if (data.secondary_description !== undefined) {
      updates.push('secondary_description = ?');
      params.push(data.secondary_description || null);
    }
    if (data.snowpack_observation !== undefined) {
      updates.push('snowpack_observation = ?');
      params.push(data.snowpack_observation || null);
    }
    if (data.activity_observation !== undefined) {
      updates.push('activity_observation = ?');
      params.push(data.activity_observation || null);
    }
    if (data.summary !== undefined) {
      updates.push('summary = ?');
      params.push(data.summary || null);
    }

    if (updates.length > 0) {
      updates.push('updated_at = CURRENT_TIMESTAMP');
      params.push(id);

      const query = `UPDATE forecasts SET ${updates.join(', ')} WHERE id = ?`;
      db.prepare(query).run(...params);
    }

    // 更新天气数据
    if (data.weather) {
      const existingWeather = db.prepare('SELECT id FROM weather_data WHERE forecast_id = ?').get(id);

      if (existingWeather) {
        db.prepare(`
          UPDATE weather_data SET
            sky_condition = ?, transport = ?, temp_min = ?, temp_max = ?,
            wind_direction = ?, wind_speed = ?, hn24 = ?, hst = ?, hs = ?
          WHERE forecast_id = ?
        `).run(
          data.weather.sky_condition || null,
          data.weather.transport || null,
          data.weather.temp_min ?? null,
          data.weather.temp_max ?? null,
          data.weather.wind_direction || null,
          data.weather.wind_speed || null,
          data.weather.hn24 ?? null,
          data.weather.hst ?? null,
          data.weather.hs ?? null,
          id
        );
      } else {
        db.prepare(`
          INSERT INTO weather_data (
            forecast_id, sky_condition, transport, temp_min, temp_max,
            wind_direction, wind_speed, hn24, hst, hs
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
          id,
          data.weather.sky_condition || null,
          data.weather.transport || null,
          data.weather.temp_min ?? null,
          data.weather.temp_max ?? null,
          data.weather.wind_direction || null,
          data.weather.wind_speed || null,
          data.weather.hn24 ?? null,
          data.weather.hst ?? null,
          data.weather.hs ?? null
        );
      }
    }

    // 更新气象观测
    if (data.weather_observation) {
      const existingObs = db.prepare('SELECT id FROM weather_observations WHERE forecast_id = ?').get(id) as { id: number } | undefined;

      if (existingObs) {
        db.prepare(`
          UPDATE weather_observations SET
            observation_date = ?, recorder = ?, temp_min = ?, temp_max = ?
          WHERE forecast_id = ?
        `).run(
          data.weather_observation.observation_date || null,
          data.weather_observation.recorder || null,
          data.weather_observation.temp_min ?? null,
          data.weather_observation.temp_max ?? null,
          id
        );

        // 更新站点观测
        if (data.weather_observation.upper_station) {
          this.upsertStationObservation(existingObs.id, 'upper', data.weather_observation.upper_station);
        }
        if (data.weather_observation.lower_station) {
          this.upsertStationObservation(existingObs.id, 'lower', data.weather_observation.lower_station);
        }
      } else {
        const obsResult = db.prepare(`
          INSERT INTO weather_observations (
            forecast_id, observation_date, recorder, temp_min, temp_max
          ) VALUES (?, ?, ?, ?, ?)
        `).run(
          id,
          data.weather_observation.observation_date || null,
          data.weather_observation.recorder || null,
          data.weather_observation.temp_min ?? null,
          data.weather_observation.temp_max ?? null
        );

        const weatherObsId = obsResult.lastInsertRowid as number;

        if (data.weather_observation.upper_station) {
          this.insertStationObservation(weatherObsId, 'upper', data.weather_observation.upper_station);
        }
        if (data.weather_observation.lower_station) {
          this.insertStationObservation(weatherObsId, 'lower', data.weather_observation.lower_station);
        }
      }
    }

    return true;
  }

  // 删除预报
  deleteForecast(id: number): boolean {
    const db = getDatabase();
    const result = db.prepare('DELETE FROM forecasts WHERE id = ?').run(id);
    return result.changes > 0;
  }

  // 发布预报
  publishForecast(id: number): boolean {
    const db = getDatabase();
    const result = db.prepare(`
      UPDATE forecasts
      SET status = 'published', published_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(id);
    return result.changes > 0;
  }

  // 获取预报的创建者 ID
  getForecastOwnerId(id: number): number | null {
    const db = getDatabase();
    const result = db.prepare('SELECT forecaster_id FROM forecasts WHERE id = ?').get(id) as { forecaster_id: number } | undefined;
    return result ? result.forecaster_id : null;
  }

  // 获取最新发布的预报
  getLatestPublishedForecast(): ForecastDetail | null {
    const db = getDatabase();
    const result = db.prepare(`
      SELECT id FROM forecasts
      WHERE status = 'published'
      ORDER BY forecast_date DESC, published_at DESC
      LIMIT 1
    `).get() as { id: number } | undefined;

    if (!result) {
      return null;
    }

    return this.getForecastById(result.id);
  }

  // 插入站点观测
  private insertStationObservation(
    weatherObsId: number,
    stationType: 'upper' | 'lower',
    data: Omit<StationObservation, 'id' | 'weather_observation_id'>
  ): void {
    const db = getDatabase();
    db.prepare(`
      INSERT INTO station_observations (
        weather_observation_id, station_type, elevation, observation_time,
        cloud_cover, precipitation, wind_direction, wind_speed,
        grain_size, surface_snow_type, temp_10cm, temp_surface, temp_air,
        blowing_snow, snow_depth, hst, h24
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      weatherObsId,
      stationType,
      data.elevation,
      data.observation_time || null,
      data.cloud_cover || null,
      data.precipitation || null,
      data.wind_direction || null,
      data.wind_speed ?? null,
      data.grain_size ?? null,
      data.surface_snow_type || null,
      data.temp_10cm ?? null,
      data.temp_surface ?? null,
      data.temp_air ?? null,
      data.blowing_snow || null,
      data.snow_depth ?? null,
      data.hst ?? null,
      data.h24 ?? null
    );
  }

  // 更新或插入站点观测
  private upsertStationObservation(
    weatherObsId: number,
    stationType: 'upper' | 'lower',
    data: Omit<StationObservation, 'id' | 'weather_observation_id'>
  ): void {
    const db = getDatabase();
    const existing = db.prepare(
      'SELECT id FROM station_observations WHERE weather_observation_id = ? AND station_type = ?'
    ).get(weatherObsId, stationType);

    if (existing) {
      db.prepare(`
        UPDATE station_observations SET
          elevation = ?, observation_time = ?, cloud_cover = ?, precipitation = ?,
          wind_direction = ?, wind_speed = ?, grain_size = ?, surface_snow_type = ?,
          temp_10cm = ?, temp_surface = ?, temp_air = ?, blowing_snow = ?,
          snow_depth = ?, hst = ?, h24 = ?
        WHERE weather_observation_id = ? AND station_type = ?
      `).run(
        data.elevation,
        data.observation_time || null,
        data.cloud_cover || null,
        data.precipitation || null,
        data.wind_direction || null,
        data.wind_speed ?? null,
        data.grain_size ?? null,
        data.surface_snow_type || null,
        data.temp_10cm ?? null,
        data.temp_surface ?? null,
        data.temp_air ?? null,
        data.blowing_snow || null,
        data.snow_depth ?? null,
        data.hst ?? null,
        data.h24 ?? null,
        weatherObsId,
        stationType
      );
    } else {
      this.insertStationObservation(weatherObsId, stationType, data);
    }
  }
}

export const forecastService = new ForecastService();
