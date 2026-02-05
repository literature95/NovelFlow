import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }
const prisma = globalForPrisma.prisma || new PrismaClient()
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// POST - 导入数据库备份
export async function POST(request: NextRequest) {
  try {
    console.log('开始数据库导入')

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { success: false, error: '未上传文件' },
        { status: 400 }
      )
    }

    // 读取文件内容
    const fileContent = await file.text()
    const backupData = JSON.parse(fileContent)

    // 验证备份文件格式
    if (!backupData.version || !backupData.data) {
      return NextResponse.json(
        { success: false, error: '备份文件格式无效' },
        { status: 400 }
      )
    }

    console.log('导入数据统计:', backupData.statistics)

    // 开始导入数据（注意：由于外键约束，需要按顺序导入）
    const importResults: Record<string, number> = {}

    try {
      // 1. 导入用户数据
      if (backupData.data.users && backupData.data.users.length > 0) {
        for (const user of backupData.data.users) {
          await prisma.user.upsert({
            where: { id: user.id },
            update: {
              email: user.email,
              username: user.username,
              avatar: user.avatar,
              nickname: user.nickname,
              gender: user.gender,
              birthDate: user.birthDate ? new Date(user.birthDate) : null,
              phone: user.phone,
              membershipLevel: user.membershipLevel
            },
            create: {
              id: user.id,
              email: user.email,
              username: user.username,
              password: user.password,
              avatar: user.avatar,
              nickname: user.nickname,
              gender: user.gender,
              birthDate: user.birthDate ? new Date(user.birthDate) : null,
              phone: user.phone,
              membershipLevel: user.membershipLevel,
              createdAt: new Date(user.createdAt),
              updatedAt: new Date(user.updatedAt)
            }
          })
        }
        importResults.users = backupData.data.users.length
      }

      // 2. 导入小说数据
      if (backupData.data.novels && backupData.data.novels.length > 0) {
        for (const novel of backupData.data.novels) {
          await prisma.novel.upsert({
            where: { id: novel.id },
            update: {
              title: novel.title,
              description: novel.description,
              outline: novel.outline,
              worldSetting: novel.worldSetting,
              protagonist: novel.protagonist,
              userId: novel.userId
            },
            create: {
              id: novel.id,
              title: novel.title,
              description: novel.description,
              outline: novel.outline,
              worldSetting: novel.worldSetting,
              protagonist: novel.protagonist,
              userId: novel.userId,
              createdAt: new Date(novel.createdAt),
              updatedAt: new Date(novel.updatedAt)
            }
          })
        }
        importResults.novels = backupData.data.novels.length
      }

      // 3. 导入章节数据
      if (backupData.data.chapters && backupData.data.chapters.length > 0) {
        for (const chapter of backupData.data.chapters) {
          await prisma.chapter.upsert({
            where: { id: chapter.id },
            update: {
              title: chapter.title,
              summary: chapter.summary,
              content: chapter.content,
              status: chapter.status,
              isAIGenerated: chapter.isAIGenerated,
              order: chapter.order,
              wordCount: chapter.wordCount
            },
            create: {
              id: chapter.id,
              title: chapter.title,
              summary: chapter.summary,
              content: chapter.content,
              status: chapter.status,
              isAIGenerated: chapter.isAIGenerated,
              order: chapter.order,
              wordCount: chapter.wordCount,
              novelId: chapter.novelId,
              createdAt: new Date(chapter.createdAt),
              updatedAt: new Date(chapter.updatedAt)
            }
          })
        }
        importResults.chapters = backupData.data.chapters.length
      }

      console.log('数据库导入成功:', importResults)

      return NextResponse.json({
        success: true,
        message: '数据库导入成功',
        data: importResults
      })
    } catch (dbError) {
      console.error('数据库导入失败:', dbError)
      return NextResponse.json(
        { success: false, error: '数据库导入失败，请检查数据格式和约束', details: dbError instanceof Error ? dbError.message : '未知错误' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('导入过程失败:', error)
    return NextResponse.json(
      { success: false, error: '导入失败', details: error instanceof Error ? error.message : '未知错误' },
      { status: 500 }
    )
  }
}
