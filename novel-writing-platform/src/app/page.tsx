import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* 主内容区 */}
      <main>
        {/* Hero 区域 */}
        <section className="min-h-[80vh] flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium mb-8">
                <span className="w-2 h-2 bg-indigo-600 rounded-full mr-2 animate-pulse"></span>
                全新升级 · AI驱动创作
              </div>
              
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                智能AI辅助
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 mt-2">
                  让创作灵感无限延伸
                </span>
              </h1>
              
              <p className="text-xl sm:text-2xl text-gray-600 max-w-3xl mx-auto mb-10 leading-relaxed">
                专业的小说创作管理平台，集成强大的AI助手，帮助您快速生成内容、管理章节、配置多模型，让写作变得更加高效和愉悦
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                <Link
                  href="/register"
                  className="px-8 py-4 text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
                >
                  免费开始创作
                </Link>
                <Link
                  href="/login"
                  className="px-8 py-4 text-lg font-medium text-gray-700 bg-white hover:bg-gray-50 rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
                >
                  了解更多
                </Link>
              </div>

              {/* 数据统计 */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl font-bold text-indigo-600 mb-2">10万+</div>
                  <div className="text-sm text-gray-600">活跃创作者</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl font-bold text-purple-600 mb-2">500万+</div>
                  <div className="text-sm text-gray-600">创作章节数</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl font-bold text-blue-600 mb-2">99.9%</div>
                  <div className="text-sm text-gray-600">用户满意度</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl font-bold text-pink-600 mb-2">24/7</div>
                  <div className="text-sm text-gray-600">智能助手在线</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 功能特性 */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                强大功能，助力创作
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                从灵感到成书，我们提供全方位的创作支持
              </p>
            </div>

            <div className="max-w-4xl mx-auto space-y-6">
              <div className="text-left p-8 border-b border-gray-200 pb-8">
                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">AI智能创作</h3>
                    <p className="text-gray-600 leading-relaxed">
                      强大的AI助手帮助您快速生成内容，突破创作瓶颈，激发无限灵感。支持多种创作模式和风格定制
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-left p-8 border-b border-gray-200 pb-8">
                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">小说管理</h3>
                    <p className="text-gray-600 leading-relaxed">
                      完善的小说和章节管理功能，支持多视图模式、批量操作和高级搜索，让创作井井有条
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-left p-8">
                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">多模型配置</h3>
                    <p className="text-gray-600 leading-relaxed">
                      支持多种AI模型和自定义参数配置，灵活适配不同的创作需求，让每个故事都有独特的风格
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA 区域 */}
        <section className="py-20 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
              开始您的创作之旅
            </h2>
            <p className="text-xl text-indigo-100 mb-10 max-w-2xl mx-auto">
              立即注册，免费体验AI辅助创作，让您的灵感变成精彩的故事
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="px-8 py-4 text-lg font-medium text-indigo-600 bg-white hover:bg-gray-50 rounded-xl transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
              >
                免费注册
              </Link>
              <Link
                href="/login"
                className="px-8 py-4 text-lg font-medium text-white border-2 border-white hover:bg-white/10 rounded-xl transition-all hover:-translate-y-1"
              >
                已有账户？登录
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* 页脚 */}
      <footer className="bg-gray-900 text-gray-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <span className="text-lg font-bold text-white">小说创作平台</span>
              </div>
              <p className="text-sm">
                专业的小说创作管理平台，让每一个故事都能被听见
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">产品</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">功能介绍</a></li>
                <li><a href="#" className="hover:text-white transition-colors">价格方案</a></li>
                <li><a href="#" className="hover:text-white transition-colors">更新日志</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">支持</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">帮助中心</a></li>
                <li><a href="#" className="hover:text-white transition-colors">使用教程</a></li>
                <li><a href="#" className="hover:text-white transition-colors">联系我们</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">关于</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">关于我们</a></li>
                <li><a href="#" className="hover:text-white transition-colors">隐私政策</a></li>
                <li><a href="#" className="hover:text-white transition-colors">服务条款</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; 2025 小说创作平台. 保留所有权利.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
