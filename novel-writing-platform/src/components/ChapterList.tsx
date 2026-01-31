'use client'

import { useState } from 'react'
import { 
  FileText, 
  Settings, 
  Trash2, 
  Sparkles, 
  Clock, 
  MoreVertical,
  GripVertical,
  Edit3,
  Eye,
  Copy
} from 'lucide-react'
import { useDragAndDrop } from '@/hooks/useDragAndDrop'

interface Chapter {
  id: string
  title: string
  summary?: string
  content?: string
  isAIGenerated?: boolean
  order: number
  createdAt: string
  updatedAt: string
  wordCount?: number
  status?: string
}

interface ChapterListProps {
  chapters: Chapter[]
  onEditSummary: (chapter: Chapter) => void
  onEditContent: (chapter: Chapter) => void
  onAIGenerate: (chapter: Chapter) => void
  onDelete: (chapter: Chapter) => void
  onView: (chapter: Chapter) => void
  onReorder?: (chapters: Chapter[]) => void
  generatingChapter?: string | null
  novelId: string
}

export default function ChapterList({
  chapters,
  onEditSummary,
  onEditContent,
  onAIGenerate,
  onDelete,
  onView,
  onReorder,
  generatingChapter,
  novelId
}: ChapterListProps) {
  const [showActions, setShowActions] = useState<string | null>(null)
  
  const {
    draggedItem,
    dragOverIndex,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleDragEnd
  } = useDragAndDrop(chapters, (reorderedChapters) => {
    if (onReorder) {
      onReorder(reorderedChapters)
    }
  })

  const calculateWordCount = (content?: string) => {
    if (!content) return 0
    return content.replace(/\s/g, '').length
  }

  const getChapterStatus = (chapter: Chapter) => {
    if (!chapter.summary) {
      return { text: '未设置简介', color: 'gray', icon: Settings }
    } else if (!chapter.content) {
      return { text: '待生成内容', color: 'yellow', icon: Sparkles }
    } else if (chapter.isAIGenerated) {
      return { text: 'AI生成', color: 'blue', icon: Sparkles }
    } else {
      return { text: '已编辑', color: 'green', icon: Edit3 }
    }
  }

  const getStatusColor = (color: string) => {
    const colors = {
      gray: 'bg-gray-100 text-gray-800 border-gray-200',
      yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      blue: 'bg-blue-100 text-blue-800 border-blue-200',
      green: 'bg-green-100 text-green-800 border-green-200'
    }
    return colors[color as keyof typeof colors] || colors.gray
  }

  const copyChapterContent = async (chapter: Chapter) => {
    try {
      if (chapter.content) {
        await navigator.clipboard.writeText(chapter.content)
        alert('章节内容已复制到剪贴板')
      } else {
        alert('该章节暂无内容可复制')
      }
    } catch (error) {
      alert('复制失败，请手动复制')
    }
  }

  return (
    <div className="space-y-4">
      {/* 章节统计卡片 */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-2">章节统计</h3>
            <div className="grid grid-cols-3 gap-6">
              <div>
                <div className="text-2xl font-bold">{chapters.length}</div>
                <div className="text-blue-100 text-sm">总章节数</div>
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {chapters.reduce((sum, chapter) => sum + calculateWordCount(chapter.content), 0)}
                </div>
                <div className="text-blue-100 text-sm">总字数</div>
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {chapters.filter(chapter => chapter.content).length}
                </div>
                <div className="text-blue-100 text-sm">已完成</div>
              </div>
            </div>
          </div>
          <div className="text-6xl opacity-20">
            <FileText />
          </div>
        </div>
      </div>

      {/* 章节列表 */}
      <div className="space-y-3">
        {chapters.map((chapter, index) => {
          const status = getChapterStatus(chapter)
          const StatusIcon = status.icon
          const wordCount = calculateWordCount(chapter.content)
          const isDragging = draggedItem?.id === chapter.id
          const isDragOver = dragOverIndex === index
          
          return (
            <div
              key={chapter.id}
              draggable={true}
              onDragStart={(e) => handleDragStart(e, chapter, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, index)}
              onDragEnd={handleDragEnd}
              className={`bg-white rounded-xl border transition-all duration-200 overflow-hidden group ${
                isDragging 
                  ? 'opacity-50 border-blue-400 shadow-lg' 
                  : isDragOver 
                    ? 'border-blue-400 border-t-4 shadow-lg'
                    : 'border-gray-200 hover:border-blue-300 hover:shadow-lg'
              }`}
              onMouseEnter={() => setShowActions(chapter.id)}
              onMouseLeave={() => setShowActions(null)}
            >
              <div className="p-6">
                <div className="flex items-start gap-4">
                  {/* 拖拽手柄 */}
                  <div className="flex items-center justify-center mt-1">
                    <GripVertical className={`h-5 w-5 cursor-move transition-colors ${
                      isDragging ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'
                    }`} />
                  </div>

                  {/* 章节信息 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        第 {chapter.order} 章
                      </span>
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {chapter.title}
                      </h3>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(status.color)}`}>
                        <StatusIcon className="h-3 w-3" />
                        {status.text}
                      </span>
                    </div>

                    {/* 章节简介 */}
                    {chapter.summary ? (
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2 leading-relaxed">
                        {chapter.summary}
                      </p>
                    ) : (
                      <div className="text-gray-400 text-sm mb-3 italic">
                        点击设置按钮添加章节简介，便于AI生成内容
                      </div>
                    )}

                    {/* 章节信息标签 */}
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(chapter.updatedAt).toLocaleDateString()}
                      </span>
                      <span>
                        {wordCount} 字
                      </span>
                      {chapter.isAIGenerated && (
                        <span className="flex items-center gap-1 text-blue-600">
                          <Sparkles className="h-3 w-3" />
                          AI生成
                        </span>
                      )}
                    </div>
                  </div>

                  {/* 操作按钮 */}
                  <div className={`flex items-center gap-2 transition-opacity duration-200 ${
                    showActions === chapter.id ? 'opacity-100' : 'opacity-0'
                  } group-hover:opacity-100`}>
                    <button
                      onClick={() => onView(chapter)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="查看章节"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onEditSummary(chapter)}
                      className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                      title="编辑章节信息"
                    >
                      <Settings className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onEditContent(chapter)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="编辑内容"
                    >
                      <FileText className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onAIGenerate(chapter)}
                      disabled={!chapter.summary?.trim() || generatingChapter === chapter.id}
                      className={`p-2 rounded-lg transition-colors ${
                        chapter.summary?.trim() && generatingChapter !== chapter.id
                          ? 'text-purple-600 hover:bg-purple-50'
                          : 'text-gray-300 cursor-not-allowed'
                      }`}
                      title="AI生成内容"
                    >
                      {generatingChapter === chapter.id ? (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-purple-600 border-t-transparent" />
                      ) : (
                        <Sparkles className="h-4 w-4" />
                      )}
                    </button>
                    <button
                      onClick={() => copyChapterContent(chapter)}
                      className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                      title="复制内容"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDelete(chapter)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="删除章节"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* 进度条 */}
              {chapter.content && (
                <div className="h-1 bg-gray-100">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
                    style={{ 
                      width: `${Math.min((wordCount / 2000) * 100, 100)}%` 
                    }}
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* 空状态 */}
      {chapters.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl text-gray-300 mb-4">
            <FileText />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">还没有章节</h3>
          <p className="text-gray-600 mb-6">开始创建你的第一个章节吧</p>
        </div>
      )}
    </div>
  )
}