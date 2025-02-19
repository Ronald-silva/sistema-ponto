import axios from 'axios'

// Determina a baseURL com base no ambiente
const getBaseUrl = () => {
  if (window.location.hostname === 'localhost' || /^192\.168\.\d{1,3}\.\d{1,3}$/.test(window.location.hostname)) {
    return 'http://localhost:3333'
  }
  // Para produção, use a URL do seu backend em produção
  return 'https://seu-backend.com' // Ajuste para sua URL de produção
}

export const api = axios.create({
  baseURL: getBaseUrl(),
  timeout: 10000, // 10 segundos
  headers: {
    'Content-Type': 'application/json'
  }
})

// Lista de rotas públicas que não precisam de token
const publicRoutes = ['/auth/login', '/auth/employee', '/projects/active']

// Adicionar token em todas as requisições, exceto rotas públicas
api.interceptors.request.use(
  config => {
    console.log('Fazendo requisição para:', config.url)
    
    const isPublicRoute = publicRoutes.some(route => config.url?.includes(route))
    
    if (!isPublicRoute) {
      const token = localStorage.getItem('@sistema-ponto:token')
      if (token) {
        config.headers = config.headers || {}
        config.headers.Authorization = `Bearer ${token}`
      }
    }

    return config
  },
  error => {
    console.error('Erro na requisição:', error)
    return Promise.reject(error)
  }
)

// Tratar erros de autenticação e rede
api.interceptors.response.use(
  response => {
    console.log('Resposta recebida:', response.status)
    return response
  },
  error => {
    console.error('Erro na resposta:', {
      message: error.message,
      code: error.code,
      response: error.response
    })

    // Se for erro de rede
    if (error.code === 'ERR_NETWORK') {
      return Promise.reject(new Error('Erro de conexão. Verifique sua internet e tente novamente.'))
    }

    // Se for erro de timeout
    if (error.code === 'ECONNABORTED') {
      return Promise.reject(new Error('O servidor demorou para responder. Tente novamente.'))
    }

    // Se for erro de autenticação
    if (error.response?.status === 401) {
      localStorage.removeItem('@sistema-ponto:token')
      localStorage.removeItem('@sistema-ponto:user')
      window.location.href = '/sign-in'
    }

    return Promise.reject(error)
  }
)
