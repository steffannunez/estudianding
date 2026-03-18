/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useReducer, useEffect } from 'react'
import knowledgeData from '../data/knowledge.json'

const StudyContext = createContext(null)

const BADGES = {
  first_card: { name: 'Primera Tarjeta', description: 'Marca tu primera tarjeta como conocida', icon: '🃏' },
  card_master: { name: 'Maestro de Tarjetas', description: '50 tarjetas conocidas', icon: '🎴' },
  quiz_ace: { name: 'Quiz Perfecto', description: '100% en un quiz', icon: '🏆' },
  streak_3: { name: 'Racha de 3', description: '3 dias seguidos', icon: '🔥' },
  streak_7: { name: 'Semana Completa', description: '7 dias seguidos', icon: '💎' },
  level_5: { name: 'Nivel 5', description: 'Alcanza el nivel 5', icon: '⭐' },
  level_10: { name: 'Nivel 10', description: 'Alcanza el nivel 10', icon: '🌟' },
  all_topics: { name: 'Explorador', description: 'Estudia los 10 temas', icon: '🗺️' },
}

const loadGamification = () => {
  try {
    const saved = localStorage.getItem('ravenai_gamification')
    if (saved) return JSON.parse(saved)
  } catch { /* ignore */ }
  return null
}

const loadDarkMode = () => {
  try {
    return localStorage.getItem('ravenai_dark_mode') === 'true'
  } catch { return false }
}

const savedGamification = loadGamification()

const initialState = {
  currentTopic: null,
  currentMode: 'home',
  topics: Object.keys(knowledgeData),
  knowledgeBase: knowledgeData,
  score: 0,
  totalQuestions: 0,
  correctAnswers: 0,
  topicProgress: {},
  currentCardIndex: 0,
  currentQuestionIndex: 0,
  showAnswer: false,
  xp: savedGamification?.xp || 0,
  level: savedGamification?.level || 1,
  streak: savedGamification?.streak || 0,
  lastStudyDate: savedGamification?.lastStudyDate || null,
  badges: savedGamification?.badges || [],
  xpHistory: [],
  totalCardsKnown: savedGamification?.totalCardsKnown || 0,
  darkMode: loadDarkMode(),
}

function studyReducer(state, action) {
  switch (action.type) {
    case 'SET_TOPIC':
      return {
        ...state,
        currentTopic: action.payload,
        currentCardIndex: 0,
        currentQuestionIndex: 0,
        showAnswer: false,
      }
    case 'SET_MODE':
      return {
        ...state,
        currentMode: action.payload,
        currentCardIndex: 0,
        currentQuestionIndex: 0,
        showAnswer: false,
      }
    case 'NEXT_CARD': {
      const topicData = state.knowledgeBase[state.currentTopic]
      const maxCards = topicData ? topicData.conceptos.length : 0
      return {
        ...state,
        currentCardIndex: Math.min(state.currentCardIndex + 1, maxCards - 1),
        showAnswer: false,
      }
    }
    case 'PREV_CARD':
      return {
        ...state,
        currentCardIndex: Math.max(state.currentCardIndex - 1, 0),
        showAnswer: false,
      }
    case 'TOGGLE_ANSWER':
      return { ...state, showAnswer: !state.showAnswer }
    case 'ANSWER_QUESTION': {
      const isCorrect = action.payload.isCorrect
      return {
        ...state,
        score: isCorrect ? state.score + 10 : state.score,
        totalQuestions: state.totalQuestions + 1,
        correctAnswers: isCorrect ? state.correctAnswers + 1 : state.correctAnswers,
      }
    }
    case 'NEXT_QUESTION': {
      const questionsData = state.knowledgeBase[state.currentTopic]
      const maxQuestions = questionsData ? questionsData.preguntas.length : 0
      return {
        ...state,
        currentQuestionIndex: Math.min(state.currentQuestionIndex + 1, maxQuestions - 1),
      }
    }
    case 'RESET_SESSION':
      return {
        ...state,
        score: 0,
        totalQuestions: 0,
        correctAnswers: 0,
        currentCardIndex: 0,
        currentQuestionIndex: 0,
      }
    case 'UPDATE_TOPIC_PROGRESS':
      return {
        ...state,
        topicProgress: {
          ...state.topicProgress,
          [action.payload.topic]: action.payload.progress,
        },
      }
    case 'MARK_CARD_KNOWN': {
      const topic = state.currentTopic
      const currentProgress = state.topicProgress[topic] || { known: 0, total: 0 }
      return {
        ...state,
        totalCardsKnown: state.totalCardsKnown + 1,
        topicProgress: {
          ...state.topicProgress,
          [topic]: {
            known: currentProgress.known + 1,
            total: Math.max(currentProgress.total, state.currentCardIndex + 1),
          },
        },
      }
    }
    case 'UPDATE_QUIZ_PROGRESS': {
      const quizTopic = action.payload.topic
      const quizCorrect = action.payload.correct
      const quizTotal = action.payload.total
      const percentage = Math.round((quizCorrect / quizTotal) * 100)
      const existingProgress = state.topicProgress[quizTopic] || { known: 0, total: 0, quizScore: 0 }
      return {
        ...state,
        topicProgress: {
          ...state.topicProgress,
          [quizTopic]: {
            ...existingProgress,
            quizScore: Math.max(existingProgress.quizScore || 0, percentage),
          },
        },
      }
    }
    case 'ADD_XP': {
      const newXp = state.xp + action.payload.amount
      const newLevel = Math.floor(newXp / 100) + 1
      return {
        ...state,
        xp: newXp,
        level: newLevel,
        xpHistory: [...state.xpHistory, {
          id: Date.now(),
          amount: action.payload.amount,
          reason: action.payload.reason,
        }],
      }
    }
    case 'CLEAR_XP_EVENT':
      return { ...state, xpHistory: state.xpHistory.filter(e => e.id !== action.payload) }
    case 'UPDATE_STREAK': {
      const today = new Date().toISOString().split('T')[0]
      if (state.lastStudyDate === today) return state
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
      const newStreak = state.lastStudyDate === yesterday ? state.streak + 1 : 1
      return { ...state, streak: newStreak, lastStudyDate: today }
    }
    case 'EARN_BADGE': {
      if (state.badges.includes(action.payload)) return state
      return { ...state, badges: [...state.badges, action.payload] }
    }
    case 'TOGGLE_DARK_MODE':
      return { ...state, darkMode: !state.darkMode }
    default:
      return state
  }
}

