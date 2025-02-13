import axios from 'axios'

export const api = axios.create({
  baseURL: 'http://localhost:3333'
})

// Lista de rotas públicas que não precisam de token
const publicRoutes = ['/auth/login', '/auth/employee']

// Adicionar token em todas as requisições, exceto rotas públicas
api.interceptors.request.use(config => {
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

// Tratar erros de autenticação
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Se o token expirou, remover dados do usuário
      localStorage.removeItem('@sistema-ponto:token')
      localStorage.removeItem('@sistema-ponto:user')
      window.location.href = '/sign-in'
    }
    return Promise.reject(error)
  }
)
