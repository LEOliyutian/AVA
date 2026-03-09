import { getDatabase } from '../config/database.js';

export interface AdminStats {
  overview: {
    published_this_month: number;
    drafts: number;
    pending_review: number;
    total_users: { admin: number; forecaster: number; visitor: number };
    observations_this_month: number;
  };
  charts: {
    daily_forecasts: { date: string; count: number }[];
    danger_distribution: { level: number; count: number }[];
    top_forecasters: { name: string; count: number }[];
    problem_types: { type: string; count: number }[];
  };
}

class AdminService {
  getStats(): AdminStats {
    const db = getDatabase();

    const thisMonthStart = new Date();
    thisMonthStart.setDate(1);
    thisMonthStart.setHours(0, 0, 0, 0);
    const monthStr = thisMonthStart.toISOString().slice(0, 10);

    // 概览
    const publishedThisMonth = (db.prepare(
      `SELECT COUNT(*) as count FROM forecasts WHERE status='published' AND published_at >= ?`
    ).get(monthStr) as { count: number }).count;

    const drafts = (db.prepare(
      `SELECT COUNT(*) as count FROM forecasts WHERE status='draft'`
    ).get() as { count: number }).count;

    const pendingReview = (db.prepare(
      `SELECT COUNT(*) as count FROM forecasts WHERE status='pending_review'`
    ).get() as { count: number }).count;

    const usersByRole = db.prepare(
      `SELECT role, COUNT(*) as count FROM users GROUP BY role`
    ).all() as { role: string; count: number }[];
    const roleMap: Record<string, number> = { admin: 0, forecaster: 0, visitor: 0 };
    for (const r of usersByRole) roleMap[r.role] = r.count;

    const observationsThisMonth = (db.prepare(
      `SELECT COUNT(*) as count FROM observations WHERE created_at >= ?`
    ).get(monthStr) as { count: number }).count;

    // 近 30 天每日预报发布数
    const dailyForecasts = db.prepare(`
      SELECT date(published_at) as date, COUNT(*) as count
      FROM forecasts
      WHERE status = 'published'
        AND published_at >= date('now', '-30 days')
      GROUP BY date(published_at)
      ORDER BY date ASC
    `).all() as { date: string; count: number }[];

    // 危险等级分布（取三个海拔的平均等级四舍五入）
    const dangerDist = db.prepare(`
      SELECT ROUND((danger_alp + danger_tl + danger_btl) / 3.0) as level, COUNT(*) as count
      FROM forecasts
      WHERE status = 'published'
      GROUP BY level
      ORDER BY level ASC
    `).all() as { level: number; count: number }[];

    // 近 30 天活跃预报员 Top 5
    const topForecasters = db.prepare(`
      SELECT u.display_name as name, COUNT(f.id) as count
      FROM forecasts f
      JOIN users u ON f.forecaster_id = u.id
      WHERE f.status = 'published'
        AND f.published_at >= date('now', '-30 days')
      GROUP BY f.forecaster_id
      ORDER BY count DESC
      LIMIT 5
    `).all() as { name: string; count: number }[];

    // 雪崩问题类型分布
    const problemTypes = db.prepare(`
      SELECT primary_type as type, COUNT(*) as count
      FROM forecasts
      WHERE primary_type IS NOT NULL AND status = 'published'
      GROUP BY primary_type
      ORDER BY count DESC
    `).all() as { type: string; count: number }[];

    return {
      overview: {
        published_this_month: publishedThisMonth,
        drafts,
        pending_review: pendingReview,
        total_users: {
          admin: roleMap['admin'],
          forecaster: roleMap['forecaster'],
          visitor: roleMap['visitor'],
        },
        observations_this_month: observationsThisMonth,
      },
      charts: {
        daily_forecasts: dailyForecasts,
        danger_distribution: dangerDist,
        top_forecasters: topForecasters,
        problem_types: problemTypes,
      },
    };
  }

  getSettings() {
    const db = getDatabase();
    return db.prepare('SELECT * FROM system_settings ORDER BY key').all();
  }

  updateSetting(key: string, value: string, updatedBy: number): boolean {
    const db = getDatabase();
    const result = db.prepare(`
      UPDATE system_settings
      SET value = ?, updated_at = CURRENT_TIMESTAMP, updated_by = ?
      WHERE key = ?
    `).run(value, updatedBy, key);
    return result.changes > 0;
  }
}

export const adminService = new AdminService();
