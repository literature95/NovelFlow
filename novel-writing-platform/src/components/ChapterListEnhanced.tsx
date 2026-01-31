'use client'

import { useState, useEffect } from 'react'
import { 
  Plus, 
  Edit3, 
  Trash2, 
  FileText, 
  Settings, 
  Sparkles, 
  Clock,
  TrendingUp,
  Filter,
  Search,
  MoreVertical,
  Eye,
  EyeOff,
  Copy,
  Download,
  ChevronDown,
  ChevronUp,
  Zap,
  Target,
  Calendar
} from 'lucide-react'

interface Chapter {
  id: string
  title: string
  summary?: string
  content?: string
  order: number
  wordCount?: number
  status: string
  isAIGenerated?: boolean
  createdAt: string
  updatedAt: string
  readingTime?: number
}

interface ChapterStats {
  totalWords: number
  averageWords: number
  longestChapter: number
  shortestChapter: number
  totalReadingTime: number
  recentActivity: Array<{
    date: string
    wordsWritten: number
    chaptersCreated: number
  }>
}

interface ChapterListEnhancedProps {
  novelId: string
  chapters: Chapter[]
  onChapterReorder: (chapters: Chapter[]) => void
  onChapterSelect: (chapter: Chapter) => void
  onShowDetail: (chapter: Chapter) => void
}

