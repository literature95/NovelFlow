import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '@/lib/prisma'

// CORS配置
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Mobile-Optimized, X-Client-Info',
  'Access-Control-Max-Age': '86400',
}

export async function OPTIONS(request: NextRequest) {
  const response = new NextResponse(null, { status: 200 })
  Object.entries(corsHeaders).forEach(([key, value]) => {
    response.headers.set(key, value)
  })
  return response
}

export async function POST(_request: NextRequest) {
  const startTime = Date.now()
  const requestId = `login_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  
  try {
    // 记录请求信息
    const userAgent = request.headers.get('user-agent') || ''
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               request.headers.get('cf-connecting-ip') || 
               'unknown'
    const contentType = request.headers.get('content-type')
    const origin = request.headers.get('origin')
    
    console.log(`[${requestId}] 登录请求开始:`, { 
      timestamp: new Date().toISOString(),
      userAgent: userAgent.substring(0, 150),
      ip,
      contentType,
      origin,
      method: request.method
    })

    // 解析请求体
    let requestData: Record<string, unknown>
    try {
      const requestText = await request.text()
      console.log(`[${requestId}] 请求体内容长度: ${requestText.length}`)
      
      if (!requestText.trim()) {
        throw new Error('请求体为空')
      }
      
      requestData = JSON.parse(requestText)
    } catch (parseError) {
      console.error(`[${requestId}] 请求体解析失败:`, parseError)
      const response = NextResponse.json(
        { 
          error: '请求数据格式错误',
          code: 'INVALID_REQUEST_BODY',
          requestId,
          details: parseError instanceof Error ? parseError.message : 'JSON解析失败'
        },
        { status: 400 }
      )
      Object.entries(corsHeaders).forEach(([key, value]) => {
        response.headers.set(key, value)
      })
      return response
    }

    const email = typeof requestData.email === 'string' ? requestData.email : ''
    const password = typeof requestData.password === 'string' ? requestData.password : ''

    console.log(`[${requestId}] 收到登录请求: email=${email}, password=${password}`)

    // 特殊处理：admin管理员登录
    if (email === 'admin' && password === '1234') {
      console.log(`[${requestId}] Admin用户登录`)
      
      // 生成简单的token
      const token = Buffer.from(JSON.stringify({
        userId: 'admin-user',
        username: 'admin',
        role: 'admin',
        timestamp: Date.now()
      })).toString('base64')

      const user = {
        id: 'admin-user',
        username: 'admin',
        email: 'admin@example.com',
        role: 'admin'
      }

      const response = NextResponse.json({
        message: '登录成功',
        token,
        user
      })
      Object.entries(corsHeaders).forEach(([key, value]) => {
        response.headers.set(key, value)
      })
      return response
    }

    // 输入验证
    if (!email || !password) {
      console.log(`[${requestId}] 验证失败: 缺少必要字段`)
      const response = NextResponse.json(
        { 
          error: '邮箱和密码是必需的',
          code: 'MISSING_FIELDS',
          requestId,
          details: {
            email: !!email,
            password: !!password
          }
        },
        { status: 400 }
      )
      Object.entries(corsHeaders).forEach(([key, value]) => {
        response.headers.set(key, value)
      })
      return response
    }

    // 清理和标准化输入
    const cleanEmail = email.trim().normalize('NFC')

    if (cleanEmail.length === 0) {
      console.log(`[${requestId}] 验证失败: 邮箱为空`)
      const response = NextResponse.json(
        { 
          error: '邮箱不能为空',
          code: 'EMPTY_EMAIL',
          requestId
        },
        { status: 400 }
      )
      Object.entries(corsHeaders).forEach(([key, value]) => {
        response.headers.set(key, value)
      })
      return response
    }

    if (password.length < 1) {
      console.log(`[${requestId}] 验证失败: 密码为空`)
      const response = NextResponse.json(
        { 
          error: '密码不能为空',
          code: 'EMPTY_PASSWORD',
          requestId
        },
        { status: 400 }
      )
      Object.entries(corsHeaders).forEach(([key, value]) => {
        response.headers.set(key, value)
      })
      return response
    }

    // 邮箱格式验证
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(cleanEmail)) {
      console.log(`[${requestId}] 验证失败: 邮箱格式不正确`)
      const response = NextResponse.json(
        { 
          error: '请输入有效的邮箱地址',
          code: 'INVALID_EMAIL',
          requestId
        },
        { status: 400 }
      )
      Object.entries(corsHeaders).forEach(([key, value]) => {
        response.headers.set(key, value)
      })
      return response
    }

    console.log(`[${requestId}] 输入验证通过，开始查询用户...`)

    // 确保数据库连接
    try {
      await prisma.$connect()
      console.log(`[${requestId}] 数据库连接成功`)
    } catch (dbError) {
      console.error(`[${requestId}] 数据库连接失败:`, dbError)
      const response = NextResponse.json(
        { 
          error: '服务器内部错误，请稍后重试',
          code: 'DATABASE_CONNECTION_ERROR',
          requestId
        },
        { status: 500 }
      )
      Object.entries(corsHeaders).forEach(([key, value]) => {
        response.headers.set(key, value)
      })
      return response
    }

    const user = await prisma.user.findUnique({
      where: { email: cleanEmail }
    })

    if (!user) {
      console.log(`[${requestId}] 登录失败: 用户不存在 - ${cleanEmail}`)
      const response = NextResponse.json(
        { 
          error: '用户不存在',
          code: 'USER_NOT_FOUND',
          requestId,
          suggestion: '请检查邮箱地址是否正确，或者先注册账户'
        },
        { status: 400 }
      )
      Object.entries(corsHeaders).forEach(([key, value]) => {
        response.headers.set(key, value)
      })
      return response
    }

    console.log(`[${requestId}] 用户找到，开始验证密码...`)

    let isPasswordValid = false
    try {
      isPasswordValid = await bcrypt.compare(password, user.password)
      console.log(`[${requestId}] 密码验证结果: ${isPasswordValid}`)
    } catch (bcryptError) {
      console.error(`[${requestId}] 密码验证出错:`, bcryptError)
      const response = NextResponse.json(
        { 
          error: '密码验证失败',
          code: 'PASSWORD_VERIFICATION_ERROR',
          requestId
        },
        { status: 500 }
      )
      Object.entries(corsHeaders).forEach(([key, value]) => {
        response.headers.set(key, value)
      })
      return response
    }

    if (!isPasswordValid) {
      console.log(`[${requestId}] 登录失败: 密码错误 - ${cleanEmail}`)
      const response = NextResponse.json(
        { 
          error: '密码错误',
          code: 'INVALID_PASSWORD',
          requestId,
          suggestion: '请检查密码是否正确，或者使用忘记密码功能'
        },
        { status: 400 }
      )
      Object.entries(corsHeaders).forEach(([key, value]) => {
        response.headers.set(key, value)
      })
      return response
    }

    console.log(`[${requestId}] 密码验证通过，生成JWT令牌...`)

    // 生成JWT令牌
    let token = ''
    try {
      token = jwt.sign(
        { 
          userId: user.id, 
          username: user.username,
          email: user.email
        },
        process.env.NEXTAUTH_SECRET!,
        { expiresIn: '7d' }
      )
      console.log(`[${requestId}] JWT令牌生成成功`)
    } catch (jwtError) {
      console.error(`[${requestId}] JWT生成失败:`, jwtError)
      const response = NextResponse.json(
        { 
          error: '令牌生成失败',
          code: 'TOKEN_GENERATION_ERROR',
          requestId
        },
        { status: 500 }
      )
      Object.entries(corsHeaders).forEach(([key, value]) => {
        response.headers.set(key, value)
      })
      return response
    }

    const duration = Date.now() - startTime
    console.log(`[${requestId}] 登录成功完成，耗时: ${duration}ms`)

    const responseData = {
      message: '登录成功',
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username
      },
      requestId,
      duration
    }

    const response = NextResponse.json(responseData)
    Object.entries(corsHeaders).forEach(([key, value]) => {
      response.headers.set(key, value)
    })
    
    return response

  } catch (error) {
    const duration = Date.now() - startTime
    console.error(`[${requestId}] 登录过程中发生未预期的错误，耗时: ${duration}ms:`, error)
    
    const response = NextResponse.json(
      { 
        error: '登录失败，请稍后重试',
        code: 'UNEXPECTED_ERROR',
        requestId,
        details: error instanceof Error ? error.message : '未知错误',
        duration
      },
      { status: 500 }
    )
    
    Object.entries(corsHeaders).forEach(([key, value]) => {
      response.headers.set(key, value)
    })
    
    return response
  } finally {
    try {
      await prisma.$disconnect()
      console.log(`[${requestId}] 数据库连接已断开`)
    } catch (disconnectError) {
      console.error(`[${requestId}] 断开数据库连接时出错:`, disconnectError)
    }
  }
}