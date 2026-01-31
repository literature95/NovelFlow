'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    // 验证admin身份
    const storedUser = localStorage.getItem('user')
    const storedToken = localStorage.getItem('token')
    
    if (!storedUser || !storedToken) {
      router.push('/admin/login')
      return
    }

    try {
      const userData = JSON.parse(storedUser)
      if (userData.role !== 'admin') {
        router.push('/login')
        return
      }
      setUser(userData)
    } catch (err) {
      router.push('/admin/login')
    }
  }, [router])

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

  // 不渲染任何布局，直接返回children
  // 因为admin页面自己包含完整的布局
  return <>{children}</>
}