export { BADGES }

export function StudyProvider({ children }) {
  const [state, dispatch] = useReducer(studyReducer, initialState)

  useEffect(() => {
    const data = {
      xp: state.xp,
      level: state.level,
      streak: state.streak,
      lastStudyDate: state.lastStudyDate,
      badges: state.badges,
      totalCardsKnown: state.totalCardsKnown,
    }
    localStorage.setItem('ravenai_gamification', JSON.stringify(data))
  }, [state.xp, state.level, state.streak, state.lastStudyDate, state.badges, state.totalCardsKnown])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', state.darkMode)
    localStorage.setItem('ravenai_dark_mode', String(state.darkMode))
  }, [state.darkMode])

  const value = {
    state,
    dispatch,
    BADGES,
    setTopic: (topic) => dispatch({ type: 'SET_TOPIC', payload: topic }),
    setMode: (mode) => dispatch({ type: 'SET_MODE', payload: mode }),
    nextCard: () => dispatch({ type: 'NEXT_CARD' }),
    prevCard: () => dispatch({ type: 'PREV_CARD' }),
    toggleAnswer: () => dispatch({ type: 'TOGGLE_ANSWER' }),
    answerQuestion: (isCorrect) => dispatch({ type: 'ANSWER_QUESTION', payload: { isCorrect } }),
    nextQuestion: () => dispatch({ type: 'NEXT_QUESTION' }),
    resetSession: () => dispatch({ type: 'RESET_SESSION' }),
    markCardKnown: () => dispatch({ type: 'MARK_CARD_KNOWN' }),
    updateQuizProgress: (topic, correct, total) => dispatch({ type: 'UPDATE_QUIZ_PROGRESS', payload: { topic, correct, total } }),
    addXp: (amount, reason) => dispatch({ type: 'ADD_XP', payload: { amount, reason } }),
    clearXpEvent: (id) => dispatch({ type: 'CLEAR_XP_EVENT', payload: id }),
    updateStreak: () => dispatch({ type: 'UPDATE_STREAK' }),
    earnBadge: (badgeId) => dispatch({ type: 'EARN_BADGE', payload: badgeId }),
    toggleDarkMode: () => dispatch({ type: 'TOGGLE_DARK_MODE' }),
  }

  return <StudyContext.Provider value={value}>{children}</StudyContext.Provider>
}

export function useStudy() {
  const context = useContext(StudyContext)
  if (!context) {
    throw new Error('useStudy must be used within a StudyProvider')
  }
  return context
}
