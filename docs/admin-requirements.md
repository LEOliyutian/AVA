# 雪崩预报系统 — 管理后台需求文档

**版本**：v1.0
**日期**：2026-03-09
**作者**：后端工程规划
**状态**：待评审

---

## 1. 背景与目标

### 1.1 背景

当前系统已具备三级角色体系（visitor / forecaster / admin）、预报编辑、天气观测等核心业务功能。但管理员缺乏对系统运行状态的全局视角，无法追踪操作记录，预报发布也缺少审核环节，存在数据质量和安全隐患。

### 1.2 目标

在**不改动现有技术栈**的前提下，为管理员提供一套完整的内容管理与系统监控能力，具体包括：

- 全局数据统计可视化
- 操作审计追踪
- 预报内容审核流程
- 用户管理能力补全
- 系统配置可视化管理
- 历史数据导出

### 1.3 范围

- **后端**：新增 API 接口、新增 2 张数据库表、预报表小幅扩展字段
- **前端**：新增管理后台专属页面（`/admin/*` 路由）
- **不涉及**：现有业务功能改动、数据库迁移、技术栈更换

---

## 2. 用户角色与权限

| 角色 | 说明 | 管理后台访问权限 |
|---|---|---|
| `admin` | 系统管理员 | 全部功能 |
| `forecaster` | 预报员 | 仅查看自己的操作日志、提交审核 |
| `visitor` | 普通访客 | 无管理后台权限 |

---

## 3. 功能模块详细需求

---

### 3.1 数据统计仪表板

**优先级**：P0
**访问路由**：`/admin/dashboard`
**接口**：`GET /api/admin/stats`
**权限**：仅 admin

#### 3.1.1 功能描述

管理员登录后进入的第一个页面，提供系统整体运行状态的数字概览与图表展示。

#### 3.1.2 统计指标

**概览卡片（数字）**

| 指标 | 说明 |
|---|---|
| 本月已发布预报数 | status = published，当月 |
| 当前草稿数 | status = draft |
| 待审核预报数 | status = pending_review |
| 注册用户总数 | 按角色分组展示 |
| 本月观测记录数 | 当月新增 observations |

**图表**

| 图表 | 类型 | 数据说明 |
|---|---|---|
| 近 30 天预报发布趋势 | 折线图 | 按日统计 published 数量 |
| 危险等级分布 | 饼图 | 历史所有预报中各等级（1-5）占比 |
| 活跃预报员排名 | 柱状图 | 近 30 天发布数量 Top 5 |
| 雪崩问题类型分布 | 饼图 | primary_type 各类型占比 |

#### 3.1.3 接口返回结构

```json
{
  "overview": {
    "published_this_month": 12,
    "drafts": 3,
    "pending_review": 2,
    "total_users": { "admin": 1, "forecaster": 4, "visitor": 20 },
    "observations_this_month": 8
  },
  "charts": {
    "daily_forecasts": [{ "date": "2026-03-01", "count": 2 }],
    "danger_distribution": [{ "level": 3, "count": 15 }],
    "top_forecasters": [{ "name": "张三", "count": 8 }],
    "problem_types": [{ "type": "wind_slab", "count": 10 }]
  }
}
```

---

### 3.2 操作审计日志

**优先级**：P0
**访问路由**：`/admin/audit-logs`
**接口**：`GET /api/admin/audit-logs`
**权限**：admin 查看全部；forecaster 仅查看自己

#### 3.2.1 功能描述

记录所有关键操作，确保每个数据变更都有迹可查。审计日志只读，任何角色包括 admin 均不可删除。

#### 3.2.2 新增数据库表

```sql
CREATE TABLE audit_logs (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id     INTEGER NOT NULL,
  user_name   VARCHAR(100) NOT NULL,       -- 冗余存储，防止用户删除后丢失记录
  action      VARCHAR(50) NOT NULL,        -- 操作类型（见下方枚举）
  target_type VARCHAR(50),                 -- 操作对象类型（forecast / user / observation）
  target_id   INTEGER,                     -- 操作对象 ID
  detail      TEXT,                        -- JSON，记录变更前后的关键字段
  ip_address  VARCHAR(50),
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### 3.2.3 需要记录的操作类型（action 枚举）

| action | 触发时机 |
|---|---|
| `user.login` | 用户登录成功 |
| `user.logout` | 用户登出 |
| `user.create` | 管理员创建用户 |
| `user.role_change` | 修改用户角色 |
| `user.delete` | 删除用户 |
| `user.password_reset` | 管理员重置密码 |
| `user.disable` | 禁用账号 |
| `forecast.create` | 创建预报 |
| `forecast.update` | 更新预报内容 |
| `forecast.submit` | 提交审核 |
| `forecast.approve` | 审核通过发布 |
| `forecast.reject` | 审核驳回 |
| `forecast.archive` | 归档预报 |
| `forecast.delete` | 删除预报 |
| `observation.create` | 创建观测 |
| `observation.delete` | 删除观测 |
| `settings.update` | 修改系统配置 |

#### 3.2.4 查询功能

支持以下过滤条件：

- 按用户筛选（`user_id`）
- 按操作类型筛选（`action`）
- 按对象类型筛选（`target_type`）
- 按时间范围筛选（`start_date` / `end_date`）
- 分页（`page` / `limit`，默认每页 50 条）

#### 3.2.5 前端展示

以时间倒序的列表展示，每条记录显示：

```
[时间] [操作人] [操作描述] [IP]
例：2026-03-09 14:23  管理员  将用户「李四」的角色从 visitor 改为 forecaster  192.168.1.1
```

---

### 3.3 预报审核工作流

**优先级**：P1
**访问路由**：`/admin/review`
**权限**：admin 审核；forecaster 提交

#### 3.3.1 背景

当前预报员可直接发布预报，缺乏质量把控。新增审核环节，要求预报员提交后由管理员审核方可对外发布。

#### 3.3.2 状态流转

```
draft → pending_review → published
                      ↘ rejected → draft（可修改后再次提交）
