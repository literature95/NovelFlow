'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { 
  BookOpen, 
  ArrowLeft, 
  Save, 
  RefreshCw, 
  Eye, 
  EyeOff,
  Settings,
  X,
  ChevronRight,
  ChevronDown,
  Type,
  Clock,
  Sparkles,
  FileText,
  Layers,
  Users,
  Globe,
  Menu,
  Plus,
  Edit3,
  Trash2,
  Copy,
  MoveUp,
  MoveDown,
  GripVertical,
  Hash,
  Target,
  Zap,
  Lightbulb,
  MessageSquare,
  MoreVertical,
  Check,
  Maximize2,
  Minimize2,
  Quote
} from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'

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

interface Character {
  id: string
  name: string
  description?: string
}

interface WorldSetting {
  id: string
  name: string
  description?: string
}

export default function EnhancedChapterWorkspace() {
  const params = useParams()
  const router = useRouter()
  const novelId = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : ''
  const chapterId = typeof params.chapterId === 'string' ? params.chapterId : ''

  // 核心状态
  const [novel, setNovel] = useState<any>(null)
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [currentChapter, setCurrentChapter] = useState<Chapter | null>(null)
  const [characters, setCharacters] = useState<Character[]>([])
  const [worldSettings, setWorldSettings] = useState<WorldSetting[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // 编辑器状态
  const [content, setContent] = useState('')
  const [hasChanges, setHasChanges] = useState(false)
  const [saving, setSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [wordCount, setWordCount] = useState(0)
  const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit')

  // UI状态
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [rightPanelCollapsed, setRightPanelCollapsed] = useState(false)
  const [rightPanelTab, setRightPanelTab] = useState<'outline' | 'characters' | 'world' | 'ai'>('ai')
  const [showChapterSettings, setShowChapterSettings] = useState<string | null>(null)

  // AI生成状态
  const [generating, setGenerating] = useState(false)
  const [aiPrompt, setAiPrompt] = useState('')

  // 编辑状态
  const [editingChapterId, setEditingChapterId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editSummary, setEditSummary] = useState('')
  const [showEditModal, setShowEditModal] = useState(false)
  
  const autoSaveTimer = useRef<NodeJS.Timeout | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // 加载数据
  useEffect(() => {
    loadData()
  }, [novelId, chapterId])

  // 加载所有数据
  const loadData = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      
      // 并行加载小说和章节
      const [novelRes, chaptersRes, charactersRes, worldRes] = await Promise.all([
        fetch(`/api/novels/${novelId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`/api/novels/${novelId}/chapters`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`/api/novels/${novelId}/characters`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }).catch(() => ({ ok: true, json: async () => ({ characters: [] }) })),
        fetch(`/api/novels/${novelId}/world-settings`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }).catch(() => ({ ok: true, json: async () => ({ settings: [] }) }))
      ])

      if (novelRes.ok) {
        const novelData = await novelRes.json()
        setNovel(novelData.novel)
      }

      if (chaptersRes.ok) {
        const chaptersData = await chaptersRes.json()
        setChapters(chaptersData.chapters || [])
      }

      if (charactersRes.ok) {
        const charsData = await charactersRes.json()
        setCharacters(charsData.characters || [])
      }

      if (worldRes.ok) {
        const worldData = await worldRes.json()
        setWorldSettings(worldData.settings || [])
      }

      // 加载当前章节
      if (chapterId) {
        const chapterRes = await fetch(`/api/novels/${novelId}/chapters/${chapterId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        if (chapterRes.ok) {
          const chapterData = await chapterRes.json()
          setCurrentChapter(chapterData.chapter)
          setContent(chapterData.chapter.content || '')
          setWordCount(chapterData.chapter.content?.length || 0)
        }
      }
    } catch (err) {
      setError('加载数据失败')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // 字数统计
  useEffect(() => {
    setWordCount(content.replace(/\s/g, '').length)
  }, [content])

  // 自动保存
  useEffect(() => {
    if (autoSaveTimer.current) {
      clearTimeout(autoSaveTimer.current)
    }
    
    if (hasChanges && !saving) {
      autoSaveTimer.current = setTimeout(() => {
        handleSave()
      }, 3000)
    }

    return () => {
      if (autoSaveTimer.current) {
        clearTimeout(autoSaveTimer.current)
      }
    }
  }, [hasChanges, content])

  // 键盘快捷键
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
        handleSave()
      }
      if (e.key === 'Escape' && showChapterSettings) {
        setShowChapterSettings(null)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [showChapterSettings])

  const handleSave = async () => {
    if (!currentChapter || saving) return
    
    setSaving(true)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/novels/${novelId}/chapters/${currentChapter.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: currentChapter.title,
          summary: currentChapter.summary,
          content: content
        })
      })

      if (response.ok) {
        setHasChanges(false)
        setLastSaved(new Date())
        // 更新章节列表中的字数
        setChapters(prev => prev.map(ch => 
          ch.id === currentChapter.id 
            ? { ...ch, content, wordCount: content.length }
            : ch
        ))
      }
    } catch (err) {
      console.error('保存失败:', err)
      alert('保存失败，请重试')
    } finally {
      setSaving(false)
    }
  }

  const handleContentChange = (value: string) => {
    setContent(value)
    setHasChanges(true)
  }

  const handleSelectChapter = (chapter: Chapter) => {
    router.push(`/dashboard/novels/${novelId}/chapters/${chapter.id}`)
  }

  const handleAIGenerate = async () => {
    if (!currentChapter?.summary?.trim()) {
      alert('请先设置章节简介，以便AI生成内容')
      return
    }

    if (content && content.trim() && !confirm('当前章节已有内容，AI生成将覆盖。是否继续？')) {
      return
    }

    setGenerating(true)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/ai/generate-chapter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          novelId,
          chapterId: currentChapter.id,
          prompt: aiPrompt || currentChapter.summary
        })
      })

      if (response.ok) {
        const data = await response.json()
        setContent(data.content)
        setHasChanges(true)
      } else {
        const errorData = await response.json()
        alert(errorData.error || 'AI生成失败')
      }
    } catch (err) {
      console.error('AI生成失败:', err)
      alert('AI生成失败，请重试')
    } finally {
      setGenerating(false)
    }
  }

  const handleCreateChapter = async () => {
    if (!novelId) {
      alert('小说ID无效，无法创建章节')
      return
    }

    try {
      const token = localStorage.getItem('token')
      if (!token) {
        alert('请先登录')
        return
      }

      const newChapterData = {
        title: `第 ${chapters.length + 1} 章`,
        summary: '',
        order: chapters.length + 1
      }

      console.log('Creating chapter with data:', newChapterData)
      
      const response = await fetch(`/api/novels/${novelId}/chapters`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newChapterData)
      })

      const responseData = await response.json()
      console.log('Create chapter response:', responseData)

      if (response.ok) {
        const newChapter = responseData.chapter
        setChapters(prev => [...prev, newChapter])
        
        // 更新当前章节
        setCurrentChapter(newChapter)
        setContent('')
        setHasChanges(false)
        
        // 切换到新章节的编辑页面
        router.push(`/dashboard/novels/${novelId}/chapters/${newChapter.id}`)
        
        alert('章节创建成功！')
      } else {
        console.error('Create chapter failed:', responseData)
        alert(responseData.error || '创建章节失败')
      }
    } catch (err) {
      console.error('创建章节异常:', err)
      alert('创建章节失败，请重试')
    }
  }

  const handleDeleteChapter = async (chapter: Chapter) => {
    if (!confirm(`确定要删除"${chapter.title}"吗？删除后无法恢复！`)) return
    
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/novels/${novelId}/chapters/${chapter.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (response.ok) {
        setChapters(prev => prev.filter(ch => ch.id !== chapter.id))
        if (currentChapter?.id === chapter.id) {
          setCurrentChapter(null)
          setContent('')
          router.push(`/dashboard/novels/${novelId}`)
        }
        alert('章节已删除')
      } else {
        const errorData = await response.json()
        alert(errorData.error || '删除失败')
      }
    } catch (err) {
      console.error('删除章节失败:', err)
      alert('删除失败，请重试')
    }
  }

  const handleEditChapter = (chapter: Chapter) => {
    setEditingChapterId(chapter.id)
    setEditTitle(chapter.title)
    setEditSummary(chapter.summary || '')
    setShowEditModal(true)
  }

  const handleSaveChapterInfo = async () => {
    if (!editingChapterId) return

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/novels/${novelId}/chapters/${editingChapterId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: editTitle,
          summary: editSummary,
          content: chapters.find(ch => ch.id === editingChapterId)?.content
        })
      })

      if (response.ok) {
        const data = await response.json()
        setChapters(prev => prev.map(ch => 
          ch.id === editingChapterId 
            ? { ...ch, title: editTitle, summary: editSummary }
            : ch
        ))
        if (currentChapter?.id === editingChapterId) {
          setCurrentChapter(prev => prev ? { ...prev, title: editTitle, summary: editSummary } : null)
        }
        setShowEditModal(false)
        setEditingChapterId(null)
        alert('章节信息已更新')
      } else {
        const errorData = await response.json()
        alert(errorData.error || '更新失败')
      }
    } catch (err) {
      console.error('更新章节失败:', err)
      alert('更新失败，请重试')
    }
  }

  const handleMoveChapter = async (chapter: Chapter, direction: 'up' | 'down') => {
    const currentIndex = chapters.findIndex(ch => ch.id === chapter.id)
    if (currentIndex === -1) return

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
    if (newIndex < 0 || newIndex >= chapters.length) return

    try {
      const token = localStorage.getItem('token')
      const reorderedChapters = [...chapters]
      const [movedChapter] = reorderedChapters.splice(currentIndex, 1)
      reorderedChapters.splice(newIndex, 0, movedChapter)

      // 更新所有章节的顺序
      const chaptersWithNewOrder = reorderedChapters.map((ch, index) => ({
        id: ch.id,
        order: index + 1
      }))

      const response = await fetch(`/api/novels/${novelId}/chapters/reorder`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ chapters: chaptersWithNewOrder })
      })

      if (response.ok) {
        setChapters(reorderedChapters.map((ch, index) => ({ ...ch, order: index + 1 })))
      } else {
        alert('排序失败')
      }
    } catch (err) {
      console.error('章节排序失败:', err)
      alert('排序失败，请重试')
    }
  }

  const handleCopyChapter = async (chapter: Chapter) => {
    try {
      await navigator.clipboard.writeText(chapter.content || '')
      alert('内容已复制到剪贴板')
    } catch (err) {
      alert('复制失败')
    }
  }

  const insertFormatting = (before: string, after: string = '') => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = textarea.value.substring(start, end)
    const newText = before + selectedText + after

    const newContent = 
      textarea.value.substring(0, start) + 
      newText + 
      textarea.value.substring(end)

    handleContentChange(newContent)

    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(
        start + before.length,
        start + before.length + selectedText.length
      )
    }, 0)
  }

  const insertChapterTitle = (level: 1 | 2 | 3) => {
    const prefix = '#'.repeat(level)
    insertFormatting(`\n${prefix} `, '\n')
  }

  const insertSeparator = () => {
    insertFormatting('\n\n---\n\n', '')
  }

  const clearContent = () => {
    if (content && confirm('确定要清空所有内容吗？此操作无法撤销。')) {
      handleContentChange('')
    }
  }

  const renderMarkdown = (text: string) => {
    if (!text) return ''
    
    const html = text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      .replace(/\n\n/g, '</p><p class="mb-4">')
      .replace(/\n/g, '<br>')
      .replace(/^> (.*?)$/gm, '<blockquote class="border-l-4 border-gray-300 pl-4 italic my-4">$1</blockquote>')
      .replace(/^- (.*?)$/gm, '<li class="ml-4">• $1</li>')
      .replace(/^\d+\. (.*?)$/gm, '<li class="ml-4 list-decimal">$1</li>')

    return `<p class="mb-4">${html}</p>`
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">正在加载...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* 顶部工具栏 */}
      <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors group"
            title="返回"
          >
            <ArrowLeft className="h-5 w-5 text-gray-500 group-hover:text-gray-700 transition-colors" />
          </button>
          <div className="h-6 w-px bg-gray-200"></div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">{novel?.title || '小说'}</h1>
            {currentChapter ? (
              <div className="flex items-center gap-2">
                <p className="text-sm text-gray-500">{currentChapter.title}</p>
                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                <span className="text-xs text-gray-400">第{currentChapter.order}章</span>
              </div>
            ) : (
              <p className="text-sm text-gray-400">未选择章节</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* 编辑模式切换 */}
          <div className="flex items-center bg-gray-100 rounded-lg p-0.5 shadow-inner">
            <button
              onClick={() => setViewMode('edit')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                viewMode === 'edit' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Edit3 className="h-4 w-4 mr-1.5 inline" />
              编辑
            </button>
            <button
              onClick={() => setViewMode('preview')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                viewMode === 'preview' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Eye className="h-4 w-4 mr-1.5 inline" />
              预览
            </button>
          </div>

          <div className="h-6 w-px bg-gray-200"></div>

          {/* 字数统计 */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 rounded-lg border border-blue-100">
            <Type className="h-4 w-4" />
            <span className="text-sm font-semibold">{wordCount.toLocaleString()}</span>
            <span className="text-xs text-blue-500">字</span>
          </div>

          {/* 保存状态 */}
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all ${
            saving 
              ? 'bg-yellow-50 border-yellow-200 text-yellow-700'
              : hasChanges
                ? 'bg-orange-50 border-orange-200 text-orange-700'
                : 'bg-green-50 border-green-200 text-green-700'
          }`}>
            {saving ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span className="text-sm font-medium">保存中...</span>
              </>
            ) : hasChanges ? (
              <>
                <Clock className="h-4 w-4" />
                <span className="text-sm font-medium">未保存</span>
              </>
            ) : (
              <>
                <Check className="h-4 w-4" />
                <span className="text-sm font-medium">已保存</span>
              </>
            )}
          </div>

          {/* 保存按钮 */}
          <button
            onClick={handleSave}
            disabled={!hasChanges || saving}
            className={`px-5 py-2 rounded-lg font-medium transition-all shadow-sm ${
              hasChanges && !saving
                ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white hover:from-indigo-700 hover:to-indigo-800 hover:shadow-md'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            {saving ? '保存中...' : '保存'}
          </button>
        </div>
      </header>

      {/* 主内容区 */}
      <div className="flex-1 flex overflow-hidden">
        {/* 左侧章节列表 */}
        <div className={`${sidebarCollapsed ? 'w-16' : 'w-72'} bg-gradient-to-b from-white to-gray-50 border-r border-gray-200 flex flex-col transition-all duration-300`}>
          {/* 侧边栏头部 */}
          <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-white">
            {!sidebarCollapsed && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <FileText className="h-4 w-4 text-indigo-600" />
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900 text-sm">章节列表</h2>
                  <p className="text-xs text-gray-500">共 {chapters.length} 章</p>
                </div>
              </div>
            )}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
              title={sidebarCollapsed ? '展开' : '折叠'}
            >
              {sidebarCollapsed ? <ChevronRight className="h-4 w-4 text-gray-500" /> : <Menu className="h-4 w-4 text-gray-500" />}
            </button>
          </div>

          {/* 章节统计 */}
          {!sidebarCollapsed && (
            <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50">
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-white rounded-lg p-2.5 text-center shadow-sm">
                  <div className="text-xl font-bold text-indigo-600">{chapters.length}</div>
                  <div className="text-xs text-gray-500 mt-0.5">章节</div>
                </div>
                <div className="bg-white rounded-lg p-2.5 text-center shadow-sm">
                  <div className="text-xl font-bold text-purple-600">
                    {chapters.filter(ch => ch.content).length}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">已完成</div>
                </div>
                <div className="bg-white rounded-lg p-2.5 text-center shadow-sm">
                  <div className="text-xl font-bold text-blue-600">
                    {(chapters.reduce((sum, ch) => sum + (ch.wordCount || 0), 0) / 1000).toFixed(1)}k
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">字数</div>
                </div>
              </div>
            </div>
          )}

          {/* 章节列表 */}
          <div className="flex-1 overflow-y-auto p-3">
            {chapters.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 py-8">
                <FileText className="h-12 w-12 mb-3 opacity-30" />
                <p className="text-sm">暂无章节</p>
                <p className="text-xs mt-1">点击下方按钮创建新章节</p>
              </div>
            ) : (
              <div className="space-y-1">
                {chapters.map((chapter) => {
                  const isActive = currentChapter?.id === chapter.id
                  const hasContent = !!chapter.content
                  const wordCount = chapter.wordCount || 0
                  
                  return (
                    <div
                      key={chapter.id}
                      onClick={() => handleSelectChapter(chapter)}
                      className={`group relative p-3 rounded-lg border transition-all cursor-pointer overflow-hidden ${
                        isActive 
                          ? 'border-indigo-500 bg-gradient-to-r from-indigo-50 to-white shadow-sm' 
                          : 'border-gray-100 hover:border-indigo-200 hover:bg-gray-50'
                      }`}
                    >
                      {/* 激活状态左侧标记 */}
                      {isActive && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 rounded-l-lg"></div>
                      )}
                      
                      <div className="flex items-start gap-3 pl-1">
                        {/* 拖拽手柄 */}
                        <div className="flex items-center justify-center mt-1 cursor-move">
                          <GripVertical className="h-4 w-4 text-gray-300 group-hover:text-gray-400 transition-colors" />
                        </div>

                        {/* 章节序号和图标 */}
                        <div className="flex items-center justify-center w-8 h-8 mt-0.5 flex-shrink-0">
                          {hasContent ? (
                            <div className="w-7 h-7 bg-green-50 rounded-lg flex items-center justify-center">
                              <Check className="h-3.5 w-3.5 text-green-500" />
                            </div>
                          ) : (
                            <div className="w-7 h-7 bg-gray-100 rounded-lg flex items-center justify-center">
                              <FileText className="h-3.5 w-3.5 text-gray-400" />
                            </div>
                          )}
                        </div>

                        {/* 章节信息 */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-medium text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                              {chapter.order}
                            </span>
                            <h3 className={`text-sm font-medium truncate ${
                              isActive ? 'text-indigo-700' : 'text-gray-900'
                            }`}>
                              {chapter.title}
                            </h3>
                          </div>
                          
                          {/* 章节统计 */}
                          <div className="flex items-center gap-3 text-xs text-gray-400">
                            <span className="flex items-center gap-1">
                              <Type className="h-3 w-3" />
                              {wordCount}字
                            </span>
                            {chapter.summary && (
                              <span className="flex items-center gap-1">
                                <Hash className="h-3 w-3" />
                                有简介
                              </span>
                            )}
                          </div>
                        </div>

                        {/* 操作按钮 */}
                        {!sidebarCollapsed && (
                          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                setShowChapterSettings(showChapterSettings === chapter.id ? null : chapter.id)
                              }}
                              className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors"
                              title="更多操作"
                            >
                              <MoreVertical className="h-4 w-4 text-gray-400" />
                            </button>
                          </div>
                        )}
                      </div>

                      {/* 操作菜单 */}
                      {showChapterSettings === chapter.id && !sidebarCollapsed && (
                        <div 
                          className="absolute right-2 top-12 bg-white rounded-xl shadow-xl border border-gray-200 py-1.5 z-20 min-w-[140px]"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleEditChapter(chapter)
                              setShowChapterSettings(null)
                            }}
                            className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2 transition-colors"
                          >
                            <Edit3 className="h-4 w-4 text-gray-500" />
                            编辑信息
                          </button>
                          <div className="border-t border-gray-100 my-1"></div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleMoveChapter(chapter, 'up')
                              setShowChapterSettings(null)
                            }}
                            disabled={chapter.order === 1}
                            className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            <MoveUp className="h-4 w-4 text-gray-500" />
                            上移
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleMoveChapter(chapter, 'down')
                              setShowChapterSettings(null)
                            }}
                            disabled={chapter.order === chapters.length}
                            className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            <MoveDown className="h-4 w-4 text-gray-500" />
                            下移
                          </button>
                          <div className="border-t border-gray-100 my-1"></div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleCopyChapter(chapter)
                              setShowChapterSettings(null)
                            }}
                            className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2 transition-colors"
                          >
                            <Copy className="h-4 w-4 text-gray-500" />
                            复制内容
                          </button>
                          <div className="border-t border-gray-100 my-1"></div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteChapter(chapter)
                              setShowChapterSettings(null)
                            }}
                            className="w-full px-3 py-2 text-left text-sm hover:bg-red-50 text-red-600 flex items-center gap-2 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                            删除章节
                          </button>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* 新建章节按钮 */}
          {!sidebarCollapsed && (
            <div className="p-3 border-t border-gray-200 bg-white">
              <button
                onClick={handleCreateChapter}
                className="w-full px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-lg hover:from-indigo-700 hover:to-indigo-800 transition-all shadow-sm hover:shadow flex items-center justify-center gap-2 font-medium text-sm"
              >
                <Plus className="h-4 w-4" />
                新建章节
              </button>
            </div>
          )}
        </div>

        {/* 中间编辑区 */}
        <div className="flex-1 flex flex-col bg-gradient-to-b from-white to-gray-50">
          {/* 编辑器工具栏 */}
          {viewMode === 'edit' && (
            <div className="px-6 py-2.5 border-b border-gray-200 bg-white flex items-center gap-1.5 flex-wrap">
              {/* 文本格式 */}
              <div className="flex items-center gap-0.5 bg-gray-100 rounded-lg p-0.5">
                <button
                  onClick={() => insertFormatting('**', '**')}
                  className="px-3 py-1.5 hover:bg-white hover:shadow-sm rounded-md transition-all text-sm font-bold text-gray-700"
                  title="粗体"
                >
                  B
                </button>
                <button
                  onClick={() => insertFormatting('*', '*')}
                  className="px-3 py-1.5 hover:bg-white hover:shadow-sm rounded-md transition-all text-sm italic text-gray-700"
                  title="斜体"
                >
                  I
                </button>
                <button
                  onClick={() => insertFormatting('~~', '~~')}
                  className="px-3 py-1.5 hover:bg-white hover:shadow-sm rounded-md transition-all text-sm line-through text-gray-700"
                  title="删除线"
                >
                  S
                </button>
              </div>

              <div className="w-px h-6 bg-gray-200 mx-1"></div>

              {/* 标题 */}
              <div className="flex items-center gap-0.5 bg-gray-100 rounded-lg p-0.5">
                <button
                  onClick={() => insertChapterTitle(1)}
                  className="px-3 py-1.5 hover:bg-white hover:shadow-sm rounded-md transition-all text-sm font-bold text-gray-700"
                  title="一级标题"
                >
                  H1
                </button>
                <button
                  onClick={() => insertChapterTitle(2)}
                  className="px-3 py-1.5 hover:bg-white hover:shadow-sm rounded-md transition-all text-sm font-bold text-gray-700"
                  title="二级标题"
                >
                  H2
                </button>
                <button
                  onClick={() => insertChapterTitle(3)}
                  className="px-3 py-1.5 hover:bg-white hover:shadow-sm rounded-md transition-all text-sm font-bold text-gray-700"
                  title="三级标题"
                >
                  H3
                </button>
              </div>

              <div className="w-px h-6 bg-gray-200 mx-1"></div>

              {/* 列表 */}
              <div className="flex items-center gap-0.5 bg-gray-100 rounded-lg p-0.5">
                <button
                  onClick={() => insertFormatting('\n- ', '')}
                  className="px-3 py-1.5 hover:bg-white hover:shadow-sm rounded-md transition-all text-sm text-gray-700"
                  title="无序列表"
                >
                  • 列表
                </button>
                <button
                  onClick={() => insertFormatting('\n1. ', '')}
                  className="px-3 py-1.5 hover:bg-white hover:shadow-sm rounded-md transition-all text-sm text-gray-700"
                  title="有序列表"
                >
                  1. 列表
                </button>
              </div>

              <div className="w-px h-6 bg-gray-200 mx-1"></div>

              {/* 其他格式 */}
              <div className="flex items-center gap-0.5 bg-gray-100 rounded-lg p-0.5">
                <button
                  onClick={() => insertFormatting('\n> ', '')}
                  className="px-3 py-1.5 hover:bg-white hover:shadow-sm rounded-md transition-all text-sm text-gray-700"
                  title="引用"
                >
                  <Quote className="h-4 w-4" />
                </button>
                <button
                  onClick={() => insertFormatting('`', '`')}
                  className="px-3 py-1.5 hover:bg-white hover:shadow-sm rounded-md transition-all text-sm font-mono text-gray-700"
                  title="行内代码"
                >
                  &lt;/&gt;
                </button>
                <button
                  onClick={() => insertSeparator()}
                  className="px-3 py-1.5 hover:bg-white hover:shadow-sm rounded-md transition-all text-sm text-gray-700"
                  title="分隔线"
                >
                  —
                </button>
              </div>

              <div className="flex-1"></div>

              {/* 右侧按钮 */}
              <div className="flex items-center gap-2">
                <button
                  onClick={clearContent}
                  className="px-3 py-1.5 hover:bg-red-50 text-gray-600 hover:text-red-600 rounded-lg transition-all text-sm"
                  title="清空内容"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                
                <div className="text-xs text-gray-400 flex items-center gap-1 px-2">
                  <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-500">Ctrl</kbd>
                  <span>+</span>
                  <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-500">S</kbd>
                </div>
                
                <button
                  onClick={() => {
                    setRightPanelTab('ai')
                    setRightPanelCollapsed(false)
                  }}
                  className="px-4 py-1.5 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg hover:from-purple-600 hover:to-indigo-600 transition-all shadow-sm hover:shadow flex items-center gap-2 text-sm font-medium"
                >
                  <Sparkles className="h-4 w-4" />
                  AI辅助
                </button>
              </div>
            </div>
          )}

          {/* 编辑区 */}
          <div className="flex-1 overflow-y-auto">
            {viewMode === 'edit' ? (
              <div className="px-8 py-6 max-w-4xl mx-auto">
                <textarea
                  ref={textareaRef}
                  value={content}
                  onChange={(e) => handleContentChange(e.target.value)}
                  placeholder={currentChapter?.summary 
                    ? `基于简介创作：${currentChapter.summary}\n\n开始写作...` 
                    : '开始写作...\n\n提示：可以在右侧设置章节简介后，使用AI辅助生成内容'
                  }
                  className="w-full min-h-[calc(100vh-320px)] text-base leading-relaxed resize-none outline-none text-gray-800 placeholder-gray-400"
                  style={{ fontSize: '16px', lineHeight: '1.8' }}
                />
              </div>
            ) : (
              <div className="px-8 py-6 max-w-4xl mx-auto">
                <div
                  className="prose prose-lg max-w-none prose-headings:font-semibold prose-p:text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
                />
              </div>
            )}
          </div>

          {/* 底部状态栏 */}
          <div className="px-6 py-2 bg-white border-t border-gray-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-4 text-gray-500">
              <span className="flex items-center gap-1">
                <Type className="h-3.5 w-3.5" />
                <span className="font-medium">{wordCount.toLocaleString()}</span>
                <span>字</span>
              </span>
              <span className="w-px h-3.5 bg-gray-200"></span>
              <span className="flex items-center gap-1">
                <span>段落:</span>
                <span className="font-medium">{content.split('\n\n').filter(p => p.trim()).length}</span>
              </span>
              <span className="w-px h-3.5 bg-gray-200"></span>
              <span className="flex items-center gap-1">
                <span>行数:</span>
                <span className="font-medium">{content.split('\n').length}</span>
              </span>
            </div>
            {lastSaved && (
              <div className="flex items-center gap-1 text-gray-400">
                <Check className="h-3.5 w-3.5 text-green-500" />
                <span>最后保存: {lastSaved.toLocaleTimeString()}</span>
              </div>
            )}
          </div>
        </div>

        {/* 右侧辅助工具栏 */}
        <div className={`${rightPanelCollapsed ? 'w-0' : 'w-80'} bg-white border-l border-gray-200 flex flex-col transition-all duration-300`}>
          {/* 折叠按钮 */}
          <button
            onClick={() => setRightPanelCollapsed(!rightPanelCollapsed)}
            className="absolute -left-8 top-1/2 -translate-y-1/2 bg-white border border-gray-200 rounded-l-lg p-2 hover:bg-gray-50 transition-colors"
          >
            {rightPanelCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>

          {!rightPanelCollapsed && (
            <>
              {/* Tab切换 */}
              <div className="flex border-b border-gray-200">
                {[
                  { id: 'ai' as const, label: 'AI助手', icon: Sparkles },
                  { id: 'outline' as const, label: '大纲', icon: Layers },
                  { id: 'characters' as const, label: '角色', icon: Users },
                  { id: 'world' as const, label: '世界观', icon: Globe },
                ].map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setRightPanelTab(tab.id)}
                      className={`flex-1 px-4 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-1.5 ${
                        rightPanelTab === tab.id
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

              {/* Tab内容 */}
              <div className="flex-1 overflow-y-auto p-4">
                {/* AI助手 */}
                {rightPanelTab === 'ai' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        AI生成提示
                      </label>
                      <textarea
                        value={aiPrompt}
                        onChange={(e) => setAiPrompt(e.target.value)}
                        placeholder="输入提示词，或留空使用章节简介生成..."
                        className="w-full h-24 px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <button
                      onClick={handleAIGenerate}
                      disabled={generating || !currentChapter?.summary}
                      className={`w-full px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                        generating || !currentChapter?.summary
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700'
                      }`}
                    >
                      {generating ? (
                        <>
                          <RefreshCw className="h-4 w-4 animate-spin" />
                          生成中...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4" />
                          生成章节内容
                        </>
                      )}
                    </button>

                    <div className="bg-blue-50 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-blue-900 mb-2 flex items-center gap-2">
                        <Lightbulb className="h-4 w-4" />
                        使用提示
                      </h4>
                      <ul className="text-xs text-blue-800 space-y-1.5">
                        <li>• 章节简介是AI生成的基础</li>
                        <li>• 可以在提示框中添加额外要求</li>
                        <li>• 生成后可以手动编辑修改</li>
                        <li>• 支持多种写作风格和体裁</li>
                      </ul>
                    </div>
                  </div>
                )}

                {/* 大纲 */}
                {rightPanelTab === 'outline' && (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">小说大纲</h3>
                    <div className="prose prose-sm max-w-none">
                      <p className="text-gray-600 text-sm whitespace-pre-wrap">
                        {novel?.outline || '暂无大纲'}
                      </p>
                    </div>
                  </div>
                )}

                {/* 角色 */}
                {rightPanelTab === 'characters' && (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">角色列表</h3>
                    <div className="space-y-3">
                      {characters.length === 0 ? (
                        <p className="text-sm text-gray-500">暂无角色</p>
                      ) : (
                        characters.map((char) => (
                          <div key={char.id} className="p-3 bg-gray-50 rounded-lg">
                            <h4 className="font-medium text-gray-900 text-sm">{char.name}</h4>
                            {char.description && (
                              <p className="text-xs text-gray-600 mt-1">{char.description}</p>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {/* 世界观 */}
                {rightPanelTab === 'world' && (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">世界观设定</h3>
                    <div className="space-y-3">
                      {worldSettings.length === 0 ? (
                        <p className="text-sm text-gray-500">暂无设定</p>
                      ) : (
                        worldSettings.map((setting) => (
                          <div key={setting.id} className="p-3 bg-gray-50 rounded-lg">
                            <h4 className="font-medium text-gray-900 text-sm">{setting.name}</h4>
                            {setting.description && (
                              <p className="text-xs text-gray-600 mt-1">{setting.description}</p>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* 编辑章节信息模态框 */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">编辑章节信息</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  章节标题
                </label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="输入章节标题"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  章节简介
                </label>
                <textarea
                  value={editSummary}
                  onChange={(e) => setEditSummary(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                  rows={4}
                  placeholder="输入章节简介，用于AI生成内容参考..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  简介会作为AI生成章节内容的重要参考
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium"
              >
                取消
              </button>
              <button
                onClick={handleSaveChapterInfo}
                className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-lg hover:from-indigo-700 hover:to-indigo-800 transition-colors font-medium"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
