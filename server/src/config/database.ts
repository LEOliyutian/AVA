import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = path.resolve(__dirname, '../../data/avalanche.db');
const ADMIN_SCHEMA_PATH = path.resolve(__dirname, '../db/admin-schema.sql');

let db: Database.Database | null = null;

export function getDatabase(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    runMigrations(db);
  }
  return db;
}

function runMigrations(database: Database.Database): void {
  // 为 weather_station_data 添加 hin、foot_penetration 字段
  const columns = database.prepare("PRAGMA table_info(weather_station_data)").all() as { name: string }[];
  const names = columns.map(c => c.name);
  if (columns.length > 0) {
    if (!names.includes('hin')) {
      database.exec('ALTER TABLE weather_station_data ADD COLUMN hin REAL');
    }
    if (!names.includes('foot_penetration')) {
      database.exec('ALTER TABLE weather_station_data ADD COLUMN foot_penetration REAL');
    }
  }

  // 审计日志 & 系统配置表
  if (fs.existsSync(ADMIN_SCHEMA_PATH)) {
    const adminSchema = fs.readFileSync(ADMIN_SCHEMA_PATH, 'utf-8');
    database.exec(adminSchema);
  }

  // forecasts 表新增审核字段
  const forecastCols = database.prepare("PRAGMA table_info(forecasts)").all() as { name: string }[];
  const forecastColNames = forecastCols.map(c => c.name);
  if (!forecastColNames.includes('reviewer_id')) {
    database.exec('ALTER TABLE forecasts ADD COLUMN reviewer_id INTEGER REFERENCES users(id)');
  }
  if (!forecastColNames.includes('reviewed_at')) {
    database.exec('ALTER TABLE forecasts ADD COLUMN reviewed_at DATETIME');
  }
  if (!forecastColNames.includes('reject_reason')) {
    database.exec('ALTER TABLE forecasts ADD COLUMN reject_reason TEXT');
  }

  // users 表新增 is_active 字段
  const userCols = database.prepare("PRAGMA table_info(users)").all() as { name: string }[];
  const userColNames = userCols.map(c => c.name);
  if (!userColNames.includes('is_active')) {
    database.exec('ALTER TABLE users ADD COLUMN is_active BOOLEAN DEFAULT TRUE');
  }

  // 初始化系统配置默认值
  const settingsCount = database.prepare("SELECT COUNT(*) as count FROM system_settings").get() as { count: number };
  if (settingsCount.count === 0) {
    const insertSetting = database.prepare(`
      INSERT INTO system_settings (key, value, type, label, description)
      VALUES (?, ?, ?, ?, ?)
    `);
    const defaults: [string, string, string, string, string][] = [
      ['resort_name', '吉克普林滑雪场', 'string', '滑雪场名称', '显示在预报报告顶部的名称'],
      ['resort_contact', '', 'string', '联系电话', '对外展示的联系方式'],
      ['forecast_validity_hours', '24', 'number', '预报有效时长（小时）', '预报发布后的有效期'],
      ['allow_visitor_register', 'true', 'boolean', '允许游客自主注册', '关闭后仅管理员可创建账号'],
      ['review_required', 'false', 'boolean', '启用预报审核流程', '开启后预报员提交须经管理员审核方可发布'],
    ];
    for (const row of defaults) {
      insertSetting.run(...row);
    }
  }
}

export function closeDatabase(): void {
  if (db) {
    db.close();
    db = null;
  }
}
