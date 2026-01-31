-- 初始管理员账户
-- 密码: admin123 (使用 bcrypt 哈希)
-- 注意: 这个哈希值需要在初始化脚本中动态生成
INSERT OR IGNORE INTO users (username, password_hash, display_name, role, email)
VALUES ('admin', '$ADMIN_PASSWORD_HASH$', '系统管理员', 'admin', 'admin@example.com');

-- 创建示例预报员账户
INSERT OR IGNORE INTO users (username, password_hash, display_name, role, email)
VALUES ('forecaster', '$FORECASTER_PASSWORD_HASH$', '预报员', 'forecaster', 'forecaster@example.com');
