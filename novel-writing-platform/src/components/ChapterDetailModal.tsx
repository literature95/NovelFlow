'use client'

import { useState, useEffect } from 'react'
import { X, FileText, Sparkles, Clock, Target, BookOpen } from 'lucide-react'

interface Chapter {
  id: string
  title: string
  summary?: string
  content?: string
  isAIGenerated: boolean
  order: number
  createdAt: string
  updatedAt: string
}

interface ChapterDetailModalProps {
  chapter: Chapter | null
  isOpen: boolean
  onClose: () => void
  onEdit?: (chapter: Chapter) => void
  darkMode?: boolean
}

export default function ChapterDetailModal({ chapter, isOpen, onClose, onEdit, darkMode = false }: ChapterDetailModalProps) {
  const [activeTab, setActiveTab] = useState<'info' | 'content'>('info')

  if (!isOpen || !chapter) return null

  const calculateReadingTime = (content: string) => {
    if (!content) return '0'
    const wordCount = content.replace(/\s/g, '').length
    const readingTime = Math.ceil(wordCount / 300) // 假设每分钟读300字
    return `${readingTime} 分钟`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* 头部 */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">
                  第 {chapter.order} 章
                </span>
                {chapter.isAIGenerated && (
                  <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                    <Sparkles className="h-3 w-3" />
                    AI生成
                  </span>
                )}
              </div>
              <h2 className="text-2xl font-bold">{chapter.title}</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* 标签页 */}
        <div className="border-b border-gray-200">
          <div className="flex">
            <button
              onClick={() => setActiveTab('info')}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === 'info'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <BookOpen className="h-4 w-4" />
                章节信息
              </div>
            </button>
            <button
              onClick={() => setActiveTab('content')}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === 'content'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <FileText className="h-4 w-4" />
                章节内容
              </div>
            </button>
          </div>
        </div>

        {/* 内容区域 */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'info' && (
            <div className="p-6 space-y-6">
              {/* 章节简介 */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">章节简介</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  {chapter.summary ? (
                    <p className="text-gray-700 leading-relaxed">{chapter.summary}</p>
                  ) : (
                    <p className="text-gray-400 italic">暂无简介</p>
                  )}
                </div>
              </div>

              {/* 统计信息 */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">统计信息</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <FileText className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-gray-900">
                          {chapter.content ? chapter.content.replace(/\s/g, '').length : 0}
                        </div>
                        <div className="text-sm text-gray-600">字数</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Clock className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-gray-900">
                          {calculateReadingTime(chapter.content || '')}
                        </div>
                        <div className="text-sm text-gray-600">预计阅读</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-purple-50 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Target className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-gray-900">
                          {chapter.content ? Math.round((chapter.content.replace(/\s/g, '').length / 1000)) : 0}k
                        </div>
                        <div className="text-sm text-gray-600">千字</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 时间信息 */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">时间信息</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">创建时间</span>
                    <span className="text-gray-900">{formatDate(chapter.createdAt)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">最后更新</span>
                    <span className="text-gray-900">{formatDate(chapter.updatedAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'content' && (
            <div className="p-6">
              {chapter.content ? (
                <div className="prose max-w-none">
                  <div className="bg-white border border-gray-200 rounded-lg p-6 leading-relaxed text-gray-800 whitespace-pre-wrap">
                    {chapter.content}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">暂无内容</h3>
                  <p className="text-gray-600 mb-6">点击下方按钮开始创作章节内容</p>
                  <button
                    onClick={() => onEdit?.(chapter)}
                    className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    AI生成内容
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 底部操作 */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="flex justify-between">
            <button
              onClick={onClose}
              className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              关闭
            </button>
            <button
              onClick={() => onEdit?.(chapter)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              编辑章节
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}