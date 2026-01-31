'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Settings, CheckCircle, Circle, Bot, TestTube, Save, Eye } from 'lucide-react'

interface AIModel {
  id: string
  name: string
  apiKey: string
  baseUrl?: string
  model: string
  role: string
  systemPrompt: string
  temperature: number
  maxTokens: number
  contextWindow: number
  topP: number
  topN?: number
  frequencyPenalty: number
  presencePenalty: number
  isActive: boolean
  isDefault: boolean
  createdAt: string
  updatedAt: string
}

export default function AIWorkshopPage() {
  const [models, setModels] = useState<AIModel[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingModel, setEditingModel] = useState<AIModel | null>(null)
  const [showTestModal, setShowTestModal] = useState(false)
  const [testingModel, setTestingModel] = useState<AIModel | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchModels()
  }, [])

  const fetchModels = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/ai-models', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setModels(data.models || [])
      } else {
        setError('获取AI模型失败')
      }
    } catch (error) {
      setError('网络错误')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (formData: Partial<AIModel>) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/ai-models', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setShowCreateModal(false)
        fetchModels()
        alert('模型创建成功')
      } else {
        const data = await response.json()
        alert(data.error || '创建失败')
      }
    } catch (error) {
      alert('创建失败')
    }
  }

  const handleUpdate = async (id: string, formData: Partial<AIModel>) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/ai-models/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setEditingModel(null)
        fetchModels()
        alert('更新成功')
      } else {
        const data = await response.json()
        alert(data.error || '更新失败')
      }
    } catch (error) {
      alert('更新失败')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这个AI模型吗？')) return

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/ai-models/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        fetchModels()
        alert('删除成功')
      } else {
        alert('删除失败')
      }
    } catch (error) {
      alert('删除失败')
    }
  }

  const handleSetActive = async (id: string) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/ai-models/${id}/activate`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        fetchModels()
        alert('已设置为激活模型')
      } else {
        alert('设置失败')
      }
    } catch (error) {
      alert('设置失败')
    }
  }

  const handleSetDefault = async (id: string) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/ai-models/${id}/default`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        fetchModels()
        alert('已设置为默认模型')
      } else {
        alert('设置失败')
      }
    } catch (error) {
      alert('设置失败')
    }
  }

  const handleTest = (model: AIModel) => {
    setTestingModel(model)
    setShowTestModal(true)
  }

  if (loading) {
    return <div className="flex justify-center items-center h-64">加载中...</div>
  }

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI模型工坊</h1>
          <p className="mt-1 text-sm text-gray-600">管理你的AI模型API配置、角色设定和生成参数</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Plus className="mr-2 h-4 w-4" />
          添加模型
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* 模型列表 */}
      {models.length === 0 ? (
        <div className="text-center py-12">
          <Bot className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">还没有AI模型</h3>
          <p className="mt-1 text-sm text-gray-500">添加你的第一个AI模型配置</p>
          <div className="mt-6">
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Plus className="mr-2 h-4 w-4" />
              添加模型
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {models.map((model) => (
              <li key={model.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center flex-1">
                      <div className="flex items-center mr-4">
                        <button
                          onClick={() => handleSetActive(model.id)}
                          className="mr-2"
                          title={model.isActive ? "已激活" : "点击激活"}
                        >
                          {model.isActive ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <Circle className="h-5 w-5 text-gray-400 hover:text-green-500" />
                          )}
                        </button>
                        {model.isDefault && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                            默认
                          </span>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900">
                          {model.name}
                          {model.isActive && (
                            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                              激活中
                            </span>
                          )}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          模型: {model.model} • 
                          温度: {model.temperature} • 
                          最大令牌: {model.maxTokens}
                          {model.baseUrl && ` • 自定义API`}
                        </p>
                        {model.role && (
                          <p className="mt-1 text-sm text-gray-600">
                            <span className="font-medium">角色:</span> {model.role}
                          </p>
                        )}
                        <p className="mt-1 text-xs text-gray-400">
                          创建于 {new Date(model.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => handleTest(model)}
                        className="text-gray-400 hover:text-purple-600"
                        title="测试模型"
                      >
                        <TestTube className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => setEditingModel(model)}
                        className="text-gray-400 hover:text-indigo-600"
                        title="编辑模型"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      {!model.isDefault && (
                        <button
                          onClick={() => handleSetDefault(model.id)}
                          className="text-gray-400 hover:text-blue-600"
                          title="设为默认"
                        >
                          <Save className="h-5 w-5" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(model.id)}
                        className="text-gray-400 hover:text-red-600"
                        title="删除模型"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 创建模型模态框 */}
      {showCreateModal && (
        <ModelModal
          title="添加AI模型"
          model={null}
          onSave={handleCreate}
          onCancel={() => setShowCreateModal(false)}
        />
      )}

      {/* 编辑模型模态框 */}
      {editingModel && (
        <ModelModal
          title="编辑AI模型"
          model={editingModel}
          onSave={(data) => handleUpdate(editingModel.id, data)}
          onCancel={() => setEditingModel(null)}
        />
      )}

      {/* 测试模型模态框 */}
      {showTestModal && testingModel && (
        <TestModal
          model={testingModel}
          onClose={() => setShowTestModal(false)}
        />
      )}
    </div>
  )
}

interface ModelModalProps {
  title: string
  model: AIModel | null
  onSave: (data: Partial<AIModel>) => void
  onCancel: () => void
}

function ModelModal({ title, model, onSave, onCancel }: ModelModalProps) {
  const [formData, setFormData] = useState({
    name: model?.name || '',
    apiKey: model?.apiKey || '',
    baseUrl: model?.baseUrl || '',
    model: model?.model || 'gpt-3.5-turbo',
    role: model?.role || '',
    systemPrompt: model?.systemPrompt || '',
    temperature: model?.temperature || 0.7,
    maxTokens: model?.maxTokens || 2000,
    contextWindow: model?.contextWindow || 4096,
    topP: model?.topP || 1,
    topN: model?.topN || 0,
    frequencyPenalty: model?.frequencyPenalty || 0,
    presencePenalty: model?.presencePenalty || 0
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-[600px] shadow-lg rounded-md bg-white max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              模型名称 *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              API密钥 *
            </label>
            <input
              type="password"
              required
              value={formData.apiKey}
              onChange={(e) => setFormData({...formData, apiKey: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              API基础地址（可选）
            </label>
            <input
              type="url"
              value={formData.baseUrl}
              onChange={(e) => setFormData({...formData, baseUrl: e.target.value})}
              placeholder="例如: https://api.openai.com/v1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              模型名称 *
            </label>
            <input
              type="text"
              required
              value={formData.model}
              onChange={(e) => setFormData({...formData, model: e.target.value})}
              placeholder="例如: gpt-3.5-turbo, gpt-4, claude-3-sonnet"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              角色设定 *
            </label>
            <textarea
              required
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
              rows={2}
              placeholder="例如: 你是一个专业的小说家，擅长创作科幻小说"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              系统提示词
            </label>
            <textarea
              value={formData.systemPrompt}
              onChange={(e) => setFormData({...formData, systemPrompt: e.target.value})}
              rows={3}
              placeholder="更详细的系统指导，定义AI的写作风格和规范"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* 高级参数 */}
          <div className="border-t pt-4">
            <h4 className="text-sm font-medium text-gray-900 mb-4">高级参数</h4>
            
            <div className="space-y-4">
              {/* 上下文窗口 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  上下文窗口 (Token数)
                </label>
                <input
                  type="number"
                  min="1"
                  max="128000"
                  step="1"
                  value={formData.contextWindow}
                  onChange={(e) => setFormData({...formData, contextWindow: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
                <p className="mt-1 text-xs text-gray-500">
                  模型在生成响应时要考虑的文本数量。例如设置为4096表示只考虑最后4096个token
                </p>
              </div>

              {/* 最大令牌 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  最大令牌数
                </label>
                <input
                  type="number"
                  min="1"
                  max="8000"
                  value={formData.maxTokens}
                  onChange={(e) => setFormData({...formData, maxTokens: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
                <p className="mt-1 text-xs text-gray-500">
                  定义生成的响应中令牌的最大数量，控制输出长度
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* 温度 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    温度 (0-2)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="2"
                    value={formData.temperature}
                    onChange={(e) => setFormData({...formData, temperature: parseFloat(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    控制生成输出的随机性，越高越随机
                  </p>
                </div>
                
                {/* Top P */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Top P (0-1)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="1"
                    value={formData.topP}
                    onChange={(e) => setFormData({...formData, topP: parseFloat(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    核采样，控制输出的多样性
                  </p>
                </div>

                {/* Top N */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Top N (0为禁用)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.topN}
                    onChange={(e) => setFormData({...formData, topN: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    每步采样时考虑前N个最可能的标记，0表示禁用
                  </p>
                </div>

                {/* 频率惩罚 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    频率惩罚 (-2到2)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="-2"
                    max="2"
                    value={formData.frequencyPenalty}
                    onChange={(e) => setFormData({...formData, frequencyPenalty: parseFloat(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    减少重复单词或短语的出现
                  </p>
                </div>
              </div>

              {/* 存在惩罚 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  存在惩罚 (-2到2)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="-2"
                  max="2"
                  value={formData.presencePenalty}
                  onChange={(e) => setFormData({...formData, presencePenalty: parseFloat(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
                <p className="mt-1 text-xs text-gray-500">
                  阻止模型提到特定单词或短语，增加话题多样性
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              保存
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

interface TestModalProps {
  model: AIModel
  onClose: () => void
}

function TestModal({ model, onClose }: TestModalProps) {
  const [prompt, setPrompt] = useState('请写一段关于未来世界的描述，约100字')
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)

  const handleTest = async () => {
    if (!prompt.trim()) return

    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const testResponse = await fetch('/api/ai-models/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          modelId: model.id,
          prompt: prompt
        })
      })

      if (testResponse.ok) {
        const data = await testResponse.json()
        setResponse(data.response)
      } else {
        const errorData = await testResponse.json()
        setResponse(`错误: ${errorData.error || '测试失败'}`)
      }
    } catch (error) {
      setResponse('网络错误')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-[600px] shadow-lg rounded-md bg-white">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">测试模型: {model.name}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <Eye className="h-5 w-5" />
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              测试提示
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
          <button
            onClick={handleTest}
            disabled={loading || !prompt.trim()}
            className="w-full px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-gray-300"
          >
            {loading ? '测试中...' : '开始测试'}
          </button>
          
          {response && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                模型回复
              </label>
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-md">
                <pre className="whitespace-pre-wrap text-sm text-gray-800">{response}</pre>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  )
}