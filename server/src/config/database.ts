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

  // 知识图片表（支持多图、草稿发布）
  database.exec(`
    CREATE TABLE IF NOT EXISTS knowledge_media (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      page_key     VARCHAR(50) NOT NULL,
      item_key     VARCHAR(50) NOT NULL,
      file_path    VARCHAR(200) NOT NULL,
      alt_text     VARCHAR(200),
      uploaded_by  INTEGER REFERENCES users(id),
      created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
      sort_order   INTEGER DEFAULT 0,
      is_published INTEGER DEFAULT 0
    )
  `);

  // 迁移旧表：移除 UNIQUE(page_key, item_key)，增加 sort_order / is_published
  const kmCols = database.prepare("PRAGMA table_info(knowledge_media)").all() as { name: string }[];
  if (kmCols.length > 0 && !kmCols.map(c => c.name).includes('sort_order')) {
    database.exec(`
      CREATE TABLE knowledge_media_new (
        id           INTEGER PRIMARY KEY AUTOINCREMENT,
        page_key     VARCHAR(50) NOT NULL,
        item_key     VARCHAR(50) NOT NULL,
        file_path    VARCHAR(200) NOT NULL,
        alt_text     VARCHAR(200),
        uploaded_by  INTEGER REFERENCES users(id),
        created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
        sort_order   INTEGER DEFAULT 0,
        is_published INTEGER DEFAULT 0
      )
    `);
    database.exec(`
      INSERT INTO knowledge_media_new
        (id, page_key, item_key, file_path, alt_text, uploaded_by, created_at, sort_order, is_published)
      SELECT id, page_key, item_key, file_path, alt_text, uploaded_by, created_at, 0, 1
      FROM knowledge_media
    `);
    database.exec('DROP TABLE knowledge_media');
    database.exec('ALTER TABLE knowledge_media_new RENAME TO knowledge_media');
  }

  // 知识本地补充说明表
  database.exec(`
    CREATE TABLE IF NOT EXISTS knowledge_notes (
      page_key    VARCHAR(50) PRIMARY KEY,
      content     TEXT NOT NULL DEFAULT '',
      updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_by  INTEGER REFERENCES users(id)
    )
  `);

  // 知识文字内容表（可覆盖硬编码默认值）
  database.exec(`
    CREATE TABLE IF NOT EXISTS knowledge_content (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      page_key   VARCHAR(50) NOT NULL,
      item_key   VARCHAR(50) NOT NULL,
      field_key  VARCHAR(50) NOT NULL,
      value      TEXT NOT NULL DEFAULT '',
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(page_key, item_key, field_key)
    )
  `);

  // knowledge_content / knowledge_notes 新增 is_published 字段
  const kcCols = database.prepare("PRAGMA table_info(knowledge_content)").all() as { name: string }[];
  if (kcCols.length > 0 && !kcCols.map(c => c.name).includes('is_published')) {
    database.exec('ALTER TABLE knowledge_content ADD COLUMN is_published INTEGER DEFAULT 0');
  }
  const knCols = database.prepare("PRAGMA table_info(knowledge_notes)").all() as { name: string }[];
  if (knCols.length > 0 && !knCols.map(c => c.name).includes('is_published')) {
    database.exec('ALTER TABLE knowledge_notes ADD COLUMN is_published INTEGER DEFAULT 0');
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
