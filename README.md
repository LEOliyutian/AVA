# 🏔️ Avalanche Forecast Platform (AVA)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61dafb.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646cff.svg)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933.svg)](https://nodejs.org/)

**[English]** | [中文](#中文介绍)

---

## 📖 Introduction

**Avalanche Forecast (AVA)** is a professional-grade web application designed for creating, managing, and visualizing avalanche forecasts. It empowers forecasters with modern tools to analyze snow stability, assess risks, and communicate danger levels effectively.

Built with a performance-first architecture, AVA combines a responsive **React** frontend with a robust **Node.js** backend, ensuring reliability for critical safety operations.

### ✨ Key Features

- **Interactive Forecast Editor**: extensive tools for entering forecast data, including danger ratings and problem types.
- **Advanced Visualizations**:
  - 🌹 **Rose Diagrams**: Visualize danger distribution across aspect and elevation.
  - 📊 **Risk Matrix**: Interactive danger scale assessments.
  - ❄️ **Snow Profiles**: Detailed plotting of snowpack layering and stability tests.
- **Comprehensive Data Management**: Record weather observations, stability tests, and field data.
- **Secure Authentication**: Role-based access control for forecasters and administrators.
- **Export & Reporting**: Generate clear, standardized avalanche bulletins.

---

## 🛠️ Tech Stack

#### Frontend (Client)
- **Framework**: React 19 + Vite (Ultra-fast build & HMR)
- **Language**: TypeScript (Strict type safety)
- **State Management**: Zustand + Immer (Efficient, immutable state)
- **Styling**: Vanilla CSS (High performance, custom design system)
- **Routing**: React Router 7

#### Backend (Server)
- **Runtime**: Node.js + Express
- **Database**: SQLite (via `better-sqlite3`) for robust, local-first data integrity
- **Security**: JWT & Bcrypt for auth, Helmet for HTTP security

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or pnpm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/LEOliyutian/AVA.git
   cd avalanche-forecast
   ```

2. **Setup Server**
   ```bash
   cd server
   npm install
   npm run db:init  # Initialize SQLite database
   npm run dev      # Start backend on http://localhost:3000
   ```

3. **Setup Client**
   Open a new terminal:
   ```bash
   # In root directory
   npm install
   npm run dev      # Start frontend on http://localhost:5173
   ```

---

<a name="中文介绍"></a>

# 🏔️ 雪崩预报平台 (AVA)

> 专业级雪崩风险评估与管理系统

**AVA** 是一个为雪崩预报员，雪崩安全知识的学习者设计的 Web 应用程序，致力于提供高效的数据录入、风险分析和可视化工具、以及相关的雪崩安全教育内容。它帮助专业人员更准确地评估雪层稳定性，并高效传达雪崩危险等级，也帮助雪崩安全学习者更高效的学习。


### ✨ 核心功能

- **交互式预报编辑器**：提供直观的界面用于录入雪崩问题、危险等级和天气数据。
- **高级可视化图表**：
  - 🌹 **玫瑰图 (Rose Diagram)**：直观展示不同朝向和海拔的危险分布。
  - 📊 **风险矩阵 (Risk Matrix)**：交互式的危险等级评估矩阵。
  - ❄️ **雪层剖面 (Snow Profiles)**：详细记录和绘制雪层结构及稳定性测试结果。
- **全方位数据管理**：集成天气观测、野外测试数据和历史预报记录。
- **安全鉴权**：基于角色的用户权限管理系统，确保数据安全。
- **报告导出**：生成符合行业标准的雪崩公告。

---

## 🛠️ 技术栈

#### 前端 (Client)
- **核心框架**：React 19 + Vite (极速构建与热更新)
- **开发语言**：TypeScript (全链路类型安全)
- **状态管理**：Zustand + Immer (高效、不可变数据流)
- **样式方案**：原生 CSS (极致性能，定制化设计系统)
- **路由管理**：React Router 7

#### 后端 (Server)
- **运行环境**：Node.js + Express
- **数据库**：SQLite (使用 `better-sqlite3`)
- **安全机制**：JWT 认证, Bcrypt 加密, Helmet 安全防护

---

## 🚀 快速开始

### 环境要求
- Node.js (v18 或更高版本)
- npm 或 pnpm

### 安装步骤

1. **克隆项目**
   ```bash
   git clone https://github.com/LEOliyutian/AVA.git
   cd avalanche-forecast
   ```

2. **启动后端服务**
   ```bash
   cd server
   npm install
   npm run db:init  # 初始化数据库
   npm run dev      # 启动服务 (默认端口 3000)
   ```

3. **启动前端应用**
   回到根目录或打开新终端：
   ```bash
   # 在项目根目录下
   npm install
   npm run dev      # 启动前端 (默认端口 5173)
   ```

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---
*Built with ❤️ for Snow Safety*
