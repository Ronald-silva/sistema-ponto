import {
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  AccessTime as AccessTimeIcon,
} from '@mui/icons-material';
import { ReactNode } from 'react';

interface MenuItem {
  path: string;
  icon: ReactNode;
  label: string;
  roles: string[];
}

export const menuItems: MenuItem[] = [
  {
    path: '/',
    icon: <DashboardIcon />,
    label: 'Dashboard',
    roles: ['ADMIN', 'FUNCIONARIO']
  },
  {
    path: '/usuarios',
    icon: <PersonIcon />,
    label: 'Usuários',
    roles: ['ADMIN']
  },
  {
    path: '/obras',
    icon: <BusinessIcon />,
    label: 'Obras',
    roles: ['ADMIN']
  },
  {
    path: '/horas-extras',
    icon: <AccessTimeIcon />,
    label: 'Horas Extras',
    roles: ['ADMIN', 'FUNCIONARIO']
  }
]; 