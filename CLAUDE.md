# CLAUDE.md — TaigaSnow 雪崩预报系统

## 项目身份

- 系统名：TaigaSnow 雪崩预报系统 / 吉克普林滑雪场
- 版本：v0.1.0
- 仓库：https://github.com/LEOliyutian/AVA
- 需求文档：`docs/admin-requirements.md`

---

## 当前状态（重要）

- **正在进行**：Admin 后台 Phase 1（审计日志 + 数据统计仪表板）
- **已创建文件**：
  - `src/pages/AdminDashboardPage.tsx` / `.css`
  - `src/pages/AuditLogPage.tsx` / `.css`
  - `src/api/admin.api.ts`
  - `server/src/routes/admin.routes.ts`
  - `server/src/services/admin.service.ts`
  - `server/src/services/audit.service.ts`
  - `server/src/db/admin-schema.sql`
- **下一步**：审核工作流（预报 `pending_review` 状态流转，Phase 1 → Phase 2）

---

## 技术栈

| 层 | 技术 | 端口 |
|---|---|---|
| 前端 | React 19 + TypeScript + Vite + Zustand + React Router v7 | 5173 |
| 后端 | Express 5 + TypeScript + better-sqlite3（同步 API） | 3001 |
| 数据库 | SQLite，路径 `server/data/avalanche.db` | — |

---

## 目录地图

```
src/
  api/              API 请求层（每模块一个文件）
    client.ts       axios 实例 + JWT 拦截器（所有请求必须走这里）
    forecast.api.ts / weather.api.ts / observation.api.ts
    auth.api.ts / admin.api.ts
  pages/            页面组件（每页 .tsx + .css 成对）
  store/            Zustand 状态管理
  App.tsx           路由入口（所有路由集中在此注册）

server/src/
  routes/           Express 路由（每模块一个文件，建好后在 app.ts 注册）
  services/         业务逻辑层（路由不写 SQL，交给 service）
  middleware/       Express 中间件（authMiddleware、adminMiddleware 等）
  config/
    database.ts     SQLite 连接 + 自动迁移（runMigrations，加字段只能在这里）
    index.ts        端口、JWT、CORS 配置
  db/
    init.ts         数据库初始化脚本
    *.sql           Schema 定义

.claude/
  .skills/          Claude Code Skills（斜杠命令）
  doc.txt           完整工程规范（补充详情）
  settings.json

docs/
  admin-requirements.md   Admin 后台完整需求文档
  design-system.md        UI 设计规范（色彩、字体、间距）

start.bat / start.sh      一键启动（前端 + 后端）
push.bat  / push.sh       一键提交 GitHub
```

---

## 编码约定（硬规则）

### 数据库
- **加字段**：只在 `server/src/config/database.ts` 的 `runMigrations()` 中写 `ALTER TABLE`，**不改原始 schema.sql**
- 不直接操作 `server/data/avalanche.db`，不改 `.env` / 密钥

### 前端
- 所有 API 请求走 `src/api/client.ts`（axios 实例，含 JWT 拦截器），**不直接 fetch**
- 新页面三步骤：`.tsx` + `.css` 成对 → `src/pages/index.ts` 导出 → `App.tsx` 注册路由
- 状态管理用 Zustand，页面挂载时调 `fetchXxx()` 初始化数据

### 后端
- 分层：`routes` → `services` → `database.ts`，路由层不写 SQL
- `better-sqlite3` 是**同步 API**，无 `async/await`
- 新路由文件建好后必须在 `server/src/app.ts` 注册
- Admin 接口统一走 `/api/admin/` 前缀，自动挂 `adminMiddleware` 鉴权
- `audit_logs` 表已建，关键操作写接口时考虑记录审计日志

### 命名
- 文件：`kebab-case`（`forecast.service.ts`）
- 组件：`PascalCase`（`ForecastDashboardPage.tsx`）
- 变量/函数：`camelCase`
- 数据库字段：`snake_case`

### 通用
- 全项目 TypeScript，禁止 `any`（特殊情况需注释）
- 只改任务涉及的代码，不顺带重构无关内容
- 不自动加注释、docstring、`console.log`
- 不引入新三方库（除非明确要求）

---

## Claude 行为约定

- **动手前先读文件**，理解现有代码再修改
- 新增功能前确认对应 route / service / api 文件是否存在
- 禁止删除现有功能（除非明确要求）
- 提交格式：`feat:` / `fix:` / `refactor:` / `docs:`，用 `push.bat` / `./push.sh`

---

## 常用命令

```bash
# 启动（推荐）
start.bat           # Windows
./start.sh          # Unix

# 手动启动
cd server && npm run dev    # 后端 :3001
npm run dev                 # 前端 :5173

# 数据库初始化（首次）
cd server && npm run db:init

# 提交
push.bat / ./push.sh

# 同步 GitHub 最新代码
sync.bat / ./sync.sh
```

访问：前端 `http://localhost:5173` | API `http://localhost:3001/api`

---

## 可用 Skills（斜杠命令）

| 命令 | 触发方式 | 用途 |
|------|---------|------|
| `/Leo-UI` | `/Leo-UI` | UI/UX 设计师，设计页面或评审界面 |
| `/pm` | `/pm` 或 `/product-manager` | 产品经理，分析需求或写 PRD |
| `/be` | `/be` 或 `/backend-engineer` | 后端工程师，设计 API / Schema / 服务层 |
| `/debug` | `/debug` 或 `/full-stack-debugger` | 全栈调试员，排查 bug |
