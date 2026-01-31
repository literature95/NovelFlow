import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { verifyToken } from '@/lib/auth'

const prisma = new PrismaClient()

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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
      where: { id: resolvedParams.id },
      include: {
        worldSettings: {
          orderBy: { createdAt: 'asc' }
        }
      }
    })

    if (!novel) {
      return NextResponse.json({ error: '小说不存在' }, { status: 404 })
    }

    if (novel.userId !== decoded.userId) {
      return NextResponse.json({ error: '无权访问此小说' }, { status: 403 })
    }

    // 按分类组织世界观设定
    const categorizedSettings: { [key: string]: typeof novel.worldSettings } = {}
    
    // 预定义分类
    const categories = ['地理', '历史', '文化', '政治', '经济', '科技', '魔法', '种族', '宗教', '其他']
    
    categories.forEach(category => {
      categorizedSettings[category] = []
    })
    
    novel.worldSettings.forEach(setting => {
      const category = categorizedSettings[setting.category] || categorizedSettings['其他']
      category.push(setting)
    })

    return NextResponse.json({ 
      worldSettings: novel.worldSettings,
      categorizedSettings
    })
  } catch (error) {
    console.error('获取世界观设定失败:', error)
    return NextResponse.json({ error: '服务器错误' }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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

    const { title, content, category } = await request.json()

    if (!title || !content || !category) {
      return NextResponse.json({ error: '标题、内容和分类不能为空' }, { status: 400 })
    }

    const worldSetting = await prisma.worldSetting.create({
      data: {
        novelId: resolvedParams.id,
        title,
        content,
        category
      }
    })

    return NextResponse.json({ worldSetting })
  } catch (error) {
    console.error('创建世界观设定失败:', error)
    return NextResponse.json({ error: '服务器错误' }, { status: 500 })
  }
}