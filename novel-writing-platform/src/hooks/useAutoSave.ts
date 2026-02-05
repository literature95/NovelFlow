import { useState, useEffect, useCallback, useRef } from 'react'

type SavingStatus = 'idle' | 'saving' | 'saved' | 'error'

interface AutoSaveOptions<T> {
  delay?: number // 自动保存延迟时间（毫秒）
  onSave?: (data: T) => Promise<void>
  deps?: React.DependencyList // 依赖项数组，当这些值改变时触发自动保存
}

export function useAutoSave<T>(data: T, options: AutoSaveOptions<T> = {}) {
  const { delay = 2000, onSave, deps = [] } = options
  const [savingStatus, setSavingStatus] = useState<SavingStatus>('idle')
  const [lastSavedData, setLastSavedData] = useState<T>(data)
  const saveTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)

  // 检查数据是否有变化
  const hasChanges = useCallback((current: T, saved: T) => {
    return JSON.stringify(current) !== JSON.stringify(saved)
  }, [])

  // 手动保存
  const save = useCallback(async () => {
    if (!onSave) return

    try {
      setSavingStatus('saving')
      await onSave(data)
      setLastSavedData(data)
      setSavingStatus('saved')
      
      // 2秒后重置状态
      setTimeout(() => {
        setSavingStatus('idle')
      }, 2000)
    } catch (error) {
      console.error('保存失败:', error)
      setSavingStatus('error')
      
      // 3秒后重置状态
      setTimeout(() => {
        setSavingStatus('idle')
      }, 3000)
    }
  }, [data, onSave])

  // 当数据变化时，设置延迟自动保存
  useEffect(() => {
    if (hasChanges(data, lastSavedData)) {
      // 清除之前的定时器
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }

      // 设置新的定时器
      saveTimeoutRef.current = setTimeout(() => {
        save()
      }, delay)
    }
  }, [data, lastSavedData, delay, hasChanges, save])

  // 监听依赖项变化
  useEffect(() => {
    if (deps.length > 0) {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
      
      saveTimeoutRef.current = setTimeout(() => {
        save()
      }, delay)
    }
  }, [delay, save])

  // 清理定时器
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [])

  // 在渲染期间计算是否有未保存的变化
  const isDirty = hasChanges(data, lastSavedData)

  return {
    savingStatus,
    save,
    hasUnsavedChanges: isDirty,
    lastSavedData
  }
}

// 用于章节编辑的自动保存Hook
export function useChapterAutoSave<T>(chapterId: string, initialData: T) {
  const [data, setData] = useState(initialData)
  
  const { savingStatus, save, hasUnsavedChanges } = useAutoSave(data, {
    delay: 3000,
    onSave: async (currentData) => {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/chapters/${chapterId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(currentData)
      })
      
      if (!response.ok) {
        throw new Error('保存失败')
      }
      
      return response.json()
    }
  })

  const updateData = useCallback((newData: Partial<T>) => {
    setData((prev: T) => ({ ...prev, ...newData }))
  }, [])

  return {
    data,
    updateData,
    savingStatus,
    save,
    hasUnsavedChanges
  }
}

// 用于小说设置保存的Hook
export function useNovelAutoSave<T>(novelId: string, initialData: T) {
  const [data, setData] = useState(initialData)
  
  const { savingStatus, save, hasUnsavedChanges } = useAutoSave(data, {
    delay: 5000,
    onSave: async (currentData) => {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/novels/${novelId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(currentData)
      })
      
      if (!response.ok) {
        throw new Error('保存失败')
      }
      
      return response.json()
    }
  })

  const updateData = useCallback((newData: Partial<T>) => {
    setData((prev: T) => ({ ...prev, ...newData }))
  }, [])

  return {
    data,
    updateData,
    savingStatus,
    save,
    hasUnsavedChanges
  }
}