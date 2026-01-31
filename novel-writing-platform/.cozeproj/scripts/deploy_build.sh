#!/bin/bash

set -Eeuo pipefail

WORK_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$WORK_DIR"

echo "🚀 开始构建小说写作平台..."

# 安装依赖
echo "📦 安装项目依赖..."
npm install

# 生成 Prisma 客户端
echo "🗄️ 生成数据库客户端..."
npx prisma generate

# 构建项目
echo "🔨 构建项目..."
npm run build

# 检查构建结果
if [ $? -eq 0 ]; then
    echo "✅ 构建成功!"
    echo "📁 构建输出位于: $WORK_DIR/.next"
else
    echo "❌ 构建失败!"
    exit 1
fi

echo "🎉 构建完成!"