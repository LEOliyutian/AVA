import { getDatabase } from '../config/database.js';

export type AuditAction =
  | 'user.login'
  | 'user.logout'
  | 'user.create'
  | 'user.role_change'
  | 'user.delete'
  | 'user.password_reset'
  | 'user.disable'
  | 'user.enable'
  | 'forecast.create'
  | 'forecast.update'
  | 'forecast.submit'
  | 'forecast.approve'
  | 'forecast.reject'
  | 'forecast.publish'
  | 'forecast.archive'
  | 'forecast.delete'
  | 'observation.create'
  | 'observation.delete'
  | 'settings.update';

export interface AuditLogEntry {
  id: number;
  user_id: number;
  user_name: string;
  action: AuditAction;
  target_type: string | null;
  target_id: number | null;
  detail: string | null;
  ip_address: string | null;
  created_at: string;
}

export interface WriteAuditParams {
  userId: number;
  userName: string;
  action: AuditAction;
  targetType?: string;
  targetId?: number;
  detail?: Record<string, unknown>;
  ipAddress?: string;
}

export interface AuditLogQuery {
  userId?: number;
  action?: AuditAction;
  targetType?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

class AuditService {
  write(params: WriteAuditParams): void {
    try {
      const db = getDatabase();
      db.prepare(`
        INSERT INTO audit_logs (user_id, user_name, action, target_type, target_id, detail, ip_address)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(
        params.userId,
        params.userName,
        params.action,
        params.targetType ?? null,
        params.targetId ?? null,
        params.detail ? JSON.stringify(params.detail) : null,
        params.ipAddress ?? null,
      );
    } catch (err) {
      // 审计日志写入失败不应影响主流程
      console.error('[AuditService] write failed:', err);
    }
  }

  getLogs(query: AuditLogQuery) {
    const db = getDatabase();
    const page = query.page ?? 1;
    const limit = Math.min(query.limit ?? 50, 200);
    const offset = (page - 1) * limit;

    const conditions: string[] = [];
    const params: (string | number)[] = [];

    if (query.userId) {
      conditions.push('user_id = ?');
      params.push(query.userId);
    }
    if (query.action) {
      conditions.push('action = ?');
      params.push(query.action);
    }
    if (query.targetType) {
      conditions.push('target_type = ?');
      params.push(query.targetType);
    }
    if (query.startDate) {
      conditions.push('created_at >= ?');
      params.push(query.startDate);
    }
    if (query.endDate) {
      conditions.push('created_at <= ?');
      params.push(query.endDate + ' 23:59:59');
    }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const total = (db.prepare(`SELECT COUNT(*) as count FROM audit_logs ${where}`).get(...params) as { count: number }).count;
    const logs = db.prepare(`
      SELECT * FROM audit_logs ${where}
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `).all(...params, limit, offset) as AuditLogEntry[];

    return {
      data: logs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}

export const auditService = new AuditService();
