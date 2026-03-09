import { Router, type Request, type Response } from 'express';
import { forecastService } from '../services/forecast.service.js';
import { authenticate, optionalAuth } from '../middleware/auth.middleware.js';
import { requireForecaster, requireAdmin } from '../middleware/role.middleware.js';
import { auditService } from '../services/audit.service.js';
import type { CreateForecastRequest, PaginationParams, ForecastStatus } from '../types/index.js';

const router = Router();

// GET /api/forecasts - 获取预报列表
router.get('/', optionalAuth, (req: Request, res: Response) => {
  try {
    const params: PaginationParams = {
      page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 10,
      status: req.query.status as ForecastStatus | undefined,
      startDate: req.query.startDate as string | undefined,
      endDate: req.query.endDate as string | undefined,
    };

    // 非管理员/预报员只能看到已发布的预报
    if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'forecaster')) {
      params.status = 'published';
    }

    const result = forecastService.getForecasts(params);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : '获取预报列表失败',
    });
  }
});

// GET /api/forecasts/latest - 获取最新发布的预报
router.get('/latest', (_req: Request, res: Response) => {
  try {
    const forecast = forecastService.getLatestPublishedForecast();

    if (!forecast) {
      res.status(404).json({
        success: false,
        error: '暂无发布的预报',
      });
      return;
    }

    res.json({
      success: true,
      data: { forecast },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : '获取最新预报失败',
    });
  }
});

// GET /api/forecasts/:id - 获取单个预报详情
router.get('/:id', optionalAuth, (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      res.status(400).json({
        success: false,
        error: '无效的预报 ID',
      });
      return;
    }

    const forecast = forecastService.getForecastById(id);

    if (!forecast) {
      res.status(404).json({
        success: false,
        error: '预报不存在',
      });
      return;
    }

    // 非管理员/预报员只能查看已发布的预报
    if (forecast.status !== 'published') {
      if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'forecaster')) {
        res.status(403).json({
          success: false,
          error: '无权访问此预报',
        });
        return;
      }
    }

    res.json({
      success: true,
      data: { forecast },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : '获取预报详情失败',
    });
  }
});

// POST /api/forecasts - 创建预报（需要预报员权限）
router.post('/', authenticate, requireForecaster, (req: Request, res: Response) => {
  try {
    const data = req.body as CreateForecastRequest;

    // 验证必填字段
    if (!data.forecast_date) {
      res.status(400).json({
        success: false,
        error: '预报日期为必填项',
      });
      return;
    }

    if (data.danger_alp === undefined || data.danger_tl === undefined || data.danger_btl === undefined) {
      res.status(400).json({
        success: false,
        error: '危险等级为必填项',
      });
      return;
    }

    const forecastId = forecastService.createForecast(data, req.user!.userId);

    auditService.write({
      userId: req.user!.userId,
      userName: req.user!.username,
      action: 'forecast.create',
      targetType: 'forecast',
      targetId: forecastId,
      detail: { forecast_date: data.forecast_date },
      ipAddress: req.ip,
    });

    res.status(201).json({
      success: true,
      data: { id: forecastId },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : '创建预报失败',
    });
  }
});

// PUT /api/forecasts/:id - 更新预报
router.put('/:id', authenticate, requireForecaster, (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      res.status(400).json({
        success: false,
        error: '无效的预报 ID',
      });
      return;
    }

    // 检查预报是否存在
    const forecast = forecastService.getForecastById(id);
    if (!forecast) {
      res.status(404).json({
        success: false,
        error: '预报不存在',
      });
      return;
    }

    // 非管理员只能编辑自己的预报
    if (req.user!.role !== 'admin' && forecast.forecaster_id !== req.user!.userId) {
      res.status(403).json({
        success: false,
        error: '无权编辑此预报',
      });
      return;
    }

    // pending_review 状态不允许编辑（等待审核中）
    if (forecast.status === 'pending_review' && req.user!.role !== 'admin') {
      res.status(409).json({
        success: false,
        error: '预报正在审核中，不可编辑',
      });
      return;
    }

    const data = req.body as Partial<CreateForecastRequest>;
    forecastService.updateForecast(id, data);

    res.json({
      success: true,
      data: { message: '更新成功' },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : '更新预报失败',
    });
  }
});

// DELETE /api/forecasts/:id - 删除预报（仅管理员）
router.delete('/:id', authenticate, requireAdmin, (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      res.status(400).json({
        success: false,
        error: '无效的预报 ID',
      });
      return;
    }

    const deleted = forecastService.deleteForecast(id);

    if (!deleted) {
      res.status(404).json({
        success: false,
        error: '预报不存在',
      });
      return;
    }

    auditService.write({
      userId: req.user!.userId,
      userName: req.user!.username,
      action: 'forecast.delete',
      targetType: 'forecast',
      targetId: id,
      ipAddress: req.ip,
    });

    res.json({
      success: true,
      data: { message: '删除成功' },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : '删除预报失败',
    });
  }
});

