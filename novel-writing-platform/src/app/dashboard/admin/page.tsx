'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Database,
  Users,
  FileText,
  Settings,
  Download,
  Upload,
  RefreshCw,
  CheckCircle,
  BarChart3,
  LogOut,
  Shield,
  Menu,
  X,
  Edit,
  Trash2,
  Plus,
  Search,
  AlertCircle
} from 'lucide-react'

// 用户类型定义
interface User {
  id: string
  email: string
  username: string
  nickname?: string
  avatar?: string
  gender?: string
  birthDate?: string
  phone?: string
  membershipLevel: string
  createdAt: string
  updatedAt: string
  _count: {
    novels: number
    aiConfigs: number
    materials: number
  }
}

type UserInput = Omit<User, 'id' | 'createdAt' | 'updatedAt' | '_count'>

// 小说类型定义
interface Novel {
  id: string
  title: string
  description?: string
  outline?: string
  worldSetting?: string
  protagonist?: string
  createdAt: string
  updatedAt: string
  userId: string
  user: {
    id: string
    username: string
    nickname?: string
    email: string
  }
  _count: {
    chapters: number
    characters: number
    worldSettings: number
  }
}

type NovelInput = Omit<Novel, 'id' | 'createdAt' | 'updatedAt' | 'user' | '_count'> & { userId: string }

