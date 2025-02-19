import axios from 'axios'

// Determina a baseURL com base no ambiente
const getBaseUrl = () => {
  console.log('Ambiente:', {
    hostname: window.location.hostname,
    protocol: window.location.protocol,
    isMobile: /Android|iPhone|iPad/i.test(navigator.userAgent)
  })

  // Se estiver em produção (Vercel)
  if (window.location.hostname.includes('vercel.app')) {
    return 'https://seu-backend.com' // Ajuste para sua URL de produção
  }

  // Se estiver em localhost ou IP local
  if (window.location.hostname === 'localhost' || /^192\.168\.\d{1,3}\.\d{1,3}$/.test(window.location.hostname)) {
    // Se estiver em HTTPS, use HTTPS também para o backend
    const protocol = window.location.protocol === 'https:' ? 'https:' : 'http:'
    return `${protocol}//localhost:3333`
  }

  // Fallback para localhost
  return 'http://localhost:3333'
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
    const fullUrl = `${config.baseURL}${config.url}`
    console.log('Detalhes da requisição:', {
      url: fullUrl,
      method: config.method,
      headers: config.headers,
      isMobile: /Android|iPhone|iPad/i.test(navigator.userAgent)
    })
    
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
    console.error('Erro na requisição:', {
      message: error.message,
      code: error.code,
      stack: error.stack
    })
    return Promise.reject(error)
  }
)

// Tratar erros de autenticação e rede
api.interceptors.response.use(
  response => {
    console.log('Resposta recebida:', {
      status: response.status,
      url: response.config.url,
      data: response.data,
      isMobile: /Android|iPhone|iPad/i.test(navigator.userAgent)
    })
    return response
  },
  error => {
    console.error('Erro na resposta:', {
      message: error.message,
      code: error.code,
      response: error.response?.data,
      status: error.response?.status,
      headers: error.response?.headers,
      request: {
        url: error.config?.url,
        method: error.config?.method,
        baseURL: error.config?.baseURL
      }
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
