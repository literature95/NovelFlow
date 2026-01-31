import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { generateChapterContent } from '@/lib/ai'

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request)
    if (!user) {
      return NextResponse.json(
        { error: '未授权' },
        { status: 401 }
      )
    }

    const { novelId, chapterSummary } = await request.json()

    if (!novelId || !chapterSummary) {
      return NextResponse.json(
        { error: '小说ID和章节简介是必需的' },
        { status: 400 }
      )
    }

    // 获取小说信息
    const novel = await prisma.novel.findFirst({
      where: {
        id: novelId,
        userId: user.userId
      }
    })

    if (!novel) {
      return NextResponse.json(
        { error: '小说不存在' },
        { status: 404 }
      )
    }

    // 使用AI生成章节内容
    const content = await generateChapterContent(
      novel.title,
      novel.outline || '',
      novel.worldSetting || '',
      novel.protagonist || '',
      chapterSummary
    )

    return NextResponse.json({
      message: '章节内容生成成功',
      content
    })
  } catch (error) {
    console.error('AI生成章节错误:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'AI生成章节失败' },
      { status: 500 }
    )
  }
}