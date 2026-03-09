import { Router, type Request, type Response } from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { authenticate } from '../middleware/auth.middleware.js';
import { requireAdmin } from '../middleware/role.middleware.js';
import { knowledgeService } from '../services/knowledge.service.js';
import { auditService } from '../services/audit.service.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const UPLOADS_DIR = path.resolve(__dirname, '../../data/uploads/knowledge');

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    knowledgeService.ensureUploadsDir();
    cb(null, UPLOADS_DIR);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
    cb(null, name);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (_req, file, cb) => {
    const allowed = ['.jpg', '.jpeg', '.png', '.webp'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('仅支持 JPG / PNG / WebP 格式'));
    }
  },
});

const router = Router();

// ── 公开接口（无需登录）──

// GET /api/knowledge/media/:pageKey — 获取某页面所有图片
router.get('/media/:pageKey', (req: Request, res: Response) => {
  try {
    const media = knowledgeService.getMedia(req.params.pageKey);
    res.json({ success: true, data: { media } });
  } catch (error) {
    res.status(500).json({ success: false, error: '获取图片失败' });
  }
});

// GET /api/knowledge/notes/:pageKey — 获取某页面本地说明
router.get('/notes/:pageKey', (req: Request, res: Response) => {
  try {
    const note = knowledgeService.getNote(req.params.pageKey);
    res.json({ success: true, data: { note } });
  } catch (error) {
    res.status(500).json({ success: false, error: '获取说明失败' });
  }
});

// ── Admin 接口（需要 admin 权限）──

// GET /api/knowledge/admin/media/:pageKey — 获取某页面所有图片（含草稿）
router.get('/admin/media/:pageKey', authenticate, requireAdmin, (req: Request, res: Response) => {
  try {
    const media = knowledgeService.getAdminMedia(req.params.pageKey);
    res.json({ success: true, data: { media } });
  } catch (error) {
    res.status(500).json({ success: false, error: '获取图片失败' });
  }
});

// POST /api/knowledge/admin/media/:id/publish — 发布图片
router.post('/admin/media/:id/publish', authenticate, requireAdmin, (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ success: false, error: '无效的 ID' });
      return;
    }
    knowledgeService.publishMedia(id);
    auditService.write({
      userId: req.user!.userId,
      userName: req.user!.username,
      action: 'settings.update',
      targetType: 'knowledge_media',
      detail: { id, action: 'publish' },
      ipAddress: req.ip,
    });
    res.json({ success: true, data: { message: '已发布' } });
  } catch (error) {
    res.status(500).json({ success: false, error: '发布失败' });
  }
});

// POST /api/knowledge/admin/media — 上传图片
router.post(
  '/admin/media',
  authenticate,
  requireAdmin,
  upload.single('image'),
  (req: Request, res: Response) => {
    try {
      if (!req.file) {
        res.status(400).json({ success: false, error: '未收到图片文件' });
        return;
      }

      const { page_key, item_key, alt_text } = req.body as {
        page_key: string;
        item_key: string;
        alt_text?: string;
      };

      if (!page_key || !item_key) {
        res.status(400).json({ success: false, error: 'page_key 和 item_key 为必填项' });
        return;
      }

      const filePath = `/uploads/knowledge/${req.file.filename}`;
      const media = knowledgeService.addMedia(
        page_key,
        item_key,
        filePath,
        alt_text || null,
        req.user!.userId
      );

      auditService.write({
        userId: req.user!.userId,
        userName: req.user!.username,
        action: 'settings.update',
        targetType: 'knowledge_media',
        detail: { page_key, item_key, file: req.file.filename },
        ipAddress: req.ip,
      });

      res.status(201).json({ success: true, data: { media } });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : '上传失败',
      });
    }
  }
);

// DELETE /api/knowledge/admin/media/:id — 删除图片
router.delete('/admin/media/:id', authenticate, requireAdmin, (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ success: false, error: '无效的 ID' });
      return;
    }

    const deleted = knowledgeService.deleteMedia(id);
    if (!deleted) {
      res.status(404).json({ success: false, error: '图片不存在' });
      return;
    }

    res.json({ success: true, data: { message: '已删除' } });
  } catch (error) {
    res.status(500).json({ success: false, error: '删除失败' });
  }
});