```

| 状态 | 说明 | 可执行操作 |
|---|---|---|
| `draft` | 草稿 | forecaster 可编辑、提交审核 |
| `pending_review` | 待审核 | admin 可审核通过或驳回；forecaster 不可编辑 |
| `published` | 已发布 | admin 可归档 |
| `rejected` | 已驳回 | forecaster 可查看驳回原因、修改后重新提交 |
| `archived` | 已归档 | 只读 |

#### 3.3.3 数据库变更

在 `forecasts` 表新增字段：

```sql
ALTER TABLE forecasts ADD COLUMN reviewer_id   INTEGER REFERENCES users(id);
ALTER TABLE forecasts ADD COLUMN reviewed_at   DATETIME;
ALTER TABLE forecasts ADD COLUMN reject_reason TEXT;
```

#### 3.3.4 新增接口

| 方法 | 路径 | 权限 | 说明 |
|---|---|---|---|
| `POST` | `/api/forecasts/:id/submit` | forecaster | 提交审核，状态改为 pending_review |
| `POST` | `/api/forecasts/:id/approve` | admin | 审核通过，状态改为 published |
| `POST` | `/api/forecasts/:id/reject` | admin | 驳回，需附 reject_reason |
| `GET` | `/api/admin/pending-forecasts` | admin | 获取所有待审核预报列表 |

#### 3.3.5 前端展示

**管理员视角**（`/admin/review`）：
- 待审核列表，每条显示：预报日期、提交人、危险等级、提交时间
- 点击进入预报详情预览
- 底部操作栏：「通过发布」/ 「驳回」按钮
- 驳回弹窗：必须填写驳回原因（不少于 10 字）

**预报员视角**（在现有预报编辑页）：
- 草稿状态下显示「提交审核」按钮
- 待审核状态下显示「审核中，不可编辑」提示
- 驳回状态下显示驳回原因红色提示框，「修改并重新提交」按钮

---

### 3.4 用户管理完善

**优先级**：P1
**访问路由**：`/admin/users`
**权限**：仅 admin

#### 3.4.1 现有接口已覆盖

- 获取用户列表 `GET /api/users`
- 修改角色 `PUT /api/users/:id/role`
- 更新基本信息 `PUT /api/users/:id`
- 重置密码 `POST /api/users/:id/reset-password`
- 删除用户 `DELETE /api/users/:id`

#### 3.4.2 需要补充的接口

| 方法 | 路径 | 说明 |
|---|---|---|
| `GET` | `/api/admin/users?role=&page=&keyword=` | 分页 + 角色筛选 + 关键词搜索 |
| `POST` | `/api/admin/users` | 管理员直接创建用户（无需注册流程） |
| `PUT` | `/api/users/:id/status` | 禁用 / 启用账号（is_active 字段） |
| `GET` | `/api/admin/users/:id/activity` | 查看某用户的操作历史（从 audit_logs 聚合） |

#### 3.4.3 数据库变更

在 `users` 表新增字段：

```sql
ALTER TABLE users ADD COLUMN is_active BOOLEAN DEFAULT TRUE;
-- is_active = false 时登录接口返回 403，提示账号已被禁用
```

#### 3.4.4 前端展示

用户列表页需要：
- 表格展示：头像占位、用户名、显示名、角色徽章、状态（启用/禁用）、最后登录时间、操作列
- 顶部筛选栏：角色下拉、状态下拉、搜索框
- 操作列按钮：编辑、重置密码、禁用/启用、删除（需二次确认）
- 新建用户按钮（弹窗表单：用户名、密码、显示名、角色）

---

### 3.5 系统配置管理

**优先级**：P2
**访问路由**：`/admin/settings`
**接口**：`GET/PUT /api/admin/settings`
**权限**：仅 admin

#### 3.5.1 功能描述

将目前硬编码在代码中的配置项迁移到数据库，管理员可通过界面修改，无需改代码重启服务。

#### 3.5.2 新增数据库表

```sql
CREATE TABLE system_settings (
  key         VARCHAR(100) PRIMARY KEY,
  value       TEXT NOT NULL,
  type        VARCHAR(20) NOT NULL,   -- string / number / boolean / json
  label       VARCHAR(100) NOT NULL,  -- 界面显示名称
  description TEXT,
  updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_by  INTEGER REFERENCES users(id)
);
```

#### 3.5.3 初始配置项

| key | label | 默认值 | type |
|---|---|---|---|
| `resort_name` | 滑雪场名称 | 吉克普林滑雪场 | string |
| `resort_contact` | 联系电话 | — | string |
| `forecast_validity_hours` | 预报有效时长（小时） | 24 | number |
| `allow_visitor_register` | 允许游客自主注册 | true | boolean |
| `max_danger_level` | 最高危险等级上限 | 5 | number |
| `review_required` | 是否启用审核流程 | true | boolean |

#### 3.5.4 接口

```
GET  /api/admin/settings          → 返回所有配置项列表
PUT  /api/admin/settings/:key     → 更新单个配置项
```

---

### 3.6 数据导出

**优先级**：P3
**访问路由**：`/admin/export`
**接口**：`GET /api/admin/export/:type`
**权限**：仅 admin

#### 3.6.1 支持导出的数据类型

| type | 内容 | 格式 |
|---|---|---|
| `forecasts` | 预报历史（支持日期范围筛选） | CSV / JSON |
| `weather` | 天气观测数据 | CSV |
| `observations` | 野外观测记录 | CSV |
| `audit-logs` | 操作日志 | CSV |
| `users` | 用户列表（不含密码） | CSV |

#### 3.6.2 接口参数

```
GET /api/admin/export/forecasts?start=2026-01-01&end=2026-03-09&format=csv
```

#### 3.6.3 前端展示

简单表单页：选择导出类型、日期范围、格式，点击「导出」即触发文件下载。

---

## 4. 数据库变更汇总

### 4.1 新增表

| 表名 | 说明 |
|---|---|
| `audit_logs` | 操作审计日志 |
| `system_settings` | 系统配置键值对 |

### 4.2 现有表新增字段

| 表名 | 新增字段 | 说明 |
|---|---|---|
| `forecasts` | `reviewer_id` | 审核人 ID |
| `forecasts` | `reviewed_at` | 审核时间 |
| `forecasts` | `reject_reason` | 驳回原因 |
| `users` | `is_active` | 账号启用状态 |

---

## 5. 新增 API 接口汇总

| 方法 | 路径 | 权限 | 优先级 |
|---|---|---|---|
| `GET` | `/api/admin/stats` | admin | P0 |
| `GET` | `/api/admin/audit-logs` | admin / forecaster(自己) | P0 |
| `GET` | `/api/admin/pending-forecasts` | admin | P1 |
| `POST` | `/api/forecasts/:id/submit` | forecaster | P1 |
| `POST` | `/api/forecasts/:id/approve` | admin | P1 |
| `POST` | `/api/forecasts/:id/reject` | admin | P1 |
| `GET` | `/api/admin/users` | admin | P1 |
| `POST` | `/api/admin/users` | admin | P1 |
| `PUT` | `/api/users/:id/status` | admin | P1 |
| `GET` | `/api/admin/users/:id/activity` | admin | P1 |
| `GET` | `/api/admin/settings` | admin | P2 |
| `PUT` | `/api/admin/settings/:key` | admin | P2 |
| `GET` | `/api/admin/export/:type` | admin | P3 |

---

## 6. 前端页面规划

| 页面 | 路由 | 优先级 |
|---|---|---|
| 管理仪表板 | `/admin/dashboard` | P0 |
| 操作日志 | `/admin/audit-logs` | P0 |
| 预报审核队列 | `/admin/review` | P1 |
| 用户管理 | `/admin/users` | P1 |
| 系统配置 | `/admin/settings` | P2 |
| 数据导出 | `/admin/export` | P3 |

所有 `/admin/*` 路由在前端侧需增加角色守卫，非 admin 用户访问时重定向至首页。

---

## 7. 开发优先级与阶段规划

### Phase 1（核心监控）
- 审计日志表 + 写入逻辑嵌入现有接口
- 数据统计仪表板接口 + 页面

### Phase 2（流程管控）
- 预报审核工作流接口 + 前端交互
- 用户管理接口补全 + 完善用户列表页

### Phase 3（运维效率）
- 系统配置管理
- 数据导出功能

---

## 8. 非功能性要求

- **审计日志不可删除**：接口层禁止暴露 DELETE 操作，数据库层可通过触发器保护
- **导出文件大小限制**：单次导出不超过 10,000 条，超出需分批
- **管理接口统一前缀**：所有新增管理接口统一使用 `/api/admin/` 前缀，便于统一鉴权中间件
- **禁用账号即时生效**：`is_active = false` 后，该用户现有 JWT token 在下次请求时应被拒绝（建议维护 token 黑名单或缩短 token 有效期）
