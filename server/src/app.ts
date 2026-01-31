import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config/index.js';

import authRoutes from './routes/auth.routes.js';
import forecastRoutes from './routes/forecast.routes.js';
import userRoutes from './routes/user.routes.js';
import observationRoutes from './routes/observation.routes.js';

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
