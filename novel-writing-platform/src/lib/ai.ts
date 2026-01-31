import { ChatOpenAI } from "@langchain/openai";
import { SystemMessage, HumanMessage, BaseMessage, AIMessageChunk } from "@langchain/core/messages";

interface ModelConfig {
  model?: string;
  thinking?: "enabled" | "disabled";
  caching?: "enabled" | "disabled";
  temperature?: number;
  frequency_penalty?: number;
  top_p?: number;
  max_tokens?: number;
  max_completion_tokens?: number;
}

export async function* callLLM(
  messages: BaseMessage[],
  config: ModelConfig = {}
): AsyncGenerator<AIMessageChunk> {
  const apiKey = process.env.COZE_WORKLOAD_IDENTITY_API_KEY;
  const baseURL = process.env.COZE_INTEGRATION_MODEL_BASE_URL;
  
  if (!baseURL || !apiKey) {
    throw new Error("Missing environment variables: COZE_INTEGRATION_MODEL_BASE_URL or COZE_WORKLOAD_IDENTITY_API_KEY");
  }

  const streaming = true;

  const llm = new ChatOpenAI({
    modelName: config.model || "doubao-seed-1-6-251015",
    apiKey: apiKey,
    configuration: {
      baseURL: baseURL,
    },
    streaming: streaming,
    temperature: config.temperature || 0.7,
    frequencyPenalty: config.frequency_penalty || 0,
    topP: config.top_p || 1,
    maxTokens: config.max_tokens || 2000,
    modelKwargs: {
      thinking: {
        type: config.thinking || "disabled",
      },
      ...(config.max_completion_tokens && {
        max_completion_tokens: config.max_completion_tokens,
      }),
    },
  });

  const stream = await llm.stream(messages);

  for await (const chunk of stream) {
    yield chunk;
  }
}

export async function generateChapterContent(
  novelTitle: string,
  novelOutline: string,
  novelWorldSetting: string,
  novelProtagonist: string,
  chapterSummary: string
): Promise<string> {
  const systemPrompt = `你是一位经验丰富的小说作家，擅长创作引人入胜、文笔优美的故事内容。请根据提供的小说设定和章节简介，创作一个完整的章节内容。

创作要求：
1. 内容要符合小说的世界观设定和人物性格设定
2. 情节要连贯，文笔流畅，有画面感和感染力
3. 字数控制在800-1500字左右，确保内容充实但不冗长
4. 要完全体现章节简介中描述的核心情节和要点
5. 语言要生动形象，适当运用描写、对话、心理活动等写作技巧
6. 确保章节有完整的故事线：开始-发展-高潮-结尾
7. 保持与小说整体风格和基调的一致性

写作技巧：
- 开头要吸引人，可以用环境描写、动作或对话开始
- 中间要有冲突和转折，推动情节发展
- 人物对话要自然，符合角色性格
- 适当加入感官描写（视觉、听觉、触觉等）
- 结尾要有余韵，为下一章节做铺垫或留下悬念

请确保生成的章节内容质量高，可以直接用于小说出版。`

  const humanPrompt = `【小说信息】
标题：${novelTitle}

故事大纲：${novelOutline || '暂无大纲'}

世界观设定：${novelWorldSetting || '暂无世界观设定'}

主角设定：${novelProtagonist || '暂无主角设定'}

【章节要求】
章节简介：${chapterSummary}

请根据以上所有信息，创作这个章节的完整内容。要求文笔优美，情节生动，人物刻画深刻。`

  const messages: BaseMessage[] = [
    new SystemMessage(systemPrompt),
    new HumanMessage(humanPrompt)
  ];

  const config: ModelConfig = {
    temperature: 0.8,
    max_tokens: 2000,
  };

  let fullContent = "";
  try {
    for await (const chunk of callLLM(messages, config)) {
      fullContent += chunk.content;
    }
  } catch (error) {
    console.error("AI生成章节内容失败:", error);
    throw new Error("AI生成失败，请重试");
  }

  return fullContent;
}