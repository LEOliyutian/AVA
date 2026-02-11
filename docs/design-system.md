# TaigaSnow Design System

> 本文档定义了 TaigaSnow 雪崩预报系统的统一设计规范，所有页面和组件都应遵循此规范以保持视觉一致性。

---

## 1. 色彩体系

### 1.1 品牌色 / 强调色

| Token | Light | Dark | 用途 |
|-------|-------|------|------|
| `--accent` | `#0ea5e9` (sky-500) | `#38bdf8` (sky-400) | 品牌色、链接、导航激活态、CTA |
| `--accent-hover` | `#0284c7` (sky-600) | `#0ea5e9` | 悬停态 |
| `--accent-bg` | `rgba(14,165,233,0.12)` | `rgba(56,189,248,0.15)` | 激活背景 |
| `--accent-border` | `#e0f2fe` (sky-100) | `#0c4a6e` | 卡片边框强调 |

### 1.2 中性色 (Slate)

| Token | Light | Dark | 用途 |
|-------|-------|------|------|
| `--text-primary` | `#0f172a` (slate-900) | `#f1f5f9` (slate-100) | 标题、强调文字 |
| `--text-secondary` | `#334155` (slate-700) | `#cbd5e1` (slate-300) | 正文 |
| `--text-muted` | `#64748b` (slate-500) | `#94a3b8` (slate-400) | 标签、说明 |
| `--text-tertiary` | `#94a3b8` (slate-400) | `#64748b` (slate-500) | 最弱文字 |
| `--bg-page` | `#f0f9ff` → `#fff` 渐变 | `#0f172a` | 页面底色 |
| `--bg-card` | `#ffffff` | `#1e293b` | 卡片背景 |
| `--bg-subtle` | `#f8fafc` / `#f1f5f9` | `#334155` | 输入框、hover 底色 |
| `--border-default` | `#e2e8f0` (slate-200) | `#334155` | 分割线、通用边框 |
| `--border-accent` | `#e0f2fe` (sky-100) | `#1e3a5f` | 带天蓝调的卡片边框 |
| `--border-hover` | `#bae6fd` / `#7dd3fc` | `#0284c7` | Hover 高亮边框 |

### 1.3 数据可视化色

| 色名 | Hex | 用途 |
|------|-----|------|
| Orange | `#f97316` | 气温曲线、暖趋势 |
| Cyan | `#22d3ee` | 雪面温度、风速 |
| Purple | `#a855f7` | 10cm 雪温、H24 新雪 |
| Blue | `#3b82f6` | 雪深 HS |
| Red | `#ef4444` | 零度线、警告 |

### 1.4 危险等级色 (国际标准)

| Level | Hex | 中文 | English |
|-------|-----|------|---------|
| 1 | `#5cb85c` | 低风险 | Low |
| 2 | `#f0ad4e` | 中等风险 | Moderate |
| 3 | `#ff9800` | 显著危险 | Considerable |
| 4 | `#d9534f` | 高危 | High |
| 5 | `#292b2c` | 极端危险 | Extreme |

---

## 2. 字体

### 2.1 字体栈

```css
/* 正文 */
font-family: 'Segoe UI', 'Roboto', 'Noto Sans SC', sans-serif;
/* 数据/等宽 */
font-family: 'SF Mono', 'Consolas', 'Monaco', monospace;
```

### 2.2 字号规范

| 尺寸 | 用途 |
|------|------|
| 10px | Tag 标签、微型文字、大写标注 |
| 11px | 坐标轴标签、表头、次级标注 |
| 12px | 正文小、链接、按钮、表格单元格 |
| 13px | 导航项、表单标签、正文 |
| 14-15px | 区块正文、卡片标签 |
| 17-18px | 卡片标题、小节标题 |
| 20px | 区块标题 |
| 24px | 数据数值 (等宽字体) |
| 32px | 大区块标题 |
| 48px | Hero 超大标题/数字 |

### 2.3 字重

| Weight | 用途 |
|--------|------|
| `900` | 品牌名、危险等级数字、区块大标题、大写标签 |
| `800` | 表单组标题、等级说明 |
| `700` | 标题、数据数值、按钮、链接 |
| `600` | 站点名、导航激活、二级标题 |
| `500` | 正文、导航、说明文字 |

### 2.4 大写微标签模式

```css
font-size: 10px;
font-weight: 700;
letter-spacing: 0.1em ~ 0.2em;
text-transform: uppercase;
color: var(--text-muted);
```

---

## 3. 间距与布局

### 3.1 页面宽度
- 内容最大宽度：`1440px`
- Dashboard 最大宽度：`1400px`

### 3.2 圆角 (Border Radius)

