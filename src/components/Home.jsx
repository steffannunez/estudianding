import { useNavigate } from 'react-router-dom'
import { useStudy } from '../context/StudyContext'
import RavenLogo from './RavenLogo'

const topicIcons = {
  microservicios: '🔧', aws: '☁️', typescript: '📘', kubernetes: '⚓',
  nestjs: '🐱', solid: '🎯', graphql: '📊', cicd: '🔄',
  cleancode: '✨', serverless: '⚡',
}

const topicNames = {
  microservicios: 'Microservicios', aws: 'AWS Cloud', typescript: 'TypeScript',
  kubernetes: 'Kubernetes', nestjs: 'NestJS', solid: 'SOLID',
  graphql: 'GraphQL', cicd: 'CI/CD', cleancode: 'Clean Code',
  serverless: 'Serverless AWS',
}

export default function Home() {
  const navigate = useNavigate()
  const { state, setTopic, BADGES } = useStudy()
  const { topics, currentTopic, topicProgress, xp, level, streak, badges } = state

  const handleModeSelect = (path) => {
    if (!currentTopic) return
    navigate(path)
  }

  const getTopicProgress = (topic) => {
    const progress = topicProgress[topic]
    if (!progress) return 0
    const cardProgress = Math.round((progress.known / Math.max(progress.total, 1)) * 100)
    const quizProgress = progress.quizScore || 0
    return Math.max(cardProgress, quizProgress)
  }

  const getTopicQuizScore = (topic) => {
    return topicProgress[topic]?.quizScore || 0
  }

  const xpToNext = xp % 100

  return (
    <div className="px-4 md:px-8 py-8">
      <div className="max-w-5xl mx-auto">
        {/* Hero - visible on mobile only since navbar has logo on desktop */}
        <header className="text-center mb-8 md:hidden">
          <div className="flex items-center justify-center gap-3 mb-2">
            <RavenLogo size={48} className="text-raven-600 dark:text-cyan-400" />
            <h1 className="text-4xl font-extrabold" style={{ color: 'var(--text-primary)' }}>
              raven<span className="text-cyan-400">AI</span>
            </h1>
          </div>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Tu espacio de aprendizaje inteligente</p>
        </header>

        {/* Gamification Dashboard */}
        <section className="glass-heavy p-6 mb-8 animate-fade-in">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Level */}
            <div className="text-center">
              <div className="text-3xl font-extrabold text-cyan-400">{level}</div>
              <div className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Nivel</div>
            </div>
            {/* XP */}
            <div className="text-center">
              <div className="text-3xl font-extrabold" style={{ color: 'var(--text-secondary)' }}>{xp}</div>
              <div className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>XP Total</div>
              <div className="mt-1 mx-auto w-20 h-1.5 rounded-full bg-white/20 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-700"
                  style={{ width: `${xpToNext}%` }}
                />
              </div>
            </div>
            {/* Streak */}
            <div className="text-center">
              <div className="text-3xl font-extrabold">
                <span className={streak >= 3 ? 'animate-streak-fire inline-block' : ''}>🔥</span> {streak}
              </div>
              <div className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Racha</div>
            </div>
            {/* Badges */}
            <div className="text-center">
              <div className="text-3xl font-extrabold" style={{ color: 'var(--text-secondary)' }}>
                {badges.length}/{Object.keys(BADGES).length}
              </div>
              <div className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Badges</div>
            </div>
          </div>

          {/* Badges row */}
          {badges.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4 justify-center">
              {badges.map(id => (
                <span
                  key={id}
                  className="glass px-3 py-1 text-sm"
                  style={{ borderRadius: '9999px' }}
                  title={BADGES[id]?.description}
                >
                  {BADGES[id]?.icon} {BADGES[id]?.name}
                </span>
              ))}
            </div>
          )}
        </section>

        {/* Topic Grid */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-5" style={{ color: 'var(--text-secondary)' }}>
            Selecciona un tema
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {topics.map((topic) => {
              const progress = getTopicProgress(topic)
              const quizScore = getTopicQuizScore(topic)
              const isSelected = currentTopic === topic
              return (
                <button
                  key={topic}
                  onClick={() => setTopic(topic)}
                  className={`glass glass-hover p-5 text-left cursor-pointer transition-all duration-300 ${
                    isSelected ? 'ring-2 ring-cyan-400 shadow-glow' : ''
                  }`}
                  style={{ border: isSelected ? '1px solid rgba(34, 211, 238, 0.5)' : undefined }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{topicIcons[topic] || '📚'}</span>
                    <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {topicNames[topic] || topic}
                    </h3>
                  </div>
                  <div className="progress-bar-glass mb-2">
                    <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
                  </div>
                  <div className="flex justify-between text-xs" style={{ color: 'var(--text-muted)' }}>
                    <span>Progreso: {progress}%</span>
                    {quizScore > 0 && <span className="text-cyan-400">Quiz: {quizScore}%</span>}
                  </div>
                </button>
              )
            })}
          </div>
        </section>

        {/* Study Mode Selector */}
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-5" style={{ color: 'var(--text-secondary)' }}>
            Modo de estudio
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => handleModeSelect('/app/study')}
              className={`glass glass-hover p-8 text-center transition-all duration-300 cursor-pointer ${!currentTopic ? 'opacity-40 cursor-not-allowed' : ''}`}
              disabled={!currentTopic}
            >
              <div className="text-4xl mb-3">📚</div>
              <div className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Modo Estudio</div>
              <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Lee los conceptos clave</div>
            </button>
            <button
              onClick={() => handleModeSelect('/app/cards')}
              className={`glass glass-hover p-8 text-center transition-all duration-300 cursor-pointer ${!currentTopic ? 'opacity-40 cursor-not-allowed' : ''}`}
              disabled={!currentTopic}
            >
              <div className="text-4xl mb-3">🎴</div>
              <div className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Tarjetas</div>
              <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Flashcards interactivas</div>
            </button>
            <button
              onClick={() => handleModeSelect('/app/quiz')}
              className={`glass glass-hover p-8 text-center transition-all duration-300 cursor-pointer ${!currentTopic ? 'opacity-40 cursor-not-allowed' : ''}`}
              disabled={!currentTopic}
            >
              <div className="text-4xl mb-3">❓</div>
              <div className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Quiz</div>
              <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Pon a prueba tu conocimiento</div>
            </button>
          </div>
        </section>

        {/* Selected topic indicator */}
        {currentTopic && (
          <div className="text-center animate-fade-in">
            <span className="glass px-4 py-2 inline-flex items-center gap-2 text-sm" style={{ borderRadius: '9999px' }}>
              <span>{topicIcons[currentTopic]}</span>
              <span style={{ color: 'var(--text-muted)' }}>Tema:</span>
              <span className="text-cyan-400 font-semibold">{topicNames[currentTopic]}</span>
            </span>
          </div>
        )}

        {!currentTopic && (
          <div className="text-center animate-fade-in">
            <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Selecciona un tema para comenzar
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
