'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Save, Settings } from 'lucide-react'

export default function ChapterDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [chapter, setChapter] = useState<any>(null)
  const [novel, setNovel] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  
  // 表单状态
  const [title, setTitle] = useState('')
  const [summary, setSummary] = useState('')

  useEffect(() => {
    if (params.id && params.chapterId) {
      fetchChapter()
    }
  }, [params.id, params.chapterId])

  const fetchChapter = async () => {
    try {
      const token = localStorage.getItem('token')
      
      // 获取章节信息
      const chapterResponse = await fetch(`/api/novels/${params.id}/chapters/${params.chapterId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (chapterResponse.ok) {
        const chapterData = await chapterResponse.json()
        setChapter(chapterData.chapter)
        setTitle(chapterData.chapter.title)
        setSummary(chapterData.chapter.summary || '')
        
        // 获取小说信息用于显示上下文
        const novelResponse = await fetch(`/api/novels/${params.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
        if (novelResponse.ok) {
          const novelData = await novelResponse.json()
          setNovel(novelData.novel)
        }
      } else {
        setError('获取章节信息失败')
      }
    } catch (error) {
      setError('网络错误')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!title.trim()) {
      alert('章节标题不能为空')
      return
    }
    if (!summary.trim()) {
      alert('章节简介不能为空')
      return
    }
    if (summary.length > 500) {
      alert('章节简介不能超过500个字符')
      return
    }

    setSaving(true)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/novels/${params.id}/chapters/${params.chapterId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: title.trim(),
          summary: summary.trim(),
          content: chapter.content,
          order: chapter.order
        })
      })
      
      if (response.ok) {
        const data = await response.json()
        setChapter(data.chapter)
        alert('章节详情保存成功')
      } else {
        const errorData = await response.json()
        alert(`保存失败：${errorData.error || '未知错误'}`)
      }
    } catch (error) {
      console.error('保存章节详情失败:', error)
      alert('保存失败，请检查网络连接')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">加载中...</p>
        </div>
      </div>
    )
  }

  if (error || !chapter) {
    return (
      <div className="text-center text-red-600 p-8">
        <h2 className="text-xl font-medium mb-2">加载失败</h2>
        <p className="text-gray-600">{error || '章节不存在'}</p>
        <button
          onClick={() => router.back()}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          返回上一页
        </button>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col">
      {/* 顶部导航 */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={() => router.back()}
              className="mr-4 text-gray-500 hover:text-gray-700"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-xl font-semibold text-gray-900 flex items-center">
                <Settings className="mr-2 h-5 w-5 text-indigo-600" />
                章节详情设置
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {novel?.title} - 第{chapter.order}章
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => router.push(`/dashboard/novels/${params.id}/chapters/${params.chapterId}`)}
              className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm"
            >
              编辑内容
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="mr-2 h-4 w-4" />
              {saving ? '保存中...' : '保存详情'}
            </button>
          </div>
        </div>
      </div>

      {/* 主要内容区域 */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto">
          <div className="max-w-4xl mx-auto p-6">
            {/* 页面说明 */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="text-sm font-medium text-blue-900 mb-2">📝 章节详情说明</h3>
              <p className="text-sm text-blue-700">
                在这里编辑章节的标题和简介。这些信息用于：
              </p>
              <ul className="text-sm text-blue-700 mt-2 ml-4 list-disc">
                <li>章节管理和组织</li>
                <li>AI生成章节内容的基础信息</li>
                <li>帮助读者了解章节内容概要</li>
              </ul>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* 左侧：编辑区域 */}
              <div className="lg:col-span-2 space-y-6">
                {/* 章节基本信息 */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">基本信息</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                        章节标题 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="输入章节标题，如：初入江湖"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        清晰的标题有助于读者理解章节内容
                      </p>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label htmlFor="summary" className="block text-sm font-medium text-gray-700">
                          章节简介 <span className="text-red-500">*</span>
                        </label>
                        <span className="text-xs text-gray-500">{summary.length}/500</span>
                      </div>
                      <textarea
                        id="summary"
                        value={summary}
                        onChange={(e) => setSummary(e.target.value)}
                        rows={8}
                        maxLength={500}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="简要描述这个章节的主要内容：

• 主要情节和事件
• 关键人物的行动和决策
• 场景和氛围描述
• 章节要达到的目标和效果

好的简介能让AI生成更贴合你想法的章节内容。"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        简介越详细，AI生成的内容越贴合你的预期
                      </p>
                    </div>
                  </div>
                </div>

                {/* 章节预览 */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">章节预览</h3>
                  <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div className="flex items-center mb-3">
                      <span className="text-sm font-medium text-gray-500 mr-3">
                        第{chapter.order}章
                      </span>
                      <h4 className="text-base font-medium text-gray-900">
                        {title || '未设置标题'}
                      </h4>
                    </div>
                    <p className="text-sm text-gray-600 whitespace-pre-wrap">
                      {summary || '未设置简介'}
                    </p>
                    <div className="mt-3 text-xs text-gray-400">
                      最后更新：{new Date(chapter.updatedAt).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>

              {/* 右侧：帮助信息 */}
              <div className="space-y-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">📝 写作建议</h3>
                  <div className="space-y-4 text-sm">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">标题写作</h4>
                      <ul className="text-gray-600 space-y-1">
                        <li>• 简洁明了，突出章节重点</li>
                        <li>• 使用动词或关键事件命名</li>
                        <li>• 保持风格统一</li>
                        <li>• 避免剧透重要情节</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">简介写作</h4>
                      <ul className="text-gray-600 space-y-1">
                        <li>• 包含关键情节和转折点</li>
                        <li>• 说明主要人物的心理状态</li>
                        <li>• 描述重要的场景和氛围</li>
                        <li>• 控制在200-500字之间</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-amber-900 mb-4">⚠️ 注意事项</h3>
                  <ul className="text-sm text-amber-700 space-y-2">
                    <li>• 章节标题和简介都是必填项</li>
                    <li>• 简介最多500个字符</li>
                    <li>• 修改后需要点击保存才能生效</li>
                    <li>• 保存成功后可以使用AI生成功能</li>
                  </ul>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-green-900 mb-4">💡 AI生成提示</h3>
                  <p className="text-sm text-green-700">
                    保存章节简介后，你可以在章节列表页面使用AI生成功能，根据这个简介自动创作章节内容。
                  </p>
                  <button
                    onClick={() => router.push(`/dashboard/novels/${params.id}`)}
                    className="mt-3 w-full px-3 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                  >
                    返回章节列表
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}