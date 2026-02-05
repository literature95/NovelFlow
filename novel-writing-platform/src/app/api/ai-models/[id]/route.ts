import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

// 获取单个AI模型
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser(request)
    if (!user) {
      return NextResponse.json({ error: '未授权' }, { status: 401 })
    }

    const { id } = await context.params

    const model = await prisma.aIConfig.findFirst({
      where: { id, userId: user.userId }
    })

    if (!model) {
      return NextResponse.json({ error: '模型不存在' }, { status: 404 })
    }

    return NextResponse.json({ model })
  } catch (error) {
    console.error('获取AI模型失败:', error)
    return NextResponse.json({ error: '获取AI模型失败' }, { status: 500 })
  }
}

// 更新AI模型
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

    const data = await request.json()
    const { name, apiKey, baseUrl, model, role, systemPrompt, temperature, maxTokens, contextWindow, topP, topN, frequencyPenalty, presencePenalty, isActive, isDefault } = data

    const existingModel = await prisma.aIConfig.findFirst({
      where: { id, userId: user.userId }
    })

    if (!existingModel) {
      return NextResponse.json({ error: '模型不存在' }, { status: 404 })
    }

    const updateData: Partial<Prisma.AIConfigUpdateInput> = {}
    if (name !== undefined) updateData.name = name
    if (apiKey !== undefined) updateData.apiKey = apiKey
    if (baseUrl !== undefined) updateData.baseUrl = baseUrl
    if (model !== undefined) updateData.model = model
    if (role !== undefined) updateData.role = role
    if (systemPrompt !== undefined) updateData.systemPrompt = systemPrompt
    if (temperature !== undefined) updateData.temperature = temperature
    if (maxTokens !== undefined) updateData.maxTokens = maxTokens
    if (contextWindow !== undefined) updateData.contextWindow = contextWindow
    if (topP !== undefined) updateData.topP = topP
    if (topN !== undefined) updateData.topN = topN
    if (frequencyPenalty !== undefined) updateData.frequencyPenalty = frequencyPenalty
    if (presencePenalty !== undefined) updateData.presencePenalty = presencePenalty
    if (isActive !== undefined) updateData.isActive = isActive
    if (isDefault !== undefined) updateData.isDefault = isDefault

    // 如果设置为激活，则将其他模型设为非激活
    if (isActive) {
      await prisma.aIConfig.updateMany({
        where: { userId: user.userId, id: { not: id } },
        data: { isActive: false }
      })
    }

    // 如果设置为默认，则将其他模型设为非默认
    if (isDefault) {
      await prisma.aIConfig.updateMany({
        where: { userId: user.userId, id: { not: id } },
        data: { isDefault: false }
      })
    }

    const updatedModel = await prisma.aIConfig.update({
      where: { id },
      data: { ...updateData, updatedAt: new Date() }
    })

    return NextResponse.json({ model: updatedModel })
  } catch (error) {
    console.error('更新AI模型失败:', error)
    return NextResponse.json({ error: '更新AI模型失败' }, { status: 500 })
  }
}

// 删除AI模型
export async function DELETE(
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

    await prisma.aIConfig.delete({
      where: { id }
    })

    return NextResponse.json({ message: '模型删除成功' })
  } catch (error) {
    console.error('删除AI模型失败:', error)
    return NextResponse.json({ error: '删除AI模型失败' }, { status: 500 })
  }
}