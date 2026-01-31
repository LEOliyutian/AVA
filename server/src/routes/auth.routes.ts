import { Router, type Request, type Response } from 'express';
import { authService } from '../services/auth.service.js';
import { authenticate } from '../middleware/auth.middleware.js';
import type { LoginRequest, RegisterRequest } from '../types/index.js';

const router = Router();

// POST /api/auth/register - 用户注册
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { username, password, display_name, email } = req.body as RegisterRequest;

    // 验证必填字段
    if (!username || !password || !display_name) {
      res.status(400).json({
        success: false,
        error: '用户名、密码和显示名称为必填项',
      });
      return;
    }

    // 验证用户名格式
    if (!/^[a-zA-Z0-9_]{3,50}$/.test(username)) {
      res.status(400).json({
        success: false,
        error: '用户名只能包含字母、数字和下划线，长度 3-50 字符',
      });
      return;
    }

    // 验证密码长度
    if (password.length < 6) {
      res.status(400).json({
        success: false,
        error: '密码长度至少 6 个字符',
      });
      return;
    }

    const result = await authService.register(username, password, display_name, email);

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : '注册失败',
    });
  }
});

// POST /api/auth/login - 用户登录
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body as LoginRequest;

    if (!username || !password) {
      res.status(400).json({
        success: false,
        error: '用户名和密码为必填项',
      });
      return;
    }

    const result = await authService.login(username, password);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      error: error instanceof Error ? error.message : '登录失败',
    });
  }
});

// POST /api/auth/logout - 用户登出
router.post('/logout', authenticate, (_req: Request, res: Response) => {
  // JWT 无状态，客户端删除 token 即可
  // 如果需要服务端黑名单，可以在这里实现
  res.json({
    success: true,
    data: { message: '登出成功' },
  });
});

// GET /api/auth/me - 获取当前用户信息
router.get('/me', authenticate, (req: Request, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: '未登录',
      });
      return;
    }

    const user = authService.getSafeUserById(req.user.userId);

    if (!user) {
      res.status(404).json({
        success: false,
        error: '用户不存在',
      });
      return;
    }

    res.json({
      success: true,
      data: { user },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : '获取用户信息失败',
    });
  }
});

// POST /api/auth/refresh - 刷新 Token
router.post('/refresh', (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(400).json({
        success: false,
        error: '缺少刷新令牌',
      });
      return;
    }

    const tokens = authService.refreshToken(refreshToken);

    res.json({
      success: true,
      data: tokens,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      error: error instanceof Error ? error.message : '刷新令牌失败',
    });
  }
});

export default router;
