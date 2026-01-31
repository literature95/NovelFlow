'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface RegisterResponse {
  message: string
  code: string
  requestId: string
  processingTime?: number
  token?: string
  user?: {
    id: string
    email: string
    username: string
    createdAt?: string
  }
  mobileOptimized?: boolean
  details?: string
  suggestions?: string[]
}

interface ErrorResponse {
  error: string
  code: string
  requestId: string
  details?: string
  suggestions?: string[]
  conflictType?: string
}

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [errorDetails, setErrorDetails] = useState('')
  const [requestId, setRequestId] = useState('')
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [isMobile, setIsMobile] = useState(false)
  const [networkStatus, setNetworkStatus] = useState('unknown')
  const [screenWidth, setScreenWidth] = useState(0)
  const router = useRouter()

  // 检测移动设备和网络状态
  useEffect(() => {
    const checkDevice = () => {
      const userAgent = navigator.userAgent.toLowerCase()
      const isMobileDevice = /mobile|android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent)
      setIsMobile(isMobileDevice)
      console.log('设备检测:', { isMobileDevice, userAgent: userAgent.substring(0, 100) })
    }

    const checkScreenSize = () => {
      setScreenWidth(window.innerWidth)
    }

    const checkNetwork = () => {
      if ('connection' in navigator) {
        const connection = (navigator as any).connection
        setNetworkStatus(connection.effectiveType || 'unknown')
      }
      setNetworkStatus(navigator.onLine ? 'online' : 'offline')
    }

    checkDevice()
    checkScreenSize()
    checkNetwork()

    // 监听屏幕尺寸变化
    window.addEventListener('resize', checkScreenSize)
    
    // 监听网络状态变化
    const handleOnline = () => setNetworkStatus('online')
    const handleOffline = () => setNetworkStatus('offline')
    
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    
    return () => {
      window.removeEventListener('resize', checkScreenSize)
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // 清除错误信息
    if (error) {
      setError('')
      setErrorDetails('')
      setSuggestions([])
    }
  }, [error])

  const validateForm = useCallback(() => {
    // 基本验证
    if (!formData.email || !formData.username || !formData.password) {
      setError('请填写所有必填字段')
      return false
    }

    if (formData.password.length < 6) {
      setError('密码长度至少6位')
      return false
    }

    if (formData.password !== formData.confirmPassword) {
      setError('两次输入的密码不一致')
      return false
    }

    // 邮箱格式验证
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email.trim())) {
      setError('请输入有效的邮箱地址')
      return false
    }

    // 用户名格式验证
    const usernameRegex = /^[\w\u4e00-\u9fa5]{2,20}$/
    if (!usernameRegex.test(formData.username.trim())) {
      setError('用户名只能包含字母、数字、下划线和中文，长度2-20位')
      return false
    }

    return true
  }, [formData])

  const saveUserData = useCallback(async (data: RegisterResponse) => {
    if (!data.token || !data.user) {
      throw new Error('响应数据不完整')
    }

    try {
      // 移动端优先使用 sessionStorage 作为备份
      const storageData = {
        token: data.token,
        user: data.user,
        timestamp: Date.now()
      }

      // 尝试 localStorage
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      localStorage.setItem('loginTime', Date.now().toString())

      // 移动端备份到 sessionStorage
      if (isMobile) {
        sessionStorage.setItem('token', data.token)
        sessionStorage.setItem('user', JSON.stringify(data.user))
        sessionStorage.setItem('loginTime', Date.now().toString())
      }

      console.log('用户数据保存成功')
      return true
    } catch (storageError) {
      console.error('保存数据失败:', storageError)
      
      // 移动端存储失败的处理
      if (isMobile) {
        // 尝试清除一些存储空间
        try {
          const keys = Object.keys(localStorage)
          for (const key of keys) {
            if (key.startsWith('temp_') || key.startsWith('cache_')) {
              localStorage.removeItem(key)
            }
          }
          // 重试保存
          localStorage.setItem('token', data.token)
          localStorage.setItem('user', JSON.stringify(data.user))
          return true
        } catch (retryError) {
          console.error('重试保存失败:', retryError)
        }
      }
      
      throw new Error('保存登录信息失败，请检查浏览器存储设置')
    }
  }, [isMobile])

  const handleRegisterError = useCallback((data: ErrorResponse, responseStatus: number) => {
    console.error('注册失败:', data)
    
    const errorMessage = data.error || '注册失败'
    const details = data.details || ''
    const requestId = data.requestId || ''
    const suggestions = data.suggestions || []

    setError(errorMessage)
    setErrorDetails(details)
    setRequestId(requestId)
    setSuggestions(suggestions)

    // 移动端特殊错误处理
    if (isMobile) {
      switch (data.code) {
        case 'NETWORK_TIMEOUT':
          setError('网络连接超时')
          setSuggestions([
            '请检查手机网络连接',
            '尝试切换到更稳定的网络（WiFi）',
            '关闭后台其他应用释放网络资源',
            '稍后重试或重启浏览器'
          ])
          break
        case 'DATABASE_ERROR':
          setError('服务器暂时繁忙')
          setSuggestions([
            '服务器负载较高，请稍后重试',
            '可能是网络延迟导致，建议切换网络',
            '如问题持续，请联系技术支持'
          ])
          break
        case 'INVALID_DATA_FORMAT':
          setError('数据传输异常')
          setSuggestions([
            '请刷新页面后重试',
            '检查网络连接是否稳定',
            '尝试重新输入注册信息'
          ])
          break
      }
    }
  }, [isMobile])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // 网络状态检查
    if (networkStatus === 'offline') {
      setError('网络连接已断开，请检查网络后重试')
      setSuggestions(['检查WiFi或移动数据连接', '尝试切换网络环境', '确认网络信号强度'])
      return
    }

    if (!validateForm()) {
      return
    }

    setLoading(true)
    setError('')
    setErrorDetails('')
    setRequestId('')
    setSuggestions([])

    try {
      const requestData = {
        email: formData.email.trim(),
        username: formData.username.trim(),
        password: formData.password
      }

      console.log('发送注册请求:', {
        email: requestData.email,
        username: requestData.username,
        passwordLength: requestData.password.length,
        isMobile,
        networkStatus,
        requestUrl: '/api/auth/register',
        method: 'POST',
        timestamp: new Date().toISOString()
      })

      // 移动端增加请求超时时间
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), isMobile ? 45000 : 30000)

      let fetchUrl = '/api/auth/register'
      
      // 在移动端或开发环境下，确保使用完整的URL
      if (isMobile || window.location.hostname === 'localhost') {
        fetchUrl = `${window.location.origin}/api/auth/register`
      }

      console.log('发送注册请求到:', fetchUrl)

      const response = await fetch(fetchUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Mobile-Optimized': isMobile ? 'true' : 'false',
          'Accept': 'application/json',
          'Cache-Control': 'no-cache',
          'X-Client-Info': JSON.stringify({
            userAgent: navigator.userAgent.substring(0, 200),
            isMobile,
            networkStatus,
            timestamp: Date.now(),
            screenWidth: window.innerWidth,
            screenHeight: window.innerHeight
          })
        },
        body: JSON.stringify(requestData),
        signal: controller.signal,
        credentials: 'same-origin' // 确保包含cookies
      })

      clearTimeout(timeoutId)

      console.log('注册响应状态:', response.status, response.statusText)

      let data: RegisterResponse | ErrorResponse
      try {
        const responseText = await response.text()
        console.log('响应原文:', responseText.substring(0, 500))
        
        data = JSON.parse(responseText)
      } catch (parseError) {
        console.error('解析响应JSON失败:', parseError)
        setError('服务器返回格式错误，请刷新页面后重试')
        setSuggestions(['刷新页面重试', '检查网络连接', '稍后再试'])
        return
      }

      if (response.ok && 'token' in data) {
        console.log('注册成功，开始保存用户数据')
        
        try {
          await saveUserData(data as RegisterResponse)
          console.log('用户数据已保存，跳转到dashboard')
          router.push('/dashboard')
        } catch (saveError) {
          console.error('保存数据失败:', saveError)
          setError('保存登录信息失败')
          setErrorDetails(saveError instanceof Error ? saveError.message : '未知错误')
          setSuggestions([
            '检查浏览器存储权限',
            '尝试清理浏览器缓存',
            '使用其他浏览器重试',
            '联系技术支持'
          ])
        }
      } else {
        handleRegisterError(data as ErrorResponse, response.status)
      }
    } catch (error) {
      console.error('注册请求异常:', error)
      
      // 移动端网络错误特殊处理
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          setError('请求超时，请检查网络后重试')
          setSuggestions([
            '检查网络连接稳定性',
            '尝试切换到WiFi环境',
            '关闭其他占用网络的应用',
            '稍后重试或重启浏览器'
          ])
        } else if (error.message.includes('fetch') || error.message.includes('network') || error.message.includes('Failed to fetch')) {
          setError('网络连接失败，无法连接到服务器')
          setSuggestions([
            '检查手机网络连接（WiFi/移动数据）',
            '尝试切换网络环境',
            '确认网络信号强度',
            '重启网络服务或路由器',
            '稍后重试',
            '如果是企业网络，可能需要配置代理'
          ])
        } else if (error.message.includes('CORS') || error.message.includes('Cross-Origin')) {
          setError('跨域请求被阻止，请联系技术支持')
          setSuggestions([
            '刷新页面重试',
            '清除浏览器缓存',
            '使用不同浏览器尝试',
            '联系技术支持获取帮助'
          ])
        } else {
          setError('注册过程中发生错误')
          setSuggestions([
            '刷新页面重试',
            '检查网络连接',
            '确认所有必填项已填写',
            '稍后再试'
          ])
        }
      } else {
        setError('注册过程中发生未知错误')
        setSuggestions([
          '刷新页面重试',
          '检查网络连接',
          '稍后再试'
        ])
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-start justify-center px-3 sm:px-4 py-4 sm:py-8">
      <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-6 lg:gap-8 items-start">
        {/* 左侧：品牌介绍 - 移动端隐藏或简化 */}
        <div className={`${isMobile ? 'hidden' : 'block'} text-center lg:text-left order-2 lg:order-1`}>
          <Link href="/" className="inline-block mb-8">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
              小说创作平台
            </h1>
          </Link>
          
          <div className="mb-8">
            <p className="text-xl text-gray-600 mb-6">
              加入我们，开启您的AI辅助创作之旅
            </p>
            <div className="w-20 h-1 bg-green-600 mx-auto lg:mx-0"></div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">免费使用</h3>
                <p className="text-sm text-gray-600">完全免费，无任何隐藏费用</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">安全可靠</h3>
                <p className="text-sm text-gray-600">您的创作内容安全保密</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">快速上手</h3>
                <p className="text-sm text-gray-600">简单易用，即学即会</p>
              </div>
            </div>
          </div>
        </div>

        {/* 右侧：注册表单 */}
        <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-xl shadow-lg w-full max-w-md mx-auto lg:max-w-none lg:mx-0 order-1 lg:order-2">
          {/* 移动端标题 */}
          {isMobile && (
            <div className="text-center mb-6">
              <Link href="/" className="inline-block mb-4">
                <h1 className="text-2xl font-bold text-gray-900">
                  小说创作平台
                </h1>
              </Link>
            </div>
          )}

          <div className="text-center mb-6 lg:mb-8">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 sm:w-8 sm:h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
              创建新账户
            </h2>
            <p className="text-gray-600 text-sm sm:text-base">
              加入我们，开始您的创作之旅
            </p>
            
            {/* 移动端设备状态显示 */}
            {isMobile && (
              <div className="mt-4 text-xs text-gray-500">
                <div className="flex items-center justify-center space-x-2">
                  <span>移动端优化</span>
                  <span>•</span>
                  <span>网络: {networkStatus === 'online' ? '在线' : '离线'}</span>
                  {screenWidth > 0 && (
                    <>
                      <span>•</span>
                      <span>{screenWidth}px</span>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          <form className="space-y-4 sm:space-y-5 lg:space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-3 sm:px-4 py-3 rounded-lg">
                <div className="flex items-start">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <div className="flex-1">
                    <p className="font-medium text-sm sm:text-base">{error}</p>
                    {errorDetails && (
                      <p className="text-sm text-red-500 mt-1">{errorDetails}</p>
                    )}
                    {requestId && (
                      <p className="text-xs text-red-400 mt-1">请求ID: {requestId}</p>
                    )}
                  </div>
                </div>
                
                {/* 移动端建议显示 */}
                {suggestions.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-red-200">
                    <p className="text-sm font-medium text-red-700 mb-2">建议解决方案:</p>
                    <ul className="text-sm text-red-600 space-y-1">
                      {suggestions.map((suggestion, index) => (
                        <li key={index} className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            <div className="space-y-3 sm:space-y-4 lg:space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  邮箱地址
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="w-full px-3 sm:px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none transition-colors text-base sm:text-lg"
                  placeholder="请输入邮箱地址"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  用户名
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  autoComplete="username"
                  className="w-full px-3 sm:px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none transition-colors text-base sm:text-lg"
                  placeholder="请输入用户名（2-20位）"
                  value={formData.username}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  密码
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="new-password"
                  className="w-full px-3 sm:px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none transition-colors text-base sm:text-lg"
                  placeholder="请输入密码（至少6位）"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  确认密码
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  autoComplete="new-password"
                  className="w-full px-3 sm:px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none transition-colors text-base sm:text-lg"
                  placeholder="请再次输入密码"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || networkStatus === 'offline'}
              className="w-full flex items-center justify-center px-4 py-4 border border-transparent text-base sm:text-lg font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  注册中...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  免费注册
                </>
              )}
            </button>
          </form>

          <div className="mt-4 sm:mt-6 text-center space-y-3">
            <div className="text-sm text-gray-600">
              已有账户？{' '}
              <Link
                href="/login"
                className="font-medium text-indigo-600 hover:text-indigo-500 inline-flex items-center"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                立即登录
              </Link>
            </div>
            <div className="text-xs">
              <Link href="/" className="text-gray-500 hover:text-gray-700">
                ← 返回首页
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}