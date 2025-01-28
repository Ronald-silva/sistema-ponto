import express from 'express'
import cors from 'cors'
import { routes } from './routes'
import { LimpezaService } from './services/LimpezaService'
import { verificarLimpezaMiddleware } from './middlewares/registroMiddleware'

const app = express()

app.use(cors())
app.use(express.json({ limit: '10mb' })) // Aumenta o limite para receber fotos
app.use('/api', routes)

// Inicia o serviço de limpeza automática
const limpezaService = new LimpezaService()
limpezaService.agendarLimpeza()

// Usa o middleware nas rotas de registro
app.use('/api/registros', verificarLimpezaMiddleware)

export { app } 