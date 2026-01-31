'use client'

import Link from 'next/link'
import { 
  BookOpen, 
  PenTool, 
  Brain, 
  Database, 
  Settings,
  ArrowRight,
  Star,
  Users,
  FileText,
  Zap,
  Shield,
  TrendingUp,
  Lightbulb
} from 'lucide-react'

export default function PlatformHome() {
  const features = [
    {
      icon: PenTool,
      title: '智能写作',
      description: 'AI辅助创作，提供灵感、情节建议和内容生成',
      color: 'bg-blue-500'
    },
    {
      icon: BookOpen,
      title: '作品管理',
      description: '完善的小说和章节管理系统，支持多种编辑模式',
      color: 'bg-green-500'
    },
    {
      icon: Brain,
      title: '多模型支持',
      description: '集成多种AI模型，自定义配置满足不同创作需求',
      color: 'bg-purple-500'
    },
    {
      icon: Database,
      title: '数据管理',
      description: '强大的后台管理功能，用户数据安全管理',
      color: 'bg-orange-500'
    }
  ]

  const quickStart = [
    {
      icon: PenTool,
      title: '创建新小说',
      description: '立即开始你的创作之旅',
      href: '/dashboard/novels/create'
    },
    {
      icon: Brain,
      title: 'AI创作助手',
      description: '让AI帮助你激发创作灵感',
      href: '/dashboard/ai-workshop'
    },
    {
      icon: BookOpen,
      title: '我的作品',
      description: '管理你的所有小说作品',
      href: '/dashboard/novels'
    },
    {
      icon: Shield,
      title: '系统管理',
      description: '管理平台数据和配置',
      href: '/111'
    }
  ]

  const stats = [
    {
      icon: Users,
      label: '注册用户',
      value: '1,000+'
    },
    {
      icon: FileText,
      label: '创作作品',
      value: '5,000+'
    },
    {
      icon: Star,
      label: '完成小说',
      value: '500+'
    },
    {
      icon: TrendingUp,
      label: '日均写作',
      value: '10万字'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              小说创作平台
            </h1>
            <p className="text-xl md:text-2xl text-indigo-100 mb-8 max-w-3xl mx-auto">
              智能AI辅助，让创作灵感无限延伸。专业的小说创作工具，助力每个作家的梦想。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/dashboard/workspace"
                className="inline-flex items-center justify-center px-8 py-3 bg-white text-indigo-600 font-semibold rounded-lg hover:bg-indigo-50 transition-colors"
              >
                进入工作台
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="/dashboard/novels/create"
                className="inline-flex items-center justify-center px-8 py-3 bg-indigo-700 text-white font-semibold rounded-lg hover:bg-indigo-800 transition-colors"
              >
                开始创作
                <PenTool className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-lg mb-4">
                    <Icon className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-sm text-gray-500">{stat.label}</div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">核心功能</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              我们提供全方位的创作工具，从灵感激发到作品发布，助力你的创作之旅
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div key={index} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow p-6">
                  <div className={`inline-flex items-center justify-center w-12 h-12 ${feature.color} rounded-lg mb-4`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Quick Start Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">快速开始</h2>
            <p className="text-lg text-gray-600">选择你想要的功能，立即开始创作</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickStart.map((item, index) => {
              const Icon = item.icon
              return (
                <Link
                  key={index}
                  href={item.href}
                  className="group block p-6 border border-gray-200 rounded-xl hover:border-indigo-500 hover:shadow-lg transition-all"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-lg mb-4 group-hover:bg-indigo-200 transition-colors">
                    <Icon className="h-6 w-6 text-indigo-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">{item.description}</p>
                  <div className="flex items-center text-indigo-600 font-medium group-hover:text-indigo-700">
                    立即使用
                    <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </div>

      {/* Advantages Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">为什么选择我们？</h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <Zap className="h-6 w-6 text-yellow-500" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-semibold text-gray-900">高效创作</h3>
                    <p className="text-gray-600">AI智能辅助，大幅提升创作效率</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <Shield className="h-6 w-6 text-green-500" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-semibold text-gray-900">数据安全</h3>
                    <p className="text-gray-600">云端存储，多重备份保护你的作品</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <Lightbulb className="h-6 w-6 text-purple-500" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-semibold text-gray-900">创新工具</h3>
                    <p className="text-gray-600">持续更新的创作工具和功能</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">开始你的创作之旅</h3>
              <p className="text-indigo-100 mb-6">
                加入数千名作家的行列，使用专业的创作工具，让你的故事感动更多人。
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center px-6 py-3 bg-white text-indigo-600 font-semibold rounded-lg hover:bg-indigo-50 transition-colors"
                >
                  免费注册
                </Link>
                <Link
                  href="/dashboard/workspace"
                  className="inline-flex items-center justify-center px-6 py-3 bg-indigo-700 text-white font-semibold rounded-lg hover:bg-indigo-800 transition-colors"
                >
                  查看演示
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">小说创作平台</h3>
            <p className="text-gray-400 mb-8">专业、智能、高效的创作工具</p>
            <div className="flex justify-center space-x-6">
              <Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors">
                首页
              </Link>
              <Link href="/dashboard/workspace" className="text-gray-400 hover:text-white transition-colors">
                工作台
              </Link>
              <Link href="/dashboard/novels" className="text-gray-400 hover:text-white transition-colors">
                创作中心
              </Link>
              <Link href="/dashboard/ai-workshop" className="text-gray-400 hover:text-white transition-colors">
                AI模型
              </Link>
            </div>
            <p className="text-gray-500 text-sm mt-8">
              © 2024 小说创作平台. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}