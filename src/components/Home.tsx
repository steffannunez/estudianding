import { useStudy } from '../context/StudyContext'

type ModeType = 'home' | 'study' | 'cards' | 'quiz'
type TopicNames = Record<string, string>

export default function Home() {
  const { state, setTopic, setMode } = useStudy()
  const { topics, currentTopic, score, topicProgress } = state

  const handleModeSelect = (mode: ModeType) => {
    if (!currentTopic) {
      alert('Por favor, selecciona un tema primero')
      return
    }
    setMode(mode)
  }

  const getTopicDisplayName = (topic: string): string => {
    const names: TopicNames = {
      microservicios: 'Microservicios',
      aws: 'AWS Cloud',
      typescript: 'TypeScript',
      kubernetes: 'Kubernetes',
      nestjs: 'NestJS',
      solid: 'SOLID',
      graphql: 'GraphQL',
      cicd: 'CI/CD',
      cleancode: 'Clean Code',
      serverless: 'Serverless AWS',
    }
    return names[topic] || topic
  }

  const getTopicProgress = (topic: string): number => {
    const progress = topicProgress[topic]
    if (!progress) return 0
    const cardProgress = Math.round(((progress.known || 0) / Math.max(progress.total || 1, 1)) * 100)
    const quizProgress = progress.quizScore || 0
    console.log('Card Progress:', cardProgress, 'Quiz Progress:', quizProgress)
    return Math.max(cardProgress, quizProgress)
  }

  const getTopicQuizScore = (topic: string): number => {
    const progress = topicProgress[topic]
    return progress?.quizScore || 0
  }

  return (
    <div className="min-h-screen bg-neutral p-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">StudyVerse</h1>
          <p className="text-xl text-gray-600">Tu espacio de aprendizaje interactivo</p>
          {score > 0 && (
            <div className="mt-4 inline-block bg-accent px-6 py-2 rounded-full">
              <span className="font-semibold">Puntos: {score}</span>
            </div>
          )}
        </header>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-center">Selecciona un tema</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {topics.map((topic) => (
              <button
                key={topic}
                onClick={() => setTopic(topic)}
                className={`card card-hover cursor-pointer text-left ${
                  currentTopic === topic ? 'ring-4 ring-primary bg-primary/10' : 'hover:bg-gray-50'
                }`}
              >
                <h3 className="text-xl font-semibold mb-2">{getTopicDisplayName(topic)}</h3>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div
                    className="bg-secondary h-2 rounded-full transition-all duration-500"
                    style={{ width: `${getTopicProgress(topic)}%` }}
                  />
                </div>
                <p className="text-sm text-gray-500">Progreso: {getTopicProgress(topic)}%</p>
                {getTopicQuizScore(topic) > 0 && (
                  <p className="text-xs text-primary mt-1">Quiz: {getTopicQuizScore(topic)}%</p>
                )}
              </button>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-6 text-center">Elige tu modo de estudio</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button onClick={() => handleModeSelect('study')} className="btn-primary py-8 text-xl">
              <div className="text-3xl mb-2">📚</div>
              Modo Estudio
            </button>
            <button onClick={() => handleModeSelect('cards')} className="btn-secondary py-8 text-xl">
              <div className="text-3xl mb-2">🎴</div>
              Tarjetas
            </button>
            <button onClick={() => handleModeSelect('quiz')} className="btn-accent py-8 text-xl">
              <div className="text-3xl mb-2">❓</div>
              Preguntas
            </button>
          </div>
        </section>

        {currentTopic && (
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Tema seleccionado: <span className="font-semibold text-primary">{getTopicDisplayName(currentTopic)}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
