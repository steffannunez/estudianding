import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import RavenLogo from '../components/RavenLogo'

export default function SignupPage() {
  const { signUp, signInWithGoogle } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Las contrasenas no coinciden')
      return
    }
    if (password.length < 6) {
      setError('La contrasena debe tener al menos 6 caracteres')
      return
    }

    setLoading(true)
    try {
      await signUp(email, password)
      setSuccess(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    try {
      await signInWithGoogle()
    } catch (err) {
      setError(err.message)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="glass-heavy p-8 max-w-md text-center animate-scale-in">
          <div className="text-5xl mb-4">📧</div>
          <h2 className="text-2xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
            Revisa tu email
          </h2>
          <p className="mb-6" style={{ color: 'var(--text-muted)' }}>
            Hemos enviado un enlace de confirmacion a <strong className="text-cyan-400">{email}</strong>
          </p>
          <Link to="/login" className="btn-primary-glass inline-block">
            Ir a iniciar sesion
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md animate-scale-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 no-underline">
            <RavenLogo size={48} className="text-raven-600 dark:text-cyan-400" />
            <span className="text-3xl font-extrabold" style={{ color: 'var(--text-primary)' }}>
              raven<span className="text-cyan-400">AI</span>
            </span>
          </Link>
          <p className="mt-2 text-sm" style={{ color: 'var(--text-muted)' }}>
            Crea tu cuenta gratuita
          </p>
        </div>

        {/* Form */}
        <div className="glass-heavy p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl outline-none transition-all duration-200 focus:ring-2 focus:ring-cyan-400"
                style={{
                  background: 'var(--glass-bg)',
                  border: '1px solid var(--glass-border)',
                  color: 'var(--text-primary)',
                }}
                placeholder="tu@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                Contrasena
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl outline-none transition-all duration-200 focus:ring-2 focus:ring-cyan-400"
                style={{
                  background: 'var(--glass-bg)',
                  border: '1px solid var(--glass-border)',
                  color: 'var(--text-primary)',
                }}
                placeholder="Minimo 6 caracteres"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                Confirmar contrasena
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl outline-none transition-all duration-200 focus:ring-2 focus:ring-cyan-400"
                style={{
                  background: 'var(--glass-bg)',
                  border: '1px solid var(--glass-border)',
                  color: 'var(--text-primary)',
                }}
                placeholder="Repite tu contrasena"
              />
            </div>

            {error && (
              <div className="p-3 rounded-xl text-sm text-red-400 animate-fade-in"
                style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary-glass w-full py-3.5 text-center disabled:opacity-50"
            >
              {loading ? 'Creando cuenta...' : 'Crear cuenta'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px" style={{ background: 'var(--glass-border)' }} />
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>o</span>
            <div className="flex-1 h-px" style={{ background: 'var(--glass-border)' }} />
          </div>

          {/* Google */}
          <button onClick={handleGoogle} className="btn-glass w-full flex items-center justify-center gap-3">
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continuar con Google
          </button>

          {/* Login link */}
          <p className="text-center mt-6 text-sm" style={{ color: 'var(--text-muted)' }}>
            Ya tienes cuenta?{' '}
            <Link to="/login" className="text-cyan-400 hover:underline font-medium">
              Inicia sesion
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
