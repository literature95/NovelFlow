'use client'

import { useState, useEffect, useCallback } from 'react'
import MDEditor from '@uiw/react-md-editor'
import { 
  BookOpen, 
  PenTool, 
  Layout, 
  FileText, 
  Layers, 
  Users, 
  Globe, 
  Settings, 
  Eye, 
  EyeOff, 
  Save, 
  RefreshCw, 
  Target, 
  Timer, 
  Brain, 
  Play, 
  ArrowUpDown, 
  Download, 
  Upload, 
  Plus, 
  Edit3, 
  Trash2, 
  Menu, 
  X, 
  ChevronRight, 
  ChevronLeft, 
  ChevronDown, 
  ChevronUp, 
  BarChart3, 
  Moon, 
  Sun
} from 'lucide-react'

// 接口定义
interface Novel {
  id: string
  title: string
  description?: string
  coverImage?: string
  createdAt: string
  updatedAt: string
  wordCount: number
  status: 'draft' | 'in-progress' | 'completed'
  chapters: Chapter[]
}

interface Chapter {
  id: string
  title: string
  content: string
  order: number
  wordCount: number
  createdAt: string
  updatedAt: string
}

interface Character {
  id: string
  name: string
  description?: string
  avatar?: string
  personality?: string
  role?: string
}

interface WorldSetting {
  id: string
  name: string
  description?: string
  category?: string
}

interface Outline {
  id: string
  title: string
  content: string
  order: number
}

interface WritingStats {
  wordsWritten: number
  timeSpent: number
  wordsPerMinute: number
  dailyProgress: number
  weeklyProgress: number
}

interface AISuggestion {
  id: string
  type: 'character' | 'plot' | 'description' | 'dialogue'
  content: string
}

/**
 * 创作中心组件
 * 提供沉浸式写作体验，包含章节管理、编辑器、AI辅助等功能
 */
