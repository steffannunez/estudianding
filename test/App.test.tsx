import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from '../src/App'
import { StudyProvider } from '../src/context/StudyContext'

describe('App', () => {
  it('should render without crashing', () => {
    render(
      <StudyProvider>
        <App />
      </StudyProvider>
    )
    
    // Verificar que el componente se renderiza
    expect(screen.getByText('StudyVerse')).toBeInTheDocument()
  })

  it('should render Home component by default', () => {
    render(
      <StudyProvider>
        <App />
      </StudyProvider>
    )
    
    // Verificar que muestra el título principal de Home
    expect(screen.getByText('Tu espacio de aprendizaje interactivo')).toBeInTheDocument()
  })

  it('should render within ErrorBoundary', () => {
    const { container } = render(
      <StudyProvider>
        <App />
      </StudyProvider>
    )
    
    // Verificar que el contenedor tiene la clase font-sans del App
    expect(container.querySelector('.font-sans')).toBeInTheDocument()
  })
})
