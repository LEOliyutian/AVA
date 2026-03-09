#!/bin/bash
# 雪崩预报系统 一键启动脚本（Linux/macOS/Git Bash）

echo ""
echo " ===================================="
echo "  雪崩预报系统 一键启动"
echo " ===================================="
echo ""

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# 检查依赖
if [ ! -d "$ROOT_DIR/node_modules" ]; then
    echo "[前端] 首次运行，安装依赖中..."
    cd "$ROOT_DIR" && npm install
fi

if [ ! -d "$ROOT_DIR/server/node_modules" ]; then
    echo "[后端] 首次运行，安装依赖中..."
    cd "$ROOT_DIR/server" && npm install
fi

# 初始化数据库
if [ ! -f "$ROOT_DIR/server/data/avalanche.db" ]; then
    echo "[后端] 初始化数据库..."
    cd "$ROOT_DIR/server" && npx tsx src/db/init.ts
fi

echo ""
echo "[启动] 后端服务 (端口 3001)..."
cd "$ROOT_DIR/server" && npm run dev &
BACKEND_PID=$!

echo "[等待] 后端启动中..."
sleep 2

echo "[启动] 前端服务 (端口 5173)..."
cd "$ROOT_DIR" && npm run dev &
FRONTEND_PID=$!

echo ""
echo " ===================================="
echo "  服务已启动！"
echo "  前端: http://localhost:5173"
echo "  后端: http://localhost:3001/api"
echo " ===================================="
echo ""
echo " 按 Ctrl+C 停止所有服务"
echo ""

# 捕获 Ctrl+C，清理子进程
trap "echo ''; echo '[停止] 关闭所有服务...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit 0" INT

wait