// POST /api/forecasts/:id/submit - 提交审核（forecaster）
router.post('/:id/submit', authenticate, requireForecaster, (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ success: false, error: '无效的预报 ID' });
      return;
    }

    const forecast = forecastService.getForecastById(id);
    if (!forecast) {
      res.status(404).json({ success: false, error: '预报不存在' });
      return;
    }

    if (req.user!.role !== 'admin' && forecast.forecaster_id !== req.user!.userId) {
      res.status(403).json({ success: false, error: '无权操作此预报' });
      return;
    }

    const ok = forecastService.submitForReview(id);
    if (!ok) {
      res.status(409).json({ success: false, error: '当前状态不允许提交审核（仅 draft 可提交）' });
      return;
    }

    auditService.write({
      userId: req.user!.userId,
      userName: req.user!.username,
      action: 'forecast.submit',
      targetType: 'forecast',
      targetId: id,
      ipAddress: req.ip,
    });

    res.json({ success: true, data: { message: '已提交审核' } });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : '提交审核失败',
    });
  }
});

// POST /api/forecasts/:id/resubmit - 驳回后重新提交（forecaster）
router.post('/:id/resubmit', authenticate, requireForecaster, (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ success: false, error: '无效的预报 ID' });
      return;
    }

    const forecast = forecastService.getForecastById(id);
    if (!forecast) {
      res.status(404).json({ success: false, error: '预报不存在' });
      return;
    }

    if (req.user!.role !== 'admin' && forecast.forecaster_id !== req.user!.userId) {
      res.status(403).json({ success: false, error: '无权操作此预报' });
      return;
    }

    const ok = forecastService.resubmitForReview(id);
    if (!ok) {
      res.status(409).json({ success: false, error: '当前状态不允许重新提交（仅 rejected 可重新提交）' });
      return;
    }

    auditService.write({
      userId: req.user!.userId,
      userName: req.user!.username,
      action: 'forecast.submit',
      targetType: 'forecast',
      targetId: id,
      detail: { resubmit: true },
      ipAddress: req.ip,
    });

    res.json({ success: true, data: { message: '已重新提交审核' } });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : '重新提交失败',
    });
  }
});

// POST /api/forecasts/:id/approve - 审核通过（admin）
router.post('/:id/approve', authenticate, requireAdmin, (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ success: false, error: '无效的预报 ID' });
      return;
    }

    const forecast = forecastService.getForecastById(id);
    if (!forecast) {
      res.status(404).json({ success: false, error: '预报不存在' });
      return;
    }

    const ok = forecastService.approveForecast(id, req.user!.userId);
    if (!ok) {
      res.status(409).json({ success: false, error: '当前状态不允许审核通过（仅 pending_review 可审核）' });
      return;
    }

    auditService.write({
      userId: req.user!.userId,
      userName: req.user!.username,
      action: 'forecast.approve',
      targetType: 'forecast',
      targetId: id,
      ipAddress: req.ip,
    });

    res.json({ success: true, data: { message: '审核通过，已发布' } });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : '审核通过失败',
    });
  }
});

// POST /api/forecasts/:id/reject - 审核驳回（admin）
router.post('/:id/reject', authenticate, requireAdmin, (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ success: false, error: '无效的预报 ID' });
      return;
    }

    const { reason } = req.body as { reason?: string };
    if (!reason || reason.trim().length < 10) {
      res.status(400).json({ success: false, error: '驳回原因不能少于 10 个字符' });
      return;
    }

    const forecast = forecastService.getForecastById(id);
    if (!forecast) {
      res.status(404).json({ success: false, error: '预报不存在' });
      return;
    }

    const ok = forecastService.rejectForecast(id, req.user!.userId, reason.trim());
    if (!ok) {
      res.status(409).json({ success: false, error: '当前状态不允许驳回（仅 pending_review 可驳回）' });
      return;
    }

    auditService.write({
      userId: req.user!.userId,
      userName: req.user!.username,
      action: 'forecast.reject',
      targetType: 'forecast',
      targetId: id,
      detail: { reason: reason.trim() },
      ipAddress: req.ip,
    });

    res.json({ success: true, data: { message: '已驳回' } });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : '驳回失败',
    });
  }
});

// POST /api/forecasts/:id/publish - 发布预报
router.post('/:id/publish', authenticate, requireForecaster, (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      res.status(400).json({
        success: false,
        error: '无效的预报 ID',
      });
      return;
    }

    // 检查预报是否存在
    const forecast = forecastService.getForecastById(id);
    if (!forecast) {
      res.status(404).json({
        success: false,
        error: '预报不存在',
      });
      return;
    }

    // 非管理员只能发布自己的预报
    if (req.user!.role !== 'admin' && forecast.forecaster_id !== req.user!.userId) {
      res.status(403).json({
        success: false,
        error: '无权发布此预报',
      });
      return;
    }

    forecastService.publishForecast(id);

    auditService.write({
      userId: req.user!.userId,
      userName: req.user!.username,
      action: 'forecast.publish',
      targetType: 'forecast',
      targetId: id,
      ipAddress: req.ip,
    });

    res.json({
      success: true,
      data: { message: '发布成功' },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : '发布预报失败',
    });
  }
});

export default router;
