import bcrypt from 'bcrypt';
import { getDatabase } from '../config/database.js';
import { config } from '../config/index.js';
import type { User, SafeUser, UserRole } from '../types/index.js';

export class UserService {
  // 获取所有用户列表
  getUsers(): SafeUser[] {
    const db = getDatabase();
    const users = db.prepare(`
      SELECT id, username, display_name, role, email, created_at, last_login
      FROM users
      ORDER BY created_at DESC
    `).all() as SafeUser[];
    return users;
  }

  // 获取用户详情
  getUserById(id: number): SafeUser | null {
    const db = getDatabase();
    const user = db.prepare(`
      SELECT id, username, display_name, role, email, created_at, last_login
      FROM users WHERE id = ?
    `).get(id) as SafeUser | undefined;
    return user || null;
  }

  // 更新用户角色
  updateUserRole(id: number, role: UserRole): boolean {
    const db = getDatabase();
    const result = db.prepare(`
      UPDATE users SET role = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?
    `).run(role, id);
    return result.changes > 0;
  }

  // 更新用户信息
  updateUser(id: number, data: { display_name?: string; email?: string }): boolean {
    const db = getDatabase();
    const updates: string[] = [];
    const params: (string | number)[] = [];

    if (data.display_name) {
      updates.push('display_name = ?');
      params.push(data.display_name);
    }
    if (data.email !== undefined) {
      updates.push('email = ?');
      params.push(data.email || '');
    }

    if (updates.length === 0) return false;

    updates.push('updated_at = CURRENT_TIMESTAMP');
    params.push(id);

    const result = db.prepare(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`).run(...params);
    return result.changes > 0;
  }

  // 修改密码
  async changePassword(id: number, oldPassword: string, newPassword: string): Promise<boolean> {
    const db = getDatabase();
    const user = db.prepare('SELECT password_hash FROM users WHERE id = ?').get(id) as { password_hash: string } | undefined;

    if (!user) return false;

    const isValid = await bcrypt.compare(oldPassword, user.password_hash);
    if (!isValid) {
      throw new Error('原密码错误');
    }

    const newHash = await bcrypt.hash(newPassword, config.bcrypt.saltRounds);
    const result = db.prepare(`
      UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?
    `).run(newHash, id);

    return result.changes > 0;
  }

  // 重置密码（管理员）
  async resetPassword(id: number, newPassword: string): Promise<boolean> {
    const db = getDatabase();
    const newHash = await bcrypt.hash(newPassword, config.bcrypt.saltRounds);
    const result = db.prepare(`
      UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?
    `).run(newHash, id);
    return result.changes > 0;
  }

  // 删除用户
  deleteUser(id: number): boolean {
    const db = getDatabase();
    // 不允许删除最后一个管理员
    const adminCount = db.prepare("SELECT COUNT(*) as count FROM users WHERE role = 'admin'").get() as { count: number };
    const user = db.prepare('SELECT role FROM users WHERE id = ?').get(id) as { role: UserRole } | undefined;

    if (user?.role === 'admin' && adminCount.count <= 1) {
      throw new Error('不能删除最后一个管理员');
    }

    const result = db.prepare('DELETE FROM users WHERE id = ?').run(id);
    return result.changes > 0;
  }
}

export const userService = new UserService();
