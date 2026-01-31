import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const user = await getCurrentUser(request)
    if (!user) {
      return NextResponse.json(
        { error: '未授权' },
        { status: 401 }
      )
    }

    const config = await prisma.aIConfig.findFirst({
      where: {
        id: params.id,
        userId: user.userId
      }
    })

    if (!config) {
      return NextResponse.json(
        { error: 'AI配置不存在' },
        { status: 404 }
      )
    }

    return NextResponse.json({ config })
  } catch (error) {
    console.error('获取AI配置详情错误:', error)
    return NextResponse.json(
      { error: '获取AI配置详情失败' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const user = await getCurrentUser(request)
    if (!user) {
      return NextResponse.json(
        { error: '未授权' },
        { status: 401 }
      )
    }

    const { name, apiKey, model, role, temperature, maxTokens, isActive } = await request.json()

    // 如果设置为激活，先取消其他配置的激活状态
    if (isActive) {
      await prisma.aIConfig.updateMany({
        where: {
          userId: user.userId,
          isActive: true
        },
        data: {
          isActive: false
        }
      })
    }

    const config = await prisma.aIConfig.updateMany({
      where: {
        id: params.id,
        userId: user.userId
      },
      data: {
        name,
        apiKey,
        model,
        role,
        temperature: temperature || 0.7,
        maxTokens: maxTokens || 2000,
        isActive
      }
    })

    if (config.count === 0) {
      return NextResponse.json(
        { error: 'AI配置不存在' },
        { status: 404 }
      )
    }

    const updatedConfig = await prisma.aIConfig.findUnique({
      where: { id: params.id }
    })

    return NextResponse.json({
      message: 'AI配置更新成功',
      config: updatedConfig
    })
  } catch (error) {
    console.error('更新AI配置错误:', error)
    return NextResponse.json(
      { error: '更新AI配置失败' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const user = await getCurrentUser(request)
    if (!user) {
      return NextResponse.json(
        { error: '未授权' },
        { status: 401 }
      )
    }

    const config = await prisma.aIConfig.deleteMany({
      where: {
        id: params.id,
        userId: user.userId
      }
    })

    if (config.count === 0) {
      return NextResponse.json(
        { error: 'AI配置不存在' },
        { status: 404 }
      )
    }

    return NextResponse.json({ message: 'AI配置删除成功' })
  } catch (error) {
    console.error('删除AI配置错误:', error)
    return NextResponse.json(
      { error: '删除AI配置失败' },
      { status: 500 }
    )
  }
}