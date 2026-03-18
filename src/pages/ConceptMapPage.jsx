import { useState, useEffect, useCallback, useMemo } from 'react'
import {
  ReactFlow,
  Controls,
  MiniMap,
  Background,
  useNodesState,
  useEdgesState,
  MarkerType,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import dagre from 'dagre'

import ConceptNode from '../components/ConceptNode'
import { useAuth } from '../context/AuthContext'
import { useStudy } from '../context/StudyContext'
import { useResearch } from '../context/ResearchContext'
import { getUserTopics, getTopicWithConcepts } from '../lib/api'

// --- Dagre layout -----------------------------------------------------------

function getLayoutedElements(nodes, edges, direction = 'TB') {
  const g = new dagre.graphlib.Graph()
  g.setDefaultEdgeLabel(() => ({}))
  g.setGraph({ rankdir: direction, nodesep: 50, ranksep: 80 })

  nodes.forEach((node) => g.setNode(node.id, { width: 220, height: 100 }))
  edges.forEach((edge) => g.setEdge(edge.source, edge.target))

  dagre.layout(g)

  const layoutedNodes = nodes.map((node) => {
    const pos = g.node(node.id)
    return { ...node, position: { x: pos.x - 110, y: pos.y - 50 } }
  })

  return { nodes: layoutedNodes, edges }
}

// --- Edge styling ------------------------------------------------------------

function buildEdgeStyle(edgeType) {
  const isSubtopic = edgeType === 'subtopic'
  return {
    animated: true,
    style: { stroke: isSubtopic ? '#22d3ee' : '#60a5fa', strokeWidth: 2 },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: isSubtopic ? '#22d3ee' : '#60a5fa',
    },
  }
}

// --- Component ---------------------------------------------------------------

export default function ConceptMapPage() {
  const { user } = useAuth()
  const { state } = useStudy()
  const { research } = useResearch()

  const [topics, setTopics] = useState([])
  const [selectedTopicId, setSelectedTopicId] = useState(null)
  const [loading, setLoading] = useState(false)

  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])

  const nodeTypes = useMemo(() => ({ concept: ConceptNode }), [])

  // Fetch user topics on mount
  useEffect(() => {
    if (!user) return
    getUserTopics()
      .then((data) => {
        setTopics(data)
        // Auto-select currentTopic from study context if available
        if (state.currentTopic) {
          const match = data.find(
            (t) => t.topics?.title === state.currentTopic
          )
          if (match) setSelectedTopicId(match.topic_id)
        }
      })
      .catch(() => {})
  }, [user, state.currentTopic])

  // Build graph when topic changes or research context updates
  const buildGraph = useCallback(
    async (topicId) => {
      if (!topicId) {
        setNodes([])
        setEdges([])
        return
      }

      setLoading(true)
      try {
        const { concepts, edges: conceptEdges } =
          await getTopicWithConcepts(topicId)

        // Merge research concepts if they belong to the same topic
        let allConcepts = [...concepts]
        let allEdges = [...conceptEdges]

        if (
          research.currentResearch &&
          research.currentResearch.id === topicId
        ) {
          const existingIds = new Set(allConcepts.map((c) => c.id))
          research.concepts.forEach((rc) => {
            if (!existingIds.has(rc.id)) allConcepts.push(rc)
          })
          const existingEdgeIds = new Set(allEdges.map((e) => e.id))
          research.edges.forEach((re) => {
            if (!existingEdgeIds.has(re.id)) allEdges.push(re)
          })
        }

        if (allConcepts.length === 0) {
          setNodes([])
          setEdges([])
          setLoading(false)
          return
        }

        // Determine which concepts have children
        const parentIds = new Set(
          allEdges
            .filter((e) => e.relation_type === 'subtopic')
            .map((e) => e.source_concept_id)
        )

        // Build React Flow nodes
        const rfNodes = allConcepts.map((c) => ({
          id: c.id,
          type: 'concept',
          data: {
            label: c.title,
            depth: c.depth ?? 0,
            explanation: c.explanation,
            keywords: c.keywords,
            hasChildren: parentIds.has(c.id),
          },
          position: { x: 0, y: 0 },
        }))

        // Build React Flow edges
        const rfEdges = allEdges.map((e) => ({
          id: e.id,
          source: e.source_concept_id,
          target: e.target_concept_id,
          ...buildEdgeStyle(e.relation_type),
        }))

        const { nodes: layoutedNodes, edges: layoutedEdges } =
          getLayoutedElements(rfNodes, rfEdges)

        setNodes(layoutedNodes)
        setEdges(layoutedEdges)
      } catch {
        setNodes([])
        setEdges([])
      } finally {
        setLoading(false)
      }
    },
    [research, setNodes, setEdges]
  )

  useEffect(() => {
    buildGraph(selectedTopicId)
  }, [selectedTopicId, buildGraph])

  // --- Render ----------------------------------------------------------------

  const selectedTopic = topics.find((t) => t.topic_id === selectedTopicId)

  return (
    <div className="px-4 md:px-8 py-6 page-enter">
      {/* Header + topic selector */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
        <h1
          className="text-2xl font-bold"
          style={{ color: 'var(--text-primary)' }}
        >
          Mapa Conceptual
        </h1>

        <select
          className="glass px-4 py-2 text-sm rounded-xl outline-none cursor-pointer"
          style={{
            color: 'var(--text-primary)',
            minWidth: 200,
          }}
          value={selectedTopicId || ''}
          onChange={(e) => setSelectedTopicId(e.target.value || null)}
        >
          <option value="">Selecciona un tema</option>
          {topics.map((t) => (
            <option key={t.topic_id} value={t.topic_id}>
              {t.topics?.title || t.topic_id}
            </option>
          ))}
        </select>
      </div>

      {/* Map container */}
      <div
        className="glass-heavy overflow-hidden"
        style={{ height: 'calc(100vh - 12rem)', borderRadius: '1rem' }}
      >
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div
              className="animate-spin rounded-full h-10 w-10 border-b-2"
              style={{ borderColor: '#22d3ee' }}
            />
          </div>
        ) : nodes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3">
            <span className="text-4xl">🗺️</span>
            <p
              className="text-center max-w-xs"
              style={{ color: 'var(--text-muted)' }}
            >
              {selectedTopicId
                ? 'No hay conceptos para este tema todavia. Investiga un tema para generar el mapa.'
                : 'Selecciona un tema del menu para visualizar sus conceptos.'}
            </p>
          </div>
        ) : (
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{ padding: 0.2 }}
            minZoom={0.2}
            maxZoom={2}
            proOptions={{ hideAttribution: true }}
          >
            <Controls
              style={{
                background: 'var(--glass-bg)',
                borderRadius: '0.75rem',
                border: '1px solid var(--glass-border)',
              }}
            />
            <MiniMap
              nodeColor={(n) => {
                const depth = n.data?.depth ?? 0
                if (depth === 0) return '#22d3ee'
                if (depth === 1) return '#3b82f6'
                return '#8b5cf6'
              }}
              style={{
                background: 'var(--glass-bg)',
                borderRadius: '0.75rem',
                border: '1px solid var(--glass-border)',
              }}
              maskColor="rgba(0,0,0,0.15)"
            />
            <Background
              variant="dots"
              gap={20}
              size={1}
              color="var(--text-muted)"
              style={{ opacity: 0.3 }}
            />
          </ReactFlow>
        )}
      </div>
    </div>
  )
}
