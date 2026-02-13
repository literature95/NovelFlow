'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Save, ArrowLeft, User, Tag, Heart, Trash2 } from 'lucide-react'
import MDEditor from '@uiw/react-md-editor'

interface CharacterData {
  name: string
  description: string
  avatarUrl: string
  traits: {
    [key: string]: string
  }
  relationships: {
    [key: string]: string
  }
}

export default function EditCharacterPage({ params }: { params: { id: string; characterId: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(true)
  const [error, setError] = useState('')
  const [novelTitle, setNovelTitle] = useState('')
  const [characterData, setCharacterData] = useState<CharacterData>({
    name: '',
    description: '',
    avatarUrl: '',
    traits: {},
    relationships: {}
  })

  useEffect(() => {
    fetchCharacter()
    fetchNovelInfo()
  }, [])

  const fetchCharacter = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/novels/${params.id}/characters/${params.characterId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setCharacterData({
          name: data.character.name,
          description: data.character.description || '',
          avatarUrl: data.character.avatarUrl || '',
          traits: data.character.traits || {},
          relationships: data.character.relationships || {}
        })
      } else {
        setError('获取角色信息失败')
      }
    } catch (error) {
      console.error('获取角色信息失败:', error)
      setError('获取角色信息失败')
    } finally {
      setFetchLoading(false)
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!characterData.name.trim()) {
      setError('角色名称不能为空')
      return
    }

    setLoading(true)
    setError('')

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/novels/${params.id}/characters/${params.characterId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(characterData)
      })

      if (response.ok) {
        router.push(`/dashboard/novels/${params.id}/characters`)
      } else {
        const data = await response.json()
        setError(data.error || '更新角色失败')
      }
    } catch (error) {
      console.error('更新角色失败:', error)
      setError('更新角色失败')
    } finally {
      setLoading(false)
    }
  }

  const deleteCharacter = async () => {
    if (!confirm('确定要删除这个角色吗？此操作不可恢复。')) {
      return
    }

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/novels/${params.id}/characters/${params.characterId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        router.push(`/dashboard/novels/${params.id}/characters`)
      } else {
        setError('删除角色失败')
      }
    } catch (error) {
      console.error('删除角色失败:', error)
      setError('删除角色失败')
    }
  }

  const updateTrait = (trait: string, value: string) => {
    setCharacterData(prev => ({
      ...prev,
      traits: {
        ...prev.traits,
        [trait]: value
      }
    }))
  }

  const addTrait = () => {
    const key = prompt('特征名称（如：性格、年龄、外貌等）：')
    if (key) {
      setCharacterData(prev => ({
        ...prev,
        traits: {
          ...prev.traits,
          [key]: ''
        }
      }))
    }
  }

  const removeTrait = (key: string) => {
    setCharacterData(prev => {
      const newTraits = { ...prev.traits }
      delete newTraits[key]
      return {
        ...prev,
        traits: newTraits
      }
    })
  }

  const addRelationship = () => {
    const key = prompt('关系名称（如：朋友、敌人、家人等）：')
    if (key) {
      setCharacterData(prev => ({
        ...prev,
        relationships: {
          ...prev.relationships,
          [key]: ''
        }
      }))
    }
  }

  const updateRelationship = (key: string, value: string) => {
    setCharacterData(prev => ({
      ...prev,
      relationships: {
        ...prev.relationships,
        [key]: value
      }
    }))
  }

  const removeRelationship = (key: string) => {
    setCharacterData(prev => {
      const newRelationships = { ...prev.relationships }
      delete newRelationships[key]
      return {
        ...prev,
        relationships: newRelationships
      }
    })
  }

  if (fetchLoading) {
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
                href={`/dashboard/novels/${params.id}/characters`}
                className="text-gray-600 hover:text-gray-900"
              >
                ← 返回角色列表
              </Link>
              <h1 className="text-xl font-semibold text-gray-900">
                编辑角色: {characterData.name}
              </h1>
            </div>
            <button
              onClick={deleteCharacter}
              className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              删除角色
            </button>
          </div>
        </div>
      </div>

      {/* 主要内容 */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* 基本信息 */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-2 mb-6">
              <User className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">基本信息</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  角色名称 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={characterData.name}
                  onChange={(e) => setCharacterData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="请输入角色名称"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  头像链接
                </label>
                <input
                  type="url"
                  value={characterData.avatarUrl}
                  onChange={(e) => setCharacterData(prev => ({ ...prev, avatarUrl: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://example.com/avatar.jpg"
                />
              </div>
            </div>
            
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                角色描述
              </label>
              <div className="border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 overflow-hidden">
                <MDEditor
                  value={characterData.description}
                  onChange={(value) => setCharacterData(prev => ({ ...prev, description: value || '' }))}
                  height={250}
                  textareaProps={{
                    placeholder: "请描述角色的基本信息、背景故事等..."
                  }}
                />
              </div>
            </div>
          </div>

          {/* 角色特征 */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <Tag className="h-5 w-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-900">角色特征</h2>
              </div>
              <button
                type="button"
                onClick={addTrait}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                添加特征
              </button>
            </div>
            
            <div className="space-y-4">
              {Object.entries(characterData.traits).map(([trait, value]) => (
                <div key={trait} className="flex items-center space-x-3">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {trait}
                    </label>
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => updateTrait(trait, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder={`请输入${trait}信息`}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeTrait(trait)}
                    className="mt-6 text-red-600 hover:text-red-800"
                  >
                    删除
                  </button>
                </div>
              ))}
              
              {Object.keys(characterData.traits).length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  还没有添加角色特征，点击上方按钮开始添加
                </div>
              )}
            </div>
          </div>

          {/* 角色关系 */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <Heart className="h-5 w-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-900">角色关系</h2>
              </div>
              <button
                type="button"
                onClick={addRelationship}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                添加关系
              </button>
            </div>
            
            <div className="space-y-4">
              {Object.entries(characterData.relationships).map(([key, value]) => (
                <div key={key} className="flex items-center space-x-3">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {key}
                    </label>
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => updateRelationship(key, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder={`请输入${key}的详细信息`}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeRelationship(key)}
                    className="mt-6 text-red-600 hover:text-red-800"
                  >
                    删除
                  </button>
                </div>
              ))}
              
              {Object.keys(characterData.relationships).length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  还没有添加角色关系，点击上方按钮开始添加
                </div>
              )}
            </div>
          </div>

          {/* 提交按钮 */}
          <div className="flex justify-end space-x-4">
            <Link
              href={`/dashboard/novels/${params.id}/characters`}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              取消
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  保存中...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  保存更改
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}