#!/usr/bin/env powershell

Write-Host "=== 小说创作平台注册功能诊断脚本 ==="
Write-Host "时间: $(Get-Date)"
$port = if ($env:DEPLOY_RUN_PORT) { $env:DEPLOY_RUN_PORT } else { 5000 }
Write-Host "端口: $port"
Write-Host ""

# 1. 检查服务是否运行
Write-Host "1. 检查服务状态..."
try {
    $response = Invoke-WebRequest -Uri "http://localhost:$port/api/debug" -UseBasicParsing -ErrorAction SilentlyContinue
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ 服务正在运行"
    } else {
        Write-Host "❌ 服务未运行或无法访问"
        exit 1
    }
} catch {
    Write-Host "❌ 服务未运行或无法访问"
    exit 1
}

# 2. 检查系统配置
Write-Host ""
Write-Host "2. 检查系统配置..."
$config = Invoke-RestMethod -Uri "http://localhost:$port/api/debug" -UseBasicParsing
try {
    if ($config.success) {
        Write-Host "✅ 系统配置正常"
        Write-Host "  数据库连接: $($config.data.dbConnection)"
        Write-Host "  JWT测试: $($config.data.jwtTest)"
        Write-Host "  密码哈希测试: $($config.data.passwordHashTest)"
    } else {
        Write-Host "❌ 系统配置异常"
        Write-Host "  错误: $($config.error ?? "未知错误")"
    }
} catch {
    Write-Host "❌ 无法解析配置信息"
}

# 3. 测试各种注册场景
Write-Host ""
Write-Host "3. 测试注册场景..."

# 测试场景1: 正常注册
Write-Host "测试3a: 正常注册..."
$random = Get-Random
$body = @{
    email = "normaltest$random@example.com"
    username = "normaltest$random"
    password = "password123"
}
$jsonBody = $body | ConvertTo-Json
try {
    $response = Invoke-RestMethod -Uri "http://localhost:$port/api/auth/register" -Method POST -Body $jsonBody -ContentType "application/json" -UseBasicParsing
    if ($response.success) {
        Write-Host "✅ 正常注册成功"
    } else {
        Write-Host "❌ 正常注册失败"
        Write-Host "响应: $($response | ConvertTo-Json)"
    }
} catch {
    Write-Host "❌ 正常注册失败"
    Write-Host "错误: $($_.Exception.Message)"
}

# 测试场景2: 重复邮箱
Write-Host ""
Write-Host "测试3b: 重复邮箱..."
$body = @{
    email = "normaltest@example.com"
    username = "newuser"
    password = "password123"
}
$jsonBody = $body | ConvertTo-Json
try {
    $response = Invoke-RestMethod -Uri "http://localhost:$port/api/auth/register" -Method POST -Body $jsonBody -ContentType "application/json" -UseBasicParsing
    if ($response.error -match "邮箱已存在") {
        Write-Host "✅ 重复邮箱检测正常"
    } else {
        Write-Host "❌ 重复邮箱检测异常"
        Write-Host "响应: $($response | ConvertTo-Json)"
    }
} catch {
    Write-Host "❌ 重复邮箱检测异常"
    Write-Host "错误: $($_.Exception.Message)"
}

# 测试场景3: 密码太短
Write-Host ""
Write-Host "测试3c: 密码太短..."
$body = @{
    email = "shortpass@example.com"
    username = "shortuser"
    password = "123"
}
$jsonBody = $body | ConvertTo-Json
try {
    $response = Invoke-RestMethod -Uri "http://localhost:$port/api/auth/register" -Method POST -Body $jsonBody -ContentType "application/json" -UseBasicParsing
    if ($response.error -match "密码长度至少6位") {
        Write-Host "✅ 密码长度验证正常"
    } else {
        Write-Host "❌ 密码长度验证异常"
        Write-Host "响应: $($response | ConvertTo-Json)"
    }
} catch {
    Write-Host "❌ 密码长度验证异常"
    Write-Host "错误: $($_.Exception.Message)"
}

# 测试场景4: 邮箱格式错误
Write-Host ""
Write-Host "测试3d: 邮箱格式错误..."
$body = @{
    email = "invalid-email"
    username = "invaliduser"
    password = "password123"
}
$jsonBody = $body | ConvertTo-Json
try {
    $response = Invoke-RestMethod -Uri "http://localhost:$port/api/auth/register" -Method POST -Body $jsonBody -ContentType "application/json" -UseBasicParsing
    if ($response.error -match "请输入有效的邮箱地址") {
        Write-Host "✅ 邮箱格式验证正常"
    } else {
        Write-Host "❌ 邮箱格式验证异常"
        Write-Host "响应: $($response | ConvertTo-Json)"
    }
} catch {
    Write-Host "❌ 邮箱格式验证异常"
    Write-Host "错误: $($_.Exception.Message)"
}

# 4. 检查Token生成
Write-Host ""
Write-Host "4. 检查Token生成..."
$random = Get-Random
$body = @{
    email = "tokentest$random@example.com"
    username = "tokentest$random"
    password = "password123"
}
$jsonBody = $body | ConvertTo-Json
try {
    $response = Invoke-RestMethod -Uri "http://localhost:$port/api/auth/register" -Method POST -Body $jsonBody -ContentType "application/json" -UseBasicParsing
    if ($response.token) {
        Write-Host "✅ Token生成正常"
        $token = $response.token
        if ($token.Length -gt 50) {
            Write-Host "✅ Token长度正常"
        } else {
            Write-Host "❌ Token长度异常"
        }
    } else {
        Write-Host "❌ Token生成失败"
        Write-Host "响应: $($response | ConvertTo-Json)"
    }
} catch {
    Write-Host "❌ Token生成失败"
    Write-Host "错误: $($_.Exception.Message)"
}

# 5. 提供前端测试链接
Write-Host ""
Write-Host "5. 前端测试..."
Write-Host "前端测试页面: http://localhost:8081/frontend-test.html"
Write-Host "请通过浏览器访问上述链接进行前端测试"

# 6. 检查最新日志
Write-Host ""
Write-Host "6. 最新服务器日志:"
$logPath = "output.log"
if (Test-Path $logPath) {
    Write-Host "最近10行日志:"
    Get-Content $logPath -Tail 10
} else {
    Write-Host "未找到日志文件"
}

Write-Host ""
Write-Host "=== 诊断完成 ==="
Write-Host "如果所有测试都显示✅，则注册功能正常工作。"
Write-Host "如果有❌，请根据上述信息进行相应的修复。"