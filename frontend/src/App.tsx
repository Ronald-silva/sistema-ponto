import { Routes, Route, Navigate } from 'react-router-dom';
import { SignIn } from './pages/SignIn';
import { Dashboard } from './pages/Dashboard';
import { Employees } from './pages/Employees';
import { Projects } from './pages/Projects';
import { TimeRecord } from './pages/employee/TimeRecord';
import { TimeEntry } from './pages/TimeEntry';
import { PrivateRoute, PublicRoute } from './components/RouteGuards';
import './styles/global.css';

export default function App() {
  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route path="/sign-in" element={<SignIn />} />
      </Route>

      <Route element={<PrivateRoute />}>
        {/* Rotas de Administrador */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/employees" element={<Employees />} />
        <Route path="/projects" element={<Projects />} />
        
        {/* Rotas de Funcionário */}
        <Route path="/time-record" element={<TimeRecord />} />
        <Route path="/time-entry" element={<TimeEntry />} />
      </Route>

      <Route
        path="*"
        element={<Navigate to="/sign-in" replace />}
      />
    </Routes>
  );
}
