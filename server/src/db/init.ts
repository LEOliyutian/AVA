import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcrypt';
import Database from 'better-sqlite3';
import { config } from '../config/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.resolve(__dirname, '../../data');
const DB_PATH = path.resolve(DATA_DIR, 'avalanche.db');
const SCHEMA_PATH = path.resolve(__dirname, 'schema.sql');
const OBSERVATIONS_SCHEMA_PATH = path.resolve(__dirname, 'observations-schema.sql');

async function initDatabase() {
  console.log('初始化数据库...');

  // 确保 data 目录存在
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    console.log('创建数据目录:', DATA_DIR);
  }

  // 创建数据库连接
  const db = new Database(DB_PATH);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');

  // 执行 schema
  console.log('执行数据库 schema...');
  const schema = fs.readFileSync(SCHEMA_PATH, 'utf-8');
  db.exec(schema);

  // 执行 observations schema
  console.log('执行观测数据库 schema...');
  const observationsSchema = fs.readFileSync(OBSERVATIONS_SCHEMA_PATH, 'utf-8');
  db.exec(observationsSchema);

  // 检查是否已有管理员用户
  const existingAdmin = db.prepare('SELECT id FROM users WHERE username = ?').get('admin');

  if (!existingAdmin) {
    console.log('创建默认用户...');

    // 生成密码哈希
    const adminPasswordHash = await bcrypt.hash('admin123', config.bcrypt.saltRounds);
    const forecasterPasswordHash = await bcrypt.hash('forecaster123', config.bcrypt.saltRounds);

    // 插入默认用户
    const insertUser = db.prepare(`
      INSERT INTO users (username, password_hash, display_name, role, email)
      VALUES (?, ?, ?, ?, ?)
    `);

    insertUser.run('admin', adminPasswordHash, '系统管理员', 'admin', 'admin@example.com');
    insertUser.run('forecaster', forecasterPasswordHash, '预报员', 'forecaster', 'forecaster@example.com');

    console.log('默认用户创建成功:');
    console.log('  - admin / admin123 (管理员)');
    console.log('  - forecaster / forecaster123 (预报员)');
  } else {
    console.log('默认用户已存在，跳过创建');
  }

  db.close();
  console.log('数据库初始化完成!');
  console.log('数据库路径:', DB_PATH);
}

initDatabase().catch(console.error);
