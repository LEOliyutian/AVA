import { Router, Request, Response } from 'express';
import { weatherService } from '../services/weather.service.js';

const router = Router();

// 获取趋势数据
router.get('/trends', (req: Request, res: Response) => {
  try {
    const days = parseInt(req.query.days as string) || 15;
    const station = req.query.station as string | undefined;

    const result = weatherService.getTrends({ days, station });
    res.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error('获取趋势数据失败:', error);
    res.status(500).json({
      success: false,
      error: '获取趋势数据失败',
    });
  }
});

// 获取气象观测列表
router.get('/', (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const result = weatherService.getList({ page, limit });
    res.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error('获取气象观测列表失败:', error);
    res.status(500).json({
      success: false,
      error: '获取气象观测列表失败',
    });
  }
});

// 获取单个气象观测详情
router.get('/:id', (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const observation = weatherService.getById(id);

    if (!observation) {
      res.status(404).json({
        success: false,
        error: '气象观测记录不存在',
      });
      return;
    }

    res.json({
      success: true,
      data: { observation },
    });
  } catch (error: any) {
    console.error('获取气象观测详情失败:', error);
    res.status(500).json({
      success: false,
      error: '获取气象观测详情失败',
    });
  }
});

// 创建气象观测记录
router.post('/', (req: Request, res: Response) => {
  try {
    const id = weatherService.create(req.body);
    res.status(201).json({
      success: true,
      data: { id },
    });
  } catch (error: any) {
    console.error('创建气象观测记录失败:', error);
    res.status(500).json({
      success: false,
      error: '创建气象观测记录失败',
    });
  }
});

// 更新气象观测记录
router.put('/:id', (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const success = weatherService.update(id, req.body);

    if (!success) {
      res.status(404).json({
        success: false,
        error: '气象观测记录不存在',
      });
      return;
    }

    res.json({
      success: true,
      data: { id },
    });
  } catch (error: any) {
    console.error('更新气象观测记录失败:', error);
    res.status(500).json({
      success: false,
      error: '更新气象观测记录失败',
    });
  }
});

// 删除气象观测记录
router.delete('/:id', (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const success = weatherService.delete(id);

    if (!success) {
      res.status(404).json({
        success: false,
        error: '气象观测记录不存在',
      });
      return;
    }

    res.json({
      success: true,
    });
  } catch (error: any) {
    console.error('删除气象观测记录失败:', error);
    res.status(500).json({
      success: false,
      error: '删除气象观测记录失败',
    });
  }
});

export default router;
