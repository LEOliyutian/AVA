import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getDatabase } from '../config/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOADS_DIR = path.resolve(__dirname, '../../data/uploads/knowledge');

export interface KnowledgeMedia {
  id: number;
  page_key: string;
  item_key: string;
  file_path: string;
  alt_text: string | null;
  uploaded_by: number | null;
  created_at: string;
  sort_order: number;
  is_published: number;
}

export interface KnowledgeNote {
  page_key: string;
  content: string;
  updated_at: string;
  updated_by: number | null;
  is_published: number;
}

export interface AdminContentResult {
  content: Record<string, Record<string, string>>;
  publishedItems: string[];
}

class KnowledgeService {
  // 确保上传目录存在
  ensureUploadsDir(): void {
    if (!fs.existsSync(UPLOADS_DIR)) {
      fs.mkdirSync(UPLOADS_DIR, { recursive: true });
    }
  }

  // 获取某页面已发布图片（公开）
  getMedia(pageKey: string): KnowledgeMedia[] {
    const db = getDatabase();
    return db.prepare(
      'SELECT * FROM knowledge_media WHERE page_key = ? AND is_published = 1 ORDER BY item_key, sort_order, created_at'
    ).all(pageKey) as KnowledgeMedia[];
  }

  // 获取某页面所有图片（Admin，含草稿）
  getAdminMedia(pageKey: string): KnowledgeMedia[] {
    const db = getDatabase();
    return db.prepare(
      'SELECT * FROM knowledge_media WHERE page_key = ? ORDER BY item_key, sort_order, created_at'
    ).all(pageKey) as KnowledgeMedia[];
  }

  // 新增图片（不替换，草稿状态）
  addMedia(
    pageKey: string,
    itemKey: string,
    filePath: string,
    altText: string | null,
    uploadedBy: number
  ): KnowledgeMedia {
    const db = getDatabase();
    const result = db.prepare(
      'INSERT INTO knowledge_media (page_key, item_key, file_path, alt_text, uploaded_by, is_published) VALUES (?,?,?,?,?,0)'
    ).run(pageKey, itemKey, filePath, altText, uploadedBy);
    return db.prepare('SELECT * FROM knowledge_media WHERE id = ?').get(result.lastInsertRowid) as KnowledgeMedia;
  }

  // 发布图片
  publishMedia(id: number): void {
    const db = getDatabase();
    db.prepare('UPDATE knowledge_media SET is_published = 1 WHERE id = ?').run(id);
  }

  // 删除图片
  deleteMedia(id: number): boolean {
    const db = getDatabase();
    const item = db.prepare('SELECT * FROM knowledge_media WHERE id = ?').get(id) as KnowledgeMedia | null;
    if (!item) return false;

    const filePath = path.resolve(__dirname, '../../data', item.file_path.replace(/^\//, ''));
    if (fs.existsSync(filePath)) {
      try { fs.unlinkSync(filePath); } catch { /* ignore */ }
    }

    const result = db.prepare('DELETE FROM knowledge_media WHERE id = ?').run(id);
    return result.changes > 0;
  }

  // 获取本地说明（公开：仅已发布）
  getNote(pageKey: string): KnowledgeNote | null {
    const db = getDatabase();
    return db.prepare(
      'SELECT * FROM knowledge_notes WHERE page_key = ? AND is_published = 1'
    ).get(pageKey) as KnowledgeNote | null;
  }

  // 获取本地说明（Admin：含草稿）
  getAdminNote(pageKey: string): KnowledgeNote | null {
    const db = getDatabase();
    return db.prepare('SELECT * FROM knowledge_notes WHERE page_key = ?').get(pageKey) as KnowledgeNote | null;
  }

  // 保存本地说明（保存为草稿，重置 is_published=0）
  upsertNote(pageKey: string, content: string, updatedBy: number): void {
    const db = getDatabase();
    const existing = this.getAdminNote(pageKey);
    if (existing) {
      db.prepare(
        'UPDATE knowledge_notes SET content=?, updated_at=CURRENT_TIMESTAMP, updated_by=?, is_published=0 WHERE page_key=?'
      ).run(content, updatedBy, pageKey);
    } else {
      db.prepare(
        'INSERT INTO knowledge_notes (page_key, content, updated_by, is_published) VALUES (?,?,?,0)'
      ).run(pageKey, content, updatedBy);
    }
  }

  // 发布本地说明
  publishNote(pageKey: string): void {
    const db = getDatabase();
    db.prepare('UPDATE knowledge_notes SET is_published = 1 WHERE page_key = ?').run(pageKey);
  }

  // 获取页面文字内容（公开：仅已发布）
  getContent(pageKey: string): Record<string, Record<string, string>> {
    const db = getDatabase();
    const rows = db.prepare(
      'SELECT item_key, field_key, value FROM knowledge_content WHERE page_key = ? AND is_published = 1'
    ).all(pageKey) as { item_key: string; field_key: string; value: string }[];

    const result: Record<string, Record<string, string>> = {};
    for (const row of rows) {
      if (!result[row.item_key]) result[row.item_key] = {};
      result[row.item_key][row.field_key] = row.value;
    }
    return result;
  }

  // 获取页面文字内容（Admin：含草稿 + 已发布 item_key 列表）
  getAdminContent(pageKey: string): AdminContentResult {
    const db = getDatabase();
    const rows = db.prepare(
      'SELECT item_key, field_key, value, is_published FROM knowledge_content WHERE page_key = ?'
    ).all(pageKey) as { item_key: string; field_key: string; value: string; is_published: number }[];

    const content: Record<string, Record<string, string>> = {};
    const itemCounts: Record<string, { total: number; published: number }> = {};
    for (const row of rows) {
      if (!content[row.item_key]) content[row.item_key] = {};
      content[row.item_key][row.field_key] = row.value;
      if (!itemCounts[row.item_key]) itemCounts[row.item_key] = { total: 0, published: 0 };
      itemCounts[row.item_key].total++;
      if (row.is_published === 1) itemCounts[row.item_key].published++;
    }
    const publishedItems = Object.entries(itemCounts)
      .filter(([, v]) => v.total > 0 && v.total === v.published)
      .map(([k]) => k);
    return { content, publishedItems };
  }

  // 保存某 item 的所有字段（草稿，重置 is_published=0）
  upsertContentItem(pageKey: string, itemKey: string, fields: Record<string, string>): void {
    const db = getDatabase();
    const stmt = db.prepare(`
      INSERT INTO knowledge_content (page_key, item_key, field_key, value, is_published)
      VALUES (?, ?, ?, ?, 0)
      ON CONFLICT(page_key, item_key, field_key)
      DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP, is_published = 0
    `);
    for (const [fieldKey, value] of Object.entries(fields)) {
      stmt.run(pageKey, itemKey, fieldKey, value);
    }
  }

  // 发布某 item 的所有字段
  publishContentItem(pageKey: string, itemKey: string): void {
    const db = getDatabase();
    db.prepare(
      'UPDATE knowledge_content SET is_published = 1 WHERE page_key = ? AND item_key = ?'
    ).run(pageKey, itemKey);
  }
}

export const knowledgeService = new KnowledgeService();
