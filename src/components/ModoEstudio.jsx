import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStudy } from '../context/StudyContext'

const topicSummaries = {
  microservicios: { title: 'Microservicios', description: 'Arquitectura que estructura una aplicacion como servicios pequenos, independientes y desplegables de forma autonoma.', icon: '🔧' },
  aws: { title: 'AWS Cloud', description: 'Plataforma de servicios en la nube mas completa del mundo con mas de 200 servicios.', icon: '☁️' },
  typescript: { title: 'TypeScript', description: 'Lenguaje fuertemente tipado construido sobre JavaScript con deteccion de errores en compilacion.', icon: '📘' },
  kubernetes: { title: 'Kubernetes', description: 'Sistema de orquestacion de contenedores que automatiza despliegue, escalado y gestion.', icon: '⚓' },
  nestjs: { title: 'NestJS', description: 'Framework progresivo de Node.js para aplicaciones del lado del servidor eficientes y escalables.', icon: '🐱' },
  solid: { title: 'Principios SOLID', description: 'Cinco principios de diseno orientado a objetos para codigo mantenible y extensible.', icon: '🎯' },
  graphql: { title: 'GraphQL', description: 'Lenguaje de consulta para APIs que permite solicitar exactamente los datos necesarios.', icon: '📊' },
  cicd: { title: 'CI/CD', description: 'Practicas que automatizan integracion de cambios, pruebas y despliegue a produccion.', icon: '🔄' },
  cleancode: { title: 'Clean Code', description: 'Principios y practicas para escribir codigo legible, mantenible y de alta calidad.', icon: '✨' },
  serverless: { title: 'Serverless AWS', description: 'Arquitectura donde AWS gestiona la infraestructura. Lambda, API Gateway, DynamoDB y mas.', icon: '⚡' },
}

export default function ModoEstudio() {
  const navigate = useNavigate()
  const { state, updateStreak } = useStudy()
  const { currentTopic, knowledgeBase } = state

  useEffect(() => {
    updateStreak()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  if (!currentTopic) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="glass-heavy p-8 text-center">
          <p style={{ color: 'var(--text-muted)' }}>No hay tema seleccionado</p>
          <button onClick={() => navigate('/app')} className="btn-primary-glass mt-4">Volver</button>
        </div>
      </div>
    )
  }

  const topicData = knowledgeBase[currentTopic]
  const conceptos = topicData?.conceptos || []
  const summary = topicSummaries[currentTopic] || { title: currentTopic, description: 'Tema de estudio', icon: '📚' }

  const highlightKeywords = (text) => {
    const keywords = ['arquitectura', 'microservicios', 'API', 'servicio', 'patron', 'escalabilidad', 'TypeScript', 'AWS', 'Lambda', 'DynamoDB', 'S3', 'Kubernetes']
    let result = text
    keywords.forEach(keyword => {
      const regex = new RegExp(`(\\b${keyword}\\b)`, 'gi')
      result = result.replace(regex, '<mark style="background: rgba(34,211,238,0.15); color: #22d3ee; padding: 0 4px; border-radius: 4px;">$1</mark>')
    })
    return result
  }

  return (
    <div className="px-4 md:px-8 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Modo Estudio
          </h1>
          <button onClick={() => navigate('/app')} className="btn-glass text-sm">
            Volver al inicio
          </button>
        </div>

        {/* Topic summary */}
        <div className="glass-heavy p-6 mb-8 animate-fade-in">
          <div className="flex items-start gap-4">
            <div className="text-4xl">{summary.icon}</div>
            <div>
              <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{summary.title}</h2>
              <p className="leading-relaxed" style={{ color: 'var(--text-muted)' }}>{summary.description}</p>
            </div>
          </div>
        </div>

        {/* Concepts */}
        <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-secondary)' }}>
          Conceptos Clave
        </h3>

        <div className="space-y-4">
          {conceptos.map((concepto, index) => (
            <div key={index} className="glass glass-hover p-5 animate-slide-up" style={{ animationDelay: `${index * 0.05}s` }}>
              <div className="flex items-start gap-4">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0 text-white text-sm"
                  style={{ background: 'linear-gradient(135deg, #1e3a5f, #2f74c0)' }}
                >
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                    {concepto.titulo}
                  </h3>
                  <p
                    className="leading-relaxed text-sm"
                    style={{ color: 'var(--text-muted)' }}
                    dangerouslySetInnerHTML={{ __html: highlightKeywords(concepto.texto) }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTAs */}
        <div className="mt-10 text-center">
          <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
            Has revisado {conceptos.length} conceptos
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <button onClick={() => navigate('/app/cards')} className="btn-accent-glass">
              Practicar con Tarjetas
            </button>
            <button onClick={() => navigate('/app/quiz')} className="btn-primary-glass">
              Hacer Quiz
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
