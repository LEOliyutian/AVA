-- 雪崩事件表
CREATE TABLE IF NOT EXISTS avalanche_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  latitude REAL NOT NULL,
  longitude REAL NOT NULL,
  elevation REAL,
  event_date DATE NOT NULL,
  avalanche_type VARCHAR(20) NOT NULL,
  trigger_method VARCHAR(20) NOT NULL,
  size VARCHAR(10) NOT NULL,
  aspect VARCHAR(5),
  slope_angle REAL,
  start_elevation REAL,
  vertical_fall REAL,
  width REAL,
  description TEXT,
  reported_by VARCHAR(100) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 雪崩事件照片表
CREATE TABLE IF NOT EXISTS avalanche_event_photos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event_id INTEGER NOT NULL,
  file_path TEXT NOT NULL,
  original_name VARCHAR(255),
  sort_order INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (event_id) REFERENCES avalanche_events(id) ON DELETE CASCADE
);
