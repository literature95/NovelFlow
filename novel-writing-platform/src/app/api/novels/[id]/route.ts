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

    const novel = await prisma.novel.findFirst({
      where: {
        id: params.id,
        userId: user.userId
      },
      include: {
        chapters: {
          orderBy: { order: 'asc' }
        }
      }
    })

    if (!novel) {
      return NextResponse.json(
        { error: '小说不存在' },
        { status: 404 }
      )
    }

    return NextResponse.json({ novel })
  } catch (error) {
    console.error('获取小说详情错误:', error)
    return NextResponse.json(
      { error: '获取小说详情失败' },
      { status: 500 }
    )
  }
}

export async function PUT(
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

    const { title, description, outline, worldSetting, protagonist } = await request.json()

    const novel = await prisma.novel.updateMany({
      where: {
        id: params.id,
        userId: user.userId
      },
      data: {
        title,
        description,
        outline,
        worldSetting,
        protagonist
      }
    })

    if (novel.count === 0) {
      return NextResponse.json(
        { error: '小说不存在' },
        { status: 404 }
      )
    }

    const updatedNovel = await prisma.novel.findUnique({
      where: { id: params.id }
    })

    return NextResponse.json({
      message: '小说更新成功',
      novel: updatedNovel
    })
  } catch (error) {
    console.error('更新小说错误:', error)
    return NextResponse.json(
      { error: '更新小说失败' },
      { status: 500 }
    )
  }
}

export async function DELETE(
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

    const novel = await prisma.novel.deleteMany({
      where: {
        id: params.id,
        userId: user.userId
      }
    })

    if (novel.count === 0) {
      return NextResponse.json(
        { error: '小说不存在' },
        { status: 404 }
      )
    }

    return NextResponse.json({ message: '小说删除成功' })
  } catch (error) {
    console.error('删除小说错误:', error)
    return NextResponse.json(
      { error: '删除小说失败' },
      { status: 500 }
    )
  }
}