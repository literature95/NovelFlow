'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Save, Sparkles } from 'lucide-react'

export default function CreateChapterPage() {
  const params = useParams()
  const router = useRouter()
  const [novel, setNovel] = useState<any>(null)
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    content: '',
    useAI: false
  })
  const [loading, setLoading] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (params.id) {
      fetchNovel()
    }
  }, [params.id])

  const fetchNovel = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/novels/${params.id}`, {
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
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleAIGenerate = async () => {
    if (!formData.summary.trim()) {
      setError('请先填写章节简介')
      return
    }

    setGenerating(true)
    setError('')

    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/ai/generate-chapter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          novelId: params.id,
          chapterSummary: formData.summary
        })
      })

      const data = await response.json()

      if (response.ok) {
        setFormData(prev => ({
          ...prev,
          content: data.content
        }))
      } else {
        setError(data.error || 'AI生成失败')
      }
    } catch (error) {
      setError('AI生成失败，请检查网络连接')
    } finally {
      setGenerating(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!formData.title.trim()) {
      setError('章节标题是必需的')
      setLoading(false)
      return
    }

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/novels/${params.id}/chapters`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: formData.title,
          summary: formData.summary,
          content: formData.content,
          isAIGenerated: formData.useAI
        })
      })

      const data = await response.json()

      if (response.ok) {
        router.push(`/dashboard/novels/${params.id}`)
      } else {
        setError(data.error || '创建失败')
      }
    } catch (error) {
      setError('网络错误，请重试')
    } finally {
      setLoading(false)
    }
  }

  if (!novel) {
    return <div className="flex justify-center items-center h-64">加载中...</div>
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* 返回按钮 */}
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          返回
        </button>
      </div>

      {/* 页面标题 */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">创建新章节</h1>
        <p className="mt-1 text-sm text-gray-600">
          小说：{novel.title}
        </p>
      </div>

      {/* 小说信息预览 */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h3 className="text-sm font-medium text-blue-900 mb-2">小说设定参考</h3>
        {novel.outline && (
          <div className="mb-2">
            <span className="text-xs font-medium text-blue-700">故事大纲：</span>
            <p className="text-xs text-blue-600 mt-1">{novel.outline}</p>
          </div>
        )}
        {novel.worldSetting && (
          <div className="mb-2">
            <span className="text-xs font-medium text-blue-700">世界观：</span>
            <p className="text-xs text-blue-600 mt-1">{novel.worldSetting}</p>
          </div>
        )}
        {novel.protagonist && (
          <div>
            <span className="text-xs font-medium text-blue-700">主角设定：</span>
            <p className="text-xs text-blue-600 mt-1">{novel.protagonist}</p>
          </div>
        )}
      </div>

      {/* 表单 */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="bg-white shadow rounded-lg p-6">
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                章节标题 *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="输入章节标题"
              />
            </div>

            <div>
              <label htmlFor="summary" className="block text-sm font-medium text-gray-700">
                章节简介
              </label>
              <textarea
                id="summary"
                name="summary"
                rows={3}
                value={formData.summary}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="简要描述这个章节的主要内容，AI生成时会基于此内容创作"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                  章节内容
                </label>
                <button
                  type="button"
                  onClick={handleAIGenerate}
                  disabled={generating || !formData.summary.trim()}
                  className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
                >
                  <Sparkles className="mr-1 h-3 w-3" />
                  {generating ? 'AI生成中...' : 'AI生成内容'}
                </button>
              </div>
              <textarea
                id="content"
                name="content"
                rows={12}
                value={formData.content}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="在这里编写章节内容，或者使用AI生成功能..."
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            取消
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            <Save className="mr-2 h-4 w-4" />
            {loading ? '创建中...' : '创建章节'}
          </button>
        </div>
      </form>
    </div>
  )
}