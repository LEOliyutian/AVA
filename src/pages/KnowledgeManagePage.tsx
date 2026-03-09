import { useEffect, useRef, useState } from 'react';
import {
  knowledgeApi,
  mediaUrl,
  PAGE_SLOTS,
  PAGE_KEYS,
  PAGE_CONTENT_SCHEMA,
  type KnowledgeMedia,
  type ContentItem,
} from '../api/knowledge.api';
import './KnowledgeManagePage.css';

// ── 简单 Markdown 渲染（仅预览）──
function renderMarkdown(md: string): string {
  return md
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>[\s\S]+?<\/li>)/g, '<ul>$1</ul>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(?!<[hlu])/gm, '')
    .replace(/\n/g, '<br>');
}

// ── 图片槽位组件（支持多图 + 草稿发布）──
function MediaSlot({
  pageKey,
  itemKey,
  label,
  hint,
  mediaList,
  onAdded,
  onDeleted,
  onPublished,
}: {
  pageKey: string;
  itemKey: string;
  label: string;
  hint?: string;
  mediaList: KnowledgeMedia[];
  onAdded: (m: KnowledgeMedia) => void;
  onDeleted: (id: number) => void;
  onPublished: (id: number) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [publishingId, setPublishingId] = useState<number | null>(null);

  const handleFile = async (file: File) => {
    if (file.size > 20 * 1024 * 1024) {
      setError('图片不能超过 20MB');
      return;
    }
    setUploading(true);
    setError('');
    const res = await knowledgeApi.uploadMedia(pageKey, itemKey, file, label);
    setUploading(false);
    if (res.success && res.data) {
      onAdded(res.data.media);
    } else {
      setError(res.error || '上传失败');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleDelete = async (m: KnowledgeMedia) => {
    if (!window.confirm(`确定删除这张图片？`)) return;
    const res = await knowledgeApi.deleteMedia(m.id);
    if (res.success) onDeleted(m.id);
  };

  const handlePublish = async (m: KnowledgeMedia) => {
    setPublishingId(m.id);
    const res = await knowledgeApi.publishMedia(m.id);
    setPublishingId(null);
    if (res.success) onPublished(m.id);
  };

  return (
    <div className="kmp-slot">
      <div className="kmp-slot-label">
        {label}
        {hint && <span className="kmp-slot-hint">{hint}</span>}
        {mediaList.length > 0 && (
          <span className="kmp-slot-count">{mediaList.length} 张</span>
        )}
      </div>

      {/* 已有图片列表 */}
      {mediaList.length > 0 && (
        <div className="kmp-media-gallery">
          {mediaList.map((m) => {
            const published = m.is_published === 1;
            return (
              <div key={m.id} className="kmp-media-item">
                <div className="kmp-media-thumb">
                  <img
                    src={mediaUrl(m.file_path)}
                    alt={m.alt_text || label}
                    className="kmp-slot-img"
                  />
                  <div className="kmp-media-overlay">
                    <button
                      className="kmp-btn kmp-btn--sm kmp-btn--danger"
                      onClick={() => handleDelete(m)}
                    >
                      删除
                    </button>
                  </div>
                </div>
                <div className="kmp-media-footer">
                  <span className={`kmp-status-badge ${published ? 'kmp-status-badge--published' : 'kmp-status-badge--draft'}`}>
                    {published ? '已发布' : '草稿'}
                  </span>
                  {!published && (
                    <button
                      className="kmp-btn kmp-btn--publish kmp-btn--sm"
                      onClick={() => handlePublish(m)}
                      disabled={publishingId === m.id}
                    >
                      {publishingId === m.id ? '发布中...' : '发布'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 添加区 */}
      <div
        className={`kmp-slot-drop kmp-slot-drop--add${dragOver ? ' kmp-slot-drop--over' : ''}`}
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onClick={() => inputRef.current?.click()}
      >
        {uploading ? (
          <span className="kmp-uploading">上传中...</span>
        ) : (
          <>
            <span className="kmp-drop-icon">+</span>
            <span className="kmp-drop-text">{mediaList.length > 0 ? '添加更多' : '点击或拖拽上传'}</span>
            <span className="kmp-drop-sub">JPG / PNG / WebP · 最大 20MB</span>
          </>
        )}
      </div>

      {error && <div className="kmp-slot-error">{error}</div>}

      <input
        ref={inputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.webp"
        style={{ display: 'none' }}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = '';
        }}
      />
    </div>
  );
}

// ── 单个条目的文字字段编辑器 ──
function ContentItemEditor({
  pageKey,
  item,
  initialFields,
  isPublished,
  onPublished,
}: {
  pageKey: string;
  item: ContentItem;
  initialFields: Record<string, string>;
  isPublished: boolean;
  onPublished: (itemKey: string) => void;
}) {
  const buildFields = (dbFields: Record<string, string>) => {
    const f: Record<string, string> = {};
    for (const fd of item.fields) {
      f[fd.key] = dbFields[fd.key] ?? item.defaults?.[fd.key] ?? '';
    }
    return f;
  };

  const [fields, setFields] = useState<Record<string, string>>(() => buildFields(initialFields));
  const [original, setOriginal] = useState<Record<string, string>>(() => buildFields(initialFields));
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);

  useEffect(() => {
    const updated = buildFields(initialFields);
    setFields(updated);
    setOriginal(updated);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialFields]);

  const isDirty = item.fields.some((fd) => fields[fd.key] !== original[fd.key]);

  const handleSaveDraft = async () => {
    setSaving(true);
    const res = await knowledgeApi.saveContentItem(pageKey, item.item_key, fields);
    setSaving(false);
    if (res.success) {
      setOriginal({ ...fields });
    }
  };

  const handlePublish = async () => {
    setPublishing(true);
    const res = await knowledgeApi.publishContentItem(pageKey, item.item_key);
    setPublishing(false);
    if (res.success) onPublished(item.item_key);
  };

  const published = isPublished && !isDirty;

  return (
    <div className="kmp-content-item">
      <div className="kmp-content-item-header">
        <div className="kmp-content-item-title">
          <span className="kmp-content-item-label">{item.label}</span>
          <span className={`kmp-status-badge ${published ? 'kmp-status-badge--published' : 'kmp-status-badge--draft'}`}>
            {published ? '已发布' : '草稿'}
          </span>
        </div>
        <div className="kmp-content-item-actions">
          <button
            className="kmp-btn kmp-btn--outline kmp-btn--sm"
            onClick={handleSaveDraft}
            disabled={saving || !isDirty}
          >
            {saving ? '保存中...' : '保存草稿'}
          </button>
          <button
            className="kmp-btn kmp-btn--publish kmp-btn--sm"
            onClick={handlePublish}
            disabled={publishing || isDirty}
            title={isDirty ? '请先保存草稿' : ''}
          >
            {publishing ? '发布中...' : published ? '重新发布' : '发布'}
          </button>
        </div>
      </div>
      <div className="kmp-content-fields">
        {item.fields.map((fd) => (
          <div key={fd.key} className="kmp-content-field">
            <label className="kmp-content-field-label">{fd.label}</label>
            <textarea
              className="kmp-content-field-textarea"
              value={fields[fd.key]}
              onChange={(e) => setFields((prev) => ({ ...prev, [fd.key]: e.target.value }))}
              rows={3}
              spellCheck={false}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// ── 页面文字内容编辑器 ──
function ContentEditor({ pageKey }: { pageKey: string }) {
  const schema = PAGE_CONTENT_SCHEMA[pageKey];
  const [contentMap, setContentMap] = useState<Record<string, Record<string, string>>>({});
  const [publishedItems, setPublishedItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!schema) { setLoading(false); return; }
    setLoading(true);
    knowledgeApi.adminGetContent(pageKey).then((res) => {
      if (res.success && res.data) {
        setContentMap(res.data.content);
        setPublishedItems(res.data.publishedItems);
      }
      setLoading(false);
    });
  }, [pageKey, schema]);

  const handleItemPublished = (itemKey: string) => {
    setPublishedItems((prev) => prev.includes(itemKey) ? prev : [...prev, itemKey]);
  };

  if (!schema) {
    return (
      <div className="kmp-content-na">此页面内容为固定版式，可通过下方「本地补充说明」添加场地专属信息。</div>
    );
  }

  if (loading) return <div className="kmp-loading">加载中...</div>;

  return (
    <div className="kmp-content-list">
      {schema.map((item) => (
        <ContentItemEditor
          key={item.item_key}
          pageKey={pageKey}
          item={item}
          initialFields={contentMap[item.item_key] ?? {}}
          isPublished={publishedItems.includes(item.item_key)}
          onPublished={handleItemPublished}
        />
      ))}
    </div>
  );
}

// ── 本地说明编辑器 ──
function NoteEditor({ pageKey }: { pageKey: string }) {
  const [content, setContent] = useState('');
  const [original, setOriginal] = useState('');
  const [isPublished, setIsPublished] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [tab, setTab] = useState<'edit' | 'preview'>('edit');

  useEffect(() => {
    setLoading(true);
    knowledgeApi.adminGetNote(pageKey).then((res) => {
      const note = res.data?.note;
      const c = note?.content ?? '';
      setContent(c);
      setOriginal(c);
      setIsPublished(note?.is_published === 1);
      setLoading(false);
    });
  }, [pageKey]);

  const handleSaveDraft = async () => {
    setSaving(true);
    const res = await knowledgeApi.saveNote(pageKey, content);
    setSaving(false);
    if (res.success) {
      setOriginal(content);
      setIsPublished(false);
    }
  };

  const handlePublish = async () => {
    setPublishing(true);
    const res = await knowledgeApi.publishNote(pageKey);
    setPublishing(false);
    if (res.success) setIsPublished(true);
  };

  if (loading) return <div className="kmp-note-loading">加载中...</div>;

  const isDirty = content !== original;
  const published = isPublished && !isDirty;

  return (
    <div className="kmp-note">
      <div className="kmp-note-header">
        <div className="kmp-note-tabs">
          <button
            className={`kmp-tab${tab === 'edit' ? ' kmp-tab--active' : ''}`}
            onClick={() => setTab('edit')}
          >编辑</button>
          <button
            className={`kmp-tab${tab === 'preview' ? ' kmp-tab--active' : ''}`}
            onClick={() => setTab('preview')}
          >预览</button>
        </div>
        <div className="kmp-note-actions">
          <span className={`kmp-status-badge ${published ? 'kmp-status-badge--published' : 'kmp-status-badge--draft'}`}>
            {published ? '已发布' : '草稿'}
          </span>
          <button
            className="kmp-btn kmp-btn--outline kmp-btn--sm"
            onClick={handleSaveDraft}
            disabled={saving || !isDirty}
          >
            {saving ? '保存中...' : '保存草稿'}
          </button>
          <button
            className="kmp-btn kmp-btn--publish kmp-btn--sm"
            onClick={handlePublish}
            disabled={publishing || isDirty}
            title={isDirty ? '请先保存草稿' : ''}
          >
            {publishing ? '发布中...' : published ? '重新发布' : '发布'}
          </button>
        </div>
      </div>

      {tab === 'edit' ? (
        <textarea
          className="kmp-note-textarea"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={`为「${PAGE_SLOTS[pageKey]?.label}」添加本地补充说明（支持 Markdown）\n\n例：\n## 吉克普林本地说明\n\n本场地的 XX 沟和 XX 坡是风板高发区，尤其是西北风过后...`}
          spellCheck={false}
        />
      ) : (
        <div
          className="kmp-note-preview"
          dangerouslySetInnerHTML={{
            __html: content
              ? renderMarkdown(content)
              : '<p class="kmp-note-empty">暂无内容</p>',
          }}
        />
      )}
    </div>
  );
}

// ── 主页面 ──
export function KnowledgeManagePage() {
  const [activeKey, setActiveKey] = useState(PAGE_KEYS[0]);
  const [mediaMap, setMediaMap] = useState<Record<string, KnowledgeMedia[]>>({});
  const [loadingMedia, setLoadingMedia] = useState(false);

  useEffect(() => {
    setLoadingMedia(true);
    knowledgeApi.adminGetMedia(activeKey).then((res) => {
      const map: Record<string, KnowledgeMedia[]> = {};
      if (res.success && res.data) {
        for (const m of res.data.media) {
          if (!map[m.item_key]) map[m.item_key] = [];
          map[m.item_key].push(m);
        }
      }
      setMediaMap(map);
      setLoadingMedia(false);
    });
  }, [activeKey]);

  const handleAdded = (m: KnowledgeMedia) => {
    setMediaMap((prev) => ({
      ...prev,
      [m.item_key]: [...(prev[m.item_key] ?? []), m],
    }));
  };

  const handleDeleted = (id: number) => {
    setMediaMap((prev) => {
      const next: Record<string, KnowledgeMedia[]> = {};
      for (const k of Object.keys(prev)) {
        next[k] = prev[k].filter((m) => m.id !== id);
      }
      return next;
    });
  };

  const handlePublished = (id: number) => {
    setMediaMap((prev) => {
      const next: Record<string, KnowledgeMedia[]> = {};
      for (const k of Object.keys(prev)) {
        next[k] = prev[k].map((m) => m.id === id ? { ...m, is_published: 1 } : m);
      }
      return next;
    });
  };

  const page = PAGE_SLOTS[activeKey];

  return (
    <div className="kmp-container">
      <h1 className="kmp-title">安全知识内容管理</h1>
      <p className="kmp-subtitle">为各知识模块上传本地照片，并添加吉克普林场地专属说明。</p>

      <div className="kmp-layout">
        {/* 左侧模块列表 */}
        <nav className="kmp-sidebar">
          {PAGE_KEYS.map((key) => (
            <button
              key={key}
              className={`kmp-nav-btn${activeKey === key ? ' kmp-nav-btn--active' : ''}`}
              onClick={() => setActiveKey(key)}
            >
              {PAGE_SLOTS[key].label}
            </button>
          ))}
        </nav>

        {/* 右侧内容 */}
        <div className="kmp-main">
          <h2 className="kmp-section-title">{page.label}</h2>

          {/* 图片槽位 */}
          <div className="kmp-section-header">
            <span className="kmp-section-badge">图片</span>
            <span className="kmp-section-desc">上传后为草稿，点击「发布」后才会在公开页面展示</span>
          </div>
          {loadingMedia ? (
            <div className="kmp-loading">加载中...</div>
          ) : (
            <div className={`kmp-slots-grid${page.slots.length === 1 ? ' kmp-slots-grid--single' : ''}`}>
              {page.slots.map((slot) => (
                <MediaSlot
                  key={slot.item_key}
                  pageKey={activeKey}
                  itemKey={slot.item_key}
                  label={slot.label}
                  hint={slot.hint}
                  mediaList={mediaMap[slot.item_key] ?? []}
                  onAdded={handleAdded}
                  onDeleted={handleDeleted}
                  onPublished={handlePublished}
                />
              ))}
            </div>
          )}

          {/* 文字内容 */}
          <div className="kmp-section-header" style={{ marginTop: 32 }}>
            <span className="kmp-section-badge">文字内容</span>
            <span className="kmp-section-desc">留空则显示默认文字；填写后将覆盖页面展示内容</span>
          </div>
          <ContentEditor pageKey={activeKey} />

          {/* 本地说明 */}
          <div className="kmp-section-header" style={{ marginTop: 32 }}>
            <span className="kmp-section-badge">本地补充说明</span>
            <span className="kmp-section-desc">显示在页面底部「吉克普林本地说明」区块，支持 Markdown</span>
          </div>
          <NoteEditor pageKey={activeKey} />
        </div>
      </div>
    </div>
  );
}
