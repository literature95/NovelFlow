import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const globalForPrisma = global as unknown as { prisma: PrismaClient }
const prisma = globalForPrisma.prisma || new PrismaClient()
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// GET - 获取用户列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''

    const skip = (page - 1) * limit

    // 构建查询条件
    const where = search
      ? {
          OR: [
            { username: { contains: search } },
            { email: { contains: search } },
            { nickname: { contains: search } }
          ]
        }
      : {}

    // 获取用户列表和总数
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          email: true,
          username: true,
          avatar: true,
          nickname: true,
          gender: true,
          birthDate: true,
          phone: true,
          membershipLevel: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              novels: true,
              aiConfigs: true,
              materials: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      }),
      prisma.user.count({ where })
    ])

    return NextResponse.json({
      success: true,
      data: users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('[Admin Users GET] Error:', error)
    return NextResponse.json(
      { success: false, error: '获取用户列表失败' },
      { status: 500 }
    )
  }
}

// POST - 创建用户
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, username, password, nickname, gender, birthDate, phone, membershipLevel } = body

    // 验证必填字段
    if (!email || !username || !password) {
      return NextResponse.json(
        { success: false, error: '邮箱、用户名和密码为必填项' },
        { status: 400 }
      )
    }

    // 检查邮箱和用户名是否已存在
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { username }
        ]
      }
    })

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: '邮箱或用户名已存在' },
        { status: 409 }
      )
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10)

    // 创建用户
    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        nickname: nickname || username,
        gender,
        birthDate: birthDate ? new Date(birthDate) : null,
        phone,
        membershipLevel: membershipLevel || 'free'
      },
      select: {
        id: true,
        email: true,
        username: true,
        avatar: true,
        nickname: true,
        gender: true,
        birthDate: true,
        phone: true,
        membershipLevel: true,
        createdAt: true,
        updatedAt: true
      }
    })

    return NextResponse.json({
      success: true,
      data: user,
      message: '用户创建成功'
    })
  } catch (error) {
    console.error('[Admin Users POST] Error:', error)
    return NextResponse.json(
      { success: false, error: '创建用户失败' },
      { status: 500 }
    )
  }
}
