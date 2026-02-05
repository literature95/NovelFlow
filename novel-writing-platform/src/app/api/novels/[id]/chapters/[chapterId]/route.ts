import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string, chapterId: string }> }
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

    const chapter = await prisma.chapter.findFirst({
      where: {
        id: params.chapterId,
        novelId: params.id
      }
    })

    if (!chapter) {
      return NextResponse.json(
        { error: '章节不存在' },
        { status: 404 }
      )
    }

    return NextResponse.json({ chapter })
  } catch (error) {
    console.error('获取章节详情错误:', error)
    return NextResponse.json(
      { error: '获取章节详情失败' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string, chapterId: string }> }
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

    // 输入验证
    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return NextResponse.json(
        { error: '章节标题不能为空' },
        { status: 400 }
      )
    }

    if (!summary || typeof summary !== 'string' || summary.trim().length === 0) {
      return NextResponse.json(
        { error: '章节简介不能为空' },
        { status: 400 }
      )
    }

    if (summary.length > 500) {
      return NextResponse.json(
        { error: '章节简介不能超过500个字符' },
        { status: 400 }
      )
    }

    // 更新章节
    const updateData: Partial<Prisma.ChapterUpdateInput> = {
      title: title.trim(),
      summary: summary.trim(),
      updatedAt: new Date()
    }

    if (content !== undefined) {
      updateData.content = content
    }

    if (order !== undefined && order !== null) {
      updateData.order = order
    }

    const chapter = await prisma.chapter.updateMany({
      where: {
        id: params.chapterId,
        novelId: params.id
      },
      data: updateData
    })

    if (chapter.count === 0) {
      return NextResponse.json(
        { error: '章节不存在' },
        { status: 404 }
      )
    }

    const updatedChapter = await prisma.chapter.findUnique({
      where: { id: params.chapterId }
    })

    return NextResponse.json({
      message: '章节更新成功',
      chapter: updatedChapter
    })
  } catch (error) {
    console.error('更新章节错误:', error)
    return NextResponse.json(
      { error: '更新章节失败' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string, chapterId: string }> }
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

    const chapter = await prisma.chapter.deleteMany({
      where: {
        id: params.chapterId,
        novelId: params.id
      }
    })

    if (chapter.count === 0) {
      return NextResponse.json(
        { error: '章节不存在' },
        { status: 404 }
      )
    }

    return NextResponse.json({ message: '章节删除成功' })
  } catch (error) {
    console.error('删除章节错误:', error)
    return NextResponse.json(
      { error: '删除章节失败' },
      { status: 500 }
    )
  }
}