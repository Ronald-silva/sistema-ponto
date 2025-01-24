import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { api } from '../services/api';

interface User {
  id: number;
  nome: string;
  email: string;
  cpf: string;
  cargo: string;
  obra_atual_id?: number;
  valor_hora: number;
  ativo: boolean;
}

interface AuthContextData {
  user: User | null;
  signIn: (credentials: SignInCredentials) => Promise<void>;
  signOut: () => void;
  isAuthenticated: boolean;
}

interface AuthProviderProps {
  children: ReactNode;
}

interface SignInCredentials {
  cpf: string;
  senha: string;
  obra_id?: number;
}

interface SignInResponse {
  token: string;
  user: User;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const storedUser = localStorage.getItem('@HorasExtras:user');
      const storedToken = localStorage.getItem('@HorasExtras:token');

      if (storedUser && storedToken) {
        api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        return JSON.parse(storedUser);
      }

      return null;
    } catch (error) {
      console.error('Erro ao recuperar dados do usuário:', error);
      return null;
    }
  });

  const isAuthenticated = !!user;

  const signIn = async ({ cpf, senha, obra_id }: SignInCredentials) => {
    try {
      console.log('Iniciando login com CPF:', cpf);
      
      // Validação adicional
      if (!cpf || !senha) {
        throw new Error('CPF e senha são obrigatórios');
      }

      const response = await api.post<SignInResponse>('/sessions', {
        cpf,
        senha,
        obra_id
      });

      console.log('Resposta do servidor:', response.data);

      const { token, user: userData } = response.data;

      if (!token || !userData) {
        throw new Error('Resposta inválida do servidor');
      }

      // Verifica se o usuário está ativo
      if (!userData.ativo) {
        throw new Error('Usuário inativo. Entre em contato com o administrador.');
      }

      // Se não for admin, precisa selecionar uma obra
      if (userData.cargo !== 'ADMIN' && !obra_id) {
        throw new Error('Selecione uma obra para continuar');
      }

      localStorage.setItem('@HorasExtras:token', token);
      localStorage.setItem('@HorasExtras:user', JSON.stringify(userData));

      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      setUser(userData);
    } catch (error: any) {
      console.error('Erro detalhado no login:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      // Limpa os dados em caso de erro
      localStorage.removeItem('@HorasExtras:token');
      localStorage.removeItem('@HorasExtras:user');
      delete api.defaults.headers.common['Authorization'];
      
      // Tratamento de erros específicos
      if (error.response?.status === 401) {
        throw new Error('CPF ou senha inválidos');
      }
      
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      
      throw error;
    }
  };

  const signOut = () => {
    localStorage.removeItem('@HorasExtras:token');
    localStorage.removeItem('@HorasExtras:user');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
  };

  // Verifica a validade do token periodicamente
  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem('@HorasExtras:token');
      
      if (token && user) {
        try {
          await api.get('/usuarios/me');
        } catch (error) {
          console.error('Erro ao validar token:', error);
          signOut();
        }
      }
    };

    const interval = setInterval(validateToken, 5 * 60 * 1000); // Verifica a cada 5 minutos

    return () => clearInterval(interval);
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
} 