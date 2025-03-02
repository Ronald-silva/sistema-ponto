import { config } from 'dotenv'
import { resolve } from 'path'

// Carrega o arquivo .env
const envPath = resolve(__dirname, '../../.env')
console.log('Carregando .env de:', envPath)

config({
  path: envPath
})

console.log('Variáveis carregadas:', {
  JWT_SECRET: process.env.JWT_SECRET,
  DATABASE_URL: process.env.DATABASE_URL?.substring(0, 20) + '...',
  PORT: process.env.PORT
})

// Validação das variáveis de ambiente
const requiredEnvVars = ['JWT_SECRET', 'DATABASE_URL']

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`)
  }
}

export const env = {
  JWT_SECRET: process.env.JWT_SECRET as string,
  DATABASE_URL: process.env.DATABASE_URL as string,
  PORT: process.env.PORT || 3333
} 