// GET /api/knowledge/content/:pageKey — 获取页面文字内容（公开，仅已发布）
router.get('/content/:pageKey', (req: Request, res: Response) => {
  try {
    const content = knowledgeService.getContent(req.params.pageKey);
    res.json({ success: true, data: { content } });
  } catch (error) {
    res.status(500).json({ success: false, error: '获取内容失败' });
  }
});

// GET /api/knowledge/admin/content/:pageKey — Admin 获取（含草稿 + 发布状态）
router.get('/admin/content/:pageKey', authenticate, requireAdmin, (req: Request, res: Response) => {
  try {
    const result = knowledgeService.getAdminContent(req.params.pageKey);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: '获取内容失败' });
  }
});

// POST /api/knowledge/admin/content/:pageKey/:itemKey/publish — 发布某 item
router.post('/admin/content/:pageKey/:itemKey/publish', authenticate, requireAdmin, (req: Request, res: Response) => {
  try {
    const { pageKey, itemKey } = req.params;
    knowledgeService.publishContentItem(pageKey, itemKey);
    auditService.write({
      userId: req.user!.userId,
      userName: req.user!.username,
      action: 'settings.update',
      targetType: 'knowledge_content',
      detail: { page_key: pageKey, item_key: itemKey, action: 'publish' },
      ipAddress: req.ip,
    });
    res.json({ success: true, data: { message: '已发布' } });
  } catch (error) {
    res.status(500).json({ success: false, error: '发布失败' });
  }
});

// GET /api/knowledge/admin/notes/:pageKey — Admin 获取说明（含草稿）
router.get('/admin/notes/:pageKey', authenticate, requireAdmin, (req: Request, res: Response) => {
  try {
    const note = knowledgeService.getAdminNote(req.params.pageKey);
    res.json({ success: true, data: { note } });
  } catch (error) {
    res.status(500).json({ success: false, error: '获取说明失败' });
  }
});

// POST /api/knowledge/admin/notes/:pageKey/publish — 发布说明
router.post('/admin/notes/:pageKey/publish', authenticate, requireAdmin, (req: Request, res: Response) => {
  try {
    const { pageKey } = req.params;
    knowledgeService.publishNote(pageKey);
    auditService.write({
      userId: req.user!.userId,
      userName: req.user!.username,
      action: 'settings.update',
      targetType: 'knowledge_notes',
      detail: { page_key: pageKey, action: 'publish' },
      ipAddress: req.ip,
    });
    res.json({ success: true, data: { message: '已发布' } });
  } catch (error) {
    res.status(500).json({ success: false, error: '发布失败' });
  }
});

// PUT /api/knowledge/admin/content/:pageKey/:itemKey — 保存文字内容
router.put('/admin/content/:pageKey/:itemKey', authenticate, requireAdmin, (req: Request, res: Response) => {
  try {
    const { pageKey, itemKey } = req.params;
    const { fields } = req.body as { fields: Record<string, string> };

    if (!fields || typeof fields !== 'object') {
      res.status(400).json({ success: false, error: '缺少 fields 参数' });
      return;
    }

    knowledgeService.upsertContentItem(pageKey, itemKey, fields);

    auditService.write({
      userId: req.user!.userId,
      userName: req.user!.username,
      action: 'settings.update',
      targetType: 'knowledge_content',
      detail: { page_key: pageKey, item_key: itemKey },
      ipAddress: req.ip,
    });

    res.json({ success: true, data: { message: '保存成功' } });
  } catch (error) {
    res.status(500).json({ success: false, error: '保存失败' });
  }
});

// PUT /api/knowledge/admin/notes/:pageKey — 保存本地说明
router.put('/admin/notes/:pageKey', authenticate, requireAdmin, (req: Request, res: Response) => {
  try {
    const { pageKey } = req.params;
    const { content } = req.body as { content: string };

    if (content === undefined) {
      res.status(400).json({ success: false, error: '缺少 content 参数' });
      return;
    }

    knowledgeService.upsertNote(pageKey, content, req.user!.userId);

    auditService.write({
      userId: req.user!.userId,
      userName: req.user!.username,
      action: 'settings.update',
      targetType: 'knowledge_notes',
      detail: { page_key: pageKey },
      ipAddress: req.ip,
    });

    res.json({ success: true, data: { message: '保存成功' } });
  } catch (error) {
    res.status(500).json({ success: false, error: '保存失败' });
  }
});

export default router;
