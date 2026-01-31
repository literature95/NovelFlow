'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function TestRegisterPage() {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setResult('')

    try {
      const requestData = {
        email: formData.email.trim(),
        username: formData.username.trim(),
        password: formData.password
      }

      console.log('发送注册请求:', requestData)

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      })

      console.log('注册响应状态:', response.status)

      let data
      try {
        data = await response.json()
        console.log('注册响应数据:', data)
      } catch (parseError) {
        console.error('解析响应JSON失败:', parseError)
        setResult(`解析响应失败: ${parseError}`)
        setLoading(false)
        return
      }

      if (response.ok) {
        setResult(`✅ 注册成功！\n用户ID: ${data.user.id}\n邮箱: ${data.user.email}\n用户名: ${data.user.username}`)
      } else {
        setResult(`❌ 注册失败: ${data.error}`)
      }
    } catch (error) {
      console.error('注册请求异常:', error)
      setResult(`❌ 请求异常: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">注册功能测试</h1>
          <p className="text-gray-600">测试注册API是否正常工作</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">邮箱</label>
              <input
                name="email"
                type="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="test@example.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">用户名</label>
              <input
                name="username"
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="testuser"
                value={formData.username}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">密码</label>
              <input
                name="password"
                type="password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="至少6位"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">确认密码</label>
              <input
                name="confirmPassword"
                type="password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="再次输入密码"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? '测试中...' : '测试注册'}
            </button>
          </form>
        </div>

        {result && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="font-semibold mb-2">测试结果:</h2>
            <pre className="whitespace-pre-wrap text-sm bg-gray-100 p-4 rounded">
              {result}
            </pre>
          </div>
        )}

        <div className="text-center mt-6">
          <Link href="/register" className="text-blue-600 hover:underline">
            去正式注册页面 →
          </Link>
          <br />
          <Link href="/" className="text-gray-600 hover:underline">
            ← 返回首页
          </Link>
        </div>
      </div>
    </div>
  )
}