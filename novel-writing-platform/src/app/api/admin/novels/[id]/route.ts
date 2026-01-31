import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }
const prisma = globalForPrisma.prisma || new PrismaClient()
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// GET - 获取单个小说详情
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const novel = await prisma.novel.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            nickname: true,
            email: true
          }
        },
        chapters: {
          orderBy: {
            order: 'asc'
          }
        },
        characters: true,
        worldSettings: true
      }
    })

    if (!novel) {
      return NextResponse.json(
        { success: false, error: '小说不存在' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: novel
    })
  } catch (error) {
    console.error('[Admin Novel GET] Error:', error)
    return NextResponse.json(
      { success: false, error: '获取小说详情失败' },
      { status: 500 }
    )
  }
}

// PUT - 更新小说
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { title, description, outline, worldSetting, protagonist, userId } = body

    // 检查小说是否存在
    const existingNovel = await prisma.novel.findUnique({
      where: { id }
    })

    if (!existingNovel) {
      return NextResponse.json(
        { success: false, error: '小说不存在' },
        { status: 404 }
      )
    }

    // 如果要更改用户，检查新用户是否存在
    if (userId && userId !== existingNovel.userId) {
      const user = await prisma.user.findUnique({
        where: { id: userId }
      })
      if (!user) {
        return NextResponse.json(
          { success: false, error: '用户不存在' },
          { status: 404 }
        )
      }
    }

    // 构建更新数据
    const updateData: any = {}
    if (title !== undefined) updateData.title = title
    if (description !== undefined) updateData.description = description
    if (outline !== undefined) updateData.outline = outline
    if (worldSetting !== undefined) updateData.worldSetting = worldSetting
    if (protagonist !== undefined) updateData.protagonist = protagonist
    if (userId !== undefined) updateData.userId = userId

    // 更新小说
    const novel = await prisma.novel.update({
      where: { id },
      data: updateData,
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
      message: '小说更新成功'
    })
  } catch (error) {
    console.error('[Admin Novel PUT] Error:', error)
    return NextResponse.json(
      { success: false, error: '更新小说失败' },
      { status: 500 }
    )
  }
}

// DELETE - 删除小说
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // 检查小说是否存在
    const existingNovel = await prisma.novel.findUnique({
      where: { id }
    })

    if (!existingNovel) {
      return NextResponse.json(
        { success: false, error: '小说不存在' },
        { status: 404 }
      )
    }

    // 删除小说（会级联删除相关的章节、角色、世界观等数据）
    await prisma.novel.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: '小说删除成功'
    })
  } catch (error) {
    console.error('[Admin Novel DELETE] Error:', error)
    return NextResponse.json(
      { success: false, error: '删除小说失败' },
      { status: 500 }
    )
  }
}
