import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';
import * as observationService from '../services/observation.service.js';
import type { ApiResponse, ObservationDetail, CreateObservationRequest } from '../types/index.js';

const router = Router();

// 获取观测列表
router.get('/', authenticate, async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const myOnly = req.query.myOnly === 'true';

    const options: { page: number; limit: number; userId?: number } = { page, limit };

    // 如果只看自己的记录，或者不是管理员，只能看自己的
    if (myOnly || req.user!.role !== 'admin') {
      options.userId = req.user!.userId;
    }

    const result = observationService.getObservations(options);

    res.json({
      success: true,
      data: {
        observations: result.observations,
        pagination: {
          page: result.page,
          limit,
          total: result.total,
          totalPages: result.totalPages,
        },
      },
    } as ApiResponse);
  } catch (error) {
    console.error('获取观测列表失败:', error);
    res.status(500).json({
      success: false,
      error: '获取观测列表失败',
    } as ApiResponse);
  }
});

// 获取单个观测详情
router.get('/:id', authenticate, async (req, res) => {
  try {
    const id = parseInt(req.params.id as string);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: '无效的观测 ID',
      } as ApiResponse);
    }

    const observation = observationService.getObservationById(id);

    if (!observation) {
      return res.status(404).json({
        success: false,
        error: '观测记录不存在',
      } as ApiResponse);
    }

    // 检查权限
    if (
      req.user!.role !== 'admin' &&
      observation.created_by !== req.user!.userId
    ) {
      return res.status(403).json({
        success: false,
        error: '无权访问此观测记录',
      } as ApiResponse);
    }

    res.json({
      success: true,
      data: { observation },
    } as ApiResponse);
  } catch (error) {
    console.error('获取观测详情失败:', error);
    res.status(500).json({
      success: false,
      error: '获取观测详情失败',
    } as ApiResponse);
  }
});

// 创建观测记录
router.post('/', authenticate, (req, res, next) => {
  // 手动检查权限，避免中间件类型问题
  console.log('Permission check start:', { 
    hasUser: !!req.user, 
    userRole: req.user?.role,
    userId: req.user?.userId 
  });
  
  if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'forecaster')) {
    console.log('Permission check failed:', { 
      user: req.user,
      role: req.user?.role,
      hasUser: !!req.user 
    });
    return res.status(403).json({
      success: false,
      error: '权限不足',
    } as ApiResponse);
  }
  
  console.log('Permission check passed, proceeding...');
  next();
}, async (req, res) => {
  try {
    console.log('Creating observation with data:', req.body);
    console.log('User:', req.user);
    
    const data = req.body as CreateObservationRequest;
    console.log('Data type check:', {
      isObject: typeof data === 'object',
      hasKeys: data ? Object.keys(data) : 'data is null/undefined',
      userId: req.user!.userId
    });

    const result = observationService.createObservation(
      data as Partial<ObservationDetail>,
      req.user!.userId
    );

    console.log('Observation created successfully:', result);
    console.log('About to send response:', {
      success: true,
      data: { id: result.id }
    });

    const response = {
      success: true,
      data: { id: result.id },
    } as ApiResponse;
    
    res.status(201).json(response);
    console.log('Response sent successfully');
  } catch (error) {
    console.error('创建观测记录失败:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Not an Error object',
      stack: error instanceof Error ? error.stack : 'No stack'
    });
    
    const errorResponse = {
      success: false,
      error: '创建观测记录失败',
    } as ApiResponse;
    
    res.status(500).json(errorResponse);
    console.log('Error response sent');
  }
});

// 更新观测记录
router.put('/:id', authenticate, (req, res, next) => {
  // 手动检查权限，避免中间件类型问题
  if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'forecaster')) {
    return res.status(403).json({
      success: false,
      error: '权限不足',
    } as ApiResponse);
  }
  next();
}, async (req, res) => {
  try {
    const id = parseInt(req.params.id as string);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: '无效的观测 ID',
      } as ApiResponse);
    }

    // 检查权限
    const canAccess = observationService.canUserAccessObservation(
      id,
      req.user!.userId,
      req.user!.role
    );

    if (!canAccess) {
      return res.status(403).json({
        success: false,
        error: '无权修改此观测记录',
      } as ApiResponse);
    }

    const data = req.body as CreateObservationRequest;

    const success = observationService.updateObservation(
      id,
      data as Partial<ObservationDetail>,
      req.user!.userId
    );

    if (!success) {
      return res.status(404).json({
        success: false,
        error: '观测记录不存在',
      } as ApiResponse);
    }

    res.json({
      success: true,
      data: { id },
    } as ApiResponse);
  } catch (error) {
    console.error('更新观测记录失败:', error);
    res.status(500).json({
      success: false,
      error: '更新观测记录失败',
    } as ApiResponse);
  }
});

// 删除观测记录
router.delete('/:id', authenticate, (req, res, next) => {
  // 手动检查权限，避免中间件类型问题
  if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'forecaster')) {
    return res.status(403).json({
      success: false,
      error: '权限不足',
    } as ApiResponse);
  }
  next();
}, async (req, res) => {
  try {
    const id = parseInt(req.params.id as string);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: '无效的观测 ID',
      } as ApiResponse);
    }

    // 检查权限
    const canAccess = observationService.canUserAccessObservation(
      id,
      req.user!.userId,
      req.user!.role
    );

    if (!canAccess) {
      return res.status(403).json({
        success: false,
        error: '无权删除此观测记录',
      } as ApiResponse);
    }

    const success = observationService.deleteObservation(id);

    if (!success) {
      return res.status(404).json({
        success: false,
        error: '观测记录不存在',
      } as ApiResponse);
    }

    res.json({
      success: true,
    } as ApiResponse);
  } catch (error) {
    console.error('删除观测记录失败:', error);
    res.status(500).json({
      success: false,
      error: '删除观测记录失败',
    } as ApiResponse);
  }
});

export default router;
