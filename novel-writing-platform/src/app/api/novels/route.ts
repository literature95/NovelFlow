import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request)
    if (!user) {
      return NextResponse.json(
        { error: '未授权' },
        { status: 401 }
      )
    }

    const novels = await prisma.novel.findMany({
      where: { userId: user.userId },
      include: {
        _count: {
          select: { chapters: true }
        }
      },
      orderBy: { updatedAt: 'desc' }
    })

    return NextResponse.json({ novels })
  } catch (error) {
    console.error('获取小说列表错误:', error)
    return NextResponse.json(
      { error: '获取小说列表失败' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request)
    if (!user) {
      return NextResponse.json(
        { error: '未授权' },
        { status: 401 }
      )
    }

    const { title, description, outline, worldSetting, protagonist } = await request.json()

    if (!title) {
      return NextResponse.json(
        { error: '小说标题是必需的' },
        { status: 400 }
      )
    }

    const novel = await prisma.novel.create({
      data: {
        title,
        description,
        outline,
        worldSetting,
        protagonist,
        userId: user.userId
      }
    })

    return NextResponse.json({
      message: '小说创建成功',
      novel
    })
  } catch (error) {
    console.error('创建小说错误:', error)
    console.error('错误详情:', JSON.stringify(error, null, 2))
    return NextResponse.json(
      { error: '创建小说失败', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}