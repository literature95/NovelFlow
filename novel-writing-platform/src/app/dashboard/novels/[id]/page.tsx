'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { 
  BookOpen, 
  ArrowLeft
} from 'lucide-react'
import WritingWorkspace from '@/components/WritingWorkspace'
import ChapterDetailModal from '@/components/ChapterDetailModal'
import ImmersiveEditor from '@/components/ImmersiveEditor'

export default function NovelDetailPage() {
  const params = useParams()
  const router = useRouter()
  const novelId = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : ''
  
  const [novel, setNovel] = useState<any>(null)
  const [selectedChapter, setSelectedChapter] = useState<any>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showImmersiveEditor, setShowImmersiveEditor] = useState(false)
  const [currentChapterContent, setCurrentChapterContent] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (novelId) {
      fetchNovel()
    }
  }, [novelId])

  const fetchNovel = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/novels/${novelId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setNovel(data.novel)
      } else {
        setError('获取小说信息失败')
      }
    } catch (error) {
      setError('网络错误')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveChapter = async (chapterId: string, content: string) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/novels/${novelId}/chapters/${chapterId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: selectedChapter?.title,
          summary: selectedChapter?.summary,
          content: content,
          order: selectedChapter?.order
        })
      })
      
      if (!response.ok) {
        throw new Error('保存失败')
      }
      
      // 更新本地状态
      setNovel((prev: any) => ({
        ...prev,
        chapters: prev.chapters.map((ch: any) => 
          ch.id === chapterId ? { ...ch, content } : ch
        )
      }))
    } catch (error) {
      console.error('保存章节失败:', error)
      throw error
    }
  }

  const handleOpenImmersiveEditor = (chapter: any) => {
    setSelectedChapter(chapter)
    setCurrentChapterContent(chapter.content || '')
    setShowImmersiveEditor(true)
  }

  const handleCloseImmersiveEditor = () => {
    setShowImmersiveEditor(false)
    setSelectedChapter(null)
    setCurrentChapterContent('')
  }

  const handleSaveImmersiveContent = async (content: string) => {
    if (selectedChapter) {
      await handleSaveChapter(selectedChapter.id, content)
    }
  }

  const handleDeleteChapter = async (chapter: any) => {
    if (!confirm('确定要删除这个章节吗？')) return

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/novels/${novelId}/chapters/${chapter.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        setNovel((prev: any) => ({
          ...prev,
          chapters: prev.chapters.filter((ch: any) => ch.id !== chapter.id)
        }))
      } else {
        alert('删除失败')
      }
    } catch (error) {
      alert('删除失败')
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
          <h2 className="text-xl font-semibold text-gray-900 mb-2">无法加载小说</h2>
          <p className="text-gray-600 mb-4">{error || '小说不存在'}</p>
          <button 
            onClick={() => router.back()}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回上页
          </button>
        </div>
      </div>
    )
  }

  // 沉浸式编辑器模式
  if (showImmersiveEditor && selectedChapter) {
    return (
      <ImmersiveEditor
        initialContent={currentChapterContent}
        onSave={handleSaveImmersiveContent}
        onExit={handleCloseImmersiveEditor}
        writingGoal={1000}
        focusTime={25}
        enableTypingSound={false}
      />
    )
  }

  return (
    <>
      <WritingWorkspace
        novel={novel}
        onChapterSelect={(chapter) => {
          setSelectedChapter(chapter)
          setShowDetailModal(true)
        }}
        onChapterEdit={(chapter) => {
          router.push(`/dashboard/novels/${novelId}/chapters/${chapter.id}`)
        }}
        onChapterDelete={handleDeleteChapter}
        onChapterReorder={async (chapters) => {
          try {
            const token = localStorage.getItem('token')
            await fetch(`/api/novels/${novelId}/chapters/reorder`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({
                chapters: chapters.map(ch => ({ id: ch.id, order: ch.order }))
              })
            })
            setNovel((prev: any) => ({ ...prev, chapters }))
          } catch (error) {
            console.error('重新排序失败:', error)
            alert('重新排序失败')
          }
        }}
        generatingChapter={null}
      />

      {/* 章节详情模态框 */}
      {showDetailModal && selectedChapter && (
        <ChapterDetailModal
          chapter={selectedChapter}
          isOpen={showDetailModal}
          onClose={() => {
            setShowDetailModal(false)
            setSelectedChapter(null)
          }}
          onEdit={() => {
            setShowDetailModal(false)
            router.push(`/dashboard/novels/${novelId}/chapters/${selectedChapter.id}`)
          }}
        />
      )}
    </>
  )
}