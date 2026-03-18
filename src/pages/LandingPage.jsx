import { Link } from 'react-router-dom'
import RavenLogo from '../components/RavenLogo'
import { useStudy } from '../context/StudyContext'

const features = [
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
        <line x1="11" y1="8" x2="11" y2="14" /><line x1="8" y1="11" x2="14" y2="11" />
      </svg>
    ),
    title: 'Investigacion con IA',
    description: 'Escribe cualquier tema y la IA extrae los conceptos clave, generando material de estudio completo al instante.',
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="16" height="14" rx="2" />
        <path d="M6 3h12a2 2 0 0 1 2 2v2H4V5a2 2 0 0 1 2-2z" />
      </svg>
    ),
    title: 'Flashcards inteligentes',
    description: 'Tarjetas de memoria generadas automaticamente con efecto flip. Marca lo que sabes y trackea tu progreso.',
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
    title: 'Quiz adaptativo',
    description: 'Preguntas de opcion multiple generadas por IA para cada concepto. Gana XP y sube de nivel.',
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <circle cx="5" cy="6" r="2" /><circle cx="19" cy="6" r="2" />
        <circle cx="5" cy="18" r="2" /><circle cx="19" cy="18" r="2" />
        <line x1="12" y1="9" x2="12" y2="6" />
        <line x1="9.5" y1="13.5" x2="6.5" y2="16.5" />
        <line x1="14.5" y1="13.5" x2="17.5" y2="16.5" />
      </svg>
    ),
    title: 'Mapa conceptual',
    description: 'Visualiza como se conectan los conceptos en un grafo interactivo. Navega y profundiza en cualquier nodo.',
  },
]

const steps = [
  { number: '1', title: 'Escribe un tema', description: 'Cualquier tema: programacion, ciencia, historia, idiomas...', icon: '✍️' },
  { number: '2', title: 'La IA investiga', description: 'Claude analiza el tema y extrae los conceptos mas importantes.', icon: '🧠' },
  { number: '3', title: 'Aprende y profundiza', description: 'Estudia con tarjetas, quiz y mapas. Profundiza en lo que quieras.', icon: '🚀' },
]

export default function LandingPage() {
  const { state, toggleDarkMode } = useStudy()
  const { darkMode } = state

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="navbar-glass fixed top-0 w-full z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 h-16">
          <div className="flex items-center gap-2">
            <RavenLogo size={32} className="text-raven-600 dark:text-cyan-400" />
            <span className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
              raven<span className="text-cyan-400">AI</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleDarkMode}
              className="glass p-2 cursor-pointer transition-all duration-300 hover:scale-110"
              style={{ borderRadius: '9999px', border: '1px solid var(--glass-border)' }}
            >
              {darkMode ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
            </button>
            <Link to="/login" className="btn-glass text-sm px-4 py-2 no-underline">
              Iniciar sesion
            </Link>
            <Link to="/signup" className="btn-primary-glass text-sm px-4 py-2 no-underline">
              Registrarse
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="animate-fade-in">
            <RavenLogo size={80} className="mx-auto mb-6 text-raven-600 dark:text-cyan-400" />
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight" style={{ color: 'var(--text-primary)' }}>
              Investiga cualquier tema
              <br />
              <span className="text-cyan-400">con inteligencia artificial</span>
            </h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              ravenAI genera conceptos clave, flashcards, quizzes y mapas conceptuales
              para cualquier tema que quieras aprender. Potenciado por IA.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup" className="btn-primary-glass text-lg px-8 py-4 no-underline inline-block text-center">
                Empezar gratis
              </Link>
              <a href="#como-funciona" className="btn-glass text-lg px-8 py-4 no-underline inline-block text-center">
                Como funciona
              </a>
            </div>
          </div>

          {/* Floating glass preview */}
          <div className="mt-16 glass-heavy p-6 md:p-8 max-w-3xl mx-auto animate-slide-up">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
              <div className="flex-1 glass px-4 py-1.5 text-sm ml-2" style={{ borderRadius: '8px', color: 'var(--text-muted)' }}>
                Investigar: "Machine Learning"
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {['Redes Neuronales', 'Aprendizaje Supervisado', 'Gradient Descent'].map((concept, i) => (
                <div key={i} className="glass p-3 text-sm animate-scale-in" style={{ animationDelay: `${i * 0.15}s` }}>
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs text-white font-bold mb-2"
                    style={{ background: 'linear-gradient(135deg, #1e3a5f, #2f74c0)' }}>
                    {i + 1}
                  </div>
                  <div className="font-semibold text-sm mb-1" style={{ color: 'var(--text-primary)' }}>{concept}</div>
                  <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Concepto clave</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="como-funciona" className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-4" style={{ color: 'var(--text-primary)' }}>
            Como funciona
          </h2>
          <p className="text-center mb-12" style={{ color: 'var(--text-muted)' }}>
            Tres pasos simples para dominar cualquier tema
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((step, i) => (
              <div key={i} className="glass glass-hover p-8 text-center animate-slide-up" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="text-4xl mb-4">{step.icon}</div>
                <div className="w-10 h-10 mx-auto rounded-full flex items-center justify-center text-white font-bold mb-4"
                  style={{ background: 'linear-gradient(135deg, #1e3a5f, #2f74c0)' }}>
                  {step.number}
                </div>
                <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{step.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-4" style={{ color: 'var(--text-primary)' }}>
            Todo lo que necesitas para aprender
          </h2>
          <p className="text-center mb-12" style={{ color: 'var(--text-muted)' }}>
            Herramientas potentes generadas automaticamente por IA
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, i) => (
              <div key={i} className="glass glass-hover p-8 animate-slide-up" style={{ animationDelay: `${i * 0.08}s` }}>
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{feature.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats / Social proof */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="glass-heavy p-8 md:p-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {[
                { value: '∞', label: 'Temas posibles' },
                { value: 'IA', label: 'Generacion inteligente' },
                { value: '24/7', label: 'Disponible siempre' },
                { value: '0', label: 'Costo para empezar' },
              ].map((stat, i) => (
                <div key={i}>
                  <div className="text-3xl font-extrabold text-cyan-400 mb-1">{stat.value}</div>
                  <div className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <RavenLogo size={56} className="mx-auto mb-6 text-raven-600 dark:text-cyan-400" />
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4" style={{ color: 'var(--text-primary)' }}>
            Comienza a investigar ahora
          </h2>
          <p className="mb-8" style={{ color: 'var(--text-muted)' }}>
            Crea tu cuenta gratuita y aprende cualquier tema con el poder de la IA
          </p>
          <Link to="/signup" className="btn-primary-glass text-lg px-10 py-4 no-underline inline-block">
            Crear cuenta gratis
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4" style={{ borderTop: '1px solid var(--glass-border)' }}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <RavenLogo size={24} className="text-raven-600 dark:text-cyan-400" />
            <span className="text-sm font-semibold" style={{ color: 'var(--text-muted)' }}>
              raven<span className="text-cyan-400">AI</span>
            </span>
          </div>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Hecho con IA para aprender mejor
          </p>
        </div>
      </footer>
    </div>
  )
}