export default function AdminPage() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalNovels: 0,
    totalChapters: 0,
    totalWords: 0,
    databaseSize: '0 MB',
    lastBackup: '未备份'
  })

  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [novels, setNovels] = useState<Novel[]>([])
  const [userPagination, setUserPagination] = useState({ page: 1, total: 0, totalPages: 0 })
  const [novelPagination, setNovelPagination] = useState({ page: 1, total: 0, totalPages: 0 })
  const [showUserModal, setShowUserModal] = useState(false)
  const [showNovelModal, setShowNovelModal] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [editingNovel, setEditingNovel] = useState<Novel | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const router = useRouter()

  // 从localStorage获取已验证的用户信息
  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser)
        setUser(userData)
      } catch (err) {
        console.error('解析用户数据失败:', err)
      }
    }
  }, [])

  useEffect(() => {
    if (user) {
      fetchAdminData()
    }
  }, [user])

  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers()
    } else if (activeTab === 'content') {
      fetchNovels()
    }
  }, [activeTab, userPagination.page, novelPagination.page, searchTerm])

  const fetchAdminData = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/admin/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setStats({
          totalUsers: data.totalUsers || 0,
          totalNovels: data.totalNovels || 0,
          totalChapters: data.totalChapters || 0,
          totalWords: data.totalWords || 0,
          databaseSize: data.databaseSize || '0 MB',
          lastBackup: data.lastBackup || '未备份'
        })
      }
      setLoading(false)
    } catch (error) {
      console.error('获取管理员数据失败:', error)
      setLoading(false)
    }
  }

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(
        `/api/admin/users?page=${userPagination.page}&limit=10&search=${encodeURIComponent(searchTerm)}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      )

      if (response.ok) {
        const data = await response.json()
        setUsers(data.data)
        setUserPagination({
          page: data.pagination.page,
          total: data.pagination.total,
          totalPages: data.pagination.totalPages
        })
      }
    } catch (error) {
      console.error('获取用户列表失败:', error)
    }
  }

  const fetchNovels = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(
        `/api/admin/novels?page=${novelPagination.page}&limit=10&search=${encodeURIComponent(searchTerm)}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      )

      if (response.ok) {
        const data = await response.json()
        setNovels(data.data)
        setNovelPagination({
          page: data.pagination.page,
          total: data.pagination.total,
          totalPages: data.pagination.totalPages
        })
      }
    } catch (error) {
      console.error('获取小说列表失败:', error)
    }
  }

  const handleBackup = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/admin/backup', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        // 下载文件
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `backup-${new Date().toISOString().split('T')[0]}.json`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        alert('备份成功！')
        fetchAdminData()
      } else {
        alert('备份失败！')
      }
    } catch (error) {
      console.error('备份失败:', error)
      alert('备份失败！')
    }
  }

  const handleImport = async (file: File) => {
    try {
      const token = localStorage.getItem('token')
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/admin/import', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })

      if (response.ok) {
        const data = await response.json()
        alert(`导入成功！\n${JSON.stringify(data.data, null, 2)}`)
        fetchAdminData()
      } else {
        const error = await response.json()
        alert(`导入失败：${error.error}`)
      }
    } catch (error) {
      console.error('导入失败:', error)
      alert('导入失败！')
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('确定要删除该用户吗？此操作将级联删除该用户的所有小说和章节。')) {
      return
    }

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        alert('用户删除成功！')
        fetchUsers()
        fetchAdminData()
      } else {
        alert('删除失败！')
      }
    } catch (error) {
      console.error('删除用户失败:', error)
      alert('删除失败！')
    }
  }

  const handleDeleteNovel = async (novelId: string) => {
    if (!confirm('确定要删除该小说吗？此操作将级联删除该小说的所有章节、角色和世界观。')) {
      return
    }

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/admin/novels/${novelId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        alert('小说删除成功！')
        fetchNovels()
        fetchAdminData()
      } else {
        alert('删除失败！')
      }
    } catch (error) {
      console.error('删除小说失败:', error)
      alert('删除失败！')
    }
  }

  const handleSaveUser = async (userData: UserInput) => {
    try {
      const token = localStorage.getItem('token')
      const url = editingUser
        ? `/api/admin/users/${editingUser.id}`
        : '/api/admin/users'
      const method = editingUser ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      })

      if (response.ok) {
        alert(editingUser ? '用户更新成功！' : '用户创建成功！')
        setShowUserModal(false)
        setEditingUser(null)
        fetchUsers()
        fetchAdminData()
      } else {
        const error = await response.json()
        alert(`操作失败：${error.error}`)
      }
    } catch (error) {
      console.error('保存用户失败:', error)
      alert('操作失败！')
    }
  }

  const handleSaveNovel = async (novelData: NovelInput) => {
    try {
      const token = localStorage.getItem('token')
      const url = editingNovel
        ? `/api/admin/novels/${editingNovel.id}`
        : '/api/admin/novels'
      const method = editingNovel ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(novelData)
      })

      if (response.ok) {
        alert(editingNovel ? '小说更新成功！' : '小说创建成功！')
        setShowNovelModal(false)
        setEditingNovel(null)
        fetchNovels()
        fetchAdminData()
      } else {
        const error = await response.json()
        alert(`操作失败：${error.error}`)
      }
    } catch (error) {
      console.error('保存小说失败:', error)
      alert('操作失败！')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/admin/login')
  }

  const menuItems = [
    {
      id: 'overview',
      label: '系统概览',
      icon: BarChart3,
      description: '查看系统统计数据'
    },
    {
      id: 'users',
      label: '用户管理',
      icon: Users,
      description: '管理系统用户'
    },
    {
      id: 'content',
      label: '小说管理',
      icon: FileText,
      description: '管理小说内容'
    },
    {
      id: 'database',
      label: '数据库管理',
      icon: Database,
      description: '数据库操作与备份'
    },
    {
      id: 'settings',
      label: '系统设置',
      icon: Settings,
      description: '系统配置'
    }
  ]

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-400">加载中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* 移动端侧边栏遮罩 */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden bg-gray-600 bg-opacity-75"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* 后台管理侧边栏 */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-gray-800 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 lg:flex-shrink-0 border-r border-gray-700
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo区域 */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-700 bg-gray-900">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-orange-600 rounded-lg flex items-center justify-center">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold text-white">管理控制台</span>
              <span className="block text-xs text-gray-400">Admin Panel</span>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden"
          >
            <X className="h-6 w-6 text-gray-400" />
          </button>
        </div>

        {/* 导航菜单 */}
        <nav className="mt-6 px-3">
          <div className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = activeTab === item.id

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`
                    group w-full flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200
                    ${isActive
                      ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }
                  `}
                >
                  <Icon className={`mr-3 h-5 w-5 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                  <div className="flex-1 text-left">
                    <div className={isActive ? 'text-white' : 'text-gray-300'}>{item.label}</div>
                    <div className={`text-xs mt-0.5 ${isActive ? 'text-orange-100' : 'text-gray-500'}`}>{item.description}</div>
                  </div>
                </button>
              )
            })}
          </div>
        </nav>

        {/* 用户信息 */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700 bg-gray-900">
          <div className="flex items-center mb-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-600 rounded-full flex items-center justify-center shadow-sm">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-gray-900"></div>
            </div>
            <div className="ml-3 flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user.username}</p>
              <p className="text-xs text-gray-400 truncate">{user.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center justify-center w-full px-3 py-2 text-sm font-medium text-gray-300 bg-gray-800 rounded-lg hover:bg-gray-700 hover:text-white transition-colors border border-gray-700"
          >
            <LogOut className="mr-2 h-4 w-4" />
            退出登录
          </button>
        </div>
      </div>

      {/* 主内容区域 */}
      <div className="flex-1 flex flex-col min-w-0 bg-gray-900">
        {/* 顶部操作栏 */}
        <div className="sticky top-0 z-10 bg-gray-800 border-b border-gray-700">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden"
              >
                <Menu className="h-6 w-6 text-gray-400" />
              </button>

              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-red-500" />
                <span className="text-sm font-medium text-gray-300">后台管理系统</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-2 text-sm bg-red-900/30 px-3 py-1 rounded-full border border-red-800">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-gray-300 font-medium">系统运行正常</span>
              </div>
            </div>
          </div>
        </div>

        {/* 页面内容 */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
          {loading ? (
            <div className="space-y-6">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-700 rounded w-1/3 mb-4"></div>
                <div className="h-4 bg-gray-700 rounded w-2/3"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="bg-gray-800 p-6 rounded-lg animate-pulse">
                    <div className="h-4 bg-gray-700 rounded w-1/2 mb-2"></div>
                    <div className="h-8 bg-gray-700 rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {activeTab === 'overview' && (
                <>
                  <div>
                    <h1 className="text-2xl font-bold text-white">系统概览</h1>
                    <p className="mt-1 text-gray-400">查看系统运行状态和关键指标</p>
                  </div>

                  {/* 统计卡片 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 bg-blue-900/50 rounded-lg p-3">
                          <Users className="h-6 w-6 text-blue-400" />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-400">注册用户</p>
                          <p className="text-2xl font-semibold text-white">{stats.totalUsers}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 bg-green-900/50 rounded-lg p-3">
                          <FileText className="h-6 w-6 text-green-400" />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-400">小说总数</p>
                          <p className="text-2xl font-semibold text-white">{stats.totalNovels}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 bg-purple-900/50 rounded-lg p-3">
                          <Database className="h-6 w-6 text-purple-400" />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-400">章节总数</p>
                          <p className="text-2xl font-semibold text-white">{stats.totalChapters}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 bg-orange-900/50 rounded-lg p-3">
                          <BarChart3 className="h-6 w-6 text-orange-400" />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-400">总字数</p>
                          <p className="text-2xl font-semibold text-white">{stats.totalWords.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 系统状态 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                      <h3 className="text-lg font-medium text-white mb-4">数据库信息</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">数据库大小</span>
                          <span className="font-medium text-white">{stats.databaseSize}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">最后备份</span>
                          <span className="font-medium text-white">{stats.lastBackup}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                      <h3 className="text-lg font-medium text-white mb-4">系统状态</h3>
                      <div className="space-y-3">
                        <div className="flex items-center text-sm">
                          <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                          <span className="text-gray-300">服务运行正常</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                          <span className="text-gray-300">数据库连接正常</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 操作按钮 */}
                  <div className="flex space-x-4">
                    <button
                      onClick={handleBackup}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      备份数据库
                    </button>
                  </div>
                </>
              )}

              {activeTab === 'users' && (
                <>
                  <div>
                    <h1 className="text-2xl font-bold text-white">用户管理</h1>
                    <p className="mt-1 text-gray-400">管理系统用户账号</p>
                  </div>

                  <div className="bg-gray-800 rounded-lg border border-gray-700">
                    <div className="p-4 border-b border-gray-700 flex items-center justify-between flex-wrap gap-4">
                      <div className="flex items-center space-x-2 flex-1">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <input
                            type="text"
                            placeholder="搜索用户..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm text-white placeholder-gray-400 focus:outline-none focus:border-gray-500 w-full sm:w-64"
                          />
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setEditingUser(null)
                          setShowUserModal(true)
                        }}
                        className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        添加用户
                      </button>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-700">
                        <thead className="bg-gray-900/50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">用户</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">邮箱</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">会员等级</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">小说数</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">注册时间</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">操作</th>
                          </tr>
                        </thead>
                        <tbody className="bg-gray-800 divide-y divide-gray-700">
                          {users.map((u) => (
                            <tr key={u.id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="h-10 w-10 bg-indigo-900/50 rounded-full flex items-center justify-center">
                                    <span className="text-indigo-400 font-medium">{u.nickname?.[0] || u.username[0]}</span>
                                  </div>
                                  <div className="ml-4">
                                    <div className="text-sm font-medium text-white">{u.nickname || u.username}</div>
                                    <div className="text-xs text-gray-500">@{u.username}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{u.email}</td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  u.membershipLevel === 'vip' ? 'bg-purple-900/50 text-purple-300' :
                                  u.membershipLevel === 'premium' ? 'bg-yellow-900/50 text-yellow-300' :
                                  'bg-gray-700 text-gray-300'
                                }`}>
                                  {u.membershipLevel.toUpperCase()}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{u._count.novels}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                                {new Date(u.createdAt).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <button
                                  onClick={() => {
                                    setEditingUser(u)
                                    setShowUserModal(true)
                                  }}
                                  className="text-indigo-400 hover:text-indigo-300 mr-3"
                                >
                                  <Edit className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteUser(u.id)}
                                  className="text-red-400 hover:text-red-300"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {/* 分页 */}
                    {userPagination.totalPages > 1 && (
                      <div className="px-6 py-4 border-t border-gray-700 flex items-center justify-between">
                        <div className="text-sm text-gray-400">
                          共 {userPagination.total} 条记录，第 {userPagination.page} / {userPagination.totalPages} 页
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setUserPagination({ ...userPagination, page: userPagination.page - 1 })}
                            disabled={userPagination.page === 1}
                            className="px-3 py-1 bg-gray-700 text-white text-sm rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            上一页
                          </button>
                          <button
                            onClick={() => setUserPagination({ ...userPagination, page: userPagination.page + 1 })}
                            disabled={userPagination.page === userPagination.totalPages}
                            className="px-3 py-1 bg-gray-700 text-white text-sm rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            下一页
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}

              {activeTab === 'content' && (
                <>
                  <div>
                    <h1 className="text-2xl font-bold text-white">小说管理</h1>
                    <p className="mt-1 text-gray-400">管理平台上的小说内容</p>
                  </div>

                  <div className="bg-gray-800 rounded-lg border border-gray-700">
                    <div className="p-4 border-b border-gray-700 flex items-center justify-between flex-wrap gap-4">
                      <div className="flex items-center space-x-2 flex-1">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <input
                            type="text"
                            placeholder="搜索小说..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm text-white placeholder-gray-400 focus:outline-none focus:border-gray-500 w-full sm:w-64"
                          />
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setEditingNovel(null)
                          setShowNovelModal(true)
                        }}
                        className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        添加小说
                      </button>
                    </div>
                    <div className="divide-y divide-gray-700">
                      {novels.map((novel) => (
                        <div key={novel.id} className="p-4 hover:bg-gray-700/50 transition-colors">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2 mb-2">
                                <h4 className="font-medium text-white">{novel.title}</h4>
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-900/50 text-green-300">已发布</span>
                              </div>
                              <p className="text-sm text-gray-400 mb-2 line-clamp-2">{novel.description || '暂无描述'}</p>
                              <div className="flex items-center space-x-4 text-xs text-gray-500 flex-wrap">
                                <span>{novel._count.chapters} 章节</span>
                                <span>{novel._count.characters} 角色</span>
                                <span>作者：{novel.user.nickname || novel.user.username}</span>
                                <span>最后更新：{new Date(novel.updatedAt).toLocaleDateString()}</span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2 ml-4">
                              <button
                                onClick={() => {
                                  setEditingNovel(novel)
                                  setShowNovelModal(true)
                                }}
                                className="text-indigo-400 hover:text-indigo-300 text-sm"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteNovel(novel.id)}
                                className="text-red-400 hover:text-red-300 text-sm"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    {/* 分页 */}
                    {novelPagination.totalPages > 1 && (
                      <div className="px-6 py-4 border-t border-gray-700 flex items-center justify-between">
                        <div className="text-sm text-gray-400">
                          共 {novelPagination.total} 条记录，第 {novelPagination.page} / {novelPagination.totalPages} 页
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setNovelPagination({ ...novelPagination, page: novelPagination.page - 1 })}
                            disabled={novelPagination.page === 1}
                            className="px-3 py-1 bg-gray-700 text-white text-sm rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            上一页
                          </button>
                          <button
                            onClick={() => setNovelPagination({ ...novelPagination, page: novelPagination.page + 1 })}
                            disabled={novelPagination.page === novelPagination.totalPages}
                            className="px-3 py-1 bg-gray-700 text-white text-sm rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            下一页
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}

              {activeTab === 'database' && (
                <>
                  <div>
                    <h1 className="text-2xl font-bold text-white">数据库管理</h1>
                    <p className="mt-1 text-gray-400">数据库操作与维护</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                      <h3 className="text-lg font-medium text-white mb-4">数据库操作</h3>
                      <div className="space-y-3">
                        <button
                          onClick={handleBackup}
                          className="w-full text-left px-4 py-3 text-sm border border-gray-600 rounded-lg hover:bg-gray-700 hover:border-gray-500 flex items-center transition-colors"
                        >
                          <Download className="h-4 w-4 mr-3 text-gray-400" />
                          <span className="text-gray-300">导出数据</span>
                        </button>
                        <label className="w-full text-left px-4 py-3 text-sm border border-gray-600 rounded-lg hover:bg-gray-700 hover:border-gray-500 flex items-center transition-colors cursor-pointer">
                          <Upload className="h-4 w-4 mr-3 text-gray-400" />
                          <span className="text-gray-300">导入数据</span>
                          <input
                            type="file"
                            accept=".json"
                            onChange={(e) => {
                              const file = e.target.files?.[0]
                              if (file) {
                                handleImport(file)
                              }
                            }}
                            className="hidden"
                          />
                        </label>
                        <button
                          onClick={() => {
                            if (confirm('确定要刷新统计数据吗？')) {
                              fetchAdminData()
                              alert('统计数据已刷新！')
                            }
                          }}
                          className="w-full text-left px-4 py-3 text-sm border border-gray-600 rounded-lg hover:bg-gray-700 hover:border-gray-500 flex items-center transition-colors"
                        >
                          <RefreshCw className="h-4 w-4 mr-3 text-gray-400" />
                          <span className="text-gray-300">刷新统计</span>
                        </button>
                      </div>
                    </div>

                    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                      <h3 className="text-lg font-medium text-white mb-4">数据统计</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">用户表记录</span>
                          <span className="font-medium text-white">{stats.totalUsers}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">小说表记录</span>
                          <span className="font-medium text-white">{stats.totalNovels}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">章节表记录</span>
                          <span className="font-medium text-white">{stats.totalChapters}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">总字数</span>
                          <span className="font-medium text-white">{stats.totalWords.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">数据库大小</span>
                          <span className="font-medium text-white">{stats.databaseSize}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'settings' && (
                <>
                  <div>
                    <h1 className="text-2xl font-bold text-white">系统设置</h1>
                    <p className="mt-1 text-gray-400">系统配置与管理</p>
                  </div>

                  <div className="bg-gray-800 rounded-lg border border-gray-700">
                    <div className="p-6 border-b border-gray-700">
                      <h3 className="text-lg font-medium text-white mb-4">系统配置</h3>
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-sm font-medium text-white">维护模式</div>
                            <div className="text-xs text-gray-400">开启后普通用户无法访问</div>
                          </div>
                          <button className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none bg-gray-600">
                            <span className="sr-only">Use setting</span>
                            <span className="translate-x-0 pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"></span>
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-sm font-medium text-white">用户注册</div>
                            <div className="text-xs text-gray-400">是否允许新用户注册</div>
                          </div>
                          <button className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none bg-green-600">
                            <span className="sr-only">Use setting</span>
                            <span className="translate-x-5 pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"></span>
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-sm font-medium text-white">AI 生成功能</div>
                            <div className="text-xs text-gray-400">启用或禁用AI内容生成</div>
                          </div>
                          <button className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none bg-green-600">
                            <span className="sr-only">Use setting</span>
                            <span className="translate-x-5 pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"></span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </main>
      </div>

      {/* 用户编辑/创建弹窗 */}
      {showUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="bg-gray-800 rounded-lg border border-gray-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-700 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">
                {editingUser ? '编辑用户' : '添加用户'}
              </h2>
              <button
                onClick={() => {
                  setShowUserModal(false)
                  setEditingUser(null)
                }}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6">
              <UserForm
                user={editingUser}
                onSave={handleSaveUser}
                onCancel={() => {
                  setShowUserModal(false)
                  setEditingUser(null)
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* 小说编辑/创建弹窗 */}
      {showNovelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="bg-gray-800 rounded-lg border border-gray-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-700 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">
                {editingNovel ? '编辑小说' : '添加小说'}
              </h2>
              <button
                onClick={() => {
                  setShowNovelModal(false)
                  setEditingNovel(null)
                }}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6">
              <NovelForm
                novel={editingNovel}
                users={users}
                onSave={handleSaveNovel}
                onCancel={() => {
                  setShowNovelModal(false)
                  setEditingNovel(null)
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// 用户表单组件
function UserForm({ user, onSave, onCancel }: { user: User | null; onSave: (data: UserInput) => void; onCancel: () => void }) {
  const [formData, setFormData] = useState({
    email: user?.email || '',
    username: user?.username || '',
    password: '',
    nickname: user?.nickname || '',
    gender: user?.gender || '',
    birthDate: user?.birthDate?.split('T')[0] || '',
    phone: user?.phone || '',
    membershipLevel: user?.membershipLevel || 'free'
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">邮箱 *</label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-gray-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">用户名 *</label>
          <input
            type="text"
            required
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-gray-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            密码 {user ? '（留空不修改）' : '*'}
          </label>
          <input
            type="password"
            required={!user}
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-gray-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">昵称</label>
          <input
            type="text"
            value={formData.nickname}
            onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-gray-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">性别</label>
          <select
            value={formData.gender}
            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-gray-500"
          >
            <option value="">请选择</option>
            <option value="male">男</option>
            <option value="female">女</option>
            <option value="other">其他</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">出生日期</label>
          <input
            type="date"
            value={formData.birthDate}
            onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-gray-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">手机号</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-gray-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">会员等级</label>
          <select
            value={formData.membershipLevel}
            onChange={(e) => setFormData({ ...formData, membershipLevel: e.target.value })}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-gray-500"
          >
            <option value="free">免费用户</option>
            <option value="vip">VIP会员</option>
            <option value="premium">高级会员</option>
          </select>
        </div>
      </div>
      <div className="flex justify-end space-x-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
        >
          取消
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          保存
        </button>
      </div>
    </form>
  )
}

// 小说表单组件
function NovelForm({ novel, users, onSave, onCancel }: { novel: Novel | null; users: User[]; onSave: (data: NovelInput) => void; onCancel: () => void }) {
  const [formData, setFormData] = useState({
    title: novel?.title || '',
    description: novel?.description || '',
    outline: novel?.outline || '',
    worldSetting: novel?.worldSetting || '',
    protagonist: novel?.protagonist || '',
    userId: novel?.userId || (users[0]?.id || '')
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">小说标题 *</label>
        <input
          type="text"
          required
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-gray-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">所属用户 *</label>
        <select
          required
          value={formData.userId}
          onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-gray-500"
        >
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.nickname || u.username} ({u.email})
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">小说简介</label>
        <textarea
          rows={3}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-gray-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">小说大纲</label>
        <textarea
          rows={4}
          value={formData.outline}
          onChange={(e) => setFormData({ ...formData, outline: e.target.value })}
          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-gray-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">世界观设定</label>
        <textarea
          rows={3}
          value={formData.worldSetting}
          onChange={(e) => setFormData({ ...formData, worldSetting: e.target.value })}
          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-gray-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">主角设定</label>
        <input
          type="text"
          value={formData.protagonist}
          onChange={(e) => setFormData({ ...formData, protagonist: e.target.value })}
          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-gray-500"
        />
      </div>
      <div className="flex justify-end space-x-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
        >
          取消
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          保存
        </button>
      </div>
    </form>
  )
}
