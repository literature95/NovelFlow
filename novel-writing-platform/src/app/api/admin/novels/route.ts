import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }
const prisma = globalForPrisma.prisma || new PrismaClient()
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// GET - 获取小说列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const userId = searchParams.get('userId') || ''

    const skip = (page - 1) * limit

    // 构建查询条件
    const where: any = {}

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } }
      ]
    }

    if (userId) {
      where.userId = userId
    }

    // 获取小说列表和总数
    const [novels, total] = await Promise.all([
      prisma.novel.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              username: true,
              nickname: true,
              email: true
            }
          },
          _count: {
            select: {
              chapters: true,
              characters: true,
              worldSettings: true
            }
          }
        },
        orderBy: {
          updatedAt: 'desc'
        }
      }),
      prisma.novel.count({ where })
    ])

    return NextResponse.json({
      success: true,
      data: novels,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('[Admin Novels GET] Error:', error)
    return NextResponse.json(
      { success: false, error: '获取小说列表失败' },
      { status: 500 }
    )
  }
}

// POST - 创建小说
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, outline, worldSetting, protagonist, userId } = body

    // 验证必填字段
    if (!title || !userId) {
      return NextResponse.json(
        { success: false, error: '标题和用户ID为必填项' },
        { status: 400 }
      )
    }

    // 检查用户是否存在
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return NextResponse.json(
        { success: false, error: '用户不存在' },
        { status: 404 }
      )
    }

    // 创建小说
    const novel = await prisma.novel.create({
      data: {
        title,
        description,
        outline,
        worldSetting,
        protagonist,
        userId
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            nickname: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: novel,
      message: '小说创建成功'
    })
  } catch (error) {
    console.error('[Admin Novels POST] Error:', error)
    return NextResponse.json(
      { success: false, error: '创建小说失败' },
      { status: 500 }
    )
  }
}
