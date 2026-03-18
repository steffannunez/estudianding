import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './components/Home'
import ModoEstudio from './components/ModoEstudio'
import Tarjetas from './components/Tarjetas'
import Preguntas from './components/Preguntas'
import ErrorBoundary from './components/ErrorBoundary'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'

const ConceptMapPage = lazy(() => import('./pages/ConceptMapPage'))
const ResearchPage = lazy(() => import('./pages/ResearchPage'))
const LandingPage = lazy(() => import('./pages/LandingPage'))

function AppRoutes() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-heavy p-8 text-center animate-fade-in">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full border-4 border-cyan-400 border-t-transparent animate-spin" />
          <p style={{ color: 'var(--text-muted)' }}>Cargando...</p>
        </div>
      </div>
    }>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Protected app routes */}
        <Route path="/app" element={
          <ProtectedRoute>
            <Layout><Home /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/app/study" element={
          <ProtectedRoute>
            <Layout><ModoEstudio /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/app/cards" element={
          <ProtectedRoute>
            <Layout><Tarjetas /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/app/quiz" element={
          <ProtectedRoute>
            <Layout><Preguntas /></Layout>
          </ProtectedRoute>
        } />

        {/* Research */}
        <Route path="/app/research" element={
          <ProtectedRoute>
            <Layout><ResearchPage /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/app/map" element={
          <ProtectedRoute>
            <Layout><ConceptMapPage /></Layout>
          </ProtectedRoute>
        } />

        {/* Landing page */}
        <Route path="/" element={<LandingPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}

function App() {
  return (
    <ErrorBoundary>
      <AppRoutes />
    </ErrorBoundary>
  )
}

export default App
