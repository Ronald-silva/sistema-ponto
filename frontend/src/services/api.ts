import axios from 'axios'

// Determina a baseURL com base no ambiente
const baseURL = import.meta.env.PROD 
  ? 'https://sua-api-producao.com' // Substitua pela URL real de produção
  : 'http://localhost:3333'

export const api = axios.create({
  baseURL,
  // Adiciona timeout para evitar requisições penduradas
  timeout: 10000,
  // Permite enviar cookies
  withCredentials: true
})

// Interceptor para log de erros
api.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data
    })
    return Promise.reject(error)
  }
) 