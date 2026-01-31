'use client'

import { useState } from 'react'
import { 
  Plus, 
  Sparkles, 
  Edit3, 
  Save, 
  FileText,
  Lightbulb,
  Target,
  Hash,
  Bookmark
} from 'lucide-react'

interface QuickAction {
  icon: any
  label: string
  color: 'blue' | 'purple' | 'green' | 'orange'
  action?: () => void
}

interface QuickActionsProps {
  actions: QuickAction[]
}

export default function QuickActions({ actions }: QuickActionsProps) {
  const [hoveredAction, setHoveredAction] = useState<string | null>(null)

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-50 text-blue-600 hover:bg-blue-100',
      purple: 'bg-purple-50 text-purple-600 hover:bg-purple-100',
      green: 'bg-green-50 text-green-600 hover:bg-green-100',
      orange: 'bg-orange-50 text-orange-600 hover:bg-orange-100'
    }
    return colors[color as keyof typeof colors] || colors.blue
  }

  return (
    <div className="flex items-center gap-2">
      {actions.map((action, index) => {
        const Icon = action.icon
        return (
          <button
            key={index}
            onClick={action.action}
            onMouseEnter={() => setHoveredAction(action.label)}
            onMouseLeave={() => setHoveredAction(null)}
            className={`relative px-3 py-2 rounded-lg transition-all duration-200 ${getColorClasses(action.color)} group quick-action-button`}
            title={action.label}
          >
            <Icon className="h-4 w-4" />
            
            {/* 悬停提示 */}
            {hoveredAction === action.label && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap z-10">
                {action.label}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                  <div className="border-4 border-transparent border-t-gray-900"></div>
                </div>
              </div>
            )}
          </button>
        )
      })}
    </div>
  )
}