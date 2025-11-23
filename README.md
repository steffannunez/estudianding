# StudyVerse

Plataforma de aprendizaje interactivo para desarrolladores enfocada en arquitectura de software, cloud computing y mejores prácticas de desarrollo.

## Descripción

StudyVerse es una aplicación web educativa que ofrece tres modos de estudio para dominar conceptos técnicos avanzados:

- **Modo Estudio**: Lectura detallada de conceptos con resaltado de palabras clave
- **Tarjetas (Flashcards)**: Práctica con tarjetas interactivas con efecto flip
- **Quiz**: Preguntas de opción múltiple con sistema de puntuación

## Temas Disponibles

| Tema               | Conceptos | Preguntas | Nivel      |
| ------------------ | --------- | --------- | ---------- |
| **Microservicios** | 15        | 12        | Avanzado   |
| **Serverless AWS** | 15        | 15        | Avanzado   |
| **AWS Cloud**      | 5         | 4         | Intermedio |
| **Kubernetes**     | 7         | 6         | Intermedio |
| **TypeScript**     | 5         | 4         | Intermedio |
| **NestJS**         | 7         | 6         | Intermedio |
| **GraphQL**        | 6         | 5         | Intermedio |
| **SOLID**          | 5         | 5         | Intermedio |
| **CI/CD**          | 6         | 5         | Intermedio |
| **Clean Code**     | 6         | 5         | Intermedio |

### Contenido Destacado

**Microservicios (Nivel Avanzado)**

- Saga Pattern (Choreography vs Orchestration)
- CQRS y Event Sourcing
- Service Mesh (Istio, Envoy)
- Distributed Tracing (OpenTelemetry)
- Strangler Fig Pattern
- Bulkhead y Circuit Breaker
- Observability (SLIs, SLOs, SLAs)

**Serverless AWS (Nivel Avanzado)**

- AWS Lambda: cold starts, Provisioned Concurrency, Layers
- API Gateway: REST vs HTTP APIs
- Step Functions: orquestación de workflows
- EventBridge: arquitecturas event-driven
- DynamoDB: single-table design, Streams, DAX
- Seguridad: IAM, Secrets Manager, OWASP Serverless
- IaC: AWS SAM, CDK, Serverless Framework

## Tecnologías

- **Frontend**: React 19
- **Language**: TypeScript 5
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS 3
- **State Management**: React Context API + useReducer
- **Linting**: ESLint 9

## Requisitos

- Node.js 22+ (LTS)
- pnpm 10+

El proyecto incluye `.nvmrc` para usuarios de [nvm](https://github.com/nvm-sh/nvm) que define automáticamente la versión LTS de Node.js.

## Instalación

```bash
# Clonar repositorio
git clone <repository-url>
cd gleipnir

# Si usas nvm, activa la versión correcta de Node
nvm use

# Instalar dependencias
pnpm install
```

## Comandos

### Desarrollo

```bash
pnpm dev
```

Inicia el servidor de desarrollo en `http://localhost:5173`

### Build de Producción

```bash
pnpm build
```

Genera los archivos optimizados en la carpeta `dist/`

### Preview de Producción

```bash
pnpm preview
```

Previsualiza el build de producción localmente

### Linting

```bash
pnpm lint
```

Ejecuta ESLint para verificar calidad del código

## Estructura del Proyecto

```
src/
├── components/          # Componentes React
│   ├── Home.tsx         # Selector de temas y modos
│   ├── ModoEstudio.tsx  # Lectura de conceptos
│   ├── Tarjetas.tsx     # Flashcards interactivas
│   ├── Preguntas.tsx    # Quiz de evaluación
│   └── ErrorBoundary.tsx
├── context/
│   └── StudyContext.tsx # Estado global de la app
├── data/
│   └── knowledge.json   # Base de conocimientos
├── types/
│   └── index.ts         # Tipos TypeScript
├── App.tsx              # Router principal
├── main.tsx             # Entry point
└── index.css            # Estilos Tailwind
```

## Características

- Sistema de progreso por tema
- Puntuación gamificada
- Tarjetas con efecto flip 3D
- Resaltado automático de keywords
- Diseño responsive
- Paleta de colores personalizada

## Agregar Nuevo Contenido

1. Editar `src/data/knowledge.json`:

```json
{
  "nuevo_tema": {
    "conceptos": [
      {
        "titulo": "Concepto 1",
        "texto": "Descripción detallada..."
      }
    ],
    "preguntas": [
      {
        "pregunta": "¿Pregunta?",
        "opciones": ["A", "B", "C", "D"],
        "respuesta": 0
      }
    ]
  }
}
```

2. Agregar display name en `src/components/Home.tsx`:

```typescript
const names: TopicNames = {
  // ...existentes
  nuevo_tema: "Nombre Display",
};
```

3. Agregar summary en `src/components/ModoEstudio.tsx`:

```typescript
const summaries: TopicSummaries = {
  // ...existentes
  nuevo_tema: {
    title: "Nombre Display",
    description: "Descripción del tema...",
    icon: "📚",
  },
};
```

## Licencia

MIT
