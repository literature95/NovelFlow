'use client'

import { useState, useEffect } from 'react'
import { 
  BarChart3, 
  TrendingUp, 
  Calendar, 
  FileText, 
  Clock,
  BookOpen,
  Users,
  Target,
  Award,
  Activity
} from 'lucide-react'

export default function NovelsStatisticsPage() {
  const [stats, setStats] = useState<{
    totalNovels: number
    totalChapters: number
    totalWords: number
    publishedNovels: number
    draftNovels: number
    todayWords: number
    weekWords: number
    monthWords: number
    readingTime: number
    genres: Array<{ name: string; count: number; words: number }>
    recentActivity: Array<{ action: string; target: string; time: string }>
  }>({
    totalNovels: 0,
    totalChapters: 0,
    totalWords: 0,
    publishedNovels: 0,
    draftNovels: 0,
    todayWords: 0,
    weekWords: 0,
    monthWords: 0,
    readingTime: 0,
    genres: [],
    recentActivity: []
  })

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStatistics()
  }, [])

  const fetchStatistics = async () => {
    try {
      const token = localStorage.getItem('token')
      
      // 获取统计数据
      const response = await fetch('/api/user/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        // 添加模拟的统计数据
        setStats({
          totalNovels: data.totalNovels || 0,
          totalChapters: data.totalChapters || 0,
          totalWords: data.totalWords || 0,
          publishedNovels: Math.floor((data.totalNovels || 0) * 0.7),
          draftNovels: Math.floor((data.totalNovels || 0) * 0.3),
          todayWords: 2500,
          weekWords: 15000,
          monthWords: 60000,
          readingTime: Math.floor((data.totalWords || 0) / 200), // 假设每分钟200字
          genres: [
            { name: '玄幻', count: 5, words: 120000 },
            { name: '都市', count: 3, words: 80000 },
            { name: '科幻', count: 2, words: 60000 },
            { name: '言情', count: 4, words: 90000 }
          ],
          recentActivity: [
            { action: '创建了新章节', target: '第一章：开始', time: '2小时前' },
            { action: '发布了小说', target: '都市传说', time: '1天前' },
            { action: '编辑了内容', target: '第二章：冲突', time: '2天前' },
            { action: '添加了角色', target: '张三', time: '3天前' }
          ]
        })
      }
    } catch (error) {
      console.error('获取统计数据失败:', error)
    } finally {
      setLoading(false)
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
      {/* 页面标题 */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">创作统计</h1>
        <p className="mt-2 text-gray-600">
          查看你的创作数据、写作进度和成就统计
        </p>
      </div>

      {/* 总览统计 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-linear-to-br from-blue-500 to-blue-600 text-white rounded-xl p-6">
          <div className="flex items-center">
            <BookOpen className="h-8 w-8 opacity-80" />
            <div className="ml-4">
              <p className="text-blue-100 text-sm">总作品数</p>
              <p className="text-2xl font-bold">{stats.totalNovels}</p>
            </div>
          </div>
        </div>

        <div className="bg-linear-to-br from-green-500 to-green-600 text-white rounded-xl p-6">
          <div className="flex items-center">
            <FileText className="h-8 w-8 opacity-80" />
            <div className="ml-4">
              <p className="text-green-100 text-sm">总章节数</p>
              <p className="text-2xl font-bold">{stats.totalChapters}</p>
            </div>
          </div>
        </div>

        <div className="bg-linear-to-br from-purple-500 to-purple-600 text-white rounded-xl p-6">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 opacity-80" />
            <div className="ml-4">
              <p className="text-purple-100 text-sm">总字数</p>
              <p className="text-2xl font-bold">{stats.totalWords.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-linear-to-br from-orange-500 to-orange-600 text-white rounded-xl p-6">
          <div className="flex items-center">
            <Clock className="h-8 w-8 opacity-80" />
            <div className="ml-4">
              <p className="text-orange-100 text-sm">阅读时长</p>
              <p className="text-2xl font-bold">{stats.readingTime}分钟</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 写作进度 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Target className="h-5 w-5 mr-2 text-indigo-600" />
            写作进度
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">今日目标</span>
                <span className="text-sm text-gray-500">{stats.todayWords} / 3000字</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min((stats.todayWords / 3000) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">本周目标</span>
                <span className="text-sm text-gray-500">{stats.weekWords} / 15000字</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min((stats.weekWords / 15000) * 100, 100)}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">本月目标</span>
                <span className="text-sm text-gray-500">{stats.monthWords} / 60000字</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min((stats.monthWords / 60000) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* 作品状态分布 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <BarChart3 className="h-5 w-5 mr-2 text-indigo-600" />
            作品状态
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="ml-3 text-sm font-medium text-gray-700">已发布</span>
              </div>
              <span className="text-lg font-semibold text-green-600">{stats.publishedNovels}</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="ml-3 text-sm font-medium text-gray-700">草稿</span>
              </div>
              <span className="text-lg font-semibold text-yellow-600">{stats.draftNovels}</span>
            </div>

            <div className="pt-3 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">完成率</span>
                <span className="text-lg font-semibold text-indigo-600">
                  {stats.totalNovels > 0 ? Math.round((stats.publishedNovels / stats.totalNovels) * 100) : 0}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 类型分布 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Award className="h-5 w-5 mr-2 text-indigo-600" />
            类型分布
          </h3>
          <div className="space-y-3">
            {stats.genres.map((genre, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center flex-1">
                  <div 
                    className="w-3 h-3 rounded-full mr-3"
                    style={{ 
                      backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'][index % 4] 
                    }}
                  ></div>
                  <span className="text-sm font-medium text-gray-700">{genre.name}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-500">{genre.count}部</span>
                  <span className="text-sm font-medium text-gray-900">{genre.words.toLocaleString()}字</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 最近活动 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Activity className="h-5 w-5 mr-2 text-indigo-600" />
            最近活动
          </h3>
          <div className="space-y-3">
            {stats.recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="shrink-0 w-2 h-2 bg-indigo-400 rounded-full mt-2"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">
                    <span className="font-medium">{activity.action}</span>
                    <span className="text-gray-600 ml-1">{activity.target}</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 成就徽章 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Award className="h-5 w-5 mr-2 text-indigo-600" />
          写作成就
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <BookOpen className="h-6 w-6 text-yellow-600" />
            </div>
            <p className="text-sm font-medium text-gray-900">初出茅庐</p>
            <p className="text-xs text-gray-500">创作第一部小说</p>
          </div>
          
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <p className="text-sm font-medium text-gray-900">勤奋写作</p>
            <p className="text-xs text-gray-500">累计10万字</p>
          </div>
          
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Target className="h-6 w-6 text-green-600" />
            </div>
            <p className="text-sm font-medium text-gray-900">日更达人</p>
            <p className="text-xs text-gray-500">连续更新30天</p>
          </div>
          
          <div className="text-center p-4 border border-gray-200 rounded-lg opacity-50">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Award className="h-6 w-6 text-gray-400" />
            </div>
            <p className="text-sm font-medium text-gray-500">人气作家</p>
            <p className="text-xs text-gray-500">获得1000个赞</p>
          </div>
        </div>
      </div>
    </div>
  )
}