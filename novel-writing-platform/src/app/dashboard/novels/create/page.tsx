'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save } from 'lucide-react'

export default function CreateNovelPage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    outline: '',
    worldSetting: '',
    protagonist: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/novels', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok) {
        router.push(`/dashboard/novels/${data.novel.id}`)
      } else {
        setError(data.error || '创建失败')
      }
    } catch (error) {
      setError('网络错误，请重试')
    } finally {
      setLoading(false)
    }
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
        <h1 className="text-2xl font-bold text-gray-900">创建新小说</h1>
        <p className="mt-1 text-sm text-gray-600">填写小说的基本信息</p>
      </div>

      {/* 表单 */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">基本信息</h2>
          
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                小说标题 *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="输入小说标题"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                小说简介
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="简要描述你的小说"
              />
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">世界观与人物</h2>
          
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label htmlFor="outline" className="block text-sm font-medium text-gray-700">
                故事大纲
              </label>
              <textarea
                id="outline"
                name="outline"
                rows={4}
                value={formData.outline}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="描述故事的总体大纲和情节走向"
              />
            </div>

            <div>
              <label htmlFor="worldSetting" className="block text-sm font-medium text-gray-700">
                世界观设定
              </label>
              <textarea
                id="worldSetting"
                name="worldSetting"
                rows={4}
                value={formData.worldSetting}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="描述小说的世界观、背景设定等"
              />
            </div>

            <div>
              <label htmlFor="protagonist" className="block text-sm font-medium text-gray-700">
                主角设定
              </label>
              <textarea
                id="protagonist"
                name="protagonist"
                rows={4}
                value={formData.protagonist}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="描述主角的性格、背景、能力等设定"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            <Save className="mr-2 h-4 w-4" />
            {loading ? '创建中...' : '创建小说'}
          </button>
        </div>
      </form>
    </div>
  )
}