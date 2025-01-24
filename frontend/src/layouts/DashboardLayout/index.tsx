import React from 'react';
import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton, useTheme, ListItemButton } from '@mui/material';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import {
  AccessTime as AccessTimeIcon,
  People as PeopleIcon,
  ExitToApp as ExitToAppIcon,
  Dashboard as DashboardIcon,
  Business as BusinessIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { Header } from '../../components/Header';

export function DashboardLayout() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { signOut, user } = useAuth();

  const handleSignOut = () => {
    signOut();
    navigate('/');
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Drawer
        variant="permanent"
        sx={{
          width: 240,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 240,
            boxSizing: 'border-box',
            bgcolor: theme.palette.primary.main,
            color: 'white',
          },
        }}
      >
        <List sx={{ mt: 8 }}>
          {user?.cargo === 'ADMIN' && (
            <ListItem disablePadding>
              <ListItemButton onClick={() => navigate('/dashboard/admin')}>
                <ListItemIcon sx={{ color: 'white' }}>
                  <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary="Dashboard" />
              </ListItemButton>
            </ListItem>
          )}

          <ListItem disablePadding>
            <ListItemButton onClick={() => navigate('/dashboard')}>
              <ListItemIcon sx={{ color: 'white' }}>
                <AccessTimeIcon />
              </ListItemIcon>
              <ListItemText primary="Registro de Ponto" />
            </ListItemButton>
          </ListItem>

          {user?.cargo === 'ADMIN' && (
            <ListItem disablePadding>
              <ListItemButton onClick={() => navigate('/dashboard/usuarios')}>
                <ListItemIcon sx={{ color: 'white' }}>
                  <PeopleIcon />
                </ListItemIcon>
                <ListItemText primary="Usuários" />
              </ListItemButton>
            </ListItem>
          )}

          {user?.cargo === 'ADMIN' && (
            <>
              <ListItem disablePadding>
                <ListItemButton onClick={() => navigate('/dashboard/obras')}>
                  <ListItemIcon sx={{ color: 'white' }}>
                    <BusinessIcon />
                  </ListItemIcon>
                  <ListItemText primary="Gerenciar Obras" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton onClick={() => navigate('/dashboard/obras/vinculacao')}>
                  <ListItemIcon sx={{ color: 'white' }}>
                    <PeopleIcon />
                  </ListItemIcon>
                  <ListItemText primary="Vincular Funcionários" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton onClick={() => navigate('/dashboard/obras/relatorios')}>
                  <ListItemIcon sx={{ color: 'white' }}>
                    <AssessmentIcon />
                  </ListItemIcon>
                  <ListItemText primary="Relatórios por Obra" />
                </ListItemButton>
              </ListItem>
            </>
          )}

          <ListItem disablePadding>
            <ListItemButton onClick={handleSignOut}>
              <ListItemIcon sx={{ color: 'white' }}>
                <ExitToAppIcon />
              </ListItemIcon>
              <ListItemText primary="Sair" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>

      <Box sx={{ flexGrow: 1 }}>
        <Header />
        <Box sx={{ p: 3 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
} 