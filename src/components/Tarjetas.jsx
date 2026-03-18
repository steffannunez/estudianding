import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStudy } from '../context/StudyContext'
import XpPopup from './XpPopup'

export default function Tarjetas() {
  const navigate = useNavigate()
  const { state, nextCard, prevCard, toggleAnswer, markCardKnown, addXp, clearXpEvent, updateStreak, earnBadge } = useStudy()
  const { currentTopic, knowledgeBase, currentCardIndex, showAnswer, xpHistory, totalCardsKnown } = state
  const [allCardsCompleted, setAllCardsCompleted] = useState(false)

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
  const conceptos = topicData?.conceptos || []
  const currentConcept = conceptos[currentCardIndex]

  if (!currentConcept) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="glass-heavy p-8 text-center">
          <p style={{ color: 'var(--text-muted)' }}>No hay tarjetas disponibles</p>
        </div>
      </div>
    )
  }

  const progress = ((currentCardIndex + 1) / conceptos.length) * 100

  const handleKnow = () => {
    markCardKnown()
    addXp(5, 'card_known')
    // Badge checks
    if (totalCardsKnown === 0) earnBadge('first_card')
    if (totalCardsKnown + 1 >= 50) earnBadge('card_master')

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
    <div className="px-4 md:px-8 py-8">
      <div className="max-w-2xl mx-auto">
        {/* XP Popups */}
        {xpHistory.map(event => (
          <XpPopup key={event.id} amount={event.amount} onDone={() => clearXpEvent(event.id)} />
        ))}

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Tarjetas de Memoria
          </h1>
          <button onClick={() => navigate('/app')} className="btn-glass text-sm">
            Volver
          </button>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2" style={{ color: 'var(--text-muted)' }}>
            <span>Progreso</span>
            <span>{currentCardIndex + 1} / {conceptos.length}</span>
          </div>
          <div className="progress-bar-glass">
            <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Flip card */}
        <div onClick={toggleAnswer} className="flip-card min-h-[320px] cursor-pointer animate-scale-in">
          <div className={`flip-card-inner ${showAnswer ? 'flipped' : ''}`}>
            {/* Front */}
            <div className="flip-card-front glass-heavy min-h-[320px] flex items-center justify-center p-6">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #1e3a5f, #2f74c0)' }}>
                  <span className="text-2xl text-white">?</span>
                </div>
                <h3 className="text-xl md:text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                  {currentConcept.titulo}
                </h3>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Toca para ver la respuesta</p>
              </div>
            </div>
            {/* Back */}
            <div className="flip-card-back glass-heavy min-h-[320px] flex items-center justify-center p-6"
              style={{ borderColor: 'rgba(34, 211, 238, 0.3)' }}>
              <div className="text-center px-2">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #06b6d4, #22d3ee)' }}>
                  <span className="text-xl text-white">💡</span>
                </div>
                <h3 className="text-lg font-semibold mb-3 text-cyan-400">
                  {currentConcept.titulo}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  {currentConcept.texto}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="mt-8 flex justify-center gap-3 flex-wrap">
          <button
            onClick={(e) => { e.stopPropagation(); prevCard() }}
            disabled={currentCardIndex === 0}
            className="btn-glass"
          >
            Anterior
          </button>

          {showAnswer && (
            <>
              <button onClick={handleDontKnow} className="btn-danger-glass">
                No lo se
              </button>
              <button onClick={handleKnow} className="btn-success-glass">
                Lo se
              </button>
            </>
          )}

          <button
            onClick={(e) => { e.stopPropagation(); nextCard() }}
            disabled={currentCardIndex === conceptos.length - 1}
            className="btn-glass"
          >
            Siguiente
          </button>
        </div>

        {/* Completion */}
        {allCardsCompleted && (
          <div className="mt-8 glass-heavy p-8 text-center animate-bounce-in" style={{ boxShadow: '0 0 30px rgba(34, 211, 238, 0.3)' }}>
            <div className="text-5xl mb-4">🎉</div>
            <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Felicitaciones!</h3>
            <p className="mb-4" style={{ color: 'var(--text-muted)' }}>Has completado todas las tarjetas</p>
            <button onClick={() => navigate('/app/quiz')} className="btn-accent-glass">
              Continuar con el Quiz
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
