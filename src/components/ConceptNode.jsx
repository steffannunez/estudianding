import { Handle, Position } from '@xyflow/react'

const depthColors = {
  0: '#22d3ee',
  1: '#3b82f6',
  2: '#8b5cf6',
}

function getDepthColor(depth) {
  return depthColors[depth] ?? depthColors[2]
}

export default function ConceptNode({ data }) {
  const { label, depth = 0, explanation, hasChildren } = data
  const borderColor = getDepthColor(depth)
  const truncated = explanation
    ? explanation.length > 60
      ? explanation.slice(0, 60) + '...'
      : explanation
    : ''

  return (
    <div
      className="glass"
      style={{
        width: 200,
        padding: '12px 14px',
        borderLeft: `3px solid ${borderColor}`,
        borderRadius: '0.75rem',
        cursor: 'grab',
      }}
    >
      <Handle
        type="target"
        position={Position.Top}
        style={{
          background: borderColor,
          width: 8,
          height: 8,
          border: 'none',
        }}
      />

      <div
        style={{
          fontWeight: 700,
          fontSize: '0.8rem',
          color: 'var(--text-primary)',
          lineHeight: 1.3,
          marginBottom: truncated ? 6 : 0,
        }}
      >
        {label}
      </div>

      {truncated && (
        <div
          style={{
            fontSize: '0.65rem',
            color: 'var(--text-muted)',
            lineHeight: 1.4,
          }}
        >
          {truncated}
        </div>
      )}

      {hasChildren && (
        <div
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: borderColor,
            margin: '6px auto 0',
          }}
        />
      )}

      <Handle
        type="source"
        position={Position.Bottom}
        style={{
          background: borderColor,
          width: 8,
          height: 8,
          border: 'none',
        }}
      />
    </div>
  )
}
