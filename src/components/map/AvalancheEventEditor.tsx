import { useState, useEffect, useCallback, useRef } from 'react';
import { useMapStore } from '../../store/map.store';
import { useAuthStore } from '../../store/auth.store';
import { formatCoordinates } from '../../utils/geo';
import {
  AVALANCHE_TYPE_OPTIONS,
  AVALANCHE_TRIGGER_OPTIONS,
  AVALANCHE_SIZE_OPTIONS,
  ASPECT_OPTIONS,
} from '../../types/avalanche-event';
import type {
  AvalancheType,
  AvalancheTrigger,
  AvalancheSize,
  AvalancheEvent,
} from '../../types/avalanche-event';
import './AvalancheEventEditor.css';

// 从 API URL 中提取服务器根地址（去掉 /api 后缀）
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
const SERVER_BASE = apiUrl.replace(/\/api\/?$/, '');

export function AvalancheEventEditor() {
  const {
    editMode,
    pendingCoordinate,
    selectedEvent,
    setEditMode,
    setPendingCoordinate,
    setSelectedEvent,
    createEvent,
    createSnowpit,
    deleteEvent,
  } = useMapStore();
  const user = useAuthStore((s) => s.user);

  // 表单状态
  const [eventDate, setEventDate] = useState(new Date().toISOString().split('T')[0]);
  const [avalancheType, setAvalancheType] = useState<AvalancheType>('Slab');
  const [trigger, setTrigger] = useState<AvalancheTrigger>('Unknown');
  const [size, setSize] = useState<AvalancheSize>('D2');
  const [aspect, setAspect] = useState('');
  const [slopeAngle, setSlopeAngle] = useState('');
  const [width, setWidth] = useState('');
  const [verticalFall, setVerticalFall] = useState('');
  const [description, setDescription] = useState('');
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 雪坑表单状态
  const [snowpitName, setSnowpitName] = useState('');
  const [snowpitDate, setSnowpitDate] = useState(new Date().toISOString().split('T')[0]);

  // ESC 退出
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setEditMode('none');
        setPendingCoordinate(null);
        setSelectedEvent(null);
      }
    },
    [setEditMode, setPendingCoordinate, setSelectedEvent]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // 重置表单（并自动填充 DEM 查询到的坡度/朝向）
  useEffect(() => {
    if (pendingCoordinate) {
      setEventDate(new Date().toISOString().split('T')[0]);
      setAvalancheType('Slab');
      setTrigger('Unknown');
      setSize('D2');
      setAspect(pendingCoordinate.aspect || '');
      setSlopeAngle(
        pendingCoordinate.slopeAngle != null
          ? String(Math.round(pendingCoordinate.slopeAngle))
          : ''
      );
      setWidth('');
      setVerticalFall('');
      setDescription('');
      setPhotos([]);
      setPhotoPreviews([]);
      setSnowpitName('');
      setSnowpitDate(new Date().toISOString().split('T')[0]);
    }
  }, [pendingCoordinate]);

  // 清理预览 URL
  useEffect(() => {
    return () => {
      photoPreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [photoPreviews]);

  // 处理图片选择
  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setPhotos((prev) => [...prev, ...files]);

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPhotoPreviews((prev) => [...prev, ...newPreviews]);
  };

  // 移除单张图片
  const handleRemovePhoto = (index: number) => {
    URL.revokeObjectURL(photoPreviews[index]);
    setPhotos((prev) => prev.filter((_, i) => i !== index));
    setPhotoPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // 保存雪崩事件
  const handleSaveEvent = async () => {
    if (!pendingCoordinate) return;
    if (photos.length === 0) return;
    setSaving(true);

    const ok = await createEvent(
      {
        latitude: pendingCoordinate.lat,
        longitude: pendingCoordinate.lng,
        elevation: pendingCoordinate.elevation,
        event_date: eventDate,
        avalanche_type: avalancheType,
        trigger,
        size,
        aspect: aspect || undefined,
        slope_angle: slopeAngle ? parseFloat(slopeAngle) : undefined,
        width: width ? parseFloat(width) : undefined,
        vertical_fall: verticalFall ? parseFloat(verticalFall) : undefined,
        description: description || undefined,
        reported_by: user?.display_name || '未知',
      },
      photos
    );

    setSaving(false);
    if (ok) {
      setPendingCoordinate(null);
      setEditMode('none');
    }
  };

  // 保存雪坑位置（创建最小观测记录）
  const handleSaveSnowpit = async () => {
    if (!pendingCoordinate) return;
    setSaving(true);

    const ok = await createSnowpit({
      lat: pendingCoordinate.lat,
      lng: pendingCoordinate.lng,
      elevation: pendingCoordinate.elevation,
      slopeAngle: pendingCoordinate.slopeAngle,
      aspect: pendingCoordinate.aspect,
      locationName: snowpitName || undefined,
      observer: user?.display_name || '未知',
      date: snowpitDate,
    });

    setSaving(false);
    if (ok) {
      setPendingCoordinate(null);
      setEditMode('none');
    }
  };

  const handleSave = editMode === 'add-snowpit' ? handleSaveSnowpit : handleSaveEvent;

  const handleClose = () => {
    setPendingCoordinate(null);
    setEditMode('none');
    setSelectedEvent(null);
  };

  const handleDelete = async (event: AvalancheEvent) => {
    if (confirm('确定删除此雪崩事件？')) {
      await deleteEvent(event.id);
      setSelectedEvent(null);
    }
  };

  // 查看模式：显示已选事件详情
  if (selectedEvent && editMode === 'none') {
    return (
      <div className="event-detail-panel">
        <div className="event-editor-header">
          <h3>雪崩事件详情</h3>
          <button className="btn-close-editor" onClick={() => setSelectedEvent(null)}>
            ×
          </button>
        </div>
        <div className="detail-body">
          <div className="detail-field">
            <div className="detail-field-label">坐标</div>
            <div className="coord-display">
              <span className="coord-icon">📍</span>
              {formatCoordinates(selectedEvent.latitude, selectedEvent.longitude)}
              {selectedEvent.elevation && ` · ${Math.round(selectedEvent.elevation)}m`}
            </div>
          </div>
          <div className="detail-field">
            <div className="detail-field-label">日期</div>
            <div className="detail-field-value">{selectedEvent.event_date}</div>
          </div>
          <div className="detail-field">
            <div className="detail-field-label">类型</div>
            <div className="detail-field-value">
              {AVALANCHE_TYPE_OPTIONS.find((o) => o.value === selectedEvent.avalanche_type)?.label || selectedEvent.avalanche_type}
            </div>
          </div>
          <div className="detail-field">
            <div className="detail-field-label">触发方式</div>
            <div className="detail-field-value">
              {AVALANCHE_TRIGGER_OPTIONS.find((o) => o.value === selectedEvent.trigger)?.label || selectedEvent.trigger}
            </div>
          </div>
          <div className="detail-field">
            <div className="detail-field-label">规模</div>
            <div className="detail-field-value">
              {AVALANCHE_SIZE_OPTIONS.find((o) => o.value === selectedEvent.size)?.label || selectedEvent.size}
            </div>
          </div>
          {selectedEvent.aspect && (
            <div className="detail-field">
              <div className="detail-field-label">朝向</div>
              <div className="detail-field-value">{selectedEvent.aspect}</div>
            </div>
          )}
          {selectedEvent.slope_angle && (
            <div className="detail-field">
              <div className="detail-field-label">坡度</div>
              <div className="detail-field-value">{selectedEvent.slope_angle}°</div>
            </div>
          )}
          {selectedEvent.width && (
            <div className="detail-field">
              <div className="detail-field-label">断裂宽度</div>
              <div className="detail-field-value">{selectedEvent.width}m</div>
            </div>
          )}
          {selectedEvent.vertical_fall && (
            <div className="detail-field">
              <div className="detail-field-label">垂直落差</div>
              <div className="detail-field-value">{selectedEvent.vertical_fall}m</div>
            </div>
          )}
          {selectedEvent.description && (
            <div className="detail-field">
              <div className="detail-field-label">描述</div>
              <div className="detail-field-value">{selectedEvent.description}</div>
            </div>
          )}
          {/* 显示照片 */}
          {selectedEvent.photos && selectedEvent.photos.length > 0 && (
            <div className="detail-field">
              <div className="detail-field-label">现场照片</div>
              <div className="detail-photos">
                {selectedEvent.photos.map((photoUrl, idx) => (
                  <img
                    key={idx}
                    src={`${SERVER_BASE}${photoUrl}`}
                    alt={`照片 ${idx + 1}`}
                    className="detail-photo-img"
                    onClick={() => setLightboxUrl(`${SERVER_BASE}${photoUrl}`)}
                  />
                ))}
              </div>
            </div>
          )}
          {lightboxUrl && (
            <div className="photo-lightbox" onClick={() => setLightboxUrl(null)}>
              <img src={lightboxUrl} alt="照片大图" className="photo-lightbox-img" />
            </div>
          )}
          <div className="detail-field">
            <div className="detail-field-label">报告人</div>
            <div className="detail-field-value">{selectedEvent.reported_by}</div>
          </div>
        </div>
        <div className="detail-actions">
          <button className="btn-delete-event" onClick={() => handleDelete(selectedEvent)}>
            删除事件
          </button>
        </div>
      </div>
    );
  }

  // 编辑模式：未选坐标时不显示面板
  if (editMode === 'none' || !pendingCoordinate) return null;

  return (
    <div className="event-editor-overlay">
      <div className="event-editor-header">
        <h3>{editMode === 'add-event' ? '新增雪崩事件' : '新增雪坑位置'}</h3>
        <button className="btn-close-editor" onClick={handleClose}>
          ×
        </button>
      </div>

      <div className="event-editor-body">
        {/* 坐标显示 */}
        <div className="form-row">
          <label>坐标位置</label>
          <div className="coord-display">
            <span className="coord-icon">📍</span>
            {formatCoordinates(pendingCoordinate.lat, pendingCoordinate.lng)}
            {pendingCoordinate.elevation != null &&
              ` · ${Math.round(pendingCoordinate.elevation)}m`}
          </div>
        </div>

        {editMode === 'add-event' && (
          <>
            {/* 日期 */}
            <div className="form-row">
              <label>发生日期</label>
              <input
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
              />
            </div>

            {/* 类型 + 触发 */}
            <div className="form-row form-row-inline">
              <div>
                <label>雪崩类型</label>
                <select
                  value={avalancheType}
                  onChange={(e) => setAvalancheType(e.target.value as AvalancheType)}
                >
                  {AVALANCHE_TYPE_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label>触发方式</label>
                <select
                  value={trigger}
                  onChange={(e) => setTrigger(e.target.value as AvalancheTrigger)}
                >
                  {AVALANCHE_TRIGGER_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* 规模 */}
            <div className="form-row">
              <label>破坏力规模</label>
              <select
                value={size}
                onChange={(e) => setSize(e.target.value as AvalancheSize)}
              >
                {AVALANCHE_SIZE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>

            {/* 朝向 + 坡度 */}
            <div className="form-row form-row-inline">
              <div>
                <label>坡面朝向</label>
                <select value={aspect} onChange={(e) => setAspect(e.target.value)}>
                  <option value="">选择...</option>
                  {ASPECT_OPTIONS.map((a) => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </div>
              <div>
                <label>起始坡度 (°)</label>
                <input
                  type="number"
                  min="0"
                  max="90"
                  value={slopeAngle}
                  onChange={(e) => setSlopeAngle(e.target.value)}
                  placeholder="如 35"
                />
              </div>
            </div>

            {/* 宽度 + 垂直落差 */}
            <div className="form-row form-row-inline">
              <div>
                <label>断裂宽度 (m)</label>
                <input
                  type="number"
                  min="0"
                  value={width}
                  onChange={(e) => setWidth(e.target.value)}
                  placeholder="如 100"
                />
              </div>
              <div>
                <label>垂直落差 (m)</label>
                <input
                  type="number"
                  min="0"
                  value={verticalFall}
                  onChange={(e) => setVerticalFall(e.target.value)}
                  placeholder="如 500"
                />
              </div>
            </div>

            {/* 描述 */}
            <div className="form-row">
              <label>事件描述</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="描述雪崩发生的详细情况..."
              />
            </div>

            {/* 图片上传 */}
            <div className="form-row">
              <label>
                现场照片 <span className="required-mark">*必填</span>
              </label>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handlePhotoSelect}
                style={{ display: 'none' }}
              />
              <div
                className="photo-upload-area"
                onClick={() => fileInputRef.current?.click()}
              >
                <span className="photo-upload-icon">+</span>
                <span className="photo-upload-text">点击添加照片</span>
              </div>

              {photoPreviews.length > 0 && (
                <div className="photo-preview-grid">
                  {photoPreviews.map((preview, idx) => (
                    <div key={idx} className="photo-preview-item">
                      <img src={preview} alt={`预览 ${idx + 1}`} />
                      <button
                        className="photo-remove-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemovePhoto(idx);
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {photos.length === 0 && (
                <div className="photo-hint">请至少上传一张现场照片</div>
              )}
            </div>
          </>
        )}

        {editMode === 'add-snowpit' && (
          <>
            <div className="form-row">
              <label>观测日期</label>
              <input
                type="date"
                value={snowpitDate}
                onChange={(e) => setSnowpitDate(e.target.value)}
              />
            </div>

            <div className="form-row">
              <label>位置名称</label>
              <input
                type="text"
                value={snowpitName}
                onChange={(e) => setSnowpitName(e.target.value)}
                placeholder="如：北坡树线上方"
              />
            </div>

            {/* 自动填充的坡度/朝向 */}
            {(pendingCoordinate?.aspect || pendingCoordinate?.slopeAngle != null) && (
              <div className="form-row form-row-inline">
                {pendingCoordinate.aspect && (
                  <div>
                    <label>坡面朝向</label>
                    <input type="text" value={pendingCoordinate.aspect} readOnly />
                  </div>
                )}
                {pendingCoordinate.slopeAngle != null && (
                  <div>
                    <label>坡度</label>
                    <input type="text" value={`${Math.round(pendingCoordinate.slopeAngle)}°`} readOnly />
                  </div>
                )}
              </div>
            )}

            <div className="form-row">
              <p className="snowpit-hint">
                保存后将创建一条观测记录。可在「雪层观测」页面中补充完整的雪坑剖面数据。
              </p>
            </div>
          </>
        )}
      </div>

      <div className="event-editor-footer">
        <button className="btn-cancel-event" onClick={handleClose}>
          取消
        </button>
        <button
          className="btn-save-event"
          onClick={handleSave}
          disabled={saving || (editMode === 'add-event' && photos.length === 0)}
        >
          {saving
            ? '保存中...'
            : editMode === 'add-event' && photos.length === 0
              ? '请添加照片'
              : '保存'}
        </button>
      </div>
    </div>
  );
}
