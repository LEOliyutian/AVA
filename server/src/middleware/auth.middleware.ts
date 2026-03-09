import type { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service.js';
import { getDatabase } from '../config/database.js';
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

    // 检查账号是否被禁用
    const db = getDatabase();
    const userRow = db.prepare('SELECT is_active FROM users WHERE id = ?').get(payload.userId) as { is_active: number | null } | undefined;
    if (userRow && userRow.is_active === 0) {
      res.status(403).json({
        success: false,
        error: '账号已被禁用，请联系管理员',
      });
      return;
    }

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
