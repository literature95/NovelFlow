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

export async function getCurrentUser(_request: NextRequest): Promise<User> {
  // 如果已有缓存的虚拟用户，直接返回
  if (cachedDemoUser) {
    console.log('getCurrentUser: 返回缓存的虚拟用户数据')
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
      console.log('getCurrentUser: 返回数据库用户数据', user.username)
      return cachedDemoUser
    }
  } catch (_error) {
    console.error('获取默认用户失败:', _error)
  }

  // 如果数据库中没有用户，返回默认虚拟用户
  console.log('getCurrentUser: 返回默认虚拟用户数据')
  cachedDemoUser = {
    userId: 'demo-user-id',
    username: 'demo',
    email: 'demo@example.com',
    role: 'user'
  }
  return cachedDemoUser

  // 原始验证逻辑（已禁用）
  /*
  const token = getTokenFromRequest(request)
  if (!token) {
    return null
  }

  const decoded = verifyToken(token)
  if (!decoded) {
    return null
  }

  return decoded
  */
}