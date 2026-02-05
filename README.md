# NovelFlow - AI 辅助小说写作平台

<div align="center">
  <img src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20minimalist%20logo%20for%20novel%20writing%20platform%20called%20NovelFlow%2C%20blue%20and%20white%20color%20scheme%2C%20book%20with%20flowing%20lines%20or%20ai%20symbol%2C%20clean%20design&image_size=square" alt="NovelFlow Logo" width="120">
</div>

> ✍️ **NovelFlow** 是一款功能全面的 AI 辅助小说写作平台，专为作家、创作者和内容团队设计。通过融合先进的人工智能技术与专业的写作工具，NovelFlow 旨在帮助用户释放创作潜力，让小说创作变得更加流畅、高效和富有创意。

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-16-000?logo=nextdotjs)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-38bdf8?logo=tailwindcss)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-5-2d3748?logo=prisma)
![Docker](https://img.shields.io/badge/Docker-ready-blue?logo=docker)
![License](https://img.shields.io/badge/License-MIT-green)

</div>

---

## ✨ 核心功能

- 📝 **沉浸式编辑器**：支持 Markdown 语法，实时预览效果，自动保存
- 🤖 **AI 辅助创作**：内容生成、灵感建议、风格转换、语法检查
- 📚 **小说管理**：章节管理、版本控制、内容导出（支持多种格式）
- 🎭 **角色设计**：角色档案、关系图谱、AI 角色扩展建议
- 🌍 **世界观构建**：世界设定、时间线、地点管理、AI 世界扩展
- 👥 **用户系统**：注册登录、权限管理、个人中心
- 🛠️ **管理员后台**：用户管理、内容审核、系统监控

<details>
  <summary>点击查看项目截图</summary>
  <img src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20dashboard%20interface%20for%20novel%20writing%20platform%20with%20clean%20UI%2C%20light%20blue%20and%20white%20color%20scheme%2C%20cards%20showing%20novel%20projects%2C%20stats%20panels%2C%20modern%20web%20design&image_size=landscape_16_9" alt="NovelFlow 仪表盘" style="max-width:100%; border-radius:8px; margin:10px 0;">
  <img src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=immersive%20novel%20editor%20interface%20with%20clean%20writing%20area%2C%20AI%20assistant%20panel%20on%20right%2C%20toolbar%20with%20formatting%20options%2C%20light%20mode%2C%20modern%20web%20design&image_size=landscape_16_9" alt="沉浸式编辑器" style="max-width:100%; border-radius:8px; margin:10px 0;">
  <img src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=character%20management%20interface%20for%20novel%20writing%2C%20character%20cards%20with%20photos%2C%20names%2C%20basic%20info%2C%20relationship%20graph%20visualization%2C%20modern%20UI%2C%20light%20theme&image_size=landscape_16_9" alt="角色管理" style="max-width:100%; border-radius:8px; margin:10px 0;">
</details>

## 🗺 目录

- [项目简介](#项目简介)
- [核心功能](#核心功能)
- [技术栈](#技术栈)
- [项目结构](#项目结构)
- [系统要求](#系统要求)
- [环境变量](#环境变量)
- [部署](#部署)
- [使用指南](#使用指南)
- [项目状态](#项目状态)
- [贡献指南](#贡献指南)
- [安全与隐私](#安全与隐私)
- [常见问题](#常见问题)
- [故障排除](#故障排除)
- [许可证](#许可证)
- [联系我们](#联系我们)

## 🚀 项目简介

NovelFlow 是一款专为作家、创作者和内容团队设计的 AI 辅助小说写作平台。通过融合先进的人工智能技术与专业的写作工具，NovelFlow 旨在帮助用户释放创作潜力，让小说创作变得更加流畅、高效和富有创意。

### 🎯 目标用户

- 职业作家和小说创作者
- 文学爱好者和写作新手
- 内容创作团队
- 教育机构和写作课程
- 自媒体创作者

### ✨ 核心价值

- **智能辅助创作**：AI 实时提供灵感、剧情建议和内容生成
- **全流程管理**：从灵感构思到小说出版的完整解决方案
- **个性化体验**：根据用户写作习惯智能调整功能
- **协作友好**：支持团队协作和版本控制
- **安全可靠**：数据加密存储，确保创作内容安全

## 🛠️ 技术栈

NovelFlow 采用现代化的全栈技术栈，结合性能、可维护性和开发效率进行选型：

| 分类 | 主要依赖 | 版本 | 选型理由 |
|---|---|---|---|
| 前端框架 | Next.js · App Router | 16.1.0 | 支持服务器端渲染(SSR)和静态站点生成(SSG)，优化 SEO 和首屏加载速度；App Router 提供更直观的路由管理 |
| UI & 样式 | React · Tailwind CSS | 19.2.1 · 4.0 | React 提供组件化开发能力；Tailwind CSS 实现高效的原子化样式开发，支持响应式设计 |
| 语言 | TypeScript | 5.3.0 | 提供类型安全，减少运行时错误，提高代码可维护性和开发效率 |
| 数据库 | PostgreSQL · SQLite | 14+ · 3.40+ | 支持多种数据库类型，满足不同部署需求；PostgreSQL 适合生产环境，SQLite 适合开发和轻量级部署 |
| ORM | Prisma | 5.22.0 | 提供类型安全的数据库访问，简化数据库操作；支持多种数据库，提供直观的 schema 定义 |
| 认证 | JWT · NextAuth | 9.0.3 · 4.24.13 | JWT 实现无状态认证；NextAuth 提供完整的认证解决方案，支持多种认证方式 |
| AI 服务 | LangChain · OpenAI 兼容接口 | 1.2.2 | LangChain 提供灵活的 AI 应用开发框架；支持 OpenAI API 和多种开源大模型，提供扩展能力 |
| 代码质量 | ESLint · Prettier | 9.0.0 · 3.2.5 | ESLint 检查代码质量；Prettier 统一代码格式，提高团队协作效率 |
| 部署 | Docker · Vercel · CloudFlare Pages | 20.10+ | Docker 实现容器化部署，确保环境一致性；Vercel 和 CloudFlare Pages 提供高性能的静态网站托管服务 |

## 📁 项目结构

```
NovelFlow/
├── novel-writing-platform/         # 主应用目录
│   ├── src/
│   │   ├── app/                    # Next.js App Router
│   │   │   ├── api/                # API 路由
│   │   │   │   ├── ai/             # AI 相关接口
│   │   │   │   ├── auth/           # 认证相关接口
│   │   │   │   ├── novels/         # 小说管理接口
│   │   │   │   └── admin/          # 管理员接口
│   │   │   ├── dashboard/          # 仪表盘页面
│   │   │   └── auth/               # 认证页面
│   │   ├── components/             # 公共组件
│   │   ├── hooks/                  # 自定义 Hooks
│   │   ├── lib/                    # 工具函数
│   │   └── styles/                 # 样式文件
│   ├── prisma/                     # Prisma 数据库配置
│   └── public/                     # 静态资源
├── assets/                         # 项目资源
└── .cozeproj/                      # 部署配置
```

## 🚀 部署

本项目**支持 Vercel、Docker 和 Cloudflare** 部署。

### 📦 本地部署

NovelFlow 提供了便捷的本地部署方案，支持 Windows、macOS 和 Linux 系统。

#### 环境要求

- **Node.js** 18.x 或更高版本
- **npm** 或 **yarn** 包管理器
- **Git** 版本控制系统

#### 快速安装（推荐）

1. **克隆项目**
```bash
git clone <repository-url>
cd NovelFlow
```

2. **运行一键配置脚本**

项目提供了智能配置脚本，自动完成依赖安装、环境配置和数据库初始化：

```bash
# 进入应用目录
cd novel-writing-platform

# 运行配置脚本
npm run setup
```

脚本将自动执行以下操作：
- 创建 .env 配置文件
- 安装所有依赖包
- 初始化数据库
- 生成 Prisma 客户端

3. **启动开发服务器**
```bash
npm run dev
```

4. **访问应用**
打开浏览器访问 http://localhost:5000

#### 手动安装（高级用户）

1. **克隆项目**
```bash
git clone <repository-url>
cd NovelFlow/novel-writing-platform
```

2. **安装依赖**
```bash
npm install
```

3. **配置环境变量**
```bash
cp .env.example .env
# 编辑 .env 文件，配置必要参数
```

4. **数据库初始化**
```bash
npx prisma migrate dev
npx prisma generate
```

5. **启动应用**
```bash
# 开发模式
npm run dev

# 生产模式
npm run build
npm run start
```

### 🐳 Docker 部署

NovelFlow 支持使用 Docker 进行容器化部署，适合生产环境和快速部署场景。

#### 环境要求

- Docker 20.10+ (推荐最新稳定版)
- Docker Compose 2.0+


## ⚙️ 系统要求
- **Node.js** 18.x 或更高版本
- **PostgreSQL** 14.x 或更高版本（生产环境推荐）
- **SQLite** 3.40+（开发环境）
- **Git** 版本控制系统
- **npm** 或 **yarn** 包管理器

## 🔧 环境变量

NovelFlow 使用环境变量进行配置管理。项目根目录下的 `.env.example` 文件包含了所有可配置的环境变量。

### 必需环境变量

| 变量名 | 描述 | 示例值 |
|--------|------|--------|
| `DATABASE_URL` | 数据库连接字符串 | `postgresql://user:password@localhost:5432/novelflow` (PostgreSQL)<br>`file:./dev.db` (SQLite) |
| `NEXTAUTH_URL` | NextAuth 回调 URL | `http://localhost:5000` |
| `NEXTAUTH_SECRET` | NextAuth 加密密钥 | 使用 `openssl rand -base64 32` 生成 |
| `OPENAI_API_KEY` | OpenAI API 密钥 | `sk-...` |

### 可选环境变量

| 变量名 | 描述 | 默认值 |
|--------|------|--------|
| `NODE_ENV` | 运行环境 | `development` |
| `PORT` | 应用端口 | `5000` |
| `AI_MODEL` | 默认 AI 模型 | `gpt-4` |
| `AI_MAX_TOKENS` | AI 生成最大 tokens | `2000` |
| `AI_TEMPERATURE` | AI 温度参数 | `0.7` |

### 配置步骤

1. **复制环境变量文件**：
   ```bash
   cp .env.example .env
   ```

2. **编辑 `.env` 文件**，设置您的配置值

3. **安全注意事项**：
   - 永远不要将 `.env` 文件提交到版本控制
   - 生产环境使用安全的密钥管理服务
   - 定期轮换敏感密钥

## 🚀 部署

本项目**支持 Vercel、Docker 和 Cloudflare** 部署。
### 📦 本地部署

NovelFlow 提供了便捷的本地部署方案，支持 Windows、macOS 和 Linux 系统。

#### 环境要求

- **Node.js** 18.x 或更高版本
- **npm** 或 **yarn** 包管理器
- **Git** 版本控制系统

#### 快速安装（推荐）

1. **克隆项目**
```bash
git clone <repository-url>
cd NovelFlow
```

2. **运行一键配置脚本**

项目提供了智能配置脚本，自动完成依赖安装、环境配置和数据库初始化：

```bash
# 进入应用目录
cd novel-writing-platform

# 运行配置脚本
npm run setup
```

脚本将自动执行以下操作：
- 创建 .env 配置文件
- 安装所有依赖包
- 初始化数据库
- 生成 Prisma 客户端

3. **启动开发服务器**
```bash
npm run dev
```

4. **访问应用**
打开浏览器访问 http://localhost:5000

#### 手动安装（高级用户）

1. **克隆项目**
```bash
git clone <repository-url>
cd NovelFlow/novel-writing-platform
```

2. **安装依赖**
```bash
npm install
```

3. **配置环境变量**
```bash
cp .env.example .env
# 编辑 .env 文件，配置必要参数
```

4. **数据库初始化**
```bash
npx prisma migrate dev
npx prisma generate
```

5. **启动应用**
```bash
# 开发模式
npm run dev

# 生产模式
npm run build
npm run start
```

### 🐳 Docker 部署

NovelFlow 支持使用 Docker 进行容器化部署，适合生产环境和快速部署场景。

#### 环境要求

- Docker 20.10+ (推荐最新稳定版)
- Docker Compose 2.0+

#### 本地 Docker 部署

1. **克隆项目**
```bash
git clone <repository-url>
cd NovelFlow
```

2. **配置环境变量**

编辑 `docker-compose.yml` 文件，根据需要调整配置：

```yaml
# 修改环境变量和端口映射
environment:
  - NODE_ENV=production
  - DATABASE_URL=file:./dev.db
  - NEXTAUTH_URL=http://localhost:5000
  - DOCKER_ENV=true
ports:
  - "5000:5000"  # 可修改为其他端口映射
```

3. **启动容器**

```bash
docker-compose up -d
```

Docker Compose 会自动：
- 构建或拉取镜像
- 创建必要的网络和卷
- 启动应用容器
- 配置自动重启策略

4. **验证部署**

```bash
# 查看容器状态
docker ps

# 查看应用日志
docker logs novelflow-app
```

5. **访问应用**

打开浏览器访问 http://localhost:5000

#### 云服务器 Docker 部署

NovelFlow 支持在主流云服务器平台（如阿里云、腾讯云、AWS、Google Cloud、华为云等）上使用 Docker 部署。以下是通用部署流程：

##### 1. 云服务器准备

1. **选择云服务器实例**
   - 推荐配置：2核CPU、4GB内存、40GB磁盘
   - 操作系统：Ubuntu 22.04 LTS（推荐）或 CentOS 7+

2. **登录云服务器**
   ```bash
   # 使用 SSH 登录云服务器
   ssh root@your-server-ip
   ```

3. **更新系统**
   ```bash
   # Ubuntu/Debian
   apt update && apt upgrade -y
   
   # CentOS/RHEL
   yum update -y
   ```

4. **安装 Docker 和 Docker Compose**
   ```bash
   # 安装 Docker
   curl -fsSL https://get.docker.com -o get-docker.sh
   sh get-docker.sh
   
   # 安装 Docker Compose
   curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
   chmod +x /usr/local/bin/docker-compose
   
   # 验证安装
   docker --version
   docker-compose --version
   ```

##### 2. 部署 NovelFlow

1. **克隆项目**
   ```bash
   # 安装 Git
   apt install git -y  # Ubuntu/Debian
   # yum install git -y  # CentOS/RHEL
   
   # 克隆项目
   git clone <repository-url>
   cd NovelFlow
   ```

2. **配置环境变量**
   ```bash
   # 编辑 docker-compose.yml 文件
   vim docker-compose.yml
   ```

   在云服务器上部署时，需要修改以下关键配置：
   ```yaml
   # 生产环境建议使用 PostgreSQL 数据库
   services:
     db:
       image: postgres:14
       environment:
         - POSTGRES_USER=novelflow
         - POSTGRES_PASSWORD=your-secure-password
         - POSTGRES_DB=novelflow
       volumes:
         - postgres_data:/var/lib/postgresql/data
       restart: always
     
     app:
       environment:
         - NODE_ENV=production
         - DATABASE_URL=postgresql://novelflow:your-secure-password@db:5432/novelflow
         - NEXTAUTH_URL=https://your-domain.com  # 替换为您的域名或服务器IP
         - NEXTAUTH_SECRET=your-secret-key  # 生成一个安全的密钥
         - DOCKER_ENV=true
       ports:
         - "80:5000"  # 映射到 80 端口（HTTP）
         # - "443:5001"  # 如果使用 HTTPS，映射到 443 端口
   ```

3. **启动容器**
   ```bash
   docker-compose up -d
   ```

##### 3. 云服务器配置

1. **配置防火墙**
   ```bash
   # Ubuntu/Debian (ufw)
   ufw allow 80/tcp  # HTTP
   ufw allow 443/tcp  # HTTPS（如果使用）
   ufw allow 22/tcp  # SSH
   ufw enable
   
   # CentOS/RHEL (firewalld)
   firewall-cmd --permanent --add-service=http
   firewall-cmd --permanent --add-service=https  # 如果使用
   firewall-cmd --permanent --add-service=ssh
   firewall-cmd --reload
   ```

2. **配置域名（可选）**
   - 在域名提供商处将域名解析到云服务器 IP
   - 配置 SSL 证书（推荐使用 Let's Encrypt）：
     ```bash
     # 安装 Certbot
     apt install certbot python3-certbot-nginx -y
     
     # 获取 SSL 证书
     certbot --nginx -d your-domain.com
     ```

3. **配置 Nginx 反向代理（可选）**
   ```bash
   # 安装 Nginx
   apt install nginx -y
   
   # 配置 Nginx
   vim /etc/nginx/sites-available/novelflow
   ```

   添加以下配置：
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       # 重定向到 HTTPS
       return 301 https://$server_name$request_uri;
   }
   
   server {
       listen 443 ssl;
       server_name your-domain.com;
       
       # SSL 配置
       ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
       ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
       
       location / {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

   ```bash
   # 启用配置
   ln -s /etc/nginx/sites-available/novelflow /etc/nginx/sites-enabled/
   
   # 测试配置
   nginx -t
   
   # 重启 Nginx
   systemctl restart nginx
   ```

##### 4. 验证部署

1. **查看容器状态**
   ```bash
   docker ps
   ```

2. **查看应用日志**
   ```bash
   docker logs novelflow-app
   ```

3. **访问应用**
   - 通过服务器 IP：http://your-server-ip
   - 通过域名（如果已配置）：https://your-domain.com

##### 5. 维护与更新

1. **更新应用**
   ```bash
   cd NovelFlow
   git pull origin main
   docker-compose down
   docker-compose up -d --build
   ```

2. **备份数据**
   ```bash
   # 备份 PostgreSQL 数据
   docker exec -t novelflow-db pg_dumpall -c -U novelflow > backup.sql
   
   # 备份 SQLite 数据
   docker cp novelflow-app:/app/novel-writing-platform/dev.db ./backup.db
   ```

3. **恢复数据**
   ```bash
   # 恢复 PostgreSQL 数据
   cat backup.sql | docker exec -i novelflow-db psql -U novelflow
   
   # 恢复 SQLite 数据
   docker cp ./backup.db novelflow-app:/app/novel-writing-platform/dev.db
   ```

#### 高级 Docker 配置

```bash
# 构建自定义镜像
docker build -t novelflow:custom .

# 运行单个容器
docker run -d -p 5000:5000 --name novelflow novelflow:latest

# 查看容器详细信息
docker inspect novelflow-app

# 进入容器内部
docker exec -it novelflow-app sh
```



### 🚀 Vercel 部署

1. **Fork 仓库**：将 NovelFlow/novel-writing-platform 仓库 Fork 到您的 GitHub 账户。
2. **连接 Vercel**：登录 Vercel，创建一个新项目，并连接到您 Fork 的 GitHub 仓库。
3. **配置环境变量**：Vercel 会自动检测 Next.js 项目。您可能需要配置一些环境变量，例如数据库连接字符串（如果使用外部数据库服务，如 PostgreSQL 或 MongoDB Atlas）和 AI API 密钥。
4. **部署**：Vercel 会自动构建并部署您的 Next.js 应用。
### ☁️ Cloudflare Pages 部署

1. **Fork 仓库**：将 NovelFlow/novel-writing-platform 仓库 Fork 到您的 GitHub 账户。
2. **连接 Cloudflare Pages**：登录 Cloudflare，进入 Pages 服务，创建一个新项目，并连接到您 Fork 的 GitHub 仓库。
3. **构建命令**：Cloudflare Pages 也会自动检测 Next.js 项目。您可能需要确认或设置构建命令（通常是 `npm run build` 或 `pnpm run build`，取决于您使用的包管理器）和输出目录（通常是 `.next`）。
4. **配置环境变量**：与 Vercel 类似，您需要配置数据库连接字符串和 AI API 密钥等环境变量。
5. **部署**：Cloudflare Pages 会自动构建并部署您的 Next.js 应用。

## 📖 使用指南

### 📝 创建第一个小说

1. **注册登录**
   - 访问 http://localhost:5000
   - 点击 "注册" 创建账户
   - 使用注册信息登录

2. **创建小说**
   - 点击仪表盘上的 "创建小说" 按钮
   - 填写小说基本信息：
     - 标题：小说名称
     - 类型：选择小说类型（玄幻、都市、科幻等）
     - 简介：简短描述小说内容
     - 封面：上传小说封面（可选）
   - 点击 "创建" 完成

3. **进入小说管理**
   - 在仪表盘找到刚创建的小说
   - 点击 "管理" 进入小说详情页

### 📄 编写章节

1. **新建章节**
   - 在小说详情页点击 "章节管理"
   - 点击 "新建章节" 按钮
   - 填写章节标题和简介
   - 设置章节顺序

2. **开始写作**
   - 点击章节标题进入编辑器
   - 使用沉浸式编辑器开始写作
   - 支持 Markdown 语法

3. **AI 辅助功能**
   - 点击右侧 AI 助手面板
   - 选择需要的辅助功能：
     - 灵感生成：获取剧情灵感
     - 内容续写：AI 续写当前内容
     - 风格转换：转换文字风格
     - 语法检查：检查并修正语法错误

4. **保存内容**
   - 内容自动保存（每 30 秒）
   - 也可点击 "手动保存" 按钮

### 🎭 角色设计

1. **进入角色管理**
   - 在小说详情页点击 "角色管理"
   - 查看当前小说的所有角色

2. **创建新角色**
   - 点击 "创建角色" 按钮
   - 填写角色信息：
     - 基本信息：姓名、性别、年龄
     - 外貌特征：身高、体重、外貌描述
     - 性格特点：性格、爱好、价值观
     - 背景故事：角色经历和背景
     - 关系网络：与其他角色的关系

3. **AI 角色扩展**
   - 使用 AI 助手生成角色深度分析
   - 获取角色发展建议
   - 生成角色对话示例

### 🌍 世界观构建

1. **进入世界观管理**
   - 在小说详情页点击 "世界观设置"
   - 查看当前小说的世界观配置

2. **创建世界观元素**
   - 点击 "创建设置" 按钮
   - 选择设置类型：
     - 地理环境：小说世界的地理位置和环境
     - 历史背景：小说世界的历史事件
     - 文化习俗：社会文化和风俗习惯
     - 政治制度：政府和政治结构
     - 科技水平：技术发展程度
     - 魔法系统：如果是奇幻小说的魔法规则

3. **AI 世界扩展**
   - 使用 AI 助手生成详细的世界设定
   - 获取世界规则的一致性检查
   - 生成世界地图描述

### 📊 小说统计

- 查看小说总字数和章节数
- 分析写作进度和速度
- 获取读者反馈统计（如果已发布）
- 导出统计报告



## 📊 项目状态

### ✅ 已完成功能

- **核心写作工具**：沉浸式编辑器、自动保存、格式工具
- **AI 辅助功能**：内容生成、灵感建议、风格转换
- **小说管理**：章节管理、版本控制、内容导出
- **角色系统**：角色档案、关系图谱、AI 角色建议
- **世界观构建**：世界设定、时间线、地点管理
- **用户系统**：注册登录、权限管理、个人中心
- **管理员后台**：用户管理、内容审核、系统监控
- **部署支持**：Docker、Vercel、Cloudflare Pages

### 🔄 开发中功能

- **移动端适配**：响应式设计和移动应用
- **多语言支持**：国际化和本地化
- **插件系统**：第三方扩展支持
- **协作功能**：实时协作和评论系统
- **出版工具**：排版、封面设计、电子书导出

### 📝 近期更新

- **版本 1.2.0**（2026-01-30）
  - 优化 AI 生成质量
  - 增加角色关系图谱
  - 改进移动端体验
  - 修复已知 bug

- **版本 1.1.0**（2026-01-15）
  - 增加世界观构建工具
  - 改进小说统计功能
  - 优化性能和稳定性

## 🤝 贡献指南

我们欢迎社区贡献！如果您想参与 NovelFlow 的开发：

1. Fork 项目仓库
2. 创建特性分支（`git checkout -b feature/AmazingFeature`）
3. 提交更改（`git commit -m 'Add some AmazingFeature'`）
4. 推送到分支（`git push origin feature/AmazingFeature`）
5. 开启 Pull Request

### 开发规范

- 代码风格：遵循 ESLint 和 Prettier 规范
- 提交信息：使用语义化提交信息
- 文档更新：同步更新相关文档
- 测试覆盖：确保新功能有测试覆盖

## 📄 许可证

本项目采用 **MIT License** 开源许可证。

## � 项目截图

### 主界面与仪表盘

**小说管理仪表盘**

<img src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20dashboard%20interface%20for%20novel%20writing%20platform%20with%20clean%20UI%2C%20light%20blue%20and%20white%20color%20scheme%2C%20cards%20showing%20novel%20projects%2C%20stats%20panels%2C%20modern%20web%20design&image_size=landscape_16_9" alt="NovelFlow 仪表盘" style="max-width: 100%; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">

**沉浸式编辑器**

<img src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=immersive%20novel%20editor%20interface%20with%20clean%20writing%20area%2C%20AI%20assistant%20panel%20on%20right%2C%20toolbar%20with%20formatting%20options%2C%20light%20mode%2C%20modern%20web%20design&image_size=landscape_16_9" alt="沉浸式编辑器" style="max-width: 100%; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">

### 核心功能模块

**章节管理界面**

<img src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=chapter%20management%20interface%20for%20novel%20writing%20platform%2C%20list%20of%20chapters%20with%20titles%2C%20word%20count%2C%20status%2C%20edit%20buttons%2C%20clean%20table%20layout%2C%20light%20theme&image_size=landscape_16_9" alt="章节管理" style="max-width: 100%; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">

**角色管理系统**

<img src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=character%20management%20interface%20for%20novel%20writing%2C%20character%20cards%20with%20photos%2C%20names%2C%20basic%20info%2C%20relationship%20graph%20visualization%2C%20modern%20UI%2C%20light%20theme&image_size=landscape_16_9" alt="角色管理" style="max-width: 100%; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">

**世界观构建工具**

<img src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=world%20building%20interface%20for%20novel%20writing%2C%20timeline%20visualization%2C%20location%20maps%2C%20setting%20categories%2C%20notes%20section%2C%20clean%20modern%20design%2C%20light%20theme&image_size=landscape_16_9" alt="世界观构建" style="max-width: 100%; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">

**AI 辅助功能面板**

<img src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=AI%20assistant%20panel%20for%20novel%20writing%2C%20text%20generation%20options%2C%20inspiration%20suggestions%2C%20style%20transfer%20controls%2C%20chat%20interface%2C%20modern%20web%20design%2C%20light%20theme&image_size=portrait_16_9" alt="AI 辅助功能" style="max-width: 100%; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">

## 🔒 安全与隐私

NovelFlow 高度重视用户数据安全和隐私保护，采用多层次的安全措施确保用户创作内容的安全。

### 🛡️ 安全措施

1. **数据加密**
   - 传输加密：所有数据传输采用 HTTPS/TLS 加密
   - 存储加密：用户创作内容和敏感信息采用 AES-256 加密存储
   - 加密算法：使用行业标准的加密算法和密钥管理方案

2. **访问控制**
   - 基于角色的访问控制 (RBAC) 系统
   - 多因素认证 (MFA) 支持
   - 安全的密码哈希算法 (bcrypt)
   - 定期密码更新策略

3. **系统安全**
   - 定期安全审计和漏洞扫描
   - 及时更新依赖和补丁
   - 安全的 API 设计和实现
   - 防止常见 Web 攻击（SQL 注入、XSS、CSRF 等）

### 📋 隐私政策

1. **数据收集**
   - 仅收集必要的用户信息用于提供服务
   - 不收集与服务无关的个人数据
   - 明确告知用户数据收集目的和范围

2. **数据使用**
   - 用户数据仅用于提供和改进服务
   - 不会将用户数据出售或分享给第三方
   - 严格遵守数据使用协议和隐私法规

3. **数据控制**
   - 用户完全控制自己的创作内容
   - 支持数据导出和删除
   - 提供透明的数据管理工具

4. **合规性**
   - 符合 GDPR、CCPA 等国际隐私法规
   - 定期更新隐私政策以适应新法规
   - 提供明确的隐私投诉渠道

## ❓ 常见问题 (FAQ)

### 技术问题

**Q: NovelFlow 支持哪些操作系统？**
A: NovelFlow 是基于 Web 的应用，支持所有主流操作系统（Windows、macOS、Linux），只需使用现代浏览器（Chrome 90+、Firefox 88+、Safari 14+、Edge 90+）即可访问。

**Q: 需要什么配置才能运行 NovelFlow？**
A: 本地部署需要 Node.js 18.x 或更高版本，以及 npm 或 yarn 包管理器。Docker 部署需要 Docker 20.10+ 和 Docker Compose 2.0+。

**Q: NovelFlow 支持哪些数据库？**
A: NovelFlow 支持 PostgreSQL（推荐生产环境）和 SQLite（推荐开发环境）。

**Q: 如何升级 NovelFlow 到最新版本？**
A: 
```bash
# 本地部署
cd novel-writing-platform
git pull origin main
npm run setup

# Docker 部署
docker-compose pull
```

### 功能问题

**Q: NovelFlow 的 AI 功能支持哪些语言？**
A: 目前主要支持中文和英文，后续将扩展支持更多语言。

**Q: 可以导出小说为哪些格式？**
A: 支持导出为 Markdown、HTML、PDF、DOCX 等多种格式。

**Q: 是否支持团队协作？**
A: 当前版本支持基本的团队协作功能，包括章节分配和版本控制。实时协作功能正在开发中。

**Q: 如何备份我的小说数据？**
A: 
- 本地部署：可以通过数据库备份工具备份数据
- Docker 部署：可以备份数据卷或使用数据库备份命令
- 云部署：平台提供自动备份功能

### 计费与支持

**Q: NovelFlow 是免费的吗？**
A: NovelFlow 提供开源免费版本和付费企业版本。开源版本包含所有核心功能，企业版本提供额外的高级功能和专属支持。

**Q: 如何获得技术支持？**
A: 可以通过以下渠道获得支持：
- GitHub Issues（开源版本）
- 社区论坛
- 邮件支持（企业版本）
- 专属客服（企业版本）

**Q: 是否提供 API 接口？**
A: 企业版本提供完整的 API 接口，支持与其他系统集成。

## ⚡ 性能优化

### 🚀 部署优化

1. **数据库优化**
   - 使用连接池减少数据库连接开销
   - 为频繁查询的字段创建索引
   - 定期清理过期数据和优化表结构

2. **缓存策略**
   - 使用 Redis 或 Memcached 缓存热点数据
   - 实现合理的缓存过期策略
   - 缓存常用的 API 响应

3. **服务器配置**
   - 使用负载均衡分发流量
   - 配置适当的服务器资源（CPU、内存、磁盘）
   - 启用 Gzip 或 Brotli 压缩

### 📱 前端优化

1. **代码优化**
   - 启用代码分割和懒加载
   - 优化图片和静态资源
   - 使用 CDN 加速资源加载

2. **性能监控**
   - 集成性能监控工具
   - 分析关键渲染路径
   - 优化首屏加载时间

3. **用户体验**
   - 实现预加载和骨架屏
   - 优化动画和交互效果
   - 提供离线访问支持

### 📊 数据库优化

1. **查询优化**
   - 使用 Prisma 的查询优化功能
   - 避免 N+1 查询问题
   - 使用批量操作减少数据库请求

2. **索引策略**
   - 为外键和常用查询字段创建索引
   - 定期分析和优化索引
   - 避免过度索引

3. **数据管理**
   - 实现数据分区和分表
   - 定期清理冗余数据
   - 使用合适的数据类型

## 🐛 故障排除

### 常见问题与解决方案

**问题：npm run setup 失败**
- **可能原因**：Node.js 版本不兼容、网络问题、权限不足
- **解决方案**：
  1. 确保 Node.js 版本为 18.x 或更高
  2. 检查网络连接，确保能访问 npm 仓库
  3. 以管理员/root 权限运行命令
  4. 尝试清理 npm 缓存：`npm cache clean --force`

**问题：数据库连接失败**
- **可能原因**：数据库配置错误、数据库服务未启动、防火墙问题
- **解决方案**：
  1. 检查 .env 文件中的数据库连接字符串
  2. 确保数据库服务正在运行
  3. 检查防火墙设置，确保数据库端口可访问
  4. 尝试重新初始化数据库：`npm run prisma:migrate-reset`

**问题：AI 功能无法使用**
- **可能原因**：API 密钥配置错误、网络问题、API 服务限制
- **解决方案**：
  1. 检查 .env 文件中的 AI API 密钥
  2. 确保能访问 AI 服务提供商的 API
  3. 检查 API 密钥是否有效，是否有足够的配额
  4. 查看应用日志，检查具体错误信息

**问题：Docker 部署失败**
- **可能原因**：Docker 版本不兼容、配置错误、端口冲突
- **解决方案**：
  1. 确保 Docker 版本为 20.10+ 和 Docker Compose 2.0+
  2. 检查 docker-compose.yml 配置文件
  3. 确保端口未被其他服务占用
  4. 查看容器日志：`docker logs novelflow-app`

**问题：前端界面加载缓慢**
- **可能原因**：网络问题、资源过大、缓存配置错误
- **解决方案**：
  1. 检查网络连接和服务器响应时间
  2. 优化图片和静态资源大小
  3. 检查 CDN 配置
  4. 启用浏览器缓存

**问题：登录失败**
- **可能原因**：密码错误、账户锁定、认证服务故障
- **解决方案**：
  1. 确认用户名和密码正确
  2. 检查账户是否被锁定
  3. 尝试重置密码
  4. 检查认证服务日志

### 日志与调试

1. **查看应用日志**
```bash
# 本地开发
npm run dev

# Docker 部署
docker logs novelflow-app
```

2. **查看数据库日志**
```bash
# PostgreSQL
docker logs novelflow-db

# SQLite
# SQLite 日志默认关闭，可在配置中启用
```

3. **调试工具**
- 使用浏览器开发者工具分析前端问题
- 使用 Prisma Studio 查看数据库状态：`npx prisma studio`
- 查看系统资源使用情况：`top` 或 `htop`

### 联系支持

如果遇到无法解决的问题，请收集以下信息并联系支持团队：
- 应用版本号
- 操作系统和浏览器信息
- 完整的错误信息和日志
- 问题重现步骤
- 相关截图（如果有）

## �� 联系我们

- **项目主页**：https://github.com/NovelFlow
- **问题反馈**：https://github.com/NovelFlow/issues
- **社区论坛**：https://forum.novelflow.com
- **邮件支持**：support@novelflow.com
- **社交媒体**：@NovelFlowAI

**NovelFlow - 让创作更流畅** 🚀

---

*更新日期：2026-02-06*
