import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request)
    if (!user) {
      return NextResponse.json(
        { error: '未授权' },
        { status: 401 }
      )
    }

    const configs = await prisma.aIConfig.findMany({
      where: { userId: user.userId },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ configs })
  } catch (error) {
    console.error('获取AI配置错误:', error)
    return NextResponse.json(
      { error: '获取AI配置失败' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request)
    if (!user) {
      return NextResponse.json(
        { error: '未授权' },
        { status: 401 }
      )
    }

    const { name, apiKey, model, role, temperature, maxTokens } = await request.json()

    if (!name || !apiKey) {
      return NextResponse.json(
        { error: '配置名称和API密钥是必需的' },
        { status: 400 }
      )
    }

    // 如果设置为激活，先取消其他配置的激活状态
    const configData: any = {
      name,
      apiKey,
      model,
      role,
      temperature: temperature || 0.7,
      maxTokens: maxTokens || 2000,
      userId: user.userId
    }

    const config = await prisma.aIConfig.create({
      data: configData
    })

    return NextResponse.json({
      message: 'AI配置创建成功',
      config
    })
  } catch (error) {
    console.error('创建AI配置错误:', error)
    return NextResponse.json(
      { error: '创建AI配置失败' },
      { status: 500 }
    )
  }
}