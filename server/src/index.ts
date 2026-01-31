import app from './app.js';
import { config } from './config/index.js';
import { getDatabase, closeDatabase } from './config/database.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 确保数据库目录和文件存在
function ensureDatabase() {
  const dataDir = path.resolve(__dirname, '../data');
  const dbPath = path.resolve(dataDir, 'avalanche.db');

  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  if (!fs.existsSync(dbPath)) {
    console.log('数据库不存在，请先运行: npm run db:init');
    process.exit(1);
  }

  // 测试数据库连接
  try {
    const db = getDatabase();
    db.prepare('SELECT 1').get();
    console.log('数据库连接成功');
  } catch (error) {
    console.error('数据库连接失败:', error);
    process.exit(1);
  }
}

// 启动服务器
function startServer() {
  ensureDatabase();

  const server = app.listen(config.port, () => {
    console.log(`
========================================
  雪崩预报系统 API 服务器
========================================
  端口: ${config.port}
  环境: ${process.env.NODE_ENV || 'development'}
  API: http://localhost:${config.port}/api
========================================
    `);
  });

  // 优雅关闭
  const shutdown = () => {
    console.log('\n正在关闭服务器...');
    server.close(() => {
      closeDatabase();
      console.log('服务器已关闭');
      process.exit(0);
    });
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

startServer();
