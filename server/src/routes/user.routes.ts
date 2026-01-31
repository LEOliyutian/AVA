import { Router, type Request, type Response } from 'express';
import { userService } from '../services/user.service.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { requireAdmin } from '../middleware/role.middleware.js';
import type { UserRole } from '../types/index.js';

const router = Router();

// GET /api/users - 获取用户列表（仅管理员）
router.get('/', authenticate, requireAdmin, (_req: Request, res: Response) => {
  try {
    const users = userService.getUsers();
    res.json({ success: true, data: { users } });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : '获取用户列表失败',
    });
  }
});

// GET /api/users/:id - 获取用户详情
router.get('/:id', authenticate, (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ success: false, error: '无效的用户 ID' });
      return;
    }

    // 非管理员只能查看自己
    if (req.user!.role !== 'admin' && req.user!.userId !== id) {
      res.status(403).json({ success: false, error: '无权访问' });
      return;
    }

    const user = userService.getUserById(id);
    if (!user) {
      res.status(404).json({ success: false, error: '用户不存在' });
      return;
    }

    res.json({ success: true, data: { user } });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : '获取用户信息失败',
    });
  }
});

// PUT /api/users/:id/role - 修改用户角色（仅管理员）
router.put('/:id/role', authenticate, requireAdmin, (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { role } = req.body as { role: UserRole };

    if (isNaN(id)) {
      res.status(400).json({ success: false, error: '无效的用户 ID' });
      return;
    }

    if (!['admin', 'forecaster', 'visitor'].includes(role)) {
      res.status(400).json({ success: false, error: '无效的角色' });
      return;
    }

    const updated = userService.updateUserRole(id, role);
    if (!updated) {
      res.status(404).json({ success: false, error: '用户不存在' });
      return;
    }

    res.json({ success: true, data: { message: '角色更新成功' } });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : '更新角色失败',
    });
  }
});

// PUT /api/users/:id - 更新用户信息
router.put('/:id', authenticate, (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ success: false, error: '无效的用户 ID' });
      return;
    }

    // 非管理员只能编辑自己
    if (req.user!.role !== 'admin' && req.user!.userId !== id) {
      res.status(403).json({ success: false, error: '无权编辑' });
      return;
    }

    const { display_name, email } = req.body;
    userService.updateUser(id, { display_name, email });

    res.json({ success: true, data: { message: '更新成功' } });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : '更新失败',
    });
  }
});

// POST /api/users/:id/change-password - 修改密码
router.post('/:id/change-password', authenticate, async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ success: false, error: '无效的用户 ID' });
      return;
    }

    // 只能修改自己的密码
    if (req.user!.userId !== id) {
      res.status(403).json({ success: false, error: '只能修改自己的密码' });
      return;
    }

    const { old_password, new_password } = req.body;
    if (!old_password || !new_password) {
      res.status(400).json({ success: false, error: '请提供原密码和新密码' });
      return;
    }

    await userService.changePassword(id, old_password, new_password);
    res.json({ success: true, data: { message: '密码修改成功' } });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : '修改密码失败',
    });
  }
});

// POST /api/users/:id/reset-password - 重置密码（仅管理员）
router.post('/:id/reset-password', authenticate, requireAdmin, async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { new_password } = req.body;

    if (isNaN(id)) {
      res.status(400).json({ success: false, error: '无效的用户 ID' });
      return;
    }

    if (!new_password || new_password.length < 6) {
      res.status(400).json({ success: false, error: '新密码长度至少6位' });
      return;
    }

    await userService.resetPassword(id, new_password);
    res.json({ success: true, data: { message: '密码重置成功' } });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : '重置密码失败',
    });
  }
});

// DELETE /api/users/:id - 删除用户（仅管理员）
router.delete('/:id', authenticate, requireAdmin, (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ success: false, error: '无效的用户 ID' });
      return;
    }

    userService.deleteUser(id);
    res.json({ success: true, data: { message: '用户已删除' } });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : '删除用户失败',
    });
  }
});

export default router;
