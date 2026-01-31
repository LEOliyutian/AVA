export const config = {
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3001,
  jwt: {
    secret: process.env.JWT_SECRET || 'avalanche-forecast-secret-key-change-in-production',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'avalanche-forecast-refresh-secret-key-change-in-production',
    expiresIn: '24h',
    refreshExpiresIn: '7d',
  },
  cors: {
    // 开发环境允许多个端口
    origin: process.env.CORS_ORIGIN || [
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:5175',
      'http://localhost:5176',
    ],
    credentials: true,
  },
  bcrypt: {
    saltRounds: 12,
  },
};
