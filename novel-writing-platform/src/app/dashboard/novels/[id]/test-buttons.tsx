'use client'

import { Settings, Sparkles, FileText, Trash2 } from 'lucide-react'

export default function TestButtons() {
  const testChapter = {
    id: 'test',
    order: 1,
    title: '测试章节',
    summary: '这是一个测试章节',
    isAIGenerated: false,
    updatedAt: new Date().toISOString()
  }

  const handleEditSummary = () => {
    alert('设置按钮被点击！')
  }

  const handleAIGenerate = () => {
    alert('AI生成按钮被点击！')
  }

  const handleEditContent = () => {
    alert('文档按钮被点击！')
  }

  const handleDelete = () => {
    alert('删除按钮被点击！')
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">按钮测试页面</h1>
      
      <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-500 mr-3">
                第{testChapter.order}章
              </span>
              <h3 className="text-base font-medium text-gray-900">
                {testChapter.title}
              </h3>
            </div>
            <p className="mt-2 text-sm text-gray-600">
              {testChapter.summary}
            </p>
          </div>
          <div className="ml-4 flex items-center space-x-2">
            <button
              onClick={handleEditSummary}
              className="text-gray-400 hover:text-blue-600 transition-colors p-2 hover:bg-gray-100 rounded border"
              title="章节详情：编辑标题和简介"
              type="button"
            >
              <Settings className="h-4 w-4" />
            </button>
            <button
              onClick={handleAIGenerate}
              className="text-gray-400 hover:text-green-600 transition-colors p-2 hover:bg-gray-100 rounded border"
              title="AI生成：根据简介自动创作章节内容"
              type="button"
            >
              <Sparkles className="h-4 w-4" />
            </button>
            <button
              onClick={handleEditContent}
              className="text-gray-400 hover:text-indigo-600 transition-colors p-2 hover:bg-gray-100 rounded border"
              title="文档：编辑章节完整内容"
              type="button"
            >
              <FileText className="h-4 w-4" />
            </button>
            <button
              onClick={handleDelete}
              className="text-gray-400 hover:text-red-600 transition-colors p-2 hover:bg-gray-100 rounded border"
              title="删除章节"
              type="button"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8 p-4 bg-gray-50 rounded">
        <h2 className="text-lg font-medium mb-4">独立按钮测试</h2>
        <div className="space-x-4">
          <button
            onClick={handleEditSummary}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            设置按钮测试
          </button>
          <button
            onClick={handleAIGenerate}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            AI生成测试
          </button>
          <button
            onClick={handleEditContent}
            className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
          >
            文档按钮测试
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            删除按钮测试
          </button>
        </div>
      </div>
    </div>
  )
}