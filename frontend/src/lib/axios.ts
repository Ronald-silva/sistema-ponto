import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
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
      localStorage.removeItem('@sistema-ponto:user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)
