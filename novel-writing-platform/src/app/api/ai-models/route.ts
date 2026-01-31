import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// 获取所有AI模型
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request)
    if (!user) {
      return NextResponse.json({ error: '未授权' }, { status: 401 })
    }

    const models = await prisma.aIConfig.findMany({
      where: { userId: user.userId },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ models })
  } catch (error) {
    console.error('获取AI模型失败:', error)
    return NextResponse.json({ error: '获取AI模型失败' }, { status: 500 })
  }
}

// 创建新的AI模型
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request)
    if (!user) {
      return NextResponse.json({ error: '未授权' }, { status: 401 })
    }

    const data = await request.json()
    const { name, apiKey, baseUrl, model, role, systemPrompt, temperature, maxTokens, contextWindow, topP, topN, frequencyPenalty, presencePenalty } = data

    if (!name || !apiKey || !model || !role) {
      return NextResponse.json({ error: '缺少必要参数' }, { status: 400 })
    }

    // 检查是否已存在激活的模型
    const activeModelCount = await prisma.aIConfig.count({
      where: { userId: user.userId, isActive: true }
    })

    const newModel = await prisma.aIConfig.create({
      data: {
        userId: user.userId,
        name,
        apiKey,
        baseUrl,
        model,
        role,
        systemPrompt,
        temperature: temperature || 0.7,
        maxTokens: maxTokens || 2000,
        contextWindow: contextWindow || 4096,
        topP: topP || 1,
        topN: topN || 0,
        frequencyPenalty: frequencyPenalty || 0,
        presencePenalty: presencePenalty || 0,
        isActive: activeModelCount === 0, // 如果没有激活模型，则设置为激活
        isDefault: activeModelCount === 0 // 如果没有模型，则设为默认
      }
    })

    return NextResponse.json({ model: newModel }, { status: 201 })
  } catch (error: any) {
    console.error('创建AI模型失败:', error)
    return NextResponse.json({ error: `创建AI模型失败: ${error.message}` }, { status: 500 })
  }
}