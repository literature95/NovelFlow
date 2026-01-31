import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// 设置默认AI模型
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser(request)
    if (!user) {
      return NextResponse.json({ error: '未授权' }, { status: 401 })
    }

    const { id } = await context.params

    const existingModel = await prisma.aIConfig.findFirst({
      where: { id, userId: user.userId }
    })

    if (!existingModel) {
      return NextResponse.json({ error: '模型不存在' }, { status: 404 })
    }

    // 将所有模型设为非默认
    await prisma.aIConfig.updateMany({
      where: { userId: user.userId },
      data: { isDefault: false }
    })

    // 设置指定模型为默认
    const defaultModel = await prisma.aIConfig.update({
      where: { id },
      data: { isDefault: true, updatedAt: new Date() }
    })

    return NextResponse.json({ model: defaultModel })
  } catch (error) {
    console.error('设置默认AI模型失败:', error)
    return NextResponse.json({ error: '设置默认AI模型失败' }, { status: 500 })
  }
}