import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Login } from '../pages/Login';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { RegistroPonto } from '../pages/RegistroPonto';
import { Usuarios } from '../pages/Usuarios';
import { FormUsuario } from '../pages/Usuarios/FormUsuario';
import { DashboardAdmin } from '../pages/DashboardAdmin';
import { useAuth } from '../contexts/AuthContext';
import { GerenciamentoObras } from '../pages/GerenciamentoObras';
import { VinculacaoObras } from '../pages/VinculacaoObras';
import { RelatoriosObras } from '../pages/RelatoriosObras';
import { CadastroFoto } from '../pages/CadastroFoto';
import { HorasExtras } from '../pages/HorasExtras';

interface PrivateRouteProps {
  children: React.ReactNode;
}

function PrivateRoute({ children }: PrivateRouteProps) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
}

function AdminRoute({ children }: PrivateRouteProps) {
  const { user } = useAuth();

  if (!user || user.cargo !== 'ADMIN') {
    return <Navigate to="/dashboard" />;
  }

  return <>{children}</>;
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <DashboardLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<RegistroPonto />} />
        <Route
          path="admin"
          element={
            <AdminRoute>
              <DashboardAdmin />
            </AdminRoute>
          }
        />
        <Route
          path="usuarios"
          element={
            <AdminRoute>
              <Usuarios />
            </AdminRoute>
          }
        />
        <Route
          path="usuarios/novo"
          element={
            <AdminRoute>
              <FormUsuario />
            </AdminRoute>
          }
        />
        <Route
          path="usuarios/:id/editar"
          element={
            <AdminRoute>
              <FormUsuario />
            </AdminRoute>
          }
        />
        <Route
          path="obras"
          element={
            <AdminRoute>
              <GerenciamentoObras />
            </AdminRoute>
          }
        />
        <Route
          path="obras/vinculacao"
          element={
            <AdminRoute>
              <VinculacaoObras />
            </AdminRoute>
          }
        />
        <Route
          path="obras/relatorios"
          element={
            <AdminRoute>
              <RelatoriosObras />
            </AdminRoute>
          }
        />
        <Route path="cadastro-foto" element={<CadastroFoto />} />
        <Route path="horas-extras" element={<PrivateRoute><HorasExtras /></PrivateRoute>} />
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
} 