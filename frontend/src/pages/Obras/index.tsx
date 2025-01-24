import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  IconButton,
  Chip,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { api } from '../../services/api';

interface Obra {
  id: number;
  nome: string;
  endereco: string;
  ativa: boolean;
  _count: {
    usuarios_atuais: number;
    registros_ponto: number;
    horas_extras: number;
  };
}

export function Obras() {
  const navigate = useNavigate();
  const [obras, setObras] = useState<Obra[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function loadObras() {
    try {
      const response = await api.get('/obras');
      setObras(response.data);
    } catch (err) {
      setError('Erro ao carregar obras');
    }
  }

  async function handleDelete(id: number) {
    try {
      await api.delete(`/obras/${id}`);
      setSuccess('Obra excluída com sucesso');
      loadObras();
    } catch (err) {
      setError('Erro ao excluir obra');
    }
  }

  useEffect(() => {
    loadObras();
  }, []);

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1">
          Obras
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => navigate('/obras/novo')}
        >
          Nova Obra
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Endereço</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Usuários Ativos</TableCell>
              <TableCell>Registros de Ponto</TableCell>
              <TableCell>Horas Extras</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {obras.map((obra) => (
              <TableRow key={obra.id}>
                <TableCell>{obra.nome}</TableCell>
                <TableCell>{obra.endereco}</TableCell>
                <TableCell>
                  <Chip
                    label={obra.ativa ? 'Ativa' : 'Inativa'}
                    color={obra.ativa ? 'success' : 'error'}
                    size="small"
                  />
                </TableCell>
                <TableCell>{obra._count.usuarios_atuais}</TableCell>
                <TableCell>{obra._count.registros_ponto}</TableCell>
                <TableCell>{obra._count.horas_extras}</TableCell>
                <TableCell align="right">
                  <IconButton
                    color="primary"
                    onClick={() => navigate(`/obras/${obra.id}/editar`)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(obra.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
} 