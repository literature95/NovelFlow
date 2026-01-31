'use client'

import { useState, useEffect } from 'react'
import { 
  Menu, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Home, 
  BookOpen, 
  Settings, 
  User,
  Plus,
  Search,
  Filter,
  Grid,
  List,
  Edit3,
  Eye,
  BarChart3,
  Smartphone,
  Tablet,
  Monitor
} from 'lucide-react'

interface ResponsiveLayoutProps {
  children: React.ReactNode
  sidebar?: React.ReactNode
  header?: React.ReactNode
  title?: string
  showBreadcrumb?: boolean
  breadcrumbItems?: Array<{ label: string; href?: string }>
}

type DeviceType = 'mobile' | 'tablet' | 'desktop'
type ViewMode = 'grid' | 'list'

export default function ResponsiveLayout({
  children,
  sidebar,
  header,
  title,
  showBreadcrumb = false,
  breadcrumbItems = []
}: ResponsiveLayoutProps) {
  const [deviceType, setDeviceType] = useState<DeviceType>('desktop')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      if (width < 768) {
        setDeviceType('mobile')
        setSidebarOpen(false)
      } else if (width < 1024) {
        setDeviceType('tablet')
        setSidebarOpen(false)
      } else {
        setDeviceType('desktop')
        setSidebarOpen(true)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const isMobile = deviceType === 'mobile'
  const isTablet = deviceType === 'tablet'
  const isDesktop = deviceType === 'desktop'

  const getDeviceIcon = () => {
    switch (deviceType) {
      case 'mobile': return <Smartphone className="h-4 w-4" />
      case 'tablet': return <Tablet className="h-4 w-4" />
      case 'desktop': return <Monitor className="h-4 w-4" />
    }
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const renderMobileHeader = () => (
    <div className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <Menu className="h-5 w-5" />
          </button>
          {title && (
            <h1 className="text-lg font-semibold text-gray-900 truncate">
              {title}
            </h1>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <Search className="h-5 w-5" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <Plus className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* 面包屑导航 */}
      {showBreadcrumb && breadcrumbItems.length > 0 && (
        <div className="flex items-center space-x-1 mt-3 text-sm text-gray-600 overflow-x-auto">
          {breadcrumbItems.map((item, index) => (
            <div key={index} className="flex items-center">
              {item.href ? (
                <a 
                  href={item.href}
                  className="hover:text-indigo-600 transition-colors"
                >
                  {item.label}
                </a>
              ) : (
                <span className="text-gray-900 font-medium">{item.label}</span>
              )}
              {index < breadcrumbItems.length - 1 && (
                <ChevronRight className="h-4 w-4 mx-1 flex-shrink-0" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )

  const renderTabletHeader = () => (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleSidebar}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <Menu className="h-5 w-5" />
          </button>
          {title && (
            <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
          )}
        </div>

        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="搜索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <Filter className="h-5 w-5" />
          </button>
          
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 面包屑导航 */}
      {showBreadcrumb && breadcrumbItems.length > 0 && (
        <div className="flex items-center space-x-2 mt-4 text-sm">
          {breadcrumbItems.map((item, index) => (
            <div key={index} className="flex items-center">
              {item.href ? (
                <a 
                  href={item.href}
                  className="text-gray-600 hover:text-indigo-600 transition-colors"
                >
                  {item.label}
                </a>
              ) : (
                <span className="text-gray-900 font-medium">{item.label}</span>
              )}
              {index < breadcrumbItems.length - 1 && (
                <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )

  const renderDesktopHeader = () => (
    <div className="bg-white border-b border-gray-200 px-8 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {title && (
            <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
          )}
          {showBreadcrumb && breadcrumbItems.length > 0 && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              {breadcrumbItems.map((item, index) => (
                <div key={index} className="flex items-center">
                  {item.href ? (
                    <a 
                      href={item.href}
                      className="hover:text-indigo-600 transition-colors"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <span className="text-gray-900 font-medium">{item.label}</span>
                  )}
                  {index < breadcrumbItems.length - 1 && (
                    <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="搜索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-80 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <Filter className="h-5 w-5" />
          </button>
          
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>

          <div className="flex items-center text-sm text-gray-600">
            {getDeviceIcon()}
            <span className="ml-2">
              {deviceType === 'mobile' ? '手机视图' : 
               deviceType === 'tablet' ? '平板视图' : '桌面视图'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )

  const renderMobileSidebar = () => (
    <div className={`fixed inset-0 z-50 ${showMobileMenu ? 'block' : 'hidden'}`}>
      {/* 遮罩层 */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={() => setShowMobileMenu(false)}
      />
      
      {/* 侧边栏 */}
      <div className="absolute left-0 top-0 h-full w-72 bg-white shadow-xl">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">菜单</h2>
          <button
            onClick={() => setShowMobileMenu(false)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-4">
          <nav className="space-y-2">
            <a href="/dashboard" className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg">
              <Home className="h-5 w-5 mr-3" />
              首页
            </a>
            <a href="/dashboard/novels" className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg">
              <BookOpen className="h-5 w-5 mr-3" />
              我的小说
            </a>
            <a href="/dashboard/statistics" className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg">
              <BarChart3 className="h-5 w-5 mr-3" />
              数据统计
            </a>
            <a href="/dashboard/settings" className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg">
              <Settings className="h-5 w-5 mr-3" />
              设置
            </a>
          </nav>
        </div>
      </div>
    </div>
  )

  const renderTabletSidebar = () => (
    <div className={`fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 z-40 ${
      sidebarOpen ? 'translate-x-0' : '-translate-x-full'
    }`}>
      <div className="p-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">创作中心</h2>
          <button
            onClick={toggleSidebar}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        {sidebar}
      </div>
    </div>
  )

  const renderDesktopSidebar = () => (
    <div className="w-64 bg-white border-r border-gray-200">
      <div className="p-6">
        {sidebar}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 移动端侧边栏 */}
      {isMobile && renderMobileSidebar()}
      
      {/* 平板端侧边栏 */}
      {isTablet && renderTabletSidebar()}
      
      {/* 遮罩层（平板端） */}
      {isTablet && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={toggleSidebar}
        />
      )}

      <div className="flex h-screen flex-col">
        {/* 头部 */}
        {header || (
          <header>
            {isMobile && renderMobileHeader()}
            {isTablet && renderTabletHeader()}
            {isDesktop && renderDesktopHeader()}
          </header>
        )}

        {/* 主内容区域 */}
        <div className="flex flex-1 overflow-hidden">
          {/* 桌面端侧边栏 */}
          {isDesktop && renderDesktopSidebar()}

          {/* 内容区域 */}
          <main className={`flex-1 overflow-y-auto ${
            isMobile ? '' : isTablet ? (sidebarOpen ? 'ml-64' : '') : 'ml-64'
          }`}>
            <div className={`${isMobile ? 'p-4' : isTablet ? 'p-6' : 'p-8'}`}>
              {children}
            </div>
          </main>
        </div>

        {/* 移动端底部导航 */}
        {isMobile && (
          <div className="bg-white border-t border-gray-200 px-4 py-2">
            <div className="flex items-center justify-around">
              <a href="/dashboard" className="flex flex-col items-center p-2 text-gray-600 hover:text-indigo-600">
                <Home className="h-5 w-5" />
                <span className="text-xs mt-1">首页</span>
              </a>
              <a href="/dashboard/novels" className="flex flex-col items-center p-2 text-gray-600 hover:text-indigo-600">
                <BookOpen className="h-5 w-5" />
                <span className="text-xs mt-1">小说</span>
              </a>
              <button className="flex flex-col items-center p-2 text-indigo-600">
                <Plus className="h-5 w-5" />
                <span className="text-xs mt-1">新建</span>
              </button>
              <a href="/dashboard/statistics" className="flex flex-col items-center p-2 text-gray-600 hover:text-indigo-600">
                <BarChart3 className="h-5 w-5" />
                <span className="text-xs mt-1">统计</span>
              </a>
              <a href="/dashboard/settings" className="flex flex-col items-center p-2 text-gray-600 hover:text-indigo-600">
                <Settings className="h-5 w-5" />
                <span className="text-xs mt-1">设置</span>
              </a>
            </div>
          </div>
        )}
      </div>

      {/* 响应式调试信息（开发环境） */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 bg-black bg-opacity-75 text-white p-2 rounded-lg text-xs">
          <div className="flex items-center space-x-2">
            {getDeviceIcon()}
            <span>{deviceType} - {window.innerWidth}px</span>
            <span>{viewMode}</span>
          </div>
        </div>
      )}
    </div>
  )
}