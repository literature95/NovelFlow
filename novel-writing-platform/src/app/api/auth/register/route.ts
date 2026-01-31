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
  'Cache-Control': 'no-cache, no-store, must-revalidate',
  'Pragma': 'no-cache',
  'Expires': '0'
}

export async function OPTIONS(request: NextRequest) {
  const response = new NextResponse(null, { status: 200 })
  Object.entries(corsHeaders).forEach(([key, value]) => {
    response.headers.set(key, value)
  })
  return response
}

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  const requestId = `reg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  
  try {
    // 记录请求信息
    const userAgent = request.headers.get('user-agent') || ''
    const isMobile = /Mobile|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               request.headers.get('cf-connecting-ip') || 
               'unknown'
    const contentType = request.headers.get('content-type')
    const origin = request.headers.get('origin')
    const referer = request.headers.get('referer')
    
    console.log(`[${requestId}] 注册请求开始:`, { 
      timestamp: new Date().toISOString(),
      userAgent: userAgent.substring(0, 150),
      isMobile,
      ip,
      contentType,
      origin,
      referer,
      method: request.method
    })

    // 解析请求体
    let requestData: any
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
          details: parseError instanceof Error ? parseError.message : 'JSON解析失败',
          suggestions: [
            '检查网络连接是否稳定',
            '刷新页面后重试',
            '确认表单数据完整'
          ]
        },
        { status: 400 }
      )
      Object.entries(corsHeaders).forEach(([key, value]) => {
        response.headers.set(key, value)
      })
      return response
    }

    const { email, username, password } = requestData

    // 输入验证
    if (!email || !username || !password) {
      console.log(`[${requestId}] 验证失败: 缺少必要字段`)
      const response = NextResponse.json(
        { 
          error: '所有字段都是必需的',
          code: 'MISSING_FIELDS',
          requestId,
          details: {
            email: !!email,
            username: !!username,
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
    const cleanUsername = username.trim().normalize('NFC')

    if (cleanEmail.length === 0 || cleanUsername.length === 0) {
      console.log(`[${requestId}] 验证失败: 邮箱或用户名为空`)
      const response = NextResponse.json(
        { 
          error: '邮箱和用户名不能为空',
          code: 'EMPTY_FIELDS',
          requestId
        },
        { status: 400 }
      )
      Object.entries(corsHeaders).forEach(([key, value]) => {
        response.headers.set(key, value)
      })
      return response
    }

    if (password.length < 6) {
      console.log(`[${requestId}] 验证失败: 密码太短`)
      const response = NextResponse.json(
        { 
          error: '密码长度至少6位',
          code: 'PASSWORD_TOO_SHORT',
          requestId
        },
        { status: 400 }
      )
      Object.entries(corsHeaders).forEach(([key, value]) => {
        response.headers.set(key, value)
      })
      return response
    }

    if (cleanUsername.length < 2) {
      console.log(`[${requestId}] 验证失败: 用户名太短`)
      const response = NextResponse.json(
        { 
          error: '用户名长度至少2位',
          code: 'USERNAME_TOO_SHORT',
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

    // 用户名格式验证
    const usernameRegex = /^[\w\u4e00-\u9fa5]{2,20}$/
    if (!usernameRegex.test(cleanUsername)) {
      console.log(`[${requestId}] 验证失败: 用户名格式不正确`)
      const response = NextResponse.json(
        { 
          error: '用户名只能包含字母、数字、下划线和中文，长度2-20位',
          code: 'INVALID_USERNAME',
          requestId
        },
        { status: 400 }
      )
      Object.entries(corsHeaders).forEach(([key, value]) => {
        response.headers.set(key, value)
      })
      return response
    }

    console.log(`[${requestId}] 输入验证通过，开始数据库操作...`)

    // 确保数据库连接
    try {
      await prisma.$connect()
      console.log(`[${requestId}] 数据库连接成功`)
    } catch (dbConnectError) {
      console.error(`[${requestId}] 数据库连接失败:`, dbConnectError)
      const response = NextResponse.json(
        { 
          error: '数据库连接失败，请稍后重试',
          code: 'DATABASE_CONNECTION_ERROR',
          requestId,
          details: '服务器暂时无法连接到数据库',
          suggestions: [
            '稍后重试',
            '检查网络连接',
            '如问题持续请联系技术支持'
          ]
        },
        { status: 503 }
      )
      Object.entries(corsHeaders).forEach(([key, value]) => {
        response.headers.set(key, value)
      })
      return response
    }

    try {
      // 检查现有用户
      const checkUserStart = Date.now()
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [
            { email: cleanEmail },
            { username: cleanUsername }
          ]
        }
      })
      
      const checkUserTime = Date.now() - checkUserStart
      console.log(`[${requestId}] 用户检查完成，耗时: ${checkUserTime}ms`)

      if (existingUser) {
        const conflictType = existingUser.email === cleanEmail ? 'email' : 'username'
        console.log(`[${requestId}] 用户已存在: ${conflictType}`)
        const response = NextResponse.json(
          { 
            error: conflictType === 'email' ? '邮箱已存在' : '用户名已存在',
            code: 'USER_EXISTS',
            conflictType,
            requestId
          },
          { status: 409 }
        )
        Object.entries(corsHeaders).forEach(([key, value]) => {
          response.headers.set(key, value)
        })
        return response
      }

      console.log(`[${requestId}] 开始创建用户...`)

      // 加密密码
      const hashStart = Date.now()
      const hashedPassword = await bcrypt.hash(password, 10)
      const hashTime = Date.now() - hashStart
      console.log(`[${requestId}] 密码加密完成，耗时: ${hashTime}ms`)

      // 创建用户
      const createStart = Date.now()
      const user = await prisma.user.create({
        data: {
          email: cleanEmail,
          username: cleanUsername,
          password: hashedPassword
        }
      })
      const createTime = Date.now() - createStart
      console.log(`[${requestId}] 用户创建成功，耗时: ${createTime}ms，ID: ${user.id}`)

      // 验证JWT密钥
      const jwtSecret = process.env.NEXTAUTH_SECRET
      if (!jwtSecret || jwtSecret === 'your-secret-key-here' || jwtSecret.length < 32) {
        console.error(`[${requestId}] JWT密钥配置错误`)
        const response = NextResponse.json(
          { 
            error: '系统配置错误，请联系管理员',
            code: 'JWT_CONFIG_ERROR',
            requestId,
            details: 'JWT密钥未正确配置或长度不足'
          },
          { status: 500 }
        )
        Object.entries(corsHeaders).forEach(([key, value]) => {
          response.headers.set(key, value)
        })
        return response
      }

      // 生成JWT令牌
      const jwtStart = Date.now()
      let token: string
      try {
        token = jwt.sign(
          { userId: user.id, username: user.username },
          jwtSecret,
          { expiresIn: '7d' }
        )
        const jwtTime = Date.now() - jwtStart
        console.log(`[${requestId}] JWT令牌生成成功，耗时: ${jwtTime}ms`)
      } catch (jwtError) {
        console.error(`[${requestId}] JWT令牌生成失败:`, jwtError)
        const response = NextResponse.json(
          { 
            error: '登录令牌生成失败，请稍后重试',
            code: 'JWT_GENERATION_ERROR',
            requestId,
            details: jwtError instanceof Error ? jwtError.message : '未知JWT错误'
          },
          { status: 500 }
        )
        Object.entries(corsHeaders).forEach(([key, value]) => {
          response.headers.set(key, value)
        })
        return response
      }

      const totalTime = Date.now() - startTime
      const responseData = {
        message: '注册成功',
        code: 'SUCCESS',
        requestId,
        processingTime: totalTime,
        token,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          createdAt: user.createdAt
        },
        mobileOptimized: isMobile
      }
      
      console.log(`[${requestId}] 注册成功:`, {
        userId: user.id,
        email: user.email,
        username: user.username,
        tokenGenerated: !!token,
        processingTime: totalTime,
        isMobile
      })

      const response = NextResponse.json(responseData)
      Object.entries(corsHeaders).forEach(([key, value]) => {
        response.headers.set(key, value)
      })
      
      return response

    } finally {
      await prisma.$disconnect()
    }

  } catch (error) {
    const totalTime = Date.now() - startTime
    console.error(`[${requestId}] 注册过程中发生错误:`, {
      error: error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: error.stack
      } : error,
      processingTime: totalTime,
      userAgent: request.headers.get('user-agent')?.substring(0, 150)
    })
    
    // 针对移动端的错误处理
    let errorMessage = '注册失败，请稍后重试'
    let errorCode = 'UNKNOWN_ERROR'
    let statusCode = 500
    let suggestions: string[] = []

    if (error instanceof Error) {
      // 网络相关错误
      if (error.message.includes('timeout') || error.message.includes('ETIMEDOUT')) {
        errorMessage = '网络连接超时，请检查网络后重试'
        errorCode = 'NETWORK_TIMEOUT'
        statusCode = 408
        suggestions = [
          '检查网络连接稳定性',
          '尝试切换到WiFi环境',
          '关闭其他占用网络的应用',
          '稍后重试'
        ]
      }
      // 数据库连接错误
      else if (error.message.includes('database') || error.message.includes('Database') || error.message.includes('Prisma')) {
        errorMessage = '数据库服务暂时不可用，请稍后重试'
        errorCode = 'DATABASE_ERROR'
        statusCode = 503
        suggestions = [
          '服务器负载较高，请稍后重试',
          '可能是网络延迟导致',
          '如问题持续，请联系技术支持'
        ]
      }
      // 唯一约束冲突
      else if (error.message.includes('Unique constraint') || error.message.includes('UNIQUE')) {
        errorMessage = '用户名或邮箱已存在，请更换后重试'
        errorCode = 'DUPLICATE_ENTRY'
        statusCode = 409
        suggestions = [
          '检查输入信息是否正确',
          '尝试使用不同的邮箱或用户名',
          '可能是网络延迟导致的重复提交'
        ]
      }
    }

    const errorResponse = {
      error: errorMessage,
      code: errorCode,
      requestId,
      details: error instanceof Error ? error.message : '未知错误',
      suggestions: suggestions.length > 0 ? suggestions : [
        '刷新页面重试',
        '检查网络连接',
        '稍后再试',
        '如问题持续，请联系技术支持'
      ]
    }

    const response = NextResponse.json(errorResponse, { status: statusCode })
    Object.entries(corsHeaders).forEach(([key, value]) => {
      response.headers.set(key, value)
    })
    
    return response
  }
}