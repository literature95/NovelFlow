'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Plus, Users, Edit, Trash2, User } from 'lucide-react'

interface Character {
  id: string
  name: string
  description?: string
  avatarUrl?: string
  traits?: any
  relationships?: any
  createdAt: string
  updatedAt: string
}

export default function CharactersPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [characters, setCharacters] = useState<Character[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [novelTitle, setNovelTitle] = useState('')

  useEffect(() => {
    fetchCharacters()
    fetchNovelInfo()
  }, [])

  const fetchCharacters = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/novels/${params.id}/characters`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setCharacters(data.characters.map((char: Character) => ({
          ...char,
          traits: char.traits ? JSON.parse(char.traits) : null,
          relationships: char.relationships ? JSON.parse(char.relationships) : null
        })))
      } else {
        setError('获取角色列表失败')
      }
    } catch (error) {
      console.error('获取角色列表失败:', error)
      setError('获取角色列表失败')
    } finally {
      setLoading(false)
    }
  }

  const fetchNovelInfo = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/novels/${params.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setNovelTitle(data.novel.title)
      }
    } catch (error) {
      console.error('获取小说信息失败:', error)
    }
  }

  const deleteCharacter = async (characterId: string) => {
    if (!confirm('确定要删除这个角色吗？')) {
      return
    }

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/novels/${params.id}/characters/${characterId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        fetchCharacters()
      } else {
        setError('删除角色失败')
      }
    } catch (error) {
      console.error('删除角色失败:', error)
      setError('删除角色失败')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">加载中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link 
                href={`/dashboard/novels/${params.id}`}
                className="text-gray-600 hover:text-gray-900"
              >
                ← 返回小说
              </Link>
              <h1 className="text-xl font-semibold text-gray-900">
                {novelTitle} - 角色管理
              </h1>
            </div>
            <Link
              href={`/dashboard/novels/${params.id}/characters/create`}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              创建角色
            </Link>
          </div>
        </div>
      </div>

      {/* 主要内容 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* 角色统计 */}
        <div className="mb-8 bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <h2 className="text-lg font-semibold text-gray-900">角色统计</h2>
                <p className="text-gray-600">共 {characters.length} 个角色</p>
              </div>
            </div>
          </div>
        </div>

        {/* 角色列表 */}
        {characters.length === 0 ? (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">还没有角色</h3>
            <p className="text-gray-600 mb-6">开始创建你的第一个角色吧</p>
            <Link
              href={`/dashboard/novels/${params.id}/characters/create`}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              创建第一个角色
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {characters.map((character) => (
              <div key={character.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {character.avatarUrl ? (
                      <img 
                        src={character.avatarUrl} 
                        alt={character.name}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                        <User className="h-6 w-6 text-gray-500" />
                      </div>
                    )}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{character.name}</h3>
                      <p className="text-sm text-gray-500">角色</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Link
                      href={`/dashboard/novels/${params.id}/characters/${character.id}/edit`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Edit className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => deleteCharacter(character.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                {character.description && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {character.description}
                  </p>
                )}
                
                {character.traits && Object.keys(character.traits).length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">特征</h4>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(character.traits).map(([key, value]) => (
                        <span 
                          key={key}
                          className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                        >
                          {key}: {String(value)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="text-xs text-gray-500">
                  创建于 {new Date(character.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}