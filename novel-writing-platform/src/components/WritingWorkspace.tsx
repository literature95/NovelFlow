'use client'

import { useState, useEffect } from 'react'
import { 
  BookOpen, 
  Users, 
  Globe, 
  FileText,
  Clock,
  Layers,
  Edit3,
  Save,
  Menu,
  ChevronRight,
  Plus,
  X
} from 'lucide-react'
import { useAutoSave } from '@/hooks/useAutoSave'
import AutoSaveIndicator from '@/components/AutoSaveIndicator'
import ChapterListEnhanced from '@/components/ChapterListEnhanced'


interface Character {
  id: string
  name: string
  description?: string
  traits?: string
  createdAt: string
}

interface Novel {
  id: string
  title: string
  description?: string
  outline?: string
  worldSetting?: string
  protagonist?: string
  chapters?: Chapter[]
  characters?: Character[]
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
  const [activeTab, setActiveTab] = useState<string>('outline')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [localNovel, setLocalNovel] = useState<Novel>(novel)
  
  // 动态导航项列表
  const [navItems, setNavItems] = useState([
    { id: 'outline', name: '大纲', icon: 'file-text' },
    { id: 'characters', name: '角色', icon: 'users' },
    { id: 'worldview', name: '世界观', icon: 'globe' },
    { id: 'summary', name: '小说简介', icon: 'info' }
  ])
  
