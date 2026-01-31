import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }
const prisma = globalForPrisma.prisma || new PrismaClient()
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// POST - 导出数据库备份
export async function POST(request: NextRequest) {
  try {
    console.log('开始数据库备份')

    const timestamp = new Date().toISOString()

    // 获取所有数据进行完整备份
    const users = await prisma.user.findMany()
    const novels = await prisma.novel.findMany()
    const chapters = await prisma.chapter.findMany()

    console.log('备份数据统计:', {
      users: users.length,
      novels: novels.length,
      chapters: chapters.length
    })

    // 创建备份数据
    const backupData = {
      version: '1.0',
      timestamp,
      statistics: {
        users: users.length,
        novels: novels.length,
        chapters: chapters.length
      },
      data: {
        users,
        novels,
        chapters
      }
    }

    // 备份文件内容
    const backupContent = JSON.stringify(backupData, null, 2)

    // 返回备份文件作为下载
    const filename = `backup-${timestamp.split('T')[0]}.json`

    return new NextResponse(backupContent, {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })
  } catch (error) {
    console.error('数据库备份失败:', error)
    return NextResponse.json(
      { error: '备份失败', details: error instanceof Error ? error.message : '未知错误' },
      { status: 500 }
    )
  }
}