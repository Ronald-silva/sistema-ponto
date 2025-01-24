import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function Header() {
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      p: 2,
      bgcolor: 'primary.main',
      color: 'white'
    }}>
      <Typography variant="h6">
        Olá, {user?.nome}
      </Typography>
      <Typography variant="h6">
        {format(currentTime, "dd 'de' MMMM 'de' yyyy 'às' HH:mm:ss", { locale: ptBR })}
      </Typography>
    </Box>
  );
} 