import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from './config/index.js';

import authRoutes from './routes/auth.routes.js';
import forecastRoutes from './routes/forecast.routes.js';
import userRoutes from './routes/user.routes.js';
import observationRoutes from './routes/observation.routes.js';
import weatherRoutes from './routes/weather.routes.js';
import avalancheEventRoutes from './routes/avalanche-event.routes.js';
import adminRoutes from './routes/admin.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// 中间件
app.use(helmet());
app.use(cors({
  origin: config.cors.origin,
  credentials: config.cors.credentials,
}));
app.use(express.json());

// API 路由
app.use('/api/auth', authRoutes);
app.use('/api/forecasts', forecastRoutes);
app.use('/api/users', userRoutes);
app.use('/api/observations', observationRoutes);
app.use('/api/weather-observations', weatherRoutes);
app.use('/api/avalanche-events', avalancheEventRoutes);
app.use('/api/admin', adminRoutes);

// 静态文件服务：上传的照片
app.use('/uploads', express.static(path.resolve(__dirname, '../data/uploads')));

// 健康检查
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 处理
app.use((_req, res) => {
  res.status(404).json({ success: false, error: 'Not Found' });
});

// 错误处理
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Server Error:', err);
  res.status(500).json({ success: false, error: '服务器内部错误' });
});

export default app;
