import jwt from 'jsonwebtoken'
import { NextRequest } from 'next/server'
import { prisma } from './prisma'

type User = {
  userId: string
  username: string
  email: string
  role: string
}

export function getTokenFromRequest(request: NextRequest): string | null {
  const authHeader = request.headers.get('Authorization')
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7)
  }

  const cookies = request.cookies.get('token')
  if (cookies) {
    return cookies.value
  }

  return null
}

export function verifyToken(token: string): User | null {
  try {
    return jwt.verify(token, process.env.NEXTAUTH_SECRET!) as User
  } catch (_error) {
    return null
  }
}

let cachedDemoUser: User | null = null

export async function getCurrentUser(request: NextRequest): Promise<User | null> {
  const token = getTokenFromRequest(request)
  
  // 有token的情况下进行验证
  if (token) {
    const decoded = verifyToken(token)
    if (decoded) {
      return decoded
    }
  }

  // 开发环境下，如果没有有效的token，返回默认用户用于测试
  if (process.env.NODE_ENV === 'development') {
    // 如果已有缓存的虚拟用户，直接返回
    if (cachedDemoUser) {
      return cachedDemoUser
    }

    // 尝试获取数据库中的第一个用户作为默认用户
    try {
      const user = await prisma.user.findFirst({
        select: {
          id: true,
          email: true,
          username: true
        }
      })

      if (user) {
        cachedDemoUser = {
          userId: user.id,
          username: user.username,
          email: user.email,
          role: 'user'
        }
        return cachedDemoUser
      }
    } catch (_error) {
      console.error('获取默认用户失败:', _error)
    }

    // 如果数据库中没有用户，返回默认虚拟用户
    cachedDemoUser = {
      userId: 'demo-user-id',
      username: 'demo',
      email: 'demo@example.com',
      role: 'user'
    }
    return cachedDemoUser
  }

  return null
}