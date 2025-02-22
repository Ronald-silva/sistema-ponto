import express from 'express'
import cors from 'cors'
import { authRoutes } from './routes/auth.routes'
import { projectsRoutes } from './routes/projects.routes'
import { timeRecordRoutes } from './routes/timeRecord.routes'

const app = express()

// Configuração do CORS
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://192.168.1.72:5173',
    'http://192.168.1.72:5174',
    'https://sistema-ponto.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use(express.json())

// Middleware para log de requisições detalhado
app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.log('Nova requisição:')
  console.log(`Método: ${req.method}`)
  console.log(`URL: ${req.url}`)
  console.log('Headers:', req.headers)
  console.log('Body:', req.body)
  console.log('Origin:', req.headers.origin)
  next()
})

// Rotas
app.use('/auth', authRoutes)
app.use('/projects', projectsRoutes)
app.use('/time-records', timeRecordRoutes)

// Middleware de erro com mais detalhes
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Erro na requisição:')
  console.error('URL:', req.url)
  console.error('Método:', req.method)
  console.error('Headers:', req.headers)
  console.error('Erro:', err)
  console.error('Stack:', err.stack)
  res.status(500).json({ error: 'Erro interno do servidor' })
})

export { app }
