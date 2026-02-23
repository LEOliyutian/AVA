import { Router } from 'express';
import multer from 'multer';
import os from 'os';
import { authenticate } from '../middleware/auth.middleware.js';
import * as avalancheEventService from '../services/avalanche-event.service.js';
import type { ApiResponse } from '../types/index.js';

const router = Router();
const upload = multer({ dest: os.tmpdir() });

// 获取雪崩事件列表
router.get('/', authenticate, async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const bbox = req.query.bbox as string | undefined;
    const start_date = req.query.start_date as string | undefined;
    const end_date = req.query.end_date as string | undefined;

    const result = avalancheEventService.getEvents({
      page,
      limit,
      bbox,
      start_date,
      end_date,
    });

    res.json({
      success: true,
      data: {
        events: result.events,
        pagination: {
          page: result.page,
          limit,
          total: result.total,
          totalPages: result.totalPages,
        },
      },
    } as ApiResponse);
  } catch (error) {
    console.error('获取雪崩事件列表失败:', error);
    res.status(500).json({
      success: false,
      error: '获取雪崩事件列表失败',
    } as ApiResponse);
  }
});

// 获取单个雪崩事件详情
router.get('/:id', authenticate, async (req, res) => {
  try {
    const id = parseInt(req.params.id as string);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: '无效的事件 ID',
      } as ApiResponse);
    }

    const event = avalancheEventService.getEventById(id);

    if (!event) {
      return res.status(404).json({
        success: false,
        error: '雪崩事件不存在',
      } as ApiResponse);
    }

    res.json({
      success: true,
      data: { event },
    } as ApiResponse);
  } catch (error) {
    console.error('获取雪崩事件详情失败:', error);
    res.status(500).json({
      success: false,
      error: '获取雪崩事件详情失败',
    } as ApiResponse);
  }
});

// 创建雪崩事件（支持图片上传）
router.post(
  '/',
  authenticate,
  (req, res, next) => {
    if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'forecaster')) {
      return res.status(403).json({
        success: false,
        error: '权限不足',
      } as ApiResponse);
    }
    next();
  },
  upload.array('photos', 10),
  async (req, res) => {
    try {
      // 从 FormData 中解析事件数据
      const eventData = JSON.parse(req.body.eventData || '{}');

      const result = avalancheEventService.createEvent({
        latitude: eventData.latitude,
        longitude: eventData.longitude,
        elevation: eventData.elevation,
        event_date: eventData.event_date,
        avalanche_type: eventData.avalanche_type,
        trigger: eventData.trigger,
        size: eventData.size,
        aspect: eventData.aspect,
        slope_angle: eventData.slope_angle,
        start_elevation: eventData.start_elevation,
        vertical_fall: eventData.vertical_fall,
        width: eventData.width,
        description: eventData.description,
        reported_by: eventData.reported_by,
      });

      // 保存上传的照片
      const files = req.files as Express.Multer.File[];
      if (files && files.length > 0) {
        avalancheEventService.addPhotos(
          result.id,
          files.map((f) => ({ path: f.path, originalname: f.originalname }))
        );
      }

      res.status(201).json({
        success: true,
        data: { id: result.id },
      } as ApiResponse);
    } catch (error) {
      console.error('创建雪崩事件失败:', error);
      res.status(500).json({
        success: false,
        error: '创建雪崩事件失败',
      } as ApiResponse);
    }
  }
);

// 更新雪崩事件
router.put(
  '/:id',
  authenticate,
  (req, res, next) => {
    if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'forecaster')) {
      return res.status(403).json({
        success: false,
        error: '权限不足',
      } as ApiResponse);
    }
    next();
  },
  async (req, res) => {
    try {
      const id = parseInt(req.params.id as string);

      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          error: '无效的事件 ID',
        } as ApiResponse);
      }

      const success = avalancheEventService.updateEvent(id, req.body);

      if (!success) {
        return res.status(404).json({
          success: false,
          error: '雪崩事件不存在',
        } as ApiResponse);
      }

      res.json({
        success: true,
        data: { id },
      } as ApiResponse);
    } catch (error) {
      console.error('更新雪崩事件失败:', error);
      res.status(500).json({
        success: false,
        error: '更新雪崩事件失败',
      } as ApiResponse);
    }
  }
);

// 删除雪崩事件
router.delete(
  '/:id',
  authenticate,
  (req, res, next) => {
    if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'forecaster')) {
      return res.status(403).json({
        success: false,
        error: '权限不足',
      } as ApiResponse);
    }
    next();
  },
  async (req, res) => {
    try {
      const id = parseInt(req.params.id as string);

      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          error: '无效的事件 ID',
        } as ApiResponse);
      }

      const success = avalancheEventService.deleteEvent(id);

      if (!success) {
        return res.status(404).json({
          success: false,
          error: '雪崩事件不存在',
        } as ApiResponse);
      }

      res.json({
        success: true,
      } as ApiResponse);
    } catch (error) {
      console.error('删除雪崩事件失败:', error);
      res.status(500).json({
        success: false,
        error: '删除雪崩事件失败',
      } as ApiResponse);
    }
  }
);

export default router;
