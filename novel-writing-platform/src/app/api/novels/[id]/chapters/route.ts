import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const user = await getCurrentUser(request)
    if (!user) {
      return NextResponse.json(
        { error: '未授权' },
        { status: 401 }
      )
    }

    // 验证小说是否属于当前用户
    const novel = await prisma.novel.findFirst({
      where: {
        id: params.id,
        userId: user.userId
      }
    })

    if (!novel) {
      return NextResponse.json(
        { error: '小说不存在' },
        { status: 404 }
      )
    }

    const chapters = await prisma.chapter.findMany({
      where: { novelId: params.id },
      orderBy: { order: 'asc' }
    })

    return NextResponse.json({ chapters })
  } catch (error) {
    console.error('获取章节列表错误:', error)
    return NextResponse.json(
      { error: '获取章节列表失败' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const user = await getCurrentUser(request)
    if (!user) {
      return NextResponse.json(
        { error: '未授权' },
        { status: 401 }
      )
    }

    // 验证小说是否属于当前用户
    const novel = await prisma.novel.findFirst({
      where: {
        id: params.id,
        userId: user.userId
      }
    })

    if (!novel) {
      return NextResponse.json(
        { error: '小说不存在' },
        { status: 404 }
      )
    }

    const { title, summary, content, order } = await request.json()

    if (!title) {
      return NextResponse.json(
        { error: '章节标题是必需的' },
        { status: 400 }
      )
    }

    // 如果没有指定顺序，自动设置为最后一章
    let chapterOrder = order
    if (!chapterOrder) {
      const lastChapter = await prisma.chapter.findFirst({
        where: { novelId: params.id },
        orderBy: { order: 'desc' }
      })
      chapterOrder = lastChapter ? lastChapter.order + 1 : 1
    }

    const chapter = await prisma.chapter.create({
      data: {
        title,
        summary,
        content,
        order: chapterOrder,
        novelId: params.id
      }
    })

    return NextResponse.json({
      message: '章节创建成功',
      chapter
    })
  } catch (error) {
    console.error('创建章节错误:', error)
    return NextResponse.json(
      { error: '创建章节失败' },
      { status: 500 }
    )
  }
}