export default function ChapterListEnhanced({
  novelId,
  chapters,
  onChapterReorder,
  onChapterSelect,
  onShowDetail
}: ChapterListEnhancedProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'published' | 'archived'>('all')
  const [sortBy, setSortBy] = useState<'order' | 'title' | 'wordCount' | 'updatedAt'>('order')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [selectedChapters, setSelectedChapters] = useState<string[]>([])
  const [draggedChapter, setDraggedChapter] = useState<Chapter | null>(null)
  const [stats, setStats] = useState<ChapterStats | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    calculateStats()
  }, [chapters])

  const calculateStats = () => {
    if (!chapters.length) return

    const totalWords = chapters.reduce((sum, ch) => sum + (ch.wordCount || 0), 0)
    const averageWords = Math.round(totalWords / chapters.length)
    const wordCounts = chapters.map(ch => ch.wordCount || 0)
    const longestChapter = Math.max(...wordCounts)
    const shortestChapter = Math.min(...wordCounts)
    const totalReadingTime = Math.round(totalWords / 200) // 假设每分钟阅读200字

    // 最近活动（模拟数据）
    const recentActivity = [
      { date: '2024-01-15', wordsWritten: 2500, chaptersCreated: 2 },
      { date: '2024-01-14', wordsWritten: 1800, chaptersCreated: 1 },
      { date: '2024-01-13', wordsWritten: 3200, chaptersCreated: 3 },
      { date: '2024-01-12', wordsWritten: 900, chaptersCreated: 0 },
    ]

    setStats({
      totalWords,
      averageWords,
      longestChapter,
      shortestChapter,
      totalReadingTime,
      recentActivity
    })
  }

  const filteredAndSortedChapters = chapters
    .filter(chapter => {
      const matchesSearch = chapter.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (chapter.summary && chapter.summary.toLowerCase().includes(searchQuery.toLowerCase()))
      const matchesStatus = statusFilter === 'all' || chapter.status === statusFilter
      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      let compareValue = 0
      
      switch (sortBy) {
        case 'title':
          compareValue = a.title.localeCompare(b.title)
          break
        case 'wordCount':
          compareValue = (a.wordCount || 0) - (b.wordCount || 0)
          break
        case 'updatedAt':
          compareValue = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
          break
        case 'order':
        default:
          compareValue = a.order - b.order
          break
      }
      
      return sortOrder === 'asc' ? compareValue : -compareValue
    })

  const handleDragStart = (e: React.DragEvent, chapter: Chapter) => {
    setDraggedChapter(chapter)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e: React.DragEvent, targetChapter: Chapter) => {
    e.preventDefault()
    if (!draggedChapter || draggedChapter.id === targetChapter.id) return

    const newChapters = [...chapters]
    const draggedIndex = newChapters.findIndex(ch => ch.id === draggedChapter.id)
    const targetIndex = newChapters.findIndex(ch => ch.id === targetChapter.id)

    newChapters.splice(draggedIndex, 1)
    newChapters.splice(targetIndex, 0, draggedChapter)

    // 重新排序
    newChapters.forEach((chapter, index) => {
      chapter.order = index + 1
    })

    onChapterReorder(newChapters)
    setDraggedChapter(null)
  }

  const handleCreateChapter = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/novels/${novelId}/chapters`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: `第${chapters.length + 1}章`,
          content: '',
          order: chapters.length + 1
        })
      })

      if (response.ok) {
        window.location.reload()
      } else {
        alert('创建章节失败')
      }
    } catch (error) {
      alert('创建章节失败')
    }
  }

  const handleBatchDelete = async () => {
    if (!confirm(`确定要删除选中的 ${selectedChapters.length} 个章节吗？`)) return

    try {
      const token = localStorage.getItem('token')
      await Promise.all(
        selectedChapters.map(chapterId =>
          fetch(`/api/novels/${novelId}/chapters/${chapterId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
          })
        )
      )
      
      window.location.reload()
    } catch (error) {
      alert('批量删除失败')
    }
  }

  const getStatusColor = (status: Chapter['status']) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800'
      case 'draft': return 'bg-yellow-100 text-yellow-800'
      case 'archived': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: Chapter['status']) => {
    switch (status) {
      case 'published': return '已发布'
      case 'draft': return '草稿'
      case 'archived': return '已归档'
      default: return '未知'
    }
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* 顶部工具栏 */}
      <div className="border-b border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">章节管理</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Filter className="h-4 w-4 mr-2" />
              筛选
              {showFilters ? <ChevronUp className="h-4 w-4 ml-2" /> : <ChevronDown className="h-4 w-4 ml-2" />}
            </button>
            <button
              onClick={handleCreateChapter}
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              新建章节
            </button>
          </div>
        </div>

        {/* 搜索和筛选栏 */}
        <div className={`${showFilters ? 'block' : 'hidden'} space-y-3 mb-4`}>
          <div className="flex items-center space-x-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="搜索章节标题或简介..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">全部状态</option>
              <option value="draft">草稿</option>
              <option value="published">已发布</option>
              <option value="archived">已归档</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="order">按顺序</option>
              <option value="title">按标题</option>
              <option value="wordCount">按字数</option>
              <option value="updatedAt">按更新时间</option>
            </select>

            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              {sortOrder === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* 统计信息卡片 */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-4">
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="flex items-center justify-between">
                <FileText className="h-4 w-4 text-blue-600" />
                <span className="text-xs text-blue-600">总字数</span>
              </div>
              <p className="text-lg font-semibold text-blue-900 mt-1">
                {stats.totalWords.toLocaleString()}
              </p>
            </div>
            
            <div className="bg-green-50 p-3 rounded-lg">
              <div className="flex items-center justify-between">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-xs text-green-600">平均字数</span>
              </div>
              <p className="text-lg font-semibold text-green-900 mt-1">
                {stats.averageWords.toLocaleString()}
              </p>
            </div>
            
            <div className="bg-purple-50 p-3 rounded-lg">
              <div className="flex items-center justify-between">
                <Target className="h-4 w-4 text-purple-600" />
                <span className="text-xs text-purple-600">最长章节</span>
              </div>
              <p className="text-lg font-semibold text-purple-900 mt-1">
                {stats.longestChapter.toLocaleString()}
              </p>
            </div>
            
            <div className="bg-yellow-50 p-3 rounded-lg">
              <div className="flex items-center justify-between">
                <Clock className="h-4 w-4 text-yellow-600" />
                <span className="text-xs text-yellow-600">阅读时间</span>
              </div>
              <p className="text-lg font-semibold text-yellow-900 mt-1">
                {stats.totalReadingTime}分钟
              </p>
            </div>
            
            <div className="bg-indigo-50 p-3 rounded-lg">
              <div className="flex items-center justify-between">
                <Calendar className="h-4 w-4 text-indigo-600" />
                <span className="text-xs text-indigo-600">今日写作</span>
              </div>
              <p className="text-lg font-semibold text-indigo-900 mt-1">
                {stats.recentActivity[0]?.wordsWritten || 0}
              </p>
            </div>
            
            <div className="bg-red-50 p-3 rounded-lg">
              <div className="flex items-center justify-between">
                <Zap className="h-4 w-4 text-red-600" />
                <span className="text-xs text-red-600">活跃天数</span>
              </div>
              <p className="text-lg font-semibold text-red-900 mt-1">
                {stats.recentActivity.length}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 章节列表 */}
      <div className="flex-1 overflow-y-auto">
        {filteredAndSortedChapters.length === 0 ? (
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
          <div className="p-4 space-y-3">
            {/* 批量操作栏 */}
            {selectedChapters.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center justify-between">
                <span className="text-sm text-blue-800">
                  已选择 {selectedChapters.length} 个章节
                </span>
                <div className="flex items-center space-x-2">
                  <button className="text-sm text-blue-600 hover:text-blue-800">
                    <Copy className="h-4 w-4" />
                  </button>
                  <button className="text-sm text-blue-600 hover:text-blue-800">
                    <Download className="h-4 w-4" />
                  </button>
                  <button
                    onClick={handleBatchDelete}
                    className="text-sm text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* 章节卡片 */}
            {filteredAndSortedChapters.map((chapter) => (
              <div
                key={chapter.id}
                draggable
                onDragStart={(e) => handleDragStart(e, chapter)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, chapter)}
                className={`bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all cursor-move ${
                  draggedChapter?.id === chapter.id ? 'opacity-50' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <input
                        type="checkbox"
                        checked={selectedChapters.includes(chapter.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedChapters([...selectedChapters, chapter.id])
                          } else {
                            setSelectedChapters(selectedChapters.filter(id => id !== chapter.id))
                          }
                        }}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <h3 className="text-lg font-medium text-gray-900">
                        {chapter.title}
                      </h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(chapter.status)}`}>
                        {getStatusText(chapter.status)}
                      </span>
                      {chapter.isAIGenerated && (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                          AI生成
                        </span>
                      )}
                    </div>
                    
                    {chapter.summary && (
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {chapter.summary}
                      </p>
                    )}
                    
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <div className="flex items-center">
                        <FileText className="h-3 w-3 mr-1" />
                        {chapter.wordCount || 0} 字
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {chapter.readingTime || Math.ceil((chapter.wordCount || 0) / 200)} 分钟
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(chapter.updatedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-1 ml-4">
                    <button
                      onClick={() => onChapterSelect(chapter)}
                      className="p-2 text-gray-400 hover:text-indigo-600 transition-colors"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onShowDetail(chapter)}
                      className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}