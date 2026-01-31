import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { getDatabase } from '../config/database.js';
import { config } from '../config/index.js';
import type { User, SafeUser, JwtPayload, AuthResponse } from '../types/index.js';

export class AuthService {
  // 注册新用户
  async register(
    username: string,
    password: string,
    displayName: string,
    email?: string
  ): Promise<AuthResponse> {
    const db = getDatabase();

    // 检查用户名是否已存在
    const existing = db.prepare('SELECT id FROM users WHERE username = ?').get(username);
    if (existing) {
      throw new Error('用户名已存在');
    }

    // 生成密码哈希
    const passwordHash = await bcrypt.hash(password, config.bcrypt.saltRounds);

    // 插入新用户 (默认为访客角色)
    const result = db.prepare(`
      INSERT INTO users (username, password_hash, display_name, email, role)
      VALUES (?, ?, ?, ?, 'visitor')
    `).run(username, passwordHash, displayName, email || null);

    const userId = result.lastInsertRowid as number;

    // 获取用户信息
    const user = this.getUserById(userId);
    if (!user) {
      throw new Error('用户创建失败');
    }

    // 生成 token
    const { token, refreshToken } = this.generateTokens(user);

    return {
      user: this.toSafeUser(user),
      token,
      refreshToken,
    };
  }

  // 用户登录
  async login(username: string, password: string): Promise<AuthResponse> {
    const db = getDatabase();

    // 查找用户
    const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username) as User | undefined;
    if (!user) {
      throw new Error('用户名或密码错误');
    }

    // 验证密码
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      throw new Error('用户名或密码错误');
    }

    // 更新最后登录时间
    db.prepare('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?').run(user.id);

    // 生成 token
    const { token, refreshToken } = this.generateTokens(user);

    return {
      user: this.toSafeUser(user),
      token,
      refreshToken,
    };
  }

  // 刷新 token
  refreshToken(refreshToken: string): { token: string; refreshToken: string } {
    try {
      const payload = jwt.verify(refreshToken, config.jwt.refreshSecret) as JwtPayload;
      const user = this.getUserById(payload.userId);

      if (!user) {
        throw new Error('用户不存在');
      }

      return this.generateTokens(user);
    } catch {
      throw new Error('无效的刷新令牌');
    }
  }

  // 验证 token
  verifyToken(token: string): JwtPayload {
    try {
      return jwt.verify(token, config.jwt.secret) as JwtPayload;
    } catch {
      throw new Error('无效的访问令牌');
    }
  }

  // 获取用户信息
  getUserById(id: number): User | undefined {
    const db = getDatabase();
    return db.prepare('SELECT * FROM users WHERE id = ?').get(id) as User | undefined;
  }

  // 获取安全用户信息
  getSafeUserById(id: number): SafeUser | undefined {
    const user = this.getUserById(id);
    return user ? this.toSafeUser(user) : undefined;
  }

  // 生成 JWT token
  private generateTokens(user: User): { token: string; refreshToken: string } {
    const payload: JwtPayload = {
      userId: user.id,
      username: user.username,
      role: user.role,
    };

    const token = jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn,
    });

    const refreshToken = jwt.sign(payload, config.jwt.refreshSecret, {
      expiresIn: config.jwt.refreshExpiresIn,
    });

    return { token, refreshToken };
  }

  // 转换为安全用户对象（不含密码）
  private toSafeUser(user: User): SafeUser {
    return {
      id: user.id,
      username: user.username,
      display_name: user.display_name,
      role: user.role,
      email: user.email,
      created_at: user.created_at,
      last_login: user.last_login,
    };
  }
}

export const authService = new AuthService();
