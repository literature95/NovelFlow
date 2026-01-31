import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import OpenAI from 'openai'

// 测试AI模型
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request)
    if (!user) {
      return NextResponse.json({ error: '未授权' }, { status: 401 })
    }

    const { modelId, prompt } = await request.json()

    if (!modelId || !prompt) {
      return NextResponse.json({ error: '缺少必要参数' }, { status: 400 })
    }

    // 获取模型配置
    const model = await prisma.aIConfig.findFirst({
      where: { id: modelId, userId: user.userId }
    })

    if (!model) {
      return NextResponse.json({ error: '模型不存在' }, { status: 404 })
    }

    // 创建OpenAI客户端
    const openai = new OpenAI({
      apiKey: model.apiKey
    })

    // 构建消息
    const messages: any[] = [
      { role: 'system', content: model.role }
    ]

    messages.push({ role: 'user', content: prompt })

    // 调用AI模型
    const completion = await openai.chat.completions.create({
      model: model.model || 'gpt-3.5-turbo',
      messages,
      temperature: model.temperature,
      max_tokens: model.maxTokens
    })

    const response = completion.choices[0]?.message?.content || '无回复'

    return NextResponse.json({ response })
  } catch (error: any) {
    console.error('测试AI模型失败:', error)

    let errorMessage = '测试失败'
    if (error.message) {
      if (error.message.includes('401')) {
        errorMessage = 'API密钥无效'
      } else if (error.message.includes('404')) {
        errorMessage = '模型不存在'
      } else if (error.message.includes('429')) {
        errorMessage = 'API请求频率超限'
      } else if (error.message.includes('500')) {
        errorMessage = '服务器内部错误'
      } else {
        errorMessage = error.message
      }
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}