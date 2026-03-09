-- 审计日志表
CREATE TABLE IF NOT EXISTS audit_logs (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id     INTEGER NOT NULL,
  user_name   VARCHAR(100) NOT NULL,
  action      VARCHAR(50) NOT NULL,
  target_type VARCHAR(50),
  target_id   INTEGER,
  detail      TEXT,
  ip_address  VARCHAR(50),
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at DESC);

-- 系统配置表
CREATE TABLE IF NOT EXISTS system_settings (
  key         VARCHAR(100) PRIMARY KEY,
  value       TEXT NOT NULL,
  type        VARCHAR(20) NOT NULL DEFAULT 'string',
  label       VARCHAR(100) NOT NULL,
  description TEXT,
  updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_by  INTEGER REFERENCES users(id)
);
