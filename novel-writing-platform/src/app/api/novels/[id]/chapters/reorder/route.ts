import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { chapters } = await request.json()

    // 验证用户权限
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: '未授权' }, { status: 401 })
    }

    // 验证小说所有权
    const novel = await prisma.novel.findUnique({
      where: { id }
    })

    if (!novel) {
      return NextResponse.json({ error: '小说不存在' }, { status: 404 })
    }

    // 批量更新章节顺序
    const updatePromises = chapters.map((chapter: { id: string; order: number }) =>
      prisma.chapter.update({
        where: { id: chapter.id },
        data: { order: chapter.order }
      })
    )

    await prisma.$transaction(updatePromises)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('章节排序失败:', error)
    return NextResponse.json(
      { error: '章节排序失败' },
      { status: 500 }
    )
  }
}