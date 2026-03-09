#!/bin/bash
# 一键提交 GitHub（Git Bash / 终端）

echo ""
echo " ===================================="
echo "  一键提交 GitHub"
echo "  仓库: LEOliyutian/AVA"
echo " ===================================="
echo ""

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

# 检查是否有改动
if git diff --quiet && git diff --cached --quiet && [ -z "$(git ls-files --others --exclude-standard)" ]; then
    echo "[提示] 没有任何改动，无需提交。"
    exit 0
fi

# 显示改动
echo "[状态] 当前改动文件："
git status --short
echo ""

# 询问提交信息
read -rp "请输入提交说明（回车使用自动生成）: " MSG

if [ -z "$MSG" ]; then
    MSG="update: $(date '+%Y-%m-%d %H:%M') 提交"
fi

echo ""
echo "[提交信息] $MSG"
echo ""

# 暂存 + 提交 + 推送
git add -A && \
git commit -m "$MSG" && \
git push origin main

if [ $? -eq 0 ]; then
    echo ""
    echo " ===================================="
    echo "  提交成功！"
    echo "  https://github.com/LEOliyutian/AVA"
    echo " ===================================="
else
    echo ""
    echo "[错误] 推送失败，请检查网络或登录状态"
    exit 1
fi
