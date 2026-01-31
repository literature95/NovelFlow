#!/bin/bash

echo "=== 小说创作平台注册功能诊断脚本 ==="
echo "时间: $(date)"
echo "端口: ${DEPLOY_RUN_PORT:-5000}"
echo ""

# 1. 检查服务是否运行
echo "1. 检查服务状态..."
if curl -s http://localhost:${DEPLOY_RUN_PORT:-5000}/api/debug > /dev/null; then
    echo "✅ 服务正在运行"
else
    echo "❌ 服务未运行或无法访问"
    exit 1
fi

# 2. 检查系统配置
echo ""
echo "2. 检查系统配置..."
CONFIG=$(curl -s http://localhost:${DEPLOY_RUN_PORT:-5000}/api/debug)
echo "系统配置信息:"
echo "$CONFIG" | python3 -c "
import json, sys
try:
    data = json.load(sys.stdin)
    if data.get('success'):
        print('✅ 系统配置正常')
        print(f'  数据库连接: {data[\"data\"][\"dbConnection\"]}')
        print(f'  JWT测试: {data[\"data\"][\"jwtTest\"]}')
        print(f'  密码哈希测试: {data[\"data\"][\"passwordHashTest\"]}')
    else:
        print('❌ 系统配置异常')
        print(f'  错误: {data.get(\"error\", \"未知错误\")}')
except:
    print('❌ 无法解析配置信息')
"

# 3. 测试各种注册场景
echo ""
echo "3. 测试注册场景..."

# 测试场景1: 正常注册
echo "测试3a: 正常注册..."
RESPONSE=$(curl -s -X POST http://localhost:${DEPLOY_RUN_PORT:-5000}/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"normaltest$RANDOM@example.com\",\"username\":\"normaltest$RANDOM\",\"password\":\"password123\"}")

if echo "$RESPONSE" | grep -q "注册成功"; then
    echo "✅ 正常注册成功"
else
    echo "❌ 正常注册失败"
    echo "响应: $RESPONSE"
fi

# 测试场景2: 重复邮箱
echo ""
echo "测试3b: 重复邮箱..."
RESPONSE=$(curl -s -X POST http://localhost:${DEPLOY_RUN_PORT:-5000}/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"normaltest@example.com","username":"newuser","password":"password123"}')

if echo "$RESPONSE" | grep -q "邮箱已存在"; then
    echo "✅ 重复邮箱检测正常"
else
    echo "❌ 重复邮箱检测异常"
    echo "响应: $RESPONSE"
fi

# 测试场景3: 密码太短
echo ""
echo "测试3c: 密码太短..."
RESPONSE=$(curl -s -X POST http://localhost:${DEPLOY_RUN_PORT:-5000}/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"shortpass@example.com","username":"shortuser","password":"123"}')

if echo "$RESPONSE" | grep -q "密码长度至少6位"; then
    echo "✅ 密码长度验证正常"
else
    echo "❌ 密码长度验证异常"
    echo "响应: $RESPONSE"
fi

# 测试场景4: 邮箱格式错误
echo ""
echo "测试3d: 邮箱格式错误..."
RESPONSE=$(curl -s -X POST http://localhost:${DEPLOY_RUN_PORT:-5000}/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"invalid-email","username":"invaliduser","password":"password123"}')

if echo "$RESPONSE" | grep -q "请输入有效的邮箱地址"; then
    echo "✅ 邮箱格式验证正常"
else
    echo "❌ 邮箱格式验证异常"
    echo "响应: $RESPONSE"
fi

# 4. 检查Token生成
echo ""
echo "4. 检查Token生成..."
TOKEN_TEST=$(curl -s -X POST http://localhost:${DEPLOY_RUN_PORT:-5000}/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"tokentest$RANDOM@example.com\",\"username\":\"tokentest$RANDOM\",\"password\":\"password123\"}")

if echo "$TOKEN_TEST" | grep -q "token"; then
    echo "✅ Token生成正常"
    TOKEN=$(echo "$TOKEN_TEST" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
    if [ ${#TOKEN} -gt 50 ]; then
        echo "✅ Token长度正常"
    else
        echo "❌ Token长度异常"
    fi
else
    echo "❌ Token生成失败"
    echo "响应: $TOKEN_TEST"
fi

# 5. 提供前端测试链接
echo ""
echo "5. 前端测试..."
echo "前端测试页面: http://localhost:8081/frontend-test.html"
echo "请通过浏览器访问上述链接进行前端测试"

# 6. 检查最新日志
echo ""
echo "6. 最新服务器日志:"
if [ -f "output.log" ]; then
    echo "最近10行日志:"
    tail -10 output.log
else
    echo "未找到日志文件"
fi

echo ""
echo "=== 诊断完成 ==="
echo "如果所有测试都显示✅，则注册功能正常工作。"
echo "如果有❌，请根据上述信息进行相应的修复。"