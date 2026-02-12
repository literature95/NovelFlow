'use client'

import { useState, useEffect } from 'react'
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  addEdge
} from 'reactflow'
import 'reactflow/dist/style.css'
import { Users, Heart, Sword, Shield, ArrowRight, Link } from 'lucide-react'

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

interface CharacterRelationshipGraphProps {
  characters: Character[]
  novelId: string
}

const CharacterRelationshipGraph: React.FC<CharacterRelationshipGraphProps> = ({ characters, novelId }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [loading, setLoading] = useState(true)

  // 关系类型图标映射
  const relationshipIcons: { [key: string]: React.ReactNode } = {
    '朋友': <Heart className="h-4 w-4 text-red-500" />,
    '敌人': <Sword className="h-4 w-4 text-red-600" />,
    '家人': <Users className="h-4 w-4 text-blue-500" />,
    '导师': <Shield className="h-4 w-4 text-green-500" />,
    '同事': <Link className="h-4 w-4 text-purple-500" />
  }

  // 生成角色节点和关系边
  useEffect(() => {
    if (!characters || characters.length === 0) {
      setLoading(false)
      return
    }

    // 生成节点
    const generatedNodes: Node[] = characters.map((character, index) => {
      const angle = (index / characters.length) * 2 * Math.PI
      const radius = 200
      const x = Math.cos(angle) * radius + 250
      const y = Math.sin(angle) * radius + 250

      return {
        id: character.id,
        type: 'default',
        position: { x, y },
        data: {
          label: character.name,
          character
        },
        style: {
          width: 120,
          height: 80,
          borderRadius: '8px',
          background: '#fff',
          border: '2px solid #3b82f6',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
        }
      }
    })

    // 生成边
    const generatedEdges: Edge[] = []
    characters.forEach((character, index) => {
      if (character.relationships) {
        Object.entries(character.relationships).forEach(([relationType, relatedCharacter]) => {
          const targetCharacter = characters.find(char => char.name === relatedCharacter)
          if (targetCharacter) {
            generatedEdges.push({
              id: `${character.id}-${targetCharacter.id}`,
              source: character.id,
              target: targetCharacter.id,
              label: relationType,
              arrowHeadType: 'arrowclosed',
              style: {
                stroke: '#888',
                strokeWidth: 2
              },
              labelStyle: {
                background: '#fff',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: 'bold',
                border: '1px solid #ddd'
              }
            })
          }
        })
      }
    })

    setNodes(generatedNodes)
    setEdges(generatedEdges)
    setLoading(false)
  }, [characters, setNodes, setEdges])

  // 处理边的添加
  const onConnect = (params: any) => {
    setEdges(eds => addEdge({ ...params, arrowHeadType: 'arrowclosed' }, eds))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (characters.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96 bg-gray-50">
        <Users className="h-16 w-16 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">暂无角色</h3>
        <p className="text-gray-600">请先创建角色，然后再查看关系图谱</p>
      </div>
    )
  }

  return (
    <div className="w-full h-96 bg-white rounded-lg shadow-sm p-4">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <Background color="#aaa" gap={16} />
        <Controls />
        <MiniMap
          nodeColor={(node) => {
            return '#3b82f6'
          }}
          maskColor="rgba(255, 255, 255, 0.6)"
        />
      </ReactFlow>
    </div>
  )
}

export default CharacterRelationshipGraph