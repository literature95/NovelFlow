'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft, 
  Save, 
  Plus, 
  Edit3, 
  Trash2, 
  FileText, 
  Settings, 
  Sparkles, 
  Users, 
  Globe, 
  BarChart3,
  Moon,
  Sun,
  Eye,
  EyeOff,
  Maximize2,
  Minimize2,
  Type,
  Palette,
  Clock,
  TrendingUp,
  BookOpen,
  PenTool,
  Target,
  Layers,
  Archive
} from 'lucide-react'
import ChapterListEnhanced from '@/components/ChapterListEnhanced'
import ChapterDetailModal from '@/components/ChapterDetailModal'

interface Novel {
  id: string
  title: string
  description?: string
  outline?: string
  worldSetting?: string
  protagonist?: string
  chapters?: Chapter[]
  createdAt: string
  updatedAt: string
  wordCount: number
  chapterCount: number
}

interface Chapter {
  id: string
  title: string
  summary?: string
  content?: string
  order: number
  wordCount?: number
  status: string
  isAIGenerated: boolean
  createdAt: string
  updatedAt: string
}

interface NovelStats {
  totalWords: number
  totalChapters: number
  publishedChapters: number
  draftChapters: number
  archivedChapters: number
  wordsToday: number
  averageWordsPerChapter: number
  lastUpdated: string
}

