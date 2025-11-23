import { useStudy } from './context/StudyContext'
import Home from './components/Home'
import ModoEstudio from './components/ModoEstudio'
import Tarjetas from './components/Tarjetas'
import Preguntas from './components/Preguntas'
import ErrorBoundary from './components/ErrorBoundary'

function App() {
  const { state } = useStudy()
  const { currentMode } = state

  const renderCurrentMode = () => {
    switch (currentMode) {
      case 'study':
        return <ModoEstudio />
      case 'cards':
        return <Tarjetas />
      case 'quiz':
        return <Preguntas />
      case 'home':
      default:
        return <Home />
    }
  }

  return (
    <ErrorBoundary>
      <div className="font-sans">{renderCurrentMode()}</div>
    </ErrorBoundary>
  )
}

export default App
