import { createContext, useContext, useReducer } from 'react'
import knowledgeData from '../data/knowledge.json'

const StudyContext = createContext(null)

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
    case 'NEXT_CARD':
      const topicData = state.knowledgeBase[state.currentTopic]
      const maxCards = topicData ? topicData.conceptos.length : 0
      return {
        ...state,
        currentCardIndex: Math.min(state.currentCardIndex + 1, maxCards - 1),
        showAnswer: false,
      }
    case 'PREV_CARD':
      return {
        ...state,
        currentCardIndex: Math.max(state.currentCardIndex - 1, 0),
        showAnswer: false,
      }
    case 'TOGGLE_ANSWER':
      return {
        ...state,
        showAnswer: !state.showAnswer,
      }
    case 'ANSWER_QUESTION':
      const isCorrect = action.payload.isCorrect
      const newScore = isCorrect ? state.score + 10 : state.score
      const newCorrect = isCorrect ? state.correctAnswers + 1 : state.correctAnswers
      return {
        ...state,
        score: newScore,
        totalQuestions: state.totalQuestions + 1,
        correctAnswers: newCorrect,
      }
    case 'NEXT_QUESTION':
      const questionsData = state.knowledgeBase[state.currentTopic]
      const maxQuestions = questionsData ? questionsData.preguntas.length : 0
      return {
        ...state,
        currentQuestionIndex: Math.min(state.currentQuestionIndex + 1, maxQuestions - 1),
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
    case 'MARK_CARD_KNOWN':
      const topic = state.currentTopic
      const currentProgress = state.topicProgress[topic] || { known: 0, total: 0 }
      return {
        ...state,
        topicProgress: {
          ...state.topicProgress,
          [topic]: {
            known: currentProgress.known + 1,
            total: Math.max(currentProgress.total, state.currentCardIndex + 1),
          },
        },
      }
    case 'UPDATE_QUIZ_PROGRESS':
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
    default:
      return state
  }
}

export function StudyProvider({ children }) {
  const [state, dispatch] = useReducer(studyReducer, initialState)

  const value = {
    state,
    dispatch,
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
