#!/bin/bash

echo "=== 小说创作平台注册功能最终测试 ==="
echo ""

# 测试环境变量
echo "1. 检查系统调试信息..."
DEBUG_RESPONSE=$(curl -s http://localhost:${DEPLOY_RUN_PORT}/api/debug)
echo "调试信息: $DEBUG_RESPONSE"
echo ""

# 测试各种错误场景
echo "2. 测试错误场景..."

echo "测试2a: 空字段..."
curl -s -X POST http://localhost:${DEPLOY_RUN_PORT}/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{}' | jq .

echo ""
echo "测试2b: 密码太短..."
curl -s -X POST http://localhost:${DEPLOY_RUN_PORT}/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","username":"test","password":"123"}' | jq .

echo ""
echo "测试2c: 邮箱格式错误..."
curl -s -X POST http://localhost:${DEPLOY_RUN_PORT}/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"invalid-email","username":"test","password":"123456"}' | jq .

echo ""
echo "3. 测试正常注册..."
REGISTER_RESPONSE=$(curl -s -X POST http://localhost:${DEPLOY_RUN_PORT}/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"finaltest'$RANDOM'@example.com","username":"finaltest'$RANDOM'","password":"password123"}')

echo "注册响应: $REGISTER_RESPONSE"

# 提取token和用户信息进行验证
TOKEN=$(echo $REGISTER_RESPONSE | jq -r '.token')
EMAIL=$(echo $REGISTER_RESPONSE | jq -r '.user.email')
USERNAME=$(echo $REGISTER_RESPONSE | jq -r '.user.username')

echo ""
echo "4. 验证登录功能..."
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:${DEPLOY_RUN_PORT}/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"password123\"}")

echo "登录响应: $LOGIN_RESPONSE"

echo ""
echo "=== 测试完成 ==="
echo "如果看到以上所有测试都返回了预期的JSON响应，说明注册功能正常工作！"