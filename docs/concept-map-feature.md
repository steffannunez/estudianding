# Concept Map Feature

## Overview
Interactive concept map visualization at `/app/map` route. Renders topic concepts as a directed graph using React Flow with dagre automatic layout.

## Files
- `src/components/ConceptNode.jsx` - Custom React Flow node with glassmorphism styling
- `src/pages/ConceptMapPage.jsx` - Full page component mounted at `/app/map`

## How It Works

### ConceptNode
- Custom node registered as type `concept` in React Flow
- Receives `data` with: `label`, `depth`, `explanation`, `keywords`, `hasChildren`
- Color-coded left border by depth: cyan (0), blue (1), purple (2+)
- Shows truncated explanation (60 chars max) in muted text
- Has top (target) and bottom (source) handles for edge connections

### ConceptMapPage
1. On mount, fetches user topics via `getUserTopics()` API
2. Auto-selects the topic matching `state.currentTopic` from StudyContext
3. When a topic is selected, fetches concepts and edges via `getTopicWithConcepts()`
4. Merges additional concepts/edges from `ResearchContext` if the active research matches the selected topic
5. Transforms data into React Flow nodes (type `concept`) and edges (animated, colored by relation type)
6. Uses dagre to compute a top-to-bottom hierarchical layout (nodeWidth 220, nodeHeight 100)
7. Renders ReactFlow with Controls, MiniMap, and dotted Background

### Edge Styling
- `subtopic` edges: cyan (#22d3ee) with arrow marker
- `related` edges: blue (#60a5fa) with arrow marker
- All edges are animated

### Data Flow
```
getUserTopics() -> topic selector dropdown
getTopicWithConcepts(topicId) -> concepts + concept_edges
ResearchContext.research -> merged if same topic
dagre layout -> positioned nodes
ReactFlow -> rendered graph
```