| 尺寸 | 值 | 用途 |
|------|-----|------|
| XS | `4px` | 热力图单元格 |
| SM | `6px` | 输入框、小按钮 |
| MD | `10-12px` | 卡片、图表容器、面板 |
| LG | `16px` | 功能卡片、区域项、Bento 卡片 |
| XL | `24px` | Hero 区域、大区块 |
| Pill | `9999px` | Tag 标签、药丸按钮 |

### 3.3 阴影

```css
/* 微弱 */
box-shadow: 0 2px 12px rgba(14, 165, 233, 0.04);
/* 标准 */
box-shadow: 0 4px 20px rgba(14, 165, 233, 0.06);
/* Hover 强调 */
box-shadow: 0 12px 40px rgba(14, 165, 233, 0.12);
/* 重型 (Hero/浮动面板) */
box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
```

### 3.4 间距

| 场景 | 值 |
|------|-----|
| 大区块间距 | `64px` |
| 中区块间距 | `48px` |
| 卡片间距 | `24px` |
| 图表/小卡片间距 | `16px` |
| 大卡片内边距 | `32-48px` |
| 标准内边距 | `24px` |
| 紧凑内边距 | `16px` |

---

## 4. 组件规范

### 4.1 导航栏 (Header)
- 高度：`56px`，`position: sticky; top: 0`
- 背景：半透明白 `rgba(255,255,255,0.92)` + `backdrop-filter: blur(20px)`
- 底边框：`1px solid #e2e8f0`
- 激活导航项：天蓝色文字 + 浅蓝背景

### 4.2 卡片 (Card)
- 白底 + `border: 1px solid #e0f2fe` + `border-radius: 16px`
- 天蓝色调微阴影
- Hover：阴影增强 + 边框变亮至 `#bae6fd`
- 可选左侧强调条：`width: 4px; background: var(--card-accent)`

### 4.3 按钮

| 类型 | 样式 |
|------|------|
| Primary (深色) | `bg: #0f172a; color: white; border-radius: 12px; font-weight: 700` |
| Primary SM (药丸) | `bg: #0f172a; border-radius: 9999px; font-size: 12px` |
| CTA (天蓝) | `bg: #0ea5e9; color: white; border-radius: 8px; box-shadow: sky glow` |
| Ghost/Secondary | `bg: transparent/white; border: 1px solid #e2e8f0; border-radius: 12px` |
| Range (分段控制) | `border: 1px solid; border-radius: 6px; overflow: hidden` 组合按钮 |

### 4.4 表格

- 表头：`bg: #f8fafc; font-size: 11px; font-weight: 700-900; uppercase; letter-spacing: 0.1em; color: #94a3b8`
- 数据行：`font-size: 12-13px; border-bottom: 1px solid #f1f5f9`
- 数据数字：等宽字体
- 行悬停：微弱背景变化
- 条件格式：温度接近0°红底、大雪紫底、强风橙底

### 4.5 表单

- 输入框：`padding: 7-8px; border: 1px solid; border-radius: 6px; font-size: 12px`
- 聚焦态：`border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-bg)`
- 标签：`font-size: 10-11px; font-weight: 500-700; uppercase; letter-spacing: 0.3-0.5px`

### 4.6 区块标题

**模式 A - 带横线**
```
标题文字 ——————————————
```
`<h3>Title</h3>` + `<div className="header-line">` (flex: 1, 1px 灰线)

**模式 B - Tag 式**
```
[TAG 标签]
大标题
副标题说明
```
Tag: 药丸形、大写、天蓝色渐变背景

### 4.7 图表 (SVG)

- 容器：`border-radius: 10px; padding: 20px; border: 1px solid var(--border-color)`
- 坐标轴标签：`font-size: 10px; fill: var(--text-tertiary); font-family: mono`
- 网格线：`stroke-dasharray: 3,3; stroke: var(--grid-color)`
- 数据线颜色：橙/青/紫/蓝 四色体系

---

## 5. 动效

| 场景 | 规范 |
|------|------|
| 通用过渡 | `transition: all 0.2s` 或 `0.15s` |
| 卡片悬停 | `transition: all 0.3s; transform: translateY(-2px)` |
| 加载动画 | `animation: spin 0.8s linear infinite` + accent 色 border-top |
| 浮动元素 | `backdrop-filter: blur(20px)` |

---

## 6. 响应式断点

| 断点 | 变化 |
|------|------|
| `1280px` | 双栏 → 单栏，侧边栏变为 3 列 grid |
| `1024px` | 隐藏导航菜单，侧边栏变单列 |
| `768px` | Hero 缩小，功能卡片单列 |
| `480px` | 紧凑间距 |

---

## 7. 深色模式

通过 `[data-theme="dark"]` 选择器覆盖。核心变化：
- 背景：白 → `#0f172a` / `#1e293b`
- 文字：深灰 → `#f1f5f9` / `#d1d5db`
- 边框：浅灰 → `#334155`
- 阴影：透明度增加
- 强调色：`#0ea5e9` → `#38bdf8` (更亮)
