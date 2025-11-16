import { useState } from 'react'
import { useStudy } from '../context/StudyContext'

export default function Tarjetas() {
  const { state, setMode, nextCard, prevCard, toggleAnswer, markCardKnown } = useStudy()
  const { currentTopic, knowledgeBase, currentCardIndex, showAnswer } = state
  const [allCardsCompleted, setAllCardsCompleted] = useState(false)

  if (!currentTopic) {
    return <div>No hay tema seleccionado</div>
  }

  const topicData = knowledgeBase[currentTopic]
  const conceptos = topicData?.conceptos || []
  const currentConcept = conceptos[currentCardIndex]

  if (!currentConcept) {
    return <div>No hay tarjetas disponibles</div>
  }

  const progress = ((currentCardIndex + 1) / conceptos.length) * 100

  const handleKnow = () => {
    markCardKnown()
    if (currentCardIndex < conceptos.length - 1) {
      nextCard()
    } else {
      setAllCardsCompleted(true)
    }
  }

  const handleDontKnow = () => {
    if (currentCardIndex < conceptos.length - 1) {
      nextCard()
    } else {
      setAllCardsCompleted(true)
    }
  }

  return (
    <div className="min-h-screen bg-neutral p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Tarjetas de Memoria</h1>
          <button onClick={() => setMode('home')} className="btn-coral">
            Volver
          </button>
        </div>

        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progreso</span>
            <span>{currentCardIndex + 1} / {conceptos.length}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-secondary h-3 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div
          onClick={toggleAnswer}
          className="card min-h-[300px] flex items-center justify-center cursor-pointer transform transition-all duration-500 hover:shadow-xl"
        >
          {!showAnswer ? (
            <div className="text-center">
              <div className="text-4xl mb-4">🎴</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                {currentConcept.titulo}
              </h3>
              <p className="text-gray-500 text-sm">Haz clic para ver la respuesta</p>
            </div>
          ) : (
            <div className="text-center">
              <div className="text-4xl mb-4">💡</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                {currentConcept.titulo}
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {currentConcept.texto}
              </p>
            </div>
          )}
        </div>

        <div className="mt-8 flex justify-center gap-4">
          <button
            onClick={prevCard}
            disabled={currentCardIndex === 0}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Anterior
          </button>
          
          {showAnswer && (
            <>
              <button onClick={handleDontKnow} className="btn-coral">
                No lo sé
              </button>
              <button onClick={handleKnow} className="btn-secondary">
                Lo sé
              </button>
            </>
          )}

          <button
            onClick={nextCard}
            disabled={currentCardIndex === conceptos.length - 1}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Siguiente
          </button>
        </div>

        {allCardsCompleted && (
          <div className="mt-8 text-center card bg-accent/30">
            <div className="text-4xl mb-4">🎉</div>
            <h3 className="text-xl font-bold mb-2">¡Felicitaciones!</h3>
            <p className="text-gray-700">Has completado todas las tarjetas</p>
            <button
              onClick={() => setMode('quiz')}
              className="btn-secondary mt-4"
            >
              Continuar con el Quiz
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
