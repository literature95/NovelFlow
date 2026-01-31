import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { verifyToken } from '@/lib/auth'

const prisma = new PrismaClient()

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; settingId: string }> }
) {
  try {
    const resolvedParams = await params
    const token = request.headers.get('Authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: '未提供认证令牌' }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: '无效的认证令牌' }, { status: 401 })
    }

    const novel = await prisma.novel.findUnique({
      where: { id: resolvedParams.id }
    })

    if (!novel) {
      return NextResponse.json({ error: '小说不存在' }, { status: 404 })
    }

    if (novel.userId !== decoded.userId) {
      return NextResponse.json({ error: '无权访问此小说' }, { status: 403 })
    }

    const worldSetting = await prisma.worldSetting.findFirst({
      where: {
        id: resolvedParams.settingId,
        novelId: resolvedParams.id
      }
    })

    if (!worldSetting) {
      return NextResponse.json({ error: '世界观设定不存在' }, { status: 404 })
    }

    return NextResponse.json({ worldSetting })
  } catch (error) {
    console.error('获取世界观设定详情失败:', error)
    return NextResponse.json({ error: '服务器错误' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; settingId: string }> }
) {
  try {
    const resolvedParams = await params
    const token = request.headers.get('Authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: '未提供认证令牌' }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: '无效的认证令牌' }, { status: 401 })
    }

    const novel = await prisma.novel.findUnique({
      where: { id: resolvedParams.id }
    })

    if (!novel) {
      return NextResponse.json({ error: '小说不存在' }, { status: 404 })
    }

    if (novel.userId !== decoded.userId) {
      return NextResponse.json({ error: '无权访问此小说' }, { status: 403 })
    }

    const existingSetting = await prisma.worldSetting.findFirst({
      where: {
        id: resolvedParams.settingId,
        novelId: resolvedParams.id
      }
    })

    if (!existingSetting) {
      return NextResponse.json({ error: '世界观设定不存在' }, { status: 404 })
    }

    const { title, content, category } = await request.json()

    const updateData: any = {}
    if (title !== undefined) updateData.title = title
    if (content !== undefined) updateData.content = content
    if (category !== undefined) updateData.category = category

    const worldSetting = await prisma.worldSetting.update({
      where: { id: resolvedParams.settingId },
      data: updateData
    })

    return NextResponse.json({ worldSetting })
  } catch (error) {
    console.error('更新世界观设定失败:', error)
    return NextResponse.json({ error: '服务器错误' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; settingId: string }> }
) {
  try {
    const resolvedParams = await params
    const token = request.headers.get('Authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: '未提供认证令牌' }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: '无效的认证令牌' }, { status: 401 })
    }

    const novel = await prisma.novel.findUnique({
      where: { id: resolvedParams.id }
    })

    if (!novel) {
      return NextResponse.json({ error: '小说不存在' }, { status: 404 })
    }

    if (novel.userId !== decoded.userId) {
      return NextResponse.json({ error: '无权访问此小说' }, { status: 403 })
    }

    const existingSetting = await prisma.worldSetting.findFirst({
      where: {
        id: resolvedParams.settingId,
        novelId: resolvedParams.id
      }
    })

    if (!existingSetting) {
      return NextResponse.json({ error: '世界观设定不存在' }, { status: 404 })
    }

    await prisma.worldSetting.delete({
      where: { id: resolvedParams.settingId }
    })

    return NextResponse.json({ message: '世界观设定删除成功' })
  } catch (error) {
    console.error('删除世界观设定失败:', error)
    return NextResponse.json({ error: '服务器错误' }, { status: 500 })
  }
}