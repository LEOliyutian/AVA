-- 用户表
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  display_name VARCHAR(100) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'visitor', -- admin, forecaster, visitor
  email VARCHAR(100),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_login DATETIME
);

-- 预报表
CREATE TABLE IF NOT EXISTS forecasts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  forecast_date DATE NOT NULL,
  forecaster_id INTEGER NOT NULL,
  status VARCHAR(20) DEFAULT 'draft', -- draft, published, archived

  -- 危险等级
  danger_alp INTEGER NOT NULL,
  danger_tl INTEGER NOT NULL,
  danger_btl INTEGER NOT NULL,
  trend_alp VARCHAR(20),
  trend_tl VARCHAR(20),
  trend_btl VARCHAR(20),

  -- 主要雪崩问题
  primary_type VARCHAR(100),
  primary_likelihood INTEGER,
  primary_size INTEGER,
  primary_sectors TEXT, -- JSON array
  primary_description TEXT,

  -- 次要雪崩问题
  secondary_enabled BOOLEAN DEFAULT FALSE,
  secondary_type VARCHAR(100),
  secondary_likelihood INTEGER,
  secondary_size INTEGER,
  secondary_sectors TEXT, -- JSON array
  secondary_description TEXT,

  -- 观测和摘要
  snowpack_observation TEXT,
  activity_observation TEXT,
  summary TEXT,

  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  published_at DATETIME,

  FOREIGN KEY (forecaster_id) REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS idx_forecasts_date ON forecasts(forecast_date DESC);
CREATE INDEX IF NOT EXISTS idx_forecasts_status ON forecasts(status);
CREATE INDEX IF NOT EXISTS idx_forecasts_forecaster ON forecasts(forecaster_id);

-- 天气数据表
CREATE TABLE IF NOT EXISTS weather_data (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  forecast_id INTEGER NOT NULL UNIQUE,

  -- 天气摘要
  sky_condition VARCHAR(50),
  transport VARCHAR(50),
  temp_min REAL,
  temp_max REAL,
  wind_direction VARCHAR(20),
  wind_speed VARCHAR(50),
  hn24 REAL,
  hst REAL,
  hs REAL,

  FOREIGN KEY (forecast_id) REFERENCES forecasts(id) ON DELETE CASCADE
);

-- 气象观测表
CREATE TABLE IF NOT EXISTS weather_observations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  forecast_id INTEGER NOT NULL UNIQUE,
  observation_date VARCHAR(20),
  recorder VARCHAR(100),
  temp_min REAL,
  temp_max REAL,

  FOREIGN KEY (forecast_id) REFERENCES forecasts(id) ON DELETE CASCADE
);

-- 观测站点数据表
CREATE TABLE IF NOT EXISTS station_observations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  weather_observation_id INTEGER NOT NULL,
  station_type VARCHAR(20) NOT NULL, -- upper, lower
  elevation INTEGER NOT NULL,
  observation_time VARCHAR(10),
  cloud_cover VARCHAR(10),
  precipitation VARCHAR(50),
  wind_direction VARCHAR(10),
  wind_speed REAL,
  grain_size REAL,
  surface_snow_type VARCHAR(10),
  temp_10cm REAL,
  temp_surface REAL,
  temp_air REAL,
  blowing_snow VARCHAR(50),
  snow_depth REAL,
  hst REAL,
  h24 REAL,

  FOREIGN KEY (weather_observation_id) REFERENCES weather_observations(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_station_observations_weather ON station_observations(weather_observation_id);
