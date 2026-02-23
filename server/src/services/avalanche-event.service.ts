import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getDatabase } from '../config/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const UPLOAD_DIR = path.resolve(__dirname, '../../data/uploads/avalanche-events');

// 确保上传目录存在
function ensureUploadDir() {
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }
}

interface AvalancheEventRow {
  id: number;
  latitude: number;
  longitude: number;
  elevation: number | null;
  event_date: string;
  avalanche_type: string;
  trigger_method: string;
  size: string;
  aspect: string | null;
  slope_angle: number | null;
  start_elevation: number | null;
  vertical_fall: number | null;
  width: number | null;
  description: string | null;
  reported_by: string;
  created_at: string;
  updated_at: string;
}

interface AvalancheEventPhotoRow {
  id: number;
  event_id: number;
  file_path: string;
  original_name: string | null;
  sort_order: number;
  created_at: string;
}

interface GetEventsOptions {
  page?: number;
  limit?: number;
  bbox?: string; // west,south,east,north
  start_date?: string;
  end_date?: string;
}

// 获取雪崩事件列表
export function getEvents(options: GetEventsOptions) {
  const db = getDatabase();
  const page = options.page || 1;
  const limit = options.limit || 50;
  const offset = (page - 1) * limit;

  const conditions: string[] = [];
  const params: (string | number)[] = [];

  if (options.bbox) {
    const [west, south, east, north] = options.bbox.split(',').map(Number);
    if ([west, south, east, north].every((v) => !isNaN(v))) {
      conditions.push('longitude >= ? AND longitude <= ? AND latitude >= ? AND latitude <= ?');
      params.push(west, east, south, north);
    }
  }

  if (options.start_date) {
    conditions.push('event_date >= ?');
    params.push(options.start_date);
  }

  if (options.end_date) {
    conditions.push('event_date <= ?');
    params.push(options.end_date);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const countResult = db
    .prepare(`SELECT COUNT(*) as total FROM avalanche_events ${whereClause}`)
    .get(...params) as { total: number };

  const events = db
    .prepare(
      `SELECT * FROM avalanche_events ${whereClause} ORDER BY event_date DESC, created_at DESC LIMIT ? OFFSET ?`
    )
    .all(...params, limit, offset) as AvalancheEventRow[];

  // 为每个事件附加照片
  const getPhotos = db.prepare(
    'SELECT * FROM avalanche_event_photos WHERE event_id = ? ORDER BY sort_order ASC'
  );

  const eventsWithPhotos = events.map((event) => {
    const photos = getPhotos.all(event.id) as AvalancheEventPhotoRow[];
    return {
      ...event,
      // 前端字段名为 trigger，数据库为 trigger_method
      trigger: event.trigger_method,
      photos: photos.map((p) => `/uploads/avalanche-events/${path.basename(p.file_path)}`),
    };
  });

  return {
    events: eventsWithPhotos,
    total: countResult.total,
    page,
    totalPages: Math.ceil(countResult.total / limit),
  };
}

// 获取单个事件详情
export function getEventById(id: number) {
  const db = getDatabase();

  const event = db
    .prepare('SELECT * FROM avalanche_events WHERE id = ?')
    .get(id) as AvalancheEventRow | undefined;

  if (!event) return null;

  const photos = db
    .prepare('SELECT * FROM avalanche_event_photos WHERE event_id = ? ORDER BY sort_order ASC')
    .all(id) as AvalancheEventPhotoRow[];

  return {
    ...event,
    trigger: event.trigger_method,
    photos: photos.map((p) => `/uploads/avalanche-events/${path.basename(p.file_path)}`),
  };
}

// 创建雪崩事件
export function createEvent(data: {
  latitude: number;
  longitude: number;
  elevation?: number;
  event_date: string;
  avalanche_type: string;
  trigger: string;
  size: string;
  aspect?: string;
  slope_angle?: number;
  start_elevation?: number;
  vertical_fall?: number;
  width?: number;
  description?: string;
  reported_by: string;
}): { id: number } {
  const db = getDatabase();

  const result = db
    .prepare(
      `INSERT INTO avalanche_events (
        latitude, longitude, elevation, event_date,
        avalanche_type, trigger_method, size, aspect,
        slope_angle, start_elevation, vertical_fall, width,
        description, reported_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      data.latitude,
      data.longitude,
      data.elevation ?? null,
      data.event_date,
      data.avalanche_type,
      data.trigger,
      data.size,
      data.aspect ?? null,
      data.slope_angle ?? null,
      data.start_elevation ?? null,
      data.vertical_fall ?? null,
      data.width ?? null,
      data.description ?? null,
      data.reported_by
    );

  return { id: result.lastInsertRowid as number };
}

// 为事件添加照片
export function addPhotos(
  eventId: number,
  files: { path: string; originalname: string }[]
): void {
  ensureUploadDir();
  const db = getDatabase();

  const insertPhoto = db.prepare(
    `INSERT INTO avalanche_event_photos (event_id, file_path, original_name, sort_order)
     VALUES (?, ?, ?, ?)`
  );

  files.forEach((file, index) => {
    // multer 已把文件存到临时位置，移动到目标目录
    const ext = path.extname(file.originalname);
    const filename = `${eventId}_${Date.now()}_${index}${ext}`;
    const destPath = path.join(UPLOAD_DIR, filename);

    fs.copyFileSync(file.path, destPath);
    fs.unlinkSync(file.path); // 删除临时文件

    insertPhoto.run(eventId, destPath, file.originalname, index);
  });
}

// 更新雪崩事件
export function updateEvent(
  id: number,
  data: Partial<{
    latitude: number;
    longitude: number;
    elevation: number;
    event_date: string;
    avalanche_type: string;
    trigger: string;
    size: string;
    aspect: string;
    slope_angle: number;
    start_elevation: number;
    vertical_fall: number;
    width: number;
    description: string;
    reported_by: string;
  }>
): boolean {
  const db = getDatabase();

  const existing = db.prepare('SELECT id FROM avalanche_events WHERE id = ?').get(id);
  if (!existing) return false;

  const fields: string[] = [];
  const values: (string | number | null)[] = [];

  const mapping: Record<string, string> = {
    latitude: 'latitude',
    longitude: 'longitude',
    elevation: 'elevation',
    event_date: 'event_date',
    avalanche_type: 'avalanche_type',
    trigger: 'trigger_method',
    size: 'size',
    aspect: 'aspect',
    slope_angle: 'slope_angle',
    start_elevation: 'start_elevation',
    vertical_fall: 'vertical_fall',
    width: 'width',
    description: 'description',
    reported_by: 'reported_by',
  };

  for (const [key, col] of Object.entries(mapping)) {
    if (key in data) {
      fields.push(`${col} = ?`);
      values.push((data as Record<string, unknown>)[key] as string | number | null);
    }
  }

  if (fields.length === 0) return true;

  fields.push('updated_at = CURRENT_TIMESTAMP');
  values.push(id);

  db.prepare(`UPDATE avalanche_events SET ${fields.join(', ')} WHERE id = ?`).run(...values);

  return true;
}

// 删除雪崩事件
export function deleteEvent(id: number): boolean {
  const db = getDatabase();

  // 先删除关联的照片文件
  const photos = db
    .prepare('SELECT file_path FROM avalanche_event_photos WHERE event_id = ?')
    .all(id) as { file_path: string }[];

  for (const photo of photos) {
    if (fs.existsSync(photo.file_path)) {
      fs.unlinkSync(photo.file_path);
    }
  }

  // 级联删除会清理数据库记录
  const result = db.prepare('DELETE FROM avalanche_events WHERE id = ?').run(id);
  return result.changes > 0;
}
