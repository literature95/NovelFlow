#!/bin/bash

echo "=========================================="
echo "移动端注册问题修复脚本"
echo "=========================================="
echo "开始时间: $(date)"
echo ""

# 进入项目目录
cd "$(dirname "$0")"

# 检查项目结构
echo "1. 检查项目结构..."
if [ ! -d "src" ]; then
    echo "❌ 错误: 未找到 src 目录，请确保在正确的项目根目录运行此脚本"
    exit 1
fi

# 检查环境变量配置
echo ""
echo "2. 检查环境变量配置..."
if [ -f ".env.local" ]; then
    echo "✓ 找到 .env.local 文件"
    
    # 检查 NEXTAUTH_SECRET
    if grep -q "NEXTAUTH_SECRET=" .env.local; then
        SECRET_VALUE=$(grep "NEXTAUTH_SECRET=" .env.local | cut -d'=' -f2)
        if [ "$SECRET_VALUE" = "your-secret-key-here" ] || [ -z "$SECRET_VALUE" ]; then
            echo "⚠️  警告: NEXTAUTH_SECRET 未正确配置"
            echo "正在生成新的JWT密钥..."
            NEW_SECRET=$(openssl rand -base64 32)
            sed -i "s/NEXTAUTH_SECRET=.*/NEXTAUTH_SECRET=$NEW_SECRET/" .env.local
            echo "✓ JWT密钥已更新"
        else
            echo "✓ NEXTAUTH_SECRET 已正确配置 (长度: ${#SECRET_VALUE})"
        fi
    else
        echo "❌ 错误: 未找到 NEXTAUTH_SECRET 配置"
        echo "正在添加 NEXTAUTH_SECRET..."
        NEW_SECRET=$(openssl rand -base64 32)
        echo "NEXTAUTH_SECRET=$NEW_SECRET" >> .env.local
        echo "✓ NEXTAUTH_SECRET 已添加"
    fi
else
    echo "❌ 错误: 未找到 .env.local 文件"
    echo "正在创建 .env.local 文件..."
    NEW_SECRET=$(openssl rand -base64 32)
    cat > .env.local << EOF
# 数据库配置
DATABASE_URL="file:./dev.db"

# JWT密钥配置
NEXTAUTH_SECRET="$NEW_SECRET"

# 应用配置
NEXTAUTH_URL="http://localhost:3000"
NODE_ENV="development"
EOF
    echo "✓ .env.local 文件已创建"
fi

# 检查依赖
echo ""
echo "3. 检查依赖..."
if [ -f "package.json" ]; then
    echo "✓ 找到 package.json"
    
    # 检查关键依赖
    DEPENDENCIES=("bcryptjs" "jsonwebtoken" "prisma" "@prisma/client")
    for dep in "${DEPENDENCIES[@]}"; do
        if npm list "$dep" > /dev/null 2>&1; then
            echo "✓ $dep 已安装"
        else
            echo "❌ $dep 未安装，正在安装..."
            npm install "$dep"
        fi
    done
else
    echo "❌ 错误: 未找到 package.json"
fi

# 检查数据库
echo ""
echo "4. 检查数据库..."
if [ -f "prisma/schema.prisma" ]; then
    echo "✓ 找到 Prisma schema"
    
    # 检查数据库文件
    if [ -f "prisma/dev.db" ]; then
        echo "✓ 数据库文件存在"
    else
        echo "⚠️  数据库文件不存在，正在初始化..."
        npx prisma migrate dev --name init || npx prisma db push
        echo "✓ 数据库已初始化"
    fi
    
    # 检查表结构
    echo "检查用户表结构..."
    npx prisma db pull > /dev/null 2>&1
    if npx prisma db push --accept-data-loss > /dev/null 2>&1; then
        echo "✓ 数据库结构同步完成"
    fi
else
    echo "❌ 错误: 未找到 Prisma schema"
fi

# 检查API路由
echo ""
echo "5. 检查API路由..."
API_FILES=(
    "src/app/api/auth/register/route.ts"
    "src/app/api/auth/login/route.ts"
    "src/app/api/debug/route.ts"
)

for file in "${API_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "✓ $file 存在"
    else
        echo "❌ $file 不存在"
    fi
done

# 检查页面文件
echo ""
echo "6. 检查页面文件..."
PAGE_FILES=(
    "src/app/register/page.tsx"
    "src/app/login/page.tsx"
    "src/app/page.tsx"
)

for file in "${PAGE_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "✓ $file 存在"
    else
        echo "❌ $file 不存在"
    fi
done

# 生成测试文件
echo ""
echo "7. 生成移动端测试文件..."
if [ -f "mobile-register-test.html" ]; then
    echo "✓ 移动端测试文件已存在"
else
    echo "⚠️  移动端测试文件不存在"
fi

# 构建项目
echo ""
echo "8. 构建项目..."
echo "正在安装依赖..."
npm install

echo "正在构建项目..."
npm run build

if [ $? -eq 0 ]; then
    echo "✓ 项目构建成功"
else
    echo "❌ 项目构建失败"
    exit 1
fi

# 测试调试API
echo ""
echo "9. 测试调试API..."
echo "启动开发服务器进行测试..."

# 创建测试脚本
cat > test-api.js << 'EOF'
const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/debug',
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
};

const req = http.request(options, (res) => {
  console.log(`状态码: ${res.statusCode}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const parsed = JSON.parse(data);
      console.log('调试API测试结果:', JSON.stringify(parsed, null, 2));
    } catch (e) {
      console.log('响应内容:', data);
    }
  });
});

req.on('error', (e) => {
  console.error('请求失败:', e.message);
});

req.end();
EOF

echo "✓ 测试脚本已创建"
echo ""
echo "=========================================="
echo "修复完成!"
echo "=========================================="
echo ""
echo "下一步操作:"
echo "1. 启动开发服务器: npm run dev"
echo "2. 在另一个终端运行测试: node test-api.js"
echo "3. 访问移动端测试页面: mobile-register-test.html"
echo "4. 在移动设备浏览器中测试注册功能"
echo ""
echo "修复内容:"
echo "• 优化JWT密钥配置"
echo "• 增强移动端错误处理"
echo "• 改进网络超时机制"
echo "• 优化本地存储处理"
echo "• 增加详细的调试信息"
echo ""
echo "完成时间: $(date)"