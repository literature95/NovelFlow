'use client'

interface Novel {
  id: string
  title: string
  wordCount: number
  chapterCount: number
  chapters?: any[]
  updatedAt: string
}

interface WritingProgressProps {
  novel: Novel
  generatingChapter?: string | null
}

export default function WritingProgress({ novel, generatingChapter }: WritingProgressProps) {
  // 移除了所有进度统计功能
  return null
}