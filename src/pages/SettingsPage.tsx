import { useEffect, useState } from 'react';
import { adminApi, type SystemSetting } from '../api/admin.api';
import './SettingsPage.css';

function SettingRow({
  setting,
  onSave,
}: {
  setting: SystemSetting;
  onSave: (key: string, value: string) => Promise<string | null>;
}) {
  const [value, setValue] = useState(setting.value);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const dirty = value !== setting.value;

  const handleSave = async () => {
    setSaving(true);
    setError('');
    const err = await onSave(setting.key, value);
    setSaving(false);
    if (err) {
      setError(err);
    } else {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      // 同步 setting.value（避免再次判断 dirty 时误报）
      setting.value = value;
    }
  };

  const renderInput = () => {
    if (setting.type === 'boolean') {
      return (
        <label className="sp-toggle">
          <input
            type="checkbox"
            checked={value === 'true'}
            onChange={(e) => setValue(e.target.checked ? 'true' : 'false')}
          />
          <span className="sp-toggle-track" />
          <span className="sp-toggle-label">{value === 'true' ? '已开启' : '已关闭'}</span>
        </label>
      );
    }
    if (setting.type === 'number') {
      return (
        <input
          className="sp-input sp-input--sm"
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      );
    }
    return (
      <input
        className="sp-input"
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    );
  };

  return (
    <div className="sp-row">
      <div className="sp-row-meta">
        <div className="sp-row-label">{setting.label}</div>
        {setting.description && (
          <div className="sp-row-desc">{setting.description}</div>
        )}
        <div className="sp-row-key">{setting.key}</div>
      </div>
      <div className="sp-row-control">
        {renderInput()}
        <button
          className="sp-save-btn"
          onClick={handleSave}
          disabled={!dirty || saving}
        >
          {saving ? '保存中...' : saved ? '✓ 已保存' : '保存'}
        </button>
        {error && <span className="sp-row-error">{error}</span>}
      </div>
    </div>
  );
}

export function SettingsPage() {
  const [settings, setSettings] = useState<SystemSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    adminApi.getSettings().then((res) => {
      if (res.success && res.data) {
        setSettings(res.data.settings);
      } else {
        setError(res.error || '加载配置失败');
      }
      setLoading(false);
    });
  }, []);

  const handleSave = async (key: string, value: string): Promise<string | null> => {
    const res = await adminApi.updateSetting(key, value);
    return res.success ? null : (res.error || '保存失败');
  };

  return (
    <div className="sp-container">
      <h1 className="sp-title">系统配置</h1>
      <p className="sp-subtitle">修改后点击「保存」立即生效，无需重启服务。</p>

      {error && <div className="sp-error">{error}</div>}

      {loading ? (
        <div className="sp-loading">加载中...</div>
      ) : (
        <div className="sp-list">
          {settings.map((s) => (
            <SettingRow key={s.key} setting={s} onSave={handleSave} />
          ))}
        </div>
      )}
    </div>
  );
}
