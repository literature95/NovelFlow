'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  BookOpen, 
  Plus, 
  TrendingUp, 
  Clock, 
  Target, 
  Zap, 
  FileText,
  Edit3,
  BarChart3,
  Star,
  Calendar,
  Users,
  Brain,
  Database,
  Settings,
  Download,
  RefreshCw,
  Shield,
  Activity
} from 'lucide-react'

export default function Workspace() {
  const [stats, setStats] = useState({
    totalNovels: 0,
    totalChapters: 0,
    totalWords: 0,
    recentNovels: [],
    todayWords: 0,
    weekWords: 0,
    streakDays: 0,
    writingGoals: {
      daily: 2000,
      weekly: 10000
    }
  })

  const [adminStats, setAdminStats] = useState({
    totalUsers: 0,
    totalNovels: 0,
    totalChapters: 0,
    totalWords: 0,
    systemStatus: 'normal',
    lastBackup: null,
    databaseSize: '0 MB'
  })

  const [loading, setLoading] = useState(true)
  const [showAdmin, setShowAdmin] = useState(false)
  const [aiTips, setAiTips] = useState<string[]>([])

  const fetchWorkspaceData = async () => {
    try {
      // 获取基础统计数据（不需要token）
      const statsResponse = await fetch('/api/user/stats')
      
      if (statsResponse.ok) {
        const data = await statsResponse.json()
        setStats(prev => ({
          ...prev,
          ...data
        }))
      }

      // 获取管理员统计数据
      const adminResponse = await fetch('/api/admin/stats')
      if (adminResponse.ok) {
        const adminData = await adminResponse.json()
        setAdminStats(adminData)
      }

      // 生成AI写作建议
      setAiTips([
        "尝试设定固定的写作时间，养成创作习惯",
        "大纲是小说的骨架，先构建好框架再填充细节",
        "人物塑造要立体，给角色设定明确的动机和目标",
        "多读优秀作品，学习他人的写作技巧和结构安排",
        "每天坚持写作，即使只是几百字也很重要"
      ])

      setLoading(false)
    } catch (error) {
      console.error('获取工作台数据失败:', error)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWorkspaceData()
  }, [])

  const handleBackup = async () => {
    try {
      const response = await fetch('/api/admin/backup', {
        method: 'POST'
      })
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `backup-${new Date().toISOString().split('T')[0]}.db`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        alert('备份成功！')
      }
    } catch (error) {
      console.error('备份失败:', error)
      alert('备份失败，请重试')
    }
  }

  const getProgressPercentage = (current: number, goal: number) => {
    return Math.min((current / goal) * 100, 100)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white p-6 rounded-lg shadow animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 工作台标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">工作台</h1>
          <p className="mt-1 text-gray-600">
            管理你的创作项目，追踪写作进度，获取AI创作建议
          </p>
        </div>
        <Link
          href="/dashboard/novels/create"
          className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          新建小说
        </Link>
      </div>

      {/* 个人创作统计横幅 */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold mb-2">个人创作统计</h2>
            <p className="text-blue-100">
              今日已写作 {stats.todayWords} 字，本周累计 {stats.weekWords} 字
            </p>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{stats.todayWords.toLocaleString()}</div>
              <div className="text-sm text-blue-100">今日字数</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{stats.streakDays}</div>
              <div className="text-sm text-blue-100">连续天数</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{stats.totalNovels}</div>
              <div className="text-sm text-blue-100">作品数量</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左侧主要内容 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 写作目标进度 */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Target className="h-5 w-5 mr-2 text-blue-600" />
              写作目标
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">今日目标</span>
                  <span className="font-medium">{stats.todayWords} / {stats.writingGoals.daily}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${getProgressPercentage(stats.todayWords, stats.writingGoals.daily)}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">本周目标</span>
                  <span className="font-medium">{stats.weekWords} / {stats.writingGoals.weekly}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${getProgressPercentage(stats.weekWords, stats.writingGoals.weekly)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* 快速操作 */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Zap className="h-5 w-5 mr-2 text-yellow-500" />
              快速操作
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <Link
                href="/dashboard/novels/create"
                className="group flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all"
              >
                <div className="flex-shrink-0 bg-blue-100 rounded-lg p-2 group-hover:bg-blue-200">
                  <Plus className="h-5 w-5 text-blue-600" />
                </div>
                <div className="ml-3">
                  <p className="font-medium text-gray-900 text-sm">创建新小说</p>
                  <p className="text-xs text-gray-500">开始新的创作</p>
                </div>
              </Link>

              <Link
                href="/dashboard/novels"
                className="group flex items-center p-4 border border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all"
              >
                <div className="flex-shrink-0 bg-green-100 rounded-lg p-2 group-hover:bg-green-200">
                  <BookOpen className="h-5 w-5 text-green-600" />
                </div>
                <div className="ml-3">
                  <p className="font-medium text-gray-900 text-sm">我的作品</p>
                  <p className="text-xs text-gray-500">管理小说</p>
                </div>
              </Link>

              <Link
                href="/dashboard/ai-workshop"
                className="group flex items-center p-4 border border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all"
              >
                <div className="flex-shrink-0 bg-purple-100 rounded-lg p-2 group-hover:bg-purple-200">
                  <Brain className="h-5 w-5 text-purple-600" />
                </div>
                <div className="ml-3">
                  <p className="font-medium text-gray-900 text-sm">AI助手</p>
                  <p className="text-xs text-gray-500">获取灵感</p>
                </div>
              </Link>

              <Link
                href="/dashboard/settings"
                className="group flex items-center p-4 border border-gray-200 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-all"
              >
                <div className="flex-shrink-0 bg-orange-100 rounded-lg p-2 group-hover:bg-orange-200">
                  <BarChart3 className="h-5 w-5 text-orange-600" />
                </div>
                <div className="ml-3">
                  <p className="font-medium text-gray-900 text-sm">数据分析</p>
                  <p className="text-xs text-gray-500">查看统计</p>
                </div>
              </Link>

              <button
                onClick={() => setShowAdmin(!showAdmin)}
                className="group flex items-center p-4 border border-gray-200 rounded-lg hover:border-red-500 hover:bg-red-50 transition-all w-full text-left"
              >
                <div className="flex-shrink-0 bg-red-100 rounded-lg p-2 group-hover:bg-red-200">
                  <Shield className="h-5 w-5 text-red-600" />
                </div>
                <div className="ml-3">
                  <p className="font-medium text-gray-900 text-sm">后台管理</p>
                  <p className="text-xs text-gray-500">系统管理</p>
                </div>
              </button>
            </div>
          </div>

          {/* 后台管理面板 */}
          {showAdmin && (
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Shield className="h-5 w-5 mr-2 text-red-600" />
                后台管理
              </h3>
              
              {/* 系统统计 */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <Users className="h-8 w-8 text-blue-600 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">总用户数</p>
                      <p className="text-xl font-bold text-blue-600">{adminStats.totalUsers}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <BookOpen className="h-8 w-8 text-green-600 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">总小说数</p>
                      <p className="text-xl font-bold text-green-600">{adminStats.totalNovels}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <FileText className="h-8 w-8 text-purple-600 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">总章节数</p>
                      <p className="text-xl font-bold text-purple-600">{adminStats.totalChapters}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-orange-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <Edit3 className="h-8 w-8 text-orange-600 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">总字数</p>
                      <p className="text-xl font-bold text-orange-600">{adminStats.totalWords.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 系统操作 */}
              <div className="border-t pt-4">
                <h4 className="text-md font-medium text-gray-900 mb-3">系统操作</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <button
                    onClick={handleBackup}
                    className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    数据库备份
                  </button>
                  
                  <button
                    onClick={fetchWorkspaceData}
                    className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    刷新数据
                  </button>
                  
                  <div className="flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg">
                    <Database className="h-4 w-4 mr-2" />
                    {adminStats.databaseSize}
                  </div>
                </div>
              </div>

              {/* 系统状态 */}
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Activity className="h-5 w-5 text-green-600 mr-2" />
                    <span className="text-sm font-medium text-gray-900">系统状态</span>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    adminStats.systemStatus === 'normal' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {adminStats.systemStatus === 'normal' ? '正常运行' : '异常'}
                  </span>
                </div>
                {adminStats.lastBackup && (
                  <p className="text-xs text-gray-500 mt-2">
                    最后备份: {new Date(adminStats.lastBackup).toLocaleString()}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* 最近作品 */}
          {stats.recentNovels && stats.recentNovels.length > 0 && (
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-blue-600" />
                  最近编辑
                </h3>
                <Link
                  href="/dashboard/novels"
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  查看全部
                </Link>
              </div>
              <div className="space-y-3">
                {stats.recentNovels.slice(0, 3).map((novel: any) => (
                  <Link
                    key={novel.id}
                    href={`/dashboard/novels/${novel.id}`}
                    className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-base font-medium text-gray-900 truncate">{novel.title}</p>
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                          {novel.description || '暂无描述'}
                        </p>
                      </div>
                      <div className="ml-4 flex-shrink-0 text-right">
                        <p className="text-sm text-gray-500">
                          {new Date(novel.updatedAt).toLocaleDateString()}
                        </p>
                        <div className="flex items-center mt-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-xs text-gray-500 ml-1">进行中</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 右侧面板 */}
        <div className="space-y-6">
          {/* 创作统计卡片 */}
          <div className="grid grid-cols-1 gap-4">
            <div className="bg-white shadow rounded-lg p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-100 rounded-lg p-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-500">章节总数</p>
                  <p className="text-lg font-semibold text-gray-900">{stats.totalChapters}</p>
                </div>
              </div>
            </div>

            <div className="bg-white shadow rounded-lg p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-100 rounded-lg p-2">
                  <Edit3 className="h-5 w-5 text-green-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-500">总字数</p>
                  <p className="text-lg font-semibold text-gray-900">{stats.totalWords.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* AI写作建议 */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Brain className="h-5 w-5 mr-2 text-purple-600" />
              AI写作建议
            </h3>
            <div className="space-y-3">
              {aiTips.map((tip, index) => (
                <div key={index} className="flex items-start">
                  <div className="flex-shrink-0 w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
                  <p className="ml-3 text-sm text-gray-600 leading-relaxed">{tip}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <Link
                href="/dashboard/ai-workshop"
                className="flex items-center text-sm text-purple-600 hover:text-purple-800 font-medium"
              >
                获取更多灵感
                <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>

          {/* 创作日历 */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-blue-600" />
              创作记录
            </h3>
            <div className="text-center py-4">
              <div className="text-3xl font-bold text-blue-600">{stats.streakDays}</div>
              <p className="text-sm text-gray-500 mt-1">连续创作天数</p>
              <div className="mt-4 flex justify-center">
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                    <div
                      key={day}
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                        day <= 3 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {day <= 3 ? '✓' : day}
                    </div>
                  ))}
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-3">最近7天创作情况</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}