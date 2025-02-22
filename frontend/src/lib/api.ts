import axios from 'axios'

// Função para determinar a baseURL apropriada
function getBaseUrl() {
  // Se estiver em produção, use a URL de produção
  if (process.env.NODE_ENV === 'production') {
    return 'https://sistema-ponto-backend.onrender.com'
  }

  // Para desenvolvimento, tente usar o IP da máquina local
  // que será acessível por outros dispositivos na mesma rede
  return 'http://192.168.1.72:3333'
}

export const api = axios.create({
  baseURL: getBaseUrl()
})

// Lista de rotas públicas que não precisam de token
const publicRoutes = ['/auth/login', '/auth/employee', '/projects/active']

// Log da baseURL para debug
console.log('API Base URL:', api.defaults.baseURL)

// Adicionar token em todas as requisições, exceto rotas públicas
api.interceptors.request.use(config => {
  console.log('Fazendo requisição para:', config.url)
  
  const isPublicRoute = publicRoutes.some(route => config.url?.includes(route))
  
  if (!isPublicRoute) {
    const token = localStorage.getItem('@sistema-ponto:token')
    if (token) {
      config.headers = config.headers || {}
      config.headers.Authorization = `Bearer ${token}`
    }
  }

  config.headers = config.headers || {}
  config.headers['Content-Type'] = 'application/json'
  
  return config
})

// Tratar erros de autenticação e conexão
api.interceptors.response.use(
  response => {
    console.log('Resposta recebida:', response.status)
    return response
  },
  error => {
    console.error('Erro na requisição:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.message
    })

    if (error.response?.status === 401) {
      localStorage.removeItem('@sistema-ponto:token')
      localStorage.removeItem('@sistema-ponto:user')
      window.location.href = '/sign-in'
    }
    return Promise.reject(error)
  }
)