export default function NovelEditorLayout() {
  const params = useParams()
  const router = useRouter()
  const novelId = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : ''
  
  const [novel, setNovel] = useState<Novel | null>(null)
  const [stats, setStats] = useState<NovelStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editingSettings, setEditingSettings] = useState(false)
  const [error, setError] = useState('')
  
  // 界面状态
  const [darkMode, setDarkMode] = useState(false)
  const [focusMode, setFocusMode] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [activeTab, setActiveTab] = useState<'chapters' | 'outline' | 'settings'>('chapters')
  
  // 章节相关
  const [generatingChapter, setGeneratingChapter] = useState<string | null>(null)
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)

  useEffect(() => {
    if (novelId) {
      fetchNovelData()
    }
  }, [novelId])

  const fetchNovelData = async () => {
    try {
      const token = localStorage.getItem('token')
      const [novelResponse, statsResponse] = await Promise.all([
        fetch(`/api/novels/${novelId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`/api/novels/${novelId}/stats`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ])
      
      if (novelResponse.ok) {
        const data = await novelResponse.json()
        setNovel(data.novel)
      }
      
      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        setStats(statsData.stats)
      }
    } catch (error) {
      setError('网络错误')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveSettings = async () => {
    setSaving(true)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/novels/${novelId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: novel?.title,
          description: novel?.description,
          outline: novel?.outline,
          worldSetting: novel?.worldSetting,
          protagonist: novel?.protagonist
        })
      })
      
      if (response.ok) {
        setEditingSettings(false)
        alert('保存成功')
      } else {
        alert('保存失败')
      }
    } catch (error) {
      alert('保存失败')
    } finally {
      setSaving(false)
    }
  }

  const handleNovelChange = (field: string, value: string) => {
    if (novel) {
      setNovel({
        ...novel,
        [field]: value
      })
      setEditingSettings(true)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">正在加载创作中心...</p>
        </div>
      </div>
    )
  }

  if (error || !novel) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-red-600 text-lg font-medium">{error || '小说不存在'}</p>
          <button 
            onClick={() => router.back()}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            返回上页
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={`h-screen flex flex-col ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* 顶部工具栏 */}
      <header className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b px-4 py-3`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.back()}
              className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'} transition-colors`}
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            
            <div className="flex items-center space-x-2">
              <BookOpen className={`h-5 w-5 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
              <h1 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {novel.title}
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* 字数统计 */}
            {stats && (
              <div className={`hidden sm:flex items-center space-x-4 px-3 py-1.5 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <div className="flex items-center space-x-1">
                  <Type className="h-4 w-4 text-blue-500" />
                  <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    总字数: {stats.totalWords.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <FileText className="h-4 w-4 text-green-500" />
                  <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    章节: {stats.totalChapters}
                  </span>
                </div>
              </div>
            )}

            {/* 保存状态 */}
            {editingSettings && (
              <button
                onClick={handleSaveSettings}
                disabled={saving}
                className="flex items-center px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
              >
                <Save className="h-4 w-4 mr-1" />
                {saving ? '保存中...' : '保存'}
              </button>
            )}

            {/* 视图控制 */}
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'} transition-colors`}
              >
                {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
              
              <button
                onClick={() => setFocusMode(!focusMode)}
                className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'} transition-colors`}
              >
                {focusMode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
              
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'} transition-colors`}
              >
                {sidebarCollapsed ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 主要内容区域 */}
      <div className="flex-1 flex overflow-hidden">
        {/* 左侧边栏 - 工具栏和导航 */}
        {!focusMode && (
          <div className={`${sidebarCollapsed ? 'w-16' : 'w-64'} ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-r transition-all duration-300`}>
            {/* 导航标签 */}
            <div className={`flex ${sidebarCollapsed ? 'flex-col' : 'space-x-1'} p-2 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              {!sidebarCollapsed ? (
                <>
                  <button
                    onClick={() => setActiveTab('chapters')}
                    className={`flex-1 flex items-center justify-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === 'chapters' 
                        ? 'bg-indigo-100 text-indigo-700' 
                        : darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Layers className="h-4 w-4 mr-2" />
                    章节
                  </button>
                  <button
                    onClick={() => setActiveTab('outline')}
                    className={`flex-1 flex items-center justify-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === 'outline' 
                        ? 'bg-indigo-100 text-indigo-700' 
                        : darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <PenTool className="h-4 w-4 mr-2" />
                    大纲
                  </button>
                  <button
                    onClick={() => setActiveTab('settings')}
                    className={`flex-1 flex items-center justify-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === 'settings' 
                        ? 'bg-indigo-100 text-indigo-700' 
                        : darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    设置
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setActiveTab('chapters')}
                    className={`w-full p-2 rounded-lg transition-colors ${
                      activeTab === 'chapters' 
                        ? 'bg-indigo-100 text-indigo-700' 
                        : darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Layers className="h-4 w-4 mx-auto" />
                  </button>
                  <button
                    onClick={() => setActiveTab('outline')}
                    className={`w-full p-2 rounded-lg transition-colors ${
                      activeTab === 'outline' 
                        ? 'bg-indigo-100 text-indigo-700' 
                        : darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <PenTool className="h-4 w-4 mx-auto" />
                  </button>
                  <button
                    onClick={() => setActiveTab('settings')}
                    className={`w-full p-2 rounded-lg transition-colors ${
                      activeTab === 'settings' 
                        ? 'bg-indigo-100 text-indigo-700' 
                        : darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Settings className="h-4 w-4 mx-auto" />
                  </button>
                </>
              )}
            </div>

            {/* 快捷操作 */}
            {!sidebarCollapsed && (
              <div className="p-4">
                <h3 className={`text-xs font-semibold uppercase tracking-wider mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  快捷操作
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href={`/dashboard/novels/${novelId}/characters`}
                    className="flex flex-col items-center p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors group"
                  >
                    <Users className="h-5 w-5 text-blue-600 group-hover:scale-110 transition-transform" />
                    <span className="text-xs text-blue-700 mt-1">角色</span>
                  </Link>
                  <Link
                    href={`/dashboard/novels/${novelId}/world-settings`}
                    className="flex flex-col items-center p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors group"
                  >
                    <Globe className="h-5 w-5 text-green-600 group-hover:scale-110 transition-transform" />
                    <span className="text-xs text-green-700 mt-1">世界观</span>
                  </Link>
                  <Link
                    href={`/dashboard/novels/${novelId}/statistics`}
                    className="flex flex-col items-center p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors group"
                  >
                    <BarChart3 className="h-5 w-5 text-purple-600 group-hover:scale-110 transition-transform" />
                    <span className="text-xs text-purple-700 mt-1">统计</span>
                  </Link>
                  <button
                    onClick={() => setEditingSettings(true)}
                    className="flex flex-col items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                  >
                    <Settings className="h-5 w-5 text-gray-600 group-hover:scale-110 transition-transform" />
                    <span className="text-xs text-gray-700 mt-1">设置</span>
                  </button>
                </div>
              </div>
            )}

            {/* 统计信息 */}
            {stats && !sidebarCollapsed && (
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <h3 className={`text-xs font-semibold uppercase tracking-wider mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  写作统计
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>今日字数</span>
                    <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {stats.wordsToday.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>平均字数</span>
                    <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {stats.averageWordsPerChapter.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>状态分布</span>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                        <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {stats.publishedChapters}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full mr-1"></div>
                        <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {stats.draftChapters}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 主内容区域 */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {activeTab === 'chapters' && (
            <div className="flex-1 overflow-hidden">
              <ChapterListEnhanced
                novelId={novelId}
                chapters={novel.chapters || []}
                onChapterReorder={(reorderedChapters) => {
                  setNovel({
                    ...novel,
                    chapters: reorderedChapters as any
                  })
                }}
                onChapterSelect={(chapter: any) => setSelectedChapter(chapter)}
                onShowDetail={(chapter) => {
                  setSelectedChapter(chapter as any)
                  setShowDetailModal(true)
                }}
              />
            </div>
          )}

          {activeTab === 'outline' && (
            <div className="flex-1 overflow-y-auto p-6">
              <div className="max-w-4xl mx-auto">
                <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  故事大纲
                </h2>
                <textarea
                  value={novel.outline || ''}
                  onChange={(e) => handleNovelChange('outline', e.target.value)}
                  placeholder="在这里编写你的故事大纲..."
                  className={`w-full h-96 p-4 rounded-lg border ${
                    darkMode 
                      ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                  } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                />
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="flex-1 overflow-y-auto p-6">
              <div className="max-w-4xl mx-auto">
                <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  小说设置
                </h2>
                <div className="space-y-6">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      小说标题
                    </label>
                    <input
                      type="text"
                      value={novel.title}
                      onChange={(e) => handleNovelChange('title', e.target.value)}
                      className={`w-full p-3 rounded-lg border ${
                        darkMode 
                          ? 'bg-gray-800 border-gray-700 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      小说简介
                    </label>
                    <textarea
                      value={novel.description || ''}
                      onChange={(e) => handleNovelChange('description', e.target.value)}
                      rows={4}
                      className={`w-full p-3 rounded-lg border ${
                        darkMode 
                          ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                      } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                      placeholder="请输入小说简介..."
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      世界观设定
                    </label>
                    <textarea
                      value={novel.worldSetting || ''}
                      onChange={(e) => handleNovelChange('worldSetting', e.target.value)}
                      rows={6}
                      className={`w-full p-3 rounded-lg border ${
                        darkMode 
                          ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                      } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                      placeholder="描述故事的世界观、时代背景等..."
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      主角设定
                    </label>
                    <textarea
                      value={novel.protagonist || ''}
                      onChange={(e) => handleNovelChange('protagonist', e.target.value)}
                      rows={4}
                      className={`w-full p-3 rounded-lg border ${
                        darkMode 
                          ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                      } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                      placeholder="描述主角的性格、背景、目标等..."
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 章节详情模态框 */}
      {showDetailModal && selectedChapter && (
        <ChapterDetailModal
          chapter={selectedChapter}
          isOpen={showDetailModal}
          onClose={() => {
            setShowDetailModal(false)
            setSelectedChapter(null)
          }}
          darkMode={darkMode}
        />
      )}
    </div>
  )
}