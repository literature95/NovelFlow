# Docker 部署说明

项目已包含基本的 Docker 配置，用于在容器中运行应用并使用 Postgres 数据库：

- `novel-writing-platform/Dockerfile`
- `novel-writing-platform/.dockerignore`
- `novel-writing-platform/docker-entrypoint.sh`
- 根目录的 `docker-compose.yml`（包含 `app` 与 `db` 服务）

快速启动：

```bash
# 在仓库根目录运行
docker-compose up --build
```

访问：http://localhost:5000

说明：容器在启动时会尝试运行 `npx prisma generate` 与 `npx prisma migrate deploy`（如果 `DATABASE_URL` 存在）。如需自定义环境变量，请在 `docker-compose.yml` 中修改或在运行前导出环境变量。
