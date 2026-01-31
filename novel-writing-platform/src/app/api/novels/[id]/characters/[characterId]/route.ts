import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { verifyToken } from '@/lib/auth'

const prisma = new PrismaClient()

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; characterId: string }> }
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

    const character = await prisma.character.findFirst({
      where: {
        id: resolvedParams.characterId,
        novelId: resolvedParams.id
      }
    })

    if (!character) {
      return NextResponse.json({ error: '角色不存在' }, { status: 404 })
    }

    return NextResponse.json({ 
      character: {
        ...character,
        traits: character.traits ? JSON.parse(character.traits) : null,
        relationships: character.relationships ? JSON.parse(character.relationships) : null
      }
    })
  } catch (error) {
    console.error('获取角色详情失败:', error)
    return NextResponse.json({ error: '服务器错误' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; characterId: string }> }
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

    const existingCharacter = await prisma.character.findFirst({
      where: {
        id: resolvedParams.characterId,
        novelId: resolvedParams.id
      }
    })

    if (!existingCharacter) {
      return NextResponse.json({ error: '角色不存在' }, { status: 404 })
    }

    const { name, description, avatarUrl, traits, relationships } = await request.json()

    const updateData: any = {}
    if (name !== undefined) updateData.name = name
    if (description !== undefined) updateData.description = description
    if (avatarUrl !== undefined) updateData.avatarUrl = avatarUrl
    if (traits !== undefined) updateData.traits = traits ? JSON.stringify(traits) : null
    if (relationships !== undefined) updateData.relationships = relationships ? JSON.stringify(relationships) : null

    const character = await prisma.character.update({
      where: { id: resolvedParams.characterId },
      data: updateData
    })

    return NextResponse.json({ 
      character: {
        ...character,
        traits: character.traits ? JSON.parse(character.traits) : null,
        relationships: character.relationships ? JSON.parse(character.relationships) : null
      }
    })
  } catch (error) {
    console.error('更新角色失败:', error)
    return NextResponse.json({ error: '服务器错误' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; characterId: string }> }
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

    const existingCharacter = await prisma.character.findFirst({
      where: {
        id: resolvedParams.characterId,
        novelId: resolvedParams.id
      }
    })

    if (!existingCharacter) {
      return NextResponse.json({ error: '角色不存在' }, { status: 404 })
    }

    await prisma.character.delete({
      where: { id: resolvedParams.characterId }
    })

    return NextResponse.json({ message: '角色删除成功' })
  } catch (error) {
    console.error('删除角色失败:', error)
    return NextResponse.json({ error: '服务器错误' }, { status: 500 })
  }
}