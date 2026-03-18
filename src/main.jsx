import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext'
import { StudyProvider } from './context/StudyContext'
import { ResearchProvider } from './context/ResearchContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <StudyProvider>
          <ResearchProvider>
            <App />
          </ResearchProvider>
        </StudyProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
