import { useEffect, useState } from 'react';
import { adminApi, type PendingForecast } from '../api/admin.api';
import { forecastApi } from '../api/forecast.api';
import './ReviewQueuePage.css';

const DANGER_COLORS: Record<number, string> = {
  1: '#5cb85c', 2: '#f0ad4e', 3: '#ff9800', 4: '#d9534f', 5: '#292b2c',
};
const DANGER_LABELS: Record<number, string> = {
  1: '1-低', 2: '2-中等', 3: '3-显著', 4: '4-高危', 5: '5-极端',
};

function maxDanger(f: PendingForecast) {
  return Math.max(f.danger_alp, f.danger_tl, f.danger_btl);
}

function formatTime(dt: string) {
  return dt.replace('T', ' ').slice(0, 16);
}

interface RejectModalProps {
  forecastId: number;
  onClose: () => void;
  onDone: () => void;
}

function RejectModal({ forecastId, onClose, onDone }: RejectModalProps) {
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const canSubmit = reason.trim().length >= 10;

  const handleReject = async () => {
    if (!canSubmit) return;
    setLoading(true);
    const res = await forecastApi.reject(forecastId, reason.trim());
    setLoading(false);
    if (res.success) {
      onDone();
    } else {
      setError(res.error || '驳回失败');
    }
  };

  return (
    <div className="rqp-modal-overlay" onClick={onClose}>
      <div className="rqp-modal" onClick={(e) => e.stopPropagation()}>
        <h3 className="rqp-modal-title">驳回预报</h3>
        <p className="rqp-modal-hint">请填写驳回原因，预报员将看到此说明（至少 10 字）</p>
        <textarea
          className="rqp-modal-textarea"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="请说明驳回原因，如：危险等级评估偏低，缺少风板雪崩问题说明..."
          rows={5}
          autoFocus
        />
        <div className="rqp-modal-counter">{reason.trim().length} 字</div>
        {error && <div className="rqp-modal-error">{error}</div>}
        <div className="rqp-modal-actions">
          <button className="rqp-btn rqp-btn--ghost" onClick={onClose} disabled={loading}>
            取消
          </button>
          <button
            className="rqp-btn rqp-btn--danger"
            onClick={handleReject}
            disabled={!canSubmit || loading}
          >
            {loading ? '提交中...' : '确认驳回'}
          </button>
        </div>
      </div>
    </div>
  );
}

export function ReviewQueuePage() {
  const [forecasts, setForecasts] = useState<PendingForecast[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [rejectTarget, setRejectTarget] = useState<number | null>(null);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [toast, setToast] = useState('');

  const load = async () => {
    setLoading(true);
    const res = await adminApi.getPendingForecasts();
    if (res.success && res.data) {
      setForecasts(res.data.forecasts);
    } else {
      setError(res.error || '加载失败');
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleApprove = async (id: number) => {
    if (!window.confirm('确认审核通过并发布？发布后对所有用户可见。')) return;
    setActionLoading(id);
    const res = await forecastApi.approve(id);
    setActionLoading(null);
    if (res.success) {
      showToast('已审核通过，预报已发布');
      load();
    } else {
      setError(res.error || '操作失败');
    }
  };

  const handleRejectDone = () => {
    setRejectTarget(null);
    showToast('已驳回，预报员将收到驳回原因');
    load();
  };

  return (
    <div className="rqp-container">
      <div className="rqp-header">
        <h1 className="rqp-title">预报审核队列</h1>
        <span className="rqp-count">{forecasts.length} 条待审核</span>
      </div>

      {error && <div className="rqp-error">{error}</div>}
      {toast && <div className="rqp-toast">{toast}</div>}

      {loading ? (
        <div className="rqp-empty">加载中...</div>
      ) : forecasts.length === 0 ? (
        <div className="rqp-empty">
          <div className="rqp-empty-icon">✓</div>
          <div>当前没有待审核的预报</div>
        </div>
      ) : (
        <div className="rqp-list">
          {forecasts.map((f) => {
            const level = maxDanger(f);
            return (
              <div key={f.id} className="rqp-card">
                <div className="rqp-card-main">
                  <div className="rqp-field">
                    <span className="rqp-field-label">预报日期</span>
                    <span className="rqp-field-value rqp-date">{f.forecast_date}</span>
                  </div>
                  <div className="rqp-field">
                    <span className="rqp-field-label">提交人</span>
                    <span className="rqp-field-value">{f.forecaster_name}</span>
                  </div>
                  <div className="rqp-field">
                    <span className="rqp-field-label">最高危险等级</span>
                    <span
                      className="rqp-danger-badge"
                      style={{ background: DANGER_COLORS[level] ?? '#888' }}
                    >
                      {DANGER_LABELS[level] ?? `等级 ${level}`}
                    </span>
                  </div>
                  <div className="rqp-field rqp-field--wide">
                    <span className="rqp-field-label">各海拔</span>
                    <span className="rqp-field-value rqp-bands">
                      <span>高山 {f.danger_alp}</span>
                      <span>树线 {f.danger_tl}</span>
                      <span>树线下 {f.danger_btl}</span>
                    </span>
                  </div>
                  <div className="rqp-field">
                    <span className="rqp-field-label">提交时间</span>
                    <span className="rqp-field-value rqp-time">{formatTime(f.created_at)}</span>
                  </div>
                </div>

                <div className="rqp-card-actions">
                  <a
                    href={`/forecast/${f.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rqp-btn rqp-btn--ghost"
                  >
                    查看详情
                  </a>
                  <button
                    className="rqp-btn rqp-btn--danger-ghost"
                    onClick={() => setRejectTarget(f.id)}
                    disabled={actionLoading === f.id}
                  >
                    驳回
                  </button>
                  <button
                    className="rqp-btn rqp-btn--primary"
                    onClick={() => handleApprove(f.id)}
                    disabled={actionLoading === f.id}
                  >
                    {actionLoading === f.id ? '处理中...' : '通过发布'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {rejectTarget !== null && (
        <RejectModal
          forecastId={rejectTarget}
          onClose={() => setRejectTarget(null)}
          onDone={handleRejectDone}
        />
      )}
    </div>
  );
}