const WritingCenter = () => {
  // 核心状态
  const [novels, setNovels] = useState<Novel[]>([])
  const [currentNovel, setCurrentNovel] = useState<Novel | null>(null)
  const [currentChapter, setCurrentChapter] = useState<Chapter | null>(null)
  const [characters, setCharacters] = useState<Character[]>([])
  const [worldSettings, setWorldSettings] = useState<WorldSetting[]>([])
  const [outline, setOutline] = useState<Outline[]>([])
  
  // 编辑器状态
  const [content, setContent] = useState<string>('')
  const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit')
  const [saving, setSaving] = useState<boolean>(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [autoSaveEnabled, setAutoSaveEnabled] = useState<boolean>(true)
  
  // UI状态
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true)
  const [rightPanelOpen, setRightPanelOpen] = useState<boolean>(true)
  const [rightPanelTab, setRightPanelTab] = useState<'characters' | 'world' | 'outline' | 'ai' | 'stats'>('ai')
  const [isFocusMode, setIsFocusMode] = useState<boolean>(false)
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false)
  
  // 创作工具状态
  const [wordCount, setWordCount] = useState<number>(0)
  const [writingGoal, setWritingGoal] = useState<number>(1000)
  const [timeRemaining, setTimeRemaining] = useState<number>(25 * 60) // 25分钟
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false)
  const [writingStats, setWritingStats] = useState<WritingStats>({
    wordsWritten: 0,
    timeSpent: 0,
    wordsPerMinute: 0,
    dailyProgress: 0,
    weeklyProgress: 0
  })
  
  // AI状态
  const [aiSuggestions, setAiSuggestions] = useState<AISuggestion[]>([])
  const [aiGenerating, setAiGenerating] = useState<boolean>(false)
  const [aiPrompt, setAiPrompt] = useState<string>('')
  
  /**
   * 加载示例数据
   */
  useEffect(() => {
    // 模拟小说数据
    const sampleNovels: Novel[] = [
      {
        id: '1',
        title: '奇幻之旅',
        description: '一段穿越魔法世界的冒险故事',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        wordCount: 12500,
        status: 'in-progress',
        chapters: [
          {
            id: '1',
            title: '第一章：神秘的传送门',
            content: '# 第一章：神秘的传送门\n\n在一个月黑风高的夜晚，年轻的主角陈云飞发现了一扇发光的传送门...\n\n这扇传送门散发着柔和的蓝色光芒，似乎连接着另一个世界。陈云飞犹豫了片刻，最终还是决定踏入这扇神秘的门。\n\n当他穿过传送门时，眼前出现了一个完全不同的世界。这里有高耸的魔法塔，飞翔的巨龙，还有各种奇异的生物。陈云飞意识到，他的冒险之旅正式开始了。',
            order: 1,
            wordCount: 2500,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: '2',
            title: '第二章：魔法学院',
            content: '# 第二章：魔法学院\n\n传送门的另一端是一座古老的魔法学院，陈云飞开始了他的学习生涯...\n\n魔法学院里有来自各个种族的学生，他们都在学习不同的魔法技能。陈云飞被分到了一个特殊的班级，遇到了他的导师和同学们。\n\n在学院里，陈云飞逐渐掌握了各种魔法技能，同时也发现了一个关于自己身世的秘密。',
            order: 2,
            wordCount: 3000,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        ]
      },
      {
        id: '2',
        title: '未来都市',
        description: '2147年，一座充满高科技的未来都市中的故事',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        wordCount: 8000,
        status: 'draft',
        chapters: []
      }
    ]
    
    // 模拟角色数据
    const sampleCharacters: Character[] = [
      {
        id: '1',
        name: '陈云飞',
        description: '年轻的冒险者，好奇心强，勇敢正直',
        personality: '乐观、勇敢、好奇心强',
        role: '主角'
      },
      {
        id: '2',
        name: '露娜',
        description: '神秘的魔法师，拥有强大的魔法能力',
        personality: '冷静、智慧、神秘',
        role: '女主角'
      }
    ]
    
    // 模拟世界观数据
    const sampleWorldSettings: WorldSetting[] = [
      {
        id: '1',
        name: '魔法王国',
        description: '一个充满魔法的神秘世界',
        category: '地点'
      },
      {
        id: '2',
        name: '魔法学院',
        description: '培养年轻魔法师的古老学院',
        category: '地点'
      }
    ]
    
    // 模拟大纲数据
    const sampleOutline: Outline[] = [
      {
        id: '1',
        title: '故事开端',
        content: '主角发现传送门，进入魔法世界',
        order: 1
      },
      {
        id: '2',
        title: '学习魔法',
        content: '主角在魔法学院学习基本魔法',
        order: 2
      }
    ]
    
    // 设置状态
    setNovels(sampleNovels)
    setCurrentNovel(sampleNovels[0])
    setCurrentChapter(sampleNovels[0].chapters[0])
    setContent(sampleNovels[0].chapters[0].content)
    setCharacters(sampleCharacters)
    setWorldSettings(sampleWorldSettings)
    setOutline(sampleOutline)
    setWordCount(countWords(sampleNovels[0].chapters[0].content))
  }, [])
  
  /**
   * 统计字数
   */
  const countWords = useCallback((text: string): number => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length
  }, [])
  
  /**
   * 内容变化处理
   */
  const handleContentChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value
    setContent(newContent)
    setWordCount(countWords(newContent))
  }, [countWords])
  
  /**
   * 保存功能
   */
  const handleSave = useCallback(async () => {
    try {
      setSaving(true)
      // 模拟保存到数据库
      await new Promise(resolve => setTimeout(resolve, 500))
      setLastSaved(new Date())
      
      // 更新当前章节内容
      if (currentChapter && currentNovel) {
        const updatedChapter = { ...currentChapter, content, wordCount }
        const updatedChapters = currentNovel.chapters.map(ch => 
          ch.id === updatedChapter.id ? updatedChapter : ch
        )
        const updatedNovel = {
          ...currentNovel,
          chapters: updatedChapters,
          wordCount: updatedChapters.reduce((sum, ch) => sum + ch.wordCount, 0)
        }
        setCurrentChapter(updatedChapter)
        setCurrentNovel(updatedNovel)
        
        // 更新novels列表
        setNovels(prev => prev.map(novel => 
          novel.id === updatedNovel.id ? updatedNovel : novel
        ))
      }
    } catch (error) {
      console.error('保存失败:', error)
    } finally {
      setSaving(false)
    }
  }, [content, wordCount, currentChapter, currentNovel])
  
  /**
   * 自动保存
   */
  useEffect(() => {
    if (autoSaveEnabled && content && currentChapter) {
      const timer = setTimeout(() => {
        handleSave()
      }, 30000) // 30秒自动保存
      
      return () => clearTimeout(timer)
    }
  }, [content, autoSaveEnabled, handleSave, currentChapter])
  
  /**
   * 计时器功能
   */
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null
    
    if (isTimerRunning && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining(prev => prev - 1)
      }, 1000)
    } else if (timeRemaining === 0) {
      setIsTimerRunning(false)
      // 时间到了的提示
      alert('专注时间结束！休息一下吧 😊')
    }
    
    return () => {
      if (timer) clearInterval(timer)
    }
  }, [isTimerRunning, timeRemaining])
  
  /**
   * 生成AI建议
   */
  const generateAISuggestion = useCallback(async () => {
    if (!aiPrompt.trim()) return
    
    try {
      setAiGenerating(true)
      // 模拟AI生成
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const newSuggestion: AISuggestion = {
        id: Date.now().toString(),
        type: 'plot',
        content: `根据你的提示："${aiPrompt}"，AI建议：\n\n在主角发现传送门后，可以引入一个神秘的向导角色，他知道传送门的秘密，但有自己的目的。这样可以增加故事的神秘感和冲突。`
      }
      
      setAiSuggestions(prev => [newSuggestion, ...prev].slice(0, 5))
      setAiPrompt('')
    } catch (error) {
      console.error('AI生成失败:', error)
    } finally {
      setAiGenerating(false)
    }
  }, [aiPrompt])
  
  /**
   * 应用AI建议
   */
  const applyAISuggestion = useCallback((suggestion: AISuggestion) => {
    setContent(prev => prev + '\n\n' + suggestion.content)
  }, [])
  
  /**
   * 切换专注模式
   */
  const toggleFocusMode = useCallback(() => {
    setIsFocusMode(prev => !prev)
  }, [])
  
  /**
   * 切换深色模式
   */
  const toggleDarkMode = useCallback(() => {
    setIsDarkMode(prev => !prev)
    document.documentElement.classList.toggle('dark')
  }, [])
  
  /**
   * 切换侧边栏
   */
  const toggleSidebar = useCallback(() => {
    setSidebarOpen(prev => !prev)
  }, [])
  
  /**
   * 切换右侧面板
   */
  const toggleRightPanel = useCallback(() => {
    setRightPanelOpen(prev => !prev)
  }, [])
  
  /**
   * 计算进度
   */
  const progress = Math.min((wordCount / writingGoal) * 100, 100)
  
  /**
   * 格式化时间
   */
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  
  return (
    <div className={`flex h-screen overflow-hidden ${isDarkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* 左侧边栏 */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-0'} bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 overflow-hidden flex flex-col`}>
        {/* 顶部标题 */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
          <h2 className="text-xl font-bold text-blue-600 dark:text-blue-400 flex items-center">
            <BookOpen className="mr-2" />
            我的小说
          </h2>
        </div>
        
        {/* 小说列表 */}
        <div className="p-2 overflow-y-auto flex-1">
          {novels.map(novel => (
            <div 
              key={novel.id}
              className={`p-3 rounded-lg cursor-pointer mb-2 transition-all ${currentNovel?.id === novel.id ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 shadow-sm' : 'hover:bg-gray-100 dark:hover:bg-gray-700/50'}`}
              onClick={() => {
                setCurrentNovel(novel)
                if (novel.chapters.length > 0) {
                  setCurrentChapter(novel.chapters[0])
                  setContent(novel.chapters[0].content)
                  setWordCount(countWords(novel.chapters[0].content))
                }
              }}
            >
              <div className="font-medium">{novel.title}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {novel.chapters.length} 章 • {novel.wordCount} 字
              </div>
            </div>
          ))}
          
          {/* 添加新小说 */}
          <div className="mt-4 p-3 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 cursor-pointer text-center transition-colors">
            <Plus className="mx-auto mb-2" />
            <div className="text-sm font-medium">新建小说</div>
          </div>
        </div>
        
        {/* 章节列表 */}
        {currentNovel && (
          <div className="p-2 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-sm flex items-center text-gray-700 dark:text-gray-300">
                <Layers className="mr-1 h-4 w-4" />
                章节列表
              </h3>
              <Plus className="h-4 w-4 text-gray-500 dark:text-gray-400 cursor-pointer hover:text-blue-500 dark:hover:text-blue-400" />
            </div>
            
            <div className="space-y-1 max-h-64 overflow-y-auto">
              {currentNovel.chapters.map(chapter => (
                <div 
                  key={chapter.id}
                  className={`p-2 rounded-md cursor-pointer transition-all text-sm ${currentChapter?.id === chapter.id ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200' : 'hover:bg-gray-100 dark:hover:bg-gray-700/50'}`}
                  onClick={() => {
                    setCurrentChapter(chapter)
                    setContent(chapter.content)
                    setWordCount(countWords(chapter.content))
                  }}
                >
                  <div className="flex items-center">
                    <span className="mr-2 text-xs text-gray-500 dark:text-gray-400">{chapter.order}</span>
                    <span>{chapter.title}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* 底部操作 */}
        <div className="p-2 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <button 
            onClick={toggleSidebar}
            className="w-full p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center text-sm text-gray-600 dark:text-gray-400"
          >
            {sidebarOpen ? <ChevronLeft className="h-4 w-4 mr-1" /> : <ChevronRight className="h-4 w-4 mr-1" />}
            {sidebarOpen ? '收起' : '展开'}菜单
          </button>
        </div>
      </div>
      
      {/* 主编辑区域 */}
      <div className={`flex-1 flex flex-col overflow-hidden ${isFocusMode ? 'ml-0' : ''}`}>
        {/* 顶部工具栏 */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-3 flex items-center justify-between shadow-sm">
          <div className="flex items-center space-x-2">
            <button 
              onClick={toggleSidebar}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {sidebarOpen ? <ChevronLeft /> : <Menu />}
            </button>
            
            <div className="flex items-center space-x-2">
              <PenTool className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <div>
                <div className="font-medium">{currentChapter?.title || '未命名章节'}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {currentNovel?.title || '未命名小说'} • 最后保存：{lastSaved?.toLocaleTimeString() || '从未'}
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* 字数统计 */}
            <div className="flex items-center space-x-1 px-3 py-1 rounded-lg bg-gray-100 dark:bg-gray-700">
              <FileText className="h-4 w-4 text-gray-600 dark:text-gray-300" />
              <span className="text-sm">{wordCount} 字</span>
            </div>
            
            {/* 保存按钮 */}
            <button 
              onClick={handleSave}
              disabled={saving}
              className="flex items-center space-x-1 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {saving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              <span className="text-sm">保存</span>
            </button>
            
            {/* 预览模式切换 */}
            <button 
              onClick={() => setViewMode(viewMode === 'edit' ? 'preview' : 'edit')}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {viewMode === 'edit' ? <Eye /> : <EyeOff />}
            </button>
            
            {/* 专注模式 */}
            <button 
              onClick={toggleFocusMode}
              className={`p-2 rounded-lg ${isFocusMode ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            >
              <Target className="h-4 w-4" />
            </button>
            
            {/* 深色模式 */}
            <button 
              onClick={toggleDarkMode}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          </div>
        </div>
        
        {/* 进度条 */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-3">
          <div className="flex items-center justify-between mb-1">
            <div className="text-sm">
              <span className="font-medium">今日目标：</span>
              <span>{wordCount} / {writingGoal} 字</span>
            </div>
            <div className="text-sm">{Math.round(progress)}%</div>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-500 ease-out" 
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        
        {/* 编辑器 */}
        <div className="flex-1 overflow-hidden">
          {viewMode === 'edit' ? (
            <div className="w-full h-full bg-white dark:bg-gray-900">
              <MDEditor
                value={content}
                onChange={(value) => {
                  if (value !== undefined) {
                    setContent(value)
                    setWordCount(countWords(value))
                  }
                }}
                height="100%"
                preview="edit"
                className="h-full"
                textareaProps={{
                  className: "text-lg leading-relaxed font-sans dark:text-white",
                  placeholder: "开始你的创作..."
                }}
                highlightEnable={true}
                enableScroll={false}
              />
            </div>
          ) : (
            <div className="w-full h-full p-8 overflow-y-auto bg-white dark:bg-gray-900 dark:text-white">
              <MDEditor.Markdown
                source={content}
                className="prose dark:prose-invert max-w-none"
              />
            </div>
          )}
        </div>
        
        {/* 底部状态栏 */}
        <div className="bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-2 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center justify-between">
            <div>NovelFlow 创作中心</div>
            <div className="flex items-center space-x-4">
              <span>自动保存 {autoSaveEnabled ? '已开启' : '已关闭'}</span>
              <button 
                onClick={() => setAutoSaveEnabled(!autoSaveEnabled)}
                className="hover:text-blue-600 dark:hover:text-blue-400"
              >
                {autoSaveEnabled ? '关闭' : '开启'}自动保存
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* 右侧面板 */}
      <div className={`${rightPanelOpen ? 'w-80' : 'w-0'} bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 transition-all duration-300 overflow-hidden flex flex-col`}>
        {/* 面板标签 */}
        <div className="p-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex space-x-1 overflow-x-auto">
          <button 
            onClick={() => setRightPanelTab('ai')}
            className={`px-3 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-all ${rightPanelTab === 'ai' ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 shadow-sm' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
          >
            <Brain className="inline-block h-3 w-3 mr-1" />
            AI辅助
          </button>
          <button 
            onClick={() => setRightPanelTab('characters')}
            className={`px-3 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-all ${rightPanelTab === 'characters' ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 shadow-sm' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
          >
            <Users className="inline-block h-3 w-3 mr-1" />
            角色管理
          </button>
          <button 
            onClick={() => setRightPanelTab('world')}
            className={`px-3 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-all ${rightPanelTab === 'world' ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 shadow-sm' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
          >
            <Globe className="inline-block h-3 w-3 mr-1" />
            世界观
          </button>
          <button 
            onClick={() => setRightPanelTab('outline')}
            className={`px-3 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-all ${rightPanelTab === 'outline' ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 shadow-sm' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
          >
            <Layout className="inline-block h-3 w-3 mr-1" />
            大纲
          </button>
          <button 
            onClick={() => setRightPanelTab('stats')}
            className={`px-3 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-all ${rightPanelTab === 'stats' ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 shadow-sm' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
          >
            <BarChart3 className="inline-block h-3 w-3 mr-1" />
            统计
          </button>
        </div>
        
        {/* 面板内容 */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* AI辅助 */}
          {rightPanelTab === 'ai' && (
            <div>
              <div className="mb-4">
                <h3 className="font-medium mb-2 text-sm flex items-center">
                  <Brain className="h-4 w-4 mr-1 text-blue-600 dark:text-blue-400" />
                  AI生成建议
                </h3>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && generateAISuggestion()}
                    placeholder="输入你的提示..."
                    className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                  <button 
                    onClick={generateAISuggestion}
                    disabled={aiGenerating}
                    className="px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
                  >
                    {aiGenerating ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2 text-sm">AI建议列表</h3>
                <div className="space-y-3">
                  {aiSuggestions.map(suggestion => (
                    <div key={suggestion.id} className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 text-sm">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-blue-600 dark:text-blue-400 capitalize">{suggestion.type}</span>
                        <button 
                          onClick={() => applyAISuggestion(suggestion)}
                          className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          应用
                        </button>
                      </div>
                      <div className="text-sm whitespace-pre-wrap">{suggestion.content}</div>
                    </div>
                  ))}
                  
                  {aiSuggestions.length === 0 && (
                    <div className="text-center text-sm text-gray-500 dark:text-gray-400 py-6 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      暂无AI建议，输入提示获取建议
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {/* 角色管理 */}
          {rightPanelTab === 'characters' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-sm flex items-center">
                  <Users className="h-4 w-4 mr-1 text-blue-600 dark:text-blue-400" />
                  角色列表
                </h3>
                <Plus className="h-4 w-4 text-gray-500 dark:text-gray-400 cursor-pointer hover:text-blue-500 dark:hover:text-blue-400" />
              </div>
              
              <div className="space-y-3">
                {characters.map(character => (
                  <div key={character.id} className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600">
                    <div className="font-medium text-sm flex items-center justify-between">
                      <span>{character.name}</span>
                      <span className="text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 rounded-full capitalize">{character.role}</span>
                    </div>
                    {character.description && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                        {character.description}
                      </div>
                    )}
                    {character.personality && (
                      <div className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                        <span className="font-medium">性格：</span>{character.personality}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* 世界观 */}
          {rightPanelTab === 'world' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-sm flex items-center">
                  <Globe className="h-4 w-4 mr-1 text-blue-600 dark:text-blue-400" />
                  世界观设定
                </h3>
                <Plus className="h-4 w-4 text-gray-500 dark:text-gray-400 cursor-pointer hover:text-blue-500 dark:hover:text-blue-400" />
              </div>
              
              <div className="space-y-3">
                {worldSettings.map(setting => (
                  <div key={setting.id} className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600">
                    <div className="font-medium text-sm flex items-center justify-between">
                      <span>{setting.name}</span>
                      {setting.category && (
                        <span className="text-xs px-2 py-0.5 bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200 rounded-full capitalize">{setting.category}</span>
                      )}
                    </div>
                    {setting.description && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {setting.description}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* 大纲 */}
          {rightPanelTab === 'outline' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-sm flex items-center">
                  <Layout className="h-4 w-4 mr-1 text-blue-600 dark:text-blue-400" />
                  故事大纲
                </h3>
                <Plus className="h-4 w-4 text-gray-500 dark:text-gray-400 cursor-pointer hover:text-blue-500 dark:hover:text-blue-400" />
              </div>
              
              <div className="space-y-3">
                {outline.map(item => (
                  <div key={item.id} className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600">
                    <div className="font-medium text-sm flex items-center">
                      <span className="text-xs mr-2 text-gray-500 dark:text-gray-400">{item.order}.</span>
                      <span>{item.title}</span>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {item.content}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* 统计 */}
          {rightPanelTab === 'stats' && (
            <div>
              <div className="mb-4">
                <h3 className="font-medium mb-2 text-sm flex items-center">
                  <BarChart3 className="h-4 w-4 mr-1 text-blue-600 dark:text-blue-400" />
                  写作统计
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 text-center">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{wordCount}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">总字数</div>
                  </div>
                  <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 text-center">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">{Math.round(progress)}%</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">完成度</div>
                  </div>
                </div>
              </div>
              
              <div className="mb-4">
                <h3 className="font-medium mb-2 text-sm">专注计时器</h3>
                <div className="flex items-center justify-center space-x-2 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 p-3 rounded-lg">
                  <div className="text-2xl font-bold">{formatTime(timeRemaining)}</div>
                  <button 
                    onClick={() => setIsTimerRunning(!isTimerRunning)}
                    className="p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                  >
                    {isTimerRunning ? <Timer className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </button>
                  <button 
                    onClick={() => setTimeRemaining(25 * 60)}
                    className="p-2 rounded-lg bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2 text-sm">写作趋势</h3>
                <div className="h-32 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg flex items-end justify-around p-2">
                  {/* 模拟柱状图 */}
                  {[60, 80, 40, 90, 70, 85, 95].map((height, index) => (
                    <div 
                      key={index} 
                      className="w-8 bg-gradient-to-t from-blue-500 to-indigo-600 rounded-t-lg transition-all duration-500"
                      style={{ height: `${height}%` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* 面板底部 */}
        <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex justify-between items-center">
          <button 
            onClick={toggleRightPanel}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center text-sm text-gray-600 dark:text-gray-400"
          >
            {rightPanelOpen ? <ChevronLeft className="h-4 w-4 mr-1" /> : <ChevronRight className="h-4 w-4 mr-1" />}
            {rightPanelOpen ? '收起' : '展开'}面板
          </button>
          
          <div className="flex space-x-2">
            <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400">
              <Download className="h-4 w-4" />
            </button>
            <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400">
              <Upload className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WritingCenter