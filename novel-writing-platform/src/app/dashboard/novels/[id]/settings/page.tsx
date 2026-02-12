'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, BookOpen, Globe, Users, Target, Settings } from 'lucide-react'
import ResponsiveLayout from '@/components/ResponsiveLayout'

export default function NovelSettingsPage() {
  const params = useParams()
  const router = useRouter()
  const novelId = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : ''
  
  const [novel, setNovel] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
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

  const handleSave = async () => {
    if (!novel) return

    setSaving(true)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/novels/${novelId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: novel.title,
          description: novel.description,
          outline: novel.outline,
          worldSetting: novel.worldSetting,
          protagonist: novel.protagonist
        })
      })
      
      if (response.ok) {
        setHasChanges(false)
        alert('保存成功')
      } else {
        alert('保存失败')
      }
    } catch (error) {
      alert('保存失败')
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setNovel((prev: any) => prev ? { ...prev, [field]: value } : null)
    setHasChanges(true)
  }

  if (loading) {
    return (
      <ResponsiveLayout title="加载中...">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </ResponsiveLayout>
    )
  }

  if (error || !novel) {
    return (
      <ResponsiveLayout title="错误">
        <div className="text-center py-12">
          <Settings className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">无法加载设置</h2>
          <p className="text-gray-600 mb-4">{error || '小说不存在'}</p>
          <button 
            onClick={() => router.back()}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回上页
          </button>
        </div>
      </ResponsiveLayout>
    )
  }

  return (
    <ResponsiveLayout
      title="小说设置"
      showBreadcrumb={true}
      breadcrumbItems={[
        { label: '创作中心', href: '/dashboard' },
        { label: '我的小说', href: '/dashboard/novels' },
        { label: novel.title, href: `/dashboard/novels/${novelId}` },
        { label: '设置' }
      ]}
    >
      <div className="max-w-4xl mx-auto">
        {/* 基本信息 */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <div className="flex items-center mb-6">
            <BookOpen className="h-5 w-5 text-indigo-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">基本信息</h2>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                小说标题
              </label>
              <input
                type="text"
                value={novel.title || ''}
                onChange={(e) => handleChange('title', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="请输入小说标题"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                小说简介
              </label>
              <textarea
                value={novel.description || ''}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="请输入小说简介，让读者了解你的故事..."
              />
            </div>
          </div>
        </div>

        {/* 故事设定 */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <div className="flex items-center mb-6">
            <Target className="h-5 w-5 text-indigo-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">故事设定</h2>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                故事大纲
              </label>
              <textarea
                value={novel.outline || ''}
                onChange={(e) => handleChange('outline', e.target.value)}
                rows={8}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="描述故事的总体大纲和情节走向..."
              />
              <p className="text-sm text-gray-500 mt-2">
                详细的 story outline 有助于你更好地组织故事结构和节奏
              </p>
            </div>
          </div>
        </div>

        {/* 世界观设定 */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <div className="flex items-center mb-6">
            <Globe className="h-5 w-5 text-indigo-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">世界观设定</h2>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                世界观描述
              </label>
              <textarea
                value={novel.worldSetting || ''}
                onChange={(e) => handleChange('worldSetting', e.target.value)}
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="描述故事发生的时代背景、地理环境、社会结构等..."
              />
              <p className="text-sm text-gray-500 mt-2">
                丰富的世界观设定能让读者更好地沉浸在故事中
              </p>
            </div>
          </div>
        </div>

        {/* 主角设定 */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <div className="flex items-center mb-6">
            <Users className="h-5 w-5 text-indigo-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">主角设定</h2>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                主角描述
              </label>
              <textarea
                value={novel.protagonist || ''}
                onChange={(e) => handleChange('protagonist', e.target.value)}
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="描述主角的性格特点、背景故事、目标动机等..."
              />
              <p className="text-sm text-gray-500 mt-2">
                丰满的主角形象是故事成功的关键
              </p>
            </div>
          </div>
        </div>

        {/* 快速导航 */}
        <div className="bg-linear-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">快速导航</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href={`/dashboard/novels/${novelId}/characters`}
              className="flex items-center p-4 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <Users className="h-5 w-5 text-blue-600 mr-3" />
              <div>
                <div className="font-medium text-gray-900">角色管理</div>
                <div className="text-sm text-gray-600">创建和管理故事角色</div>
              </div>
            </Link>
            
            <Link
              href={`/dashboard/novels/${novelId}/world-settings`}
              className="flex items-center p-4 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <Globe className="h-5 w-5 text-green-600 mr-3" />
              <div>
                <div className="font-medium text-gray-900">世界观管理</div>
                <div className="text-sm text-gray-600">完善世界观设定</div>
              </div>
            </Link>
            
            <Link
              href={`/dashboard/novels/${novelId}/statistics`}
              className="flex items-center p-4 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <Settings className="h-5 w-5 text-purple-600 mr-3" />
              <div>
                <div className="font-medium text-gray-900">数据统计</div>
                <div className="text-sm text-gray-600">查看写作数据分析</div>
              </div>
            </Link>
          </div>
        </div>

        {/* 保存按钮 */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回
          </button>
          
          {hasChanges && (
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-600">有未保存的更改</span>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
              >
                <Save className="h-4 w-4 mr-2" />
                {saving ? '保存中...' : '保存更改'}
              </button>
            </div>
          )}
        </div>
      </div>
    </ResponsiveLayout>
  )
}