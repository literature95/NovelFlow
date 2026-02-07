'use client'

import { useState } from 'react'
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Sparkles,
  Download,
  FileText
} from 'lucide-react'

interface Chapter {
  id: string
  title: string
  summary?: string
  content?: string
  order: number
  status: string
  isAIGenerated?: boolean
}

interface ChapterListEnhancedProps {
  novelId: string
  chapters: Chapter[]
  onChapterSelect: (chapter: Chapter) => void
  onChapterEdit: (chapter: Chapter) => void
  onAIGenerate: (chapter: Chapter) => void
  onChapterDelete: (chapter: Chapter) => void
  onChapterExport: (chapter: Chapter) => void
}

export default function ChapterListEnhanced({
  novelId,
  chapters,
  onChapterSelect,
  onChapterEdit,
  onAIGenerate,
  onChapterDelete,
  onChapterExport
}: ChapterListEnhancedProps) {
  const [expandedChapterId, setExpandedChapterId] = useState<string | null>(null)

  const handleCreateChapter = async () => {
    try {
      const token = localStorage.getItem('token')
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      }
      
      // 开发环境允许没有token
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }
      
      const response = await fetch(`/api/novels/${novelId}/chapters`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
          title: `第${chapters.length + 1}章`,
          summary: '',
          content: '',
          order: chapters.length + 1
        })
      })

      if (response.ok) {
        window.location.reload()
      } else {
        const errorData = await response.json()
        alert(`创建章节失败: ${errorData.error || '未知错误'}`)
      }
    } catch (error) {
      console.error('创建章节异常:', error)
      alert('创建章节失败，请重试')
    }
  }

  // 切换章节展开状态
  const toggleChapterExpand = (chapterId: string) => {
    setExpandedChapterId(expandedChapterId === chapterId ? null : chapterId)
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* 顶部工具栏 - 仅保留核心功能 */}
      <div className="border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">章节管理</h2>
          <button
            onClick={handleCreateChapter}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            新建章节
          </button>
        </div>
      </div>

      {/* 章节列表 */}
      <div className="flex-1 overflow-y-auto">
        {chapters.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <FileText className="h-16 w-16 mb-4 text-gray-300" />
            <p className="text-lg font-medium mb-2">暂无章节</p>
            <p className="text-sm mb-4">点击"新建章节"开始创作</p>
            <button
              onClick={handleCreateChapter}
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              创建第一个章节
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {/* 章节卡片 */}
            {chapters
              .sort((a, b) => a.order - b.order)
              .map((chapter) => (
                <div key={chapter.id} className="p-4 hover:bg-gray-50 transition-colors">
                  {/* 章节标题行 */}
                  <div 
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => toggleChapterExpand(chapter.id)}
                  >
                    <h3 className="text-lg font-medium text-gray-900">
                      {chapter.title}
                    </h3>
                    <div className="flex items-center space-x-2">
                      {/* 章节操作按钮 */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          onChapterSelect(chapter)
                        }}
                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="编辑内容"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          onChapterExport(chapter)
                        }}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="导出章节"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          onChapterDelete(chapter)
                        }}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="删除章节"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* 章节详情 - 展开/收起 */}
                  {expandedChapterId === chapter.id && (
                    <div className="mt-3 space-y-3">
                      {/* 章节简介 */}
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-medium text-gray-700">章节简介</h4>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              onChapterEdit(chapter)
                            }}
                            className="text-xs text-indigo-600 hover:underline"
                          >
                            编辑简介
                          </button>
                        </div>
                        <p className="text-sm text-gray-600">
                          {chapter.summary || '暂无简介，点击"编辑简介"添加'}
                        </p>
                      </div>

                      {/* 章节操作按钮组 */}
                      <div className="flex space-x-2">
                        {/* AI生成按钮 - 只有在有简介时才可用 */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            onAIGenerate(chapter)
                          }}
                          disabled={!chapter.summary}
                          className="flex items-center px-3 py-1.5 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          title={chapter.summary ? 'AI生成章节内容' : '请先添加章节简介'}
                        >
                          <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                          AI生成
                        </button>
                        
                        {/* 编辑内容按钮 */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            onChapterSelect(chapter)
                          }}
                          className="flex items-center px-3 py-1.5 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                          <Edit3 className="h-3.5 w-3.5 mr-1.5" />
                          编辑内容
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  )
}