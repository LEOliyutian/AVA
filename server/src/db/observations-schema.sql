-- 雪层观测记录表 (Snow Profile Observations)
CREATE TABLE IF NOT EXISTS observations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  record_id VARCHAR(100),
  location_description TEXT,
  observer VARCHAR(100),
  observation_date DATE,
  gps_coordinates VARCHAR(100),
  elevation VARCHAR(50),
  slope_aspect VARCHAR(20),
  slope_angle VARCHAR(20),
  total_snow_depth VARCHAR(50),
  air_temperature VARCHAR(20),
  weather VARCHAR(100),
  boot_penetration VARCHAR(50),
  wind VARCHAR(100),
  blowing_snow VARCHAR(100),
  conclusion TEXT,
  diagram_x_axis_side VARCHAR(10) DEFAULT 'left',
  diagram_y_axis_direction VARCHAR(10) DEFAULT 'down',
  created_by INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS idx_observations_date ON observations(observation_date DESC);
CREATE INDEX IF NOT EXISTS idx_observations_created_by ON observations(created_by);

-- 雪层数据表 (Snow Profile Layers)
CREATE TABLE IF NOT EXISTS snow_layers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  observation_id INTEGER NOT NULL,
  start_depth REAL,
  end_depth REAL,
  temperature VARCHAR(20),
  hardness VARCHAR(10),
  crystal_type VARCHAR(10),
  grain_size VARCHAR(20),
  wetness VARCHAR(10),
  notes TEXT,
  hardness_top REAL,
  hardness_bottom REAL,
  sort_order INTEGER DEFAULT 0,
  FOREIGN KEY (observation_id) REFERENCES observations(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_snow_layers_observation ON snow_layers(observation_id);

-- 温度剖面表 (Temperature Profile Points)
CREATE TABLE IF NOT EXISTS temperature_points (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  observation_id INTEGER NOT NULL,
  depth REAL,
  temperature REAL,
  sort_order INTEGER DEFAULT 0,
  FOREIGN KEY (observation_id) REFERENCES observations(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_temperature_points_observation ON temperature_points(observation_id);

-- 稳定性测试组表 (Stability Test Groups)
CREATE TABLE IF NOT EXISTS stability_test_groups (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  observation_id INTEGER NOT NULL,
  depth REAL,
  weak_layer_type VARCHAR(10),
  weak_layer_grain_size VARCHAR(20),
  notes TEXT,
  sort_order INTEGER DEFAULT 0,
  FOREIGN KEY (observation_id) REFERENCES observations(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_stability_groups_observation ON stability_test_groups(observation_id);

-- 稳定性测试表 (Stability Tests)
CREATE TABLE IF NOT EXISTS stability_tests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  group_id INTEGER NOT NULL,
  test_type VARCHAR(20),
  taps VARCHAR(20),
  result VARCHAR(20),
  quality VARCHAR(10),
  cut VARCHAR(20),
  length VARCHAR(20),
  propagation VARCHAR(10),
  score VARCHAR(20),
  notes TEXT,
  sort_order INTEGER DEFAULT 0,
  FOREIGN KEY (group_id) REFERENCES stability_test_groups(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_stability_tests_group ON stability_tests(group_id);

-- 观测照片表 (Observation Photos)
CREATE TABLE IF NOT EXISTS observation_photos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  observation_id INTEGER NOT NULL,
  name VARCHAR(255),
  file_path TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (observation_id) REFERENCES observations(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_observation_photos ON observation_photos(observation_id);
