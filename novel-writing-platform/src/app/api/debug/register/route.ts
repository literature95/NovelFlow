import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const debugInfo = {
    timestamp: new Date().toISOString(),
    requestId: `debug_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    environment: process.env.NODE_ENV,
    serverInfo: {
      nextVersion: process.env.npm_package_next,
      nodeVersion: process.version,
      platform: process.platform
    },
    configuration: {
      databaseUrl: process.env.DATABASE_URL ? 'configured' : 'not configured',
      jwtSecret: process.env.NEXTAUTH_SECRET ? {
        configured: true,
        length: process.env.NEXTAUTH_SECRET.length,
        isDefault: process.env.NEXTAUTH_SECRET === 'your-secret-key-here'
      } : {
        configured: false
      },
      nextAuthUrl: process.env.NEXTAUTH_URL || 'not configured'
    },
    database: {
      connected: false,
      userCount: 0,
      lastError: null as string | null
    },
    request: {
      method: request.method,
      url: request.url,
      userAgent: request.headers.get('user-agent'),
      ip: request.headers.get('x-forwarded-for') || 
           request.headers.get('x-real-ip') || 
           request.headers.get('cf-connecting-ip') || 
           'unknown'
    }
  }

  // 测试数据库连接
  try {
    await prisma.$connect()
    debugInfo.database.connected = true
    debugInfo.database.userCount = await prisma.user.count()
  } catch (error) {
    debugInfo.database.lastError = error instanceof Error ? error.message : 'Unknown error'
  } finally {
    await prisma.$disconnect()
  }

  return NextResponse.json(debugInfo)
}

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    const body = await request.json()
    const { email, username, password } = body
    
    const debugResult = {
      timestamp: new Date().toISOString(),
      requestId: `debug_reg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      processingTime: 0,
      steps: [] as Array<{step: number; name: string; status: string; data?: Record<string, unknown>; error?: string; existingUser?: Record<string, unknown>; secretInfo?: Record<string, unknown>; message?: string}>,
      success: false,
      error: null as string | null,
      jwtToken: null as string | null,
      userData: null as Record<string, unknown> | null
    }

    // 步骤1: 输入验证
    debugResult.steps.push({
      step: 1,
      name: '输入验证',
      status: 'starting',
      data: { email, username, passwordLength: password?.length }
    })

    if (!email || !username || !password) {
      debugResult.steps[0].status = 'failed'
      debugResult.steps[0].error = '缺少必要字段'
      debugResult.error = '所有字段都是必需的'
      return NextResponse.json(debugResult)
    }

    if (password.length < 6) {
      debugResult.steps[0].status = 'failed'
      debugResult.steps[0].error = '密码长度不足'
      debugResult.error = '密码长度至少6位'
      return NextResponse.json(debugResult)
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.trim())) {
      debugResult.steps[0].status = 'failed'
      debugResult.steps[0].error = '邮箱格式错误'
      debugResult.error = '请输入有效的邮箱地址'
      return NextResponse.json(debugResult)
    }

    debugResult.steps[0].status = 'completed'

    // 步骤2: 数据库连接测试
    debugResult.steps.push({
      step: 2,
      name: '数据库连接测试',
      status: 'starting'
    })

    try {
      await prisma.$connect()
      debugResult.steps[1].status = 'completed'
    } catch (error) {
      debugResult.steps[1].status = 'failed'
      debugResult.steps[1].error = error instanceof Error ? error.message : '数据库连接失败'
      debugResult.error = '数据库连接失败'
      return NextResponse.json(debugResult)
    }

    // 步骤3: 检查现有用户
    debugResult.steps.push({
      step: 3,
      name: '检查现有用户',
      status: 'starting'
    })

    try {
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [
            { email: email.trim() },
            { username: username.trim() }
          ]
        }
      })

      if (existingUser) {
        const conflictType = existingUser.email === email.trim() ? 'email' : 'username'
        debugResult.steps[2].status = 'failed'
        debugResult.steps[2].error = `用户已存在 (${conflictType})`
        debugResult.steps[2].existingUser = {
          id: existingUser.id,
          email: existingUser.email,
          username: existingUser.username
        }
        debugResult.error = conflictType === 'email' ? '邮箱已存在' : '用户名已存在'
        return NextResponse.json(debugResult)
      }

      debugResult.steps[2].status = 'completed'
    } catch (error) {
      debugResult.steps[2].status = 'failed'
      debugResult.steps[2].error = error instanceof Error ? error.message : '用户检查失败'
      debugResult.error = '用户检查失败'
      return NextResponse.json(debugResult)
    }

    // 步骤4: JWT密钥验证
    debugResult.steps.push({
      step: 4,
      name: 'JWT密钥验证',
      status: 'starting'
    })

    const jwtSecret = process.env.NEXTAUTH_SECRET
    if (!jwtSecret || jwtSecret === 'your-secret-key-here' || jwtSecret.length < 32) {
      debugResult.steps[3].status = 'failed'
      debugResult.steps[3].error = 'JWT密钥未正确配置'
      debugResult.steps[3].secretInfo = {
        exists: !!jwtSecret,
        length: jwtSecret?.length || 0,
        isDefault: jwtSecret === 'your-secret-key-here'
      }
      debugResult.error = '系统配置错误：JWT密钥未正确配置'
      return NextResponse.json(debugResult)
    }

    debugResult.steps[3].status = 'completed'
    debugResult.steps[3].secretInfo = {
      exists: true,
      length: jwtSecret.length,
      isDefault: false
    }

    // 如果所有检查都通过，返回成功状态但不实际创建用户
    debugResult.steps.push({
      step: 5,
      name: '前置验证完成',
      status: 'completed',
      message: '所有验证步骤通过，可以进行实际注册'
    })

    debugResult.success = true
    debugResult.processingTime = Date.now() - startTime

    return NextResponse.json(debugResult)

  } catch (error) {
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      error: '调试端点异常',
      details: error instanceof Error ? error.message : '未知错误',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}