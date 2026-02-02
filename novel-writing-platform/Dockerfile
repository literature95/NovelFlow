# ---- 第 1 阶段：安装依赖 ----
FROM node:20-alpine AS deps

# 启用 corepack 并激活 npm
RUN corepack enable

WORKDIR /app

# 仅复制依赖清单，提高构建缓存利用率
COPY package.json package-lock.json* ./

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

# 生成生产构建
RUN npm run build

# ---- 第 3 阶段：生成运行时镜像 ----
FROM node:20-alpine AS runner

# 创建非 root 用户
RUN addgroup -g 1001 -S nodejs && adduser -u 1001 -S nextjs -G nodejs

WORKDIR /app
ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=5000
ENV DOCKER_ENV=true

# 从构建器中复制必要文件
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/scripts ./scripts
COPY --chown=nextjs:nodejs docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# 切换到非特权用户
USER nextjs

EXPOSE 5000

# 使用自定义入口点脚本，先处理数据库迁移再启动服务器
ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
CMD ["npm","run","start"]
