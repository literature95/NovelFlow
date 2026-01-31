'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface AuthGuardProps {
  children: React.ReactNode
  redirectTo?: string
}

export default function AuthGuard({ children, redirectTo }: AuthGuardProps) {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token')
      const user = localStorage.getItem('user')
      
      if (!token || !user) {
        const currentPath = window.location.pathname
        const authUrl = redirectTo ? `${redirectTo}?from=${encodeURIComponent(currentPath)}` : '/auth'
        router.push(authUrl)
        return
      }
      
      // 验证token格式（简单检查）
      try {
        const parsedUser = JSON.parse(user)
        if (!parsedUser.id || !parsedUser.username) {
          throw new Error('Invalid user data')
        }
        setIsAuthenticated(true)
      } catch (error) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        const currentPath = window.location.pathname
        const authUrl = redirectTo ? `${redirectTo}?from=${encodeURIComponent(currentPath)}` : '/auth'
        router.push(authUrl)
      }
      
      setIsLoading(false)
    }

    checkAuth()
  }, [router, redirectTo])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">正在验证身份...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // Will redirect
  }

  return <>{children}</>
}