  // 右键菜单状态
  const [showContextMenu, setShowContextMenu] = useState(false)
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 })
  const [selectedItem, setSelectedItem] = useState<{
    id: string;
    name: string;
    icon: string;
  } | null>(null)

  // 使用自动保存Hook
  const { savingStatus, save, hasUnsavedChanges } = useAutoSave(localNovel, {
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
      
      const updatedNovel = await response.json()
      setLocalNovel(updatedNovel)
      return updatedNovel
    }
  })

  // 当外部novel变化时更新本地状态
  useEffect(() => {
    setLocalNovel(novel)
  }, [novel])
  
  // 处理右键菜单显示
  const handleContextMenu = (e: React.MouseEvent, item: {
    id: string;
    name: string;
    icon: string;
  }) => {
    e.preventDefault()
    setShowContextMenu(true)
    setContextMenuPosition({ x: e.clientX, y: e.clientY })
    setSelectedItem(item)
  }
  
  // 关闭右键菜单
  const closeContextMenu = () => {
    setShowContextMenu(false)
    setSelectedItem(null)
  }
  
  // 重命名功能
  const handleRename = () => {
    if (!selectedItem) return
    
    // 根据不同的导航项类型执行重命名逻辑
    switch (selectedItem.id) {
      case 'outline':
        console.log(`重命名大纲`)
        // 大纲重命名逻辑
        break
      case 'characters':
        console.log(`重命名角色管理`)
        // 角色管理重命名逻辑
        break
      case 'worldview':
        console.log(`重命名世界观`)
        // 世界观重命名逻辑
        break
      case 'summary':
        console.log(`重命名小说简介`)
        // 小说简介重命名逻辑
        break
      default:
        break
    }
    
    closeContextMenu()
  }
  
  // 删除功能
  const handleDelete = () => {
    if (!selectedItem) return
    
    // 删除导航项本身
    const updatedNavItems = navItems.filter(item => item.id !== selectedItem.id)
    setNavItems(updatedNavItems)
    
    // 如果删除的是当前激活项，切换到第一个导航项
    if (activeTab === selectedItem.id && updatedNavItems.length > 0) {
      setActiveTab(updatedNavItems[0].id)
    }
    
    console.log(`删除导航项: ${selectedItem.name}`)
    closeContextMenu()
  }
  
  // 点击页面其他地方关闭右键菜单
  useEffect(() => {
    const handleClick = () => closeContextMenu()
    window.addEventListener('click', handleClick)
    return () => window.removeEventListener('click', handleClick)
  }, [])

  const navigationItems = [
    { id: 'chapters', label: '章节管理', icon: FileText, count: localNovel.chapters?.length || 0 },
    { id: 'outline', label: '大纲结构', icon: Layers, count: 0 },
    { id: 'worldview', label: '世界观', icon: Globe, count: 0 },
    { id: 'characters', label: '角色管理', icon: Users, count: localNovel.characters?.length || 0 },
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
        return { text: '就绪', color: 'text-gray-600', icon: Save }
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
                  onClick={() => setActiveTab(item.id as 'chapters' | 'outline' | 'worldview' | 'characters')}
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


        {/* 内容区域 */}
        <div className="flex-1 overflow-auto">
          <div className="h-full">
            {activeTab === 'chapters' && (
              <div className="p-6">
                <div className="mb-6">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">章节管理</h1>
                  <p className="text-gray-600">管理小说章节，编辑内容，跟踪写作进度</p>
                </div>



                {/* 章节列表 */}
                <div className="mt-6">
                  <ChapterListEnhanced
                    novelId={novel.id}
                    chapters={(novel.chapters || []).map(chapter => ({
                      id: chapter.id,
                      title: chapter.title,
                      summary: chapter.summary,
                      content: chapter.content,
                      order: chapter.order,
                      status: chapter.status || 'draft',
                      isAIGenerated: chapter.isAIGenerated || false
                    }))}
                    onChapterSelect={(chapter) => onChapterSelect({
                      ...chapter,
                      createdAt: '',
                      updatedAt: ''
                    })}
                    onChapterEdit={(chapter) => onChapterEdit({
                      ...chapter,
                      createdAt: '',
                      updatedAt: ''
                    })}
                    onAIGenerate={(chapter) => onChapterEdit({
                      ...chapter,
                      createdAt: '',
                      updatedAt: ''
                    })}
                    onChapterDelete={(chapter) => onChapterDelete({
                      ...chapter,
                      createdAt: '',
                      updatedAt: ''
                    })}
                    onChapterExport={(chapter) => {
                      // 章节导出功能实现
                      const exportContent = `${chapter.title}\n\n${chapter.summary || ''}\n\n${chapter.content || ''}`;
                      const blob = new Blob([exportContent], { type: 'text/plain;charset=utf-8' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `${chapter.title.replace(/[^\w\s]/gi, '')}.txt`;
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                      URL.revokeObjectURL(url);
                    }}
                  />
                </div>
              </div>
            )}

            {activeTab === 'outline' && (
              <div className="p-6 h-full">
                <div className="mb-6">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">大纲结构</h1>
                  <p className="text-gray-600">规划小说的整体结构和情节发展</p>
                </div>
                
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden h-[calc(100vh-180px)] flex">
                  {/* 左侧导航 */}
                  <div className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col">
                    <div className="p-4 border-b border-gray-200">
                      <div className="flex items-center space-x-2">
                        <div className="font-medium text-gray-900">小说</div>
                        <div className="ml-auto flex items-center space-x-1">
                          {/* 导入按钮 */}
                          <button 
                            className="p-1 text-gray-600 hover:bg-gray-200 rounded transition-colors" 
                            title="导入"
                            onClick={() => {
                              // 创建隐藏的文件输入元素
                              const fileInput = document.createElement('input')
                              fileInput.type = 'file'
                              fileInput.accept = '.md,.txt'
                              fileInput.onchange = (e: Event) => {
                                const file = (e.target as HTMLInputElement).files?.[0]
                                if (file) {
                                  const reader = new FileReader()
                                  reader.onload = (event) => {
                                    const content = event.target?.result as string
                                    setLocalNovel(prev => ({
                                      ...prev,
                                      outline: content
                                    }))
                                    alert('导入成功!')
                                  }
                                  reader.readAsText(file, 'utf-8')
                                }
                              }
                              fileInput.click()
                            }}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                          </button>
                          
                          {/* 导出按钮 */}
                          <button 
                            className="p-1 text-gray-600 hover:bg-gray-200 rounded transition-colors" 
                            title="导出"
                            onClick={() => {
                              if (!localNovel.outline) {
                                alert('大纲内容为空，无法导出!')
                                return
                              }
                              
                              // 创建Blob对象
                              const blob = new Blob([localNovel.outline], { type: 'text/markdown;charset=utf-8' })
                              const url = URL.createObjectURL(blob)
                              const a = document.createElement('a')
                              a.href = url
                              a.download = `${localNovel.title || '小说大纲'}.md`
                              document.body.appendChild(a)
                              a.click()
                              document.body.removeChild(a)
                              URL.revokeObjectURL(url)
                            }}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex-1 overflow-auto p-2">
                      <div className="space-y-1">
                        {/* 动态导航项 */}
                        {navItems.map((item) => (
                          <div 
                            key={item.id}
                            className={`px-3 py-2 text-sm rounded cursor-pointer transition-colors flex items-center space-x-2 ${
                              activeTab === item.id 
                                ? 'bg-blue-100 text-blue-700' 
                                : 'hover:bg-gray-200 text-gray-700'
                            }`}
                            onClick={() => {
                              // 点击导航项切换内容
                              console.log(`切换到 ${item.name}`)
                              setActiveTab(item.id)
                            }}
                            onContextMenu={(e) => handleContextMenu(e, item)}
                          >
                            {item.icon === 'file-text' && (
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                            )}
                            {item.icon === 'users' && (
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                            )}
                            {item.icon === 'globe' && (
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                            )}
                            {item.icon === 'info' && (
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                            )}
                            <span>{item.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* 添加导航项按钮 */}
                    <div className="p-2 border-t border-gray-200">
                      <button
                        className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-green-600 hover:bg-green-50 rounded transition-colors"
                        onClick={() => {
                          // 添加新导航项
                          const newId = `custom-${Date.now()}`
                          const newItem = { id: newId, name: `新项${navItems.length + 1}`, icon: 'info' }
                          setNavItems(prev => [...prev, newItem])
                              setActiveTab(newId)
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                        <span>增加项</span>
                      </button>
                    </div>
                    
                    {/* 右键菜单 */}
                    {showContextMenu && (
                      <div 
                        className="fixed z-50 bg-white border border-gray-200 rounded-md shadow-lg p-1" 
                        style={{ 
                          left: `${contextMenuPosition.x}px`, 
                          top: `${contextMenuPosition.y}px` 
                        }}
                      >
                        <button 
                          className="w-full text-left px-3 py-1.5 text-sm hover:bg-gray-100 rounded transition-colors flex items-center space-x-2"
                          onClick={handleRename}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                          <span>重命名</span>
                        </button>
                        <button 
                          className="w-full text-left px-3 py-1.5 text-sm hover:bg-gray-100 rounded transition-colors flex items-center space-x-2 text-red-600"
                          onClick={handleDelete}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                          <span>删除</span>
                        </button>
                      </div>
                    )}
                  </div>
                  
                  {/* 右侧编辑区域 */}
                  <div className="flex-1 flex flex-col">
                    <div className="flex-1 overflow-auto bg-white">
                      <textarea
                        value={localNovel.outline || ''}
                        onChange={(e) => {
                          setLocalNovel(prev => ({
                            ...prev,
                            outline: e.target.value
                          }))
                        }}
                        placeholder="在这里编写你的小说大纲...\n\n示例：\n## 大纲\n\n1. 陈云飞获得石中剑，开启游戏之旅\n2. 传说的阴曹郡无从寻找，玩家需要准备食物\n3. 仙草宗主要求陈云飞带着徒弟炼制九转还魂丹\n\n## 第二卷\n\n山城郡守对飞云门所在的东岭地区展开调查..."
                        className="w-full h-full p-8 border-0 focus:ring-0 font-serif text-base resize-none"
                        style={{ lineHeight: '1.8' }}
                      />
                    </div>
                    
                    {/* 底部状态栏 */}
                    <div className="p-2 border-t border-gray-200 text-xs text-gray-500 flex justify-between bg-gray-50">
                      <div>
                        {localNovel.outline ? `${localNovel.outline.length} 字符` : '0 字符'}
                      </div>
                      <div className="flex items-center space-x-2">
                        {hasUnsavedChanges && <span className="text-orange-600">未保存</span>}
                        {savingStatus === 'saving' && <span className="text-blue-600">保存中...</span>}
                        {savingStatus === 'saved' && <span className="text-green-600">已保存</span>}
                        {savingStatus === 'error' && <span className="text-red-600">保存失败</span>}
                      </div>
                    </div>
                  </div>
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

            {activeTab === 'summary' && (
              <div className="p-6 h-full">
                <div className="mb-6">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">小说简介</h1>
                  <p className="text-gray-600">编辑小说的基本信息和简介</p>
                </div>
                
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden h-[calc(100vh-180px)] flex">
                  <div className="flex-1 overflow-auto bg-white">
                    <textarea
                      value={localNovel.description || ''}
                      onChange={(e) => {
                        setLocalNovel(prev => ({
                          ...prev,
                          description: e.target.value
                        }))
                      }}
                      placeholder="在这里编写你的小说简介..."
                      className="w-full h-full p-8 border-0 focus:ring-0 font-serif text-base resize-none"
                      style={{ lineHeight: '1.8' }}
                    />
                  </div>
                  
                  <div className="p-2 border-t border-gray-200 text-xs text-gray-500 flex justify-between bg-gray-50">
                    <div>
                      {localNovel.description ? `${localNovel.description.length} 字符` : '0 字符'}
                    </div>
                    <div className="flex items-center space-x-2">
                      {hasUnsavedChanges && <span className="text-orange-600">未保存</span>}
                      {savingStatus === 'saving' && <span className="text-blue-600">保存中...</span>}
                      {savingStatus === 'saved' && <span className="text-green-600">已保存</span>}
                      {savingStatus === 'error' && <span className="text-red-600">保存失败</span>}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'characters' && (
              <div className="p-6">
                <div className="mb-6">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">角色管理</h1>
                  <p className="text-gray-600">创建和管理小说中的角色</p>
                </div>
                
                {/* 角色管理内容 */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  {/* 顶部操作栏 */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-2">
                      <Users className="h-6 w-6 text-indigo-600" />
                      <h2 className="text-lg font-semibold text-gray-900">角色列表</h2>
                      <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 text-xs rounded-full">
                        {localNovel.characters?.length || 0} 个角色
                      </span>
                    </div>
                    
                    {/* 创建角色按钮 */}
                    <button
                      onClick={() => {
                        // 跳转到角色创建页面
                        window.location.href = `/dashboard/novels/${localNovel.id}/characters/create`;
                      }}
                      className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      创建角色
                    </button>
                  </div>
                  
                  {/* 角色列表 */}
                  {localNovel.characters && localNovel.characters.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {localNovel.characters.map((character: Character) => (
                        <div 
                          key={character.id} 
                          className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                <Users className="h-5 w-5 text-indigo-600" />
                              </div>
                              <div>
                                <h3 className="font-medium text-gray-900">{character.name}</h3>
                                <p className="text-xs text-gray-500">
                                  创建于 {new Date(character.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              {/* 查看/编辑按钮 */}
                              <button
                                onClick={() => {
                                  window.location.href = `/dashboard/novels/${localNovel.id}/characters/${character.id}/edit`;
                                }}
                                className="p-1.5 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                              >
                                <Edit3 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                          
                          {/* 角色描述 */}
                          {character.description && (
                            <p className="mt-3 text-sm text-gray-600 line-clamp-2">
                              {character.description}
                            </p>
                          )}
                          
                          {/* 角色特征 */}
                          {character.traits && JSON.parse(character.traits) && Object.keys(JSON.parse(character.traits)).length > 0 && (
                            <div className="mt-3">
                              <div className="text-xs font-medium text-gray-700 mb-1">特征</div>
                              <div className="flex flex-wrap gap-2">
                                {Array.from(Object.entries(JSON.parse(character.traits))).map(([key, value]) => {
                                  if (value && typeof value !== 'object') {
                                    return (
                                      <span 
                                        key={key} 
                                        className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full"
                                      >
                                        {key}: {String(value)}
                                      </span>
                                    );
                                  }
                                  return null;
                                }).filter(Boolean)}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10">
                      <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">还没有角色</h3>
                      <p className="text-gray-600 mb-6">开始创建你的第一个角色吧</p>
                      <button
                        onClick={() => {
                          window.location.href = `/dashboard/novels/${localNovel.id}/characters/create`;
                        }}
                        className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        创建第一个角色
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* 动态导航项内容 - 只显示自定义添加的导航项 */}
            {!['chapters', 'outline', 'worldview', 'characters', 'summary'].includes(activeTab) && navItems.some(item => item.id === activeTab) && (
              <div className="p-6 h-full">
                <div className="mb-6">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    {navItems.find(item => item.id === activeTab)?.name || '动态内容'}
                  </h1>
                  <p className="text-gray-600">编辑你的动态内容...</p>
                </div>
                
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden h-[calc(100vh-180px)] flex">
                  <div className="flex-1 overflow-auto bg-white">
                    <textarea
                      value={localNovel.outline || ''}
                      onChange={(e) => {
                        setLocalNovel(prev => ({
                          ...prev,
                          outline: e.target.value
                        }))
                      }}
                      placeholder={`在这里编写你的${navItems.find(item => item.id === activeTab)?.name || '内容'}...`}
                      className="w-full h-full p-8 border-0 focus:ring-0 font-serif text-base resize-none"
                      style={{ lineHeight: '1.8' }}
                    />
                  </div>
                  
                  {/* 底部状态栏 */}
                  <div className="p-2 border-t border-gray-200 text-xs text-gray-500 flex justify-between bg-gray-50">
                    <div>
                      {localNovel.outline ? `${localNovel.outline.length} 字符` : '0 字符'}
                    </div>
                    <div className="flex items-center space-x-2">
                      {hasUnsavedChanges && <span className="text-orange-600">未保存</span>}
                      {savingStatus === 'saving' && <span className="text-blue-600">保存中...</span>}
                      {savingStatus === 'saved' && <span className="text-green-600">已保存</span>}
                      {savingStatus === 'error' && <span className="text-red-600">保存失败</span>}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>



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