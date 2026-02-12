'use client'

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { 
  Maximize2, 
  Minimize2, 
  Save, 
  RefreshCw, 
  Eye, 
  EyeOff,
  Monitor,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Timer,
  Target,
  TrendingUp,
  Pause,
  Play,
  RotateCcw,
  Coffee,
  Brain,
  Zap,
  Wind,
  Settings,
  HelpCircle,
  X,
  ChevronUp,
  ChevronDown,
  Type,
  Clock
} from 'lucide-react'

interface ImmersiveEditorProps {
  initialContent: string
  onSave: (content: string) => Promise<void>
  onExit: () => void
  writingGoal?: number
  focusTime?: number // 专注时间（分钟）
  enableTypingSound?: boolean
}

interface WritingStats {
  wordsWritten: number
  timeSpent: number
  wordsPerMinute: number
  sessionsCompleted: number
  currentStreak: number
}

// 防抖函数
function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null;
  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func(...args);
      timeoutId = null;
    }, delay);
  };
}

export default function ImmersiveEditor({
  initialContent,
  onSave,
  onExit,
  writingGoal = 1000,
  focusTime = 25,
  enableTypingSound = false
}: ImmersiveEditorProps) {
  const [content, setContent] = useState(initialContent)
  const [wordCount, setWordCount] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isFocusMode, setIsFocusMode] = useState(true)
  const [isWriting, setIsWriting] = useState(false)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(focusTime * 60)
  const [sessionTime, setSessionTime] = useState(0)
  const [showStats, setShowStats] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true)
  const [soundEnabled, setSoundEnabled] = useState(enableTypingSound)
  const [fontSize, setFontSize] = useState(18)
  const [lineHeight, setLineHeight] = useState(1.6)
  const [saving, setSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [writingGoalState, setWritingGoalState] = useState(writingGoal)
  const [focusTimeState, setFocusTimeState] = useState(focusTime)
  
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const sessionTimerRef = useRef<NodeJS.Timeout | null>(null)
  const autoSaveRef = useRef<NodeJS.Timeout | null>(null) // 保留以兼容其他地方
  // 计算写作统计
  const calculateStats = useCallback((): WritingStats => {
    const words = content.trim().split(/\s+/).filter(word => word.length > 0).length
    const wpm = sessionTime > 0 ? Math.round((words / sessionTime) * 60) : 0
    
    return {
      wordsWritten: words,
      timeSpent: sessionTime,
      wordsPerMinute: wpm,
      sessionsCompleted: 1,
      currentStreak: 1
    }
  }, [content, sessionTime])

  // 使用useMemo优化统计计算
  const stats = useMemo(() => {
    return calculateStats()
  }, [calculateStats])

  const progress = useMemo(() => {
    return Math.min((stats.wordsWritten / writingGoalState) * 100, 100)
  }, [stats.wordsWritten, writingGoalState])

  // 使用防抖优化自动保存
  const debouncedAutoSave = useCallback(
    debounce(async (saveContent: string) => {
      await onSave(saveContent)
      setLastSaved(new Date())
    }, 30000), // 30秒自动保存
    [onSave]
  )

  useEffect(() => {
    setWordCount(stats.wordsWritten)
  }, [stats.wordsWritten])

  useEffect(() => {
    // 专注模式计时器
    if (isTimerRunning && timeRemaining > 0) {
      timerRef.current = setTimeout(() => {
        setTimeRemaining(prev => prev - 1)
      }, 1000)
    } else if (timeRemaining === 0 && isTimerRunning) {
      // 时间到了，播放提示音
      playNotificationSound()
      setIsTimerRunning(false)
      alert('专注时间结束！休息一下吧 😊')
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [isTimerRunning, timeRemaining])

  useEffect(() => {
    // 会话计时器
    if (isWriting) {
      sessionTimerRef.current = setInterval(() => {
        setSessionTime(prev => prev + 1)
      }, 1000)
    } else {
      if (sessionTimerRef.current) {
        clearInterval(sessionTimerRef.current)
      }
    }

    return () => {
      if (sessionTimerRef.current) {
        clearInterval(sessionTimerRef.current)
      }
    }
  }, [isWriting])

  useEffect(() => {
    // 自动保存
    if (autoSaveEnabled && content !== initialContent) {
      debouncedAutoSave(content)
    }
  }, [content, autoSaveEnabled, initialContent, debouncedAutoSave])

  // 清理防抖函数
  useEffect(() => {
    return () => {
      // 防抖函数内部会清理，这里不需要额外清理
    }
  }, [debouncedAutoSave])

  useEffect(() => {
    // 全屏控制
    if (isFullscreen) {
      document.documentElement.requestFullscreen?.()
    } else {
      document.exitFullscreen?.()
    }
  }, [isFullscreen])

  // 自动保存已通过debouncedAutoSave函数实现

  const handleManualSave = async () => {
    try {
      setSaving(true)
      await onSave(content)
      setLastSaved(new Date())
    } catch (error) {
      console.error('保存失败:', error)
      alert('保存失败，请重试')
    } finally {
      setSaving(false)
    }
  }

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value
    setContent(newContent)
    
    if (!isWriting && newContent.trim()) {
      setIsWriting(true)
      startFocusTimer()
    }

    // 播放打字音效
    if (soundEnabled) {
      playTypingSound()
    }
  }

  const startFocusTimer = () => {
    setIsTimerRunning(true)
    setTimeRemaining(focusTimeState * 60)
  }

  const pauseTimer = () => {
    setIsTimerRunning(false)
  }

  const resetTimer = () => {
    setIsTimerRunning(false)
    setTimeRemaining(focusTimeState * 60)
  }

  const playTypingSound = () => {
    if (!soundEnabled) return
    
    // 创建简单的打字音效
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)
    
    oscillator.frequency.value = 800
    oscillator.type = 'sine'
    gainNode.gain.value = 0.1
    
    oscillator.start()
    oscillator.stop(audioContext.currentTime + 0.01)
  }

  const playNotificationSound = () => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)
    
    oscillator.frequency.value = 523.25 // C5音符
    oscillator.type = 'sine'
    gainNode.gain.value = 0.3
    
    oscillator.start()
    oscillator.stop(audioContext.currentTime + 0.2)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleExit = async () => {
    if (content !== initialContent) {
      const confirmed = window.confirm('内容有未保存的更改，确定要退出吗？')
      if (!confirmed) return
    }
    
    await handleManualSave()
    onExit()
  }

  // stats和progress已通过useMemo计算

  return (
    <div className={`h-screen flex flex-col ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      {/* 顶部控制栏 */}
      <div className={`flex items-center justify-between px-4 py-3 border-b ${isDarkMode ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-gray-50'}`}>
        <div className="flex items-center space-x-4">
          {/* 退出按钮 */}
          <button
            onClick={handleExit}
            className={`flex items-center px-3 py-1.5 rounded-lg transition-colors ${
              isDarkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-200 text-gray-600'
            }`}
          >
            <X className="h-4 w-4 mr-2" />
            退出沉浸式
          </button>

          {/* 写作状态 */}
          <div className="flex items-center space-x-3">
            <div className={`flex items-center text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {isWriting ? (
                <>
                  <Play className="h-4 w-4 mr-1 text-green-500" />
                  写作中
                </>
              ) : (
                <>
                  <Pause className="h-4 w-4 mr-1 text-yellow-500" />
                  暂停
                </>
              )}
            </div>
            
            {saving && (
              <div className="flex items-center text-sm text-blue-600">
                <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                保存中...
              </div>
            )}
            
            {lastSaved && !saving && (
              <div className="flex items-center text-sm text-green-600">
                <Save className="h-4 w-4 mr-1" />
                已保存 {lastSaved.toLocaleTimeString()}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* 专注模式控制 */}
          <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
            <Timer className={`h-4 w-4 ${isTimerRunning ? 'text-green-500' : 'text-gray-500'}`} />
            <span className="text-sm font-mono">
              {formatTime(timeRemaining)}
            </span>
            <button
              onClick={isTimerRunning ? pauseTimer : startFocusTimer}
              className="p-1 hover:bg-gray-600 rounded transition-colors"
            >
              {isTimerRunning ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
            </button>
            <button
              onClick={resetTimer}
              className="p-1 hover:bg-gray-600 rounded transition-colors"
            >
              <RotateCcw className="h-3 w-3" />
            </button>
          </div>

          {/* 快捷功能 */}
          <button
            onClick={() => setShowStats(!showStats)}
            className={`p-2 rounded-lg transition-colors ${
              isDarkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-200 text-gray-600'
            }`}
            title="写作统计"
          >
            <TrendingUp className="h-4 w-4" />
          </button>
          
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-2 rounded-lg transition-colors ${
              isDarkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-200 text-gray-600'
            }`}
            title="切换主题"
          >
            {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className={`p-2 rounded-lg transition-colors ${
              isDarkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-200 text-gray-600'
            }`}
            title="全屏模式"
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>

          <button
            onClick={handleManualSave}
            className="flex items-center px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Save className="h-4 w-4 mr-2" />
            保存
          </button>
        </div>
      </div>

      {/* 写作统计面板 */}
      {showStats && (
        <div className={`border-b ${isDarkMode ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-gray-50'} px-4 py-3`}>
          <div className="grid grid-cols-6 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <Type className="h-4 w-4 text-blue-500 mr-1" />
                <span className="text-sm text-gray-500">字数</span>
              </div>
              <div className="text-lg font-semibold">{stats.wordsWritten.toLocaleString()}</div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <Clock className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm text-gray-500">时长</span>
              </div>
              <div className="text-lg font-semibold">{formatTime(sessionTime)}</div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <TrendingUp className="h-4 w-4 text-purple-500 mr-1" />
                <span className="text-sm text-gray-500">速度</span>
              </div>
              <div className="text-lg font-semibold">{stats.wordsPerMinute} 字/分</div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <Target className="h-4 w-4 text-orange-500 mr-1" />
                <span className="text-sm text-gray-500">目标</span>
              </div>
              <div className="text-lg font-semibold">{Math.round(progress)}%</div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <Zap className="h-4 w-4 text-yellow-500 mr-1" />
                <span className="text-sm text-gray-500">专注</span>
              </div>
              <div className="text-lg font-semibold">{formatTime(timeRemaining)}</div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <Coffee className="h-4 w-4 text-red-500 mr-1" />
                <span className="text-sm text-gray-500">状态</span>
              </div>
              <div className="text-lg font-semibold">
                {progress >= 100 ? '✅ 完成' : '📝 进行中'}
              </div>
            </div>
          </div>
          
          {/* 进度条 */}
          <div className="mt-3">
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between mt-1 text-xs text-gray-500">
              <span>{stats.wordsWritten.toLocaleString()} / {writingGoalState.toLocaleString()} 字</span>
              <span>{Math.round(progress)}% 完成</span>
            </div>
          </div>
        </div>
      )}

      {/* 主编辑区域 */}
      <div className="flex-1 flex">
        {/* 编辑器 */}
        <div className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            {!isFocusMode && (
              <h1 className="text-3xl font-bold mb-6">开始你的创作</h1>
            )}
            
            <textarea
              ref={textareaRef}
              id="immersive-editor"
              value={content}
              onChange={handleContentChange}
              placeholder="在这里开始写作..."
              className={`w-full h-full min-h-[500px] p-6 border-2 ${
                isDarkMode 
                  ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
              } rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              style={{
                fontSize: `${fontSize}px`,
                lineHeight: lineHeight,
                fontFamily: '"Times New Roman", serif'
              }}
            />
          </div>
        </div>

        {/* 侧边栏（非专注模式时显示） */}
        {!isFocusMode && (
          <div className={`w-80 border-l ${isDarkMode ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-gray-50'} p-6`}>
            <h3 className="text-lg font-semibold mb-4">写作助手</h3>
            
            {/* 快捷操作 */}
            <div className="space-y-3">
              <button className="w-full flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors">
                <Brain className="h-4 w-4 mr-2" />
                AI 续写
              </button>
              
              <button className="w-full flex items-center px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors">
                <Zap className="h-4 w-4 mr-2" />
                创意提示
              </button>
              
              <button className="w-full flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors">
                <Wind className="h-4 w-4 mr-2" />
                放松音乐
              </button>
            </div>

            {/* 写作目标设置 */}
            <div className="mt-6">
              <h4 className="text-sm font-medium mb-3">目标设置</h4>
              <div className="space-y-2">
                <label className="flex items-center justify-between text-sm">
                  <span>字数目标</span>
                  <input
                    type="number"
                    value={writingGoalState}
                    onChange={(e) => setWritingGoalState(Number(e.target.value))}
                    className={`w-20 px-2 py-1 border rounded ${
                      isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-300 bg-white'
                    }`}
                  />
                </label>
                
                <label className="flex items-center justify-between text-sm">
                  <span>专注时间</span>
                  <select
                    value={focusTimeState}
                    onChange={(e) => setFocusTimeState(Number(e.target.value))}
                    className={`w-20 px-2 py-1 border rounded ${
                      isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-300 bg-white'
                    }`}
                  >
                    <option value="15">15分钟</option>
                    <option value="25">25分钟</option>
                    <option value="45">45分钟</option>
                    <option value="60">60分钟</option>
                  </select>
                </label>
              </div>
            </div>

            {/* 鼓励语 */}
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
              <div className="flex items-center mb-2">
                <Coffee className="h-5 w-5 text-orange-500 mr-2" />
                <h4 className="font-medium">加油！</h4>
              </div>
              <p className="text-sm text-gray-600">
                {progress < 25 ? '刚开始，继续保持！' :
                 progress < 50 ? '不错的开始，继续加油！' :
                 progress < 75 ? '已经过半了，太棒了！' :
                 progress < 100 ? '快要完成了，坚持住！' :
                 '🎉 恭喜完成今日目标！'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 底部快捷栏 */}
      <div className={`border-t ${isDarkMode ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-gray-50'} px-4 py-2`}>
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-4">
            <span>字数: {stats.wordsWritten.toLocaleString()}</span>
            <span>速度: {stats.wordsPerMinute} 字/分</span>
            <span>目标: {Math.round(progress)}%</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsFocusMode(!isFocusMode)}
              className={`px-3 py-1 rounded transition-colors ${
                isFocusMode 
                  ? 'bg-indigo-100 text-indigo-700' 
                  : isDarkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'
              }`}
            >
              {isFocusMode ? <EyeOff className="h-3 w-3 mr-1" /> : <Eye className="h-3 w-3 mr-1" />}
              {isFocusMode ? '专注模式' : '普通模式'}
            </button>
            
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`px-3 py-1 rounded transition-colors ${
                soundEnabled 
                  ? 'bg-green-100 text-green-700' 
                  : isDarkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'
              }`}
            >
              {soundEnabled ? <Volume2 className="h-3 w-3 mr-1" /> : <VolumeX className="h-3 w-3 mr-1" />}
              打字音效
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}