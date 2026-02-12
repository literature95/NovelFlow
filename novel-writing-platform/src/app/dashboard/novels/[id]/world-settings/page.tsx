'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Plus, Globe, Edit, Trash2, MapPin, Clock, BookOpen, Users, Zap, Coins, Crown, Sparkles } from 'lucide-react'
import ReactMarkdown from 'react-markdown'

interface WorldSetting {
  id: string
  title: string
  content: string
  category: string
  createdAt: string
  updatedAt: string
}

interface CategorizedSettings {
  [category: string]: WorldSetting[]
}

const categoryIcons: { [key: string]: any } = {
  '地理': MapPin,
  '历史': Clock,
  '文化': BookOpen,
  '政治': Users,
  '经济': Coins,
  '科技': Zap,
  '魔法': Sparkles,
  '种族': Crown,
  '宗教': Globe,
  '其他': Sparkles
}

const categoryColors: { [key: string]: string } = {
  '地理': 'green',
  '历史': 'yellow',
  '文化': 'blue',
  '政治': 'red',
  '经济': 'purple',
  '科技': 'indigo',
  '魔法': 'pink',
  '种族': 'orange',
  '宗教': 'cyan',
  '其他': 'gray'
}

export default function WorldSettingsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [worldSettings, setWorldSettings] = useState<WorldSetting[]>([])
  const [categorizedSettings, setCategorizedSettings] = useState<CategorizedSettings>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [novelTitle, setNovelTitle] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('全部')

  useEffect(() => {
    fetchWorldSettings()
    fetchNovelInfo()
  }, [])

  const fetchWorldSettings = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/novels/${params.id}/world-settings`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setWorldSettings(data.worldSettings)
        setCategorizedSettings(data.categorizedSettings)
      } else {
        setError('获取世界观设定失败')
      }
    } catch (error) {
      console.error('获取世界观设定失败:', error)
      setError('获取世界观设定失败')
    } finally {
      setLoading(false)
    }
  }

  const fetchNovelInfo = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/novels/${params.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setNovelTitle(data.novel.title)
      }
    } catch (error) {
      console.error('获取小说信息失败:', error)
    }
  }

  const deleteSetting = async (settingId: string) => {
    if (!confirm('确定要删除这个世界观设定吗？')) {
      return
    }

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/novels/${params.id}/world-settings/${settingId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        fetchWorldSettings()
      } else {
        setError('删除世界观设定失败')
      }
    } catch (error) {
      console.error('删除世界观设定失败:', error)
      setError('删除世界观设定失败')
    }
  }

  const getFilteredSettings = () => {
    if (selectedCategory === '全部') {
      return Object.entries(categorizedSettings).map(([category, settings]) => ({
        category,
        settings
      }))
    }
    
    const settings = categorizedSettings[selectedCategory] || []
    return [{ category: selectedCategory, settings }]
  }

  const getCategoryStats = () => {
    const stats: { [key: string]: number } = {}
    Object.entries(categorizedSettings).forEach(([category, settings]) => {
      stats[category] = settings.length
    })
    return stats
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">加载中...</p>
        </div>
      </div>
    )
  }

  const categoryStats = getCategoryStats()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link 
                href={`/dashboard/novels/${params.id}`}
                className="text-gray-600 hover:text-gray-900"
              >
                ← 返回小说
              </Link>
              <h1 className="text-xl font-semibold text-gray-900">
                {novelTitle} - 世界观设定
              </h1>
            </div>
            <Link
              href={`/dashboard/novels/${params.id}/world-settings/create`}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              创建设定
            </Link>
          </div>
        </div>
      </div>

      {/* 主要内容 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* 分类筛选 */}
        <div className="mb-8 bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Globe className="h-6 w-6 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">世界观分类</h2>
            </div>
            <div className="text-sm text-gray-600">
              共 {worldSettings.length} 条设定
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3 mb-6">
            <button
              onClick={() => setSelectedCategory('全部')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === '全部'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              全部 ({worldSettings.length})
            </button>
            {Object.entries(categoryStats).map(([category, count]) => {
              const Icon = categoryIcons[category] || Sparkles
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {category} ({count})
                </button>
              )
            })}
          </div>
        </div>

        {/* 设定列表 */}
        {worldSettings.length === 0 ? (
          <div className="text-center py-12">
            <Globe className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">还没有世界观设定</h3>
            <p className="text-gray-600 mb-6">开始构建你的小说世界观吧</p>
            <Link
              href={`/dashboard/novels/${params.id}/world-settings/create`}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              创建第一个设定
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {getFilteredSettings().map(({ category, settings }) => {
              const Icon = categoryIcons[category] || Sparkles
              const colorClass = categoryColors[category] || 'gray'
              
              if (settings.length === 0) return null
              
              return (
                <div key={category} className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <div className={`p-2 bg-${colorClass}-100 rounded-lg`}>
                      <Icon className={`h-5 w-5 text-${colorClass}-600`} />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">{category}</h3>
                    <span className="text-sm text-gray-500">({settings.length})</span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {settings.map((setting) => (
                      <div 
                        key={setting.id} 
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <h4 className="font-medium text-gray-900 flex-1 mr-2">
                            {setting.title}
                          </h4>
                          <div className="flex space-x-2">
                            <Link
                              href={`/dashboard/novels/${params.id}/world-settings/${setting.id}/edit`}
                              className={`text-${colorClass}-600 hover:text-${colorClass}-800`}
                            >
                              <Edit className="h-4 w-4" />
                            </Link>
                            <button
                              onClick={() => deleteSetting(setting.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        
                        <div className="text-gray-600 text-sm line-clamp-3 mb-3">
                          <ReactMarkdown>{setting.content}</ReactMarkdown>
                        </div>
                        
                        <div className="text-xs text-gray-500">
                          创建于 {new Date(setting.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}