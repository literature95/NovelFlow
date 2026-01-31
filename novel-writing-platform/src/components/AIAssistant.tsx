'use client'

import { useState, useEffect, useRef } from 'react'
import { 
  Sparkles, 
  Send, 
  MessageSquare, 
  Lightbulb, 
  BookOpen, 
  Users, 
  Globe, 
  Settings,
  Zap,
  RefreshCw,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Plus,
  Hash,
  Target
} from 'lucide-react'

interface Novel {
  id: string
  title: string
  description?: string
  outline?: string
  worldSetting?: string
  protagonist?: string
  chapters?: any[]
}

interface AIAssistantProps {
  novel: Novel
}

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  suggestions?: string[]
}

export default function AIAssistant({ novel }: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [activeTab, setActiveTab] = useState<'chat' | 'tools' | 'suggestions'>('chat')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const quickActions = [
    { 
      icon: Sparkles, 
      label: '生成章节', 
      description: '基于大纲生成新章节',
      action: 'generate_chapter'
    },
    { 
      icon: Users, 
      label: '角色设定', 
      description: '创建角色背景故事',
      action: 'create_character'
    },
    { 
      icon: Lightbulb, 
      label: '情节建议', 
      description: '获取剧情发展建议',
      action: 'plot_suggestions'
    },
    { 
      icon: Globe, 
      label: '世界观', 
      description: '完善世界设定',
      action: 'worldbuilding'
    },
    { 
      icon: RefreshCw, 
      label: '改写优化', 
      description: '优化文本表达',
      action: 'rewrite'
    },
    { 
      icon: Target, 
      label: '目标设定', 
      description: '设定写作目标',
      action: 'set_goals'
    }
  ]

  const writingSuggestions = [
    '考虑添加更多感官描写，让读者身临其境',
    '这个场景可以加入一些内心独白来展现角色性格',
    '对话可以更自然一些，避免过于书面化',
    '可以适当放慢节奏，给读者更多思考空间',
    '这段描写很有画面感，继续保持这种风格'
  ]

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsTyping(true)

    // 模拟AI回复
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `我理解你的想法。基于你的小说《${novel.title}》，我建议你可以从以下几个方面来发展：\n\n1. **深化角色情感**: 通过内心独白展现角色的复杂情感\n2. **加强场景描写**: 运用五感描写让场景更加生动\n3. **优化对话节奏**: 让对话更贴近自然交流\n\n需要我为你提供更具体的建议吗？`,
        timestamp: new Date(),
        suggestions: [
          '帮我生成一个新章节大纲',
          '优化这段对话',
          '给我一些情节发展的建议'
        ]
      }
      
      setMessages(prev => [...prev, aiResponse])
      setIsTyping(false)
    }, 1500)
  }

  const handleQuickAction = (action: string) => {
    let prompt = ''
    
    switch (action) {
      case 'generate_chapter':
        prompt = `请为我的小说《${novel.title}》生成一个新的章节大纲`
        break
      case 'create_character':
        prompt = '帮我创建一个新的角色，包括背景故事和性格特点'
        break
      case 'plot_suggestions':
        prompt = '我需要一些情节发展的建议，当前剧情有些平淡'
        break
      case 'worldbuilding':
        prompt = '帮我完善小说的世界观设定'
        break
      case 'rewrite':
        prompt = '帮我优化一段文字的表达方式'
        break
      case 'set_goals':
        prompt = '帮我设定合理的写作目标和计划'
        break
    }
    
    setInputMessage(prompt)
    setActiveTab('chat')
  }

  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content)
      .then(() => {
        // 可以添加复制成功的提示
      })
      .catch(err => {
        console.error('复制失败:', err)
      })
  }

  return (
    <div className="h-full flex flex-col">
      {/* 标签页 */}
      <div className="flex border-b border-gray-200">
        {[
          { id: 'chat', label: '对话', icon: MessageSquare },
          { id: 'tools', label: '工具', icon: Sparkles },
          { id: 'suggestions', label: '建议', icon: Lightbulb }
        ].map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium transition-colors tab-button ${
                activeTab === tab.id
                  ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* 内容区域 */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'chat' && (
          <div className="h-full flex flex-col">
            {/* 消息列表 */}
            <div className="flex-1 overflow-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="text-center py-8">
                  <Sparkles className="h-12 w-12 text-purple-400 mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">AI写作助手</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    我是你的专属写作助手，可以帮你生成内容、优化文本、提供创作建议
                  </p>
                  <div className="space-y-2">
                    {[
                      '帮我生成一个新的章节',
                      '优化这段对话的表达',
                      '给我一些情节发展的建议'
                    ].map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => setInputMessage(suggestion)}
                        className="block w-full text-left px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${
                      message.role === 'user' ? 'flex-row-reverse' : ''
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      message.role === 'user' 
                        ? 'bg-indigo-600 text-white' 
                        : 'bg-purple-100 text-purple-600'
                    }`}>
                      {message.role === 'user' ? (
                        <span className="text-sm font-medium">你</span>
                      ) : (
                        <Sparkles className="h-4 w-4" />
                      )}
                    </div>
                    
                    <div className={`max-w-[80%] ${
                      message.role === 'user' 
                        ? 'text-right' 
                        : ''
                    }`}>
                      <div className={`inline-block px-4 py-2 rounded-lg ${
                        message.role === 'user'
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}>
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      </div>
                      
                      {/* 操作按钮 */}
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-500">
                          {message.timestamp.toLocaleTimeString()}
                        </span>
                        {message.role === 'assistant' && (
                          <>
                            <button
                              onClick={() => handleCopyMessage(message.content)}
                              className="p-1 hover:bg-gray-100 rounded transition-colors"
                              title="复制"
                            >
                              <Copy className="h-3 w-3 text-gray-400" />
                            </button>
                            <button
                              className="p-1 hover:bg-gray-100 rounded transition-colors"
                              title="点赞"
                            >
                              <ThumbsUp className="h-3 w-3 text-gray-400" />
                            </button>
                            <button
                              className="p-1 hover:bg-gray-100 rounded transition-colors"
                              title="踩"
                            >
                              <ThumbsDown className="h-3 w-3 text-gray-400" />
                            </button>
                          </>
                        )}
                      </div>
                      
                      {/* AI建议 */}
                      {message.suggestions && (
                        <div className="mt-2 space-y-1">
                          {message.suggestions.map((suggestion, index) => (
                            <button
                              key={index}
                              onClick={() => setInputMessage(suggestion)}
                              className="block w-full text-left px-3 py-1 text-xs bg-purple-50 hover:bg-purple-100 text-purple-700 rounded transition-colors"
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
              
              {isTyping && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-purple-100 text-purple-600">
                    <Sparkles className="h-4 w-4 animate-spin" />
                  </div>
                  <div className="bg-gray-100 px-4 py-2 rounded-lg">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* 输入区域 */}
            <div className="border-t border-gray-200 p-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="向AI助手提问..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isTyping}
                  className="px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tools' && (
          <div className="p-4 space-y-3">
            <h3 className="font-medium text-gray-900 mb-3">快速工具</h3>
            {quickActions.map((action, index) => {
              const Icon = action.icon
              return (
                <button
                  key={index}
                  onClick={() => handleQuickAction(action.action)}
                  className="w-full text-left p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-indigo-300 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg group-hover:bg-indigo-100">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{action.label}</h4>
                      <p className="text-xs text-gray-600">{action.description}</p>
                    </div>
                    <Plus className="h-4 w-4 text-gray-400 group-hover:text-indigo-600" />
                  </div>
                </button>
              )
            })}
          </div>
        )}

        {activeTab === 'suggestions' && (
          <div className="p-4">
            <h3 className="font-medium text-gray-900 mb-3">写作建议</h3>
            <div className="space-y-3">
              {writingSuggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="p-3 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-lg"
                >
                  <div className="flex items-start gap-2">
                    <Lightbulb className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-700">{suggestion}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}