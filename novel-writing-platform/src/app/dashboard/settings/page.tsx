'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { User, Settings, LogOut, Camera, Save, X } from 'lucide-react'

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  // 编辑表单状态
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    avatar: '',
    nickname: '',
    gender: '',
    birthDate: '',
    phone: ''
  })

  // 会员等级标签映射
  const membershipLabels: Record<string, string> = {
    free: '免费会员',
    basic: '基础会员',
    premium: '高级会员',
    vip: 'VIP会员'
  }

  // 性别选项
  const genderOptions = [
    { value: 'male', label: '男' },
    { value: 'female', label: '女' },
    { value: 'other', label: '其他' }
  ]

  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = async () => {
    try {
      // 从localStorage获取基本信息
      const userData = localStorage.getItem('user')
      if (userData) {
        setUser(JSON.parse(userData))
      }

      // 从API获取完整个人信息
      const token = localStorage.getItem('token')
      const response = await fetch('/api/user/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setProfile(data.user)
        setFormData({
          avatar: data.user.avatar || '',
          nickname: data.user.nickname || '',
          gender: data.user.gender || '',
          birthDate: data.user.birthDate ? data.user.birthDate.split('T')[0] : '',
          phone: data.user.phone || ''
        })
      }
    } catch (error) {
      console.error('加载用户数据失败:', error)
      showMessage('error', '加载用户数据失败')
    } finally {
      setLoading(false)
    }
  }

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 3000)
  }

  const handleEdit = () => {
    setIsEditing(true)
    setFormData({
      avatar: profile?.avatar || '',
      nickname: profile?.nickname || '',
      gender: profile?.gender || '',
      birthDate: profile?.birthDate ? profile.birthDate.split('T')[0] : '',
      phone: profile?.phone || ''
    })
  }

  const handleCancel = () => {
    setIsEditing(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage(null)

    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/user/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok) {
        setProfile(data.user)
        setIsEditing(false)
        showMessage('success', '个人信息更新成功')
      } else {
        showMessage('error', data.error || '更新失败')
      }
    } catch (error) {
      console.error('更新失败:', error)
      showMessage('error', '网络错误，请重试')
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = '/login'
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">加载中...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">设置</h1>
        <p className="mt-1 text-sm text-gray-600">管理你的账户和偏好设置</p>
      </div>

      {/* 消息提示 */}
      {message && (
        <div className={`${
          message.type === 'success' ? 'bg-green-50 border-green-200 text-green-600' : 'bg-red-50 border-red-200 text-red-600'
        } border px-4 py-3 rounded`}>
          {message.text}
        </div>
      )}

      {/* 个人信息卡片 */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">个人信息</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              管理你的个人资料信息
            </p>
          </div>
          {!isEditing && (
            <button
              onClick={handleEdit}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
            >
              <Settings className="mr-1.5 h-4 w-4" />
              编辑
            </button>
          )}
        </div>

        {/* 查看模式 */}
        {!isEditing && profile && (
          <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
            <dl className="sm:divide-y sm:divide-gray-200">
              {/* 头像 */}
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">头像</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {profile.avatar ? (
                    <img
                      src={profile.avatar}
                      alt="头像"
                      className="h-16 w-16 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center">
                      <User className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                </dd>
              </div>

              {/* 用户名 */}
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">用户名</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {profile.username}
                </dd>
              </div>

              {/* 邮箱地址 */}
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">邮箱地址</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {profile.email}
                </dd>
              </div>

              {/* 昵称 */}
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">昵称</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {profile.nickname || '-'}
                </dd>
              </div>

              {/* 性别 */}
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">性别</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {profile.gender ? genderOptions.find(g => g.value === profile.gender)?.label : '-'}
                </dd>
              </div>

              {/* 出生日期 */}
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">出生年月日</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {profile.birthDate ? new Date(profile.birthDate).toLocaleDateString('zh-CN') : '-'}
                </dd>
              </div>

              {/* 手机号 */}
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">手机号</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {profile.phone || '-'}
                </dd>
              </div>

              {/* 会员等级 */}
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">会员等级</dt>
                <dd className="mt-1 sm:mt-0 sm:col-span-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    profile.membershipLevel === 'vip' ? 'bg-purple-100 text-purple-800' :
                    profile.membershipLevel === 'premium' ? 'bg-yellow-100 text-yellow-800' :
                    profile.membershipLevel === 'basic' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {membershipLabels[profile.membershipLevel] || '免费会员'}
                  </span>
                </dd>
              </div>

              {/* 注册时间 */}
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">注册时间</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {new Date(profile.createdAt).toLocaleDateString('zh-CN')}
                </dd>
              </div>
            </dl>
          </div>
        )}

        {/* 编辑模式 */}
        {isEditing && (
          <form onSubmit={handleSubmit} className="border-t border-gray-200 px-4 py-5 sm:p-6">
            <div className="space-y-6">
              {/* 头像URL */}
              <div>
                <label htmlFor="avatar" className="block text-sm font-medium text-gray-700">
                  头像URL
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <input
                    type="text"
                    id="avatar"
                    name="avatar"
                    value={formData.avatar}
                    onChange={handleChange}
                    className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-l-md border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="https://example.com/avatar.jpg"
                  />
                  <div className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                    {formData.avatar && (
                      <img
                        src={formData.avatar}
                        alt="预览"
                        className="h-8 w-8 rounded-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                    )}
                  </div>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  输入图片URL作为头像（可选）
                </p>
              </div>

              {/* 昵称 */}
              <div>
                <label htmlFor="nickname" className="block text-sm font-medium text-gray-700">
                  昵称
                </label>
                <input
                  type="text"
                  id="nickname"
                  name="nickname"
                  value={formData.nickname}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="输入你的昵称"
                />
              </div>

              {/* 性别 */}
              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                  性别
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="">请选择</option>
                  {genderOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* 出生日期 */}
              <div>
                <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700">
                  出生年月日
                </label>
                <input
                  type="date"
                  id="birthDate"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              {/* 手机号 */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  手机号
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="请输入11位手机号"
                />
                <p className="mt-1 text-xs text-gray-500">
                  请输入有效的中国手机号码
                </p>
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleCancel}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <X className="mr-2 h-4 w-4" />
                取消
              </button>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="mr-2 h-4 w-4" />
                {saving ? '保存中...' : '保存'}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* 快捷链接 */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">快捷操作</h3>
        </div>
        <div className="border-t border-gray-200">
          <nav className="px-4 py-3 space-y-1">
            <Link
              href="/dashboard/ai-workshop"
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-50"
            >
              <Settings className="mr-3 h-5 w-5 text-gray-400" />
              AI模型工坊
            </Link>
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-3 py-2 text-sm font-medium text-red-700 rounded-md hover:bg-red-50"
            >
              <LogOut className="mr-3 h-5 w-5" />
              退出登录
            </button>
          </nav>
        </div>
      </div>

      {/* 关于 */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">关于</h3>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
          <div className="text-sm text-gray-600">
            <p className="mb-2">
              <strong>小说创作平台</strong>
            </p>
            <p className="mb-2">
              一个专为作家设计的智能小说创作平台，支持：
            </p>
            <ul className="list-disc list-inside space-y-1 mb-4">
              <li>小说信息管理</li>
              <li>章节创作与编辑</li>
              <li>AI辅助内容生成</li>
              <li>多模型配置管理</li>
            </ul>
            <p className="text-xs text-gray-500">
              版本 1.0.0
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
