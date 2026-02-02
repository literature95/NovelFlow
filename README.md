# NovelFlow
AI小说写作助手
# NovelFlow - AI 辅助小说写作平台

## 📖 项目简介

NovelFlow 是一个集 **AI 辅助写作**、**小说管理**、**角色设计**、**世界观构建**于一体的全功能小说创作平台。通过先进的 AI 技术，帮助作家快速生成灵感、完善剧情、管理故事世界。

## ✨ 核心功能

### 📝 写作工具
- **沉浸式编辑器**：支持 Markdown 语法，实时预览效果
- **自动保存**：编辑内容自动保存，防止意外丢失
- **AI 章节生成**：基于章节简介智能生成内容草稿
- **格式快捷工具栏**：提供粗体、斜体、标题、列表等常用格式

### 📚 小说管理
- **章节管理**：创建、编辑、删除、排序章节
- **小说统计**：实时显示章节数、字数、段落数等信息
- **内容导出**：支持将小说导出为多种格式
- **版本控制**：记录创作历史，支持版本回滚

### 🎭 角色设计
- **角色档案**：创建详细的角色信息卡片
- **关系图谱**：可视化展示角色之间的关系网络
- **角色发展**：追踪角色在故事中的成长轨迹
- **AI 角色建议**：基于角色设定生成发展建议

### 🌍 世界观构建
- **世界设定**：记录小说世界的规则、历史、地理等
- **时间线**：可视化展示故事的时间脉络
- **地点管理**：创建和管理故事中的重要地点
- **AI 世界扩展**：基于现有设定智能扩展世界观

### 🔧 管理功能
- **用户认证**：支持注册、登录、权限管理
- **管理员后台**：管理用户、小说、系统配置
- **数据备份**：定期备份用户数据
- **系统监控**：实时监控系统状态

## 🛠️ 技术栈

| 分类 | 主要依赖 |
|---|---|
| 前端框架 | Next.js 16 · App Router |
| UI & 样式 | React · Tailwind CSS 4 |
| 语言 | TypeScript 5 |
| 数据库 | PostgreSQL · SQLite |
| ORM | Prisma 5 |
| 认证 | JWT · NextAuth |
| AI 服务 | LangChain · OpenAI 兼容接口 |
| 代码质量 | ESLint · Prettier |
| 部署 | Docker · Vercel · CloudFlare pages |

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



## 环境要求
- Node.js 18.x 或更高版本
- PostgreSQL 14.x 或更高版本
- Git
## 部署

本项目**支持 Vercel、Docker 和 Cloudflare** 部署。
### 一键安装（本地部署）

我们提供了一键安装脚本，简化依赖安装过程：

1. **运行安装脚本**
```powershell
# 在项目根目录执行
.nstall-dependencies.ps1
```

2. **配置环境变量**
```bash
cd novel-writing-platform
cp .env.example .env
# 编辑 .env 文件，配置数据库连接、AI API 密钥等
```

3. **数据库初始化**
```bash
npx prisma migrate dev
npx prisma generate
```

4. **启动开发服务器**
```bash
npm run dev
```

5. **访问应用**
打开浏览器访问 http://localhost:5000

### 🐳 Docker 部署

本项目已包含优化的 Docker 配置，支持使用 Docker Compose 进行容器化部署。配置采用了现代最佳实践，包括多阶段构建、非 root 用户、健康检查、资源限制等功能。

#### 环境要求
- Docker (20.10 或更高版本)
- Docker Compose (2.0 或更高版本)

#### 本地开发部署

项目提供了 Dockerfile 和 docker-compose.yml 文件，支持通过 Docker 进行部署。

1. **构建 Docker 镜像 (如果需要自定义或本地构建)**

首先，您需要进入 novel-writing-platform 目录：

```
cd c:\Users\10153\OneDrive\桌面
\NovelFlow\novel-writing-platform
```
然后，可以使用以下命令构建 Docker 镜像：

```
docker build -t novel-flow .
```
2. **运行 Docker 容器 (使用 docker-compose )**

项目根目录下有一个 docker-compose.yml 文件，可以用来启动整个服务，包括数据库。

首先，确保您在 c:\Users\10153\OneDrive\桌面\NovelFlow 目录下。

```
cd c:\Users\10153\OneDrive\桌面\NovelFlow
```
然后，运行 Docker Compose：

```
docker-compose up -d
```
这会启动 novel-writing-platform 服务以及其依赖的数据库。

3. **访问应用**

服务启动后，您可以通过 `http://localhost:5000` 访问 NovelFlow 应用。



### Vercel 部署


1. Fork 仓库 ：将 NovelFlow/novel-writing-platform 仓库 Fork 到您的 GitHub 账户。
2. 连接 Vercel ：登录 Vercel，创建一个新项目，并连接到您 Fork 的 GitHub 仓库。
3. 配置环境变量 ：Vercel 会自动检测 Next.js 项目。您可能需要配置一些环境变量，例如数据库连接字符串（如果使用外部数据库服务，如 PostgreSQL 或 MongoDB Atlas）和 AI API 密钥。
4. 部署 ：Vercel 会自动构建并部署您的 Next.js 应用。
### Cloudflare Pages 部署

1. Fork 仓库 ：将 NovelFlow/novel-writing-platform 仓库 Fork 到您的 GitHub 账户。
2. 连接 Cloudflare Pages ：登录 Cloudflare，进入 Pages 服务，创建一个新项目，并连接到您 Fork 的 GitHub 仓库。
3. 构建命令 ：Cloudflare Pages 也会自动检测 Next.js 项目。您可能需要确认或设置构建命令（通常是 npm run build 或 pnpm run build ，取决于您使用的包管理器）和输出目录（通常是 .next ）。
4. 配置环境变量 ：与 Vercel 类似，您需要配置数据库连接字符串和 AI API 密钥等环境变量。
5. 部署 ：Cloudflare Pages 会自动构建并部署您的 Next.js 应用。

## 📖 使用指南

### 创建第一个小说
1. 注册并登录账户
2. 点击 "创建小说" 按钮
3. 填写小说基本信息（标题、类型、简介）
4. 进入小说管理页面

### 编写章节
1. 点击 "新建章节" 按钮
2. 填写章节标题和简介
3. 在编辑器中开始写作
4. 使用 AI 助手生成灵感
5. 点击保存或等待自动保存

### 设计角色
1. 进入 "角色管理" 页面
2. 点击 "创建角色"
3. 填写角色基本信息（姓名、性别、年龄、性格等）
4. 使用 AI 助手扩展角色背景



## 📊 项目状态

- ✅ 核心功能开发完成
- ✅ AI 辅助写作功能可用
- ✅ 角色管理系统完成
- ✅ 世界观构建工具完成
- ✅ 管理员后台完成
- 🔄 移动端适配开发中
- 🔄 多语言支持开发中
- 🔄 插件系统开发中


**NovelFlow - 让创作更流畅** 🚀
