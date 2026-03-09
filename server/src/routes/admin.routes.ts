import { Router, type Request, type Response } from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { requireAdmin } from '../middleware/role.middleware.js';
import { auditService, type AuditAction } from '../services/audit.service.js';
import { adminService } from '../services/admin.service.js';

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
