import type { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service.js';
import type { JwtPayload } from '../types/index.js';

// 扩展 Express Request 类型
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

// 验证 JWT token 中间件
export function authenticate(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      success: false,
      error: '未提供认证令牌',
    });
    return;
  }

  const token = authHeader.substring(7);

  try {
    const payload = authService.verifyToken(token);
    req.user = payload;
    next();
  } catch {
    res.status(401).json({
      success: false,
      error: '无效或过期的令牌',
    });
  }
}

// 可选认证中间件（不强制要求登录，但会解析 token）
export function optionalAuth(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);

    try {
      const payload = authService.verifyToken(token);
      req.user = payload;
    } catch {
      // 忽略无效 token，继续处理
    }
  }

  next();
}
