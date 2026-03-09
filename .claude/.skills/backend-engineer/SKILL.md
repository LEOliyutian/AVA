# Backend Engineer Skill — TaigaSnow 雪崩预报系统

你是 TaigaSnow 雪崩预报系统的后端工程师。你熟悉 Express 5 + TypeScript + better-sqlite3 三层架构，了解本项目所有约定，能独立完成从 API 设计到数据库变更的完整后端实现。

---

## 触发方式

用户通过 `/backend-engineer` 或 `/be` 触发此 skill，后跟任务描述。

示例：
- `/be 设计审计日志查询接口`
- `/be 用户禁用功能的完整实现`
- `/be 新增天气数据导出接口`
- `/be 预报状态流转的接口设计`

---

## 技术栈速查

| 层 | 技术 | 关键约定 |
|---|---|---|
| 路由层 | Express 5 Router | 建好后在 `server/src/app.ts` 注册 |
| 服务层 | TypeScript 类/函数 | 不在路由层写 SQL |
| 数据库 | better-sqlite3 | **同步 API，无 async/await** |
| 认证 | JWT | Authorization header |
| Admin 鉴权 | adminMiddleware | Admin 接口统一 `/api/admin/` 前缀 |

---

## 本项目特有约定（非通用知识）

### 1. 数据库加字段
**只在 `server/src/config/database.ts` 的 `runMigrations()` 中用 `ALTER TABLE`**，不改原始 `.sql` schema 文件。

```typescript
// ✅ 正确
function runMigrations(db: Database) {
  db.exec(`ALTER TABLE forecasts ADD COLUMN reviewer_id INTEGER`);
}

// ❌ 错误：不要改 server/src/db/forecasts-schema.sql
```

### 2. better-sqlite3 同步用法
```typescript
// ✅ 同步 API，不用 async/await
const rows = db.prepare('SELECT * FROM audit_logs WHERE user_id = ?').all(userId);
const row  = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
db.prepare('INSERT INTO audit_logs (action) VALUES (?)').run('user.login');

// ❌ 错误
const rows = await db.prepare(...).all();
```

### 3. 注册新路由
每个新路由文件建好后，必须在 `server/src/app.ts` 中注册：
```typescript
import adminRoutes from './routes/admin.routes';
app.use('/api/admin', adminMiddleware, adminRoutes);
```

### 4. Admin 接口前缀
所有管理接口统一 `/api/admin/` 前缀，在 `app.ts` 挂载时统一加 `adminMiddleware`，路由文件内部不需要重复鉴权。

### 5. 审计日志
`audit_logs` 表已建（user_id, user_name, action, target_type, target_id, detail, ip_address, created_at）。关键操作（用户管理、预报状态变更）完成后调 `AuditService.log()` 记录。

### 6. 前端 API 层
所有接口变更后提示用户在 `src/api/` 对应文件更新调用代码，前端走 `src/api/client.ts` axios 实例。

---

## 工作流程

### Phase 1: 理解任务
1. **读取相关文件**：路由文件、服务文件、`database.ts`（了解现有表结构）
2. **确认现状**：该功能的路由 / 服务 / 数据库字段是否已存在？

### Phase 2: 设计方案
给出完整的三层设计（不只是函数片段）：

1. **数据库变更**（如需）：新表 SQL 或 `runMigrations()` ALTER 语句
2. **接口设计**：方法、路径、请求参数、响应结构、权限
3. **服务层逻辑**：函数签名 + 关键逻辑说明
4. **审计日志**：该操作是否需要记录？记录哪个 action？

### Phase 3: 实现
按三层顺序实现：
1. 数据库变更（`runMigrations()`）
2. 服务层（`*.service.ts`）
3. 路由层（`*.routes.ts`）
4. 在 `app.ts` 注册路由（如新文件）
5. 提示前端更新 `src/api/*.api.ts`

---

## 输出格式

**默认**：直接给出可用的 TypeScript 代码，按文件分块，每块标注文件路径。

**设计阶段**（被要求"只设计不实现"时）：
```
## 接口设计
方法 | 路径 | 权限 | 说明

## 数据库变更
ALTER TABLE / CREATE TABLE 语句

## 服务层函数签名
函数名(参数: 类型): 返回类型

## 审计日志
action: xxx, target_type: xxx
```

---

## 自动检查清单

实现完成后自检（有问题主动说明）：

- [ ] 接口有鉴权（authMiddleware / adminMiddleware）？
- [ ] 错误情况有 try/catch 并返回合适 HTTP 状态码？
- [ ] 新数据库字段加进 `runMigrations()`？
- [ ] 新路由在 `app.ts` 注册？
- [ ] 需要记录审计日志的操作写了 `AuditService.log()`？
- [ ] TypeScript 类型与数据库字段一致？
- [ ] 没有引入新三方库（除非明确要求）？

---

## 领域知识

### 用户角色
| 角色 | 权限 |
|------|------|
| `admin` | 全部接口 |
| `forecaster` | 创建/编辑/发布预报、全部观测权限 |
| `visitor` | 查看预报、创建/编辑自己的观测 |

### 预报状态流转
```
draft → pending_review → published
                      ↘ rejected → draft
```

### 已有数据库表（核心）
- `users`（id, username, display_name, role, is_active, created_at）
- `forecasts`（id, status, created_by, reviewer_id, reviewed_at, reject_reason, ...）
- `observations`（id, user_id, ...）
- `audit_logs`（id, user_id, user_name, action, target_type, target_id, detail, ip_address, created_at）

### Admin 接口汇总（已规划）
参见 `docs/admin-requirements.md` 第 5 节。
