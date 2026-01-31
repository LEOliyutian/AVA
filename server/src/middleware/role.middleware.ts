import type { Request, Response, NextFunction } from 'express';
import type { UserRole } from '../types/index.js';

// 角色层级（数字越大权限越高）
const roleHierarchy: Record<UserRole, number> = {
  visitor: 1,
  forecaster: 2,
  admin: 3,
};

// 检查是否有指定角色权限
export function requireRole(...allowedRoles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: '需要登录',
      });
      return;
    }

    const userRole = req.user.role;

    if (!allowedRoles.includes(userRole)) {
      res.status(403).json({
        success: false,
        error: '权限不足',
      });
      return;
    }

    next();
  };
}

// 检查是否达到最低角色等级
export function requireMinRole(minRole: UserRole) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: '需要登录',
      });
      return;
    }

    const userLevel = roleHierarchy[req.user.role];
    const requiredLevel = roleHierarchy[minRole];

    if (userLevel < requiredLevel) {
      res.status(403).json({
        success: false,
        error: '权限不足',
      });
      return;
    }

    next();
  };
}

// 检查是否是管理员
export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  if (!req.user) {
    res.status(401).json({
      success: false,
      error: '需要登录',
    });
    return;
  }

  if (req.user.role !== 'admin') {
    res.status(403).json({
      success: false,
      error: '需要管理员权限',
    });
    return;
  }

  next();
}

// 检查是否是预报员或管理员
export function requireForecaster(req: Request, res: Response, next: NextFunction): void {
  if (!req.user) {
    res.status(401).json({
      success: false,
      error: '需要登录',
    });
    return;
  }

  if (req.user.role !== 'admin' && req.user.role !== 'forecaster') {
    res.status(403).json({
      success: false,
      error: '需要预报员权限',
    });
    return;
  }

  next();
}
