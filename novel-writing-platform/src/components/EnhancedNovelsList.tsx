'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Plus, 
  Edit, 
  Trash2, 
  BookOpen, 
  Grid3x3, 
  List, 
  LayoutGrid,
  Search,
  Filter,
  Download,
  Eye,
  Calendar,
  FileText,
  BarChart3,
  Star,
  MoreHorizontal,
  ChevronDown,
  Check,
  X
} from 'lucide-react'

interface Novel {
  id: string
  title: string
  description: string
  status: string
  genre: string
  createdAt: string
  updatedAt: string
  _count: {
    chapters: number
  }
}

type ViewMode = 'grid' | 'list' | 'card'
type SortOption = 'title' | 'updatedAt' | 'chapters' | 'status'
type FilterStatus = 'all' | 'draft' | 'published' | 'archived'

export default function EnhancedNovelsList() {
  const [novels, setNovels] = useState<Novel[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<SortOption>('updatedAt')
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all')
  const [selectedNovels, setSelectedNovels] = useState<string[]>([])
  const [showBulkActions, setShowBulkActions] = useState(false)
  const [showFilterDropdown, setShowFilterDropdown] = useState(false)

  useEffect(() => {
    fetchNovels()
  }, [])

  const fetchNovels = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/novels', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        // 添加模拟的状态和类型字段
        const enhancedNovels = data.novels.map((novel: any) => ({
          ...novel,
          status: Math.random() > 0.5 ? 'published' : 'draft',
          genre: ['玄幻', '都市', '科幻', '言情', '武侠'][Math.floor(Math.random() * 5)]
        }))
        setNovels(enhancedNovels)
      }
    } catch (error) {
      console.error('获取小说列表失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这部小说吗？此操作不可恢复。')) {
      return
    }

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/novels/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        setNovels(novels.filter(novel => novel.id !== id))
        setSelectedNovels(selectedNovels.filter(novelId => novelId !== id))
      } else {
        alert('删除失败')
      }
    } catch (error) {
      console.error('删除小说失败:', error)
      alert('删除失败')
    }
  }

  const handleBulkDelete = async () => {
    if (!confirm(`确定要删除选中的 ${selectedNovels.length} 部小说吗？此操作不可恢复。`)) {
      return
    }

    try {
      const token = localStorage.getItem('token')
      const deletePromises = selectedNovels.map(id => 
        fetch(`/api/novels/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
      )

      await Promise.all(deletePromises)
      setNovels(novels.filter(novel => !selectedNovels.includes(novel.id)))
      setSelectedNovels([])
      setShowBulkActions(false)
    } catch (error) {
      console.error('批量删除失败:', error)
      alert('批量删除失败')
    }
  }

  const handleSelectNovel = (id: string) => {
    setSelectedNovels(prev => 
      prev.includes(id) 
        ? prev.filter(novelId => novelId !== id)
        : [...prev, id]
    )
  }

  const handleSelectAll = () => {
    if (selectedNovels.length === filteredNovels.length) {
      setSelectedNovels([])
    } else {
      setSelectedNovels(filteredNovels.map(novel => novel.id))
    }
  }

  const filteredNovels = novels.filter(novel => {
    const matchesSearch = novel.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         novel.description?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === 'all' || novel.status === filterStatus
    return matchesSearch && matchesStatus
  }).sort((a, b) => {
    switch (sortBy) {
      case 'title':
        return a.title.localeCompare(b.title)
      case 'updatedAt':
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      case 'chapters':
        return b._count.chapters - a._count.chapters
      case 'status':
        return a.status.localeCompare(b.status)
      default:
        return 0
    }
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800'
      case 'draft':
        return 'bg-yellow-100 text-yellow-800'
      case 'archived':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'published':
        return '已发布'
      case 'draft':
        return '草稿'
      case 'archived':
        return '已归档'
      default:
        return '未知'
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 工具栏 */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 sm:items-center sm:justify-between">
        {/* 左侧工具 */}
        <div className="flex items-center space-x-4">
          {/* 搜索框 */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="搜索小说..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* 筛选器 */}
          <div className="relative">
            <button
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Filter className="h-4 w-4 mr-2" />
              筛选
              <ChevronDown className="h-4 w-4 ml-2" />
            </button>
            
            {showFilterDropdown && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <div className="p-2">
                  <button
                    onClick={() => { setFilterStatus('all'); setShowFilterDropdown(false) }}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded"
                  >
                    全部状态
                  </button>
                  <button
                    onClick={() => { setFilterStatus('draft'); setShowFilterDropdown(false) }}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded"
                  >
                    草稿
                  </button>
                  <button
                    onClick={() => { setFilterStatus('published'); setShowFilterDropdown(false) }}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded"
                  >
                    已发布
                  </button>
                  <button
                    onClick={() => { setFilterStatus('archived'); setShowFilterDropdown(false) }}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded"
                  >
                    已归档
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 排序 */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="updatedAt">最近更新</option>
            <option value="title">标题</option>
            <option value="chapters">章节数</option>
            <option value="status">状态</option>
          </select>
        </div>

        {/* 右侧工具 */}
        <div className="flex items-center space-x-2">
          {/* 视图模式切换 */}
          <div className="flex items-center border border-gray-300 rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-500 hover:bg-gray-50'}`}
            >
              <Grid3x3 className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-500 hover:bg-gray-50'}`}
            >
              <List className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('card')}
              className={`p-2 ${viewMode === 'card' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-500 hover:bg-gray-50'}`}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
          </div>

          {/* 创建按钮 */}
          <Link
            href="/dashboard/novels/create"
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            创建新小说
          </Link>
        </div>
      </div>

      {/* 批量操作栏 */}
      {selectedNovels.length > 0 && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={selectedNovels.length === filteredNovels.length}
                onChange={handleSelectAll}
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <span className="ml-3 text-sm text-indigo-800">
                已选择 {selectedNovels.length} 项
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <button className="inline-flex items-center px-3 py-1.5 text-sm text-indigo-600 hover:text-indigo-800">
                <Download className="h-4 w-4 mr-1" />
                导出
              </button>
              <button className="inline-flex items-center px-3 py-1.5 text-sm text-red-600 hover:text-red-800">
                <Trash2 className="h-4 w-4 mr-1" />
                删除
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 统计信息 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BookOpen className="h-5 w-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-500">全部小说</p>
              <p className="text-lg font-semibold text-gray-900">{novels.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <FileText className="h-5 w-5 text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-500">总章节</p>
              <p className="text-lg font-semibold text-gray-900">
                {novels.reduce((sum, novel) => sum + novel._count.chapters, 0)}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Star className="h-5 w-5 text-yellow-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-500">已发布</p>
              <p className="text-lg font-semibold text-gray-900">
                {novels.filter(novel => novel.status === 'published').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <BarChart3 className="h-5 w-5 text-purple-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-500">草稿</p>
              <p className="text-lg font-semibold text-gray-900">
                {novels.filter(novel => novel.status === 'draft').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 小说列表 */}
      {filteredNovels.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">没有找到小说</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchQuery || filterStatus !== 'all' ? '尝试调整搜索条件或筛选器' : '开始创建你的第一部小说吧'}
          </p>
          <div className="mt-6">
            <Link
              href="/dashboard/novels/create"
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Plus className="mr-2 h-4 w-4" />
              创建新小说
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* 网格视图 */}
          {viewMode === 'grid' && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredNovels.map((novel) => (
                <div key={novel.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900 truncate">
                          {novel.title}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                          {novel.description || '暂无描述'}
                        </p>
                      </div>
                      <div className="ml-2">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(novel.status)}`}>
                          {getStatusText(novel.status)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">类型</span>
                        <span className="font-medium text-gray-900">{novel.genre}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">章节</span>
                        <span className="font-medium text-gray-900">{novel._count.chapters}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">更新</span>
                        <span className="font-medium text-gray-900">
                          {new Date(novel.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 flex justify-between">
                      <Link
                        href={`/dashboard/novels/${novel.id}`}
                        className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-800"
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        查看
                      </Link>
                      <div className="flex items-center space-x-1">
                        <Link
                          href={`/dashboard/novels/${novel.id}`}
                          className="p-1.5 text-gray-400 hover:text-gray-600"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(novel.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 列表视图 */}
          {viewMode === 'list' && (
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      小说信息
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      类型
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      章节
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      状态
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      更新时间
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredNovels.map((novel) => (
                    <tr key={novel.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{novel.title}</div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {novel.description || '暂无描述'}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">{novel.genre}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">{novel._count.chapters}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(novel.status)}`}>
                          {getStatusText(novel.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(novel.updatedAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <Link
                            href={`/dashboard/novels/${novel.id}`}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                          <Link
                            href={`/dashboard/novels/${novel.id}`}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            <Edit className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(novel.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* 卡片视图 */}
          {viewMode === 'card' && (
            <div className="grid grid-cols-1 gap-6">
              {filteredNovels.map((novel) => (
                <div key={novel.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <h3 className="text-lg font-medium text-gray-900">{novel.title}</h3>
                        <span className={`ml-3 inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(novel.status)}`}>
                          {getStatusText(novel.status)}
                        </span>
                      </div>
                      <p className="mt-2 text-gray-600">
                        {novel.description || '暂无描述'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex items-center space-x-6 text-sm text-gray-500">
                    <span>类型: <span className="font-medium text-gray-900">{novel.genre}</span></span>
                    <span>章节: <span className="font-medium text-gray-900">{novel._count.chapters}</span></span>
                    <span>更新: <span className="font-medium text-gray-900">{new Date(novel.updatedAt).toLocaleDateString()}</span></span>
                  </div>

                  <div className="mt-4 flex justify-between">
                    <Link
                      href={`/dashboard/novels/${novel.id}`}
                      className="inline-flex items-center px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-800 border border-indigo-300 rounded-lg hover:bg-indigo-50"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      查看详情
                    </Link>
                    <div className="flex items-center space-x-2">
                      <Link
                        href={`/dashboard/novels/${novel.id}`}
                        className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(novel.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}