'use client'

import { useState, useEffect } from 'react'
import { 
  BookOpen, 
  Settings, 
  Users, 
  Globe, 
  BarChart3,
  FileText,
  Sparkles,
  Clock,
  Target,
  Layers,
  Zap,
  Edit3,
  Save,
  Menu,
  X,
  ChevronRight,
  PenTool,
  Lightbulb,
  MessageSquare,
  Hash,
  Bookmark,
  Search,
  Filter,
  Plus,
  TrendingUp,
  Calendar,
  Award,
  Coffee
} from 'lucide-react'
import { useAutoSave } from '@/hooks/useAutoSave'
import AutoSaveIndicator from '@/components/AutoSaveIndicator'
import ChapterList from '@/components/ChapterList'
import AIAssistant from '@/components/AIAssistant'
import QuickActions from '@/components/QuickActions'
import WritingProgress from '@/components/WritingProgress'

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
  status?: string
  isAIGenerated?: boolean
  createdAt: string
  updatedAt: string
}

interface WritingWorkspaceProps {
  novel: Novel
  onChapterSelect: (chapter: Chapter) => void
  onChapterEdit: (chapter: Chapter) => void
  onChapterDelete: (chapter: Chapter) => void
  onChapterReorder: (chapters: Chapter[]) => void
  generatingChapter?: string | null
}

