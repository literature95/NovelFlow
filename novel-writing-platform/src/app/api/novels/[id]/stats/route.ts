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
    const { id: novelId } = resolvedParams

    // 验证用户身份
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: '未授权' }, { status: 401 })
    }

    const userId = verifyToken(token)
    if (!userId) {
      return NextResponse.json({ error: '无效的令牌' }, { status: 401 })
    }

    // 获取小说及其章节信息
    const novel = await prisma.novel.findFirst({
      where: {
        id: novelId,
        userId: userId
      },
      include: {
        chapters: {
          orderBy: {
            order: 'asc'
          }
        }
      }
    })

    if (!novel) {
      return NextResponse.json({ error: '小说不存在' }, { status: 404 })
    }

    // 计算统计数据
    const chapters = novel.chapters
    const totalWords = chapters.reduce((sum: number, chapter: { content: string | null; status: string }) => {
      const wordCount = chapter.content ? chapter.content.length : 0
      return sum + wordCount
    }, 0)

    const publishedChapters = chapters.filter((ch: { status: string }) => ch.status === 'published').length
    const draftChapters = chapters.filter((ch: { status: string }) => ch.status === 'draft').length
    const archivedChapters = chapters.filter((ch: { status: string }) => ch.status === 'archived').length

    const averageWordsPerChapter = chapters.length > 0 ? Math.round(totalWords / chapters.length) : 0
    const totalReadingTime = Math.ceil(totalWords / 200) // 假设每分钟阅读200字

    // 今日字数（模拟数据，实际应该基于时间戳计算）
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const wordsToday = Math.floor(Math.random() * 2000) // 模拟今日写作字数

    // 最近活动（模拟数据）
    const recentActivity = [
      { date: '2024-01-15', wordsWritten: 2500, chaptersCreated: 2 },
      { date: '2024-01-14', wordsWritten: 1800, chaptersCreated: 1 },
      { date: '2024-01-13', wordsWritten: 3200, chaptersCreated: 3 },
      { date: '2024-01-12', wordsWritten: 900, chaptersCreated: 0 },
    ]

    const stats = {
      totalWords,
      totalChapters: chapters.length,
      publishedChapters,
      draftChapters,
      archivedChapters,
      averageWordsPerChapter,
      totalReadingTime,
      wordsToday,
      lastUpdated: novel.updatedAt.toISOString(),
      recentActivity
    }

    return NextResponse.json({
      success: true,
      stats
    })

  } catch (error) {
    console.error('获取小说统计失败:', error)
    return NextResponse.json({ error: '服务器错误' }, { status: 500 })
  }
}