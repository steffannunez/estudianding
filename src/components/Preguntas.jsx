import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStudy } from '../context/StudyContext'
import XpPopup from './XpPopup'

export default function Preguntas() {
  const navigate = useNavigate()
  const { state, answerQuestion, nextQuestion, resetSession, updateQuizProgress, addXp, clearXpEvent, updateStreak, earnBadge } = useStudy()
  const { currentTopic, knowledgeBase, currentQuestionIndex, score, xpHistory } = state
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [answered, setAnswered] = useState(false)
  const [quizCorrectAnswers, setQuizCorrectAnswers] = useState(0)
  const [quizScore, setQuizScore] = useState(0)

  useEffect(() => {
    updateStreak()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  if (!currentTopic) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="glass-heavy p-8 text-center">
          <p style={{ color: 'var(--text-muted)' }}>No hay tema seleccionado</p>
          <button onClick={() => navigate('/app')} className="btn-primary-glass mt-4">Volver</button>
        </div>
      </div>
    )
  }

  const topicData = knowledgeBase[currentTopic]
  const preguntas = topicData?.preguntas || []
  const currentQuestion = preguntas[currentQuestionIndex]

  if (!currentQuestion) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="glass-heavy p-8 text-center">
          <p style={{ color: 'var(--text-muted)' }}>No hay preguntas disponibles</p>
        </div>
      </div>
    )
  }

  const progress = ((currentQuestionIndex + 1) / preguntas.length) * 100
  const isLastQuestion = currentQuestionIndex === preguntas.length - 1
  const isCorrect = selectedAnswer === currentQuestion.respuesta

  const handleAnswer = (optionIndex) => {
    if (answered) return
    setSelectedAnswer(optionIndex)
    setAnswered(true)
    const isAnswerCorrect = optionIndex === currentQuestion.respuesta
    answerQuestion(isAnswerCorrect)
    const newCorrectCount = isAnswerCorrect ? quizCorrectAnswers + 1 : quizCorrectAnswers
    if (isAnswerCorrect) {
      setQuizCorrectAnswers(newCorrectCount)
      setQuizScore(prev => prev + 10)
      addXp(10, 'quiz_correct')
    }
    if (isLastQuestion) {
      updateQuizProgress(currentTopic, newCorrectCount, preguntas.length)
      // Badge checks
      if (newCorrectCount === preguntas.length) earnBadge('quiz_ace')
    }
  }

  const handleNext = () => {
    if (!isLastQuestion) {
      nextQuestion()
      setSelectedAnswer(null)
      setAnswered(false)
    }
  }

  const handleRestart = () => {
    resetSession()
    setSelectedAnswer(null)
    setAnswered(false)
    setQuizCorrectAnswers(0)
    setQuizScore(0)
  }

  const getOptionClass = (index) => {
    if (!answered) return 'quiz-option'
    if (index === currentQuestion.respuesta) return 'quiz-option correct'
    if (index === selectedAnswer && index !== currentQuestion.respuesta) return 'quiz-option incorrect'
    return 'quiz-option faded'
  }

  return (
    <div className="px-4 md:px-8 py-8">
      <div className="max-w-2xl mx-auto">
        {/* XP Popups */}
        {xpHistory.map(event => (
          <XpPopup key={event.id} amount={event.amount} onDone={() => clearXpEvent(event.id)} />
        ))}

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Quiz</h1>
          <div className="flex items-center gap-3">
            <span className="glass px-4 py-2 text-sm font-semibold" style={{ borderRadius: '9999px', color: 'var(--text-primary)' }}>
              {score} pts
            </span>
            <button onClick={() => navigate('/app')} className="btn-glass text-sm">
              Volver
            </button>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2" style={{ color: 'var(--text-muted)' }}>
            <span>Pregunta {currentQuestionIndex + 1} de {preguntas.length}</span>
            <span>{quizCorrectAnswers}/{currentQuestionIndex + (answered ? 1 : 0)} correctas</span>
          </div>
          <div className="progress-bar-glass">
            <div className="progress-bar-fill" style={{ width: `${Math.min(progress, 100)}%` }} />
          </div>
        </div>

        {/* Question card */}
        <div className="glass-heavy p-6 mb-6 animate-scale-in">
          <h2 className="text-lg font-semibold mb-6" style={{ color: 'var(--text-primary)' }}>
            {currentQuestion.pregunta}
          </h2>

          <div className="space-y-3">
            {currentQuestion.opciones.map((opcion, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                disabled={answered}
                className={getOptionClass(index)}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm flex-shrink-0"
                    style={{
                      background: answered && index === currentQuestion.respuesta
                        ? 'linear-gradient(135deg, #059669, #10b981)'
                        : answered && index === selectedAnswer && index !== currentQuestion.respuesta
                        ? 'linear-gradient(135deg, #dc2626, #ef4444)'
                        : 'var(--glass-bg)',
                      color: answered && (index === currentQuestion.respuesta || index === selectedAnswer)
                        ? '#fff'
                        : 'var(--text-primary)',
                    }}
                  >
                    {String.fromCharCode(65 + index)}
                  </div>
                  <span className="flex-1">{opcion}</span>
                  {answered && index === currentQuestion.respuesta && (
                    <span className="text-emerald-400 text-xl">✓</span>
                  )}
                  {answered && index === selectedAnswer && index !== currentQuestion.respuesta && (
                    <span className="text-red-400 text-xl">✗</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Feedback */}
        {answered && (
          <div className={`glass p-4 mb-6 text-center animate-scale-in ${isCorrect ? '' : ''}`}
            style={{
              background: isCorrect ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
              borderColor: isCorrect ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)',
            }}
          >
            <div className="text-3xl mb-1">{isCorrect ? '🎉' : '😅'}</div>
            <p className="font-semibold" style={{ color: isCorrect ? '#10b981' : '#ef4444' }}>
              {isCorrect ? 'Correcto! +10 XP' : 'Incorrecto'}
            </p>
          </div>
        )}

        {/* Next button */}
        {answered && !isLastQuestion && (
          <div className="text-center">
            <button onClick={handleNext} className="btn-primary-glass">
              Siguiente Pregunta
            </button>
          </div>
        )}

        {/* Quiz complete */}
        {answered && isLastQuestion && (
          <div className="glass-heavy p-8 text-center animate-bounce-in" style={{ boxShadow: '0 0 30px rgba(34, 211, 238, 0.3)' }}>
            <div className="text-5xl mb-4">🏆</div>
            <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Quiz Completado!</h3>
            <p className="text-lg mb-1" style={{ color: 'var(--text-secondary)' }}>
              Puntuacion: {quizScore} puntos
            </p>
            <p className="mb-4" style={{ color: 'var(--text-muted)' }}>
              Respuestas correctas: {quizCorrectAnswers} de {preguntas.length}
            </p>
            <div className="flex justify-center gap-4">
              <button onClick={handleRestart} className="btn-accent-glass">
                Reintentar
              </button>
              <button onClick={() => navigate('/app')} className="btn-primary-glass">
                Volver al Inicio
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
