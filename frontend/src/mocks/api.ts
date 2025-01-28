import { MOCK_DATA } from './data'

const API_URL = 'http://localhost:3333/api'

// Login para funcionários
export const mockLogin = async (cpf: string, obra: string) => {
  // Simula delay da API
  await new Promise(resolve => setTimeout(resolve, 500))

  const usuario = MOCK_DATA.usuarios.find(u => 
    u.cpf === cpf && u.perfil === 'FUNCIONARIO'
  )
  
  if (!usuario) {
    throw new Error('Usuário não encontrado')
  }

  if (usuario.obra !== obra) {
    throw new Error('Obra não corresponde')
  }

  return {
    usuario,
    token: 'mock-token'
  }
}

// Login específico para admin
export const mockLoginAdmin = async (cpf: string) => {
  await new Promise(resolve => setTimeout(resolve, 500))

  const usuario = MOCK_DATA.usuarios.find(u => 
    u.cpf === cpf && u.perfil === 'ADMIN'
  )
  
  if (!usuario) {
    throw new Error('Credenciais inválidas')
  }

  return {
    usuario,
    token: 'mock-token-admin'
  }
} 