#!/bin/sh
set -e

# 日志函数
log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

log "Starting NovelFlow application..."

# 检查必要的环境变量
if [ -z "$DATABASE_URL" ]; then
  log "ERROR: DATABASE_URL is not set"
  exit 1
fi

# 检查数据库连接
log "Checking database connection..."
DATABASE_HOST=$(echo "$DATABASE_URL" | sed -n 's/.*@\(.*\):[0-9]*\/.*$/\1/p')
DATABASE_PORT=$(echo "$DATABASE_URL" | sed -n 's/.*:\([0-9]*\)\/.*$/\1/p')

if [ -n "$DATABASE_HOST" ] && [ -n "$DATABASE_PORT" ]; then
  MAX_RETRIES=30
  RETRY_COUNT=0
  while ! nc -z "$DATABASE_HOST" "$DATABASE_PORT"; do
    if [ "$RETRY_COUNT" -ge "$MAX_RETRIES" ]; then
      log "ERROR: Could not connect to database at $DATABASE_HOST:$DATABASE_PORT after $MAX_RETRIES attempts"
      exit 1
    fi
    log "Waiting for database to be ready... ($RETRY_COUNT/$MAX_RETRIES)"
    RETRY_COUNT=$((RETRY_COUNT+1))
    sleep 1
  done
  log "Database connection established!"
fi

# 生成 Prisma 客户端
log "Generating Prisma client..."
npx prisma generate

# 部署数据库迁移
log "Deploying database migrations..."
npx prisma migrate deploy

log "All pre-start checks completed successfully!"

# 执行主程序
exec "$@"
