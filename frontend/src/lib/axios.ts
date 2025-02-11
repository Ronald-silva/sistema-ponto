import axios from 'axios'

export const api = axios.create({
  baseURL: 'http://localhost:3333'
})

api.interceptors.request.use(config => {
  const user = localStorage.getItem('@sistema-ponto:user')
  
  if (user) {
    const { id } = JSON.parse(user)
    config.headers.Authorization = `Bearer ${id}`
  }

  return config
}, error => {
  return Promise.reject(error)
})

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Limpar dados do usuário
      localStorage.removeItem('@sistema-ponto:user')
      // Redirecionar para login
      window.location.href = '/sign-in'
    }
    return Promise.reject(error)
  }
)
