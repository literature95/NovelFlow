'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface SystemInfo {
  userAgent: string
  isMobile: boolean
  screenWidth: number
  screenHeight: number
  networkStatus: string
  connectionType: string
  localStorage: boolean
  sessionStorage: boolean
  cookies: boolean
  javascript: boolean
}

interface TestResult {
  name: string
  status: 'pending' | 'success' | 'error'
  message: string
  details?: string
}

export default function MobileHelpPage() {
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null)
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [isRunningTests, setIsRunningTests] = useState(false)

  useEffect(() => {
    // 收集系统信息
    const collectSystemInfo = () => {
      const info: SystemInfo = {
        userAgent: navigator.userAgent,
        isMobile: /Mobile|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
        screenWidth: window.innerWidth,
        screenHeight: window.innerHeight,
        networkStatus: navigator.onLine ? 'online' : 'offline',
        connectionType: 'unknown',
        localStorage: false,
        sessionStorage: false,
        cookies: navigator.cookieEnabled,
        javascript: true
      }

      // 检测连接类型
      if ('connection' in navigator) {
        const connection = (navigator as any).connection
        info.connectionType = connection.effectiveType || connection.type || 'unknown'
      }

      // 测试存储功能
      try {
        localStorage.setItem('test', 'test')
        localStorage.removeItem('test')
        info.localStorage = true
      } catch (e) {
        info.localStorage = false
      }

      try {
        sessionStorage.setItem('test', 'test')
        sessionStorage.removeItem('test')
        info.sessionStorage = true
      } catch (e) {
        info.sessionStorage = false
      }

      setSystemInfo(info)
    }

    collectSystemInfo()
  }, [])

  const runTests = async () => {
    setIsRunningTests(true)
    const results: TestResult[] = []

    // 测试1: 网络连接
    results.push({
      name: '网络连接测试',
      status: 'pending',
      message: '正在测试...'
    })

    try {
      const response = await fetch('/api/debug/register', {
        method: 'GET',
        headers: {
          'User-Agent': navigator.userAgent
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        results[0] = {
          name: '网络连接测试',
          status: 'success',
          message: '服务器连接正常',
          details: `响应时间: ${Date.now() - Date.now()}ms, 用户数: ${data.database?.userCount || 0}`
        }
      } else {
        results[0] = {
          name: '网络连接测试',
          status: 'error',
          message: `服务器响应错误: ${response.status}`,
          details: response.statusText
        }
      }
    } catch (error) {
      results[0] = {
        name: '网络连接测试',
        status: 'error',
        message: '网络连接失败',
        details: error instanceof Error ? error.message : '未知错误'
      }
    }

    // 测试2: API调试端点
    results.push({
      name: '注册API测试',
      status: 'pending',
      message: '正在测试...'
    })

    try {
      const response = await fetch('/api/debug/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: `test${Date.now()}@example.com`,
          username: `test${Date.now()}`,
          password: 'testpass123'
        })
      })
      
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          results[1] = {
            name: '注册API测试',
            status: 'success',
            message: 'API功能正常',
            details: `处理时间: ${data.processingTime}ms, 所有步骤通过`
          }
        } else {
          results[1] = {
            name: '注册API测试',
            status: 'error',
            message: 'API验证失败',
            details: data.error || '未知错误'
          }
        }
      } else {
        results[1] = {
          name: '注册API测试',
          status: 'error',
          message: `API错误: ${response.status}`,
          details: response.statusText
        }
      }
    } catch (error) {
      results[1] = {
        name: '注册API测试',
        status: 'error',
        message: 'API测试失败',
        details: error instanceof Error ? error.message : '未知错误'
      }
    }

    // 测试3: 本地存储
    results.push({
      name: '本地存储测试',
      status: 'pending',
      message: '正在测试...'
    })

    try {
      const testData = { token: 'test-token', user: { id: 'test', email: 'test@example.com' } }
      
      localStorage.setItem('test-token', testData.token)
      localStorage.setItem('test-user', JSON.stringify(testData.user))
      
      const retrievedToken = localStorage.getItem('test-token')
      const retrievedUser = JSON.parse(localStorage.getItem('test-user') || '{}')
      
      localStorage.removeItem('test-token')
      localStorage.removeItem('test-user')
      
      if (retrievedToken === testData.token && retrievedUser.id === testData.user.id) {
        results[2] = {
          name: '本地存储测试',
          status: 'success',
          message: 'localStorage工作正常',
          details: '可以正常存储和读取数据'
        }
      } else {
        results[2] = {
          name: '本地存储测试',
          status: 'error',
          message: 'localStorage数据不一致',
          details: '存储和读取的数据不匹配'
        }
      }
    } catch (error) {
      results[2] = {
        name: '本地存储测试',
        status: 'error',
        message: 'localStorage测试失败',
        details: error instanceof Error ? error.message : '未知错误'
      }
    }

    // 测试4: JSON处理
    results.push({
      name: 'JSON处理测试',
      status: 'pending',
      message: '正在测试...'
    })

    try {
      const testData = { email: 'test@example.com', username: 'testuser', password: 'testpass123' }
      const jsonString = JSON.stringify(testData)
      const parsedData = JSON.parse(jsonString)
      
      if (parsedData.email === testData.email && parsedData.username === testData.username) {
        results[3] = {
          name: 'JSON处理测试',
          status: 'success',
          message: 'JSON处理正常',
          details: '序列化和反序列化正常'
        }
      } else {
        results[3] = {
          name: 'JSON处理测试',
          status: 'error',
          message: 'JSON数据不一致',
          details: '序列化和反序列化结果不匹配'
        }
      }
    } catch (error) {
      results[3] = {
        name: 'JSON处理测试',
        status: 'error',
        message: 'JSON处理失败',
        details: error instanceof Error ? error.message : '未知错误'
      }
    }

    setTestResults(results)
    setIsRunningTests(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-50 border-green-200'
      case 'error': return 'text-red-600 bg-red-50 border-red-200'
      case 'pending': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return '✅'
      case 'error': return '❌'
      case 'pending': return '⏳'
      default: return '❓'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">📱 移动端注册帮助</h1>
          <p className="text-gray-600">诊断和解决移动端注册问题</p>
        </div>

        {/* 系统信息 */}
        {systemInfo && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">🔍 系统信息</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="font-medium text-gray-700">设备类型:</span>
                <span className="ml-2 text-gray-600">{systemInfo.isMobile ? '📱 移动设备' : '💻 桌面设备'}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">屏幕尺寸:</span>
                <span className="ml-2 text-gray-600">{systemInfo.screenWidth} × {systemInfo.screenHeight}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">网络状态:</span>
                <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
                  systemInfo.networkStatus === 'online' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {systemInfo.networkStatus === 'online' ? '🌐 在线' : '📵 离线'}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700">连接类型:</span>
                <span className="ml-2 text-gray-600">{systemInfo.connectionType}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">LocalStorage:</span>
                <span className={`ml-2 ${systemInfo.localStorage ? 'text-green-600' : 'text-red-600'}`}>
                  {systemInfo.localStorage ? '✅ 支持' : '❌ 不支持'}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Cookies:</span>
                <span className={`ml-2 ${systemInfo.cookies ? 'text-green-600' : 'text-red-600'}`}>
                  {systemInfo.cookies ? '✅ 启用' : '❌ 禁用'}
                </span>
              </div>
            </div>
            <div className="mt-4 p-3 bg-gray-50 rounded">
              <p className="text-sm text-gray-600 font-medium mb-1">User Agent:</p>
              <p className="text-xs text-gray-500 break-all">{systemInfo.userAgent}</p>
            </div>
          </div>
        )}

        {/* 测试按钮 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">🧪 系统测试</h2>
          <button
            onClick={runTests}
            disabled={isRunningTests}
            className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isRunningTests ? '🔄 正在测试...' : '🚀 开始测试'}
          </button>
        </div>

        {/* 测试结果 */}
        {testResults.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">📊 测试结果</h2>
            <div className="space-y-3">
              {testResults.map((result, index) => (
                <div key={index} className={`p-4 border rounded-lg ${getStatusColor(result.status)}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-xl mr-3">{getStatusIcon(result.status)}</span>
                      <div>
                        <h3 className="font-medium">{result.name}</h3>
                        <p className="text-sm mt-1">{result.message}</p>
                        {result.details && (
                          <p className="text-xs mt-2 opacity-75">{result.details}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 解决方案建议 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">💡 常见问题解决方案</h2>
          <div className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-medium text-gray-800 mb-1">网络连接问题</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 检查WiFi或移动数据连接</li>
                <li>• 尝试切换网络环境</li>
                <li>• 重启路由器或切换网络</li>
                <li>• 确认网络信号强度</li>
              </ul>
            </div>
            <div className="border-l-4 border-green-500 pl-4">
              <h3 className="font-medium text-gray-800 mb-1">浏览器设置</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 清除浏览器缓存和Cookie</li>
                <li>• 确保JavaScript已启用</li>
                <li>• 检查localStorage权限</li>
                <li>• 尝试使用无痕模式</li>
              </ul>
            </div>
            <div className="border-l-4 border-yellow-500 pl-4">
              <h3 className="font-medium text-gray-800 mb-1">输入验证</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 确保邮箱格式正确 (example@domain.com)</li>
                <li>• 用户名长度2-20位，支持中英文</li>
                <li>• 密码至少6位字符</li>
                <li>• 确认密码与密码一致</li>
              </ul>
            </div>
            <div className="border-l-4 border-purple-500 pl-4">
              <h3 className="font-medium text-gray-800 mb-1">企业网络</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 检查防火墙设置</li>
                <li>• 确认代理配置</li>
                <li>• 联系IT部门协助</li>
                <li>• 尝试使用移动数据网络</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 快速链接 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">🔗 快速链接</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="/register"
              className="block p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="text-blue-600 font-medium">📝 注册页面</div>
              <div className="text-sm text-gray-600 mt-1">返回注册页面</div>
            </Link>
            <Link
              href="/login"
              className="block p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="text-green-600 font-medium">🔐 登录页面</div>
              <div className="text-sm text-gray-600 mt-1">已有账户？立即登录</div>
            </Link>
            <Link
              href="/"
              className="block p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="text-purple-600 font-medium">🏠 返回首页</div>
              <div className="text-sm text-gray-600 mt-1">回到平台首页</div>
            </Link>
            <a
              href="/mobile-register-test.html"
              className="block p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="text-orange-600 font-medium">🧪 测试工具</div>
              <div className="text-sm text-gray-600 mt-1">移动端注册测试工具</div>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}