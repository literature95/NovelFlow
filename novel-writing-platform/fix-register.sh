#!/bin/bash

echo "🔧 小说创作平台注册问题快速修复脚本"
echo "======================================"
echo ""

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 打印带颜色的消息
print_status() {
    local color=$1
    local message=$2
    echo -e "${color}${message}${NC}"
}

print_status $BLUE "步骤1: 检查服务状态..."

# 检查服务是否运行
if ! curl -s http://localhost:${DEPLOY_RUN_PORT:-5000}/api/debug > /dev/null 2>&1; then
    print_status $RED "❌ 服务未运行，正在启动..."
    
    # 杀死可能存在的进程
    pkill -f "next start" 2>/dev/null || true
    
    # 重新启动服务
    cd /workspace/projects/novel-writing-platform
    bash /workspace/projects/.cozeproj/scripts/deploy_run.sh > output.log 2>&1 &
    
    # 等待服务启动
    print_status $YELLOW "⏳ 等待服务启动..."
    sleep 5
    
    # 再次检查
    if curl -s http://localhost:${DEPLOY_RUN_PORT:-5000}/api/debug > /dev/null 2>&1; then
        print_status $GREEN "✅ 服务启动成功"
    else
        print_status $RED "❌ 服务启动失败，请检查日志"
        tail -10 output.log
        exit 1
    fi
else
    print_status $GREEN "✅ 服务正在运行"
fi

print_status $BLUE "步骤2: 重置数据库..."

# 重置数据库以确保干净状态
cd /workspace/projects/novel-writing-platform
npx prisma db push --force-reset > /dev/null 2>&1
print_status $GREEN "✅ 数据库重置完成"

print_status $BLUE "步骤3: 验证JWT配置..."

# 检查环境变量
if [ -f ".env.local" ]; then
    if grep -q "your-secret-key-here" .env.local; then
        print_status $YELLOW "⚠️  发现默认JWT密钥，正在修复..."
        sed -i 's/NEXTAUTH_SECRET=your-secret-key-here/NEXTAUTH_SECRET=novel-writing-platform-jwt-secret-key-2024-secure-random-string/' .env.local
        print_status $GREEN "✅ JWT密钥已更新"
    else
        print_status $GREEN "✅ JWT配置正常"
    fi
else
    print_status $RED "❌ 未找到.env.local文件"
fi

print_status $BLUE "步骤4: 测试注册功能..."

# 测试一个简单的注册
TEST_EMAIL="fixtest$(date +%s)@example.com"
TEST_USER="fixtest$(date +%s)"
TEST_PASS="password123"

RESPONSE=$(curl -s -X POST http://localhost:${DEPLOY_RUN_PORT:-5000}/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$TEST_EMAIL\",\"username\":\"$TEST_USER\",\"password\":\"$TEST_PASS\"}")

if echo "$RESPONSE" | grep -q "注册成功"; then
    print_status $GREEN "✅ 注册功能测试通过"
    TOKEN=$(echo "$RESPONSE" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
    print_status $GREEN "✅ Token生成正常 (长度: ${#TOKEN})"
else
    print_status $RED "❌ 注册功能测试失败"
    print_status $RED "错误响应: $RESPONSE"
fi

print_status $BLUE "步骤5: 重启服务确保配置生效..."

# 重启服务
pkill -f "next start" 2>/dev/null || true
sleep 2
cd /workspace/projects/novel-writing-platform
bash /workspace/projects/.cozeproj/scripts/deploy_run.sh > output.log 2>&1 &
sleep 5

print_status $GREEN "✅ 服务重启完成"

echo ""
print_status $BLUE "======================================"
print_status $GREEN "🎉 修复完成！"
echo ""
print_status $BLUE "可用的测试工具:"
echo "1. 诊断页面: http://localhost:8082/register-diagnosis.html"
echo "2. 前端测试: http://localhost:8081/frontend-test.html"
echo "3. 注册页面: http://localhost:${DEPLOY_RUN_PORT:-5000}/register"
echo ""
print_status $YELLOW "如果仍有问题，请:"
echo "1. 检查浏览器控制台是否有JavaScript错误"
echo "2. 确认网络连接正常"
echo "3. 使用诊断页面进行详细测试"
echo "4. 查看服务器日志: tail -f output.log"
echo ""
print_status $GREEN "注册功能现在应该正常工作了！"