import { useStudy } from '../context/StudyContext'

interface TopicSummary {
  title: string
  description: string
  icon: string
}

type TopicSummaries = Record<string, TopicSummary>

export default function ModoEstudio() {
  const { state, setMode } = useStudy()
  const { currentTopic, knowledgeBase } = state

  if (!currentTopic) {
    return <div>No hay tema seleccionado</div>
  }

  const topicData = knowledgeBase[currentTopic]
  const conceptos = topicData?.conceptos || []

  const getTopicSummary = (topic: string): TopicSummary => {
    const summaries: TopicSummaries = {
      microservicios: {
        title: 'Microservicios',
        description: 'Arquitectura de software que estructura una aplicación como una colección de servicios pequeños, independientes y desplegables de forma autónoma. Cada servicio se centra en una capacidad de negocio específica y se comunica mediante APIs ligeras.',
        icon: '🔧'
      },
      aws: {
        title: 'AWS Cloud',
        description: 'Amazon Web Services es la plataforma de servicios en la nube más completa del mundo. Ofrece más de 200 servicios incluyendo computación, almacenamiento, bases de datos, análisis, machine learning y más, permitiendo construir aplicaciones escalables y resilientes.',
        icon: '☁️'
      },
      typescript: {
        title: 'TypeScript',
        description: 'Lenguaje de programación fuertemente tipado que se construye sobre JavaScript. Añade sintaxis adicional para un mejor soporte de herramientas, detección de errores en tiempo de compilación y mejor documentación del código.',
        icon: '📘'
      },
      kubernetes: {
        title: 'Kubernetes',
        description: 'Sistema de orquestación de contenedores de código abierto que automatiza el despliegue, escalado y gestión de aplicaciones contenedorizadas. Agrupa contenedores en unidades lógicas para facilitar su gestión y descubrimiento.',
        icon: '⚓'
      },
      nestjs: {
        title: 'NestJS',
        description: 'Framework progresivo de Node.js para construir aplicaciones del lado del servidor eficientes y escalables. Combina elementos de OOP, FP y FRP, utilizando TypeScript por defecto y arquitectura modular inspirada en Angular.',
        icon: '🐱'
      },
      solid: {
        title: 'Principios SOLID',
        description: 'Cinco principios de diseño orientado a objetos que promueven código mantenible, extensible y robusto: Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation y Dependency Inversion.',
        icon: '🎯'
      },
      graphql: {
        title: 'GraphQL',
        description: 'Lenguaje de consulta para APIs y runtime para ejecutar esas consultas. Permite a los clientes solicitar exactamente los datos que necesitan, facilitando la evolución de APIs y proporcionando herramientas poderosas para desarrolladores.',
        icon: '📊'
      },
      cicd: {
        title: 'CI/CD',
        description: 'Integración Continua y Despliegue Continuo son prácticas de desarrollo que automatizan la integración de cambios de código, ejecución de pruebas y despliegue a producción, reduciendo errores y acelerando el ciclo de entrega.',
        icon: '🔄'
      },
      cleancode: {
        title: 'Clean Code',
        description: 'Conjunto de principios y prácticas para escribir código legible, mantenible y de alta calidad. Enfatiza nombres significativos, funciones pequeñas, comentarios útiles y estructura clara para facilitar la comprensión y modificación del código.',
        icon: '✨'
      },
      serverless: {
        title: 'Serverless AWS',
        description: 'Arquitectura donde AWS gestiona la infraestructura dinámicamente. Incluye Lambda (FaaS), API Gateway, Step Functions, EventBridge, DynamoDB y más. Modelo pay-per-execution con escalado automático, ideal para aplicaciones event-driven y microservicios sin gestión de servidores.',
        icon: '⚡'
      }
    }
    return summaries[topic] || { title: topic, description: 'Tema de estudio', icon: '📚' }
  }

  const topicSummary = getTopicSummary(currentTopic)

  const highlightKeywords = (text: string): string => {
    const keywords = ['arquitectura', 'microservicios', 'API', 'servicio', 'patrón', 'escalabilidad', 'TypeScript', 'AWS', 'Lambda', 'DynamoDB', 'S3', 'Kubernetes']
    let highlightedText = text
    keywords.forEach(keyword => {
      const regex = new RegExp(`(\b${keyword}\b)`, 'gi')
      highlightedText = highlightedText.replace(regex, '<mark class="bg-accent/50 px-1 rounded">$1</mark>')
    })
    return highlightedText
  }

  return (
    <div className="min-h-screen bg-neutral p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Modo Estudio</h1>
          <button onClick={() => setMode('home')} className="btn-coral">
            Volver al inicio
          </button>
        </div>

        <div className="card bg-primary/20 mb-8">
          <div className="flex items-start gap-4">
            <div className="text-4xl">{topicSummary.icon}</div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{topicSummary.title}</h2>
              <p className="text-gray-700 leading-relaxed">{topicSummary.description}</p>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mb-4 text-gray-700">Conceptos Clave</h3>

        <div className="space-y-6">
          {conceptos.map((concepto, index) => (
            <div key={index} className="card card-hover">
              <div className="flex items-start gap-4">
                <div className="bg-primary text-gray-800 w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-3 text-gray-800">
                    {concepto.titulo}
                  </h3>
                  <p
                    className="text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: highlightKeywords(concepto.texto) }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">
            Has revisado {conceptos.length} conceptos
          </p>
          <div className="flex justify-center gap-4">
            <button onClick={() => setMode('cards')} className="btn-secondary">
              Practicar con Tarjetas
            </button>
            <button onClick={() => setMode('quiz')} className="btn-accent">
              Hacer Quiz
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
