# TaigaSnow Design System — 速查版

> 完整规范见 `docs/design-system.md`。UI 任务时用 `@.claude/context/design-system.md` 引用本文件。

---

## 色彩 Tokens

### 品牌色
| Token | Light | Dark |
|-------|-------|------|
| `--accent` | `#0ea5e9` | `#38bdf8` |
| `--accent-hover` | `#0284c7` | `#0ea5e9` |
| `--accent-bg` | `rgba(14,165,233,0.12)` | `rgba(56,189,248,0.15)` |

### 文字与背景
| Token | Light | Dark |
|-------|-------|------|
| `--text-primary` | `#0f172a` | `#f1f5f9` |
| `--text-secondary` | `#334155` | `#cbd5e1` |
| `--text-muted` | `#64748b` | `#94a3b8` |
| `--bg-card` | `#ffffff` | `#1e293b` |
| `--bg-subtle` | `#f8fafc` | `#334155` |
| `--border-default` | `#e2e8f0` | `#334155` |
| `--border-hover` | `#bae6fd` | `#0284c7` |

### 危险等级色（国际标准，必须同时用颜色+数字+文字）
| Level | Hex | 中文 |
|-------|-----|------|
| 1 | `#5cb85c` | 低风险 |
| 2 | `#f0ad4e` | 中等 |
| 3 | `#ff9800` | 显著 |
| 4 | `#d9534f` | 高危 |
| 5 | `#292b2c` | 极端 |

---

## 圆角
- 输入框/小按钮：`6px`
- 卡片/面板：`12-16px`
- 药丸标签/按钮：`9999px`

## 阴影
```css
/* 卡片标准 */ box-shadow: 0 4px 20px rgba(14,165,233,0.06);
/* Hover */    box-shadow: 0 12px 40px rgba(14,165,233,0.12);
```

## 间距
- 卡片间距：`24px`
- 卡片内边距：`24-32px`
- 图表容器内边距：`20px`

---

## 字体

```css
font-family: 'Segoe UI', 'Roboto', 'Noto Sans SC', sans-serif;  /* 正文 */
font-family: 'SF Mono', 'Consolas', 'Monaco', monospace;         /* 数据 */
```

| 尺寸 | 用途 |
|------|------|
| 10-11px | 表头、大写标签 |
| 12-13px | 正文、按钮 |
| 17-18px | 卡片标题 |
| 24px | 数据数值（等宽） |
| 32-48px | 大标题、Hero |

**大写微标签模式：** `font-size: 10-11px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--text-muted)`

---

## 组件规范

### 卡片
```css
background: var(--bg-card);
border: 1px solid #e0f2fe;
border-radius: 16px;
box-shadow: 0 4px 20px rgba(14,165,233,0.06);
transition: all 0.3s;
```
Hover：`translateY(-2px)` + 增强阴影 + `border-color: #bae6fd`

### 按钮
- **Primary (深)**: `bg: #0f172a; color: white; border-radius: 12px; font-weight: 700`
- **CTA (蓝)**: `bg: #0ea5e9; color: white; border-radius: 8px`
- **Ghost**: `bg: transparent; border: 1px solid #e2e8f0; border-radius: 12px`

### 表格表头
```css
background: #f8fafc;
font-size: 11px;
font-weight: 700-900;
text-transform: uppercase;
letter-spacing: 0.1em;
color: #94a3b8;
```

### 输入框
```css
padding: 7-8px 12px;
border: 1px solid var(--border-default);
border-radius: 6px;
font-size: 12px;
/* focus */
border-color: var(--accent);
box-shadow: 0 0 0 3px var(--accent-bg);
```

---

## 动效
- 通用：`transition: all 0.2s`
- 卡片 hover：`transition: all 0.3s; transform: translateY(-2px)`

## 深色模式
选择器：`[data-theme="dark"]`，覆盖上方 Token 中的 Dark 列值。