export default function WritingWorkspace({
  novel,
  onChapterSelect,
  onChapterEdit,
  onChapterDelete,
  onChapterReorder,
  generatingChapter
}: WritingWorkspaceProps) {
  const [activeTab, setActiveTab] = useState<'chapters' | 'outline' | 'worldview' | 'characters'>('chapters')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [rightPanelCollapsed, setRightPanelCollapsed] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // 使用自动保存Hook
  const { savingStatus, save, hasUnsavedChanges } = useAutoSave(novel, {
    delay: 5000,
    onSave: async (currentNovel) => {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/novels/${novel.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(currentNovel)
      })
      
      if (!response.ok) {
        throw new Error('保存失败')
      }
      
      return response.json()
    }
  })

  const navigationItems = [
    { id: 'chapters', label: '章节管理', icon: FileText, count: novel.chapters?.length || 0 },
    { id: 'outline', label: '大纲结构', icon: Layers, count: 0 },
    { id: 'worldview', label: '世界观', icon: Globe, count: 0 },
    { id: 'characters', label: '角色管理', icon: Users, count: 0 },
  ]

  const quickActions = [
    { icon: Plus, label: '新建章节', color: 'blue' as const },
    { icon: Sparkles, label: 'AI生成', color: 'purple' as const },
    { icon: Edit3, label: '批量编辑', color: 'green' as const },
    { icon: Save, label: '导出文档', color: 'orange' as const },
  ]

  const getSavingStatus = () => {
    switch (savingStatus) {
      case 'saving':
        return { text: '保存中...', color: 'text-yellow-600', icon: Clock }
      case 'saved':
        return { text: '已保存', color: 'text-green-600', icon: Save }
      case 'error':
        return { text: '保存失败', color: 'text-red-600', icon: X }
      default:
        return { text: '就绪', color: 'text-gray-600', icon: Check }
    }
  }

  const status = getSavingStatus()
  const StatusIcon = status.icon

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden workspace-container">
      {/* 左侧导航栏 */}
      <div className={`${sidebarCollapsed ? 'w-16' : 'w-64'} bg-white border-r border-gray-200 flex flex-col transition-all duration-300 workspace-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        {/* 导航头部 */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {!sidebarCollapsed && (
              <div className="flex items-center gap-3">
                <BookOpen className="h-6 w-6 text-indigo-600" />
                <div>
                  <h2 className="font-semibold text-gray-900">创作中心</h2>
                  <p className="text-xs text-gray-500">{novel.title}</p>
                </div>
              </div>
            )}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* 导航菜单 */}
        <nav className="flex-1 p-4">
          <div className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center' : 'justify-between'} gap-3 px-3 py-2 rounded-lg transition-colors sidebar-nav-button ${
                    activeTab === item.id
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5" />
                    {!sidebarCollapsed && <span className="text-sm font-medium">{item.label}</span>}
                  </div>
                  {!sidebarCollapsed && item.count > 0 && (
                    <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full">
                      {item.count}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </nav>

        {/* 底部状态 */}
        {!sidebarCollapsed && (
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center gap-2 text-xs">
              <StatusIcon className={`h-3 w-3 ${status.color}`} />
              <span className={status.color}>{status.text}</span>
              {hasUnsavedChanges && (
                <span className="text-orange-600 ml-2">(未保存)</span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 主内容区 */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* 顶部工具栏 */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              {/* 搜索框 */}
              <div className="relative max-w-md flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="搜索章节..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              
              {/* 快速操作 */}
              <div className="quick-actions">
                <QuickActions actions={quickActions} />
              </div>
            </div>

            {/* 视图控制 */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setRightPanelCollapsed(!rightPanelCollapsed)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                title={rightPanelCollapsed ? '显示辅助面板' : '隐藏辅助面板'}
              >
                <Layers className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 内容区域 */}
        <div className="flex-1 overflow-auto">
          <div className="h-full">
            {activeTab === 'chapters' && (
              <div className="p-6">
                <div className="mb-6">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">章节管理</h1>
                  <p className="text-gray-600">管理小说章节，编辑内容，跟踪写作进度</p>
                </div>

                {/* 写作进度卡片 */}
                <WritingProgress 
                  novel={novel}
                  generatingChapter={generatingChapter}
                />

                {/* 章节列表 */}
                <div className="mt-6">
                  <ChapterList
                    chapters={novel.chapters || []}
                    onEditSummary={(chapter) => onChapterEdit(chapter)}
                    onEditContent={(chapter) => onChapterEdit(chapter)}
                    onAIGenerate={(chapter) => onChapterEdit(chapter)}
                    onDelete={onChapterDelete}
                    onView={onChapterSelect}
                    onReorder={onChapterReorder}
                    generatingChapter={generatingChapter}
                    novelId={novel.id}
                  />
                </div>
              </div>
            )}

            {activeTab === 'outline' && (
              <div className="p-6">
                <div className="mb-6">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">大纲结构</h1>
                  <p className="text-gray-600">规划小说的整体结构和情节发展</p>
                </div>
                
                <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                  <Layers className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">大纲编辑器</h3>
                  <p className="text-gray-600 mb-4">大纲编辑功能正在开发中...</p>
                  <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                    开始规划
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'worldview' && (
              <div className="p-6">
                <div className="mb-6">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">世界观设定</h1>
                  <p className="text-gray-600">构建小说的世界背景和设定</p>
                </div>
                
                <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                  <Globe className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">世界观编辑器</h3>
                  <p className="text-gray-600 mb-4">世界观设定功能正在开发中...</p>
                  <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                    构建世界
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'characters' && (
              <div className="p-6">
                <div className="mb-6">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">角色管理</h1>
                  <p className="text-gray-600">创建和管理小说中的角色</p>
                </div>
                
                <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                  <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">角色编辑器</h3>
                  <p className="text-gray-600 mb-4">角色管理功能正在开发中...</p>
                  <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                    创建角色
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 右侧AI助手面板 */}
      {!rightPanelCollapsed && (
        <div className={`w-80 bg-white border-l border-gray-200 flex flex-col workspace-right-panel`}>
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-600" />
                <h3 className="font-semibold text-gray-900">AI写作助手</h3>
              </div>
              <button
                onClick={() => setRightPanelCollapsed(true)}
                className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          <div className="flex-1 overflow-auto">
            <AIAssistant novel={novel} />
          </div>
        </div>
      )}

      {/* 自动保存指示器 */}
      <AutoSaveIndicator
        status={savingStatus}
        lastSavedTime={savingStatus === 'saved' ? new Date() : undefined}
        hasUnsavedChanges={hasUnsavedChanges}
        onManualSave={save}
      />
    </div>
  )
}

// 导入缺失的图标
const Check = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
)