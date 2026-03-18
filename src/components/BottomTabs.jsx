import { useNavigate, useLocation } from 'react-router-dom'
import { useStudy } from '../context/StudyContext'

const tabs = [
  {
    path: '/app',
    label: 'Inicio',
    requiresTopic: false,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    path: '/app/research',
    label: 'Investigar',
    requiresTopic: false,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
  },
  {
    path: '/app/cards',
    label: 'Tarjetas',
    requiresTopic: true,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="16" height="14" rx="2" />
        <path d="M6 3h12a2 2 0 0 1 2 2v2H4V5a2 2 0 0 1 2-2z" />
      </svg>
    ),
  },
  {
    path: '/app/quiz',
    label: 'Quiz',
    requiresTopic: true,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
  },
  {
    path: '/app/map',
    label: 'Mapa',
    requiresTopic: false,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <circle cx="5" cy="6" r="2" /><circle cx="19" cy="6" r="2" />
        <circle cx="5" cy="18" r="2" /><circle cx="19" cy="18" r="2" />
        <line x1="12" y1="9" x2="12" y2="6" />
        <line x1="9.5" y1="13.5" x2="6.5" y2="16.5" />
        <line x1="14.5" y1="13.5" x2="17.5" y2="16.5" />
      </svg>
    ),
  },
]

export default function BottomTabs() {
  const navigate = useNavigate()
  const location = useLocation()
  const { state } = useStudy()
  const { currentTopic } = state

  return (
    <nav className="bottom-tab-bar fixed bottom-0 w-full z-50 md:hidden">
      <div className="flex justify-around items-center h-16 px-1">
        {tabs.map(({ path, label, icon, requiresTopic }) => {
          const isActive = location.pathname === path
          const isDisabled = requiresTopic && !currentTopic

          return (
            <button
              key={path}
              onClick={() => !isDisabled && navigate(path)}
              disabled={isDisabled}
              className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg transition-all duration-200 border-none bg-transparent cursor-pointer
                ${isDisabled ? 'opacity-30 cursor-not-allowed' : ''}
              `}
              style={{ color: isActive ? '#22d3ee' : 'var(--text-muted)' }}
            >
              {icon}
              <span className="text-[9px] font-medium">{label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
