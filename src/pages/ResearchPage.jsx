import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useResearch } from '../context/ResearchContext'
import { useStudy } from '../context/StudyContext'

function ConceptCard({ concept, depth = 0, allConcepts, onDeepen, loadingConceptId, topicId }) {
  const children = allConcepts.filter(c => c.parent_concept_id === concept.id)
  const isLoading = loadingConceptId === concept.id
  const hasChildren = children.length > 0
  const depthColors = ['text-cyan-400', 'text-blue-400', 'text-purple-400', 'text-pink-400']

  return (
    <div style={{ marginLeft: depth > 0 ? `${Math.min(depth, 3) * 16}px` : 0 }}>
      <div className={`glass glass-hover p-5 mb-3 animate-slide-up ${depth > 0 ? 'border-l-2' : ''}`}
        style={depth > 0 ? { borderLeftColor: ['#22d3ee', '#60a5fa', '#a78bfa', '#f472b6'][Math.min(depth - 1, 3)] } : {}}>
        <div className="flex items-start gap-3">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
            style={{ background: depth === 0 ? 'linear-gradient(135deg, #1e3a5f, #2f74c0)' : `linear-gradient(135deg, ${['#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899'][Math.min(depth, 3)]}, ${['#22d3ee', '#60a5fa', '#a78bfa', '#f472b6'][Math.min(depth, 3)]})` }}>
            {depth > 0 ? '↳' : (allConcepts.filter(c => c.parent_concept_id === concept.parent_concept_id && c.depth === concept.depth).indexOf(concept) + 1 || '•')}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className={`text-base font-semibold mb-1 ${depthColors[Math.min(depth, 3)]}`}>
              {concept.title}
            </h4>
            <p className="text-sm leading-relaxed mb-2" style={{ color: 'var(--text-muted)' }}>
              {concept.explanation}
            </p>
            {concept.keywords?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-2">
                {concept.keywords.map((kw, i) => (
                  <span key={i} className="glass px-2 py-0.5 text-xs" style={{ borderRadius: '9999px', color: 'var(--text-muted)' }}>
                    {kw}
                  </span>
                ))}
              </div>
            )}
            <button
              onClick={() => onDeepen(concept.id, topicId)}
              disabled={isLoading || hasChildren}
              className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-all duration-200 cursor-pointer border-none
                ${hasChildren ? 'opacity-40 cursor-not-allowed' : 'hover:scale-105'}
              `}
              style={{
                background: hasChildren ? 'var(--glass-bg)' : 'linear-gradient(135deg, #06b6d4, #22d3ee)',
                color: hasChildren ? 'var(--text-muted)' : '#0f1f35',
              }}
            >
              {isLoading ? (
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" />
                  Investigando...
                </span>
              ) : hasChildren ? 'Ya profundizado' : 'Profundizar'}
            </button>
          </div>
        </div>
      </div>

      {/* Render children recursively */}
      {children.map(child => (
        <ConceptCard
          key={child.id}
          concept={child}
          depth={depth + 1}
          allConcepts={allConcepts}
          onDeepen={onDeepen}
          loadingConceptId={loadingConceptId}
          topicId={topicId}
        />
      ))}
    </div>
  )
}

export default function ResearchPage() {
  const navigate = useNavigate()
  const { research, doResearch, doDeepen, doCheckExists, clearResearch, clearSearch } = useResearch()
  const { setTopic } = useStudy()
  const [query, setQuery] = useState('')
  const debounceRef = useRef(null)

  const { currentResearch, concepts, loadingTopic, loadingConceptId, error, cached, searchSuggestion, searchLoading } = research

  // Debounced search suggestion
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (query.length < 3) {
      clearSearch()
      return
    }
    debounceRef.current = setTimeout(() => {
      doCheckExists(query)
    }, 500)
    return () => clearTimeout(debounceRef.current)
  }, [query]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!query.trim()) return
    try {
      await doResearch(query.trim())
    } catch { /* error handled in context */ }
  }

  const handleDeepen = async (conceptId, topicId) => {
    try {
      await doDeepen(conceptId, topicId)
    } catch { /* error handled in context */ }
  }

  const handleStudyTopic = (mode) => {
    if (!currentResearch) return
    setTopic(currentResearch.normalized_name || currentResearch.name?.toLowerCase())
    navigate(`/app/${mode}`)
  }

  const topLevelConcepts = concepts.filter(c => c.parent_concept_id === null)

  return (
    <div className="px-4 md:px-8 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Investigar tema
          </h1>
          {currentResearch && (
            <button onClick={() => { clearResearch(); setQuery('') }} className="btn-glass text-sm">
              Nueva busqueda
            </button>
          )}
        </div>

        {/* Search */}
        {!currentResearch && !loadingTopic && (
          <div className="animate-fade-in">
            <form onSubmit={handleSearch} className="mb-6">
              <div className="glass-heavy p-2 flex gap-2 items-center" style={{ borderRadius: '1rem' }}>
                <div className="pl-3">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Escribe cualquier tema: React Hooks, Fisica Cuantica, Marketing Digital..."
                  className="flex-1 bg-transparent border-none outline-none py-3 px-2 text-base"
                  style={{ color: 'var(--text-primary)' }}
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={!query.trim()}
                  className="btn-primary-glass px-6 py-3 disabled:opacity-40"
                >
                  Investigar
                </button>
              </div>
            </form>

            {/* Search suggestion (dedup) */}
            {searchLoading && (
              <div className="glass p-3 mb-4 flex items-center gap-2 text-sm animate-fade-in" style={{ color: 'var(--text-muted)' }}>
                <span className="w-4 h-4 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin inline-block" />
                Buscando temas similares...
              </div>
            )}

            {searchSuggestion && (
              <button
                onClick={() => { setQuery(searchSuggestion.topic.name); doResearch(searchSuggestion.topic.name) }}
                className="glass glass-hover p-4 w-full text-left mb-4 animate-scale-in cursor-pointer border-none"
              >
                <div className="flex items-center gap-3">
                  <span className="text-cyan-400 text-xl">💡</span>
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                      Este tema ya fue investigado: <span className="text-cyan-400">{searchSuggestion.topic.name}</span>
                    </p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      Click para ver los resultados existentes (sin gastar una investigacion)
                    </p>
                  </div>
                </div>
              </button>
            )}

            {/* Suggestions */}
            <div className="text-center mt-8">
              <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>Prueba con:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {['Machine Learning', 'React Hooks', 'Ciberseguridad', 'Economia conductual', 'Docker', 'Diseno UX'].map(s => (
                  <button
                    key={s}
                    onClick={() => setQuery(s)}
                    className="glass glass-hover px-4 py-2 text-sm cursor-pointer border-none"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Loading state */}
        {loadingTopic && (
          <div className="glass-heavy p-12 text-center animate-fade-in">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full border-4 border-cyan-400 border-t-transparent animate-spin" />
            <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
              La IA esta investigando
            </h3>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Analizando "{query}" y extrayendo conceptos clave...
            </p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="glass p-6 text-center animate-scale-in mb-6"
            style={{ background: 'rgba(239, 68, 68, 0.15)', borderColor: 'rgba(239, 68, 68, 0.3)' }}>
            <div className="text-3xl mb-2">⚠️</div>
            <p className="text-red-400 font-medium mb-3">{error}</p>
            <button onClick={() => { clearResearch(); setQuery('') }} className="btn-glass text-sm">
              Intentar de nuevo
            </button>
          </div>
        )}

        {/* Results */}
        {currentResearch && !loadingTopic && (
          <div className="animate-fade-in">
            {/* Topic header */}
            <div className="glass-heavy p-6 mb-6">
              <div className="flex items-start gap-4">
                <span className="text-4xl">{currentResearch.icon || '📚'}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                      {currentResearch.name}
                    </h2>
                    {cached && (
                      <span className="glass px-2 py-0.5 text-xs text-cyan-400" style={{ borderRadius: '9999px' }}>
                        Cached
                      </span>
                    )}
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                    {currentResearch.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Stats bar */}
            <div className="flex flex-wrap gap-3 mb-6">
              <span className="glass px-3 py-1.5 text-xs font-medium" style={{ borderRadius: '9999px', color: 'var(--text-muted)' }}>
                {concepts.length} conceptos
              </span>
              <span className="glass px-3 py-1.5 text-xs font-medium" style={{ borderRadius: '9999px', color: 'var(--text-muted)' }}>
                {concepts.filter(c => c.depth === 0).length} principales
              </span>
              <span className="glass px-3 py-1.5 text-xs font-medium" style={{ borderRadius: '9999px', color: 'var(--text-muted)' }}>
                {concepts.filter(c => c.depth > 0).length} sub-conceptos
              </span>
            </div>

            {/* Concept tree */}
            <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-secondary)' }}>
              Conceptos clave
            </h3>

            <div className="space-y-1">
              {topLevelConcepts.map(concept => (
                <ConceptCard
                  key={concept.id}
                  concept={concept}
                  depth={0}
                  allConcepts={concepts}
                  onDeepen={handleDeepen}
                  loadingConceptId={loadingConceptId}
                  topicId={currentResearch.id}
                />
              ))}
            </div>

            {/* Action buttons */}
            <div className="mt-10 glass-heavy p-6 text-center">
              <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
                Continua aprendiendo con estas herramientas
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <button onClick={() => handleStudyTopic('study')} className="btn-primary-glass">
                  📚 Modo Estudio
                </button>
                <button onClick={() => handleStudyTopic('cards')} className="btn-accent-glass">
                  🎴 Tarjetas
                </button>
                <button onClick={() => handleStudyTopic('quiz')} className="btn-glass">
                  ❓ Quiz
                </button>
                <button onClick={() => navigate('/app/map')} className="btn-glass">
                  🗺️ Mapa Conceptual
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
