import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function POST(request: NextRequest) {
  try {
    const { username, email } = await request.json()

    // 创建一个简单的demo用户
    const user = {
      id: 'demo-user-id',
      username: username || 'demo',
      email: email || 'demo@example.com',
      role: 'user'
    }

    // 生成JWT token
    const token = jwt.sign(
      { 
        userId: user.id,
        username: user.username,
        email: user.email
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    return NextResponse.json({
      success: true,
      message: 'Demo登录成功',
      token,
      user
    })

  } catch (error) {
    console.error('Demo登录错误:', error)
    return NextResponse.json(
      { success: false, message: '登录失败' },
      { status: 500 }
    )
  }
}