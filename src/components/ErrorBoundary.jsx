import { Component } from 'react'
import RavenLogo from './RavenLogo'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorCount: 0 }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  handleRetry = () => {
    this.setState(prev => ({
      hasError: false,
      error: null,
      errorCount: prev.errorCount + 1,
    }))
  }

  render() {
    if (this.state.hasError) {
      const isChunkError = this.state.error?.message?.includes('Loading chunk') ||
        this.state.error?.message?.includes('dynamically imported module')

      return (
        <div className="min-h-screen flex items-center justify-center p-8">
          <div className="glass-heavy p-10 text-center max-w-md animate-scale-in">
            <RavenLogo size={48} className="mx-auto mb-4 text-raven-600 dark:text-cyan-400 opacity-50" />
            <h2 className="text-2xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
              {isChunkError ? 'Nueva version disponible' : 'Algo salio mal'}
            </h2>
            <p className="mb-6 text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              {isChunkError
                ? 'Se ha actualizado la aplicacion. Recarga la pagina para obtener la ultima version.'
                : this.state.error?.message || 'Ha ocurrido un error inesperado.'
              }
            </p>
            <div className="flex gap-3 justify-center">
              {this.state.errorCount < 2 && !isChunkError && (
                <button onClick={this.handleRetry} className="btn-glass">
                  Reintentar
                </button>
              )}
              <button onClick={() => window.location.reload()} className="btn-primary-glass">
                Recargar pagina
              </button>
            </div>
            {this.state.errorCount > 0 && (
              <p className="mt-4 text-xs" style={{ color: 'var(--text-muted)' }}>
                Si el problema persiste, intenta borrar la cache del navegador.
              </p>
            )}
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
