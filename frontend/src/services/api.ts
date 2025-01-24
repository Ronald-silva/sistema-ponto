import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Interceptor para adicionar token em todas as requisições
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('@HorasExtras:token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    console.error('Erro na requisição:', error);
    return Promise.reject(error);
  }
);

// Interceptor para tratar erros de resposta
api.interceptors.response.use(
  response => response,
  error => {
    console.error('Erro na resposta:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      // Limpa o localStorage em caso de erro de autenticação
      localStorage.removeItem('@HorasExtras:token');
      localStorage.removeItem('@HorasExtras:user');
      
      // Redireciona para a página de login
      window.location.href = '/';
    }
    
    return Promise.reject(error);
  }
); 