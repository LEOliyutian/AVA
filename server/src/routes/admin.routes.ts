import { Router, type Request, type Response } from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { requireAdmin } from '../middleware/role.middleware.js';
import { auditService, type AuditAction } from '../services/audit.service.js';
import { adminService } from '../services/admin.service.js';
import { forecastService } from '../services/forecast.service.js';
import { userService, type CreateUserData } from '../services/user.service.js';
import type { UserRole } from '../types/index.js';

const router = Router();

// 所有 /api/admin/* 路由均需登录且为 admin 角色
router.use(authenticate, requireAdmin);

// GET /api/admin/stats — 数据统计仪表板
router.get('/stats', (_req: Request, res: Response) => {
  try {
    const stats = adminService.getStats();
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : '获取统计数据失败',
    });
  }
});

// GET /api/admin/audit-logs — 操作审计日志
router.get('/audit-logs', (req: Request, res: Response) => {
  try {
    const result = auditService.getLogs({
      userId: req.query.userId ? parseInt(req.query.userId as string, 10) : undefined,
      action: req.query.action as AuditAction | undefined,
      targetType: req.query.targetType as string | undefined,
      startDate: req.query.startDate as string | undefined,
      endDate: req.query.endDate as string | undefined,
      page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 50,
    });
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : '获取审计日志失败',
    });
  }
});

// GET /api/admin/pending-forecasts — 待审核预报列表
router.get('/pending-forecasts', (_req: Request, res: Response) => {
  try {
    const forecasts = forecastService.getPendingForecasts();
    res.json({ success: true, data: { forecasts } });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : '获取待审核列表失败',
    });
  }
});

// GET /api/admin/users — 用户列表（分页 + 筛选）
router.get('/users', (req: Request, res: Response) => {
  try {
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 20;
    const role = req.query.role as string | undefined;
    const keyword = req.query.keyword as string | undefined;

    const result = userService.getUsers({ page, limit, role, keyword });
    const totalPages = Math.ceil(result.total / limit);

    res.json({
      success: true,
      data: {
        users: result.data,
        pagination: { page, limit, total: result.total, totalPages },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : '获取用户列表失败',
    });
  }
});

// POST /api/admin/users — 管理员创建用户
router.post('/users', async (req: Request, res: Response) => {
  try {
    const { username, password, display_name, role, email } = req.body as CreateUserData;

    if (!username || !password || !display_name || !role) {
      res.status(400).json({ success: false, error: '用户名、密码、显示名、角色为必填项' });
      return;
    }
    if (!['admin', 'forecaster', 'visitor'].includes(role)) {
      res.status(400).json({ success: false, error: '无效的角色' });
      return;
    }
    if (password.length < 6) {
      res.status(400).json({ success: false, error: '密码长度至少 6 位' });
      return;
    }

    const newUserId = await userService.createUser({ username, password, display_name, role: role as UserRole, email });

    auditService.write({
      userId: req.user!.userId,
      userName: req.user!.username,
      action: 'user.create',
      targetType: 'user',
      targetId: newUserId,
      detail: { username, display_name, role },
      ipAddress: req.ip,
    });

    res.status(201).json({ success: true, data: { id: newUserId, message: '用户创建成功' } });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : '创建用户失败',
    });
  }
});

// PUT /api/admin/users/:id/status — 禁用 / 启用账号
router.put('/users/:id/status', (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ success: false, error: '无效的用户 ID' });
      return;
    }

    const { is_active } = req.body as { is_active: boolean };
    if (typeof is_active !== 'boolean') {
      res.status(400).json({ success: false, error: 'is_active 必须为布尔值' });
      return;
    }

    // 不允许禁用自己
    if (id === req.user!.userId) {
      res.status(400).json({ success: false, error: '不能禁用自己的账号' });
      return;
    }

    const targetUser = userService.getUserById(id);
    if (!targetUser) {
      res.status(404).json({ success: false, error: '用户不存在' });
      return;
    }

    userService.setUserActive(id, is_active);

    auditService.write({
      userId: req.user!.userId,
      userName: req.user!.username,
      action: is_active ? 'user.enable' : 'user.disable',
      targetType: 'user',
      targetId: id,
      detail: { target_name: targetUser.display_name },
      ipAddress: req.ip,
    });

    res.json({ success: true, data: { message: is_active ? '账号已启用' : '账号已禁用' } });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : '更新账号状态失败',
    });
  }
});

// GET /api/admin/users/:id/activity — 用户操作历史
router.get('/users/:id/activity', (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ success: false, error: '无效的用户 ID' });
      return;
    }

    const activity = userService.getUserActivity(id);
    res.json({ success: true, data: { activity } });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : '获取用户活动失败',
    });
  }
});

// GET /api/admin/settings — 获取系统配置
router.get('/settings', (_req: Request, res: Response) => {
  try {
    const settings = adminService.getSettings();
    res.json({ success: true, data: { settings } });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : '获取配置失败',
    });
  }
});

// PUT /api/admin/settings/:key — 更新系统配置
router.put('/settings/:key', (req: Request, res: Response) => {
  try {
    const { key } = req.params;
    const { value } = req.body as { value: string };

    if (value === undefined || value === null) {
      res.status(400).json({ success: false, error: '缺少 value 参数' });
      return;
    }

    const updated = adminService.updateSetting(key, String(value), req.user!.userId);
    if (!updated) {
      res.status(404).json({ success: false, error: '配置项不存在' });
      return;
    }

    auditService.write({
      userId: req.user!.userId,
      userName: req.user!.username,
      action: 'settings.update',
      targetType: 'setting',
      detail: { key, value },
      ipAddress: req.ip,
    });

    res.json({ success: true, data: { message: '配置更新成功' } });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : '更新配置失败',
    });
  }
});

export default router;
