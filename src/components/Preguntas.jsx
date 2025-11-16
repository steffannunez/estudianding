import { useState } from  'react'
import { useStudy } from '../context/StudyContext'

export default function Preguntas() {
  const { state, setMode, answerQuestion, nextQuestion, resetSession, updateQuizProgress } = useStudy()
  const { currentTopic, knowledgeBase, currentQuestionIndex, score } = state
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [answered, setAnswered] = useState(false)
  const [quizCorrectAnswers, setQuizCorrectAnswers] = useState(0)
  const [quizScore, setQuizScore] = useState(0)
  const [quizCompleted, setQuizCompleted] = useState(false)

  if (!currentTopic) {
    return <div>No hay tema seleccionado</div>
  }

  const topicData = knowledgeBase[currentTopic]
  const preguntas = topicData?.preguntas || []
  const currentQuestion = preguntas[currentQuestionIndex]

  if (!currentQuestion) {
    return <div>No hay preguntas disponibles</div>
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
    }
    if (isLastQuestion) {
      updateQuizProgress(currentTopic, newCorrectCount, preguntas.length)
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

  const getOptionStyle = (index) => {
    if (!answered) {
      return 'bg-white hover:bg-gray-50 border-2 border-gray-200'
    }
    if (index === currentQuestion.respuesta) {
      return 'bg-secondary/30 border-2 border-secondary'
    }
    if (index === selectedAnswer && index !== currentQuestion.respuesta) {
      return 'bg-coral/30 border-2 border-coral'
    }
    return 'bg-white border-2 border-gray-200 opacity-50'
  }

  return (
    <div className="min-h-screen bg-neutral p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Quiz</h1>
          <div className="flex items-center gap-4">
            <div className="bg-accent px-4 py-2 rounded-full">
              <span className="font-semibold">Puntos: {score}</span>
            </div>
            <button onClick={() => setMode('home')} className="btn-coral">
              Volver
            </button>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Pregunta {currentQuestionIndex + 1} de {preguntas.length}</span>
            <span>{quizCorrectAnswers}/{currentQuestionIndex + (answered ? 1 : 0)} correctas</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-primary h-3 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </div>

        <div className="card mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            {currentQuestion.pregunta}
          </h2>

          <div className="space-y-4">
            {currentQuestion.opciones.map((opcion, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                disabled={answered}
                className={`w-full text-left p-4 rounded-xl transition-all duration-300 ${getOptionStyle(index)} ${!answered ? 'cursor-pointer' : 'cursor-default'}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-semibold">
                    {String.fromCharCode(65 + index)}
                  </div>
                  <span>{opcion}</span>
                  {answered && index === currentQuestion.respuesta && (
                    <span className="ml-auto text-2xl">✓</span>
                  )}
                  {answered && index === selectedAnswer && index !== currentQuestion.respuesta && (
                    <span className="ml-auto text-2xl">✗</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {answered && (
          <div className={`card mb-6 ${isCorrect ? 'bg-secondary/20' : 'bg-coral/20'}`}>
            <div className="text-center">
              <div className="text-4xl mb-2">{isCorrect ? '🎉' : '😅'}</div>
              <p className="font-semibold">
                {isCorrect ? '¡Correcto! +10 puntos' : 'Incorrecto'}
              </p>
            </div>
          </div>
        )}

        {answered && !isLastQuestion && (
          <div className="text-center">
            <button onClick={handleNext} className="btn-primary">
              Siguiente Pregunta
            </button>
          </div>
        )}

        {answered && isLastQuestion && (
          <div className="card bg-accent/30 text-center">
            <div className="text-4xl mb-4">🏆</div>
            <h3 className="text-2xl font-bold mb-2">¡Quiz Completado!</h3>
            <p className="text-lg mb-2">
              Puntuación del quiz: {quizScore} puntos
            </p>
            <p className="text-gray-700 mb-4">
              Respuestas correctas: {quizCorrectAnswers} de {preguntas.length}
            </p>
            <div className="flex justify-center gap-4">
              <button onClick={handleRestart} className="btn-secondary">
                Reintentar
              </button>
              <button onClick={() => setMode('home')} className="btn-primary">
                Volver al Inicio
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
// Forced reload
