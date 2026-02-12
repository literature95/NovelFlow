import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getCurrentUser } from '@/lib/auth'

const prisma = new PrismaClient()

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const user = await getCurrentUser(request)
    if (!user) {
      return NextResponse.json({ error: '未授权' }, { status: 401 })
    }

    const novel = await prisma.novel.findUnique({
      where: { id: resolvedParams.id },
      include: {
        characters: {
          orderBy: { createdAt: 'asc' }
        }
      }
    })

    if (!novel) {
      return NextResponse.json({ error: '小说不存在' }, { status: 404 })
    }

    if (novel.userId !== user.userId) {
      return NextResponse.json({ error: '无权访问此小说' }, { status: 403 })
    }

    return NextResponse.json({ characters: novel.characters })
  } catch (error) {
    console.error('获取角色列表失败:', error)
    return NextResponse.json({ error: '服务器错误' }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const user = await getCurrentUser(request)
    if (!user) {
      return NextResponse.json({ error: '未授权' }, { status: 401 })
    }

    const novel = await prisma.novel.findUnique({
      where: { id: resolvedParams.id }
    })

    if (!novel) {
      return NextResponse.json({ error: '小说不存在' }, { status: 404 })
    }

    if (novel.userId !== user.userId) {
      return NextResponse.json({ error: '无权访问此小说' }, { status: 403 })
    }

    const { name, description, avatarUrl, traits, relationships } = await request.json()

    if (!name) {
      return NextResponse.json({ error: '角色名称不能为空' }, { status: 400 })
    }

    const character = await prisma.character.create({
      data: {
        novelId: resolvedParams.id,
        name,
        description,
        avatarUrl,
        traits: traits ? JSON.stringify(traits) : null,
        relationships: relationships ? JSON.stringify(relationships) : null
      }
    })

    return NextResponse.json({ character })
  } catch (error) {
    console.error('创建角色失败:', error)
    return NextResponse.json({ error: '服务器错误' }, { status: 500 })
  }
}