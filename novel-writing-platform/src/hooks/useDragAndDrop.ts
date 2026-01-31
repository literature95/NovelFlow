import { useState, useRef } from 'react'

interface DragItem {
  index: number
  id: string
}

export function useDragAndDrop<T extends { id: string; order: number }>(
  items: T[],
  onReorder: (items: T[]) => void
) {
  const [draggedItem, setDraggedItem] = useState<DragItem | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
  const dragItemRef = useRef<T | null>(null)

  const handleDragStart = (e: React.DragEvent, item: T, index: number) => {
    dragItemRef.current = item
    setDraggedItem({ index, id: item.id })
    
    // 设置拖拽数据
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/html', e.currentTarget.outerHTML)
    
    // 设置自定义拖拽图像
    const dragImage = e.currentTarget.cloneNode(true) as HTMLElement
    dragImage.style.opacity = '0.5'
    document.body.appendChild(dragImage)
    e.dataTransfer.setDragImage(dragImage, 0, 0)
    setTimeout(() => {
      document.body.removeChild(dragImage)
    }, 0)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    
    if (draggedItem && draggedItem.index !== index) {
      setDragOverIndex(index)
    }
  }

  const handleDragLeave = () => {
    setDragOverIndex(null)
  }

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault()
    setDragOverIndex(null)

    if (!draggedItem || draggedItem.index === dropIndex) {
      return
    }

    const draggedChapter = dragItemRef.current
    if (!draggedChapter) return

    const newItems = [...items]
    
    // 移除被拖拽的项目
    newItems.splice(draggedItem.index, 1)
    
    // 计算新的插入位置
    const targetIndex = draggedItem.index < dropIndex ? dropIndex - 1 : dropIndex
    
    // 在新位置插入项目
    newItems.splice(targetIndex, 0, draggedChapter)
    
    // 更新所有项目的order值
    const reorderedItems = newItems.map((item, index) => ({
      ...item,
      order: index + 1
    }))
    
    onReorder(reorderedItems)
    setDraggedItem(null)
    dragItemRef.current = null
  }

  const handleDragEnd = () => {
    setDraggedItem(null)
    setDragOverIndex(null)
    dragItemRef.current = null
  }

  return {
    draggedItem,
    dragOverIndex,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleDragEnd
  }
}