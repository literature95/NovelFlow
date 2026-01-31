import EnhancedNovelsList from '@/components/EnhancedNovelsList'

export default function NovelsPage() {
  return (
    <div>
      {/* 页面标题 */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">创作中心</h1>
        <p className="mt-2 text-gray-600">
          管理你的小说创作，查看创作统计，快速编辑和发布作品
        </p>
      </div>
      
      {/* 增强的小说列表组件 */}
      <EnhancedNovelsList />
    </div>
  )
}