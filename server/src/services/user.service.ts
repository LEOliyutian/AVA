import bcrypt from 'bcrypt';
import { getDatabase } from '../config/database.js';
import { config } from '../config/index.js';
import type { User, SafeUser, UserRole } from '../types/index.js';

export interface CreateUserData {
  username: string;
  password: string;
  display_name: string;
  role: UserRole;
  email?: string;
}

export class UserService {
  // 获取所有用户列表（支持分页 + 角色 + 关键词筛选）
  getUsers(opts: { page?: number; limit?: number; role?: string; keyword?: string } = {}): { data: SafeUser[]; total: number } {
    const db = getDatabase();
    const { page = 1, limit = 20, role, keyword } = opts;
    const offset = (page - 1) * limit;

    const conditions: string[] = [];
    const params: (string | number)[] = [];

    if (role) {
      conditions.push('role = ?');
      params.push(role);
    }
    if (keyword) {
      conditions.push('(username LIKE ? OR display_name LIKE ?)');
      params.push(`%${keyword}%`, `%${keyword}%`);
    }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const total = (db.prepare(`SELECT COUNT(*) as count FROM users ${where}`).get(...params) as { count: number }).count;
    const data = db.prepare(`
      SELECT id, username, display_name, role, email, is_active, created_at, last_login
      FROM users ${where}
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `).all(...params, limit, offset) as SafeUser[];

    return { data, total };
  }

  // 获取用户详情
  getUserById(id: number): SafeUser | null {
    const db = getDatabase();
    const user = db.prepare(`
      SELECT id, username, display_name, role, email, is_active, created_at, last_login
      FROM users WHERE id = ?
    `).get(id) as SafeUser | undefined;
    return user || null;
  }

  // 管理员创建用户
  async createUser(data: CreateUserData): Promise<number> {
    const db = getDatabase();
    const existing = db.prepare('SELECT id FROM users WHERE username = ?').get(data.username);
    if (existing) throw new Error('用户名已存在');

    const hash = await bcrypt.hash(data.password, config.bcrypt.saltRounds);
    const result = db.prepare(`
      INSERT INTO users (username, password_hash, display_name, role, email, is_active)
      VALUES (?, ?, ?, ?, ?, 1)
    `).run(data.username, hash, data.display_name, data.role, data.email || null);
    return result.lastInsertRowid as number;
  }

  // 设置账号启用 / 禁用状态
  setUserActive(id: number, isActive: boolean): boolean {
    const db = getDatabase();
    const result = db.prepare(`
      UPDATE users SET is_active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?
    `).run(isActive ? 1 : 0, id);
    return result.changes > 0;
  }

  // 获取某用户操作历史（从 audit_logs 聚合，最近 100 条）
  getUserActivity(id: number): unknown[] {
    const db = getDatabase();
    return db.prepare(`
      SELECT id, action, target_type, target_id, detail, ip_address, created_at
      FROM audit_logs
      WHERE user_id = ?
      ORDER BY created_at DESC
      LIMIT 100
    `).all(id);
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
