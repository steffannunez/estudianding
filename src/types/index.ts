// Tipos para la estructura de datos de conocimiento
export interface Concepto {
    titulo: string
    texto: string
}

export interface Pregunta {
    pregunta: string
    opciones: string[]
    respuesta: number
}

export interface TopicData {
    conceptos: Concepto[]
    preguntas: Pregunta[]
}

export interface KnowledgeBase {
    [topic: string]: TopicData
}

// Tipos para el progreso del tema
export interface TopicProgress {
    known?: number
    total?: number
    quizScore?: number
}

// Estado global de la aplicación
export interface StudyState {
    currentTopic: string | null
    currentMode: 'home' | 'study' | 'cards' | 'quiz'
    topics: string[]
    knowledgeBase: KnowledgeBase
    score: number
    totalQuestions: number
    correctAnswers: number
    topicProgress: Record<string, TopicProgress>
    currentCardIndex: number
    currentQuestionIndex: number
    showAnswer: boolean
}

// Tipos de acciones del reducer
export type StudyAction =
    | { type: 'SET_TOPIC'; payload: string }
    | { type: 'SET_MODE'; payload: 'home' | 'study' | 'cards' | 'quiz' }
    | { type: 'NEXT_CARD' }
    | { type: 'PREV_CARD' }
    | { type: 'TOGGLE_ANSWER' }
    | { type: 'ANSWER_QUESTION'; payload: { isCorrect: boolean } }
    | { type: 'NEXT_QUESTION' }
    | { type: 'RESET_SESSION' }
    | { type: 'UPDATE_TOPIC_PROGRESS'; payload: { topic: string; progress: TopicProgress } }
    | { type: 'MARK_CARD_KNOWN' }
    | { type: 'UPDATE_QUIZ_PROGRESS'; payload: { topic: string; correct: number; total: number } }

// Tipo para el contexto
export interface StudyContextValue {
    state: StudyState
    dispatch: React.Dispatch<StudyAction>
    setTopic: (topic: string) => void
    setMode: (mode: 'home' | 'study' | 'cards' | 'quiz') => void
    nextCard: () => void
    prevCard: () => void
    toggleAnswer: () => void
    answerQuestion: (isCorrect: boolean) => void
    nextQuestion: () => void
    resetSession: () => void
    markCardKnown: () => void
    updateQuizProgress: (topic: string, correct: number, total: number) => void
}
