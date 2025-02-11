import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface PrivateRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export function PrivateRoute({ children, requireAdmin = false }: PrivateRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    // Pode adicionar um componente de loading aqui
    return <div>Carregando...</div>;
  }

  if (!isAuthenticated) {
    // Redireciona para o login salvando a rota que o usuário tentou acessar
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && user?.role !== 'ADMIN') {
    // Se a rota requer admin e o usuário não é admin, redireciona para a página inicial
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
