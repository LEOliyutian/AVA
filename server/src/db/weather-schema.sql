-- 独立气象观测记录表 (Independent Weather Observations)
CREATE TABLE IF NOT EXISTS weather_observation_records (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  date DATE NOT NULL,
  recorder VARCHAR(100),
  temp_min REAL,
  temp_max REAL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_weather_observation_records_date ON weather_observation_records(date DESC);

-- 气象观测站点数据表 (Weather Station Data)
CREATE TABLE IF NOT EXISTS weather_station_data (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  observation_id INTEGER NOT NULL,
  name VARCHAR(100),
  elevation INTEGER,
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
  sort_order INTEGER DEFAULT 0,
  FOREIGN KEY (observation_id) REFERENCES weather_observation_records(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_weather_station_data_observation ON weather_station_data(observation_id);
