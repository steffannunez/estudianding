import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-heavy p-8 text-center animate-fade-in">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full border-4 border-cyan-400 border-t-transparent animate-spin" />
          <p style={{ color: 'var(--text-muted)' }}>Cargando...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}
