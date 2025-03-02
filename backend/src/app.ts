import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { authRoutes } from './routes/auth.routes'
import { projectRoutes } from './routes/project.routes'
import { timeRecordRoutes } from './routes/timeRecord.routes'
import { userRoutes } from './routes/user.routes'

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
  const timestamp = new Date().toISOString();
  console.log('\n=== Nova requisição ===');
  console.log(`Timestamp: ${timestamp}`);
  console.log(`Método: ${req.method}`);
  console.log(`URL: ${req.path}`);
  console.log(`URL Completa: ${req.protocol}://${req.get('host')}${req.originalUrl}`);
  console.log('Headers:', {
    ...req.headers,
    authorization: req.headers.authorization ? '[REDACTED]' : undefined
  });
  console.log('Body:', req.body);
  console.log('Query:', req.query);
  console.log('Params:', req.params);
  if (req.headers.origin) {
    console.log('Origin:', req.headers.origin);
  }
  console.log('===================\n');
  next();
})

// Rotas
app.use('/auth', authRoutes)
app.use('/users', userRoutes)
app.use('/projects', projectRoutes)
app.use('/time-records', timeRecordRoutes)

// Middleware de erro com mais detalhes
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Erro na requisição:')
  console.error('URL:', req.path)
  console.error('Método:', req.method)
  console.error('Headers:', req.headers)
  console.error('Erro:', err)
  console.error('Stack:', err.stack)
  res.status(500).json({ error: 'Erro interno do servidor' })
})

export { app }
