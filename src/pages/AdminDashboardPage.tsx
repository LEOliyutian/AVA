import { useEffect, useState } from 'react';
import { adminApi, type AdminStats } from '../api/admin.api';
import './AdminDashboardPage.css';

const DANGER_COLORS = ['', '#5b9bd5', '#70ad47', '#ffc000', '#ff0000', '#c00000'];
const DANGER_LABELS = ['', '1-低', '2-中低', '3-中', '4-高', '5-极高'];

function StatCard({ label, value, sub }: { label: string; value: number | string; sub?: string }) {
  return (
    <div className="adp-stat-card">
      <div className="adp-stat-value">{value}</div>
      <div className="adp-stat-label">{label}</div>
      {sub && <div className="adp-stat-sub">{sub}</div>}
    </div>
  );
}

export function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminApi.getStats().then((res) => {
      if (res.success && res.data) {
        setStats(res.data);
      } else {
        setError(res.error || '获取数据失败');
      }
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="adp-loading">加载中...</div>;
  if (error) return <div className="adp-error">{error}</div>;
  if (!stats) return null;

  const { overview, charts } = stats;
  const totalUsers = overview.total_users.admin + overview.total_users.forecaster + overview.total_users.visitor;

  // 近 30 天折线图
  const maxDaily = Math.max(...charts.daily_forecasts.map((d) => d.count), 1);

  // 危险等级最大值
  const maxDanger = Math.max(...charts.danger_distribution.map((d) => d.count), 1);

  // 问题类型最大值
  const maxProblem = Math.max(...charts.problem_types.map((p) => p.count), 1);

  return (
    <div className="adp-container">
      <h1 className="adp-title">管理仪表板</h1>

      {/* 概览卡片 */}
      <section className="adp-section">
        <h2 className="adp-section-title">系统概览</h2>
        <div className="adp-stat-grid">
          <StatCard label="本月已发布预报" value={overview.published_this_month} />
          <StatCard label="当前草稿" value={overview.drafts} />
          <StatCard label="待审核" value={overview.pending_review} />
          <StatCard
            label="注册用户"
            value={totalUsers}
            sub={`管理员 ${overview.total_users.admin} · 预报员 ${overview.total_users.forecaster} · 访客 ${overview.total_users.visitor}`}
          />
          <StatCard label="本月观测记录" value={overview.observations_this_month} />
        </div>
      </section>

      <div className="adp-charts-grid">
        {/* 近 30 天预报发布趋势 */}
        <section className="adp-section adp-chart-box">
          <h2 className="adp-section-title">近 30 天预报发布趋势</h2>
          {charts.daily_forecasts.length === 0 ? (
            <div className="adp-empty">暂无数据</div>
          ) : (
            <div className="adp-bar-chart">
              {charts.daily_forecasts.map((d) => (
                <div key={d.date} className="adp-bar-item" title={`${d.date}: ${d.count} 条`}>
                  <div
                    className="adp-bar"
                    style={{ height: `${(d.count / maxDaily) * 100}%`, background: '#5b9bd5' }}
                  />
                  <div className="adp-bar-label">{d.date.slice(5)}</div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 危险等级分布 */}
        <section className="adp-section adp-chart-box">
          <h2 className="adp-section-title">危险等级分布（已发布）</h2>
          {charts.danger_distribution.length === 0 ? (
            <div className="adp-empty">暂无数据</div>
          ) : (
            <div className="adp-hbar-chart">
              {charts.danger_distribution.map((d) => (
                <div key={d.level} className="adp-hbar-item">
                  <div className="adp-hbar-label">{DANGER_LABELS[d.level] ?? `等级 ${d.level}`}</div>
                  <div className="adp-hbar-track">
                    <div
                      className="adp-hbar-fill"
                      style={{
                        width: `${(d.count / maxDanger) * 100}%`,
                        background: DANGER_COLORS[d.level] ?? '#888',
                      }}
                    />
                  </div>
                  <div className="adp-hbar-count">{d.count}</div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 活跃预报员排名 */}
        <section className="adp-section adp-chart-box">
          <h2 className="adp-section-title">近 30 天活跃预报员 Top 5</h2>
          {charts.top_forecasters.length === 0 ? (
            <div className="adp-empty">暂无数据</div>
          ) : (
            <div className="adp-rank-list">
              {charts.top_forecasters.map((f, i) => (
                <div key={f.name} className="adp-rank-item">
                  <span className={`adp-rank-no adp-rank-no--${i + 1}`}>{i + 1}</span>
                  <span className="adp-rank-name">{f.name}</span>
                  <span className="adp-rank-count">{f.count} 条</span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 雪崩问题类型分布 */}
        <section className="adp-section adp-chart-box">
          <h2 className="adp-section-title">雪崩问题类型分布</h2>
          {charts.problem_types.length === 0 ? (
            <div className="adp-empty">暂无数据</div>
          ) : (
            <div className="adp-hbar-chart">
              {charts.problem_types.map((p) => (
                <div key={p.type} className="adp-hbar-item">
                  <div className="adp-hbar-label">{p.type}</div>
                  <div className="adp-hbar-track">
                    <div
                      className="adp-hbar-fill"
                      style={{ width: `${(p.count / maxProblem) * 100}%`, background: '#70ad47' }}
                    />
                  </div>
                  <div className="adp-hbar-count">{p.count}</div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
