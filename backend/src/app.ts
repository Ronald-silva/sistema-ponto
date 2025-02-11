import express from 'express'
import cors from 'cors'
import { authRoutes } from './routes/auth.routes'
import { projectsRoutes } from './routes/projects.routes'

const app = express()

// Configuração do CORS
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use(express.json())

// Middleware para log de requisições
app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.log(`${req.method} ${req.url}`)
  console.log('Body:', req.body)
  next()
})

// Rotas
app.use('/auth', authRoutes)
app.use('/projects', projectsRoutes)

// Middleware de erro
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Erro:', err)
  console.error('Stack:', err.stack)
  res.status(500).json({ error: 'Erro interno do servidor' })
})

export { app }
