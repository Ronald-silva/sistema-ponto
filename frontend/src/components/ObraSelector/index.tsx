import React, { useState, useEffect } from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Alert,
  CircularProgress
} from '@mui/material';
import { api } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

interface Obra {
  id: number;
  nome: string;
  ativa: boolean;
}

interface ObraSelectorProps {
  onObraSelect: (obraId: number) => void;
}

export function ObraSelector({ onObraSelect }: ObraSelectorProps) {
  const { user } = useAuth();
  const [obras, setObras] = useState<Obra[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadObras() {
      try {
        setLoading(true);
        setError('');
        const response = await api.get<Obra[]>('/obras');
        const obrasAtivas = response.data.filter(obra => obra.ativa);
        setObras(obrasAtivas);
      } catch (error) {
        console.error('Erro ao carregar obras:', error);
        setError('Erro ao carregar obras disponíveis');
      } finally {
        setLoading(false);
      }
    }

    loadObras();
  }, []);

  const handleChange = (event: any) => {
    const obraId = event.target.value as number;
    onObraSelect(obraId);
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box sx={{ minWidth: 200 }}>
      <FormControl fullWidth>
        <InputLabel>Obra Atual</InputLabel>
        <Select
          value={user?.obra_atual_id || ''}
          label="Obra Atual"
          onChange={handleChange}
        >
          {obras.map((obra) => (
            <MenuItem key={obra.id} value={obra.id}>
              {obra.nome}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
} 