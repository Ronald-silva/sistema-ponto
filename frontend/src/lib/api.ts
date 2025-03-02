import axios from 'axios'

// Função para determinar a baseURL apropriada
function getBaseUrl() {
  // Se estiver em produção, use a URL de produção
  if (process.env.NODE_ENV === 'production') {
    return 'https://sistema-ponto-backend.onrender.com'
  }

  // Para desenvolvimento, use localhost
  return 'http://localhost:3333'
}

export const api = axios.create({
  baseURL: getBaseUrl()
})

// Adicionar token em todas as requisições
api.interceptors.request.use(config => {
  const token = localStorage.getItem('@sistema-ponto:token')
  
  if (token) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${token}`
  }

  config.headers = config.headers || {}
  config.headers['Content-Type'] = 'application/json'
  
  return config
})

// Tratar erros de autenticação e conexão
api.interceptors.response.use(
  response => {
    return response
  },
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('@sistema-ponto:token')
      localStorage.removeItem('@sistema-ponto:user')
      window.location.href = '/sign-in'
    }
    return Promise.reject(error)
  }
)
