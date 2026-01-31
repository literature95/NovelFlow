'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft, 
  TrendingUp, 
  FileText, 
  Clock, 
  Target, 
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  BookOpen,
  Users,
  Globe,
  Eye,
  Download,
  RefreshCw
} from 'lucide-react'
import ResponsiveLayout from '@/components/ResponsiveLayout'

interface NovelStats {
  totalWords: number
  totalChapters: number
  publishedChapters: number
  draftChapters: number
  archivedChapters: number
  averageWordsPerChapter: number
  totalReadingTime: number
  wordsToday: number
  lastUpdated: string
  recentActivity: Array<{
    date: string
    wordsWritten: number
    chaptersCreated: number
  }>
}

interface ChapterAnalytics {
  id: string
  title: string
  wordCount: number
  readingTime: number
  status: string
  createdAt: string
  updatedAt: string
  views?: number
  rating?: number
}

export default function NovelStatisticsPage() {
  const params = useParams()
  const router = useRouter()
  const novelId = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : ''
  
  const [novel, setNovel] = useState<any>(null)
  const [stats, setStats] = useState<NovelStats | null>(null)
  const [chapters, setChapters] = useState<ChapterAnalytics[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d')
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    if (novelId) {
      fetchData()
    }
  }, [novelId])

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token')
      const [novelResponse, statsResponse] = await Promise.all([
        fetch(`/api/novels/${novelId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`/api/novels/${novelId}/stats`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ])
      
      if (novelResponse.ok) {
        const novelData = await novelResponse.json()
        setNovel(novelData.novel)
      }
      
      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        setStats(statsData.stats)
        
        // 生成章节分析数据（模拟）
        const chaptersData = novel.chapters?.map((chapter: any) => ({
          id: chapter.id,
          title: chapter.title,
          wordCount: chapter.wordCount || 0,
          readingTime: Math.ceil((chapter.wordCount || 0) / 200),
          status: chapter.status,
          createdAt: chapter.createdAt,
          updatedAt: chapter.updatedAt,
          views: Math.floor(Math.random() * 1000),
          rating: (Math.random() * 5).toFixed(1)
        })) || []
        
        setChapters(chaptersData)
      }
    } catch (error) {
      setError('获取数据失败')
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchData()
    setRefreshing(false)
  }

  const handleExportData = () => {
    if (!stats || !chapters.length) return

    const csvContent = [
      ['章节标题', '字数', '阅读时间', '状态', '创建时间', '更新时间', '浏览量', '评分'],
      ...chapters.map(ch => [
        ch.title,
        ch.wordCount,
        ch.readingTime,
        ch.status,
        new Date(ch.createdAt).toLocaleDateString(),
        new Date(ch.updatedAt).toLocaleDateString(),
        ch.views || 0,
        ch.rating || 0
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `novel-stats-${new Date().toISOString().split('T')[0]}.csv`
    link.click()
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

  if (error || !novel || !stats) {
    return (
      <ResponsiveLayout title="错误">
        <div className="text-center py-12">
          <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">无法加载统计数据</h2>
          <p className="text-gray-600 mb-4">{error || '数据不存在'}</p>
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

  const completionRate = stats.totalChapters > 0 ? (stats.publishedChapters / stats.totalChapters) * 100 : 0

  return (
    <ResponsiveLayout
      title="数据统计"
      showBreadcrumb={true}
      breadcrumbItems={[
        { label: '创作中心', href: '/dashboard' },
        { label: '我的小说', href: '/dashboard/novels' },
        { label: novel.title, href: `/dashboard/novels/${novelId}` },
        { label: '数据统计' }
      ]}
    >
      {/* 操作栏 */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-gray-900">{novel.title} - 数据统计</h1>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 transition-colors"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              刷新
            </button>
            <button
              onClick={handleExportData}
              className="flex items-center px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Download className="h-4 w-4 mr-2" />
              导出数据
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">时间范围:</span>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="7d">最近7天</option>
            <option value="30d">最近30天</option>
            <option value="90d">最近90天</option>
            <option value="all">全部时间</option>
          </select>
        </div>
      </div>

      {/* 核心统计卡片 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <FileText className="h-8 w-8 text-blue-500" />
            <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">总字数</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{stats.totalWords.toLocaleString()}</h3>
          <p className="text-sm text-gray-600 mt-2">平均每章 {stats.averageWordsPerChapter.toLocaleString()} 字</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <BookOpen className="h-8 w-8 text-green-500" />
            <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">章节数</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{stats.totalChapters}</h3>
          <p className="text-sm text-gray-600 mt-2">已发布 {stats.publishedChapters} 章</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <Clock className="h-8 w-8 text-purple-500" />
            <span className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded">阅读时长</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{stats.totalReadingTime} 分钟</h3>
          <p className="text-sm text-gray-600 mt-2">约 {Math.ceil(stats.totalReadingTime / 60)} 小时</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="h-8 w-8 text-orange-500" />
            <span className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded">今日进度</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{stats.wordsToday.toLocaleString()}</h3>
          <p className="text-sm text-gray-600 mt-2">今日写作字数</p>
        </div>
      </div>

      {/* 状态分布 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">章节状态分布</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">已发布</span>
                <span className="text-sm text-gray-600">{stats.publishedChapters} 章</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: `${(stats.publishedChapters / stats.totalChapters) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">草稿</span>
                <span className="text-sm text-gray-600">{stats.draftChapters} 章</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-yellow-500 h-2 rounded-full"
                  style={{ width: `${(stats.draftChapters / stats.totalChapters) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">已归档</span>
                <span className="text-sm text-gray-600">{stats.archivedChapters} 章</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gray-500 h-2 rounded-full"
                  style={{ width: `${(stats.archivedChapters / stats.totalChapters) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">完成度</h3>
          <div className="flex items-center justify-center">
            <div className="relative">
              <div className="w-32 h-32 rounded-full border-8 border-gray-200"></div>
              <div 
                className="absolute top-0 left-0 w-32 h-32 rounded-full border-8 border-indigo-600 border-t-transparent border-r-transparent transform rotate-45"
                style={{ 
                  transform: `rotate(${(completionRate / 100) * 360}deg)`,
                  transition: 'transform 0.5s ease-in-out'
                }}
              ></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{Math.round(completionRate)}%</div>
                  <div className="text-sm text-gray-600">已完成</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 章节详细分析 */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">章节详细分析</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  章节标题
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  字数
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  阅读时间
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  状态
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  浏览量
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  评分
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  更新时间
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {chapters.map((chapter) => (
                <tr key={chapter.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{chapter.title}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{chapter.wordCount.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{chapter.readingTime} 分钟</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      chapter.status === 'published' ? 'bg-green-100 text-green-800' :
                      chapter.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {chapter.status === 'published' ? '已发布' :
                       chapter.status === 'draft' ? '草稿' : '已归档'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{chapter.views?.toLocaleString() || 0}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-sm text-gray-900 mr-1">{chapter.rating || '0'}</span>
                      <span className="text-yellow-400">★</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(chapter.updatedAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </ResponsiveLayout>
  )
}