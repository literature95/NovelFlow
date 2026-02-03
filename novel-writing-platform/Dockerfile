# ---- 第 1 阶段：安装依赖 ----
FROM node:20-alpine AS deps

# 启用 corepack 并激活 npm
RUN corepack enable

WORKDIR /app

# 复制依赖清单并锁定 Prisma 版本
COPY package.json package-lock.json* ./

# 修改 package.json 以锁定 Prisma 版本
RUN sed -i 's/"prisma": "\^5\.22\.0"/"prisma": "5.22.0"/g' package.json && \
    sed -i 's/"@prisma\/client": "\^5\.22\.0"/"@prisma\/client": "5.22.0"/g' package.json

# 安装所有依赖（含 devDependencies，后续会裁剪）
RUN npm ci || npm install

# ---- 第 2 阶段：构建项目 ----
FROM node:20-alpine AS builder
RUN corepack enable
WORKDIR /app

# 复制依赖
COPY --from=deps /app/node_modules ./node_modules
# 复制全部源代码
COPY . .

# 设置 Docker 环境变量
ENV DOCKER_ENV=true

# 生成 Prisma 客户端
RUN npx prisma generate

# 修复 Edge Runtime 问题，强制使用 Node.js Runtime
RUN find ./src -type f -name "route.ts" -print0 \
  | xargs -0 sed -i "s/export const runtime = 'edge';/export const runtime = 'nodejs';/g"

# 生成生产构建
RUN npm run build

# ---- 第 3 阶段：生成运行时镜像 ----
FROM node:20-alpine AS runner

# 安装必要的系统工具
RUN apk add --no-cache sqlite

# 创建非 root 用户
RUN addgroup -g 1001 -S nodejs && adduser -u 1001 -S nextjs -G nodejs

WORKDIR /app
ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=5000
ENV DOCKER_ENV=true

# 从构建器中复制 standalone 输出
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
# 从构建器中复制 public 和 .next/static 目录
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
# 从构建器中复制 prisma 目录
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
# 从构建器中复制 start.js
COPY --from=builder --chown=nextjs:nodejs /app/start.js ./start.js

# 确保 start.js 有执行权限
RUN chmod +x ./start.js

# 复制并设置入口点脚本
COPY --from=builder --chown=nextjs:nodejs /app/docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# 切换到非特权用户
USER nextjs

EXPOSE 5000

# 使用自定义入口点脚本，先处理数据库迁移再启动服务器
ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
CMD ["node", "start.js"]
