import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface Usuario {
  nome: string;
  cpf: string;
  obra_atual: string;
}

interface AuthContextData {
  usuario: Usuario | null;
  token: string | null;
  login: (usuario: Usuario, token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Recupera dados do localStorage ao iniciar
  useEffect(() => {
    const storedUser = localStorage.getItem('@App:user');
    const storedToken = localStorage.getItem('@App:token');

    if (storedUser && storedToken) {
      setUsuario(JSON.parse(storedUser));
      setToken(storedToken);
    }
  }, []);

  const login = (usuario: Usuario, token: string) => {
    localStorage.setItem('@App:user', JSON.stringify(usuario));
    localStorage.setItem('@App:token', token);
    setUsuario(usuario);
    setToken(token);
  };

  const logout = () => {
    localStorage.removeItem('@App:user');
    localStorage.removeItem('@App:token');
    setUsuario(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider 
      value={{ 
        usuario, 
        token,
        login, 
        logout,
        isAuthenticated: !!usuario
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext); 