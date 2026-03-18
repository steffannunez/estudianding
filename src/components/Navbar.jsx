import { useNavigate, useLocation } from 'react-router-dom'
import { useStudy } from '../context/StudyContext'
import { useAuth } from '../context/AuthContext'
import RavenLogo from './RavenLogo'

const navItems = [
  { path: '/app', label: 'Inicio', requiresTopic: false },
  { path: '/app/research', label: 'Investigar', requiresTopic: false },
  { path: '/app/study', label: 'Estudio', requiresTopic: true },
  { path: '/app/cards', label: 'Tarjetas', requiresTopic: true },
  { path: '/app/quiz', label: 'Quiz', requiresTopic: true },
  { path: '/app/map', label: 'Mapa', requiresTopic: false },
]

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { state, toggleDarkMode } = useStudy()
  const { user, signOut } = useAuth()
  const { darkMode, xp, level, streak, currentTopic } = state

  const xpToNext = xp % 100

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <nav className="navbar-glass fixed top-0 w-full z-50 hidden md:block">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 h-16">
        {/* Logo */}
        <button
          onClick={() => navigate('/app')}
          className="flex items-center gap-2 cursor-pointer bg-transparent border-none"
        >
          <RavenLogo size={32} className="text-raven-600 dark:text-cyan-400" />
          <span className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
            raven<span className="text-cyan-400">AI</span>
          </span>
        </button>

        {/* Nav links */}
        <div className="flex items-center gap-1">
          {navItems.map(({ path, label, requiresTopic }) => {
            const isActive = location.pathname === path
            const isDisabled = requiresTopic && !currentTopic
            return (
              <button
                key={path}
                onClick={() => !isDisabled && navigate(path)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer border-none
                  ${isActive ? 'bg-cyan-400/20 text-cyan-400' : 'hover:bg-white/10'}
                  ${isDisabled ? 'opacity-40 cursor-not-allowed' : ''}
                `}
                style={{ color: isActive ? undefined : 'var(--text-muted)' }}
                disabled={isDisabled}
              >
                {label}
              </button>
            )
          })}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {streak > 0 && (
            <div className="glass px-3 py-1 flex items-center gap-1 text-sm" style={{ borderRadius: '9999px' }}>
              <span className={streak >= 3 ? 'animate-streak-fire' : ''}>🔥</span>
              <span style={{ color: 'var(--text-primary)' }}>{streak}</span>
            </div>
          )}

          <div className="glass px-3 py-1 flex items-center gap-2 text-sm" style={{ borderRadius: '9999px' }}>
            <span className="text-cyan-400 font-bold">Lvl {level}</span>
            <div className="w-16 h-1.5 rounded-full bg-white/20 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-500"
                style={{ width: `${xpToNext}%` }}
              />
            </div>
            <span style={{ color: 'var(--text-muted)' }}>{xpToNext}/100</span>
          </div>

          {/* Dark mode toggle */}
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

          {/* User menu */}
          <button
            onClick={handleSignOut}
            className="glass px-3 py-1.5 text-xs font-medium cursor-pointer transition-all duration-200 hover:scale-105"
            style={{ borderRadius: '9999px', color: 'var(--text-muted)' }}
            title={user?.email}
          >
            Salir
          </button>
        </div>
      </div>
    </nav>
  )
}
