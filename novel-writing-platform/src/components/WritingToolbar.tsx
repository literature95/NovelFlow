'use client'

import { useState, useEffect, useRef } from 'react'
import { 
  Bold, 
  Italic, 
  Underline, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  List, 
  ListOrdered, 
  Quote, 
  Code,
  Link,
  Image,
  Video,
  Smile,
  Hash,
  AtSign,
  Type,
  Palette,
  Highlighter,
  Save,
  Undo,
  Redo,
  Copy,
  Download,
  Upload,
  Eye,
  EyeOff,
  Maximize2,
  Minimize2,
  Settings,
  HelpCircle,
  Zap,
  Target,
  Clock,
  TrendingUp,
  BookOpen,
  Coffee,
  Brain,
  Sparkles,
  RefreshCw,
  Play,
  Pause,
  Sun,
  Moon
} from 'lucide-react'

interface WritingToolbarProps {
  content: string
  onContentChange: (content: string) => void
  onSave?: () => void
  darkMode?: boolean
  focusMode?: boolean
  onDarkModeToggle?: () => void
  onFocusModeToggle?: () => void
  wordCount?: number
  readingTime?: number
  writingGoal?: number
}

export default function WritingToolbar({
  content,
  onContentChange,
  onSave,
  darkMode = false,
  focusMode = false,
  onDarkModeToggle,
  onFocusModeToggle,
  wordCount = 0,
  readingTime = 0,
  writingGoal = 5000
}: WritingToolbarProps) {
  const [isSaving, setIsSaving] = useState(false)
  const [showFormatMenu, setShowFormatMenu] = useState(false)
  const [showInsertMenu, setShowInsertMenu] = useState(false)
  const [showAIMenu, setShowAIMenu] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [writingStreak, setWritingStreak] = useState(0)
  const [sessionTime, setSessionTime] = useState(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // 会话计时器
    timerRef.current = setInterval(() => {
      setSessionTime(prev => prev + 1)
    }, 1000)

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  useEffect(() => {
    // 自动保存
    const autoSaveTimer = setTimeout(() => {
      if (content && content.trim()) {
        handleAutoSave()
      }
    }, 30000) // 30秒自动保存

    return () => clearTimeout(autoSaveTimer)
  }, [content])

  const handleAutoSave = async () => {
    setIsSaving(true)
    try {
      if (onSave) {
        await onSave()
      }
      setLastSaved(new Date())
    } catch (error) {
      console.error('自动保存失败:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleManualSave = async () => {
    setIsSaving(true)
    try {
      if (onSave) {
        await onSave()
      }
      setLastSaved(new Date())
    } catch (error) {
      console.error('保存失败:', error)
      alert('保存失败，请重试')
    } finally {
      setIsSaving(false)
    }
  }

  const formatText = (format: string) => {
    const textarea = document.getElementById('editor-textarea') as HTMLTextAreaElement
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = content.substring(start, end)
    let formattedText = ''

    switch (format) {
      case 'bold':
        formattedText = `**${selectedText}**`
        break
      case 'italic':
        formattedText = `*${selectedText}*`
        break
      case 'underline':
        formattedText = `__${selectedText}__`
        break
      case 'heading':
        formattedText = `## ${selectedText}`
        break
      case 'quote':
        formattedText = `> ${selectedText}`
        break
      case 'code':
        formattedText = `\`${selectedText}\``
        break
      case 'link':
        formattedText = `[${selectedText}](url)`
        break
      default:
        formattedText = selectedText
    }

    const newContent = content.substring(0, start) + formattedText + content.substring(end)
    onContentChange(newContent)
  }

  const generateAIContent = async (type: string) => {
    const textarea = document.getElementById('editor-textarea') as HTMLTextAreaElement
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = content.substring(start, end)

    try {
      // 模拟AI生成，实际应用中应该调用API
      let aiContent = ''
      switch (type) {
        case 'continue':
          aiContent = '\n\n[AI续写内容]这是根据上下文自动生成的内容...'
          break
        case 'improve':
          aiContent = '[AI优化内容]这段文字经过AI优化，表达更加流畅...'
          break
        case 'summary':
          aiContent = '[AI摘要]本文主要讲述了...'
          break
        case 'ideas':
          aiContent = '[AI创意]以下是一些写作建议和创意点子...'
          break
      }

      const newContent = content.substring(0, start) + aiContent + content.substring(end)
      onContentChange(newContent)
    } catch (error) {
      alert('AI生成失败，请重试')
    }
  }

  const exportContent = (format: 'txt' | 'md' | 'docx') => {
    const exportContent = content
    let filename = `writing_${new Date().toISOString().split('T')[0]}`
    let mimeType = 'text/plain'

    switch (format) {
      case 'md':
        filename += '.md'
        mimeType = 'text/markdown'
        break
      case 'docx':
        filename += '.docx'
        mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        break
      default:
        filename += '.txt'
    }

    const blob = new Blob([exportContent], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const formatSessionTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }

  const writingProgress = Math.min((wordCount / writingGoal) * 100, 100)

  return (
    <div className={`border-b ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'} px-4 py-2`}>
      {/* 第一行：格式化工具 */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-1">
          {/* 文本格式化 */}
          <div className="flex items-center space-x-1 px-2 py-1 rounded border border-gray-300">
            <button
              onClick={() => formatText('bold')}
              className="p-1.5 hover:bg-gray-100 rounded transition-colors"
              title="加粗 (Ctrl+B)"
            >
              <Bold className="h-4 w-4" />
            </button>
            <button
              onClick={() => formatText('italic')}
              className="p-1.5 hover:bg-gray-100 rounded transition-colors"
              title="斜体 (Ctrl+I)"
            >
              <Italic className="h-4 w-4" />
            </button>
            <button
              onClick={() => formatText('underline')}
              className="p-1.5 hover:bg-gray-100 rounded transition-colors"
              title="下划线 (Ctrl+U)"
            >
              <Underline className="h-4 w-4" />
            </button>
            <div className="w-px h-4 bg-gray-300 mx-1" />
            <button
              onClick={() => formatText('heading')}
              className="p-1.5 hover:bg-gray-100 rounded transition-colors"
              title="标题"
            >
              <Type className="h-4 w-4" />
            </button>
            <button
              onClick={() => formatText('quote')}
              className="p-1.5 hover:bg-gray-100 rounded transition-colors"
              title="引用"
            >
              <Quote className="h-4 w-4" />
            </button>
            <button
              onClick={() => formatText('code')}
              className="p-1.5 hover:bg-gray-100 rounded transition-colors"
              title="代码"
            >
              <Code className="h-4 w-4" />
            </button>
          </div>

          {/* 列表和对齐 */}
          <div className="flex items-center space-x-1 px-2 py-1 rounded border border-gray-300">
            <button className="p-1.5 hover:bg-gray-100 rounded transition-colors" title="无序列表">
              <List className="h-4 w-4" />
            </button>
            <button className="p-1.5 hover:bg-gray-100 rounded transition-colors" title="有序列表">
              <ListOrdered className="h-4 w-4" />
            </button>
            <div className="w-px h-4 bg-gray-300 mx-1" />
            <button className="p-1.5 hover:bg-gray-100 rounded transition-colors" title="左对齐">
              <AlignLeft className="h-4 w-4" />
            </button>
            <button className="p-1.5 hover:bg-gray-100 rounded transition-colors" title="居中对齐">
              <AlignCenter className="h-4 w-4" />
            </button>
            <button className="p-1.5 hover:bg-gray-100 rounded transition-colors" title="右对齐">
              <AlignRight className="h-4 w-4" />
            </button>
          </div>

          {/* AI工具 */}
          <div className="flex items-center space-x-1 px-2 py-1 rounded border border-purple-300 bg-purple-50">
            <button
              onClick={() => generateAIContent('continue')}
              className="p-1.5 hover:bg-purple-100 rounded transition-colors"
              title="AI续写"
            >
              <Sparkles className="h-4 w-4 text-purple-600" />
            </button>
            <button
              onClick={() => generateAIContent('improve')}
              className="p-1.5 hover:bg-purple-100 rounded transition-colors"
              title="AI优化"
            >
              <Brain className="h-4 w-4 text-purple-600" />
            </button>
            <button
              onClick={() => generateAIContent('ideas')}
              className="p-1.5 hover:bg-purple-100 rounded transition-colors"
              title="AI创意"
            >
              <Zap className="h-4 w-4 text-purple-600" />
            </button>
          </div>
        </div>

        {/* 右侧操作按钮 */}
        <div className="flex items-center space-x-2">
          {/* 保存状态 */}
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            {isSaving ? (
              <div className="flex items-center">
                <RefreshCw className="h-4 w-4 animate-spin mr-1" />
                保存中...
              </div>
            ) : lastSaved ? (
              <div className="flex items-center">
                <Save className="h-4 w-4 mr-1" />
                已保存 {lastSaved.toLocaleTimeString()}
              </div>
            ) : (
              <button
                onClick={handleManualSave}
                className="flex items-center px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
              >
                <Save className="h-4 w-4 mr-1" />
                保存
              </button>
            )}
          </div>

          {/* 视图控制 */}
          <div className="flex items-center space-x-1">
            {onDarkModeToggle && (
              <button
                onClick={onDarkModeToggle}
                className="p-2 hover:bg-gray-100 rounded transition-colors"
                title="切换主题"
              >
                {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
            )}
            {onFocusModeToggle && (
              <button
                onClick={onFocusModeToggle}
                className="p-2 hover:bg-gray-100 rounded transition-colors"
                title="专注模式"
              >
                {focusMode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            )}
            <button
              onClick={() => exportContent('md')}
              className="p-2 hover:bg-gray-100 rounded transition-colors"
              title="导出"
            >
              <Download className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 第二行：写作统计和进度 */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center space-x-4">
          {/* 字数统计 */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center text-gray-600">
              <Type className="h-4 w-4 mr-1" />
              字数: <span className="font-medium ml-1">{wordCount.toLocaleString()}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Clock className="h-4 w-4 mr-1" />
              预计阅读: <span className="font-medium ml-1">{readingTime}分钟</span>
            </div>
            <div className="flex items-center text-gray-600">
              <TrendingUp className="h-4 w-4 mr-1" />
              会话时长: <span className="font-medium ml-1">{formatSessionTime(sessionTime)}</span>
            </div>
          </div>

          {/* 写作目标进度 */}
          <div className="flex items-center space-x-2">
            <Target className="h-4 w-4 text-gray-600" />
            <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-linear-to-r from-blue-500 to-green-500 transition-all duration-300"
                style={{ width: `${writingProgress}%` }}
              />
            </div>
            <span className="text-xs text-gray-600">
              {wordCount.toLocaleString()} / {writingGoal.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-3 text-gray-600">
          {/* 写作激励 */}
          <div className="flex items-center">
            <Coffee className="h-4 w-4 mr-1" />
            <span className="text-xs">保持专注！</span>
          </div>
          {writingProgress >= 100 && (
            <div className="flex items-center text-green-600">
              <BookOpen className="h-4 w-4 mr-1" />
              <span className="text-xs font-medium">目标达成！🎉</span>
            </div>
          )}
        </div>
      </div>

      {/* 快捷键提示 */}
      <div className="hidden md:flex items-center justify-between mt-2 text-xs text-gray-500">
        <div className="flex items-center space-x-4">
          <span>Ctrl+S 保存</span>
          <span>Ctrl+B 加粗</span>
          <span>Ctrl+I 斜体</span>
          <span>Ctrl+U 下划线</span>
        </div>
        <div className="flex items-center space-x-2">
          <HelpCircle className="h-3 w-3" />
          <span>按 H 查看更多快捷键</span>
        </div>
      </div>
    </div>
  )
}