import { createContext, useContext, useReducer } from 'react'
import { researchTopic, deepenConcept, checkTopicExists } from '../lib/api'

const ResearchContext = createContext(null)

const initialState = {
  currentResearch: null,
  concepts: [],
  questions: [],
  edges: [],
  loadingTopic: false,
  loadingConceptId: null,
  error: null,
  cached: false,
  searchSuggestion: null,
  searchLoading: false,
}

function researchReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING_TOPIC':
      return { ...state, loadingTopic: true, error: null }
    case 'SET_RESEARCH_RESULT':
      return {
        ...state,
        currentResearch: action.payload.topic,
        concepts: action.payload.concepts,
        questions: action.payload.questions,
        edges: action.payload.edges,
        cached: action.payload.cached,
        loadingTopic: false,
        error: null,
      }
    case 'SET_LOADING_CONCEPT':
      return { ...state, loadingConceptId: action.payload, error: null }
    case 'ADD_SUB_CONCEPTS': {
      const newConcepts = action.payload.concepts.filter(
        nc => !state.concepts.some(c => c.id === nc.id)
      )
      const newQuestions = action.payload.questions.filter(
        nq => !state.questions.some(q => q.id === nq.id)
      )
      const newEdges = action.payload.edges.filter(
        ne => !state.edges.some(e => e.id === ne.id)
      )
      return {
        ...state,
        concepts: [...state.concepts, ...newConcepts],
        questions: [...state.questions, ...newQuestions],
        edges: [...state.edges, ...newEdges],
        loadingConceptId: null,
      }
    }
    case 'SET_ERROR':
      return { ...state, error: action.payload, loadingTopic: false, loadingConceptId: null }
    case 'SET_SEARCH_SUGGESTION':
      return { ...state, searchSuggestion: action.payload, searchLoading: false }
    case 'SET_SEARCH_LOADING':
      return { ...state, searchLoading: true }
    case 'CLEAR_SEARCH':
      return { ...state, searchSuggestion: null, searchLoading: false }
    case 'CLEAR_RESEARCH':
      return { ...initialState }
    default:
      return state
  }
}

export function ResearchProvider({ children }) {
  const [state, dispatch] = useReducer(researchReducer, initialState)

  async function doResearch(query) {
    dispatch({ type: 'SET_LOADING_TOPIC' })
    try {
      const result = await researchTopic(query)
      dispatch({ type: 'SET_RESEARCH_RESULT', payload: result })
      return result
    } catch (err) {
      const msg = err?.message || 'Error al investigar el tema'
      dispatch({ type: 'SET_ERROR', payload: msg.includes('Rate limit') ? 'Has alcanzado el limite de investigaciones por hora. Intenta mas tarde.' : msg })
      throw err
    }
  }

  async function doDeepen(conceptId, topicId) {
    dispatch({ type: 'SET_LOADING_CONCEPT', payload: conceptId })
    try {
      const result = await deepenConcept(conceptId, topicId)
      dispatch({ type: 'ADD_SUB_CONCEPTS', payload: result })
      return result
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err?.message || 'Error al profundizar' })
      throw err
    }
  }

  async function doCheckExists(query) {
    dispatch({ type: 'SET_SEARCH_LOADING' })
    try {
      const result = await checkTopicExists(query)
      dispatch({ type: 'SET_SEARCH_SUGGESTION', payload: result.exists ? result : null })
      return result
    } catch {
      dispatch({ type: 'CLEAR_SEARCH' })
    }
  }

  const value = {
    research: state,
    doResearch,
    doDeepen,
    doCheckExists,
    clearResearch: () => dispatch({ type: 'CLEAR_RESEARCH' }),
    clearSearch: () => dispatch({ type: 'CLEAR_SEARCH' }),
  }

  return <ResearchContext.Provider value={value}>{children}</ResearchContext.Provider>
}

export function useResearch() {
  const context = useContext(ResearchContext)
  if (!context) throw new Error('useResearch must be used within ResearchProvider')
  return context
}
