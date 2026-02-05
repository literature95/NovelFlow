import { NextRequest, NextResponse } from 'next/server'

// CORS配置
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Mobile-Optimized, X-Client-Info',
  'Access-Control-Max-Age': '86400',
}

export async function OPTIONS(_request: NextRequest) {
  const response = new NextResponse(null, { status: 200 })
  Object.entries(corsHeaders).forEach(([key, value]) => {
    response.headers.set(key, value)
  })
  return response
}

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    // 验证用户名和密码
    if (username !== 'admin' || password !== '1234') {
      const response = NextResponse.json(
        { 
          error: '用户名或密码错误',
          code: 'INVALID_CREDENTIALS'
        },
        { status: 401 }
      )
      Object.entries(corsHeaders).forEach(([key, value]) => {
        response.headers.set(key, value)
      })
      return response
    }

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
  } catch (error) {
    console.error('Admin登录错误:', error)
    const response = NextResponse.json(
      { 
        error: '登录失败，请重试',
        code: 'SERVER_ERROR'
      },
      { status: 500 }
    )
    Object.entries(corsHeaders).forEach(([key, value]) => {
      response.headers.set(key, value)
    })
    return response
  }
}
