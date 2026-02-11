import { getDatabase } from '../config/database.js';

export interface StationData {
  id?: number;
  name: string;
  elevation: number;
  time: string;
  cloud_cover: string;
  precipitation: string;
  wind_direction: string;
  wind_speed: number;
  grain_size: number;
  surface_snow_type: string;
  temp_10cm: number;
  temp_surface: number;
  temp_air: number;
  blowing_snow: string;
  snow_depth: number;
  hst?: number;
  h24?: number;
}

export interface WeatherObservationInput {
  date: string;
  recorder: string;
  temp_min: number;
  temp_max: number;
  stations: StationData[];
}

export interface WeatherObservationListItem {
  id: number;
  date: string;
  recorder: string;
  temp_min: number;
  temp_max: number;
  station_count: number;
  created_at: string;
  updated_at: string;
}

export interface WeatherObservationDetail {
  id: number;
  date: string;
  recorder: string;
  temp_min: number;
  temp_max: number;
  stations: StationData[];
  created_at: string;
  updated_at: string;
}

class WeatherService {
  // 获取气象观测列表
  getList(params: { page?: number; limit?: number } = {}) {
    const db = getDatabase();
    const page = params.page || 1;
    const limit = params.limit || 20;
    const offset = (page - 1) * limit;

    // 获取总数
    const countResult = db.prepare('SELECT COUNT(*) as total FROM weather_observation_records').get() as { total: number };
    const total = countResult.total;

    // 获取列表
    const observations = db.prepare(`
      SELECT
        wor.id,
        wor.date,
        wor.recorder,
        wor.temp_min,
        wor.temp_max,
        (SELECT COUNT(*) FROM weather_station_data WHERE observation_id = wor.id) as station_count,
        wor.created_at,
        wor.updated_at
      FROM weather_observation_records wor
      ORDER BY wor.date DESC, wor.id DESC
      LIMIT ? OFFSET ?
    `).all(limit, offset) as WeatherObservationListItem[];

    return {
      observations,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // 获取单个气象观测详情
  getById(id: number): WeatherObservationDetail | null {
    const db = getDatabase();

    const observation = db.prepare(`
      SELECT * FROM weather_observation_records WHERE id = ?
    `).get(id) as any;

    if (!observation) return null;

    const stations = db.prepare(`
      SELECT
        id,
        name,
        elevation,
        observation_time as time,
        cloud_cover,
        precipitation,
        wind_direction,
        wind_speed,
        grain_size,
        surface_snow_type,
        temp_10cm,
        temp_surface,
        temp_air,
        blowing_snow,
        snow_depth,
        hst,
        h24
      FROM weather_station_data
      WHERE observation_id = ?
      ORDER BY sort_order, elevation DESC
    `).all(id) as StationData[];

    return {
      id: observation.id,
      date: observation.date,
      recorder: observation.recorder,
      temp_min: observation.temp_min,
      temp_max: observation.temp_max,
      stations,
      created_at: observation.created_at,
      updated_at: observation.updated_at,
    };
  }

  // 创建气象观测记录
  create(data: WeatherObservationInput): number {
    const db = getDatabase();

    const insertObservation = db.prepare(`
      INSERT INTO weather_observation_records (date, recorder, temp_min, temp_max)
      VALUES (?, ?, ?, ?)
    `);

    const result = insertObservation.run(
      data.date,
      data.recorder,
      data.temp_min,
      data.temp_max
    );

    const observationId = result.lastInsertRowid as number;

    // 插入站点数据
    if (data.stations && data.stations.length > 0) {
      const insertStation = db.prepare(`
        INSERT INTO weather_station_data (
          observation_id, name, elevation, observation_time, cloud_cover, precipitation,
          wind_direction, wind_speed, grain_size, surface_snow_type,
          temp_10cm, temp_surface, temp_air, blowing_snow, snow_depth, hst, h24, sort_order
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      data.stations.forEach((station, index) => {
        insertStation.run(
          observationId,
          station.name,
          station.elevation,
          station.time,
          station.cloud_cover,
          station.precipitation,
          station.wind_direction,
          station.wind_speed,
          station.grain_size,
          station.surface_snow_type,
          station.temp_10cm,
          station.temp_surface,
          station.temp_air,
          station.blowing_snow,
          station.snow_depth,
          station.hst || null,
          station.h24 || null,
          index
        );
      });
    }

    return observationId;
  }

  // 更新气象观测记录
  update(id: number, data: WeatherObservationInput): boolean {
    const db = getDatabase();

    // 检查记录是否存在
    const existing = db.prepare('SELECT id FROM weather_observation_records WHERE id = ?').get(id);
    if (!existing) return false;

    // 更新主记录
    db.prepare(`
      UPDATE weather_observation_records
      SET date = ?, recorder = ?, temp_min = ?, temp_max = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(data.date, data.recorder, data.temp_min, data.temp_max, id);

    // 删除旧的站点数据
    db.prepare('DELETE FROM weather_station_data WHERE observation_id = ?').run(id);

    // 插入新的站点数据
    if (data.stations && data.stations.length > 0) {
      const insertStation = db.prepare(`
        INSERT INTO weather_station_data (
          observation_id, name, elevation, observation_time, cloud_cover, precipitation,
          wind_direction, wind_speed, grain_size, surface_snow_type,
          temp_10cm, temp_surface, temp_air, blowing_snow, snow_depth, hst, h24, sort_order
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      data.stations.forEach((station, index) => {
        insertStation.run(
          id,
          station.name,
          station.elevation,
          station.time,
          station.cloud_cover,
          station.precipitation,
          station.wind_direction,
          station.wind_speed,
          station.grain_size,
          station.surface_snow_type,
          station.temp_10cm,
          station.temp_surface,
          station.temp_air,
          station.blowing_snow,
          station.snow_depth,
          station.hst || null,
          station.h24 || null,
          index
        );
      });
    }

    return true;
  }

  // 删除气象观测记录
  delete(id: number): boolean {
    const db = getDatabase();
    const result = db.prepare('DELETE FROM weather_observation_records WHERE id = ?').run(id);
    return result.changes > 0;
  }

  // 获取趋势数据（最近N天所有观测含站点详情）
  getTrends(params: { days?: number; station?: string } = {}) {
    const db = getDatabase();
    const days = params.days || 15;

    // 获取最近 N 天有数据的观测记录
    const observations = db.prepare(`
      SELECT * FROM weather_observation_records
      WHERE date >= date('now', '-' || ? || ' days')
      ORDER BY date ASC, id ASC
    `).all(days) as any[];

    if (observations.length === 0) {
      return { records: [], stations: [] };
    }

    const ids = observations.map((o: any) => o.id);
    const placeholders = ids.map(() => '?').join(',');

    let stationQuery = `
      SELECT
        id, observation_id, name, elevation,
        observation_time as time, cloud_cover, precipitation,
        wind_direction, wind_speed, grain_size, surface_snow_type,
        temp_10cm, temp_surface, temp_air, blowing_snow,
        snow_depth, hst, h24
      FROM weather_station_data
      WHERE observation_id IN (${placeholders})
    `;
    const queryParams: any[] = [...ids];

    if (params.station) {
      stationQuery += ' AND name = ?';
      queryParams.push(params.station);
    }

    stationQuery += ' ORDER BY sort_order, elevation DESC';

    const allStations = db.prepare(stationQuery).all(...queryParams) as (StationData & { observation_id: number })[];

    // 获取所有站点名列表（去重）
    const stationNames = [...new Set(allStations.map(s => s.name))];

    // 组装为 records
    const records = observations.map((obs: any) => ({
      id: obs.id,
      date: obs.date,
      recorder: obs.recorder,
      temp_min: obs.temp_min,
      temp_max: obs.temp_max,
      stations: allStations
        .filter(s => s.observation_id === obs.id)
        .map(({ observation_id, ...rest }) => rest),
    }));

    return { records, stations: stationNames };
  }
}

export const weatherService = new WeatherService();
