'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Save, ArrowLeft, Globe, MapPin, Clock, BookOpen, Users, Zap, Coins, Crown, Sparkles } from 'lucide-react'

const categories = [
  { value: '地理', label: '地理', icon: MapPin, description: '地形地貌、气候环境、地理位置等' },
  { value: '历史', label: '历史', icon: Clock, description: '历史事件、时间线、重要时代等' },
  { value: '文化', label: '文化', icon: BookOpen, description: '文化习俗、语言文字、艺术音乐等' },
  { value: '政治', label: '政治', icon: Users, description: '政治制度、政权结构、法律体系等' },
  { value: '经济', label: '经济', icon: Coins, description: '经济体系、货币贸易、资源分配等' },
  { value: '科技', label: '科技', icon: Zap, description: '科技水平、发明创造、工业技术等' },
  { value: '魔法', label: '魔法', icon: Sparkles, description: '魔法体系、咒语法术、神秘力量等' },
  { value: '种族', label: '种族', icon: Crown, description: '种族特征、种族关系、种族分布等' },
  { value: '宗教', label: '宗教', icon: Globe, description: '宗教信仰、神灵体系、宗教组织等' },
  { value: '其他', label: '其他', icon: Sparkles, description: '其他未分类的世界观设定' }
]

export default function CreateWorldSettingPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [novelTitle, setNovelTitle] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('地理')
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '地理'
  })

  useEffect(() => {
    fetchNovelInfo()
  }, [])

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title.trim() || !formData.content.trim()) {
      setError('标题和内容不能为空')
      return
    }

    setLoading(true)
    setError('')

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/novels/${params.id}/world-settings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        router.push(`/dashboard/novels/${params.id}/world-settings`)
      } else {
        const data = await response.json()
        setError(data.error || '创建世界观设定失败')
      }
    } catch (error) {
      console.error('创建世界观设定失败:', error)
      setError('创建世界观设定失败')
    } finally {
      setLoading(false)
    }
  }

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category)
    setFormData(prev => ({ ...prev, category }))
  }

  const selectedCategoryInfo = categories.find(cat => cat.value === selectedCategory)
  const Icon = selectedCategoryInfo?.icon || Sparkles

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link 
                href={`/dashboard/novels/${params.id}/world-settings`}
                className="text-gray-600 hover:text-gray-900"
              >
                ← 返回世界观设定
              </Link>
              <h1 className="text-xl font-semibold text-gray-900">
                创建世界观设定
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* 主要内容 */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* 分类选择 */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-2 mb-6">
              <Globe className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">选择分类</h2>
            </div>
            
            <div className="mb-4">
              <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                <Icon className="h-6 w-6 text-blue-600" />
                <div>
                  <h3 className="font-medium text-blue-900">{selectedCategory}</h3>
                  <p className="text-sm text-blue-700">{selectedCategoryInfo?.description}</p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {categories.map((category) => {
                const CategoryIcon = category.icon
                return (
                  <button
                    key={category.value}
                    type="button"
                    onClick={() => handleCategorySelect(category.value)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      selectedCategory === category.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <CategoryIcon className={`h-5 w-5 mx-auto mb-1 ${
                      selectedCategory === category.value ? 'text-blue-600' : 'text-gray-500'
                    }`} />
                    <div className={`text-xs font-medium ${
                      selectedCategory === category.value ? 'text-blue-900' : 'text-gray-700'
                    }`}>
                      {category.label}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* 基本信息 */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-2 mb-6">
              <Icon className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">基本信息</h2>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                设定标题 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="请输入世界观设定的标题"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                设定内容 <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={12}
                placeholder="请详细描述这个世界观设定的具体内容..."
                required
              />
              <div className="mt-2 text-sm text-gray-500">
                {formData.content.length} 个字符
              </div>
            </div>
          </div>

          {/* 提交按钮 */}
          <div className="flex justify-end space-x-4">
            <Link
              href={`/dashboard/novels/${params.id}/world-settings`}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              取消
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  创建中...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  创建设定
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}