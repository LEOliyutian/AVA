import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = path.resolve(__dirname, '../../data/avalanche.db');

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
}

export function closeDatabase(): void {
  if (db) {
    db.close();
    db = null;
  }
}
