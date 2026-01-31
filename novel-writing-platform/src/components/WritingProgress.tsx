'use client'

import { useState, useEffect } from 'react'
import { 
  TrendingUp, 
  Target, 
  Clock, 
  Calendar, 
  Award,
  BookOpen,
  Zap,
  Coffee,
  Flame,
  BarChart3,
  Lightbulb
} from 'lucide-react'

interface Novel {
  id: string
  title: string
  wordCount: number
  chapterCount: number
  chapters?: any[]
  updatedAt: string
}

interface WritingProgressProps {
  novel: Novel
  generatingChapter?: string | null
}

export default function WritingProgress({ novel, generatingChapter }: WritingProgressProps) {
  const [dailyGoal, setDailyGoal] = useState(1000)
  const [todayWords, setTodayWords] = useState(0)
  const [weeklyWords, setWeeklyWords] = useState(0)
  const [streak, setStreak] = useState(0)

  useEffect(() => {
    // 模拟数据计算
    const totalWords = novel.chapters?.reduce((sum, chapter) => 
      sum + (chapter.wordCount || 0), 0) || 0
    
    // 模拟今日写作字数（实际应用中应从后端获取）
    setTodayWords(Math.floor(Math.random() * 1500))
    setWeeklyWords(Math.floor(Math.random() * 8000))
    setStreak(Math.floor(Math.random() * 30) + 1)
  }, [novel.chapters])

  const progressPercentage = Math.min((todayWords / dailyGoal) * 100, 100)
  const totalWords = novel.chapters?.reduce((sum, chapter) => 
    sum + (chapter.wordCount || 0), 0) || 0
  const completedChapters = novel.chapters?.filter(ch => ch.content).length || 0
  const averageWordsPerChapter = completedChapters > 0 ? Math.round(totalWords / completedChapters) : 0

  const stats = [
    {
      title: '今日进度',
      value: `${todayWords}/${dailyGoal}`,
      subtitle: `${progressPercentage.toFixed(0)}% 完成`,
      icon: Target,
      color: 'bg-blue-50 text-blue-600',
      progress: progressPercentage
    },
    {
      title: '本周写作',
      value: `${weeklyWords} 字`,
      subtitle: `日均 ${(weeklyWords / 7).toFixed(0)} 字`,
      icon: BarChart3,
      color: 'bg-green-50 text-green-600',
      progress: Math.min((weeklyWords / 7000) * 100, 100)
    },
    {
      title: '写作连续',
      value: `${streak} 天`,
      subtitle: '保持写作习惯',
      icon: Flame,
      color: 'bg-orange-50 text-orange-600',
      progress: Math.min((streak / 30) * 100, 100)
    },
    {
      title: '总进度',
      value: `${totalWords.toLocaleString()} 字`,
      subtitle: `${completedChapters}/${novel.chapters?.length || 0} 章节`,
      icon: BookOpen,
      color: 'bg-purple-50 text-purple-600',
      progress: novel.chapters?.length ? (completedChapters / novel.chapters.length) * 100 : 0
    }
  ]

  const writingTips = [
    { icon: Coffee, text: '适当休息，保持创作状态' },
    { icon: Lightbulb, text: '记录灵感，随时捕捉想法' },
    { icon: Zap, text: '设定小目标，逐步完成' },
    { icon: Clock, text: '固定写作时间，养成习惯' }
  ]

  const achievements = [
    { title: '新手上路', description: '完成第一个章节', unlocked: completedChapters >= 1 },
    { title: '勤奋作家', description: '连续写作7天', unlocked: streak >= 7 },
    { title: '万字巨作', description: '总字数突破1万字', unlocked: totalWords >= 10000 },
    { title: '章节大师', description: '完成20个章节', unlocked: completedChapters >= 20 }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <div key={index} className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 rounded-lg ${stat.color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-xs text-gray-500">{stat.subtitle}</div>
              </div>
            </div>
            
            {/* 进度条 */}
            <div className="mt-3">
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div 
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${stat.progress}%` }}
                ></div>
              </div>
            </div>

            <div className="mt-2">
              <p className="text-sm font-medium text-gray-900">{stat.title}</p>
            </div>
          </div>
        )
      })}
    </div>
  )

  return (
    <div className="space-y-6">
      {/* 写作统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-lg ${stat.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-xs text-gray-500">{stat.subtitle}</div>
                </div>
              </div>
              
              {/* 进度条 */}
              <div className="mt-3">
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div 
                    className="bg-gradient-to-r from-indigo-500 to-purple-500 h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${stat.progress}%` }}
                  ></div>
                </div>
              </div>

              <div className="mt-2">
                <p className="text-sm font-medium text-gray-900">{stat.title}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* 写作建议 */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100">
        <div className="flex items-center gap-3 mb-4">
          <Lightbulb className="h-6 w-6 text-indigo-600" />
          <h3 className="text-lg font-semibold text-gray-900">写作建议</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {writingTips.map((tip, index) => {
            const Icon = tip.icon
            return (
              <div key={index} className="flex items-center gap-3 bg-white rounded-lg p-3">
                <Icon className="h-5 w-5 text-indigo-500" />
                <p className="text-sm text-gray-700">{tip.text}</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* 成就系统 */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Award className="h-6 w-6 text-yellow-600" />
          <h3 className="text-lg font-semibold text-gray-900">写作成就</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {achievements.map((achievement, index) => (
            <div 
              key={index}
              className={`p-4 rounded-lg border-2 transition-all ${
                achievement.unlocked 
                  ? 'border-yellow-300 bg-yellow-50' 
                  : 'border-gray-200 bg-gray-50 opacity-60'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  achievement.unlocked ? 'bg-yellow-400' : 'bg-gray-300'
                }`}>
                  <Award className={`h-4 w-4 ${achievement.unlocked ? 'text-white' : 'text-gray-500'}`} />
                </div>
                <h4 className={`font-medium ${achievement.unlocked ? 'text-gray-900' : 'text-gray-500'}`}>
                  {achievement.title}
                </h4>
              </div>
              <p className="text-xs text-gray-600">{achievement.description}</p>
              {achievement.unlocked && (
                <div className="mt-2 text-xs text-yellow-600 font-medium">
                  ✓ 已解锁
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}