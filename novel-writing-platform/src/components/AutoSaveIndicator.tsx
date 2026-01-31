'use client'

import { useState, useEffect } from 'react'
import { 
  Check, 
  Clock, 
  X, 
  Save, 
  RotateCcw 
} from 'lucide-react'

type SavingStatus = 'idle' | 'saving' | 'saved' | 'error'

interface AutoSaveIndicatorProps {
  status: SavingStatus
  lastSavedTime?: Date
  hasUnsavedChanges?: boolean
  onManualSave?: () => void
  showManualSave?: boolean
}

export default function AutoSaveIndicator({
  status,
  lastSavedTime,
  hasUnsavedChanges = false,
  onManualSave,
  showManualSave = true
}: AutoSaveIndicatorProps) {
  const [visible, setVisible] = useState(false)
  const [countdown, setCountdown] = useState(0)

  // 当状态改变时显示指示器
  useEffect(() => {
    if (status !== 'idle') {
      setVisible(true)
      
      if (status === 'saving') {
        setCountdown(30) // 最多显示30秒
        const interval = setInterval(() => {
          setCountdown(prev => {
            if (prev <= 1) {
              setVisible(false)
              return 0
            }
            return prev - 1
          })
        }, 1000)
        
        return () => clearInterval(interval)
      } else {
        // 非保存状态3秒后隐藏
        const timer = setTimeout(() => {
          setVisible(false)
        }, 3000)
        
        return () => clearTimeout(timer)
      }
    }
  }, [status])

  // 手动保存按钮点击处理
  const handleManualSave = async () => {
    if (onManualSave) {
      await onManualSave()
    }
  }

  const getStatusConfig = () => {
    switch (status) {
      case 'saving':
        return {
          icon: Clock,
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          text: '保存中...',
          showProgress: true
        }
      case 'saved':
        return {
          icon: Check,
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          text: '已保存',
          showProgress: false
        }
      case 'error':
        return {
          icon: X,
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          text: '保存失败',
          showProgress: false,
          showRetry: true
        }
      default:
        return {
          icon: Save,
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          text: '就绪',
          showProgress: false
        }
    }
  }

  if (!visible) return null

  const config = getStatusConfig()
  const StatusIcon = config.icon
  const timeSinceLastSave = lastSavedTime 
    ? Math.floor((Date.now() - lastSavedTime.getTime()) / 1000)
    : 0

  return (
    <div className={`fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 duration-200`}>
      <div className={`flex items-center gap-3 px-4 py-2 rounded-lg border ${config.bgColor} ${config.borderColor} shadow-lg max-w-sm`}>
        <div className="flex items-center gap-2">
          <StatusIcon className={`h-4 w-4 ${config.color} ${status === 'saving' ? 'animate-spin' : ''}`} />
          <span className={`text-sm font-medium ${config.color}`}>
            {config.text}
          </span>
          
          {hasUnsavedChanges && status === 'idle' && (
            <span className="text-xs text-gray-500 ml-1">
              (有未保存的更改)
            </span>
          )}
        </div>

        {/* 保存进度条 */}
        {config.showProgress && countdown > 0 && (
          <div className="flex items-center gap-2">
            <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-yellow-500 transition-all duration-1000"
                style={{ width: `${(countdown / 30) * 100}%` }}
              ></div>
            </div>
            <span className="text-xs text-gray-500">{countdown}s</span>
          </div>
        )}

        {/* 操作按钮 */}
        <div className="flex items-center gap-1 ml-2">
          {config.showRetry && onManualSave && (
            <button
              onClick={handleManualSave}
              className="p-1 rounded hover:bg-white/50 transition-colors"
              title="重试保存"
            >
              <RotateCcw className="h-3 w-3 text-gray-600" />
            </button>
          )}
          
          {showManualSave && hasUnsavedChanges && onManualSave && status !== 'saving' && (
            <button
              onClick={handleManualSave}
              className="p-1 rounded hover:bg-white/50 transition-colors"
              title="手动保存"
            >
              <Save className="h-3 w-3 text-gray-600" />
            </button>
          )}
        </div>

        {/* 关闭按钮 */}
        <button
          onClick={() => setVisible(false)}
          className="p-1 rounded hover:bg-white/50 transition-colors ml-1"
          title="关闭"
        >
          <X className="h-3 w-3 text-gray-400" />
        </button>
      </div>

      {/* 保存时间提示 */}
      {status === 'saved' && lastSavedTime && timeSinceLastSave < 60 && (
        <div className={`text-xs text-gray-500 mt-1 text-center ${config.bgColor} px-2 py-1 rounded-b-lg`}>
          {timeSinceLastSave === 0 ? '刚刚保存' : `${timeSinceLastSave}秒前保存`}
        </div>
      )}
    </div>
  )
}

// 紧凑版指示器（用于工具栏）
export function CompactAutoSaveIndicator({
  status,
  onClick
}: {
  status: SavingStatus
  onClick?: () => void
}) {
  const getStatusConfig = () => {
    switch (status) {
      case 'saving':
        return {
          icon: Clock,
          color: 'text-yellow-600',
          tooltip: '正在保存...'
        }
      case 'saved':
        return {
          icon: Check,
          color: 'text-green-600',
          tooltip: '已保存'
        }
      case 'error':
        return {
          icon: X,
          color: 'text-red-600',
          tooltip: '保存失败'
        }
      default:
        return {
          icon: Save,
          color: 'text-gray-600',
          tooltip: '就绪'
        }
    }
  }

  const config = getStatusConfig()
  const StatusIcon = config.icon

  return (
    <button
      onClick={onClick}
      className={`p-2 rounded-lg hover:bg-gray-100 transition-colors group relative`}
      title={config.tooltip}
    >
      <StatusIcon className={`h-4 w-4 ${config.color} ${status === 'saving' ? 'animate-spin' : ''}`} />
      
      {/* 状态指示点 */}
      {status === 'saved' && (
        <div className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full"></div>
      )}
      {status === 'error' && (
        <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
      )}
    </button>
  )
}