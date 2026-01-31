'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  BookOpen,
  PenTool,
  Settings,
  Brain,
  LogOut,
  Menu,
  X,
  Home,
  LayoutDashboard,
  Database
} from 'lucide-react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState<any>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // 移除登录验证，直接设置一个虚拟用户
    const virtualUser = {
      id: 'demo-user-id',
      username: 'demo',
      email: 'demo@example.com'
    }
    setUser(virtualUser)
    
    // 同时设置到localStorage以便其他组件使用
    localStorage.setItem('user', JSON.stringify(virtualUser))
    localStorage.setItem('token', 'demo-token')
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/')
  }

  const menuItems = [
    {
      label: '工作台',
      icon: LayoutDashboard,
      href: '/dashboard/workspace'
    },
    {
      label: '创作中心',
      icon: PenTool,
      href: '/dashboard/novels'
    },
    {
      label: 'AI模型工坊',
      icon: Brain,
      href: '/dashboard/ai-workshop'
    },
    {
      label: '设置',
      icon: Settings,
      href: '/dashboard/settings'
    }
  ]

  // 检查是否是后台管理页面，如果是则不渲染Dashboard的导航栏
  if (pathname.startsWith('/dashboard/admin')) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* 移动端侧边栏遮罩 */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden bg-gray-600 bg-opacity-75"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* 侧边栏 - 仅用于前端创作平台 */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 lg:flex-shrink-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <Link href="/dashboard/workspace" className="text-xl font-semibold text-gray-900">
            小说创作平台
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden"
          >
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        <nav className="mt-6 px-3">
          <div className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors
                    ${isActive
                      ? 'bg-indigo-50 text-indigo-700 border-r-2 border-indigo-700'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.label}
                </Link>
              )
            })}
          </div>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          {user && (
            <>
              <div className="flex items-center mb-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-sm">
                    <span className="text-sm font-medium text-white">
                      {user.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                </div>
                <div className="ml-3 flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{user.username}</p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-50 hover:text-gray-900 transition-colors"
              >
                <LogOut className="mr-3 h-4 w-4" />
                退出登录
              </button>
            </>
          )}
        </div>
      </div>

      {/* 主内容区域 */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* 顶部导航栏 - 仅用于前端创作平台 */}
        <div className="sticky top-0 z-10 bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden"
              >
                <Menu className="h-6 w-6 text-gray-500" />
              </button>
              
              {/* 面包屑导航 - 不包含后台管理 */}
              <nav className="hidden md:flex items-center space-x-2 text-sm">
                <span className="text-gray-500">创作平台</span>
                <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <span className="text-gray-900 font-medium">
                  {pathname === '/dashboard/workspace' && '工作台'}
                  {pathname === '/dashboard/novels' && '创作中心'}
                  {pathname === '/dashboard/ai-workshop' && 'AI模型工坊'}
                  {pathname === '/dashboard/settings' && '设置'}
                  {pathname.startsWith('/dashboard/novels/') && '小说详情'}
                </span>
              </nav>
            </div>
            
            <div className="flex items-center space-x-4">
              {user && (
                <div className="hidden sm:flex items-center space-x-2 text-sm">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-gray-600">在线</span>
                  <span className="text-gray-500">|</span>
                  <span className="text-gray-900 font-medium">{user.username}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 页面内容 */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
