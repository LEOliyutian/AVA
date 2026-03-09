#!/bin/bash
# 同步 GitHub 最新代码

echo ""
echo " ===================================="
echo "  同步 GitHub 最新代码"
echo "  仓库: LEOliyutian/AVA"
echo " ===================================="
echo ""

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

# 检查本地是否有未提交的改动
if ! git diff --quiet || ! git diff --cached --quiet || [ -n "$(git ls-files --others --exclude-standard)" ]; then
    echo "[警告] 你有未提交的本地改动："
    git status --short
    echo ""
    read -rp "继续同步可能产生冲突，确认继续？(y/N): " CONFIRM
    if [[ ! "$CONFIRM" =~ ^[Yy]$ ]]; then
        echo "[取消] 请先用 push.sh 提交本地改动，再同步。"
        exit 0
    fi
    echo ""
fi

# 拉取最新代码
echo "[同步] 正在从 GitHub 拉取最新代码..."
git pull origin main

if [ $? -eq 0 ]; then
    echo ""
    echo " ===================================="
    echo "  同步成功！代码已是最新版本。"
    echo " ===================================="
else
    echo ""
    echo "[错误] 同步失败，可能存在冲突，请手动处理。"
    exit 1
fi
